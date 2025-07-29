import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import Loading from "../pages/Loading";
import { FaCalendarAlt, FaFeatherAlt } from "react-icons/fa";

const Blog = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["public-published-blogs"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/blogs/published");
      return data;
    },
    refetchOnMount: "always",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#ef4343]">Our Blog</h1>
          <p className="text-lg text-[#64748b] mt-2">
            Insights, stories, and updates from the BloodConnect community.
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <div className="card bg-white shadow-xl border border-gray-200 text-center py-12">
            <div className="card-body items-center">
              <FaFeatherAlt className="text-6xl text-[#ef4343] opacity-50 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700">
                No Published Blogs Yet
              </h3>
              <p className="text-[#64748b] mt-2">
                Our team is working on new content. Please check back soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="card bg-white shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <figure>
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-56 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-gray-800 line-clamp-2">
                    {blog.title}
                  </h2>
                  <div className="text-xs text-gray-400 mt-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
