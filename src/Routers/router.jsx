import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "../Routers/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/Dashboard/Profile";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import AllUsers from "../pages/Dashboard/AllUsers";
import AllBloodDonationRequest from "../pages/Dashboard/AllBloodDonationRequest";
import ContentManagement from "../pages/Dashboard/ContentManagement";
import AddBlog from "../pages/Dashboard/AddBlog";
import Search from "../pages/Search";
import DonationRequests from "../pages/DonationRequests";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/donation-requests",
        Component: DonationRequests,
      },
      {
        path: "/search",
        Component: Search,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/dashboard/profile",
        Component: Profile,
      },
      {
        path: "/dashboard/my-donation-requests",
        Component: MyDonationRequests,
      },
      {
        path: "/dashboard/create-donation-request",
        Component: CreateDonationRequest,
      },
      {
        path: "/dashboard/all-users",
        Component: AllUsers,
      },
      {
        path: "/dashboard/all-blood-donation-request",
        Component: AllBloodDonationRequest,
      },
      {
        path: "/dashboard/content-management",
        Component: ContentManagement,
      },
      {
        path: "/dashboard/content-management/add-blog",
        Component: AddBlog,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;
