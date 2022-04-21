import { makeStyles } from '@material-ui/core';
import { borderStyles, defaultColors } from '../../../style/const/style-const';

const useStyles = makeStyles({
  fieldsetCls: {
    borderRadius: 8,
    boxShadow: 'unset',
    borderTop: `${borderStyles.borderColor} ${borderStyles.borderStyle} ${borderStyles.borderWidth}`,
    '& legend': {
      marginLeft: -8,
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 'bold',
      color: defaultColors.neutralContent,
    },
    '& .form-field-label': {
      margin: 'unset',
    },
    '& div.MuiToolbar-root': {
      '& button': {
        padding: '16px 8px 16px 8px',
        height: 36,
      },
    },
  },
});

export default useStyles;
