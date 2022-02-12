import * as FileSystem from 'expo-file-system';

import { insertPlace, fetchPlaces } from '../helpers/db';
import ENV from '../env';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, image, location) => {
  return async dispatch => {
    const response = await fetch( //reverse geocoding - latlng->address
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
        location.lat},${location.lng}&key=${ENV().googleApiKey}`
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error('Something went wrong!');
    }

    const address = resData.results[0].formatted_address;

    const fileName = image.split('/').pop(); 
    //extracting file name from e.g.:
    //file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Frn-complete-guide-cc9e2bcb-ea84-41df-9772-b7eb6501485b/ImagePicker/f9f9d446-51f8-4046-8361-de49cc90caa0.jpg
    //image is in temporary (cache) directory, we want to move it to save place (app's documentDirectory):
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      })
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng,
      );
      // console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng,
          }
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      // console.log(dbResult);
      dispatch({
        type: SET_PLACES,
        places: dbResult.rows._array,
      });  
    } catch (err) {
      throw err;
    }
  };
};