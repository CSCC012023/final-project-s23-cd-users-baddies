import GoogleMap from "./GoogleMap";
import "./Discover.css"

export default function DiscoverPosts() {
    return (
        <div className="bodyy">
            <h1 className="title">Discover</h1>
            <div className="map">
                <GoogleMap/>
            </div>
        </div>
    )
}