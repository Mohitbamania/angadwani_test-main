const sequelize = require("sequelize");
const Op = sequelize.Op;
const {
    users,
    users_role,
    users_login_history
} = require("../models");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const axios = require("axios");
// const CryptoJS = require("crypto-js");
var browser = require("browser-detect");
const constant = require("../utils/constant");
class userController {

    // User Login
    async user_login(req, res) {
        try {
            if (!req.body.email || !req.body.password) {
                return res.json({
                    status: "failure",
                    msg: "Please provide Login Credentials!",
                });
            }
            let { email } = req.body;
            let verify = 0;
            const user_exist = await users.findOne({ where: { email, status: true } });
            if (user_exist) {
                let password = req.body.password;
                const is_match = await bcrypt.compare(
                    password,
                    user_exist.password
                );
                if (is_match) {
                    verify = 1;
                } else {
                    return res.json({
                        status: "failure",
                        msg: "Invalid Email or Password!",
                    });
                }

                if (verify == 1) {
                    const token = await constant.generate_token("email", email);
                    const ip_dt = constant.get_ip_device(req.headers, req.socket);

                    const update_data = await users.update(
                        { token, ip: ip_dt.ip, device: ip_dt.device, browser: ip_dt.device_browser },
                        {
                            where: {
                                email,
                            },
                        }
                    );
                    await users_login_history.create({
                        ip: ip_dt.ip,
                        device: ip_dt.device,
                        browser: ip_dt.device_browser,
                        users_id: user_exist.users_id,
                    });
                    if (update_data[0]) {
                        return res.json({
                            status: "success",
                            token: token,
                        });
                    } else {
                        return res.json({
                            status: "failure",
                            msg: "Something went wrong!",
                        });
                    }
                }
            } else {
                return res.json({
                    status: "failure",
                    msg: "We're sorry. We weren't able to identify you given the information provided!",
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "failure",
                msg: "Please Try Again!",
            });
        }
    }

    // Add User
    async add_user(req, res) {
        try {
            const users_id = req.user.users_id;
            if (!req.body) {
                return res.json({
                    status: "failure",
                    msg: "Invalid Data!",
                });
            }
            if (!req.body.password || req.body.password == "") {
                return res.json({
                    status: "failure",
                    msg: "Invalid Password!",
                });
            }
            if (!req.body.email || req.body.email == "") {
                return res.json({
                    status: "failure",
                    msg: "Invalid Email ID!",
                });
            }
            let { number, name, email, password, users_role_id } = req.body;
            const isvalid_email_number = constant.verifyEmailAndNumber(email, number)
            if (!isvalid_email_number) {
                return res.json({
                    status: "failure",
                    msg: "Invalid Email or Number!",
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const is_exists = await users.findOne({
                where: {
                    [Op.or]: {
                        number: req.body.number,
                        email: req.body.email,
                    },
                },
            });
            if (is_exists) {
                return res.json({
                    status: "failure",
                    msg: "User already exist with the same number or email!",
                });
            }
            const user_role = await users_role.findOne({
                where: {
                    users_role_id: {
                        [Op.iLike]: "%" + users_role_id + "%",
                    },
                },
            });
            if (user_role) {
                const newUser = await users.create({
                    name,
                    email,
                    password: hashedPassword,
                    number,
                    status: true,
                    initial_added_by: users_id,
                    added_by: users_id,
                    users_role_id: users_role_id,
                    initial_users_role_id: users_role_id,
                });

                const credentials = {
                    email,
                    password
                }
                if (newUser) {
                    return res.json({
                        status: "success",
                        msg: "User registered Successfully!",
                        credentials
                    });
                } else {
                    return res.json({
                        status: "failure",
                        msg: "server error!",
                    });
                }
            } else {
                return res.json({
                    status: "failure",
                    msg: "Invalid Role!",
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "failure",
                msg: e.message,
            });
        }
    }

    // Get All Users
    async get_users(req, res) {
        try {
            let condition = {};
            condition = {
                [Op.not]: {
                    users_id: req.user.users_id,
                }
            };

            if (req.query.status) {
                condition.status = req.query.status;
            }
            if (req.query.users_role_id) {
                if (req.roles.includes(req.query.users_role_id)) {
                    condition.users_role_id = req.query.users_role_id;
                } else {
                    return res.json({
                        status: "failure",
                        msg: "Access Denied: Kindly seek authorization from your immediate superior to obtain permission.",
                    });
                }
            } else {
                condition.users_role_id = { [Op.in]: req.roles };
            }

            let pgnum = req.params.number;
            let per_page = 20;
            if (req.query.show && req.query.show < 100) {
                per_page = req.query.show;
            } else if (req.query.show && req.query.show > 100) {
                per_page = 100;
            }
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }

            const data = await users.findAndCountAll({
                offset: pgnum,
                limit: per_page,
                where: condition,
                attributes: [
                    "users_id",
                    "name",
                    "email",
                    "users_role_id",
                    "status",
                ],
                raw: true,
            });
            let total_items = data.count;
            if (data.rows.length != 0) {
                return res.json({
                    status: "success",
                    total_items,
                    per_page,
                    data: data.rows,
                });
            } else {
                return res.json({
                    status: "failure",
                    msg: "Users Not Found!",
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "failure",
                msg: e.message,
            });
        }
    }

    // Get Add Users Roles
    async get_adduser_roles(req, res) {
        try {
            let role = req.user.users_role_id;
            if (role == "Employee") {
                return res.json({
                    status: "failure",
                    msg: "Don't Have Add User Access!",
                });
            } else {
                const dt = await users_role.findAll();
                console.log(
                    dt.map((item) => {
                        return item.users_role_id;
                    })
                );
                return res.json({
                    status: "success",
                    data: dt.map((item) => item.users_role_id),
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "failure",
                msg: e.message,
            });
        }
    }

    // Add User Roles
    async add_user_roles(req, res) {
        try {
            await users_role.destroy({ where: {} })
            const roles = ["Admin", "Employee"]
            for (let i = 0; i < roles.length; i++) {
                await users_role.create({ users_role_id: roles[i] })
            }
            const data = await users_role.findAll({})
            if (data) {
                return res.json({
                    status: "success",
                    data: data,
                });
            } else {
                return res.json({
                    status: "failure",
                    msg: "No Data Found!",
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }

}

module.exports = new userController();
