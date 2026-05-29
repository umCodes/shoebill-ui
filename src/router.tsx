import { createBrowserRouter } from "react-router-dom";
import App from './App';
import History from "./pages/History";
import Lab from "./pages/Lab.tsx";
import Quiz from "./pages/Quiz.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                    path: "/",
                    element: <Lab />,
            },
            {
                    path: "/history",
                    element: <History />,
            }
        ]
    },
    {
        path: "/quiz/:id",
        element: <Quiz/>,
    }
])