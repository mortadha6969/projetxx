import React, { useState, useEffect } from "react";
import "./ProfileAccount.css";  // Import the CSS file

const ProfileAccount = () => {
  const [user, setUser] = useState({
    username: "user123",
    email: "user123@example.com",
    bio: "This is my bio.",
    sex: "male", // 'male', 'female', 'other'
    profilePic: null, // Will be null if no picture is uploaded
  });

  const getDefaultProfilePic = (sex) => {
    switch (sex) {
      case "male":
        return "default_male_icon.png";  // Replace with your male icon
      case "female":
        return "default_female_icon.png";  // Replace with your female icon
      default:
        return "default_other_icon.png";  // Replace with your other icon
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
      </div>
      <div className="profile-content">
        <div className="profile-pic-container">
          <img
            src={user.profilePic || getDefaultProfilePic(user.sex)}
            alt="Profile"
            className="profile-pic"
          />
        </div>
        <div className="profile-info">
          <div className="info-item">
            <strong>Username:</strong> {user.username}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="info-item">
            <strong>Sex:</strong> {user.sex}
          </div>
          <div className="info-item">
            <strong>Bio:</strong>
            <p>{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAccount;
