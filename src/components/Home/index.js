import React from 'react';

import { withAuthorisation } from '../Session'

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>data which should be protected from unauthorised user</p>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorisation(condition)(Home)