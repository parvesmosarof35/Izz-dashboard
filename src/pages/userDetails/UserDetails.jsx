import { ConfigProvider, Modal, Table, Select } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useBlockUserMutation,
} from "../../redux/api/userManagement";

function UserDetails() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // block modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  // Get single user details
  const { data: singleUserData, isLoading: isLoadingSingleUser } =
    useGetSingleUserQuery(selectedUserId, { skip: !selectedUserId });

  // API call with role and status filters (no pagination)
  const { data: usersData, isLoading } = useGetAllUsersQuery(
    roleFilter
      ? `?${
          roleFilter === "INACTIVE" ? "status=INACTIVE" : `role=${roleFilter}`
        }`
      : ""
  );

  // Block user mutation
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();

  // Transform API data to table format
  const dataSource = useMemo(() => {
    if (!usersData?.data?.data) return [];
    return usersData.data.data.map((user) => ({
      key: user.id,
      fullName: user.fullName,
      role: user.role,
      clinic: "N/A", // API doesn't provide clinic
      email: user.email,
      phone: user.contactNumber || "N/A",
      joined: new Date(user.createdAt).toLocaleDateString(),
      status: user.status,
      profileImage: user.profileImage,
    }));
  }, [usersData]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showViewModal = (user) => {
    setSelectedUserId(user.key);
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
    setSelectedUserId(null);
  };

  // Reset pagination when filters change
  const handleFilterChange = (value) => {
    setRoleFilter(value);
    setPagination({ page: 1, limit: pagination.limit });
  };
  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => (pagination.page - 1) * pagination.limit + index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.profileImage || "https://avatar.iran.liara.run/public/44"
            }
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span className="leading-none">{value}</span>
        </div>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phone", key: "phone" },
    { title: "Joined Date", dataIndex: "joined", key: "joined" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => openBlock(record)}>
            <MdBlock className="text-red-500 w-10 h-10 cursor-pointer rounded-md" />
          </button>
          <button className="" onClick={() => showViewModal(record)}>
            <FaRegEye className="text-[#111827] w-10 h-10 cursor-pointer rounded-md" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return dataSource.filter((r) => {
      const matchQuery = q
        ? [r.fullName, r.email, r.phone, r.role]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchQuery;
    });
  }, [dataSource, searchQuery]);

  const openBlock = (row) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  const confirmBlock = async () => {
    if (selectedUser) {
      try {
        await blockUser(selectedUser.key).unwrap();
        setIsModalOpen(false);
        setSelectedUser(null);
        // Show success message (optional)
      } catch (error) {
        // Handle error (optional)
        console.error("Failed to block user:", error);
      }
    }
  };

  return (
    <div>
      <div className="bg-[#111827] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">
          User Management
        </h1>
        {/* Mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
          />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  controlHeightLG: 44,
                  controlPaddingHorizontal: 12,
                  optionPadding: 10,
                  borderRadiusLG: 8,
                },
              },
            }}
          >
            <Select
              placeholder="Select role"
              value={roleFilter}
              onChange={handleFilterChange}
              size="large"
              className="w-full md:w-auto md:min-w-[220px]"
              style={{ minWidth: 220 }}
              popupMatchSelectWidth={false}
              dropdownStyle={{ paddingTop: 8, paddingBottom: 8 }}
              options={[
                { label: "All Users", value: "" },
                { label: "User", value: "USER" },
                { label: "Vendor", value: "VENDOR" },
                { label: "Blocked Users", value: "INACTIVE" },
              ]}
            />
          </ConfigProvider>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
            Table: {
              headerBg: "#111827",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#111827",
            },
          },
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: filteredData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPagination({ page, limit: pageSize });
            },
          }}
          scroll={{ x: "max-content" }}
        />
        {/* Block Modal */}
        <Modal
          open={isModalOpen}
          centered
          onCancel={handleCancel}
          footer={null}
        >
          <div className="flex flex-col justify-center items-center py-10">
            <h1 className="text-3xl text-center text-[#111827]">Block User</h1>
            <p className="text-xl text-center mt-5">
              {selectedUser
                ? `Do you want to block ${selectedUser.fullName}?`
                : `Do you want to block this user?`}
            </p>
            <div className="text-center py-5 w-full flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white font-semibold py-3 px-5 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                disabled={isBlocking}
                className="bg-[#111827] text-white font-semibold py-3 px-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isBlocking ? "Blocking..." : "Block"}
              </button>
            </div>
          </div>
        </Modal>

        {/* View Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
          className="user-view-modal"
        >
          {isLoadingSingleUser ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            singleUserData?.data && (
              <div className="relative">
                {/* Header with green gradient */}
                <div className="bg-gradient-to-r from-[#111827] to-[#111827] p-6 -m-6 mb-6 rounded-t-lg">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={
                          singleUserData.data.profileImage ||
                          "https://avatar.iran.liara.run/public/44"
                        }
                        alt={singleUserData.data.fullName}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    </div>
                    <div className="text-white">
                      <h2 className="text-3xl font-bold mb-2">
                        {singleUserData.data.fullName}
                      </h2>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          {singleUserData.data.role}
                        </span>
                        <span
                          className={`bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium ${
                            singleUserData.data.status === "ACTIVE"
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {singleUserData.data.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="text-gray-600 text-sm">Email</div>
                    <div className="text-lg font-semibold">
                      {singleUserData.data.email}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="text-gray-600 text-sm">Phone No</div>
                    <div className="text-lg font-semibold">
                      {singleUserData.data.contactNumber || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="text-gray-600 text-sm">Address</div>
                    <div className="text-lg font-semibold">
                      {singleUserData.data.address || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="text-gray-600 text-sm">Country</div>
                    <div className="text-lg font-semibold">
                      {singleUserData.data.country || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="text-gray-600 text-sm">Joined Date</div>
                    <div className="text-lg font-semibold">
                      {new Date(
                        singleUserData.data.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="text-gray-600 text-sm">
                      Stripe Connected
                    </div>
                    <div className="text-lg font-semibold">
                      {singleUserData.data.isStripeConnected ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleViewCancel}
                    className="bg-gray-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default UserDetails;
