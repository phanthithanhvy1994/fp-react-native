// import { defaultColors } from '../../../style/const/style-const';
import { defaultColors } from '../../style/const/style-const';

const defaultWidth = 24;
const useStyles = {
  exportVoucher: {
    '& .export-voucher-dialog': {
      '& > div:nth-child(1)': {
        display: 'block',
      },
    },
    '& .MuiFormControl-root': {
      display: 'block',
    },
  },
  searchCover: {
    marginTop: '114px',
    marginBottom: '16px',
    '@media screen and (max-width: 1919px)': {
      '& .hidden-field': {
        display: 'none'
      }
    },
    '& .lineHeight': {
      display: 'block',
      marginTop: '10px !important',
      '& > div': {
        // lineHeight:'initial'
      },
    },
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
  btnSave: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    clear: 'both',
  },
  form: {
    '& div.field-wrapper': {
      width: `${defaultWidth}%`,
      '& .MuiInputBase-root.Mui-disabled': {
        background: '#d6d6d6',
      },
      '&.checkbox': {
        position: 'relative',
        transform: 'translateY(25%)',
      },
    },
    '& div.date-icon': {
      width: `${defaultWidth}%`,
      '& .MuiInputBase-root.Mui-disabled': {
        background: '#d6d6d6',
        '& .MuiInputAdornment-positionEnd': {
          opacity: '30%',
        },
      },
    },
    '& .MuiCheckbox-root': {
      color: defaultColors.secondary,
      '&:hover': {
        backgroundColor: defaultColors.secondaryHover,
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
  detailGrid: {
    '& .MuiTable-root td.MuiTableCell-root': {
      verticalAlign: 'middle !important',
    },
  },
  info: {
    fontSize: '12px',
    lineHeigh: '14.06',
  },
  detailDialog: {
    '& .form-fields': {
      '& > div[class*="Field-fpbContainer"]': {
        display: 'flex',
        alignItems: 'center',
      },
    },
    '& .MuiPaper-root': {
      minWidth: '40%',
    },
    '& .MuiDialogContent-root': {
      overflow: 'initial',
    },
    '& .showErrPopup': {
      color: defaultColors.danger,
      fontSize: '12px',
    },
    '& .MuiDialogTitle-root': {
      padding: '0px !important',
    },
    '& .ExportEmail': {
      paddingLeft: '120px',
      '& input': {
        width: '300px',
      },
    },
    '& .exportType': {
      '& > label': {
        display: 'block',
      },
    },
    '& .validate': {
      '& span.email': {
        color: defaultColors.danger,
        fontSize: '12px',
        paddingLeft: '120px',
      },
      '& .ExportEmail': {
        '& label': {
          color: defaultColors.danger,
        },
        '& fieldset': {
          border: `1px solid ${defaultColors.danger}`,
        },
      },
    },
    '& div.date-icon': {
      '& > div': {
        width: '100%',
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
  btnClear: {
    border: 'unset',
    height: '36px',
    width: '94px',
    outline: 'unset !important',
    '&:focus': {
      border: 'unset',
    },
  },
  btnSearch: {
    height: '36px',
    width: '94px',
  },
  btnDiv: {
    float: 'right',
  },
  voucherDetail: {
    '& fieldset.detail-general-info': {
      display: 'block',
    },
    '& .detail-general-info': {
      '& .label-form': {
        '& > div': {
          justifyContent: 'start'
        }
      },
    },
    '& .label-form': {
      margin: '10px auto',
    },
    '& table': {
      '& thead  > tr > th:not(th:nth-child(1))': {
        textAlign: 'center',
      },
    },
    '& .table-grid': {
      '& .MuiTable-root': {
        minWidth: 'max-content',
      },
    },
    '@media screen and (min-width: 1920px)': {
      '& .label-form': {
        '& > div': {
          display: 'flex',
          flexFlow: 'column wrap',
          maxHeight: '304px',
          '& > div': {
            maxWidth: '32%'
          }
        }
      }
    },
    '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
      '& .label-form': {
        '& > div': {
          display: 'flex',
          flexFlow: 'column wrap',
          maxHeight: '458px',
          '& > div': {
            maxWidth: '48%'
          }
        }
      }
    },
    '&.p-voucher': {
      '@media screen and (min-width: 1920px)': {
        '& .label-form': {
          '& > div': {
            display: 'flex',
            flexFlow: 'column wrap',
            maxHeight: '280px',
            '& > div': {
              maxWidth: '32%'
            }
          }
        }
      },
      '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
        '& .label-form': {
          '& > div': {
            display: 'flex',
            flexFlow: 'column wrap',
            maxHeight: '364px',
            '& > div': {
              maxWidth: '48%'
            }
          }
        }
      },
    }
  },
  closePopupBtn: {
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    '& svg': {
      color: defaultColors.secondary,
    },
    '& svg:hover': {
      borderRadius: '50%',
      background: 'rgba(253, 121, 3, 0.08)',
    },
  },
  infoDetail: {
    width: '100% !important',
    '& .label-form': {
      '& > div': {
        justifyContent: ' flex-start',
        display: 'grid',
        // Show 1 column
        gridTemplateColumns: 'repeat(1, 1fr)',
      },
    },
    '& .form-fields':{
      margin: '0 auto',
    },
    '& .form-fields > div > div:nth-child(1)': {
      width: '48% !important',
      float: 'left',
      '& > div': {
        width: '100%',
      },
    },
    '& .form-fields > div > div:nth-child(n+2)': {
      width: '24% !important',
      float: 'right',
      marginLeft: '1% !important',
    },
  },
  btnPopupEdit: {
    clear: 'both',
    // padding: '30px 0 0',
  },
};

export default useStyles;
