import React, { useEffect, useState } from "react";
import {
  getAllComplaints,
  likeComplaint,
} from "../api/complaint/complaintConfig"; // Adjust path if needed
import { useUser } from "../hooks/useUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const ComplaintsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getAllComplaints();
      console.log("Fetched complaints:", data); // Check if complaints data is populated
      setComplaints(data || []); // Ensure we are correctly setting complaints data
    } catch (err) {
      console.error("Error fetching complaints:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (count) => {
    if (count >= 10) return "bg-orange-100"; // Orange shade for counts 10 or more
    if (count >= 5) return "bg-yellow-100"; // Yellow shade for counts between 5 and 9
    return "bg-white"; // White shade for counts less than 5
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

  const handleLike = async (id) => {
    try {
      const data = await likeComplaint(id);
      updateComplaintCount(id, data.complaint.count);
      toast.success("Complaint liked successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error liking complaint:", err.message);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const updateComplaintCount = (id, count) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, count } : c)),
    );
  };

  const hasUserLiked = (complaint) => {
    if (!user || !user.id || !complaint.likedBy) return false;
    return complaint.likedBy.includes(user.id);
  };

  if (loading) return <div className="p-6">Loading complaints...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Complaints</h1>
        <button
          onClick={() => navigate("/report")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Complaint
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Check if complaints exist */}
        {complaints && complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className={`${getCardColor(
                complaint.count,
              )} rounded-2xl shadow-md p-4 border border-gray-200`}
            >
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt={complaint.title}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}

              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold flex-1">
                  {complaint.title}
                </h2>
                {getStatusBadge(complaint.status || "Pending")}
              </div>
              <p className="text-gray-600 mb-1">{complaint.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                📍 {complaint.address}
              </p>

              <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleLike(complaint._id)}
                  disabled={hasUserLiked(complaint)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    hasUserLiked(complaint)
                      ? "bg-red-100 text-red-600 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 active:scale-95"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-all ${hasUserLiked(complaint) ? "fill-current" : ""}`}
                    fill={hasUserLiked(complaint) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg">
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">
                    {complaint.count}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No complaints available</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
