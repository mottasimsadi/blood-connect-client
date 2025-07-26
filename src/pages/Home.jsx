import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import {
  FaSearch,
  FaRegHeart,
  FaUsers,
  FaClock,
  FaArrowDown,
  FaShieldAlt,
  FaMobileAlt,
  FaAward,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const scrollToElement = () => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };

      // Small delay to ensure page is fully loaded
      const timer = setTimeout(scrollToElement, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Features data
  const features = [
    {
      icon: FaShieldAlt,
      title: "Safe & Secure",
      description:
        "All donors are verified and blood is tested for safety. Your health is our priority.",
      color: "text-[#ef4343]",
    },
    {
      icon: FaClock,
      title: "24/7 Emergency Support",
      description:
        "Round-the-clock emergency blood requests and donor notifications.",
      color: "text-[#ef4343]",
    },
    {
      icon: FaUsers,
      title: "Large Network",
      description:
        "Connect with thousands of verified donors across all blood groups.",
      color: "text-[#ef4343]",
    },
    {
      icon: FaRegHeart,
      title: "Life Saving Impact",
      description:
        "Each donation can save up to 3 lives. Be a hero in someone's story.",
      color: "text-[#ef4343]",
    },
    {
      icon: FaAward,
      title: "Recognition Program",
      description:
        "Earn badges and recognition for your contributions to society.",
      color: "text-[#ef4343]",
    },
    {
      icon: FaMobileAlt,
      title: "Easy Mobile Access",
      description:
        "Request or donate blood with just a few taps on your mobile device.",
      color: "text-[#ef4343]",
    },
  ];

  // Steps data
  const steps = [
    {
      step: "01",
      title: "Register as Donor",
      description: "Create your profile with blood group and location details",
      icon: FaUsers,
      bgColor: "bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b]",
    },
    {
      step: "02",
      title: "Get Notified",
      description: "Receive notifications when someone needs your blood type",
      icon: FaClock,
      bgColor: "bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b]",
    },
    {
      step: "03",
      title: "Donate & Save Lives",
      description: "Visit the hospital and make your life-saving donation",
      icon: FaRegHeart,
      bgColor: "bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b]",
    },
  ];

  // Contact information data
  const contactInfo = [
    {
      icon: FaPhone,
      title: "Emergency Hotline",
      details: "+880-1234-567890",
      description: "24/7 emergency blood requests",
    },
    {
      icon: FaEnvelope,
      title: "Email Support",
      details: "support@bloodconnect.org",
      description: "Get help with your account",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Main Office",
      details: "123 Health Street, Dhaka",
      description: "Visit us during office hours",
    },
    {
      icon: FaClock,
      title: "Support Hours",
      details: "Mon-Fri: 9AM-6PM",
      description: "Weekend emergency support available",
    },
  ];

  // Form state and handlers
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Show success message
    await Swal.fire({
      title: "Message Sent!",
      text: "We'll get back to you soon.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#ef4343",
    });

    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#ef4343]/5"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={"https://i.postimg.cc/wTTfxzwj/hero-blood-donation.jpg"}
            alt="Blood Donation Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ef4343]/90 via-[#ef4343]/70 to-[#ef4343]/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Save Lives with
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ff6b8b]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Blood Donation
                </motion.span>
              </h1>
              <motion.p
                className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Connect with donors, find blood when you need it most, and be
                part of a life-saving community.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link
                to="/register"
                className="btn btn-outline text-lg px-8 py-6 h-auto text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <FaRegHeart className="mr-2" />
                Join as a Donor
              </Link>
              <Link
                to="/search"
                className="btn btn-outline text-lg px-8 py-6 h-auto text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <FaSearch className="mr-2" />
                Search Donors
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                { icon: FaUsers, value: "10,000+", label: "Active Donors" },
                { icon: FaRegHeart, value: "25,000+", label: "Lives Saved" },
                { icon: FaClock, value: "24/7", label: "Emergency Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="card bg-white/10 backdrop-blur-sm border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="card-body p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {stat.value}
                    </h3>
                    <p className="text-white/80">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowDown className="h-6 w-6 text-white/80" />
            </motion.div>
            <p className="text-white/80 text-sm mt-2">Scroll to explore</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make blood donation simple, safe, and impactful. Join our
              community of heroes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-full bg-[#ef4343]/10 flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl text-base-100 font-semibold text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to start saving lives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                {index < steps.length && (
                  <div className="md:block absolute top-12 left-2/3 w-1/3 h-0.5 bg-[#ef4343]/30" />
                )}
                <div className="relative">
                  <div
                    className={`${step.bgColor} text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <step.icon className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ef4343] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto p-8 sm:p-12 text-center rounded-2xl bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Save Lives?
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of donors who have already made a difference. Your
              blood donation can be someone's second chance at life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-outline text-sm px-8 h-11 text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <FaRegHeart className="mr-2" />
                Become a Donor
              </Link>
              <Link
                to="/donation-requests"
                className="btn btn-outline text-sm px-8 h-11 text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <FaMapMarkerAlt className="mr-2" />
                Find Blood Requests
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-base-100 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or need emergency blood? We're here to help 24/7.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="card-body">
                <h3 className="card-title text-2xl text-base-100 my-6">
                  Send us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ef4343]"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ef4343]"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880-1234-567890"
                      className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ef4343]"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="textarea text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ef4343] w-full "
                      placeholder="How can we help you? Please describe your question or emergency..."
                      required
                    ></textarea>
                  </div>
                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className="btn bg-[#ef4343] hover:bg-[#d13232] text-white border-none w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#ef4343]/10 p-3 rounded-lg">
                        <item.icon className="text-[#ef4343] text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-base-100 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[#ef4343] font-medium mb-1">
                          {item.details}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Emergency Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card bg-gradient-to-r from-[#ef4343] to-[#ff6b8b] text-white shadow-xl"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-3">
                    <FaExclamationTriangle className="text-xl" />
                    <h3 className="text-xl font-bold">
                      Emergency Blood Request
                    </h3>
                  </div>
                  <p className="mb-4">
                    For life-threatening emergencies requiring immediate blood
                    transfusion, please call our emergency hotline or visit the
                    nearest hospital.
                  </p>
                  <Link
                    to="tel:+8801234567890"
                    className="btn btn-outline text-sm text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    Call Emergency Line
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
