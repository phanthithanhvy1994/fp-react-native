import React from 'react';
import { Switch } from 'react-router-dom';
// import Breadcrumbs from '../shared/breadcrumbs/breadcrumbs.component';
import PrivateRoute from '../auth/private-route.component';
import ComplaintAdd from './complaint-add.component';

export default class Complaint extends React.Component {
  render() {
    return (
      <>
        {/* <Breadcrumbs breadcrumb={'Add Complaint'}></Breadcrumbs> */}
        <Switch>
          <PrivateRoute exact path="/complaint/add" component={ComplaintAdd} />
        </Switch>
      </>
    );
  }
}
