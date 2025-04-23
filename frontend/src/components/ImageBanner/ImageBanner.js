import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageBanner.css";

const ImageBanner = ({ imageUrl, title, breadcrumbs, description }) => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/campaign"); // ✅ go to campaign when logged in
    } else {
      navigate("/login"); // ❌ go to login if not logged in
    }
  };

  return (
    <div
      className="image-banner"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="content-overlay">
        <div className="breadcrumb">
          {breadcrumbs.map((item, index) => (
            <a className="abtn" href={`/${item}`} key={index}>
              <span className="breadcrumb-item">
                {index > 0 && " / "}
                {item}
              </span>
            </a>
          ))}
        </div>

        <h1 className="Banner-title">{title}</h1>
        <p className="Banner-description">{description}</p>
        <button className="donate-button-banner" onClick={handleDonateClick}>
          Donate Now?
        </button>
      </div>
    </div>
  );
};

export default ImageBanner;
