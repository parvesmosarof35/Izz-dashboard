import { ConfigProvider, Table } from "antd";
import PropTypes from "prop-types";

const RecentUsers = ({ recentUsers = [] }) => {
  const dataSource = recentUsers.slice(0, 10).map((user) => ({
    key: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: "N/A", // API doesn't provide phone
    joined: new Date(user.createdAt).toLocaleDateString(),
    profileImage: user.profileImage,
    status: user.status,
  }));

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
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
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phone", key: "phone" },
    { title: "Joined Date", dataIndex: "joined", key: "joined" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
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
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </>
  );
};

RecentUsers.propTypes = {
  recentUsers: PropTypes.array,
};

export default RecentUsers;
