const jwt = require("jsonwebtoken");
const {
    users
} = require("../models");


const user_auth = async (req, res, next) => {
    try {
        // token authentication code
        const token = req.headers.token;
        if (token) {
            let data = await users.findOne({
                where: { token: token, status: true },
                raw: true,
            });
            if (data) {
                req.user = data;
                next();
            } else {
                return res.json({
                    code: 401,
                    status: "failure",
                    data: "Invalid Token!",
                });
            }
        } else {
            return res.json({
                code: 401,
                status: "failure",
                data: "Invalid Token!",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            code: 401,
            status: "failure",
            msg: "Token Error",
        });
    }
};

const manage_user_auth = async (req, res, next) => {
    try {
        // token authentication code
        const token = req.headers.token;
        if (token) {
            let data = await users.findOne({
                where: { token: token, status: true },
                raw: true,
            });
            if (data) {
                var role = data.users_role_id;
                if (role == "Employee") {
                    return res.json({
                        status: "failure",
                        msg: "Access Denied: Kindly seek authorization from your immediate superior to obtain permission.",
                    });
                } else {
                    req.user = data;
                    req.roles = ["Employee", "Admin"];
                    next();
                }
            } else {
                return res.json({
                    code: 401,
                    status: "failure",
                    data: "Please Login Again!!",
                });
            }
        } else {
            return res.json({
                code: 401,
                status: "failure",
                data: "Invalid Token!!",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            code: 401,
            status: "failure",
            msg: "Token Error",
        });
    }
};

module.exports = {
    user_auth,
    manage_user_auth
};
