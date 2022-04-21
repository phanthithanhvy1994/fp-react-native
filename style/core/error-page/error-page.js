import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(() => ({
  errorPage: {
    height: 'calc(100vh - 44px - 28px)',
    textAlign: 'center',
    display: 'flex',
    width: 'fit-content',
    margin: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  btnGoHome: {
    width: 'unset',
    textTransform: 'unset',
  },
  errorText: {
    marginTop: 8,
  },
  errorAction: {
    marginTop: 20,
  },
}));

export default styles;
