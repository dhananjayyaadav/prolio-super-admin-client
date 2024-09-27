import React from "react";
import { User } from "lucide-react";

const ParticipantCard = ({ name, companyName, email, number, products }) => (
  <div className="flex bg-white rounded-lg shadow-md p-4 mb-4">
    {/* Left section with user info */}
    <div className="flex-1 pr-4">
      <div className="flex items-center mb-2">
        <User className="w-8 h-8 text-blue-500 mr-2" />
        <div>
          <h3 className="text-lg font-semibold text-blue-600">{name}</h3>
          <p className="text-sm text-gray-500">
            {companyName} &nbsp;&nbsp;@{email} &nbsp;&nbsp;@{number}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Doloribus atque est quas magnam facilis qui ipsum quo. Laborum maxime
        beatae perferendis. Adipisci praesentium ea cupiditate error et.
        <span className="text-blue-500 cursor-pointer"> Read More</span>
      </p>
    </div>

    {/* Middle separator line */}
    <div className="w-px bg-gray-300 mx-4"></div>

    {/* Right section with products */}
    <div className="w-1/3 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-md font-semibold">Products</h4>
        <a href="#" className="text-blue-500 text-sm font-medium">
          View Products
        </a>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-gray-200 w-12 h-12 flex items-center justify-center rounded-full"
          >
            <span className="text-xs text-gray-600">{product}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MembersModal = () => {
  const participants = [
    {
      name: "Surya Suri",
      companyName: "Company name",
      email: "Company mail ID",
      number: "Number",
      products: [
        "Riders",
        "Riders",
        "trimmers",
        "trimmers",
        "Pole saws",
        "trimmers",
        "Pole saws",
      ],
    },
    {
      name: "jai sai",
      companyName: "Company name",
      email: "Company mail ID",
      number: "Number",
      products: [
        "Riders",
        "Riders",
        "trimmers",
        "trimmers",
        "Pole saws",
        "trimmers",
        "Pole saws",
      ],
    },
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      {participants.map((participant, index) => (
        <ParticipantCard key={index} {...participant} />
      ))}
    </div>
  );
};

export default MembersModal;
