import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
import RecentUsers from "./RecentUsers";
import TotalView from "./TotalView";
import { useDashboardOverviewQuery } from "../../redux/api/dashboard_tab";

function DashboardPage() {
  const currentYear = dayjs().year();
  const startYear = 2020;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const { data: dashboardData, isLoading } =
    useDashboardOverviewQuery(selectedYear);

  // console.log("Selected year for API:", selectedYear);

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  const stats = dashboardData?.data || {};
  // console.log(stats, "stats");

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 whitespace-nowrap h-[100px] rounded-xl">
            <div className="relative flex flex-col justify-center items-center p-3 bg-[#F2F2F2] gap-1">
              <p className="text-[#111827] text-2xl font-bold mr-10">
                {stats.totalUsers || 0}
              </p>
              <p className="text-xl font-semibold">Total User</p>
              {/* Desktop/tablet right divider */}
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#111827]" />
            </div>
            <div className="relative flex flex-col justify-center items-center p-3 bg-[#F2F2F2] gap-1">
              <p className="text-[#111827] text-2xl font-bold mr-10">
                {stats.totalVenues || 0}
              </p>
              <p className="text-xl font-semibold">Venue Listed</p>
              {/* Desktop/tablet right divider */}
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#111827]" />
            </div>
            <div className="relative flex flex-col justify-center items-center p-3 bg-[#F2F2F2] gap-1">
              <p className="text-[#111827] text-2xl font-bold mr-10">
                {stats.totalBookings || 0}
              </p>
              <p className="text-xl font-semibold">Venue Booked</p>
              {/* Desktop/tablet right divider */}
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#111827]" />
            </div>
            <div className="flex flex-col justify-center items-center p-3 bg-[#F2F2F2] gap-1">
              <p className="text-[#111827] text-2xl font-bold mr-10">
                ${stats.adminEarnings || 0}
              </p>
              <p className="text-xl font-semibold">Total Revenue</p>
            </div>
          </div>

          <div className="w-full p-5 bg-[#F2F2F2] rounded-lg shadow-md mt-5">
            <div className="flex flex-col md:flex-row md:justify-between lg:justify-between items-center gap-5 my-5">
              <div>
                <h1 className="text-xl text-[#111827] font-semibold">
                  User Growth
                </h1>
              </div>
              <div className="flex justify-between items-center gap-5 whitespace-nowrap">
                <div className="relative w-full md:w-32">
                  {/* Selected Year Display */}
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 border border-[#111827] rounded-md flex justify-between items-center bg-white transition"
                  >
                    <span className="text-[#111827]">{selectedYear}</span>
                    <FaChevronDown className="text-[#111827] w-5 h-5 ml-5" />
                  </button>

                  {/* Dropdown List */}
                  {isOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg text-lg">
                      {years.map((year) => (
                        <div
                          key={year}
                          onClick={() => handleSelect(year)}
                          className={`p-2 cursor-pointer hover:bg-gray-100 transition ${
                            year === selectedYear
                              ? "bg-[#111827] text-white"
                              : ""
                          }`}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <TotalView userChart={stats.userChart || []} />
          </div>
          <div className="mt-5">
            <h1 className="text-2xl text-[#111827] font-bold mb-5">
              Recent Joined User
            </h1>
            <RecentUsers recentUsers={stats.recentUsers || []} />
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
