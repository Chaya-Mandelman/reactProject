import { createBrowserRouter, Navigate, Outlet } from "react-router"
import Home from "../pages/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import MyGames from "../pages/host/myGames/MyGames"
import EditGame from "../pages/host/editGame/EditGame"
import Lobby from "../pages/host/play/Lobby"
import Question from "../pages/host/play/Question"
import Reveal from "../pages/host/play/Reveal"
import Summary from "../pages/host/play/Summary"
import GamesManagement from "../pages/admin/GamesManagement"
import HostsManagement from "../pages/admin/HostsManagement"
import { AppLayout } from "../layouts/AppLayout"
import Protected from "./Protected"

// Protected עוטף כל הורה פעם אחת, וכל הדפים שבתוכו מוגנים
export const router = createBrowserRouter([
    {
        path: "/",
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            {
                path: "games",
                element: <Protected allow="HOST"><AppLayout /></Protected>,
                children: [
                    { index: true, element: <MyGames /> },
                    { path: "edit/:gameId", element: <EditGame /> },
                ],
            },
            {
                path: "play/:gameId",
                element: <Protected allow="HOST"><Outlet /></Protected>,
                children: [
                    { path: "lobby", element: <Lobby /> },
                    { path: "question", element: <Question /> },
                    { path: "reveal", element: <Reveal /> },
                    { path: "summary", element: <Summary /> },
                ],
            },
            {
                path: "admin",
                element: <Protected allow="ADMIN"><AppLayout /></Protected>,
                children: [
                    { index: true, path: "games", element: <GamesManagement /> },
                    { path: "hosts", element: <HostsManagement /> },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
])
