import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FaSearch,
  FaHeart,
  FaUsers,
  FaClock,
  FaArrowDown,
} from "react-icons/fa";

const Home = () => {
  return (
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
              Connect with donors, find blood when you need it most, and be part
              of a life-saving community.
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
              className="btn btn-outline text-lg px-8 py-6 h-auto text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              <FaHeart className="mr-2" />
              Join as a Donor
            </Link>
            <Link
              to="/search"
              className="btn btn-outline text-lg px-8 py-6 h-auto text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
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
              { icon: FaHeart, value: "25,000+", label: "Lives Saved" },
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
  );
};

export default Home;