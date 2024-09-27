import React from "react";

const DeclineCardModal = ({ request, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <button
          onClick={closeModal}
          className="text-gray-600 hover:text-blue-700"
        >
          &larr; Back
        </button>

        <h2 className="text-xl font-semibold mt-4">Reason for Decline</h2>
        {request && (
          <div className="mt-2">
            <h3 className="text-blue-700 font-semibold">{request.name}</h3>
            <p className="text-gray-500 mt-1">{request.description}</p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Created By:</span>{" "}
              {request.createdBy}
            </p>
            <span className="font-semibold">Members:</span> {request.members}
          </div>
        )}

        <label className="block mt-6 text-gray-700 font-medium">
          Reason (Description)
        </label>
        <textarea
          className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-blue-500"
          placeholder="Add some info"
        />

        <button
          onClick={closeModal}
          className="mt-4 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeclineCardModal;
