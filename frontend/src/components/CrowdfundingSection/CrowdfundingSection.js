import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Handshake, LineChart, ChevronRight } from 'lucide-react';
import './CrowdfundingSection.css';

const crowdfundingOptions = [
  {
    icon: <Landmark size={32} />,
    title: "Sous forme de dons",
    description: "Le crowdfunding en don‑récompense permet à des porteurs de projet de collecter des fonds en contrepartie",
  },
  {
    icon: <Handshake size={32} />,
    title: "Sous forme de prêts",
    description: "Le crowdfunding en prêt consiste à collecter des fonds sous forme de prêts, avec un remboursement...",
  },
  {
    icon: <LineChart size={32} />,
    title: "Sous forme d'investissements",
    description: "Le crowdfunding en investissement consiste à collecter des fonds auprès de personnes qui investissent...",
  },
];

export default function CrowdfundingSection() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Ensure this works

  const handleDonateClick = () => {
    if (!isLoggedIn) {
      navigate("/login");  // Redirect to login page if not logged in
    } else {
      navigate("/campaign"); // Navigate to the campaign page
    }
  };

  return (
    <section className="crowdfunding-section">
      <div className="left-col">
        <p className="subtitle">En savoir plus sur le crowdfunding</p>
        <h2 className="title">Crowdfunding : comment ça marche ?</h2>
        <p className="intro">Le crowdfunding ou financement participatif est une méthode alternative de financement...</p>
        <button className="learn-more">En savoir plus</button>

        {/* ✅ Donate Now Button */}
        <button className="donate-now-button" onClick={handleDonateClick}>
          Donate Now
        </button>
      </div>

      <div className="right-col">
        {crowdfundingOptions.map((opt, idx) => (
          <div key={idx} className="option-card">
            <div className="accent-bar"></div>
            <div className="card-content">
              <div className="option-content">
                <div className="option-icon">{opt.icon}</div>
                <div className="option-text">
                  <h3>{opt.title}</h3>
                  <p>{opt.description}</p>
                </div>
              </div>
              <div className="arrow-icon">
                <ChevronRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
