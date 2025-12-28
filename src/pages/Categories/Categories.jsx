import { useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import {
  useCreateSportsTypeCategoryMutation,
  useGetAllSportsTypeCategoriesQuery,
  useUpdateSportsTypeCategoryMutation,
  useDeleteSportsTypeCategoryMutation,
} from "../../redux/api/category";

function Categories() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // API calls
  const { data: categoriesData, isLoading } =
    useGetAllSportsTypeCategoriesQuery();
  const [createSportsTypeCategory, { isLoading: isCreating }] =
    useCreateSportsTypeCategoryMutation();
  const [updateSportsTypeCategory, { isLoading: isUpdating }] =
    useUpdateSportsTypeCategoryMutation();
  const [deleteSportsTypeCategory, { isLoading: isDeleting }] =
    useDeleteSportsTypeCategoryMutation();

  //  API data
  const data = useMemo(() => {
    if (!categoriesData?.data) return [];

    // console.log("API Response:", categoriesData);

    // response structures
    const categories = Array.isArray(categoriesData.data)
      ? categoriesData.data
      : categoriesData.data.data || [];

    // console.log("Categories array:", categories);

    return categories.map((category, index) => ({
      id: category.id,
      sid: String(index + 1).padStart(2, "0"),
      name: category.sportName,
      type: "sports",
      icon: category.sportsImage,
    }));
  }, [categoriesData]);

  const total = data.length;
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  const pages = Math.ceil(total / pageSize) || 1;

  // handle create category
  const handleCreateCategory = async (formData) => {
    try {
      await createSportsTypeCategory(formData).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  // handle edit category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // handle update category
  const handleUpdateCategory = async (formData) => {
    try {
      await updateSportsTypeCategory({
        id: selectedCategory.id,
        credentials: formData,
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  // handle delete category
  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    try {
      await deleteSportsTypeCategory(selectedCategory.id).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // add category modal component
  const AddCategoryModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        !isModalOpen ? "hidden" : ""
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Sports Category</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("sportName", e.target.sportName.value);
            if (e.target.sportsTypeImage.files[0]) {
              formData.append(
                "sportsTypeImage",
                e.target.sportsTypeImage.files[0]
              );
            }
            handleCreateCategory(formData);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sports Name
            </label>
            <input
              type="text"
              name="sportName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]"
              placeholder="Enter sports name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sports Image
            </label>
            <input
              type="file"
              name="sportsTypeImage"
              accept="image/*"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-[#111827] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Edit Category Modal Component
  const EditCategoryModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        !isEditModalOpen ? "hidden" : ""
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Sports Category</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("sportName", e.target.sportName.value);
            if (e.target.sportsTypeImage.files[0]) {
              formData.append(
                "sportsTypeImage",
                e.target.sportsTypeImage.files[0]
              );
            }
            handleUpdateCategory(formData);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sports Name
            </label>
            <input
              type="text"
              name="sportName"
              defaultValue={selectedCategory?.name}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]"
              placeholder="Enter sports name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sports Image (optional)
            </label>
            <input
              type="file"
              name="sportsTypeImage"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-[#111827] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        !isDeleteModalOpen ? "hidden" : ""
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Delete Category</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete &quot;{selectedCategory?.name}&quot;?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedCategory(null);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#111827] px-4 md:px-5 py-3 rounded-md flex items-center justify-between">
        <h1 className="text-white text-xl sm:text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-[#111827] font-semibold px-4 py-2 rounded-md border border-[#111827] cursor-pointer"
        >
          <FiPlus />
          <span>Add Categories</span>
        </button>
      </div>

      {/* table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="border-y px-3 py-2">S.ID</th>
                <th className="border-y px-3 py-2">Category Name</th>
                <th className="border-y px-3 py-2">Category Image/Icon</th>
                <th className="border-y px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="border-b px-3 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-[#111827] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr key={row.id}>
                    <td className="border-b px-3 py-3">{row.sid}</td>
                    <td className="border-b px-3 py-3">{row.name}</td>
                    <td className="border-b px-3 py-3">
                      {row.icon ? (
                        <img
                          src={row.icon}
                          alt={row.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="border-b px-3 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditCategory(row)}
                          className="text-[#111827] hover:opacity-80 cursor-pointer"
                          aria-label="edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(row)}
                          className="text-red-600 hover:opacity-80 cursor-pointer"
                          aria-label="delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* footer / pagination */}
      <div className="flex items-center justify-between text-sm">
        <div>
          SHOWING {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)}{" "}
          OF {total}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-md border flex items-center justify-center ${
                  page === p
                    ? "bg-[#111827] text-white"
                    : "bg-white text-[#111827]"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal />

      {/* Edit Category Modal */}
      <EditCategoryModal />

      {/* Delete Confirmation Modal */}
      <DeleteModal />
    </div>
  );
}

export default Categories;
