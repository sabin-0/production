let success_function = require('../utils/response-handler').success_function;
let error_function = require('../utils/response-handler').error_function;
let users = require('../db/models/users');
let user_types = require('../db/models/user_types');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let dotenv = require('dotenv');
const sendEmail = require("../utils/send-email").sendEmail;
const resetPassword = require("../utils/email-templates/resetPassword").resetPassword;
dotenv.config();

exports.login = async function (req,res) {
    try{
        let email = req.body.email;
        console.log("email : ", email);

        let password = req.body.password;
        console.log("password : ", password);

        if(!email) {
            let response = error_function({
            statusCode : 400,
            message : "email is required"  
            });
            res.status(response.statusCode).send(response);
            return;
        }

        if(!password) {
            let response = error_function({
                statusCode : 400,
                message : "password is required"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        let user = await users.findOne({email}).populate('user_type');
        console.log("user : ", user);
        

        if(user) {

            let isAdmin = false;
            if (user.user_type && user.user_type.user_type === 'admin') {
                isAdmin = true;
            }
            console.log("isAdmin : ",isAdmin);

            let db_password = user.password;
            console.log("db_password : ", db_password);
            bcrypt.compare(password, db_password, (err, auth) => {

                if (auth === true) {

                    let access_token = jwt.sign({user_id : user._id},process.env.PRIVATE_KEY,{expiresIn: "1d"});

                    let response = success_function({
                        statusCode : 200,
                        data : access_token,
                        isAdmin : isAdmin,
                        message : "Login successful"
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }else {
                    let response = error_function({
                        statusCode : 400,
                        message : "Invalid password"
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }
            });
        }else {
            let response = error_function({
                statusCode : 404,
                message : "user not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log("error : ", error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : error
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.forgotPasswordController = async function (req, res) {
    try {
      let email = req.body.email;
  
      if (email) {
        let user = await users.findOne({ email: email });
        if (user) {
          let reset_token = jwt.sign(
            { user_id: user._id },
            process.env.PRIVATE_KEY,
            { expiresIn: "10m" }
          );
          let data = await users.updateOne(
            { email: email },
            { $set: { password_token: reset_token } }
          );
          if (data.matchedCount === 1 && data.modifiedCount == 1) {
            let reset_link = `${process.env.FRONTEND_URL}/resetPassword?token=${reset_token}`;
            let email_template = await resetPassword(user.firstname, reset_link);
            sendEmail(email, "Forgot password", email_template);
            let response = success_function({
              statusCode: 200,
              message: "Email sent successfully",
            });
            res.status(response.statusCode).send(response);
            return;
          } else if (data.matchedCount === 0) {
            let response = error_function({
              statusCode: 404,
              message: "User not found",
            });
            res.status(response.statusCode).send(response);
            return;
          } else {
            let response = error_function({
              statusCode: 400,
              message: "Password reset failed",
            });
            res.status(response.statusCode).send(response);
            return;
          }
        } else {
          let response = error_function({ status: 403, message: "Forbidden" });
          res.status(response.statusCode).send(response);
          return;
        }
      } else {
        let response = error_function({
          statusCode: 422,
          message: "Email is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } catch (error) {
      if (process.env.NODE_ENV == "production") {
        let response = error_function({
          statusCode: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
  
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({ 
            statusCode: 400, 
            message: error });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  };

  exports.passwordResetController = async function (req, res) {
    try {
        const authHeaders = req.headers["authorization"];
        const token = authHeaders.split(" ")[1];

        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;

        if(password != confirmPassword) {
            let response = error_function({
                statusCode : 400,
                message : "Passwords do not match"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        decoded = jwt.decode(token);

        let user = await users.findOne({
            $and: [{_id: decoded.user_id}, {password_token: token}],
        });

        if (user) {

            let salt = bcrypt.genSaltSync(10);
            let password_hash = bcrypt.hashSync(password, salt);
            let data = await users.updateOne(
                {_id: decoded.user_id},
                {$set: {password: password_hash, password_token: null}}
            );
            if (data.matchedCount === 1 && data.modifiedCount == 1) {
                let response = success_function({
                    statusCode : 200,
                    message : "Password changed successfully"
                });
                res.status(response.statusCode).send(response);
                return;
            } else if (data.matchedCount === 0) {
                let response = error_function({
                    statusCode : 404,
                    message : "User not found"
                });
                res.status(response.statusCode).send(response);
                return;
            } else {
                let response = error_function({
                    statusCode : 400,
                    message : "Password reset failed"
                });
                res.status(response.statusCode).send(response);
                return;
            }

        } else {

            let response = error_function({
                statusCode : 403,
                message : "Forbidden"
            });
            res.status(response.statusCode).send(response);
            return;

        }

    } catch (error) {

        if (process.env.NODE_ENV == "production") {
            let response = error_function({
              status: 400,
              message: error
                ? error.message
                  ? error.message
                  : error
                : "Something went wrong",
            });
      
            res.status(response.statusCode).send(response);
            return;
          } else {
            let response = error_function({ status: 400, message: error });
            res.status(response.statusCode).send(response);
            return;
          }

    }

  };
