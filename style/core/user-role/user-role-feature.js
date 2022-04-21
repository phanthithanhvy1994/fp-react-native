import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiListItem-gutters': {
      borderBottom: '0.5px solid #A0A0A0',
      height: 32,
    },
    '& .MuiTypography-root': {
      fontSize: 12,
    },
    '& .MuiList-padding': {
      padding: 'unset',
    },
    '& .MuiIconButton-label': {
      color: '#F9AA33',
    },
  },
  featureBlock: {
    border: '0.5px solid #A0A0A0',
    marginTop: 8,
    borderRadius: 4,
    borderBottom: 'unset',
  },
  titleFeature: {
    backgroundColor: '#80939C',
    color: 'white',
    paddingRight: 13,
    '&:hover': {
      backgroundColor: '#496571',
    },
  },
  allFeatures: {
    border: '0.5px solid #A0A0A0',
    borderRadius: 4,
    marginTop: 16,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#496571',
  },
}));

export default useStyles;
