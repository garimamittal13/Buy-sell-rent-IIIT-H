import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
// implement google recaptcha
import ReCAPTCHA from "react-google-recaptcha";
const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [recaptchaToken, setRecaptchaToken] = useState(null);
	const recaptchaRef = useRef(null);

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};
	const handleRecaptchaChange = (token) => {
		setRecaptchaToken(token);
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!recaptchaToken) {
			setError("Please complete the reCAPTCHA.");
			return;
		}
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, {
                email: data.email,
                password: data.password,
                recaptchaToken // Send this to backend
            });
			console.log(res);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				console.log(error);
				setError(error.response.data.message);
			}
		}
		finally
		{
			recaptchaRef.current.reset();
			setRecaptchaToken(null);
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						<ReCAPTCHA
							sitekey="6LdOfMoqAAAAABjeTwkZSrQaBMd5h2EFkX2juPvq"
							onChange={handleRecaptchaChange}
							ref={recaptchaRef}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button className={styles.green_btn}>
							SIGN IN
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h3>New Here ?</h3>
					<Link to="/signup">
						<button className={styles.white_btn}>
							SIGN UP
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;