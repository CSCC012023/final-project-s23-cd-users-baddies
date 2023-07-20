import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { UserContext } from '../../User/UserContext';
import { fetchPosts, applyForGig, listenForNewPosts } from './googleMapService';
import '../../../firebase/firebase'
import './MapInfoWindow';
import './MapMarker'

const style = {
  width: '75%',
  height: '60%',
  overflowX: 'hidden'
};
const containerStyle = {
  width: '70vw',
  height: '100vh',
  overflowX: 'hidden'
};

export class GoogleMapContainer extends Component {
  _isMounted = false;

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPost: null,
      posts: [],
      notification: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    // Fetch all posts from the backend
    fetchPosts()
      .then((posts) => {
        this.setState({ posts: posts });
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });

    // Listen for the 'newPost' event from the server
    listenForNewPosts((post) => {
      // Update the map with the new post
      this.setState((prevState) => ({
        posts: [...prevState.posts, post], // Add the new post to the existing posts array
        notification: 'New post created!', // Show a notification for the new post
      }));

      // Log the received post data
      console.log('Received new post from server:', post);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      notification: null,
      selectedPost: props.post,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  handlePostTransfer = () => {
    const { selectedPost } = this.state;
    // Implement your logic to apply for the gig here
    // You may make a POST request to your backend API to apply for the gig
    // and handle the response accordingly
    applyForGig(selectedPost)
      .then((message) => {
        console.log(message);
        this.setState({
          notification: 'Gig applied successfully'
        });
      })
      .catch((error) => {
        console.error('Error applying for the gig:', error);
        this.setState({
          notification: 'An error occurred while applying for the gig'
        });
      });
  }

  infoWindowContent = () => {
    const { selectedPost } = this.state;
    return (
      <div style={{ color: 'black' }}>
        <h2>{selectedPost?.title}</h2>
        <p>Price: {selectedPost?.price}</p>
        <p>Description: {selectedPost?.description}</p>
        <p>Location: {selectedPost?.location.lat}, {selectedPost?.location.lon}</p>
        {this.context.userType === 'business' && (
          <button id='logPostButton' onClick={this.handlePostTransfer}>Grab Gig</button>
        )}
      </div>
    );
  }

  render() {
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
              position={{ lat: post.location.lat, lng: post.location.lon }}
            />
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
})(GoogleMapContainer)
