import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { UserContext } from '../../User/UserContext';
import { fetchPosts, applyForGig, listenForNewPosts, createNotification } from './googleMapService';
import '../../../firebase/firebase';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const style = {
  width: '75%',
  height: '60%',
  overflowX: 'hidden',
};
const containerStyle = {
  width: '70vw',
  height: '100vh',
  overflowX: 'hidden',
};

const SelectedPostInfo = ({ selectedPost, onGrabGig }) => {
  return (
    <Box p={4} bg="gray.900" boxShadow="md" borderRadius="md">
      {!selectedPost ? (
        <Text>Select a post on the map</Text>
      ) : (
        <Box>
          <Heading as="h2" size="lg" mb={2}>
            {selectedPost.title}
          </Heading>
          <Text>Price: {selectedPost.price}</Text>
          <Text>Description: {selectedPost.description}</Text>
          <Text>
            Location: {selectedPost.location.lat}, {selectedPost.location.lon}
          </Text>
          {/* Button to grab the gig */}
          {!selectedPost.isButtonClicked && (
            <Button colorScheme="teal" mt={4} onClick={() => onGrabGig(selectedPost)}>
              Grab Gig
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export class GoogleMapContainer extends Component {
  _isMounted = false;

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
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
        // Set the initial isButtonClicked property for each post to false
        const postsWithButtonState = posts.map((post) => ({ ...post, isButtonClicked: false }));
        this.setState({ posts: postsWithButtonState });
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });

    // Listen for the 'newPost' event from the server
    listenForNewPosts((post) => {
      // Update the map with the new post
      this.setState((prevState) => ({
        posts: [...prevState.posts, { ...post, isButtonClicked: false }], // Add the new post to the existing posts array with initial isButtonClicked state
        notification: 'New post created!', // Show a notification for the new post
      }));

      // Log the received post data
      console.log('Received new post from server:', post);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePostTransfer = (selectedPost) => {
    console.log('Gig-request notification created successfully');

    const user = this.context;
  
    // Check if a post is selected before applying for the gig
    if (!selectedPost) {
      console.error('No post selected');
      this.setState({
        notification: 'Please select a post before applying for the gig',
      });
      return;
    }
  
    applyForGig(selectedPost, user.uid)
      .then((message) => {
        console.log(message);
        this.setState({
          notification: 'Gig applied successfully',
        });
  
        // Create a gig-request notification after successfully applying for the gig
        const senderId = user.uid; // Use the logged-in user's ID
        const receiverId = "cFueY8SVyGMngbmnMPdCDQjZOff2"; // Assuming postedBy is an object containing the user ID
        console.log(senderId, receiverId)
  
        // Notification text
        const notificationText = `${senderId} has applied for your gig: ${selectedPost.title}`;
  
        // Type of the notification
        const notificationType = 'gig-request';
  
        // Create the gig-request notification
        createNotification(receiverId, senderId, notificationText, notificationType)
          .then(() => {
            console.log('Gig-request notification created successfully');
          })
          .catch((error) => {
            console.error('Error creating gig-request notification:', error);
          });
  
        // Update the isButtonClicked state for the selected post
        this.setState((prevState) => ({
          posts: prevState.posts.map((post) =>
            post.pid === selectedPost.pid ? { ...post, isButtonClicked: true } : post
          ),
        }));
      })
      .catch((error) => {
        console.error('Error applying for the gig:', error);
        this.setState({
          notification: 'An error occurred while applying for the gig',
        });
      });
  };

  render() {
    const { selectedPost } = this.state;

    return (
      <div>
        {this.state.notification && <div className="notification">{this.state.notification}</div>}
        {/* Display the SelectedPostInfo component above the map */}
        <SelectedPostInfo selectedPost={selectedPost} onGrabGig={this.handlePostTransfer} />

        <Map
          containerStyle={containerStyle}
          resetBoundsOnResize={true}
          style={style}
          google={this.props.google}
          onClick={this.onMapClicked}
          zoom={10}
          initialCenter={{
            lat: 43.653225,
            lng: -79.383186,
          }}
        >
          {this.state.posts.map((post, index) => (
            <Marker
              key={index}
              name={post.title}
              post={post}
              position={{ lat: post.location.lat, lng: post.location.lon }}
              onClick={() => this.setState({ selectedPost: post })}
            />
          ))}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCslCplJhzh8rKxQ0c6xZSv7UlILmWUiys')
})(GoogleMapContainer)



