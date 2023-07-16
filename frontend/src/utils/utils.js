async function getAddressFromCoordinates(latitude, longitude) {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your own API key
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].formatted_address;
        }
      } else {
        console.error('Error retrieving address:', response.statusText);
      }
    } catch (error) {
      console.error('Error retrieving address:', error);
    }
  
    return 'Address not found';
  }
  

  export default getAddressFromCoordinates;