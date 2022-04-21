import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import { getUserInfo } from '../../actions/auth-action';

import { loginFields, validation } from './login.config';
import SignIn from '../../assets/login/md-log-in.png';
import logo from '../../assets/logo.png';
import background from '../../assets/login/background-image.png';

import Button from '../shared/buttons/button.component';
import Fields from '../shared/fields/fields.component';
import useStyles from '../../style/core/login/login';
import { onChangeInput, getStateFields } from '../../util/form-util';

function useOnMount(handler) {
  return React.useEffect(handler, []);
}

export default function Login() {
  const classes = useStyles();
  const [fields, setFields] = useState(loginFields);
  const { t } = useTranslation();
  const history = useHistory();
  const { handleSubmit, register, errors, setValue } = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
  });

  useOnMount(() => {
    if (validation) {
      validation.forEach(valid => register(valid.name, valid.rule));
    }
  });

  const onChange = e => {
    const newFieldArray = onChangeInput(fields, e);
    // Set new display value
    setFields(newFieldArray);
    // Set new value to validate
    setValue(e.target.name, e.target.value);
  };
  const login = () => {
    getStateFields(fields);
    localStorage.setItem('userInfo', JSON.stringify(getUserInfo()));
    history.push('/');
  };

  return (
    <div className={classes.loginPage}>
      <Col md={12} className={classes.col}>
        {!errors && (
          <div className={classes.divError}>
            <CancelIcon />
            <Typography>{t('Error Message')}</Typography>
          </div>
        )}
        <div className={classes.divLogo}>
          <img src={background} alt="" />
        </div>
        <div className={classes.loginForm}>
          <div className={classes.divForm}>
            <Typography>{t('Welcome to')}</Typography>
            <img src={logo} alt="" />
          </div>
          <form onSubmit={handleSubmit(login)} noValidate>
            <Fields
              conditionalArray={fields}
              onChange={e => onChange(e)}
              errors={errors}
            />
            <div className="clearfix"></div>
            <div className={classes.singInBtn}>
              <Button
                title={t('Sign in')}
                iconImg={SignIn}
                type="submit"
                className={'btnSecondary'}
              ></Button>
            </div>
          </form>
        </div>
      </Col>
    </div>
  );
}
