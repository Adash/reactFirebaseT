import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="collapse navbar-collapse" >
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.SIGN_IN}>SIGN_IN</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.LANDING}>LANDING</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.HOME}>HOME</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.ACCOUNT}>ACCOUNT</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.ADMIN}>ADMIN</Link>
        </li>
        <li className="nav-item">
          <SignOutButton />
        </li>
      </ul>
    </div>
  </nav>
);

export default Navigation;