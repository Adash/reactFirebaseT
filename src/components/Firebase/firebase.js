import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './config';

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */
    this.serverValue = app.database.ServerValue;

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***

  fbCreateUser = (email, password) => (
    this.auth.createUserWithEmailAndPassword(email, password)
  )


  fbSignIn = (email, password) => (
    this.auth.signInWithEmailAndPassword(email, password)
  )

  fbSignOut = () => {
    console.log('signed out');
    return this.auth.signOut()
  };

  fbPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  fbPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);
  
  users = () => this.db.ref('users');

  // *** User API ***

  message = uid => this.db.ref(`messages/${uid}`);

  messages = () => this.db.ref('messages');

  // *** Merge Auth and DB User API * **

  fbAuthUserListener = (next, fallback) => 
    this.auth.onAuthStateChanged(authUser => {
      if(authUser) {
          this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and dbUser
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            }

            next(authUser);
          });
      } else {
        fallback();
      }
    }); 
}

export default Firebase;