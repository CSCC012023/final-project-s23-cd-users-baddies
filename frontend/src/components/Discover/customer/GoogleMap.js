import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { UserContext } from '../../User/UserContext';
import { fetchPosts, applyForGig, listenForNewPosts, checkIfPostIsRequestedByUser, createNotification } from './googleMapService';
import SelectedPostCard from './SelectedPostCard';
import "../../../firebase/firebase";
import {
  Box,
  Button,
  Tooltip,
  Image,
  AspectRatio,
  HStack,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';

const mapStyles = {
  width: '100%',
  height: 'calc(100% - 120px)',
};

export class GoogleMapContainer extends Component {
  _isMounted = false;

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      selectedPost: null,
      activeMarker: {},
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    
    const user = this.context;
  
    try {
      const allPosts = await fetchPosts();
      
      // Filter posts to only include those with the status 'posted'
      const postedPosts = allPosts.filter(post => post.status === 'posted');
      
      // Loop over the posts and add an 'isButtonClicked' field
      const postsWithButtonState = [];
      for (let post of postedPosts) {
        const isPostRequestedByUser = await checkIfPostIsRequestedByUser(post, user.uid);
        postsWithButtonState.push({ ...post, isButtonClicked: isPostRequestedByUser });
      }
      
      this.setState({ posts: postsWithButtonState });
      
      listenForNewPosts((newPost) => {
        // Only add new post to state if its status is 'posted'
        if (newPost.status === 'posted') {
          this.setState((prevState) => ({
            posts: [...prevState.posts, { ...newPost, isButtonClicked: false }],
          }));
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
}

  

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleMarkerClick = (props, marker, post) => {
    this.setState({
      selectedPost: post,
      activeMarker: marker,
    });
  };

  handleRequestGig = (selectedPost) => {
    const user = this.context;
    applyForGig(selectedPost, user.uid)
      .then((result) => {
        console.log(result.message);
        this.setState((prevState) => ({
          posts: prevState.posts.map((post) =>
            post.pid === selectedPost.pid ? { ...post, isButtonClicked: true } : post
          ),
          selectedPost: { ...selectedPost, isButtonClicked: true },
        }));
        console.log("this is the postedby uid", selectedPost.postedBy.uid);
        const postedByUid = selectedPost.postedBy.split('/')[2];
        console.log('this is the pid and gid', selectedPost.pid, result.gid);
        // Create a notification of type 'gig-request' to the post owner
        return createNotification(
          postedByUid, // receiverId: the owner of the post
          user.uid, // senderId: the user who is applying for the gig
          'The Business ${user.Business.Name} has requested your gig', // Notification text
          'gig-request', // Notification type
          result.gid, // Gig id
          selectedPost.pid  // Post id
        );
      })
      .then(() => {
        console.log('Gig request notification sent successfully');
      })
      .catch((error) => {
        console.error('Error applying for the gig or sending notification:', error);
      });
  };
  
  

  render() {
    const { selectedPost, activeMarker } = this.state;
  
    return (
      <Box>
      {selectedPost && (
        <SelectedPostCard
          post={selectedPost}
          onButtonClick={this.handleRequestGig}
        />
      )}
        <Box height="50vh" width="50vw" marginTop="5%">
          <Map
            google={this.props.google}
            zoom={14}
            style={{width: '54%', height: '50%', position: 'relative'}}
            initialCenter={{ lat: 43.653225, lng: -79.383186 }}
          >
            {this.state.posts.map((post, index) => (
              <Marker
                key={index}
                position={{ lat: post.location.lat, lng: post.location.lon }}
                onClick={(props, marker) => this.handleMarkerClick(props, marker, post)}
              />
            ))}
          </Map>
        </Box>
      </Box>
    );
  }
  
}
export default GoogleApiWrapper({
  apiKey: ('CHANGE_WITH_PEROSNAL')
})(GoogleMapContainer)



