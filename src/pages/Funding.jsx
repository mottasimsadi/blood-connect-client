import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "./Loading";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { FaDollarSign, FaTimes } from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [checkoutKey, setCheckoutKey] = useState(0);

  const { data: funds = [], isLoading } = useQuery({
    queryKey: ["all-funding"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/funding");
      return data;
    },
    refetchOnMount: "always",
  });

  const totalPages = Math.ceil(funds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFunds = funds.slice(startIndex, startIndex + itemsPerPage);

  const closeModal = () => {
    document.getElementById("give_fund_modal").close();
  };

  const handleOpenModal = () => {
    setCheckoutKey((prevKey) => prevKey + 1);
    document.getElementById("give_fund_modal").showModal();
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#ef4343]">Funding</h1>
          <p className="text-[#64748b] mt-1">
            View donation history and contribute to our cause.
          </p>
        </div>
        <button
          className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838]"
          onClick={handleOpenModal}
        >
          <FaDollarSign /> Give Fund
        </button>
      </div>

      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="text-base text-gray-700">
                      <th className="w-1/2">Donor Name</th>
                      <th className="text-center">Amount</th>
                      <th className="text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFunds.map((fund) => (
                      <tr key={fund._id} className="hover">
                        <td className="font-medium text-gray-800 py-4">
                          {fund.name}
                        </td>
                        <td className="font-bold text-green-600 text-center py-4">
                          ${fund.amount.toFixed(2)}
                        </td>
                        <td className="text-gray-600 text-center py-4">
                          {new Date(fund.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, funds.length)} of{" "}
                    {funds.length} donations
                  </p>
                  <div className="join">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="join-item btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white disabled:text-white disabled:border-none mr-2"
                      disabled={currentPage === 1}
                    >
                      <MdNavigateBefore className="text-xl" />
                    </button>
                    <button className="join-item btn btn-sm pointer-events-none bg-transparent text-base-100 mr-2 rounded-md">
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
        </div>
      </div>

      {/* "Give Fund" Modal */}
      <dialog id="give_fund_modal" className="modal">
        <div className="modal-box bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <form method="dialog">
            <button className="btn btn-sm btn-circle bg-transparent border-[#ef4343] shadow-none hover:bg-[#ef4343] hover:text-white text-[#ef4343] absolute right-2 top-2">
              <FaTimes />
            </button>
          </form>
          <h3 className="font-bold text-lg text-[#ef4343] text-center mb-4">
            Make a Donation
          </h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm closeModal={closeModal} checkoutKey={checkoutKey} />
          </Elements>
        </div>
      </dialog>
    </div>
  );
};

export default Funding;
