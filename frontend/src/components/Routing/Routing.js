import Navbar from "../Navbar/Navbar";
import { Route, Routes } from "react-router-dom"
import Profile from "../Profile/Profile";
import Post from "../Post/Post"
import DiscoverPosts from "../Discover/DiscoverPosts";
import DiscoverBusinesses from "../Discover/DiscoverBusinesses";
import Home from "../Home/Home";
import MyGigs from "../MyGigs/MyGigs";
import MyPosts from "../MyPosts/MyPosts";
import MyBusiness from "../MyBusiness/MyBusiness";
import BusniessRegistration from "../Login/BusinessRegistration";

export default function Routing({ user, userType }) {
    return (
        <div>
            <Navbar user={user} userType={userType}/>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/discoverPosts" element={<DiscoverPosts />} />
                    <Route path="/discoverBusinesses" element={<DiscoverBusinesses />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/myposts" element={<MyPosts />} />
                    <Route path="/mygigs" element={<MyGigs />} />
                    <Route path="/mybusiness" element={<MyBusiness />} />
                    <Route path="/businessregistration" element={<BusniessRegistration />} />
                </Routes>
            </div>
        </div>
    )
}