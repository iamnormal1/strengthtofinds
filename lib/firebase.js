// This is where I add all of the functions for interacting with firebase on the blog.
 
import firebase from 'firebase/app';
import 'firebase/database';
 
const initFirebase = async () => {
  // This check prevents us from initializing more than one app.
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
};

// Gets all posts from the database in reverse chronological order.
export const getPosts = async () => {
  // Because our exported functions can be called at any time from
  // any place in the blog, I have to check initialisation when app is invoked
  // a Firebase app every time these functions are invoked.
  initFirebase();
   
  const posts = await firebase
    .database()
    .ref('/posts')
    .orderByChild('dateCreated')
    .once('value')
    .then((snapshot) => {
      const snapshotVal = snapshot.val();
   
      const result = [];
      for (var slug in snapshotVal) {
        const post = snapshotVal[slug];
        result.push(post);
      }
   
      return result.reverse();
    });
   
  return posts;
};


/*
Creates a new post under /posts in the Realtime Database. Automatically
generates the `dateCreated` property from the current UTC time in milliseconds.
*/
export const createPost = async (post) => {
  initFirebase();

  const dateCreated = new Date().getTime();
  post.dateCreated = dateCreated;

  return firebase.database().ref(`/posts/${post.slug}`).set(post);
};