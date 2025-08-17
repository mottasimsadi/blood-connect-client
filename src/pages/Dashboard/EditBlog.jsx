import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../pages/Loading";
import { FaImage, FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch the existing blog data
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog-details-edit", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/blogs/private/${id}`);
      return data;
    },
    enabled: !!id,
    refetchOnMount: "always",
  });

  // 2. Populate the form state once the blog data is fetched
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setPhotoURL(blog.thumbnail);
      setContent(blog.content);
    }
  }, [blog]);

  // 3. Mutation for updating the blog
  const { mutate: updateBlog } = useMutation({
    mutationFn: (updatedBlog) => axiosSecure.patch(`/blogs/${id}`, updatedBlog),
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "The blog post has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
      navigate("/dashboard/content-management");
    },
    onError: (err) =>
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4343",
      }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedBlogData = {
      title,
      thumbnail: photoURL,
      content,
    };
    updateBlog(updatedBlogData);
    setIsSubmitting(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-center text-[#ef4343] mb-6">
        Edit Blog Post
      </h2>
      <div className="card bg-white shadow-xl max-w-4xl mx-auto border border-gray-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black mb-2">Blog Title*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input text-black bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10 w-full"
                  required
                />
                <FaPencilAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black mb-2">
                  Thumbnail Image URL*
                </span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input text-black bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10 w-full"
                  required
                />
                <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Blog Content*</span>
              </label>
              {content && (
                <JoditEditor
                  key={content}
                  ref={editor}
                  value={content}
                  className="text-black"
                  tabIndex={1}
                  onBlur={(newContent) => setContent(newContent)}
                  onChange={() => {}}
                />
              )}
            </div>
            <div className="card-actions justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/content-management")}
                className="btn text-[#ef4343] bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none"
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <FaSave />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
