import React, { useState, useEffect } from "react";
import { Calendar, Mail, User, Smartphone, X } from "lucide-react";
import api from "../../services/axios";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getProfileData = async () => {
    try {
      const res = await api.get("/admin/auth/profile");
      setProfileData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    setIsLoading(true);
    try {
      await api.delete(`/admin/auth/removeLoggedInDevice/${deviceId}`);
      // Update the profile data after successful removal
      getProfileData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
              <p className="text-gray-500">Account Details</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Username Section */}
            <div className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-md">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-sm text-gray-900">{profileData.username}</p>
              </div>
            </div>

            {/* Email Section */}
            <div className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-md">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{profileData.email}</p>
              </div>
            </div>

            {/* Logged In Devices Section */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Logged In Devices
              </h3>
              <div className="space-y-4">
                {profileData.loggedInDevice.map((device, index) => (
                  <div
                    key={device._id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          Device {index + 1}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {new Date(device.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDevice(device._id)}
                        disabled={isLoading}
                        className={`
                          p-2 rounded-md
                          hover:bg-red-100 
                          transition-colors
                          ${
                            isLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-red-600"
                          }
                        `}
                        title="Remove device"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
