/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ConfigProvider, List, Button, message, Spin, Alert } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  useGetAllNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
} from "../../redux/api/notification";

export default function Notifications() {
  const navigate = useNavigate();

  // API hooks
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useGetAllNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAsUnread] = useMarkAsUnreadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllAsRead }] =
    useMarkAllAsReadMutation();

  // Track loading states for individual notifications
  const [loadingStates, setLoadingStates] = useState({});

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

  const items = getNotificationsData();

  const handleMarkAsRead = async (id) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [id]: "read" }));
      await markAsRead(id).unwrap();
      message.success("Notification marked as read");
    } catch (error) {
      message.error("Failed to mark as read");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [id]: "unread" }));
      await markAsUnread(id).unwrap();
      message.success("Notification marked as unread");
    } catch (error) {
      message.error("Failed to mark as unread");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      message.success("All notifications marked as read");
    } catch (error) {
      message.error("Failed to mark all as read");
    }
  };
  return (
    <div className="p-5 min-h-screen">
      <div className="bg-[#111827] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">
          Notifications
        </h1>
        <div className="ml-0 md:ml-auto w-full md:w-auto flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0">
          <Button
            onClick={handleMarkAllRead}
            size="small"
            loading={isMarkingAllAsRead}
            disabled={items.length === 0}
          >
            Mark all read
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert
          message="Error loading notifications"
          description="Failed to load notifications. Please try again."
          type="error"
          showIcon
          className="mb-4"
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      )}

      {/* Notifications List */}
      <ConfigProvider
        theme={{
          components: {
            List: {
              colorPrimary: "#111827",
            },
          },
        }}
      >
        <div className="bg-transparent">
          <List
            split={false}
            dataSource={items}
            renderItem={(item) => (
              <div
                onClick={() => !item.read && handleMarkAsRead(item.id)}
                className={`group flex items-start justify-between gap-4 p-4 border border-gray-200 bg-white rounded-lg mb-3 transition hover:shadow-sm cursor-pointer ${
                  item.read ? "opacity-90" : ""
                }`}
              >
                {/* Unread Accent Bar */}
                <div
                  className={`w-1 rounded-full self-stretch ${
                    item.read ? "bg-transparent" : "bg-[#111827]"
                  }`}
                />

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base md:text-lg font-semibold text-[#0D0D0D]">
                      {item.title}
                    </h4>
                    <span className="text-xs md:text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0">
                      {item.time}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1 pr-2">
                      {item.description}
                    </p>
                  )}
                  {!item.read && (
                    <p className="text-[12px] text-[#111827] mt-1">New</p>
                  )}
                </div>

                {/* Actions (show on hover) */}
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.read ? (
                    <Button
                      size="small"
                      onClick={() => handleMarkAsUnread(item.id)}
                      loading={loadingStates[item.id] === "unread"}
                    >
                      Mark unread
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#111827" }}
                      onClick={() => handleMarkAsRead(item.id)}
                      loading={loadingStates[item.id] === "read"}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            )}
          />
          {!isLoading && items.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No notifications
            </div>
          )}
        </div>
      </ConfigProvider>
    </div>
  );
}
