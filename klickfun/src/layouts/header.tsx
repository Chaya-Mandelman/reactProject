import { useContext } from "react";
import { AuthContext } from "../context/user";
import {  Outlet, useNavigate } from "react-router";



export function Header() {

    const { user, logout } = useContext(AuthContext)
const navigate = useNavigate()

    return (
        <><header>
            <div>ברוכה הבאה: {user?.name}</div>
            <button onClick={() => {
                logout()
                navigate("/", { replace: true })
            }}>התנתקות</button>

        </header>
        <Outlet />
        </>
    )
}