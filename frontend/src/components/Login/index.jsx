import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { ReactComponent as EmailIcon } from '../assets/icons/envelope.svg';
import { ReactComponent as LockIcon } from '../assets/icons/lock.svg';
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
		finally {
			recaptchaRef.current.reset();
			setRecaptchaToken(null);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.leftPane}>
				<form className={styles.form_container} onSubmit={handleSubmit}>
					<div className={styles.header}>
						<div className={styles.imageCropper}>
							<img src="/welcome.png" alt="illustration" className={styles.welcome} />
						</div>
						<h1 className={styles.title}>Welcome back</h1>
						<p className={styles.subtitle}>Sign in to access your account</p>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>Email:</label>
						<div className={styles.inputWrapper}>
							<EmailIcon className={styles.svgIcon} />
							<input
								type="email"
								name="email"
								placeholder="email.iiit.ac.in"
								value={data.email}
								onChange={handleChange}
								required
								className={styles.input}
							/>
						</div>
					</div>

					<div className={styles.inputGroup}>
						<label className={styles.label}>Password:</label>
						<div className={styles.inputWrapper}>
							<LockIcon className={styles.svgIcon} />
							<input
								type="password"
								name="password"
								placeholder="Enter your password"
								value={data.password}
								onChange={handleChange}
								required
								className={styles.input}
							/>
						</div>
					</div>

					{error && <div className={styles.error}>{error}</div>}
					<div className={styles.recaptchaWrapper}>
						<ReCAPTCHA
							sitekey="6LdOfMoqAAAAABjeTwkZSrQaBMd5h2EFkX2juPvq"
							onChange={handleRecaptchaChange}
							ref={recaptchaRef}
						/>
					</div>

					<button type="submit" className={styles.login_btn}>
						Login
					</button>

					<p className={styles.signup}>
						Don't have an account? <a href="/signup">Sign up</a>
					</p>
				</form>
			</div>
			<div className={styles.rightPane}>
				<div className={styles.archBox}>
					<img src="/login.png" alt="illustration" className={styles.illustration} />
				</div>
			</div>
		</div>
	);
};

export default Login;