import { defaultColors } from '../../../../style/const/style-const';

const useStyles = () => ({
  btnAdd: {
    width: 'auto',
    marginBottom: '3px',
  },
  searchCover: {
    marginTop: '114px',
    marginBottom: '16px',
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  priceListToolBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& img': {
      paddingRight: 5,
      paddingBottom: 2,
    },
  },
  btnSecondaryTextOnly: {
    color: defaultColors.secondary,
  },
});
export default useStyles;
  