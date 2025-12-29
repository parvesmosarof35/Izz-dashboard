import { ConfigProvider, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { IoChevronBack, IoAddOutline } from "react-icons/io5";
import { useGetAllAdminsQuery } from "../../redux/api/admin";

export default function CreateAdmin() {
  const navigate = useNavigate();

  // API call to get all admins
  const { data: adminsData, isLoading } = useGetAllAdminsQuery();

  // Transform API data to table format
  const dataSource = useMemo(() => {
    if (!adminsData?.data) return [];

    // Handle different response structures
    const admins = Array.isArray(adminsData.data)
      ? adminsData.data
      : adminsData.data.data || [];

    return admins.map((admin, index) => ({
      key: admin.id || String(index + 1),
      no: String(index + 1),
      name: admin.fullName || admin.name,
      email: admin.email,
      password: "********",
      designation: admin.role || "Admin",
    }));
  }, [adminsData]);

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Password", dataIndex: "password", key: "password" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
  ];

  return (
    <div className="p-5">
      <div className="bg-[#111827] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Create Admin</h1>
        <button
          type="button"
          onClick={() => navigate("/add-admin")}
          className="ml-auto bg-white text-[#111827] px-3 py-1 rounded-md font-semibold flex items-center gap-2 hover:opacity-95 transition cursor-pointer"
        >
          <IoAddOutline className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#111827",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#111827",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
          },
        }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} admins`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </div>
  );
}
