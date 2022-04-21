import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import useStyles from './footer.style';

class Footer extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.footer}>
        <span className="title-footer">Copyright @2019 Project Name</span>
      </div>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(useStyles)(Footer);
