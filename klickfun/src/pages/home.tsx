
import { Link } from "react-router"

function Home(){
return(
    <>
    <div>Home</div>
    <Link to="/login">כניסה</Link>
    <Link to="/register">הרשמה</Link>
    </>
)
}
export default Home