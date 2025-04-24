import React from "react";
import { Link } from "react-router-dom";
import { FiTwitter, FiInstagram, FiFacebook, FiMail } from "react-icons/fi";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "About", path: "/about" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Browse Projects", path: "/campaigns" },
    { name: "Start a Project", path: "/create-campaign" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Cookies", path: "/cookies" },
  ];

  const socialLinks = [
    { icon: <FiTwitter size={18} />, url: "https://twitter.com" },
    { icon: <FiInstagram size={18} />, url: "https://instagram.com" },
    { icon: <FiFacebook size={18} />, url: "https://facebook.com" },
    { icon: <FiMail size={18} />, url: "mailto:info@truefunding.com" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Logo and description */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <Link to="/" className="inline-block mb-3">
              <span className="text-xl font-bold text-primary-600">TrueFunding</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-xs">
              The simple way to fund your projects and support causes you care about.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
                  aria-label={`Visit our social media ${index + 1}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-500 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:w-1/3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Get the latest on new projects and success stories.
            </p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 text-sm rounded-r-md transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} TrueFunding. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="hover:text-primary-500 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
