import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../pages/Loading";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const FundingStatus = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: funds = [], isLoading } = useQuery({
    queryKey: ["all-funding"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/funding");
      return data;
    },
  });

  const totalPages = Math.ceil(funds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFunds = funds.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 p-4">
      <div className="mx-auto text-center">
        <h1 className="text-3xl font-bold text-[#ef4343]">Funding History</h1>
        <p className="text-gray-500 mt-1">
          View donation history and contribute to our cause.
        </p>
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
                      <th>Donor Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFunds.map((fund) => (
                      <tr key={fund._id} className="hover">
                        <td className="font-medium text-gray-800">
                          {fund.name}
                        </td>
                        <td className="text-gray-600">{fund.email}</td>
                        <td className="font-bold text-green-600">
                          ${fund.amount.toFixed(2)}
                        </td>
                        <td className="text-gray-600">
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
    </div>
  );
};

export default FundingStatus;
