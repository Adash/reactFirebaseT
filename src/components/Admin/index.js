import React from 'react';

// import * as ROLES from '../../constants/roles';

const AdminPage = () => (
  <div>
    <h1>Admin</h1>
    <h4>Restricted area.</h4>
    <p>Page accessible only from authorised Admin users</p>
  </div>
);
// not implemented yet
// const condition = authUser => 
//   authUser && !!authUser.roles[ROLES]

export default AdminPage;