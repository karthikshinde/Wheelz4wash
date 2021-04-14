import * as firebase from 'firebase';

let firebaseVariables = {
    apiKey: "AIzaSyAx3r6qWauXttcuw1r6iwlTsL7M6N1dTHQ",
    authDomain: "wheelz4wash-82ae6.firebaseapp.com",
    databaseURL: "https://wheelz4wash-82ae6.firebaseio.com",
    projectId: "wheelz4wash-82ae6",
    storageBucket: "wheelz4wash-82ae6.appspot.com",
    messagingSenderId: "1010161121784"
}

firebase.initializeApp(firebaseVariables);
export default firebase;