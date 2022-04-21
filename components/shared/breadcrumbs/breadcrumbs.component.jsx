import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
} from '@material-ui/core';

import useStyles from '../../../style/core/breadcrumb/breadcrumb';

const Breadcrumbs = (props) => {
  const { history, location } = props;
  const classes = useStyles();
  const regex = /^[0-9]+$/;
  const disabledLinks = [
    'procurement',
    'inventory',
    'catalog',
    'voucher-management',
    'coupon-management',
    'end-of-day',
    'asset-management',
    'account'
  ];
  const upperCaseNames = ['bom'];
  const pathnames = location.action
    ? location.location.pathname.split('/').filter((x) => x)
    : location.pathname.split('/').filter((x) => x);

  // Check should remove last pathname element or not
  const removePathName = (pathname) =>
    regex.test(pathname) || pathname === 'undefined' || pathname === 'null';

  // Disable route which contained in disabledLinks
  const isDisableLink = (pathName) => disabledLinks.includes(pathName);

  // Remove last element if it is ID
  if (removePathName(pathnames[pathnames.length - 1])) {
    pathnames.pop();
  }

  return (
    <div className={classes.root}>
      <MUIBreadcrumbs
        separator={<NavigateNextIcon fontSize="default" />}
        aria-label="breadcrumb"
        className={classes.nav}
      >
        {pathnames.length >= 0 ? (
          <Link onClick={() => history.push('/')}>Home</Link>
        ) : (
          <Typography> Home </Typography>
        )}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const isDisabled = isDisableLink(name);
          const formattedName = name
            .replaceAll('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((name) => {
              if (upperCaseNames.includes(name)) {
                return name.toUpperCase();
              }

              return name.charAt(0).toUpperCase() + name.substring(1);
            })
            .join(' ');

          return isLast || isDisabled ? (
            <Typography key={name}>{formattedName}</Typography>
          ) : (
            <Link key={name} onClick={() => history.push(routeTo)}>
              {formattedName}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </div>
  );
};

Breadcrumbs.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(Breadcrumbs);
