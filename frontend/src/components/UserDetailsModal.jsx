import React, { useState, useEffect } from "react";
import { getUserById } from "../api/auth/userConfig";
import { X } from "lucide-react";

const UserDetailsModal = ({ userId, isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(userId);
      setUser(response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Citizen Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading user details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : user ? (
            <div className="space-y-4">
              {/* Profile Picture */}
              {user.profilePic && (
                <div className="flex justify-center mb-4">
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                </div>
              )}

              {/* User Information */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Full Name
                  </label>
                  <p className="text-gray-800 text-lg">{user.fullName}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Email
                  </label>
                  <p className="text-gray-800 break-all">{user.email}</p>
                </div>

                {user.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                )}

                {user.address && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Address
                    </label>
                    <p className="text-gray-800">{user.address}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Role
                  </label>
                  <p className="text-gray-800 capitalize">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </p>
                </div>

               
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
