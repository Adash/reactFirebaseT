import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorisation } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';


const AdminPage = () => (
  <div>
    <h1>Admin</h1>
    
    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>

    <h4>Restricted area.</h4>
    <p>Page accessible only from authorised Admin users</p>
  </div>
);

class UserItemBase extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state, // user object comes from Link component in UserList 
    }
  }

  componentDidMount() {
    if (this.state.user) {  // if navigated into the component from Link inside User list
      return;               // the user has been passed and we don't have to pull it from firebase
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
        console.log(snapshot.val())
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordReset = () => {
    this.props.firebase.fbPasswordReset(this.state.user.email);
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div>
        <h3>{ loading ? 'Loading...' : 'User' }</h3>
        { user && 
          <div>
            <p>Name: { user.username }</p>
            <p>Email: { user.email } </p>
            <p>User type: { user.roles && user.roles[ROLES.ADMIN] ? 'Admin User' : 'User' } </p>
            <p>ID: ({ this.props.match.params.id })</p>
            <button onClick={ this.onSendPasswordReset }
            >Send Password Reset Email</button>
          </div>
        }
      </div>
    )
  }

}

class UserListBase extends Component {
  constructor(props){
    super(props)

    this.state = {
      loading: false,
      users: [],
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }


  render() {
    const { users, loading } = this.state;
    return (
      <div>
        <h3>Users</h3>
        { loading && <div>Loading...</div> }
        <ul>
          { users.map(user => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> { user.uid }
              </span>
              <span>
                <strong>E-Mail:</strong> { user.email }
              </span>
              <span>
                <strong>Username:</strong> { user.username }
              </span>
              <span>
                <Link to={{
                    pathname: `${ROUTES.ADMIN}/${user.uid}`,
                    state: { user }  
                  }}>
                  Details
                </Link>
              </span>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}
const condition = authUser => 
  authUser && !!authUser.roles[ROLES.ADMIN];

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(
  withAuthorisation(condition),
  withFirebase,
)(AdminPage);