import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/axios";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Boxes,
  Building2,
  Calendar,
  Loader2,
  Package2,
  Tag,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

const ViewSingleProduct = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    const newSortDirection =
      sortColumn === column
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : "asc";

    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedProducts = [...relatedProducts].sort((a, b) => {
      // Get nested values using reduce
      const valueA =
        column.split(".").reduce((obj, key) => obj?.[key], a) ?? "";
      const valueB =
        column.split(".").reduce((obj, key) => obj?.[key], b) ?? "";

      // Handle different types of values
      if (typeof valueA === "number" && typeof valueB === "number") {
        return newSortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Convert to strings for comparison (handles null/undefined gracefully)
      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();

      return newSortDirection === "asc"
        ? stringA.localeCompare(stringB)
        : stringB.localeCompare(stringA);
    });

    setRelatedProducts(sortedProducts);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/products/get-by-slug/${slug}`);
        if (response.data.success) {
          setProduct(response.data.data);

          // Fetch related products (example - adjust as needed)
          const relatedResponse = await api.get(
            `/admin/products/related/${slug}`
          );
          if (relatedResponse.data.success) {
            setRelatedProducts(relatedResponse.data.data);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Product not found</span>
        </div>
      </div>
    );
  }

  // Render Related Products section
  const renderRelatedProducts = () => {
    if (!relatedProducts.length) return null;

    return (
      <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Related Products</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="text-left cursor-pointer hover:bg-gray-100 p-2"
                onClick={() => handleSort("basicDetails.name")}
              >
                Name
                {sortColumn === "basicDetails.name" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline-block ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline-block ml-2 h-4 w-4" />
                  ))}
              </th>
              <th
                className="text-right cursor-pointer hover:bg-gray-100 p-2"
                onClick={() => handleSort("basicDetails.price")}
              >
                Price
                {sortColumn === "basicDetails.price" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline-block ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline-block ml-2 h-4 w-4" />
                  ))}
              </th>
            </tr>
          </thead>
          <tbody>
            {relatedProducts.map((relProduct) => (
              <tr key={relProduct._id} className="border-t">
                <td className="p-2">{relProduct.basicDetails.name}</td>
                <td className="p-2 text-right">
                  ₹
                  {Number(relProduct.basicDetails.price).toLocaleString(
                    "en-IN"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/products"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Products
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              Product Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="aspect-w-16 aspect-h-9 bg-white">
                <img
                  src={product.images[activeImage]?.url}
                  alt={product.basicDetails.name}
                  className="object-contain w-full h-[400px]"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 border-t">
                <div className="grid grid-cols-8 gap-2">
                  {product.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-square rounded-md overflow-hidden 
                        ${
                          activeImage === idx
                            ? "ring-2 ring-blue-500"
                            : "ring-1 ring-gray-200 hover:ring-blue-300"
                        }`}
                    >
                      <img
                        src={image.url}
                        alt={`Product ${idx + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Product Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {product.basicDetails.description}
              </p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.basicDetails.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">SKU:</span>
                  <span className="text-sm font-medium">
                    {product.basicDetails.id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹
                    {Number(product.basicDetails.price).toLocaleString("en-IN")}
                  </span>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2
            ${
              product.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                    >
                      {product.status}
                      {sortColumn === "status" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card - Make it more responsive */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="divide-y divide-gray-100">
                {/* Category */}
                <div className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Category</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      product.category?.categoryId?.categoryName
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {product.category?.categoryId?.categoryName ||
                      "Not Assigned"}
                  </span>
                </div>

                {/* Brand */}
                <div className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Package2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Brand</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      product.basicDetails?.id
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {product.basicDetails?.id || "Not Assigned"}
                  </span>
                </div>

                {/* Company Information */}
                <div className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Company Details
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {product?.owner?.company?.info?.name || "Not Available"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product?.owner?.company?.info?.businessType || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Owner</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {product.owner?.name || "Not Assigned"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.owner?.email || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="divide-y divide-gray-100">
                {/* Category */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Category</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      product.category?.categoryId?.categoryName
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {product.category?.categoryId?.categoryName ||
                      "Not Assigned"}
                  </span>
                </div>

                {/* Brand */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Brand</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      product.basicDetails?.id
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {product.basicDetails?.id || "Not Assigned"}
                  </span>
                </div>

                {/* Company Information */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Company Details
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {product?.owner?.company?.info?.name || "Not Available"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product?.owner?.company?.info?.businessType || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Owner</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {product.owner?.name || "Not Assigned"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.owner?.email || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(product.updatedAt).toLocaleDateString("en-US", {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {renderRelatedProducts()}
        </div>
      </div>
    </div>
  );
};

export default ViewSingleProduct;
