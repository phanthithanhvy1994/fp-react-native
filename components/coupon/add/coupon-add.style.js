import { borderStyles, defaultColors } from '../../../style/const/style-const';

export const styleForm = {
  dialogContentCoupon: {
    flex: '1 1 auto',
    height: 'max-content'
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '98%',
    marginLeft: '1%',
    marginTop: '12px',
    '& span': {
      color: defaultColors.secondary,
      height: '36px',
      width: '36px',
      textAlign: 'center',
      borderRadius: '50%',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: defaultColors.secondaryHover,
      },
    },
  },
  addDialog: {
    '& .full-width': {
      width: '100%'
    },
    '& .half-width': {
      width: '50%'
    },
    '& .part-width': {
      width: '32%'
    },
    '& .left-half-width': {
      width: '50%',
      paddingRight: '8px',
    },
    '& .right-half-width': {
      width: '50%',
      paddingLeft: '8px',
      
    },
    '& .type-of-1': {
      margin: '6px 0',
      '& > textarea': {
        height: '90% !important',
      }
    },
    '& .type-of-2': {
      margin: '5px 0',
      '& > textarea': {
        height: '95% !important',
      }
    },
    '& .type-of-3': {
      margin: '10px 0',
      '& > textarea': {
        height: '92% !important',
      }
    },
    '& .is-error': {
      visibility: 'initial',
    },
    '& .no-error': {
      visibility: 'hidden',
    },
    '& .valid-date': {
      fontSize: '12px',
      color: defaultColors.error,
      position: 'absolute',
      top:'265px',
      left:'68%',
      paddingLeft: '6px',
    },
    '& .valid-after-cls': {
      marginBottom: '20px'
    },
    '& .MuiIconButton-colorSecondary:hover, .MuiIconButton-colorSecondary.Mui-checked:hover': {
      backgroundColor: defaultColors.secondaryHover
    },

    '& .small-end-adornment': {
      '& .MuiInputAdornment-root > button': {
        fontSize: '12px',
        '&:hover, :focus': {
          backgroundColor: 'unset',
        },
        '& > span:first-child': {
          fontSize: '12px',
          cursor: 'default'
        },
      }
    },
    '& .MuiDialog-paper': {
      width: 'calc(100vw - 265px)',
      maxHeight: 'calc(100vh - 20px)',
      maxWidth: 'unset',
      '& .MuiDialogContent-dividers': {
        display: 'flex',
        flexDirection: 'row',
        padding: '4px 16px 10px 16px',
        border: 'unset',
        overflowY: 'unset',
      },
      '& div.subtitle': {
        marginBottom: '0',
        paddingBottom: '4px',
        '& > div': {
          padding: 'unset',
          '& > h2': {
            fontSize: '24px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: '36px',
            color: defaultColors.neutralContent
          },
        },
      },
      '& .MuiDialogActions-root': {
        padding: '6px 16px 12px 16px',
        '& > span': {
          padding: 0,
        }
      }
    },
    '& legend': {
      marginBottom: 'unset'
    },
    '& div.fullWidth': {
      width: '100%',
    },
  },
  topDialog: {
    display: 'flex',
    width: '100%',
  },
  leftTopDialog: {
    flex: 1,
    paddingRight: '12px',
    '& > div:first-child > div:first-child > div > div': {
      height: '28px',
    },
    '& .type-radio': {
      display: 'flex',
      '& > div': {
        display: 'flex',
        margin: 0,
        '& .MuiFormControl-root': {
          '& > legend': {
            color: defaultColors.neutralContent
          },
          '& .MuiFormControlLabel-root .MuiIconButton-label': {
            color: defaultColors.secondary
          },
          '& > div > label': {
            marginBottom: 'unset'
          },
        },
        '& > .codeTypeElectronic': {
          width: '50%',
          paddingRight: '8px'
        },
        '& > .codeTypeLeaflet': {
          '& span.MuiRadio-colorSecondary': {
            padding: '4px'
          }
        },
        '& > .codeTypeReceipt': {
          width: '40%',
          paddingRight: '8px',
          '& > div > label > span:first-child': {
            padding: '0',
            margin: '4px 9px'
          }
        },
        '& .validateDateType': {
          width: '40%',
          paddingLeft: '8px',
          '& > div > label > span:first-child': {
            padding: '0',
            margin: '4px 9px'
          }
        },
        '& .total-receipt': {
          width: '20%',
        },
        '& .total-electric': {
          width: '50%',
          paddingLeft: '8px',
        },
        '& > div.field-wrapper': {
          margin: '0 !important',
          '& .MuiFormControl-root': {
            width: '100%'
          }
        }
      },
    },
  },
  rightTopDialog: {
    paddingLeft: '12px',
    '& > div > div': {
      margin: '10px 0',
    },
    '& .couponValueTypeRadio': {
      margin: '12px 0 7px 0',
      width: '100%',
      '& > div.MuiFormGroup-root': {
        '& > label': {
          width: '100%',
          marginBottom: '0',
          '> span.MuiRadio-colorSecondary': {
            padding: '7px'
          }
        },
        '& > div': {
          width: '100%',
          paddingLeft: '28px',     
          '& .MuiOutlinedInput-root': {           
            '&:hover fieldset': {
              borderColor: defaultColors.secondary,
            },
            '&.Mui-focused fieldset': {
              borderColor:  defaultColors.secondary,
            },
          },
        }
      }
    },
  },
  bottomDialog: {
    display: 'flex',
    width: '100%',
  },
  leftBottomDialog: {
    flex: 1,
    paddingRight: '12px',
    '& .bookletGroup': {
      paddingBottom: '0px',
      margin: '6px 0 0 0',
      '& > .booklet-cls': {
        display: 'flex',
        margin: 0,
        '& > div': {
          width: '50%',
          display: 'flex',
          margin: 0,
          '& div.totalCoupon': {
            paddingRight: '8px',
            margin: '0px !important',
            width: '40%',
            '& > div > label': {
              width: '130px',
              transform: 'scale(1)',
              fontSize: '12px',
            },
          },
          '& div.numOfCoupon': {
            paddingLeft: '8px',
            margin: '0px !important',
            flex: 1,
            '& > div > label': {
              width: '160px',
              transform: 'scale(1)',
              fontSize: '12px',
            },
          },
        },
        '& .totalBooklet': {
          height: '40px',
          fontSize: '12px',
          padding: '13px 10px',
          backgroundColor: '#DBEFF0',
          fontWeight: 'bold',
          margin: '8px 0 0 44px',
          flex: 1,
          color: defaultColors.secondary,
          '& span': {
            marginRight: '36px'
          }
        },
      },
      '& .booklet-error': {
        margin: 0,
        '& > span': {
          fontSize: '12px',
          color: defaultColors.error
        },
        '& .is-error': {
          visibility: 'initial',
        },
        '& .no-error': {
          visibility: 'hidden',
        }
      }
    },
    '& .ApplyDate': {
      color: defaultColors.neutralContent,
      fontSize: '12px',
      fontWeight: '400',
      margin: '0 0 4px 0',
      '& > span': {
        color: defaultColors.error
      }
    },
    '& .MuiButtonGroup-root': {
      width: '100%',
      height: '32px',
      border: `1px solid ${borderStyles.borderColor}`,
      display: 'flex',
      borderRadius: '0',
      '& .MuiButtonGroup-grouped': {
        flex: '1',
        border: 'none',
        borderRadius: '0',
        '& > span.MuiButton-label': {
          textTransform: 'none'
        },
        '& :focus': {
          backgroundColor: defaultColors.neutral,
        },
      },
      '& .checkedApply': {
        color: defaultColors.neutral,
        backgroundColor: defaultColors.focus,
      },
    },
  },
  rightBottomDialog: {
    paddingLeft: '12px',
    display: 'flex',
    '& > div': {
      flexFlow: 'column',
    },
    '& .noteCoupon': {
      fontSize: '13px',
      flex: '1',
      '& > textarea': {
        overflowY: 'auto !important',
        '&:focus': {
          outlineColor: defaultColors.secondary
        }
      },
    }
  },
  
  groupSerialNo: {
    display: 'flex',
    '& .prefixGroup': {
      width: '50%',
      margin: '8px 8px 0 0',
      '& > div': {
        margin: 0,
        flexDirection: 'column',
        '& > div.year-cls': {
          margin: 0,
          width: '60px',
          '& > div': {
            width: '44px',
          }
        },
        '& > div:nth-child(2)': {
          margin: '6px 0 4px 0',
          flex: 1,
        },
      } 
    },
    '& .serialGroup': {
      flex: '50%',
      margin: '8px 0 0 8px',
      '& > div': {
        '& > div:first-child': {
          margin: 0
        },
        '& > div:nth-child(2)': {
          margin: '6px 0 4px 0'
        },
        margin: 0,
        '& .year-cls': {
          width: 'calc((50% - 40px)/2)',
          margin: '6px 0 4px 0'
        },
        '& .serial-type': {
          width: 'calc((50% - 40px)/2)',
          margin: '6px 0 4px 0'
        },
      }
    }
  },
  buttonDialog: {
    padding: '8px',
    '& .clearDialog': {
      border: `1px solid ${defaultColors.borderColor}`,
      height: '36px',
      width: '94px',
      marginRight: '8px'
    },
    '& .submitDialog': {
      width: '94px',
      background: defaultColors.secondary
    },
  }
};

export default styleForm;