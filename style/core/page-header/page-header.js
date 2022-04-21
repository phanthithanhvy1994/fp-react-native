import { makeStyles } from '@material-ui/core';
import { defaultColors } from '../../const/style-const';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    top: '50px',
    zIndex: '1100',
    backgroundColor: '#ffffff',
    width: props => `calc(100% - ${props.substractionValue}px)`,
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  btnAdd: {
    width: 'auto',
    margin: '-8px 0 3px',
    textTransform: 'none'
  },
  fixedNotifyContents: {
    position: 'absolute',
    right: 0,
    top: '10px',
    background: '#ffffff',
    fontSize: '13px',
    lineHeight: '15px',
    textAlign: 'center',
    minWidth: '82px',
    minHeight: '30px',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px 0px 0px 10px',
    color: defaultColors.primary,
    '& p': {
      marginTop: '4px',
      marginBottom: '0px'
    },
    '& p.hidden': {
      display: 'none',
    },
    '& p:first-child': {
      marginTop: '5px'
    },
    '&.collapsed': {
      height: '28px',
      borderRadius: '20px 0px 0px 20px',
      minHeight: '28px'
    }
  },
  btnColl: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    height: '5px',
    '& > button': {
      height: '5px',
      right: '22px',
      position: 'absolute'
    },
    '& img': {
      height: '9px'
    }
  },
  btnCollapse: {
    width: 36,
    padding: 0,
    minWidth: 'unset',
  },
}));

export default useStyles;
