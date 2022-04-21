import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  fields: {
    '& .MuiTextField-root': {
      width: '49%',
    },
  },
  btn: {
    margin: '16px 0',
    textAlign: 'end',
  },
}));
export default useStyles;
