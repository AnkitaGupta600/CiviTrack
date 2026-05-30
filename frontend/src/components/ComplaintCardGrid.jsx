// components/ComplaintCardGrid.jsx

import React, { useState } from "react";
import UserDetailsModal from "./UserDetailsModal";

const ComplaintCardGrid = ({
  complaints = [],
  title = "Complaints",
  showCount = true,
  actionComponent = null, // Callback that returns JSX based on complaint
  showUserDetails = false, // Show user details button
}) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const getCardColor = (count) => {
    if (count >= 10) return "bg-orange-100";
    if (count >= 5) return "bg-yellow-100";
    return "bg-white";
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      "In Progress": "bg-blue-100 text-blue-800 border border-blue-300",
      Resolved: "bg-green-100 text-green-800 border border-green-300",
      Rejected: "bg-red-100 text-red-800 border border-red-300",
    };

    const statusIcons = {
      Pending: "⏳",
      "In Progress": "🔄",
      Resolved: "✅",
      Rejected: "❌",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.Pending}`}
      >
        {statusIcons[status]} {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className={`${getCardColor(
                complaint.count || 0,
              )} rounded-2xl shadow-md p-4 border border-gray-200`}
            >
              {complaint.image && (
                <img
                  src={`${complaint.image}`}
                  alt={complaint.title}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}

              <div className="flex justify-between items-start mb-3 gap-2">
                <h2 className="text-xl font-semibold flex-1">
                  {complaint.title}
                </h2>
                <div className="flex items-start gap-2">
                  {showUserDetails && complaint.userId && (
                    <button
                      onClick={() => {
                        setSelectedUserId(complaint.userId?._id || complaint.userId);
                        setModalOpen(true);
                      }}
                      className="flex-shrink-0 bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition"
                      title="View citizen details"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                  )}
                  {getStatusBadge(complaint.status || "Pending")}
                </div>
              </div>
              <p className="text-gray-600 mb-1">{complaint.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                📍 {complaint.address}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Urgency: {complaint.urgency}
              </p>

              <div className="flex items-center justify-between">
                {showCount && (
                  <span className="text-xs text-gray-600">
                    👍 {complaint.count}
                  </span>
                )}
                {actionComponent && <div>{actionComponent(complaint)}</div>}
              </div>
            </div>
          ))
        ) : (
          <p>No complaints found.</p>
        )}
      </div>
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default ComplaintCardGrid;
