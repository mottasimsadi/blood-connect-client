import { Link, useLocation, useNavigate } from "react-router";
import {
  FaRegHeart,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTimes,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useState } from "react";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [activeModal, setActiveModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quickLinks = [
    { name: "About Us", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Donation Requests", href: "/donation-requests" },
    { name: "Search Donors", href: "/search" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "#contact-us" },
  ];

  const supportLinks = [
    {
      name: "Help Center",
      content: (
        <div>
          <h3 className="text-xl font-bold text-[#ef4343] mb-4">Help Center</h3>
          <p className="mb-4">
            Our help center provides answers to frequently asked questions and
            guides for using BloodConnect.
          </p>
          <div className="space-y-3">
            <p>
              <strong className="text-[#ef4343]">Email:</strong>{" "}
              help@bloodconnect.org
            </p>
            <p>
              <strong className="text-[#ef4343]">Phone:</strong>{" "}
              +880-1234-567891 (9AM-6PM)
            </p>
            <p>
              <strong className="text-[#ef4343]">Live Chat:</strong> Available
              on our website
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Privacy Policy",
      content: (
        <div>
          <h3 className="text-xl font-bold text-[#ef4343] mb-4">
            Privacy Policy
          </h3>
          <p className="mb-4">
            We are committed to protecting your personal information. Our
            privacy policy explains:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>What data we collect</li>
            <li>How we use your information</li>
            <li>Your privacy rights</li>
            <li>Data security measures</li>
          </ul>
        </div>
      ),
    },
    {
      name: "Terms of Service",
      content: (
        <div>
          <h3 className="text-xl font-bold text-[#ef4343] mb-4">
            Terms of Service
          </h3>
          <p className="mb-4">By using BloodConnect, you agree to our terms:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Eligibility requirements for donors</li>
            <li>Proper use of our platform</li>
            <li>User responsibilities</li>
            <li>Limitation of liability</li>
          </ul>
        </div>
      ),
    },
    {
      name: "Cookie Policy",
      content: (
        <div>
          <h3 className="text-xl font-bold text-[#ef4343] mb-4">
            Cookie Policy
          </h3>
          <p className="mb-4">We use cookies to enhance your experience:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Essential cookies for site functionality</li>
            <li>Analytics cookies to improve our services</li>
            <li>Preference cookies to remember your settings</li>
          </ul>
          <p className="mt-4">
            You can manage your cookie preferences in your browser settings.
          </p>
        </div>
      ),
    },
    {
      name: "Safety Guidelines",
      content: (
        <div>
          <h3 className="text-xl font-bold text-[#ef4343] mb-4">
            Safety Guidelines
          </h3>
          <p className="mb-4">For your safety and the safety of others:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Donor eligibility requirements</li>
            <li>Health screening procedures</li>
            <li>Post-donation care</li>
            <li>Emergency protocols</li>
          </ul>
        </div>
      ),
    },
    {
      name: "Emergency Support",
      content: (
        <div>
          <h3 className="text-xl font-bold text-[#ef4343] mb-4">
            Emergency Support
          </h3>
          <p className="mb-4">
            For life-threatening emergencies requiring immediate blood
            transfusion:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Call our 24/7 hotline: +880-1234-567890</li>
            <li>Visit the nearest hospital</li>
            <li>Use our emergency request feature in the app</li>
          </ul>
          <p>
            Our team will assist you in finding the nearest available donors.
          </p>
        </div>
      ),
    },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const socialLinks = [
    { icon: FaFacebook, href: "https://www.facebook.com/" },
    { icon: FaXTwitter, href: "https://x.com/" },
    { icon: FaInstagram, href: "https://www.instagram.com/" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/" },
  ];

const handleQuickLinkClick = (href) => {
  if (href.startsWith("#")) {
    if (isHomePage) {
      // Smooth scroll on homepage
      const element = document.getElementById(href.replace("#", ""));
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Navigate to homepage first, then scroll
      navigate("/", {
        state: { scrollTo: href.replace("#", "") },
        replace: true,
      });
    }
  }
};

  const openModal = (index) => {
    setActiveModal(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.footer
      className="bg-base-100 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                className="p-2 bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <FaRegHeart className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold">BloodConnect</span>
            </div>
            <p className="text-white/90 leading-relaxed">
              Connecting blood donors with those in need. Together, we save
              lives and build a healthier community through the gift of blood
              donation.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="h-4 w-4 text-[#ef4343]" />
                <span className="text-sm">+880-1234-567890</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-4 w-4 text-[#ef4343]" />
                <span className="text-sm">support@bloodconnect.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="h-4 w-4 text-[#ef4343]" />
                <span className="text-sm">
                  123 Health Street, Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {link.href.startsWith("#") ? (
                    <Link
                      to={isHomePage ? "#" : "/"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickLinkClick(link.href);
                      }}
                      state={
                        isHomePage
                          ? null
                          : { scrollTo: link.href.replace("#", "") }
                      }
                      className="text-white/90 hover:text-[#ef4343] cursor-pointer transition-colors text-sm text-left w-full"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-white/90 hover:text-[#ef4343] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => openModal(index)}
                    className="text-white/90 cursor-pointer hover:text-[#ef4343] transition-colors text-sm text-left w-full"
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Blood Types & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">
              Blood Types We Support
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {bloodTypes.map((type, index) => (
                <motion.div
                  key={type}
                  className="bg-[#ef4343]/10 text-[#ef4343] text-center py-2 rounded-md text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  {type}
                </motion.div>
              ))}
            </div>

            <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="text-white/90 hover:text-[#ef4343] transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-white/20 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              className="text-sm text-white/90"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} BloodConnect. All rights reserved.
            </motion.div>
            <motion.div
              className="flex items-center space-x-2 text-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white/90">Made with</span>
              <motion.div whileHover={{ scale: 1.2 }}>
                <FaRegHeart className="h-4 w-4 text-[#ef4343]" />
              </motion.div>
              <span className="text-white/90">for humanity</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white text-base-100 rounded-lg max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#ef4343] hover:opacity-70 cursor-pointer"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            {activeModal !== null && supportLinks[activeModal].content}
            <div className="mt-6">
              <button
                onClick={closeModal}
                className="bg-[#ef4343] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#d13232] transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.footer>
  );
};

export default Footer;
