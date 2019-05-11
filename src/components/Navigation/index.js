import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      { authUser =>
          authUser ? <NavigationAuth authUser={ authUser } /> : <NavigationNonAuth /> 
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavLink = (props) => (
  <li className="nav-item">
    <Link className="nav-link" to={ props.to }>{ props.name }</Link>
  </li> 
);

const NavigationAuth = ({ authUser }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="collapse navbar-collapse" >
      <ul className="navbar-nav">
        <NavLink to={ ROUTES.LANDING } name="Landing" />
        <NavLink to={ ROUTES.HOME } name="Home" />
        <NavLink to={ ROUTES.ACCOUNT } name="Account" />
        { !!authUser.roles[ROLES.ADMIN] && (
          <NavLink to={ ROUTES.ADMIN } name="Admin" />
        )}
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
        <NavLink to={ ROUTES.SIGN_IN } name="Sign In" />
        <NavLink to={ ROUTES.LANDING } name="Landing" />
      </ul>
    </div>
  </nav>
);

export default Navigation;