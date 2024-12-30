import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Register/Login";
import AdminLayout from "./components/Layouts/AdminLayout";
import Landing from "./components/Landing/Landing";
import Category from "./components/Category/Category";
import AddCategory from "./components/Category/AddCategory";
import EditCategory from "./components/Category/EditCategory";
import { useSelector } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Profile from "./components/Settings/Profile";
import CompanyProfiles from "./components/Company/reg_application/CompanyProfiles";
import ReportProduct from "./components/Company/Product_Reports/ReportProduct";
import ForumManagement from "./components/Company/forum/ForumManagement";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import LogPage from "./components/Company/Logs/LogPage";
import CompanyList from "./components/Company/forum/CompanyList";
import ListedCompany from "./components/Company/Logs/ListedCompany";
import BannerManagement from "./components/Banner/BannerManagement";
import Analytics from "./components/Company/analytics/Analytics";
import ProductList from "./components/Company/Product/ProductList";
import ViewSingleProduct from "./components/Company/Product/ViewSingleProduct";
import AllComapnyList from "./components/Company/Product/AllComapnyList";
import InfluencerPage from "./components/Influencer/InfluencerPage";
import OurLogs from "./components/admin-logs/OurLogs";
import BadgeVerificationPage from "./components/Influencer/Verification/BadgeVerificationPage";
// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper component
const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user) {
    // Redirect to dashboard if user is already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const queryClient = new QueryClient();

  const isUserAuthenticated = true; // Replace this with your actual authentication check logic

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect user to /dashboard from root */}
            <Route
              index
              element={
                <Navigate
                  to={isUserAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="influencer" element={<InfluencerPage />} />
            <Route
              path="/influencer-verification"
              element={<BadgeVerificationPage />}
            />
            <Route path="banner" element={<BannerManagement />} />
            <Route path="company-logs" element={<ListedCompany />} />
            <Route path="our-logs" element={<OurLogs />} />
            <Route path="landing" element={<Landing />} />
            <Route path="company-forum" element={<CompanyList />} />
            <Route path="company-products" element={<AllComapnyList />} />
            <Route
              path="/companies/:companyId/forums"
              element={<ForumManagement />}
            />
            <Route
              path="/companies/:companyId/products"
              element={<ForumManagement />}
            />
            <Route path="/companies/:companyId/logs" element={<LogPage />} />
            <Route path="category" element={<Category />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="edit-category/:id" element={<EditCategory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company-profile" element={<CompanyProfiles />} />
            <Route path="/report-product" element={<ReportProduct />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/company/:companyId/products"
              element={<ProductList />}
            />
            <Route path="/view-product/:slug" element={<ViewSingleProduct />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Catch all route - redirect to dashboard if authenticated, else login */}
          <Route
            path="*"
            element={
              <Navigate
                to={isUserAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
