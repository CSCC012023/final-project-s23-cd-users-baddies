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
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
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
    if (userData.userType === 'customer' && userData.posts) {
      userData.posts.forEach((post) => {
        if (post.status === 'posted') { // Filter posts by status
          posts.push(post);
        }
      });
    }
  });

  return posts;
};

export class MapContainer extends Component {
  _isMounted = false;
  
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPost: null,
      posts: [],
      notification: null,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    const posts = await getPostsFromCustomers();
    this.setState({ posts: posts });
    document.addEventListener('click', this.logPost);

  }

  async handlePostTransfer(post) {
    // Find the original poster
    const originalPosterRef = doc(db, 'Users', post.postedBy);  // assuming 'postedBy' field in each post contains the id of the original poster
    
    // Get the original post data to check if the 'messages' field exists
    const docSnap = await getDoc(originalPosterRef);
    
    // Get the current user
    const currentUser = this.context;   // Current user from the context
    const currentUserRef = doc(db, 'Users', currentUser.uid);  // assuming 'uid' field in the context contains the id of the current user
    
    // Create the message
    const messageToAdd = {
      senderId: currentUser.uid,
      postId: post.id,
      senderName: currentUser.Business.Name,
      text: `Hi, I'm ${currentUser.Business.Name} and I would like to accept your gig.`,
      timestamp: Date.now(),
      type: "response"
    };
  
    // If the 'messages' field doesn't exist, create it
    if (!docSnap.data().messages) {
      await setDoc(originalPosterRef, {
        messages: [messageToAdd]
      }, { merge: true });  // the { merge: true } option makes sure that the rest of the document is not overwritten
    }
    // If it does exist, just add a new message
    else { 
      await updateDoc(originalPosterRef, {
        messages: arrayUnion(messageToAdd)
      });
    }
  
    console.log("Message sent");
    this.setState({
      notification: 'A message has been sent to the original poster.'
    });
  }
  
  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener('click', this.logPost);
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      notification: null
    });
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
    this.handlePostTransfer(this.state.selectedPost);
  }

  logPost = (event) => {
    // Check if the clicked element is the Log Post button
    if (event.target && event.target.id === 'logPostButton') {
      this.handleButtonClick(this.state.selectedPost);
    }
  }

   infoWindowContent = () => {
    const user = this.context;
    const selectedPost = this.state.selectedPost;
    return (
      <div style={{ color: 'black' }}>
        <h2>{selectedPost?.title}</h2>
        <p>Price: {selectedPost?.price}</p>
        {user.userType === 'business' &&
          // Add an id to the button so we can identify it in the event listener
          <button id='logPostButton'>Grab Gig</button>
        }
      </div>
    );
  }

  render() {
    const user = this.context;
    return (
      <div>
        {this.state.notification && 
          <div className="notification">
            {this.state.notification}
          </div>
        }
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
              position={{ lat: post.location.lat, lng: post.location.lon }} />  // Ensure the post has location property with lat and lng
          ))}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            {this.infoWindowContent()}
          </InfoWindow>
        </Map>
      </div>
    );

  }
}

export default GoogleApiWrapper({
  apiKey: ('CHANGE_WITH_PEROSNAL')
})(MapContainer)
