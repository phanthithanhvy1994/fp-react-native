import { makeStyles } from '@material-ui/core/styles';
import { defaultColors } from '../../style/const/style-const';

export const useStyles = makeStyles({
  detailDialog: {
    '& .MuiPaper-root': {
      minWidth: 500,
      minHeight: 300,
      overflowY: 'unset',
      padding: 16,
    },
    '& .MuiCardMedia-root': {
      float: 'left',
    },
    '& .MuiButtonBase-root': {
      float: 'right',
    },
    '& .MuiDialogTitle-root ': {
      padding: 0,
      '& .MuiTypography-root': {
        width: '100%',
        fontSize: 24,
        fontWeight: 'normal',
      },
    },
    '& .MuiDialogContent-dividers ': {
      border: 'unset',
      padding: '16px 0px',
      '& .divImage': {
        width: 150,
        height: 150,
        border: `1px solid ${defaultColors.borderColor}`,
        float: 'left',
        borderRadius: 4,
        '& img': {
          width: '100%',
        },
      },
    },
    '& .MuiDialogActions-root': {
      padding: 0,
      '& .MuiButtonBase-root': {
        width: 94
      }
    },
  },

  divDetailInfo: {
    maxHeight: 150,
    padding: '2px 0px 0px 16px ',
    overflowY: 'auto',
    '& .MuiTypography-root': {
      lineHeight: '1.65',
      display: 'block',
      fontSize: 13,
    },
  },
});
