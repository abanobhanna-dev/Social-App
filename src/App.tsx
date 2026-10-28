import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Notfound from "./Pages/Notfound/Notfound";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./Context/AuthContext";
import ProdectedRoute from "./Components/ProdectedRoute/ProdectedRoute";
import AuthProdectedRoute from "./Components/ProdectedRoute/AuthProdectedRoute";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import PostDetails from "./Pages/PostDetails/PostDetails";
import { useNetworkState } from "react-use"
import Offline from "./Components/Offline/Offline";
import UserProfile from './Pages/UserProfile/UserProfile';
import ChangePassword from './Pages/ChangePassword/ChangePassword';

const query = new QueryClient()
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children:
      [
        { index: true, element: (<ProdectedRoute> <Home /> </ProdectedRoute>), },
        { path: "home", element: (<ProdectedRoute> <Home /> </ProdectedRoute>), },
        { path: "profile", element: (<ProdectedRoute> <Profile /> </ProdectedRoute>), },
        { path: "postDetails/:id", element: (<ProdectedRoute> <PostDetails /> </ProdectedRoute>), },
        { path: "user/:userId", element: (<ProdectedRoute> <UserProfile /> </ProdectedRoute>) },
        { path: "ChangePassword", element: (<ProdectedRoute> <ChangePassword/> </ProdectedRoute>) },
        { path: "login", element: (<AuthProdectedRoute> <Login /> </AuthProdectedRoute>), },
        { path: "register", element: (<AuthProdectedRoute> <Register /> </AuthProdectedRoute>), },
        { path: "*", element: <Notfound /> },
      ],
  },
]);

function App() {
  const { online } = useNetworkState();

  return (
    <>
      {!online &&
        <Offline />
      }
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <Toaster />
          <RouterProvider router={router} />
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
