import firebase from "firebase";

require('./pages/settings');

export const Base = (function () {
  const config = {
    apiKey: "AIzaSyB0A5hOS1DXA7-6WMRcQ6F3PtkpKDpaWMY",
    authDomain: "productivity-f1b9f.firebaseapp.com",
    databaseURL: "https://productivity-f1b9f.firebaseio.com",
    storageBucket: "productivity-f1b9f.appspot.com",
    projectId: 'productivity-f1b9f'
  };
  firebase.initializeApp(config);


  const db = firebase.firestore();
  const data = db.collection('data');


  function setData(holder, obj) {
    return data.doc(holder).set(obj)
  }

  function getData(holder) {
    return data.doc(holder).get();
  }

  return {
    setData,
    getData
  }
})();



