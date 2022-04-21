import { makeStyles } from '@material-ui/core';
import { borderStyles } from '../../const/style-const';

const useStyles = makeStyles({
  userRoleField: {
    padding: '6px 20px',
    border: `${borderStyles.borderColor} ${borderStyles.borderStyle} ${borderStyles.borderWidth}`,
    borderTop: '0px',
    boxShadow: borderStyles.boxShadow,
    borderRadius: '4px',
    '& > div:nth-child(1)': {
      '& > div': {
        '& > div': {
          '& > p': {
            margin: '0px 0px',
          },
          '& > div > p': {
            margin: '0px 0px',
            transform: 'translate(-105px, 0px) scale(1)',
          },
        },
      },
    },
  },
});

export default useStyles;
