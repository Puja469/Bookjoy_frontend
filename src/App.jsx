import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense,useContext } from "react";
import { InfoContext } from "./context/InfoContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import {useAuth} from "./context/AuthContext.jsx"

// import Register from "./core/public/register"
const Register = lazy(() => import("./core/public/pages/register.jsx"));
const Home = lazy(() => import("./core/public/home.jsx"));
const Layout = lazy(() => import("./core/private/Layout.jsx"));
const Dashboard = lazy(() => import("./core/private/dashboard/dashboard.jsx")

);
const FilteredVenues = lazy(() => import("./core/public/pages/filteredVenues.jsx"));
const VenueDetails = lazy(() => import("./core/public/pages/venueDetails.jsx"));


// const UserForm = lazy(() =>import("./core/private/manageUsers/Form.jsx"))
const AdminLogin = lazy(() => import("./core/private/admin/adminLogin.jsx"));
const Form = lazy(() => import("./core/private/manageVenues/Form.jsx"));

const ManageVenues = lazy(() => import("./core/private/manageVenues/ManageVenues.jsx"));
const ManageTable = lazy(() => import("./core/private/manageVenues/Table.jsx"));
const UserTable = lazy(() => import("./core/private/manageUsers/Table.jsx"));

const MyAccountLayout = lazy(() => import("./core/private/users/MyAccount/MyAccountLayout.jsx"));
// const AccountPage = lazy(() => import("./core/private/users/MyAccount/MyAccount.jsx"));
const ProfileImage = lazy(() => import("./core/private/users/MyAccount/ProfileImage.jsx"));
const MyBookings = lazy(() => import("./core/private/users/MyAccount/MyBookings.jsx"));
const Favorites = lazy(() => import("./core/private/users/MyAccount/Favorites.jsx"));

const BookingForm = lazy(() => import("./core/private/users/Booking/BookingForm.jsx"));
const MenuTier = lazy(() => import("./core/private/users/Booking/MenuTier.jsx"));


function App() {
  const { info } = useContext(InfoContext);
  const { isLoggedIn,role } = useAuth();
  const isAdmin = isLoggedIn && info.role === "admin";
  console.log("App.js Debugging:");
  console.log("isLoggedIn:", isLoggedIn);
  console.log("role:", role);
  const publicRoutes = [
    {
      path: "/",
      element: (
        <Suspense>
          <Home />
        </Suspense>
      ),

    },
    {
      path: "/venues",
      element: (
        <Suspense>
          <FilteredVenues />
        </Suspense>
      ),
    },
    {
      path: "/venue/:id",
      element: (
        <Suspense>
          <VenueDetails />
        </Suspense>
      ),
    },
    {
      path: "/my-account",
      element: (
        <Suspense>
          <MyAccountLayout />
        </Suspense>
      ),
      children: [
        
        {
          path: "profile",
          element: (
            <Suspense>
              <ProfileImage />
            </Suspense>
          ),
        },
        {
          path: "bookings",
          element: (
            <Suspense>
              <MyBookings />
            </Suspense>
          ),
        },
        {
          path: "favorites",
          element: (
            <Suspense>
              <Favorites />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/booking-form",
      element: (
        <Suspense>
          <BookingForm />
        </Suspense>
      ),
    },
    {
      path: "/booking/menu",
      element: (
        <Suspense>
          <MenuTier />
        </Suspense>
      ),
    },
   
    {
      path: "/register",
      element: (
        <Suspense>
          <Register />
        </Suspense>
      ),
      errorElement: <>error</>,
    },
    {
      path: "/admin/login",
      element: (
        <Suspense>
          <AdminLogin />
        </Suspense>
      ),
    },
    { path: "*", element: <>unauthorized</> },
  ];

  const privateRoutes = [
    {
      path: "/admin",
      element: (
        <Suspense>
          <Layout />
          
        </Suspense>
      ),
      errorElement: <>error</>,
      children: [
        

        {
          path: "/admin/dashboard",
          element: (
            <ProtectedRoute requiredRole="admin">
              
              <Dashboard /> 
             
              </ProtectedRoute>
          ),
          errorElement: <>error</>,
        },
       

        
        {
          path: "venues",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute requiredRole="admin">
                  <ManageVenues />
                </ProtectedRoute>
              ),
            },
            {
              path: "create",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <Form />
                </ProtectedRoute>
              ),
            },
            {
              path: "edit/:id",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <Form />
                </ProtectedRoute>
              ),
            },
            {
              path: "table",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <ManageTable />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "users",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute requiredRole="admin">
                  <UserTable />
                </ProtectedRoute>
              ),
            },
          ],
        },
        
      ],
    },

    { path: "*", element: <>Page not found</> },
  ];

  // LOGIN logic TODO
  
  const routes = isAdmin ? privateRoutes : publicRoutes;
  return (
    <>
     
        <RouterProvider router={createBrowserRouter(routes)} />
     
    </>
  );
}

export default App;
