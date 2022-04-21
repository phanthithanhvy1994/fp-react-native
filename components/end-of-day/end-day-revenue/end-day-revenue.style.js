import { defaultColors } from '../../../style/const/style-const';
const sidebarWidth = '57px';
const formPadding = '15px';
const fieldPadding = '24px';
const searchFormContentPadding = ' 16px';
const usedWidth = `calc(${sidebarWidth} + 2 * ${formPadding} + 2 * ${searchFormContentPadding})`;

const useStyles = {
  eODCover: {
    '& .eod-general-information-form': {
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
      '@media screen and (min-width: 1280px)': {
        '& .label-form': {
          '& > div': {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: '24px',
          },
        },
      },
    },
    '& .table-grid': {
      '& .MuiPaper-rounded': {
        '& > div[class*="Component-horizontalScrollContainer"]': {
          '& div': {
            // limit about 5 records, if larger, scroll to see more information
            maxHeight: 'calc(100vh - 634px)',
            maxWidth: 'calc(100vw - 140px)',
          },
        },
      },
      '& table': {
        '& thead  > tr': {
          '& > th > span': {
            minWidth: 'max-content',
          }
        },
        '& tbody': {
          '& > tr': {
            '&  > td:nth-child(2)': {minWidth: '200px', maxWidth: '500px'},
            '&  > td:nth-child(n+18):nth-child(-n+21)': {minWidth: '220px', maxWidth: '500px'},
          }, 
        },
      },
    },
    '& > div > fieldset:nth-child(2)': {
      marginBottom: 'unset',
    },
  },
  eODDetailGrid: {
    fontSize: '12px',
    '& .pagination': {
      bottom: '79px !important',
    },
  },
  bottomGridLabelArea: {
    background: '#dbeff0',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0px',
    color: defaultColors.secondary,
    '& .bottom-grid-label': {
      marginTop: '15px',
      marginBottom: '15px',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  },
  eODBottomGridBtn: {
    backgroundColor: 'white',
    position: 'sticky',
    bottom: '20px',
    marginBottom: '16px',
    zIndex: '1000',
    paddingTop: '16px',
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
  searchEODCover: {
    marginTop: '120px',
    paddingBottom: '5px',
    '& .user-search-bar > div:nth-child(1) > div': {
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
  },
};

export default useStyles;
