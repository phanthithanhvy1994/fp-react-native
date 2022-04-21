const sidebarWidth = '57px';
const formPadding = '15px';
const fieldPadding = '24px';
const searchFormContentPadding = ' 16px';
const usedWidth = `calc(${sidebarWidth} + 2 * ${formPadding} + 2 * ${searchFormContentPadding})`;
const useStyles = {
  userForm: {
    marginTop: '114px',
    paddingBottom: '5px',
    '& .personal-information-form': {
      '& > div': {
        justifyContent: 'center',
      },
    },
    '& .detail-general-info': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      '& .label-form': {
        '& > div': {
          justifyContent: 'center',
        },
      },
      '@media screen and (min-width: 240px) and (max-width: 1279px)': {
        '& .label-form': {
          '& > div': {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
          },
        },
      },
      '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
        '& .label-form': {
          '& > div': {
            display: 'grid',
            // Show 2 columns
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: '24px',
          },
        },
      },
      '@media screen and (min-width: 1920px)': {
        '& .label-form': {
          '& > div': {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap: '24px',
          },
        },
      },
    },
    '& .user-search-bar > div > div': {
      '&.field-wrapper': {
        '@media screen and (min-width: 1920px)': {
          // Show 4 columns
          width: `calc((100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4)`,
        },
        '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
          // Show 3 columns
          width: `calc((100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 3)`,
        },
        '@media screen and (min-width: 769px) and (max-width: 1279px)': {
          // Show 2 columns
          width: `calc((100vw - (${usedWidth} + ${fieldPadding})) / 2)`,
        },
        '@media screen and (min-width: 240px) and (max-width: 768px)': {
          // Show 1 columns
          width: `calc(100vw - ${usedWidth})`,
        },
      },

      '& .MuiTextField-root': {
        width: '100%',
      }
    },
  },

  bottomGridBtn: {
    textAlign: 'end',
    '& > label > button': {
      width: '94px',
    },
    '& > button': {
      marginLeft: '16px',
      minWidth: '94px',
    },
    '& > .noOutLineBtn': {
      border: 'none',
    },
  },
};
export default useStyles;