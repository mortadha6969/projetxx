import React from "react";
import { FiTwitter, FiInstagram, FiFacebook, FiMail } from "react-icons/fi";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "About", path: "#" },
    { name: "How It Works", path: "#" },
    { name: "Browse Projects", path: "#" },
    { name: "Start a Project", path: "#" },
    { name: "FAQ", path: "#" },
    { name: "Contact", path: "#" },
  ];

  const legalLinks = [
    { name: "Terms", path: "#" },
    { name: "Privacy", path: "#" },
    { name: "Cookies", path: "#" },
  ];

  const socialIcons = [
    <FiTwitter size={18} />,
    <FiInstagram size={18} />,
    <FiFacebook size={18} />,
    <FiMail size={18} />,
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Logo and description */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <span className="inline-block mb-3 text-xl font-bold text-primary-600 cursor-default">
              TrueFunding
            </span>
            <p className="text-gray-600 text-sm mb-4 max-w-xs">
              The simple way to fund your projects and support causes you care about.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((icon, index) => (
                <span
                  key={index}
                  className="text-gray-500 cursor-default"
                  aria-label={`Social media icon ${index + 1}`}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <span className="text-gray-600 text-sm cursor-default">
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links in place of Newsletter */}
          <div className="md:w-1/3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Legal Information
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Important information about our services and your rights.
            </p>
            <ul className="space-y-2">
              <li>
                <span
                  onClick={() => window.location.href = '/terms'}
                  className="text-gray-600 text-sm cursor-pointer hover:text-primary-500"
                >
                  Terms and Conditions
                </span>
              </li>
              <li>
                <span
                  onClick={() => window.location.href = '/privacy'}
                  className="text-gray-600 text-sm cursor-pointer hover:text-primary-500"
                >
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-sm cursor-default">
                  Cookies
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} TrueFunding. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
