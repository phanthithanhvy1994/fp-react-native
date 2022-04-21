import { makeStyles } from '@material-ui/core';
import { defaultColors, fontStyles } from '../../const/style-const';

const useStyles = makeStyles({
  fpbContainer: {
    margin: '16px',
    minHeight: '208px',
    minWidth: '468px',
    '& > .MuiDialogTitle-root': {
      padding: 'unset',
    },
    '& > .MuiDialogActions-root': {
      padding: 'unset',
      position: 'absolute',
      bottom: '16px',
      right: '16px',
    },
  },
  fpbContainerTableLayout: {
    margin: '16px',
    minWidth: '1056px',
    maxWidth: '1056px',
    maxHeight: '524px',
    '& .table-grid': {
      fontSize: '12px',
      '& .MuiPaper-rounded  > div[class*=Component-horizontalScrollContainer] div ': {
        maxHeight: 206,
      },
    },
    '& > .MuiDialogTitle-root': {
      padding: 'unset',
    },
    '& > .MuiDialogActions-root': {
      padding: 'unset',
      bottom: '16px',
      right: '16px',
    },
  },
  rFpbContainer: {
    margin: '16px',
    minHeight: '240px',
    minWidth: '468px',
    '& > .MuiDialogTitle-root': {
      padding: 'unset',
    },
    '& > .MuiDialogActions-root': {
      padding: 'unset',
      position: 'absolute',
      bottom: '16px',
      right: '16px',
    },
    '& .reason-text-field': {
      width: '100%',
      marginBottom: '30px',
      '& > div:after': {
        borderBottomColor: defaultColors.secondary
      }
    }
  },
  dlgTitle: {
    margin: '0px 0px 25px 0px',
    '& > h2': {
      margin: 'unset',
      padding: '0px 0px 5px 0px',
      fontSize: '1.5rem',
      fontWeight: fontStyles.fontWeight,
      lineHeight: '28px',
    },
  },
  rDlgTitle: {
    margin: '0px 0px 25px 0px',
    '& > h2': {
      margin: 'unset',
      padding: '0px 0px 5px 0px',
      borderBottom: '4px solid',
      fontSize: '1.5rem',
      fontWeight: fontStyles.fontWeight,
      lineHeight: '28px',
      'border-image-slice': 1,
      'border-width': 5,
      'border-image-source':
        'linear-gradient(90deg, #FD7902 0%, #6B6C99 55.21%, #0D9499 100%);',
    },
  },
  rejectDlgContent: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: 'unset',
    margin: '0px 0px 25px 0px',
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    '& svg': {
      width: '43.21px',
      height: '43.21px',
    },
    '& p': {
      fontSize: '14px',
      fontWeight: fontStyles.fontWeight,
      lineHeight: '16px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'justify',
      margin: '0px 0px 0px 15px',
      color: defaultColors.neutralContent,
    },
    '& > textarea': {
      width: '100%',
      margin: '25px 0px 25px 0px',
      maxHeight: '200px',
    },
  },
  dlgContent: {
    display: 'flex',
    padding: 'unset',
    margin: '0px 0px 25px 0px',
    '& > div': {
      display: 'grid',
      flexDirection: 'column',
      alignItems: 'center',
    },
    '& svg': {
      width: '43.21px',
      height: '43.21px',
    },
    '& p': {
      fontSize: '14px',
      fontWeight: fontStyles.fontWeight,
      lineHeight: '16px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'justify',
      margin: '0px 0px 0px 15px',
      color: defaultColors.neutralContent,
    },
    '& > textarea': {
      width: '100%',
      margin: '25px 0px 25px 0px',
      maxHeight: '200px',
    },
  },
  dlgTableContent: {
    padding: '0 0 16px 0',
  },
  dlgTableContentTitle: {
    paddingLeft: '16px',
    fontSize: '14px',
  },
  messageTableTitleDiv: {
    display: 'flex',
    alignItems: 'center',
    padding: 'unset',
    margin: '0px 0px 25px 0px',
    '& svg': {
      width: '36px',
      height: '36px',
    },
  },
  dlgMessageTitle: {
    fontWeight: '400 !important',
  },
  dlgAction: {
    '& > button': {
      width: '94px',
      '& > span.MuiButton-label': {
        display: 'flex',
        justifyContent: 'center',
        '& > svg': {
          margin: '0px 5px 0px 0px',
        },
      },
    },
    '& .btn-cancel': {
      border: 'none',
    },
  },
  errorIcon: { color: defaultColors.danger },
  confirmIcon: { color: defaultColors.secondary },
  warningIcon: { color: defaultColors.warning },
  infoIcon: { color: defaultColors.success },
  cancelIcon: { color: defaultColors.danger },
  contentDiv: {
    maxHeight: 180,
    overflowY: 'auto',
  },
});

export default useStyles;
