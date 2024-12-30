import React, { useState, useEffect, useCallback, memo } from "react";
import { debounce } from "lodash";
import api from "../../../services/axios";
import { toast } from "react-toastify";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ProductImage = memo(({ url, alt }) => {
  const [imgState, setImgState] = useState({ error: false, loading: true });

  return (
    <div className="relative h-20 w-20 bg-white rounded-lg overflow-hidden">
      {imgState.loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={imgState.error ? "/placeholder-image.jpg" : url}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-contain transition-opacity duration-200 ${
          imgState.loading ? "opacity-0" : "opacity-100"
        }`}
        onError={() => setImgState((prev) => ({ ...prev, error: true }))}
        onLoad={() => setImgState({ loading: false, error: false })}
      />
    </div>
  );
});

const StatusBadge = memo(({ status }) => {
  const statusConfig = {
    Active: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      ring: "ring-green-600/20",
    },
    In_Active: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      ring: "ring-red-600/20",
    },
  };

  const config = statusConfig[status] || statusConfig.In_Active;

  return (
    <span
      className={`
        px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
        ring-1 ring-inset ${config.bgColor} ${config.textColor} ${config.ring}
      `}
    >
      {status}
    </span>
  );
});

const TableHeader = memo(({ onSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const headers = [
    { key: "image", label: "Image", sortable: false },
    { key: "name", label: "Product Details", sortable: false },
    { key: "status", label: "Status", sortable: false },
    { key: "price", label: "Price", sortable: false },
    { key: "actions", label: "Block/Unblock", sortable: false },
    { key: "View", label: "View", sortable: false },
  ];

  return (
    <thead className="bg-gray-50 border-b">
      <tr>
        {headers.map(({ key, label, sortable }) => (
          <th key={key} className="px-6 py-4 text-left">
            <button
              className={`text-sm font-semibold text-gray-600 flex items-center space-x-1
                ${
                  sortable
                    ? "cursor-pointer hover:text-gray-900"
                    : "cursor-default"
                }
              `}
              onClick={() => sortable && onSort(key)}
              disabled={!sortable}
            >
              <span>{label}</span>
              {sortable && getSortIcon(key)}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
});

const ProductRow = memo(({ product, onBlockToggle, isLoading }) => {
  const status = product.block?.isBlocked ? "In_Active" : "Active";

  console.log("Product Slug:", product.basicDetails.slug);

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <td className="px-6 py-4 whitespace-nowrap">
        <ProductImage
          url={product.images[0]?.url}
          alt={product.basicDetails.name}
        />
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.basicDetails.name}
          </div>
          <div className="text-sm text-gray-500">
            ID: {product.basicDetails.id}
          </div>
          <div className="text-xs text-gray-400 line-clamp-2 max-w-md">
            {product.basicDetails.description}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          ₹{Number(product.basicDetails.price).toLocaleString("en-IN")}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!product.block?.isBlocked}
              onChange={() => onBlockToggle(product.id)}
              disabled={isLoading}
            />
            <div
              className={`
        w-11 h-6 rounded-full peer 
        transition-colors duration-200
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${
          !product.block?.isBlocked
            ? "bg-green-500 peer-hover:bg-green-600"
            : "bg-red-500 peer-hover:bg-red-600"
        }
        after:content-[''] 
        after:absolute 
        after:top-[2px] 
        after:left-[2px]
        after:bg-white 
        after:border-gray-300 
        after:border
        after:rounded-full 
        after:h-5 
        after:w-5 
        after:transition-all
        after:duration-200
        peer-checked:after:translate-x-full
        peer-focus:outline-none 
        peer-focus:ring-2 
        peer-focus:ring-offset-2
        ${
          !product.block?.isBlocked
            ? "peer-focus:ring-green-500"
            : "peer-focus:ring-red-500"
        }
      `}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
            </div>
          </label>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          to={`/view-product/${product.basicDetails.slug}`} // Make sure the slug is in the correct location in your data structure
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm"
        >
          <Eye className="h-4 w-4 mr-1.5 text-gray-500" />
          View Details
        </Link>
      </td>
    </tr>
  );
});

const PaginationButton = memo(
  ({ onClick, disabled, children, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
      px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
      bg-white border border-gray-300 text-gray-700
      hover:bg-gray-50 hover:border-gray-400
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      ${className}
    `}
    >
      {children}
    </button>
  )
);

const PaginationControls = memo(
  ({ page, setPage, totalProducts, limit, loading }) => {
    const totalPages = Math.ceil(totalProducts / limit) || 1; // Add fallback to 1

    // Modify the page numbers logic
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const maxPages = Math.min(5, totalPages);
      let start = Math.max(1, page - delta);
      let end = Math.min(totalPages, start + maxPages - 1);

      // Adjust start if end is at maximum
      start = Math.max(1, end - maxPages + 1);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      return range;
    };

    return (
      <div className="mt-6 flex flex-col items-center space-y-4 px-4">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Page {page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex space-x-2">
            <PaginationButton onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </PaginationButton>
          </div>

          <PaginationButton
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>

          <div className="hidden md:flex space-x-2">
            {getVisiblePages().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                disabled={loading}
                className={`
                    px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      pageNum === page
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  `}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <PaginationButton
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>

          <div className="hidden md:flex space-x-2">
            <PaginationButton
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationButton>
          </div>
        </div>

        {totalPages > 1 && (
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="md:hidden w-24 px-2 py-1 text-sm border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Page {num}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
);

const SearchBar = memo(({ value, onChange, onReset }) => (
  <div className="relative flex items-center">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="search"
      placeholder="Search products..."
      className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    />
    {value && (
      <button
        onClick={onReset}
        className="absolute right-2 text-gray-400 hover:text-gray-600"
      >
        <RefreshCw className="h-5 w-5" />
      </button>
    )}
  </div>
));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loadingStates, setLoadingStates] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Add this for immediate UI update
  const { companyId } = useParams();
  const location = useLocation();
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update UI immediately
    debouncedSearch(value); // Debounce API call
  };

  const handleSort = useCallback((key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const fetchProducts = useCallback(
    async (mounted) => {
      try {
        setLoading(true);
        const response = await api.get(
          `/admin/products/get-all-products/${companyId}`,
          {
            params: {
              page,
              limit,
              sortBy: sortConfig.key,
              sortDirection: sortConfig.direction,
              search: searchTerm,
            },
          }
        );

        if (
          mounted &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setProducts(response.data.data);
          setTotalProducts(response.data.total || response.data.totalCount);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to fetch products");
          toast.error("Failed to fetch products");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    },
    [page, limit, sortConfig, searchTerm]
  );

  const debouncedFetch = useCallback(
    debounce((mounted) => fetchProducts(mounted), 300),
    [fetchProducts]
  );

  useEffect(() => {
    let mounted = true;
    debouncedFetch(mounted);
    return () => {
      mounted = false;
      debouncedFetch.cancel();
      debouncedSearch.cancel();
    };
  }, [debouncedFetch, debouncedSearch]);

  const handleBlockToggle = useCallback(
    async (productId) => {
      try {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));
        const product = products.find((p) => p.id === productId);

        if (!product) return;

        // Check the block object for current status
        const currentBlockedStatus = product.block?.isBlocked || false;

        const response = await api.put(
          `/admin/products/update-product-status/${productId}`,
          {
            isBlocked: !currentBlockedStatus,
          }
        );

        if (response.data.success) {
          setProducts((current) =>
            current.map((p) =>
              p.id === productId
                ? {
                    ...p,
                    block: {
                      ...p.block,
                      isBlocked: !currentBlockedStatus,
                      blockedAt: !currentBlockedStatus
                        ? new Date().toISOString()
                        : null,
                    },
                    status: !currentBlockedStatus ? "In_Active" : "Active",
                  }
                : p
            )
          );
          toast.success(
            `Product ${
              !currentBlockedStatus ? "blocked" : "unblocked"
            } successfully`
          );
        }
      } catch (err) {
        console.error("Failed to update product status:", err);
        toast.error("Failed to update product status");
        let mounted = true;
        fetchProducts(mounted);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [products, fetchProducts]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSortConfig({ key: null, direction: null });
    setPage(1);
  }, []);

  if (!products.length && !loading) {
    return (
      <div className="p-4 text-gray-500 text-center bg-gray-50 rounded-lg">
        No products found.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center bg-red-50 rounded-lg">
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            let mounted = true;
            fetchProducts(mounted);
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 font-poppins">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Products List</h1>
        <div className="w-full md:w-96">
          <SearchBar
            value={searchInput} // Use searchInput instead of searchTerm
            onChange={handleSearchChange}
            onReset={() => {
              setSearchInput("");
              setSearchTerm("");
              setPage(1);
              setSortConfig({ key: null, direction: null });
            }}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto bg-white rounded-lg shadow">
        {loading && products.length > 0 && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
          </div>
        )}
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader onSort={handleSort} sortConfig={sortConfig} />
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onBlockToggle={handleBlockToggle}
                  isLoading={loadingStates[product.id]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControls
        page={page}
        setPage={setPage}
        totalProducts={totalProducts}
        limit={limit}
        loading={loading}
      />
    </div>
  );
};

class ProductErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Product list error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 text-center bg-red-50 rounded-lg">
          <p>Something went wrong! Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// PropTypes
ProductImage.propTypes = {
  url: PropTypes.string,
  alt: PropTypes.string.isRequired,
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(["Active", "In_Active"]).isRequired,
};

TableHeader.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
};

ProductRow.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    basicDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number.isRequired,
    }).isRequired,
    status: PropTypes.oneOf(["Active", "In_Active"]).isRequired,
  }).isRequired,
  onBlockToggle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

PaginationButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PaginationControls.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalProducts: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  loading: PropTypes.bool,
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

ProductErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default function ProductListWrapper() {
  return (
    <ProductErrorBoundary>
      <ProductList />
    </ProductErrorBoundary>
  );
}
