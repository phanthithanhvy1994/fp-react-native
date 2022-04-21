import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  couponDetail: {
    '& .searchCover': {
      marginTop: 114,
      paddingBottom: 5,
    },
    '& .detail-general-info': {
      position: 'relative',
      '& .label-form': {
        paddingBottom: 50,
        '& > div': {
          justifyContent: 'start'
        }
      },
    },
    '& .general-action': {
      position: 'absolute',
      bottom: 8,
      right: 16,
    },
    '& .table-grid .MuiSvgIcon-root': {
      width: 18,
      height: 18,
    },
    '@media screen and (min-width: 1920px)': {
      '& .label-form': {
        '& > div': {
          display: 'flex',
          flexFlow: 'column wrap',
          maxHeight: '282px',
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
          maxHeight: '384px',
          '& > div': {
            maxWidth: '47%'
          }
        }
      }
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
  btnPopupEdit: {
    padding: '0',
  },
  editInfo: {
    minHeight: 250,
    '& svg': {
      fill: 'currentColor'
    },
    '& .form-fields':{
      margin: 0,
    },
    '& .showErrPopup': {
      color: defaultColors.danger,
      fontSize: '12px',
    },
    '& fieldset': {
      paddingBottom: 16,
    },
    '& .label-form': {
      '& > div': {
        justifyContent: ' flex-start',
        display: 'grid',
        // Show 1 column
        gridTemplateColumns: 'repeat(1, 1fr)',
      },
    },
    '& div[class*=form-fields]': {
      '& [class*="Field-fpbContainer"]': {
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiFormControl-root': {
        display: 'flex',
      },
      '& > div': {
        '& > div:nth-child(1)': {
          width: '33%',
          paddingRight: '16px',
        },
        '& > div:nth-child(2)': {
          width: '33%',
          paddingRight: '8px',
          paddingLeft: '8px',
        },
        '& > div:nth-child(3)': {
          width: '33%',
          paddingLeft: '16px',
        },
      },
    },

    '& div[class*=Field-fldSelect]': {
      width: '33%',
    },
    '& div[class*=Field-fldPicker]': {
      width: '33%',
      paddingLeft: 18,
      '& svg': {
        '& path': {
          fill: defaultColors.primary,
        },
      },
    },
    '& .form-fields.search-form .field-wrapper': {
      margin: 'unset',
      '& .MuiInputBase-adornedEnd': {
        width: '100%',
      },
    },
  },
  titleEdit: {
    marginTop: 0,
    '& > .MuiDialogTitle-root': {
      width: '93%',
      '&  h2': {
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },

    '& span': {
      width: '36px',
      height: '36px',
      textAlign: 'center',
      cursor: 'pointer',
    },
  },
};

export default useStyles;
