import {defaultColors} from '../../../style/const/style-const';

const useStyles = {
  searchCover: {
    marginTop: '114px',
    marginBottom: '16px',
  },
  voucherPackListToolBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '6px 32px',
    '& button': {
      border: 'unset',
      background: 'none',
      '& > span': {
        textDecorationLine: 'underline',
        color: defaultColors.secondary
      }
    }
  },
  btnSecondaryTextOnly: {
    color: defaultColors.secondary,
  },
  packValueList: {
    '& .table-grid': {
      '& .MuiTableRow-root': {
        '& .MuiIconButton-root.Mui-disabled': {
          opacity: 0.3
        }
      }
    },
    '& .field-wrapper': {
      '@media screen and (max-width: 1920px)': {
        width: '32%',
      },
      width: '32.5%',
      '& > div.MuiTextField-root': {
        width: '100%',
      },
    },
  },
};

export default useStyles;
