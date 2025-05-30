const router = require("express").Router();
const { User, validateEmailDomain } = require("../models/user");
const axios = require("axios");

const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const recapchaToken=req.body.recaptchaToken;
		if(!recapchaToken){
			return res.status(400).send({ message: "Recaptcha Token is required" });
		}
		const isRecaptchValid = await verifyRecaptcha(recapchaToken);
		if(!isRecaptchValid){
			return res.status(400).send({ message: "Invalid Recaptcha Token" });
		}
		if(!validateEmailDomain(req.body.email)){
			return res.status(400).send({ message: "Invalid Email Domain" });}
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
		{
			console.log("Invalid Email or Password");
			return res.status(401).send({ message: "Invalid Email or Password" });
		}
		console.log(req.body.password);
		console.log(user.password);
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
		{
			console.log("Invalid Password");
			return res.status(401).send({ message: "Invalid Email or Password" });
		}

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});
const verifyRecaptcha = async (recaptchaToken) => {
	console.log(recaptchaToken);
    const secretKey = "6LdOfMoqAAAAACtG6XSb5Dmrdm_baqv-GQIj_yn1"; // Replace with your reCAPTCHA secret key
    const url = "https://www.google.com/recaptcha/api/siteverify";

    try {
        const response = await axios.post(url, null, {
            params: {
                secret: secretKey,
                response: recaptchaToken,
            },
        });

        console.log("reCAPTCHA verification response:", response.data);
        return response.data.success; // Returns true if reCAPTCHA is valid
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        return false;
    }
};

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
        recaptchaToken: Joi.string().required().label("reCAPTCHA Token") // Add this line
    });
    return schema.validate(data);
};

module.exports = router;
