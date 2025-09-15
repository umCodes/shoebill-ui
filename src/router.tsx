import { createBrowserRouter } from "react-router-dom";
import App from './App';
import Lab from "./pages/Lab/Lab";
import History from "./pages/History/History";
import Quiz from "./pages/Quiz/Quiz";
import Feedback from "./pages/Feedback/Feedback";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
                {
                    path: "",
                    element: <Home />
                },
                {
                    path: "lab",
                    element: <Lab />
                },
                {
                    path: "history",
                    element: <History />
                },
                {
                    path: "feedback",
                    element: <Feedback />
                },
                {
                    path: "register",
                    element: <Register />
                },
                {
                    path: "login",
                    element: <Login />
                },
            ]
        },
        {
                path: "/quiz/:id",
                element: <Quiz />,
        }
])