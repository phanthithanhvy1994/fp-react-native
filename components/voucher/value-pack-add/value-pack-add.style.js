import { defaultColors } from '../../../style/const/style-const';

const sidebarWidth = '57px';
const formPadding = '15px';
const fieldPadding = '24px';
const searchFormContentPadding = ' 16px';
const usedWidth = `calc(${sidebarWidth} + 2 * ${formPadding} + 2 * ${searchFormContentPadding})`;

const useStyles = {
  topToolbarOnGrid: {
    '& .add-value-pack-toolbar': {
      '@media screen and (min-width: 1920px)': {
        // Show 4 columns
        '& .field-wrapper': {
          width: `calc(
          (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
        )`,
        },
      },

      '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
        // Show 4 columns
        '& .field-wrapper': {
          width: `calc(
          (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
        )`,
        },
      },

      '@media screen and (min-width: 769px) and (max-width: 1279px)': {
        '& .field-wrapper': {
          width: `calc((100vw - (${usedWidth} + ${fieldPadding})) / 2)`,
        },
      },

      '@media screen and (min-width: 240px) and (max-width: 768px)': {
        '& .field-wrapper': {
          width: `calc(100vw - ${usedWidth})`,
        },
      },
      marginTop: '-20px',
      marginBottom: '10px',
    },
  },
  valuePackAddSearchCover: {
    '& .form-fields': {
      marginTop: '-12px',
      '@media screen and (min-width: 1920px)': {
        // Show 4 columns
        '& .field-wrapper': {
          width: `calc(
          (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
        )`,
        },
      },

      '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
        // Show 4 columns
        '& .field-wrapper': {
          width: `calc(
          (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
        )`,
        },
      },

      '@media screen and (min-width: 769px) and (max-width: 1279px)': {
        '& .field-wrapper': {
          width: `calc((100vw - (${usedWidth} + ${fieldPadding})) / 2)`,
        },
      },

      '@media screen and (min-width: 240px) and (max-width: 768px)': {
        '& .field-wrapper': {
          width: `calc(100vw - ${usedWidth})`,
        },
      },
    },
    marginTop: '112px',
    marginBottom: '12px',
    '& .add-value-pack-text-area': {
      '& textarea': {
        maxHeight: '50px',
      },
    },
    '& .number-field-without-spin': {
      '& input[type="number"]::-webkit-clear-button': {
        display: 'none',
      },
      '& input[type="number"]::-webkit-inner-spin-button': {
        display: 'none',
      },
      '& input[type="number"]::-webkit-outside-spin-button': {
        display: 'none',
      },
    },
  },
  valuePackAddToolBar: {
    display: 'flex',
    alignItems: 'center',
  },
  addItemBtn: {
    paddingTop: '18px',
    paddingLeft: '24px',
  },
  btnSecondaryTextOnly: {
    color: defaultColors.secondary,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textTransform: 'initial',
    textDecorationLine: 'underline',
  },
  addPackValueDetailGrid: {
    fontSize: '12px',
  },
  totalArea: {
    background: '#dbeff0',
    height: '44px',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: '0px',
    color: defaultColors.secondary,
    '& .total-value-row': {
      display: 'flex',
      float: 'right',
      width: '22%',
      justifyContent: 'space-between',
      height: '18px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: '14px',
      marginTop: '5px',
      paddingRight: '15px',
      '& .total-value-label': {
        width: '40%',
        minWidth: '150px',
      },
    },
  },
  btn: {
    margin: '16px 0px',
    textAlign: 'end',
    '& > button': {
      marginLeft: '16px',
      minWidth: '94px',
    },
  },
};

export default useStyles;
