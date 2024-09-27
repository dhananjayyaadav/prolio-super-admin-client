import React from "react";
import { Users, Trash2 } from "react-feather";
import Swal from "sweetalert2";

const ExploreModel = () => {
  // Dummy data to replicate the forum cards
  const forums = Array(8).fill({
    name: "Forum Name",
    description:
      "About Forum est quas magnam facilis qui ipsum quo. Laborum maxime beatae perferendis. Adipisci praesentium ea cupiditate error et. Qui Doloribus atque ests.",
    createdBy: "surya",
    members: 1000,
  });

  const handleDeleteClick = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {   
        Swal.fire("Deleted!", "Your forum has been deleted.", "success");
      }
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-blue-900 text-white py-2 px-4 rounded-t-md">
        <h2 className="text-xl font-semibold">Explore</h2>
      </div>
      <div className="bg-white p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {forums.map((forum, index) => (
            <div
              key={index}
              className="border rounded-md p-4 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white mr-2">
                  <Users size={20} />
                </div>
                <h3 className="font-semibold text-lg">{forum.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {forum.description}
                <a href="#" className="text-blue-600">
                  {" "}
                  Read More
                </a>
              </p>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>Created By: {forum.createdBy}</span>
                <span>Members: {forum.members}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  className="p-2 border rounded text-gray-600 hover:bg-gray-100"
                  onClick={() => handleDeleteClick(index)}
                >
                  <Trash2 size={16} />
                </button>
                <button className="py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                  Join Forum
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreModel;
