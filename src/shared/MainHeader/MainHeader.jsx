/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import {
  IoMenu,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { useGetMyProfileQuery } from "../../redux/api/authApi";
import { useGetAllNotificationsQuery } from "../../redux/api/notification";

const MainHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: profileData } = useGetMyProfileQuery();
  const { data: notificationsData } = useGetAllNotificationsQuery();

  // Get notifications from API data with fallback
  const getNotificationsData = () => {
    if (!notificationsData) return [];

    // Handle different possible response structures
    if (Array.isArray(notificationsData.data)) {
      return notificationsData.data;
    } else if (Array.isArray(notificationsData)) {
      return notificationsData;
    } else if (
      notificationsData?.data?.data &&
      Array.isArray(notificationsData.data.data)
    ) {
      return notificationsData.data.data;
    }

    return [];
  };

  // Calculate unread notifications count
  const notifications = getNotificationsData();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative w-full px-5">
      <header className="shadow-sm rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="flex justify-between items-center px-5 md:px-10 h-[80px]">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded hover:opacity-80 focus:outline-none"
          >
            <IoMenu className="w-8 h-8 text-[#0D0D0D]" />
          </button>
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate("/notifications")}
              className="relative p-2 rounded-full border border-[#111827] hover:bg-white/60 transition cursor-pointer"
            >
              <IoNotificationsOutline className="w-6 h-6 text-[#0D0D0D]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111827] text-white text-[10px] px-1 leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            {/* Chat */}
            {/* <button
              type="button"
              aria-label="Open chat"
              onClick={() => navigate("/chat")}
              className="p-2 rounded-full border border-[#111827] hover:bg-white/60 transition"
            >
              <IoChatbubbleEllipsesOutline className="w-6 h-6 text-[#0D0D0D]" />
            </button> */}
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={
                  profileData?.data?.profileImage ||
                  user?.profileImage ||
                  "https://avatar.iran.liara.run/public/31"
                }
                className="w-8 md:w-12 h-8 md:h-12 object-cover rounded-full"
                alt="User Avatar"
              />
              <div>
                <h3 className="hidden md:block text-[#0D0D0D] text-lg font-semibold">
                  {profileData?.data?.fullName || user?.fullName || "Mr. Admin"}
                </h3>
                <p className="text-[#0D0D0D] text-lg font-semibold">
                  {profileData?.data?.role || user?.role || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
