import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { initializeApp } from "firebase/app";
import { UserContext } from '../User/UserContext';
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,  getDocs, collection
} from "firebase/firestore";

const style = {
  width: '75%',
  height: '60%',
  overflowX: 'hidden'
}
const containerStyle = {
  width: '70vw',
  height: '100vh',
  overflowX: 'hidden'
}
const firebaseConfig = {
  apiKey: "CHANGE_WITH_PEROSNAL",
  authDomain: "cd-user-baddies.firebaseapp.com",
  projectId: "cd-user-baddies",
  storageBucket: "cd-user-baddies.appspot.com",
  messagingSenderId: "CHANGE_WITH_PEROSNAL",
  appId: "1:CHANGE_WITH_PEROSNAL:web:5c6ee1f310aec572c34df5",
  measurementId: "G-4026EEFZZ3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const getPostsFromCustomers = async () => {
  const querySnapshot = await getDocs(collection(db, 'Users'));
  const posts = [];

  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.userType === 'customer' && userData.Posts) {
      userData.Posts.forEach((post) => {
        posts.push(post);
      });
    }
  });

  return posts;
};

export class MapContainer extends Component {
  _isMounted = false;
  
  static contextType = UserContext;

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPost: null,
    posts: []
  };

  async componentDidMount() {
    this._isMounted = true;
    const posts = await getPostsFromCustomers();
    console.log(posts);
    this.setState({ posts: posts });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onMarkerClick = (props, marker, e) => {
    if (this._isMounted) {
      this.setState({
        selectedPost: props.post,
        activeMarker: marker,
        showingInfoWindow: true
      });
    }
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  handleButtonClick = () => {
    console.log(this.state.selectedPost);
  }

  render() {
    const user = this.context;
    return (
      <div>
        <Map
          containerStyle={containerStyle}
          resetBoundsOnResize={true}
          style={style}
          google={this.props.google}
          onClick={this.onMapClicked}
          zoom={10}
          initialCenter={{
            lat: 43.653225,
            lng: -79.383186
          }}
        >
          {this.state.posts.map((post, index) => (
            <Marker
              key={index}
              onClick={this.onMarkerClick}
              name={post.title}
              post={post}
              position={{ lat: post.location.lat, lng: post.location.lon }} />
          ))}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            <div style={{ color: 'black' }}>
              <h2>{this.state.selectedPost?.title}</h2>
              <p>Price: {this.state.selectedPost?.price}</p>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCslCplJhzh8rKxQ0c6xZSv7UlILmWUiys')
})(MapContainer)
