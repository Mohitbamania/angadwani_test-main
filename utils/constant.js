var browser = require("browser-detect");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const Op = sequelize.Op;


exports.verifyEmailAndNumber = (email, number) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^[0-9]{10}$/;
    let email_status = false;
    let number_status = false;
    if (emailPattern.test(email)) {
        email_status = true;
    }
    if (phonePattern.test(number)) {
        number_status = true;
    }
    if (email_status == true && number_status == true) {
        return true;
    } else {
        return false;
    }
}


exports.get_ip_device = (headers, socket) => {
    let ip = headers["x-forwarded-for"] || socket.remoteAddress;
    let device = headers["user-agent"];
    let rs = browser(headers["user-agent"]);
    console.log("rs", rs);
    if (Object.keys(rs).length === 0) {
        var device_browser = "";
    } else {
        if (rs.hasOwnProperty("name")) {
            var device_browser = rs.name;
        } else {
            var device_browser = JSON.stringify(rs);
        }
    }
    let data = {
        ip,
        device,
        device_browser
    };

    console.log(data)
    return data;
}

exports.generate_token = async (name, value) => {
    const tokenPayload = { [name]: value };
    const token = await jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET_TOKEN_SIGNATURE
    );
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
    // console.log('Decoded Token:', decoded);
    return token;
} 


