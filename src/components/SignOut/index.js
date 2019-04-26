import React from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';

const SignOutButton = ({firebase}) => (
  <Link to="#" className="nav-link" onClick={firebase.fbSignOut}>
    Sign Out
  </Link>
);

export default withFirebase(SignOutButton);