import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  vPAllocationPageHeader: {
    '& .value-pack-allocation-scanning-btn': {
      padding: '11px 28px',
      marginBottom: '8px',
      '& .MuiButton-endIcon': {
        marginLeft: '16px',
        marginRight: '-10px',
        '& svg': {
          '& path': {
            fill: '#ffffff',
          },
        },
      },
    },
  },
  searchVPAllocationCover: {
    marginTop: '114px',
    marginBottom: '16px',
    '& .value-pack-allocation-general-information-form': {
      '& > div': {
        justifyContent: 'center',
      },
    },
    '& .detail-general-info': {
      marginTop: '16px',
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
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: '24px',
          },
        },
      },
      '@media screen and (min-width: 1920px)': {
        '& .label-form': {
          '& > div': {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
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
            maxHeight: '450px',
          },
        },
      },
    },
  },
  vPAllocationDetailGrid: {
    fontSize: '12px',
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
  vPAllocationBottomGridBtn: {
    margin: '16px 0px',
    textAlign: 'end',
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
