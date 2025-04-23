import React from 'react';
import './WebsiteFooter.css';

const WebsiteFooter = () => {
  const socialMedia = [
    { name: 'Facebook', icon: '🇫', link: '#' },
    { name: 'Twitter', icon: '🐦', link: '#' },
    { name: 'Instagram', icon: '📸', link: '#' },
    { name: 'LinkedIn', icon: '💼', link: '#' },
    { name: 'YouTube', icon: '▶️', link: '#' }
  ];

  const policies = [
    { title: "Privacy Policy", link: "#" },
    { title: "Terms of Service", link: "#" },
    { title: "Cookie Policy", link: "#" },
    { title: "Community Guidelines", link: "#" }
  ];

  const resources = [
    { title: "Help Center", link: "#" },
    { title: "FAQ", link: "#" },
    { title: "Blog", link: "#" },
    { title: "Success Stories", link: "#" }
  ];

  return (
    <footer className="website-footer">
      <div className="footer-container">
        {/* Contact Section */}
        <div className="footer-section">
          <h4>Contact Us!</h4>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Your Message" rows="4"></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Our Policies</h4>
          <ul className="footer-links">
            {policies.map((policy, index) => (
              <li key={index}>
                <a href={policy.link}>{policy.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4>Resources</h4>
          <ul className="footer-links">
            {resources.map((resource, index) => (
              <li key={index}>
                <a href={resource.link}>{resource.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-media">
            {socialMedia.map((platform, index) => (
              <a 
                key={index} 
                href={platform.link} 
                className="social-icon"
                aria-label={platform.name}
              >
                {platform.icon}
              </a>
            ))}
          </div>
          
          <div className="contact-info">
            <p>📧 contact@truefunding.com</p>
            <p>📞 +216 12-345-678</p>
            <p>📍 123 Funding Street, Suite 456</p>
            <p>🌍 New York, NY 10001</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 TrueFunding Platform. All rights reserved.</p>
        <p>Supporting dreams since 2020</p>
      </div>
    </footer>
  );
};

export default WebsiteFooter;