import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaImage, FaPencilAlt, FaPlus, FaTimes } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

const AddBlog = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !photoURL.trim() || !content.trim()) {
      Swal.fire({
        title: "Incomplete Form",
        text: "Please fill out the title, thumbnail URL, and content.",
        icon: "warning",
        confirmButtonColor: "#ef4343",
      });
      return;
    }

    setIsSubmitting(true);

    const newBlog = {
      title,
      thumbnail: photoURL,
      content,
    };

    try {
      await axiosSecure.post("/blogs", newBlog);
      await queryClient.invalidateQueries({ queryKey: ["all-blogs"] });

      Swal.fire({
        title: "Success!",
        text: "Your blog post has been created as a draft.",
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      navigate("/dashboard/content-management");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Could not create the blog post.",
        icon: "error",
        confirmButtonColor: "#ef4343",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-center text-[#ef4343] mb-6">
        Add New Blog Post
      </h2>
      <div className="card bg-white shadow-xl max-w-4xl mx-auto border border-gray-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 mb-2">
                  Blog Title*
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-input w-full text-black bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                  placeholder="Enter the blog title"
                  required
                />
                <FaPencilAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 mb-2">
                  Thumbnail Image URL*
                </span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input w-full text-black bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 mb-2">
                  Blog Content*
                </span>
              </label>
              {/* Jodit Rich Text Editor */}
              <JoditEditor
                ref={editor}
                value={content}
                className="text-black"
                required
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
              />
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
                  <span className="loading loading-spinner loading-sm text-[#ef4343]"></span>
                ) : (
                  <FaPlus />
                )}
                {isSubmitting ? (
                  <span className="text-[#ef4343]">Creating...</span>
                ) : (
                  "Create Blog"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
