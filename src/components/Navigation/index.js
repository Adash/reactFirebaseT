import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      { authUser =>
          authUser ? <NavigationAuth /> : <NavigationNonAuth /> 
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="collapse navbar-collapse" >
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.HOME}>Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.ADMIN}>Admin</Link>
        </li>
        <li className="nav-item">
          <SignOutButton />
        </li>
      </ul>
    </div>
  </nav>
);

const NavigationNonAuth = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="collapse navbar-collapse" >
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.LANDING}>Landing</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navigation;