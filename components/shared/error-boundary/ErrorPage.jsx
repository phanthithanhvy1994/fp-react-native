import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import error from '../../../assets/error.png';
import notFound from '../../../assets/notFound.png';
import Button from '../buttons/button.component';
import styles from '../../../style/core/error-page/error-page';
import { Message } from '../../../constants/messages';

function ErrorPage(props) {
  const classes = styles();
  const history = useHistory();
  const { t } = useTranslation();
  if (props.match.path === '*') {
    history.push('/404');
  }
  const isRouteNotFound = props.match.path === '/404';
  const notification = isRouteNotFound
    ? Message.NOT_FOUND_PAGE
    : Message.ERROR_PAGE;
  const image = isRouteNotFound ? notFound : error;

  return (
    <Row>
      <Col>
        <div className={classes.errorPage}>
          <img src={image} alt="error-page"/>
          <div className={classes.errorText}>{t(notification)}</div>
          <div className={classes.errorAction}>
            <Button
              className="btnPrimary"
              classCustom={classes.btnGoHome}
              title={t('Go to Homepage')}
              handleClick={() => history.push('/')}
            ></Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}

ErrorPage.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.any,
  history: PropTypes.any,
  match: PropTypes.object,
};

export default ErrorPage;
