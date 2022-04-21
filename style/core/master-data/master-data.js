import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  masterDataTable: {
    width: '100%',
  },
  masterDataList: {
    maxHeight: '66vh',
    overflow: 'auto',
    border: '1px solid #CCCCCC',
    borderRadius: 4,
    '& span': {
      fontSize: 12,
    },
  },
  titleDataList: {
    fontWeight: 'bold',
    height: '50px',
    lineHeight: '50px',
  },
}));

export default useStyles;
