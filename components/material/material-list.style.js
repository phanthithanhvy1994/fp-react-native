const sidebarWidth = '57px';
const formPadding = '15px';
const fieldPadding = '24px';
const searchFormContentPadding = ' 16px';
const usedWidth = `calc(${sidebarWidth} + 2 * ${formPadding} + 2 * ${searchFormContentPadding})`;

const useStyles = {
  subTitle: {
    width: '100%',
    borderBottom: '4px solid',
    fontSize: 24,
    marginTop: 7,
    marginBottom: 24,
    'border-image-slice': 1,
    'border-width': 5,
    'border-image-source':
      'linear-gradient(90deg, #FD7902 0%, #6B6C99 55.21%, #0D9499 100%);',
  },
  materialListSearchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
  },
  searchForm: {
    padding: '6px 16px',
  },
  materialList: {
    '& .MuiCardContent-root': {
      '& p.MuiTypography-root:first-of-type': {
        fontWeight: 'bold',
        fontSize: 16,
      },
    },
    '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
      // Show 4 columns on screen 1366px
      '& .field-wrapper': {
        width: `calc(
        (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
      )`,
      },
    },
  },
};

export default useStyles;
