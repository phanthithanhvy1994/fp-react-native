import { defaultColors } from '../../../style/const/style-const';

const useStyles = () => ({
  btnAdd: {
    width: 'auto',
    marginBottom: '3px',
  },
  fieldRoleName: {
    width: '49%',
  },
  searchCover: {
    marginTop: '114px',
    marginBottom: '16px',
    '& .field-wrapper': {
      '@media screen and (max-width: 1920px)': {
        width: '32%',
      },
      width: '32.5%',
      minWidth: 'unset',
      '& div[class*=Field-fldText]': {
        width: '100%',
      },
    },
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  priceListToolBar: {
    display: 'flex',
    justifyContent: 'flex-end !important',
  },
  btnSecondaryTextOnly: {
    color: defaultColors.secondary,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textTransform: 'initial',
    textDecorationLine: 'underline',
  },
  btnSave: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    marginBottom: '80px',
  },
  pageHeaderMargin: {
    marginTop: '140px',
  },
  branchBomGroup: {
    '& .field-wrapper': {
      '@media screen and (max-width: 1920px)': {
        width: '32%',
      },
      width: '32.5%',
      minWidth: 'unset',
      '& > div': {
        width: '100%',
      },
    },
  },
  detailCover: {
    marginTop: '140px',
    marginBottom: '16px',
    '& > fieldset': {
      '@media screen and (min-width: 240px) and (max-width: 1279px)': {
        '& .form-fields': {
          '& > div': {
            display: 'grid',
            // Show 1 column
            gridTemplateColumns: 'repeat(1, 1fr)',
          },
        },
      },
      '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
        '& .form-fields': {
          '& > div': {
            display: 'grid',
            // Show 2 columns
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: '24px',
          },
        },
      },
      '@media screen and (min-width: 1920px)': {
        '& .form-fields': {
          '& > div': {
            display: 'grid',
            // Show 3 columns
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '24px',
          },
        },
      },
      '& > div > div': {
        display: 'flex',
        justifyContent: 'center',
      },
    },
  },
});
export default useStyles;
