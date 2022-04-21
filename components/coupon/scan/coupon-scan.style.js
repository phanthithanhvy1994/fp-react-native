import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  detailDialog: {
    '&.scan-popup': {
      '& .MuiDialog-paperScrollPaper': {
        maxHeight: '98%',
      },
      '& .bottom-div-btn': {
        textAlign: 'end',
        '& > button': {
          minWidth: '94px',
          border: 'none',
        },
      },
      '& .clear-icon': {
        color: defaultColors.secondary,
        cursor: 'pointer',
      },
      '& .clear-icon:hover': {
        borderRadius: '50%',
        background: 'rgba(253, 121, 3, 0.08)',
      },
      '& .field-wrapper': {
        width: 'calc(calc(85vw - 80px)/3)',
      },
    },
    '& .MuiPaper-root': {
      minWidth: '85%',
      minHeight: '85%',
    },
    '& .MuiDialogContent-root': {
      overflow: 'initial',
    },
    '& .MuiDialogTitle-root': {
      padding: '0px !important',
    },
    '& .scan-popup.detail-general-info > legend': {
      marginBottom: '0px',
    },
    '& .scan-popup.detail-list-info': {
      '& > legend': {
        marginBottom: '0px',
      },
      '& .table-grid': {
        marginTop: '0px',
        fontSize: '12px',
        '& .MuiPaper-root .MuiTable-root thead tr th': {
          fontSize: '12px',
        },
      },
    },
    '& .label-form': {
      '& > div': {
        justifyContent: 'unset',
        '@media screen and (min-width: 240px) and (max-width: 1279px)': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
        '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: '24px',
        },
        '@media screen and (min-width: 1920px)': {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          columnGap: '24px',
        },
      },
    },
    '@media screen and (min-width: 240px)': {
      '& .scan-popup .table-grid': {
        '& .MuiPaper-rounded > div[class*=Component-horizontalScrollContainer] div': {
          // limit about 5 records, if larger, scroll to see more information
          maxHeight: '200px',
        },
      },
    },
    '@media screen and (min-width: 1920px)': {
      '& .scan-popup .table-grid': {
        '& .MuiPaper-rounded > div[class*=Component-horizontalScrollContainer] div': {
          // limit about 10 records, if larger, scroll to see more information
          maxHeight: '400px',
        },
      },
    },
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '98%',
    marginLeft: '1%',
    '& span': {
      color: defaultColors.primary,
    },
  },
  addItemsPopUp: {
    '& .Muidialog-paper': {
      overflowY: 'none',
    },
    '& .table-selection': {
      display: 'contents',
    },
  },
  emptyScanRow: {
    minHeight: 36,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: defaultColors.rgbaPrimaryOpacity.replace('%OPACITY%', 0.15),
    borderRadius: '0px',
    color: defaultColors.secondary,
    fontSize: '12px',
    lineHeight: '14px',
    paddingLeft: '16px',
    fontWeight: 'bold',
    '&.remind-scan': {
      textAlign: 'center',
    },
  },
};

export default useStyles;
