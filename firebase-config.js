const firebaseConfig = {
    apiKey: "ваш_api_key",
    authDomain: "ваш_project.firebaseapp.com",
    projectId: "ваш_project_id",
    storageBucket: "ваш_project.appspot.com",
    messagingSenderId: "ваш_messaging_id",
    appId: "ваш_app_id"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  