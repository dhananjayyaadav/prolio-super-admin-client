import React from "react";
import {
  Building,
  Mail,
  Users,
  FileText,
  Calendar,
  MapPin,
  BarChart2,
  PhoneCall,
  Hash,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Info,
} from "lucide-react";

const InfluencerDetails = ({ influencer, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !influencer) return null;

  const getStatusConfig = (verified) => {
    const status = verified ? "verified" : "pending";
    return status === "verified"
      ? {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          verifyButtonClass: "bg-gray-200 text-gray-500 cursor-not-allowed",
          rejectButtonClass: "bg-rose-500 text-white hover:bg-rose-600",
          statusText: "Verified",
          statusBg: "bg-emerald-100 text-emerald-700",
        }
      : {
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          verifyButtonClass: "bg-emerald-500 text-white hover:bg-emerald-600",
          rejectButtonClass: "bg-rose-500 text-white hover:bg-rose-600",
          statusText: "Pending",
          statusBg: "bg-amber-100 text-amber-700",
        };
  };

  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start space-x-2 p-2 bg-white rounded-lg hover:shadow-md transition-shadow">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-semibold">
          {value || "Not Available"}
        </p>
      </div>
    </div>
  );

  const statusConfig = getStatusConfig(influencer.isInfluencer?.verified);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-gray-50 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl animate-fade-in-down">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-indigo-800 rounded-t-2xl px-4 py-3 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={influencer.profile?.url || "/placeholder.jpg"}
                alt="Profile"
                className="w-12 h-12 object-cover rounded-full ring-3 ring-white/20"
              />
              <span
                className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.statusBg}`}
              >
                {statusConfig.statusText}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {influencer.name || "Influencer Details"}
              </h2>
              <p className="text-purple-200 text-sm">influencer User</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Content Grid */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-4">
            {/* Profile Image */}
            <div className="relative group">
              {influencer.profile?.url ? (
                <img
                  src={influencer.profile.url}
                  alt={`Profile of ${influencer.name}`}
                  className="w-full h-64 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Users className="w-20 h-20 text-indigo-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Documents */}
            {influencer.influencerDetails?.documents?.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Documents
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {influencer.influencerDetails.documents.map((doc, index) => (
                    <a
                      key={doc._id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-50 rounded-lg p-3 flex items-center space-x-2 hover:bg-purple-100 transition-colors group"
                    >
                      <FileText className="text-purple-600 group-hover:scale-105 transition-transform" />
                      <span className="text-sm text-purple-900 font-medium">
                        {doc.documentType || `Document ${index + 1}`}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Columns */}
          <div className="md:col-span-2 space-y-4">
            {/* Personal Information */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Personal Information</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <DetailRow
                  icon={<Users className="w-4 h-4 text-purple-500" />}
                  label="Full Name"
                  value={influencer.name}
                />
                <DetailRow
                  icon={<Mail className="w-4 h-4 text-purple-500" />}
                  label="Email"
                  value={influencer.email}
                />
                <DetailRow
                  icon={<PhoneCall className="w-4 h-4 text-purple-500" />}
                  label="Phone"
                  value={influencer.phone}
                />
                <DetailRow
                  icon={<Info className="w-4 h-4 text-purple-500" />}
                  label="Bio"
                  value={influencer.influencerDetails?.bio}
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>Location Details</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <DetailRow
                  icon={<MapPin className="w-4 h-4 text-purple-500" />}
                  label="Address"
                  value={influencer.influencerDetails?.address}
                />
                <DetailRow
                  icon={<Building className="w-4 h-4 text-purple-500" />}
                  label="City"
                  value={influencer.influencerDetails?.city}
                />
                <DetailRow
                  icon={<MapPin className="w-4 h-4 text-purple-500" />}
                  label="State"
                  value={influencer.influencerDetails?.state}
                />
                <DetailRow
                  icon={<MapPin className="w-4 h-4 text-purple-500" />}
                  label="Country"
                  value={influencer.influencerDetails?.country}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => onUpdateStatus(influencer._id, true)}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${statusConfig.verifyButtonClass}`}
                disabled={influencer.isInfluencer?.verified}
              >
                {influencer.isInfluencer?.verified
                  ? "Verified ✓"
                  : "Verify Influencer"}
              </button>
              <button
                onClick={() => onUpdateStatus(influencer._id, false)}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${statusConfig.rejectButtonClass}`}
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetails;
