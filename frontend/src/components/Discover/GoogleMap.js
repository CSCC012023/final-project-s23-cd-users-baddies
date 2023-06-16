import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

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

 export class MapContainer extends Component {

     state = {
         showingInfoWindow: false,
         activeMarker: {},
         selectedPlace: {},
       };

       onMarkerClick = (props, marker, e) =>
         this.setState({
           selectedPlace: props,
           activeMarker: marker,
           showingInfoWindow: true
         });

       onMapClicked = (props) => {
         if (this.state.showingInfoWindow) {
           this.setState({
             showingInfoWindow: false,
             activeMarker: null
           })
         }
     };  

   render() {
     return (
       <div >
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

           <Marker
               onClick={this.onMarkerClick}
               title={'Julian'}
               name={'Julian'}
               position={{lat: 43.613225, lng: -79.53186}} />
           <Marker
               title={'Kim'}
               name={'Kim'}
               onClick={this.onMarkerClick}
               position={{lat: 43.653225, lng: -79.7686}} />
           <Marker 
               title={'Lisa'}
               name={'Lisa'}
               onClick={this.onMarkerClick}
               position={{lat: 43.653225, lng: -79.6686}} />
           <Marker
               title={'Mark'}
               name={'Mark'}
               onClick={this.onMarkerClick}
               position={{lat: 43.653225, lng: -79.3186}}
           />
           <InfoWindow
             marker={this.state.activeMarker}
             visible={this.state.showingInfoWindow}>
               <div>
                 <h2>{this.state.selectedPlace.name}</h2>
               </div>
           </InfoWindow>

         </Map>
       </div>
     );
   }
 }

 export default GoogleApiWrapper({
   apiKey: ('AIzaSyBs6xBwT6DsTRosb8t2IGRAwmvwAp3fA8c')
 })(MapContainer) 