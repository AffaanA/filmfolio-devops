import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from './Home';
import Login from '../page/Login';
import User from './User/User';
import ErrorElement from "./ErrorElement/ErrorElement";
import Player from './Player/Player';
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
const Routes = () => {
  const { token } = useAuth();
  const routesForPublic = [
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",     
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
            path:'/user',
            element:<ErrorElement />,
        },
        {
            path:'/',
            element:<Home />,
        },
        {
            path:'/home',
            element:<Home/>,
        },
        {
          path: "/player/:movieid",
          element: <Player/>,
        },
        {
            path:'*',
            element:<Navigate to={{pathname:'/home'}} />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    // {
    //   path: "/sign-in",
    //   element: <Login />,
    // },
    {
    path: "/",
      element: <Login />,
      children: [
        {
            path:'/sign-in',
            element:<Login />,
        },
        {
            path:'/',
            element:<Login />,
        },
        {
            path:'*',
            element:<Navigate to={{pathname:'/sign-in'}} />,
        },        
      ],
    },
    // {
    //     path : '/sign-in',
    //     element : <Login />,
    // }

  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;