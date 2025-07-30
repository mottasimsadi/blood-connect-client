import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/axiosPublic";
import Loading from "../pages/Loading";
import { FaCalendarAlt } from "react-icons/fa";

const BlogDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

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
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-white shadow-xl border border-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-base-100">
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
          </div>

          {/* Thumbnail Image */}
          <figure className="mb-8">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
            />
          </figure>

          {/* Blog Content */}
          <div
            className="prose lg:prose-xl max-w-none mx-auto text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;
