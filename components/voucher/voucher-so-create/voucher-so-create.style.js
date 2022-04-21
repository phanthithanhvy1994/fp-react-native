import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '4px',
    '& > div:first-child': {
      flex: 1,
      paddingRight: '11px',
      '& > div > div.field-wrapper': {
        width: '100%',
        '& .MuiFormControl-root': {
          width: '100%',
          '& .MuiInputAdornment-root svg path': {
            fill: defaultColors.primary,
          },
        },
      },
    },
    '& > div:nth-child(2)': {
      width: '36px',
      marginTop: '26px',
      '& > button': {
        height: '36px',
        width: '36px',
        padding: '0',
        minWidth: 'unset',
        '&:hover': {
          backgroundColor: 'unset',
        },
        '&:focus': {
          backgroundColor: 'unset',
        },
        '& > span': {
          width: '36px',
        },
      },
    },
  },

  voucherCreateDialog: {
    minWidth: '500px',
    minHeight: '160px',
    padding: '12px 16px',
    '& .MuiDialogTitle-root': {
      padding: 0,
      height: '36px',
      '& > h2': {
        fontSize: '24px',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '36px',
        letterSpacing: '0em',
        textAlign: 'left',

        '& button': {
          height: '36px',
          width: '36px',
          top: '12px',
          right: '16px',
          '&:hover': {
            backgroundColor: defaultColors.secondaryHover,
          },
          '& svg': {
            fill: defaultColors.secondary,
          },
        },
      },
    },
    '& .MuiDialogContent-root': {
      padding: 0,
      '& .subtitle': {
        margin: '0',
        width: '100%',
      },
    },
  },
};

export default useStyles;
