import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import {
  FaPlus,
  FaFilter,
  FaTrashAlt,
  FaUpload,
  FaEyeSlash,
  FaEdit,
} from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Loading from "../Loading";

const ContentManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { role, loading: roleLoading } = useRole();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["all-blogs", statusFilter],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/blogs?status=${statusFilter}`);
      return data;
    },
    enabled: role === "admin" || role === "volunteer",
    refetchOnMount: "always",
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/blogs/status/${id}`, { status }),
    onSuccess: (data, variables) => {
      Swal.fire({
        title: "Success!",
        text: `Blog has been successfully ${variables.status}.`,
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
    },
    onError: (err) =>
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4343",
      }),
  });

  const { mutate: deleteBlog } = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/blogs/${id}`),
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "The blog post has been permanently removed.",
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
    },
    onError: (err) =>
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4343",
      }),
  });

  const handleStatusChange = (blog, newStatus) => {
    const actionText = newStatus === "published" ? "publish" : "unpublish";
    Swal.fire({
      title: `Confirm Action`,
      text: `Are you sure you want to ${actionText} this blog?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionText} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({ id: blog._id, status: newStatus });
      }
    });
  };

  const handleDelete = (blog) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete "<strong>${blog.title}</strong>".<br/>This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBlog(blog._id);
      }
    });
  };

  const getStatusBadge = (status) => {
    return status === "published" ? "badge-success" : "badge-warning";
  };

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading || roleLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#ef4343]">
            Content Management
          </h1>
          <p className="text-[#64748b] mt-1">
            Create, publish, and manage all blog posts.
          </p>
        </div>
        <Link
          to="/dashboard/content-management/add-blog"
          className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838]"
        >
          <FaPlus /> Add Blog
        </Link>
      </div>

      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body">
          <div className="flex flex-col items-stretch sm:flex-row sm:justify-end gap-2 mb-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="statusFilter"
                className="flex items-center gap-2 font-medium text-gray-600 whitespace-nowrap"
              >
                <FaFilter /> <span>Filter by:</span>
              </label>
              <select
                id="statusFilter"
                className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 pl-10 bg-white text-black select-sm w-48"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="text-center p-10">
              <span className="loading loading-lg loading-spinner text-[#ef4343]"></span>
            </div>
          )}

          {!isLoading && blogs.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="card card-compact bg-white text-black border-gray-300 shadow-xl border transition-shadow hover:shadow-2xl"
                  >
                    <figure>
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="h-48 w-full object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <span
                        className={`badge ${getStatusBadge(
                          blog.status
                        )} capitalize self-start`}
                      >
                        {blog.status}
                      </span>
                      <h2 className="card-title">{blog.title}</h2>
                      {role === "admin" || role === "volunteer" ? (
                        <div className="card-actions justify-end mt-2">
                          {/* Edit button (visible to both admin and volunteer) */}
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/content-management/edit-blog/${blog._id}`
                              )
                            }
                            className="btn btn-info btn-sm text-white"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>

                          {/* Publish/Unpublish and Delete (admin only) */}
                          {role === "admin" && (
                            <>
                              {blog.status === "draft" ? (
                                <button
                                  onClick={() =>
                                    handleStatusChange(blog, "published")
                                  }
                                  className="btn btn-success btn-sm text-white"
                                >
                                  <FaUpload className="mr-1" /> Publish
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleStatusChange(blog, "draft")
                                  }
                                  className="btn btn-warning btn-sm text-white"
                                >
                                  <FaEyeSlash className="mr-1" /> Unpublish
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(blog)}
                                className="btn btn-error btn-sm text-white"
                              >
                                <FaTrashAlt className="mr-1" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, blogs.length)} of{" "}
                    {blogs.length} posts
                  </p>
                  <div className="join">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="join-item btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white disabled:text-white disabled:border-none mr-2"
                      disabled={currentPage === 1}
                    >
                      <MdNavigateBefore className="text-xl" />
                    </button>
                    <button className="join-item btn btn-sm pointer-events-none bg-transparent text-black mr-2 rounded-md">
                      Page {currentPage} / {totalPages}
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="join-item btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white disabled:text-white disabled:border-none"
                      disabled={currentPage === totalPages}
                    >
                      <MdNavigateNext className="text-xl" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && blogs.length === 0 && (
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body items-center text-center">
                <FaMagnifyingGlass className="text-6xl text-[#ef4343] mb-4" />
                <h3 className="card-title text-black text-2xl">
                  No Blog Posts Yet
                </h3>
                <p className="text-[#64748b] mt-2">
                  No blogs match the status "
                  <span className="text-[#ef4343]">{statusFilter}</span>". Try
                  another filter or create a new post by clicking on "
                  <span className="text-[#ef4343]">Add Blog</span>"!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
