import { useState, useEffect } from "react";
import { Modal } from "antd";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { FaPen, FaTrash } from "react-icons/fa";
import {
  useGetGamificationQuery,
  useUpdateGamificationMutation,
  useGetAllBadgesQuery,
  useGetLevelsAllQuery,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
  useToggleBadgeStatusMutation,
  useDeleteBadgeMutation,
  useCreateBadgeMutation,
} from "../../redux/api/gamification";

import explorer from "../../assets/Explorer.png";

function Gamification() {
  // API integration
  const { data: gamificationData } = useGetGamificationQuery();
  const { data: badgesData } = useGetAllBadgesQuery();
  const { data: levelsData } = useGetLevelsAllQuery();
  const [updateGamification, { isLoading: isUpdating }] =
    useUpdateGamificationMutation();
  const [updateLevel, { isLoading: isUpdatingLevel }] = useUpdateLevelMutation();
  const [deleteLevel, { isLoading: isDeletingLevel }] = useDeleteLevelMutation();
  const [toggleBadgeStatus] = useToggleBadgeStatusMutation();
  const [deleteBadge, { isLoading: isDeletingBadge }] =
    useDeleteBadgeMutation();
  const [createBadge, { isLoading: isCreatingBadge }] =
    useCreateBadgeMutation();

  // Initialize with defaults
  const [xpSettings, setXpSettings] = useState([]);

  // Sync with API data when it loads
  useEffect(() => {
    if (gamificationData?.data) {
      const data = gamificationData.data; // Extract the actual data
      const apiSettings = [
        {
          key: "xpPerBooking",
          label: "XP per booking",
          value: data.xpPerBooking ?? 10,
        },
        {
          key: "xpPerReview",
          label: "XP per review",
          value: data.xpPerReview ?? 5,
        },
        {
          key: "xpPerReferral",
          label: "XP per referral",
          value: data.xpPerReferral ?? 50,
        },
        {
          key: "xpPerChallenge",
          label: "XP per challenge",
          value: data.xpPerChallenge ?? 25,
        },
        {
          key: "xpPerDailyLogin",
          label: "XP per daily login",
          value: data.xpPerDailyLogin ?? 2,
        },
        {
          key: "streakBonusXP",
          label: "Streak bonus XP",
          value: data.streakBonusXP ?? 5,
        },
        {
          key: "referralPointsReward",
          label: "Referral points reward",
          value: data.referralPointsReward ?? 10,
        },
        {
          key: "pointsToXPConversion",
          label: "Points to XP conversion",
          value: data.pointsToXPConversion ?? 0.1,
        },
      ];

      setXpSettings(apiSettings);
    }
  }, [gamificationData]);

  // Initialize badges with defaults
  const [badges, setBadges] = useState([]);

  // Sync badges with API data when it loads
  useEffect(() => {
    if (badgesData?.data) {
      const apiBadges = badgesData.data.map((badge) => ({
        id: badge.id,
        name: badge.name,
        desc: badge.description,
        icon: badge.iconUrl || explorer, // Fallback to local icon
        active: badge.isActive,
        badgeType: badge.badgeType,
        xpReward: badge.xpReward,
        pointsReward: badge.pointsReward,
      }));
      setBadges(apiBadges);
    }
  }, [badgesData]);

  // Initialize levels with defaults
  const [levels, setLevels] = useState([]);

  // Sync levels with API data when it loads
  useEffect(() => {
    if (levelsData?.data) {
      const apiLevels = levelsData.data.map((level) => ({
        id: level.id,
        level: level.title,
        range: `${level.minXP} - ${level.maxXP}`,
        benefits: level.benefits.join(", "),
        status: `${Math.round(
          (level.minXP /
            (levelsData.data[levelsData.data.length - 1]?.maxXP || 9999)) *
            100
        )}%`,
      }));
      setLevels(apiLevels);
    }
  }, [levelsData]);

  // Modals state
  const [badgeToDelete, setBadgeToDelete] = useState(null);
  const [levelToDelete, setLevelToDelete] = useState(null);
  const [levelToEdit, setLevelToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    level: "",
    range: "",
    benefits: "",
    status: "",
  });

  // Create badge state
  const [showCreateBadgeModal, setShowCreateBadgeModal] = useState(false);
  const [createBadgeForm, setCreateBadgeForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
    iconFile: null, // Add file state
    badgeType: "FIRST_BOOKING",
    xpReward: 0,
    pointsReward: 0,
  });

  const inc = async (idx) => {
    const newValue = xpSettings[idx].value + 1;

    // Update local state immediately for UI responsiveness
    setXpSettings((arr) =>
      arr.map((r, i) => (i === idx ? { ...r, value: newValue } : r))
    );

    // Update API immediately
    try {
      const settingKey = xpSettings[idx].key;
      const settingsData = { [settingKey]: newValue };
      await updateGamification(settingsData).unwrap();
    } catch (error) {
      console.error("Failed to update setting:", error);
      // Revert on error
      setXpSettings((arr) =>
        arr.map((r, i) => (i === idx ? { ...r, value: r.value - 1 } : r))
      );
    }
  };

  const dec = async (idx) => {
    const newValue = Math.max(0, xpSettings[idx].value - 1);

    // Update local state immediately for UI responsiveness
    setXpSettings((arr) =>
      arr.map((r, i) => (i === idx ? { ...r, value: newValue } : r))
    );

    // Update API immediately
    try {
      const settingKey = xpSettings[idx].key;
      const settingsData = { [settingKey]: newValue };
      await updateGamification(settingsData).unwrap();
    } catch (error) {
      console.error("Failed to update setting:", error);
      // Revert on error
      setXpSettings((arr) =>
        arr.map((r, i) => (i === idx ? { ...r, value: r.value + 1 } : r))
      );
    }
  };
  const toggleBadge = async (id) => {
    try {
      const badge = badges.find((b) => b.id === id);
      if (badge) {
        await toggleBadgeStatus({
          badgeId: id,
          isActive: !badge.active,
        }).unwrap();
        // Update local state immediately for UI responsiveness
        setBadges((arr) =>
          arr.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
        );
      }
    } catch (error) {
      console.error("Failed to toggle badge status:", error);
    }
  };

  const askDeleteBadge = (id) =>
    setBadgeToDelete(badges.find((b) => b.id === id) || null);

  const confirmDeleteBadge = async () => {
    if (badgeToDelete) {
      try {
        const badgeId =
          typeof badgeToDelete.id === "string"
            ? badgeToDelete.id
            : badgeToDelete.id.toString();
        await deleteBadge(badgeId).unwrap(); // Pass badgeId directly, not wrapped in object
        // Update local state immediately for UI responsiveness
        setBadges((arr) => arr.filter((b) => b.id !== badgeToDelete.id));
        setBadgeToDelete(null);
      } catch (error) {
        console.error("Failed to delete badge:", error);
      }
    }
  };
  const cancelDeleteBadge = () => setBadgeToDelete(null);

  // Create badge functions
  const openCreateBadgeModal = () => setShowCreateBadgeModal(true);
  const closeCreateBadgeModal = () => {
    setShowCreateBadgeModal(false);
    setCreateBadgeForm({
      name: "",
      description: "",
      iconUrl: "",
      iconFile: null, // Reset iconFile state
      badgeType: "FIRST_BOOKING",
      xpReward: 0,
      pointsReward: 0,
    });
  };

  const handleCreateBadgeFormChange = (field, value) => {
    // Convert numeric fields to numbers
    const processedValue =
      field === "xpReward" || field === "pointsReward"
        ? value === ""
          ? 0
          : Number(value)
        : value;

    setCreateBadgeForm((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCreateBadgeForm((prev) => ({
          ...prev,
          iconUrl: dataUrl,
          iconFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBadge = async () => {
    try {
      // Ensure numeric values are properly converted
      const formData = {
        ...createBadgeForm,
        xpReward: Number(createBadgeForm.xpReward) || 0,
        pointsReward: Number(createBadgeForm.pointsReward) || 0,
      };
      await createBadge(formData).unwrap();
      // Reset form and close modal
      closeCreateBadgeModal();
    } catch (error) {
      console.error("Failed to create badge:", error);
    }
  };

  const askEditLevel = (id) =>
    setLevelToEdit(levels.find((l) => l.id === id) || null);
  const confirmEditLevel = async () => {
    if (levelToEdit) {
      try {
        const levelData = {
          title: editForm.level,
          minXP: parseInt(editForm.range.split(" - ")[0]),
          maxXP: parseInt(editForm.range.split(" - ")[1]),
          benefits: editForm.benefits.split(", "),
        };
        await updateLevel({
          levelId: levelToEdit.id,
          levelData,
        }).unwrap();
        setLevelToEdit(null);
        setEditForm({
          level: "",
          range: "",
          benefits: "",
          status: "",
        });
      } catch (error) {
        console.error("Failed to update level:", error);
      }
    }
  };

  const askDeleteLevel = (id) =>
    setLevelToDelete(levels.find((l) => l.id === id) || null);
  const confirmDeleteLevel = async () => {
    if (levelToDelete) {
      try {
        await deleteLevel(levelToDelete.id).unwrap();
        setLevels((arr) => arr.filter((l) => l.id !== levelToDelete.id));
        setLevelToDelete(null);
      } catch (error) {
        console.error("Failed to delete level:", error);
      }
    }
  };
  const cancelDeleteLevel = () => setLevelToDelete(null);

  const openEditLevel = (lvl) => {
    setLevelToEdit(lvl);
    setEditForm({
      level: lvl.level,
      range: lvl.range,
      benefits: lvl.benefits,
      status: lvl.status,
    });
  };
  const cancelEditLevel = () => setLevelToEdit(null);
  
  const saveEditLevel = () => {
    if (!levelToEdit) return;
    setLevels((arr) =>
      arr.map((l) =>
        l.id === levelToEdit.id
          ? {
              ...l,
              level: editForm.level,
              range: editForm.range,
              benefits: editForm.benefits,
              status: editForm.status,
            }
          : l
      )
    );
    setLevelToEdit(null);
  };

  // Save all gamification settings
  const saveAllSettings = async () => {
    try {
      const settingsData = xpSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      await updateGamification(settingsData).unwrap();
      // Show success message (optional)
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111827] px-4 md:px-5 py-3 rounded-md">
        <h1 className="text-white text-xl sm:text-2xl font-bold">
          Gamification Points
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* XP to points conversion rate */}
        <div className="border rounded-lg p-4">
          <h2 className="text-base font-semibold mb-3">
            XP to points conversion rate
          </h2>
          <div className="space-y-3">
            {xpSettings.map((row, idx) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-[#0D0D0D]">{row.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dec(idx)}
                    className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    aria-label="decrease"
                  >
                    <IoRemoveOutline />
                  </button>
                  <input
                    className="w-16 text-center border rounded-md py-1"
                    value={row.value}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0;
                      setXpSettings((arr) =>
                        arr.map((r, i) => (i === idx ? { ...r, value: v } : r))
                      );
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => inc(idx)}
                    className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    aria-label="increase"
                  >
                    <IoAddOutline />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">
              Badges & Achievements Management
            </h2>
            <button
              type="button"
              onClick={openCreateBadgeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Create Badge
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className="border rounded-lg p-3 flex items-start justify-between"
              >
                <div className="flex gap-2">
                  <img src={b.icon} alt={b.name} className="w-8 h-8" />
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBadge(b.id)}
                    className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                      b.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {b.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => askDeleteBadge(b.id)}
                    className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level & Rewards */}
      <div className="border rounded-lg p-4">
        <h2 className="text-base font-semibold mb-3">Level & Rewards</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="border-y px-3 py-2">Level</th>
                <th className="border-y px-3 py-2">Xp Range</th>
                <th className="border-y px-3 py-2">Benifits</th>
                <th className="border-y px-3 py-2">Status</th>
                <th className="border-y px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((l) => (
                <tr key={l.id}>
                  <td className="border-b px-3 py-2">{l.level}</td>
                  <td className="border-b px-3 py-2">{l.range}</td>
                  <td className="border-b px-3 py-2">{l.benefits}</td>
                  <td className="border-b px-3 py-2">{l.status}</td>
                  <td className="border-b px-3 py-2">
                    <div className="flex items-center gap-3 text-[#111827]">
                      <button
                        type="button"
                        className="hover:opacity-80 cursor-pointer"
                        aria-label="edit"
                        onClick={() => openEditLevel(l)}
                      >
                        <FaPen />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 cursor-pointer"
                        aria-label="delete"
                        onClick={() => askDeleteLevel(l.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Badge Modal */}
      <Modal
        open={!!badgeToDelete}
        onCancel={cancelDeleteBadge}
        onOk={confirmDeleteBadge}
        okText={isDeletingBadge ? "Deleting..." : "Delete"}
        okButtonProps={{ danger: true }}
        confirmLoading={isDeletingBadge}
        title="Delete Badge"
      >
        {badgeToDelete && (
          <p>
            Are you sure you want to delete the badge &quot;{badgeToDelete.name}
            &quot;?
          </p>
        )}
      </Modal>

      {/* Delete Level Modal */}
      <Modal
        open={!!levelToDelete}
        onCancel={cancelDeleteLevel}
        onOk={confirmDeleteLevel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={isDeletingLevel}
        title="Delete Level"
      >
        {levelToDelete && (
          <p>
            Are you sure you want to delete the level &quot;
            {levelToDelete.level}&quot;?
          </p>
        )}
      </Modal>

      {/* Edit Level Modal */}
      <Modal
        open={!!levelToEdit}
        onCancel={cancelDeleteLevel}
        onOk={confirmEditLevel}
        okText="Save"
        confirmLoading={isUpdatingLevel}
        title="Edit Level"
      >
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Level"
            value={editForm.level}
            onChange={(e) =>
              setEditForm({ ...editForm, level: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Range"
            value={editForm.range}
            onChange={(e) =>
              setEditForm({ ...editForm, range: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Benefits"
            value={editForm.benefits}
            onChange={(e) =>
              setEditForm({ ...editForm, benefits: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Status"
            value={editForm.status}
            onChange={(e) =>
              setEditForm({ ...editForm, status: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </Modal>

      {/* Create Badge Modal */}
      <Modal
        open={showCreateBadgeModal}
        onCancel={closeCreateBadgeModal}
        onOk={handleCreateBadge}
        okText={isCreatingBadge ? "Creating..." : "Create Badge"}
        confirmLoading={isCreatingBadge}
        title="Create New Badge"
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Badge Name Field */}
          <div className="space-y-2">
            <label htmlFor="badge-name" className="block text-sm font-medium">
              Badge Name
            </label>
            <input
              id="badge-name"
              type="text"
              name="name"
              placeholder="Badge Name"
              value={createBadgeForm.name}
              onChange={(e) =>
                handleCreateBadgeFormChange("name", e.target.value)
              }
              className="w-full p-2 border rounded"
              aria-label="Badge Name"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="badge-description"
              className="block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="badge-description"
              name="description"
              placeholder="Description"
              value={createBadgeForm.description}
              onChange={(e) =>
                handleCreateBadgeFormChange("description", e.target.value)
              }
              className="w-full p-2 border rounded"
              rows={3}
              aria-label="Badge Description"
            />
          </div>

          {/* Icon Upload Field */}
          <div className="space-y-2">
            <label htmlFor="badge-icon" className="block text-sm font-medium">
              Badge Icon
            </label>
            <input
              id="badge-icon"
              type="file"
              name="icon"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
              aria-label="Badge Icon Upload"
            />
            {createBadgeForm.iconUrl && (
              <div className="mt-3">
                <img
                  src={createBadgeForm.iconUrl || "/placeholder.svg"}
                  alt="Badge preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleCreateBadgeFormChange("iconUrl", "")}
                  className="mt-2 text-red-600 text-sm hover:text-red-700"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Badge Type Field */}
          <div className="space-y-2">
            <label htmlFor="badge-type" className="block text-sm font-medium">
              Badge Type
            </label>
            <select
              name="badgeType"
              value={createBadgeForm.badgeType}
              onChange={(e) =>
                handleCreateBadgeFormChange("badgeType", e.target.value)
              }
              className="w-full p-2 border rounded"
              aria-label="Badge Type"
            >
              <option value="FIRST_BOOKING">First Booking</option>
              <option value="REVIEW_MASTER">Review Master</option>
              <option value="REFER_CHAMPION">Referral Champion</option>
              <option value="STREAK_MASTER">Streak Master</option>
              <option value="CHALLENGE_WINNER">Challenge Winner</option>
              <option value="ELITE_USER">Elite User</option>
              <option value="VIP_MEMBER">VIP Member</option>
              <option value="SPEED_BOOKER">Speed Booker</option>
              <option value="LOYAL_CUSTOMER">Loyal Customer</option>
              <option value="EXPLORER">Explorer</option>
            </select>
          </div>

          {/* XP Reward Field */}
          <div className="space-y-2">
            <label htmlFor="badge-xp" className="block text-sm font-medium">
              XP Reward
            </label>
            <input
              id="badge-xp"
              type="number"
              name="xpReward"
              placeholder="XP Reward"
              value={createBadgeForm.xpReward}
              onChange={(e) =>
                handleCreateBadgeFormChange(
                  "xpReward",
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full p-2 border rounded"
              aria-label="XP Reward"
            />
          </div>

          {/* Points Reward Field */}
          <div className="space-y-2">
            <label htmlFor="badge-points" className="block text-sm font-medium">
              Points Reward
            </label>
            <input
              id="badge-points"
              type="number"
              name="pointsReward"
              placeholder="Points Reward"
              value={createBadgeForm.pointsReward}
              onChange={(e) =>
                handleCreateBadgeFormChange(
                  "pointsReward",
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full p-2 border rounded"
              aria-label="Points Reward"
            />
          </div>
        </div>
      </Modal>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAllSettings}
          disabled={isUpdating}
          className="bg-[#111827] text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}

export default Gamification;
