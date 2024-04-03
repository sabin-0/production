const users = require('../db/models/users');
let bcrypt = require('bcryptjs');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const set_password_template = require("../utils/email-templates/set-password").resetPassword;
const sendEmail = require("../utils/send-email").sendEmail;
const mongoose = require('mongoose');


const generateRandomPassword = (length) => {
    const charset = "abcdefg#hi@jklmnopqrstuvwxyzA@BCDEF#GHIJKLMNOPQRSTUVWXYZ@012#3456789@#";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

//CREATE USER
exports.createUser = async function(req, res) {
    try {
        console.log("Reached user control");
        let token = req.headers['authorization'].split(' ')[1];


        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = generateRandomPassword(10);
        let phone = req.body.phone;
        let user_type = "65f28b1befa5fcf56cff2319";

        let userFound = await users.findOne({email});

        if(userFound) {
            let response = error_function({
                statusCode : 400,
                message : "user already exist"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        let salt = await bcrypt.genSalt(10);

        let hashed_password = bcrypt.hashSync(password, salt);

        let new_user = await users.create({
            firstname,
            lastname,
            email,
            password : hashed_password,
            phone,
            user_type
        });

        if(new_user) {

            console.log("Reached here");
            let emailContent = await set_password_template(firstname, email, password);
            // console.log("reached emailContent : ",emailContent);


            await sendEmail(email, "Set Your Password", emailContent);
            console.log("Reached sendEmail ");
            console.log("email : ",email);

            let response_datas = {
                _id : new_user.id,
                firstname : new_user.firstname,
                lastname : new_user.lastname,
                email : new_user.email,
                phone : new_user.phone,
                user_type : new_user.user_type
            }
            console.log("new_user : ",new_user);
            let response = success_function({
                statusCode : 201,
                data : response_datas,
                message : "User created successfully"
            })
            res.status(response.statusCode).send(response);
            return;
        } else {
            let response = error_function({
                statusCode : 400,
                message : "User creation failed"
            })
            res.status(response.statusCode).status(response);
            return;
        }

    }catch (error) {
        let response = error_function ({
            statusCode : 400,
            message : "Something went wrong"
        })
        res.status(response.statusCode).send(response);
        return;
    }
};


//FETCH ONE USER
exports.fetchOne = async function(req, res) {

    try{
        const authHeader = req.headers["authorization"];
        const token = authHeader ? authHeader.split(" ")[1] : null;

        let id = req.params.id;

        if (token && id) {
            let users_data = await users.findOne({_id : id});

            if(users_data) {
                let response = success_function({
                    statusCode : 200,
                    data : users_data,
                    message : "User retrieved successfully"
                });
                res.status(response.statusCode).send(response);
                return;
            } else {
                let response = error_function({
                    statusCode : 404,
                    message : "User details not found"
                });
                res.status(response.statusCode).send(response);
            }
        } else {
            if (!token) {
                let response = error_function({
                    statusCode : 400,
                    message : "Token is required"
                });
                res.status(response.statusCode).send(response);
                return;
            }

            if (!id) {
                let response = error_function({
                    statusCode : 400,
                    message : "Id is required"
                });
                res.status(response.statusCode).send(response);
                return;
            }

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


//FETCH ALL USERS
exports.getUserData = async function(req, res) {
    try {

        let allUSers = await users.find({});

        if(allUSers.length>0) {
            let response = success_function({
                statusCode : 200,
                data : allUSers,
                message : "All users retrieved successfully"
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            let response = error_function({
                statusCode: 404,
                message: "No users found",
            });

            res.status(response.statusCode).send(response);
        }

    }catch (error) {
        console.log("error : ", error);
        let response = error_function({
            statusCode : 400,
            message : "Internal server error"
        });
        res.status(response.statusCode).send(response);
        return;
    }
};


//edit user data

exports.editUserData = async function(req, res) {
    try {
        console.log("Reached user edit control");

        const userId = req.params.id || req.body.id;
        console.log("userId is: ",userId);

        // Extract updated user data from request body
        const updatedUserData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone
            // Add any other fields you want to allow users to update
        };
        console.log("updated user data : ",updatedUserData);

        // Check if user ID is provided
        if (!userId) {
            let response = error_function({
                statusCode : 400,
                message : "User ID is required"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        const user = await users.findById(userId);
        console.log("user is here at edit : ",user);
        

        // Check if user exists and was successfully updated
        if (!user) {
            let response = error_function({
                statusCode : 404,
                message : "User not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }


        user.firstname = updatedUserData.firstname || user.firstname;
        user.lastname = updatedUserData.lastname || user.lastname;
        user.email = updatedUserData.email || user.email;
        user.phone = updatedUserData.phone || user.phone;
        console.log("assigned values for update");

        await user.save();
        console.log("saved updated data");
       
        let response = success_function({
            statusCode : 200,
            data : user,
            message : "User data updated successfully"
        });
        res.status(response.statusCode).send(response);
        return;

    } catch (error) {
        // If an error occurs, send error response
        let response = error_function ({
            statusCode : 500,
            message : "Internal server error"
        });
        res.status(response.statusCode).send(response);
    }
};

//delete user

exports.deleteUserData = async function (req, res) {
    try {

        const userId = req.params.id;

        if(!userId) {

            let response = error_function({
                statusCode : 400,
                message : "User id is required"
            });
            res.status(response.statusCode).send(response);
            return;

        }

        const user = await users.findById(userId);

        if(!user) {
            let response = error_function({
                statusCode : 404,
                message : "User not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        await user.deleteOne({_id:userId});

        let response = success_function({
            statusCode : 200,
            message : "User deleted successfully"
        });
        res.status(response.statusCode).send(response);
        return;

    } catch(error) {

        let response = error_function ({
            statusCode : 500,
            message : "Internal server error"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}