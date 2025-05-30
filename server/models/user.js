const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	age: { type: Number, required: true },
	Contact_Number: { type: Number, required: true },
	cart :[{type: mongoose.Schema.Types.ObjectId, ref: "Item"}],
	reviews:[{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],
});

// Generate Auth Token
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

// Email domain validation
const validateEmailDomain = (email) => {
	if (email.endsWith("iiit.ac.in")) {
		return true;
	}
	return false;
};

// Validation with Joi
const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string()
			.email()
			.required()
			.custom((value, helpers) => {
				if (!value.endsWith("iiit.ac.in")) {
					return helpers.message("Email must be from the iiit.ac.in domain");
				}
				return value;
			})
			.label("Email"),
		password: passwordComplexity().required().label("Password"),
		age: Joi.number().required().label("Age"),
		Contact_Number: Joi.number().min(1000000000).max(9999999999).required().label("Contact Number"),
	});
	return schema.validate(data);
};

module.exports = { User, validate, validateEmailDomain };
