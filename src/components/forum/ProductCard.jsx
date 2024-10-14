import React from "react";
import { Camera } from "lucide-react";

const colorClasses = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-teal-200",
];

const ProductCard = ({ title, price, image, colorIndex }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div className={`relative pt-[60%] ${colorClasses[colorIndex]}`}>
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="text-gray-600" size={36} />
        </div>
      )}
    </div>
    <div className="p-3 flex-1 flex flex-col">
      <h3 className="text-sm font-semibold mb-1 line-clamp-1">{title}</h3>
      <p className="text-xs text-gray-600 mb-2">By Anish Industries</p>
      <div className="mt-auto flex justify-between items-center">
        <span className="text-blue-600 font-bold text-sm">₹{price}</span>
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
          Send Enquiry
        </button>
      </div>
    </div>
  </div>
);

const ProductGrid = () => {
  const products = [
    { title: "Casual Shirt", price: 72 },
    { title: "Bluetooth Speaker", price: 89 },
    { title: "Stainless Steel Lunch Box", price: 45 },
    { title: "Digital Camera", price: 299 },
    { title: "Wireless Earbuds", price: 129 },
    { title: "Smartwatch", price: 199 },
    { title: "Leather Wallet", price: 59 },
    { title: "Sunglasses", price: 79 },
    { title: "Backpack", price: 89 },
    { title: "Running Shoes", price: 129 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            {...product}
            colorIndex={index % colorClasses.length}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
