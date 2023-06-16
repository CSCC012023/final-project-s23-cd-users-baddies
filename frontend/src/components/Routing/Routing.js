import Navbar from "../Navbar/Navbar";
import { Route, Routes } from "react-router-dom"
import Profile from "../Profile/Profile";
import Discover from "../Discover/Discover";
import Home from "../Home/Home";

export default function Routing() {
    return (
        <div>
            <Navbar/>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/discover" element={<Discover />} />
                </Routes>
            </div>
        </div>
    )
}