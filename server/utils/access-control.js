const jwt = require('jsonwebtoken');
const authController = require("../controller/auth-controller");
const error_function = require("../utils/response-handler").error_function;
const control_data = require("./control-data.json");
const users = require('../db/models/users');
const user_types = require('../db/models/user_types');
exports.accessControl = async function (access_types, req, res, next) {
    try {
        if (access_types == "*") {
            next();
        } else {
            const authHeader = req.headers["authorization"];
            const token = authHeader ? authHeader.split(" ")[1] : null;
            if (
                token == null ||
                token == "null" ||
                token == "" ||
                token == "undefined"
            ) {
                let response = error_function({
                    status : 401,
                    message : "Invalid access token",
                });
                res.status(401).send(response);
            } else {
                jwt.verify(
                    token,
                    process.env.PRIVATE_KEY,
                    async function (err,decoded) {
                        if (err) {
                            let response = error_function({
                                status : 401,
                                message: err.message
                            });
                            res.status(401).send(response);
                        } else {
                            let allowed = access_types
                            .split(",")
                            .map((obj) => control_data[obj]);

                            let user_type_id = (await users.findOne({_id: decoded.user_id})).user_type;
                            let user_type = (await user_types.findOne({_id: user_type_id})).user_type;

                            if (allowed && allowed.includes(user_type)) {
                               next();
                            } else {
                                let response = error_function({
                                    status : 403,
                                    message : "Not allowed to access the route"
                                });
                                res.status(403).send(response);
                            }
                        }
                    }
                );
            }
        }
    } catch (error) {
        let response = error_function(error);
        res.status(400).send(response);
    }
};