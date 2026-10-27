import { createBrowserRouter, Navigate, Outlet } from "react-router"
import { AppLayout } from "@/layouts/AppLayout"
import Home from "@/pages/Home"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import MyGames from "@/pages/host/myGames/MyGames"
import EditGame from "@/pages/host/editGame/EditGame"
import Lobby from "@/pages/host/play/lobby/Lobby"
import Game from "@/pages/host/play/game/Game"
import GamesManagement from "@/pages/admin/GamesManagement"
import HostsManagement from "@/pages/admin/HostsManagement"
import { Protected } from "./Protected"

export const router = createBrowserRouter([
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
      { path: "game", element: <Game /> },
    ],
  },
  {
    path: "admin",
    element: <Protected allow="ADMIN"><AppLayout /></Protected>,
    children: [
      { index: true, element: <Navigate to="games" replace /> },
      { path: "games", element: <GamesManagement /> },
      { path: "hosts", element: <HostsManagement /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
])
