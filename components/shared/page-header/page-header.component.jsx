import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import collapseUp from '../../../assets/collapseUp.svg';
import collapseDown from '../../../assets/collapseDown.svg';

import clsx from 'clsx';

import Breadcrumbs from '../breadcrumbs/breadcrumbs.component';
import useStyles from '../../../style/core/page-header/page-header';
import Button from '../buttons/button.component';

const PageHeader = (props) => {
  const {
    pageTitle,
    showButton,
    buttonTitle,
    buttonCustomClass,
    buttonAction,
    buttonIcon = {},
    customContent,
    buttonEndIcon,
    showFixedNotify,
    fixedNotifyContents,
  } = props;

  const substractionValue = useSelector(
    (state) => state.pageHeaderStore.substractionValue
  );

  const classes = useStyles({
    substractionValue,
  });
  const defaultClass = clsx(buttonCustomClass, classes.btnAdd);
  const [isCollapse, setCollapse] = useState(false);

  const handleCollsape = () => {
    setCollapse(!isCollapse);
  };

  return (
    <div className={classes.root}>
      <Breadcrumbs />
      <div className={`${classes.titlePage} subtitle`}>
        {pageTitle}

        {showButton ? (
          <Button
            title={buttonTitle}
            className="btnSecondary"
            classCustom={defaultClass}
            icon={buttonIcon}
            isFontAwesome={true}
            endIcon={buttonEndIcon}
            handleClick={buttonAction}
          />
        ) : (
          customContent
        )}
        {showFixedNotify && (
          <div
            className={`${classes.fixedNotifyContents} ${
              isCollapse ? 'collapsed' : ''
            }`}
            onClick={handleCollsape}
          >
            {typeof fixedNotifyContents === 'string' && fixedNotifyContents}
            {Array.isArray(fixedNotifyContents) &&
              fixedNotifyContents.map((el, index) => (
                <p
                  key={index}
                  className={`${isCollapse && index !== 0 ? 'hidden' : ''}`}
                >
                  {el}
                  {index === 0 && isCollapse ? '...' : ''}
                </p>
              ))}
            <div className={classes.btnColl}>
              <Button
                iconImg={isCollapse ? collapseDown : collapseUp}
                disabled={false}
                classCustom={classes.btnCollapse}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string,
  showButton: PropTypes.bool,
  isFontAwesome: PropTypes.bool,
  buttonTitle: PropTypes.string,
  buttonCustomClass: PropTypes.string,
  buttonAction: PropTypes.func,
  buttonIcon: PropTypes.object,
  buttonEndIcon: PropTypes.any,
  customContent: PropTypes.any,
  showFixedNotify: PropTypes.bool,
  fixedNotifyContents: PropTypes.any,
};

export default PageHeader;
