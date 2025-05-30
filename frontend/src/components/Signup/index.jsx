import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
        age:"",
        Contact_Number:"",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        if (!data.email.endsWith("iiit.ac.in")) {
            setError("Email must be from iiit.ac.in domain");
            return;
          }

		try {
			const url = "http://localhost:8080/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome</h1>
					<h1> Back ! </h1>
					<Link to="/login">
						<button className={styles.white_btn}>
							SIGN IN
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="First Name"
							name="firstName"
							onChange={handleChange}
							value={data.firstName}
							required
							className={styles.createaccount}
							
						/>
						<input
							type="text"
							placeholder="Last Name"
							name="lastName"
							onChange={handleChange}
							value={data.lastName}
							required
							className={styles.createaccount}
						/>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.createaccount}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.createaccount}
						/>
                        <input
                            type="number"
                            placeholder="Age"
                            name="age"
                            onChange={handleChange}
                            value={data.age}
                            required
                            className={styles.createaccount}
                        />
                        <input
                            type="number"
                            placeholder="Contact Number"
                            name="Contact_Number"
                            onChange={handleChange}
                            value={data.Contact_Number}
                            required
                            className={styles.createaccount}
                        />
                        
						{error && <div className={styles.error_msg}>{error}</div>}
						<button className={styles.green_btn}>
							SIGN UP
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;