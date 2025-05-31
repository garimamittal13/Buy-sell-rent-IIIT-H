import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { ReactComponent as EmailIcon } from "../assets/icons/envelope.svg";
import { ReactComponent as LockIcon } from "../assets/icons/lock.svg";
import { ReactComponent as NameIcon } from "../assets/icons/person.svg";
import { ReactComponent as AgeIcon } from "../assets/icons/calendar.svg";
import { ReactComponent as PhoneIcon } from "../assets/icons/phone.svg";

const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		age: "",
		Contact_Number: "",
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

				{/* Left Panel */}
				<div className={styles.left}>
					<div className={styles.archBox}>
						<img src="/login.png" alt="illustration" className={styles.illustration} />
					</div>
				</div>

				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<div className={styles.header}>
							<div className={styles.imageCropper}>
								<img src="/welcome.png" alt="illustration" className={styles.welcome} />
							</div>
							<h1 className={styles.title}>Get Started</h1>
							<p className={styles.subtitle}>Create your new account</p>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.inlineLabel}>First Name</label>
							<div className={styles.inputwrapper}>
								<NameIcon className={styles.svgIcon} />
								<input
									type="text"
									placeholder="First Name"
									name="firstName"
									onChange={handleChange}
									value={data.firstName}
									required
									className={styles.input}

								/>
							</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.inlineLabel}>Last Name</label>
							<div className={styles.inputwrapper}>
								<NameIcon className={styles.svgIcon} />
								<input
									type="text"
									placeholder="Last Name"
									name="lastName"
									onChange={handleChange}
									value={data.lastName}
									required
									className={styles.input}
								/>
							</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.inlineLabel}>Email</label>
							<div className={styles.inputwrapper}>
								<EmailIcon className={styles.svgIcon} />
								<input
									type="email"
									name="email"
									placeholder="email.iiit.ac.in"
									onChange={handleChange}
									value={data.email}
									required
									className={styles.input}
								/>
							</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.inlineLabel}>Password</label>
							<div className={styles.inputwrapper}>
								<LockIcon className={styles.svgIcon} />
								<input
									type="password"
									name="password"
									placeholder="Create a strong password"
									onChange={handleChange}
									value={data.password}
									required
									className={styles.input}
								/>
							</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.inlineLabel}>Age</label>
							<div className={styles.inputwrapper}>
								<AgeIcon className={styles.svgIcon} />
								<input
									type="number"
									placeholder="Age"
									name="age"
									onChange={handleChange}
									value={data.age}
									required
									className={styles.input}
								/>
							</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.inlineLabel}>Contact Number</label>
							<div className={styles.inputwrapper}>
								<PhoneIcon className={styles.svgIcon} />
								<input
									type="tel"
									name="Contact_Number"
									placeholder="9876543210"
									onChange={handleChange}
									value={data.Contact_Number}
									required
									className={styles.input}
								/>
							</div>
						</div>

						{error && <div className={styles.error_msg}>{error}</div>}

						<button className={styles.login_btn}>SIGN UP</button>
						<p className={styles.signup}>
							Already have an account? <Link to="/login">Sign in</Link>
						</p>
					</form>
				</div>

			</div>
		</div>
	);
};

export default Signup;