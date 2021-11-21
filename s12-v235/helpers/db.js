import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('places.db'); //opens or create and opens a database

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql( //SQL command wrapped in transaction
        'CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);', 
        [], //array of dynamic arguments
        () => { //success function
          resolve();
        },
        (_, err) => { //failure function
          reject(err);
        },
      ); 
    });
  });
  return promise;
};

export const insertPlace = (title, imageUri, address, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)',
        [title, imageUri, address, lat, lng], //these values will be validated and if are secure they will be passed in place of '?' ablove and stored in the database
        (_, result) => { //first argument of this success function is the query itself, second one is the result of the query
          resolve(result);
        },
        (_, err) => {
          reject(err);
        },
      ); 
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM places',
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        },
      ); 
    });
  });
  return promise;
};
