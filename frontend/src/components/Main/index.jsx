// frontend/src/components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBIcon,
  MDBCardBody, MDBCardImage, MDBTypography
} from 'mdb-react-ui-kit';
import './Profile.css';  // Importing Custom CSS

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    Contact_Number: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          age: response.data.age,
          Contact_Number: response.data.Contact_Number,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleChange = ({ currentTarget: input }) => {
    setFormData({ ...formData, [input.name]: input.value });
  };

  const handlePasswordChange = ({ currentTarget: input }) => {
    setPasswordData({ ...passwordData, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.Contact_Number)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          email: userData.email,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Current password is incorrect. Please try again.");
        } else if (error.response.status === 404) {
          alert("User not found. Please check your email.");
        } else {
          console.error("Error updating user password:", error);
          alert("Something went wrong. Please try again later.");
        }
      } else {
        console.error("Error updating user password:", error);
        alert("Network error. Please check your connection.");
      }
    }
  };
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-left">
          <div className="banner-container">
          </div>

          <div className="avatar-container">
            <img src="/profile.avif" alt="Avatar" className="profile-img" />
          </div>

          <h3 className="profile-name">
            {userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}
          </h3>

          <div className="actions">
            {!isChangingPassword && !isEditing && (
              <button className="edit-btn" onClick={handleEdit}>
                ✏️ Edit
              </button>
            )}
            {!isChangingPassword && !isEditing && (
              <button className="change-password-btn" onClick={handleChangePassword}>
                🔒 Change Password
              </button>
            )}
          </div>
        </div>

        <div className="profile-info">
          <div className="information">
            <div className="infoleft">
              <h2 className="info-title">Profile</h2>
              <hr />
              <div className="info-row">
                <div>
                  <h4>Email</h4>
                  <p>{userData ? userData.email : "Loading..."}</p>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>
                    {isEditing ? (
                      <input className = "profile-input" type="number" name="Contact_Number" value={formData.Contact_Number} onChange={handleChange} />
                    ) : (
                      userData?.Contact_Number || "Loading..."
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="inforight">
              <h3 className="info-title">Details</h3>
              <hr />
              <div className="info-row">
                <div className="info-rowr">
                  <div className="names">
                    <div>
                      <h4>First Name</h4>
                      <p>
                        {isEditing ? (
                          <input className = "profile-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                        ) : (
                          userData?.firstName || "Loading..."
                        )}
                      </p>
                    </div>
                    <div>
                      <h4>Last Name</h4>
                      <p>
                        {isEditing ? (
                          <input className = "profile-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                        ) : (
                          userData?.lastName || "Loading..."
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4>Age</h4>
                    <p>
                      {isEditing ? (
                        <input className = "profile-input" type="number" value={formData.age} onChange={handleChange} />
                      ) : (
                        userData?.age || "Loading..."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isEditing && (
            <button className="save-btn" onClick={handleSubmit}>
              Save
            </button>
          )}

          {isChangingPassword && (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
              <button type="submit" className="submit">Change Password</button>
              <button type="button" className="cancel-btn" onClick={handleCancelPasswordChange}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
