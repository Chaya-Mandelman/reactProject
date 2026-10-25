
import { createBrowserRouter, Navigate } from "react-router"
import Register from "../pages/login/register"
import Home from "../pages/home"
import EditGame from "../pages/user/editGame"
import Lobby from "../pages/user/lobby"
import MyGames from "../pages/user/myGames"
import Question from "../pages/user/question"
import Reveal from "../pages/user/reveal"
import Summary from "../pages/user/summary"
import GamesManagement from "../pages/admin/gamesManagement"
import HostsManagement from "../pages/admin/hostsManagement"
import { Login } from "../pages/login/Login"
import Protected from "./protected"
import { Header } from "../layouts/header"


export const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                index: true,
                element:<Home /> 
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "games",
                element:<Header/>,
                children: [
                    {
                            index: true,
                            element: <Protected allow={"HOST"}><MyGames /></Protected>,
                    },
                    {
                        path: "edit/:gameId",
                        element: <Protected allow={"HOST"}><EditGame /></Protected>,
                    },
                ],
            },
            {
                path: "play/:gameId",
                children: [
                    {
                        path: "lobby",
                        element: <Protected allow={"HOST"}><Lobby /></Protected>,
                    },
                    {
                        path: "question",
                        element: <Protected allow={"HOST"}><Question /></Protected>,
                    },
                    {
                        path: "reveal",
                        element: <Protected allow={"HOST"}><Reveal /></Protected>,
                    },
                    {
                        path: "summary",
                        element: <Protected allow={"HOST"}><Summary /></Protected>,
                    },
                ]
            },
            {
                path: "admin",
                element:<Header/>,
                children: [
                    {
                        index: true,
                        path: "games",
                        element: <Protected allow={"ADMIN"}><GamesManagement /></Protected>,
                    },
                    {
                        path: "hosts",
                        element: <Protected allow={"ADMIN"}><HostsManagement /></Protected>,
                    }

                ]

            }

        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
],
)
