import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './config';

class Firebase {
  constructor() {
    app.initializeApp(config);

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
}

export default Firebase;