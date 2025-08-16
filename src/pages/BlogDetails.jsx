import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/axiosPublic";
import Loading from "../pages/Loading";
import { FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const BlogDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/blogs/public/${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-white"
      >
        <div className="text-center p-8">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Failed to Load Blog Post
          </h2>
          <p className="text-gray-600">Error: {error.message}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.article
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              {blog.title}
            </h1>
            <div className="text-sm text-gray-400 mt-4">
              <FaCalendarAlt className="inline mr-2" />
              Published on{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </motion.div>

          {/* Thumbnail Image */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.figure>

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose lg:prose-xl max-w-none mx-auto text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.article>
      </div>
    </motion.div>
  );
};

export default BlogDetails;
