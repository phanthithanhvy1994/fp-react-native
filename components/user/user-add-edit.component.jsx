import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import UserForm from './user-form/user-form.component';

class UserAddEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { isDetailsPage, match, history } = this.props;
    const itemId = match.params.id;
    return (
      <>
        <UserForm
          isEditPage={(itemId && !isDetailsPage) || false}
          isDetailsPage={isDetailsPage}
          itemId={itemId}
          history={history}
        />
      </>
    );
  }
}

UserAddEdit.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailsPage: PropTypes.any,
  match: PropTypes.object
};

export default withTranslation()(UserAddEdit);
