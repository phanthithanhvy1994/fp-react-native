import { borderStyles, defaultColors } from '../../../style/const/style-const';
import { makeStyles } from '@material-ui/core/styles';

const defaultWidth = 24;
export const styleForm = makeStyles(() => ({
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
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
    ' & > div': {
      padding: 0,
      '& > h2': {
        fontSize: '24px',
        fontWeight: '400'
      }
    }
  },
  createdDialog: {
    '& .MuiPaper-root': {
      maxHeight: 'calc(100% - 20px) !important',
      width: '80%',  
      padding: '12px 16px 16px 16px',
      maxWidth: 'unset'
    },
    '& .btnClose': {
      width: '36px',
      height: '36px',
      textAlign: 'center',
      borderRadius: '50%',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: defaultColors.secondaryHover,
      },
      '& > svg': {
        fill: defaultColors.secondary
      }
    },
    '& .MuiDialogContent-dividers': {
      border: 'none',
      padding: '0',
      '& legend': {
        marginBottom: '0'
      },
      '& .MuiFormLabel-root.Mui-disabled': {
        color: defaultColors.neutralContent
      }
    },
    '& .btnAction': {
      padding: '16px 0 0 0' 
    },
    '& .MuiRadio-colorSecondary:hover': {
      backgroundColor: defaultColors.secondaryHover
    }
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
  groupPrefixSerial: {
    display: 'flex',
    marginTop: '18px'
  },
  leftGroup: {
    width: '60%',
    marginRight: '24px',
    position: 'relative',
    '& .generalField': {
      display: 'flex',
      '& > div:first-child': {
        paddingRight: '12px'
      },
      '& > div:last-child': {
        paddingLeft: '12px'
      },
      '& .radioFieldCls': {
        marginTop: '12px',
        '& > div': {
          paddingLeft: '12px',
        },
        '& > legend, label': {
          marginBottom: '0'
        }
      }
    }
  },
  rightGroup: {
    flex: 1,
    '& > div': {
      height: '100%',
      flexDirection: 'column'
    }
  },
  haftGroup: {
    width: '49%',
  },
  contentGroup: {
    overflow: 'hidden',
    display: 'flex',
    '& .floatLeft': {
      float: 'left',
    },
    '& .floatRight': {
      float: 'right',
    },
    '& .field-wrapper': {
      width: '100%',
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
      top:'130px',
      left:'50%',
      paddingLeft: '12px',
    },
    '& .bookletGroup': {
      '& .booklet-cls': {
        display: 'flex',
        margin: 0,
        '& > legend': {
          marginBottom: 'unset'
        },
        '& > div': {
          width: '334px',
          margin: '0 44px 0 0',
          '& .total-voucher-fld': {
            width: '130px',
            margin: '0 !important',
            '& label.MuiInputLabel-shrink': {
              width: '130px',
              fontSize: '12px',
              transform: 'scale(1)',
            }
          },
          '& .num-of-voucher-fld': {
            width: '160px',
            margin: '0 !important',
            '& label.MuiInputLabel-shrink': {
              width: '160px',
              fontSize: '12px',
              transform: 'scale(1)',
            }
          },
        },
        '& div.fullWidth': {
          width: '100%',
        },
        '& .totalBooklet': {
          flex: 1,
          margin: '0',
          fontSize: '12px',
          padding: '15px 10px',
          backgroundColor: '#DBEFF0',
          fontWeight: 'bold',
          color: defaultColors.secondary,
          '& > .numOfTotal': {
            float: 'right'
          }
        },
      },
      '& .booklet-error': {
        margin: 0,
        '& > span': {
          fontSize: '12px',
          color: defaultColors.error
        },
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
    '& .prefixGroup': {
      height: '100%',
      marginBottom: '0',
      '& > div': {
        margin: 0,
        flexDirection: 'column',
      },
      '& div.year-cls': {
        width: '55px',
        margin: 0
      },
    },
    '& .serialGroup': {
      marginBottom: '0',
      '& .no-digits-cls': {
        margin: 0
      },
      '& > div': {
        width: 'unset',
        display: 'initial',
        flexWarp: 'inherit',
      },
      '& .field-wrapper': {
        width: '45px',
        float: 'left',
      },
      '& .serialTypeWidth': {
        float: 'right',
      },
      '& div.fullWidth': {
        width: '100%',
      },
      '& .issueWidth': {
        width: 'calc(100% - 110px)',
        marginRight: '10px',
      },
    },
    '& .noteHeight': {
      flex: 1,
      '& > textarea': {
        height: '96% !important',
        overflowY: 'auto !important',
        fontSize: '12px',
      },
    },
    '& .eVoucher': {
      '& .total-voucher-fld': {
        width: '50%',
        paddingRight: '12px',
        '& > div': {
          width: '60%'
        }
      },
      '& .valid-from-date': {
        width: '25%',
        padding: '0 2px 0 12px',
      },
      '& .valid-to-date': {
        width: '25%',
        paddingLeft: '14px'
      },
      '& .not-correct': {
        '& .MuiOutlinedInput-adornedEnd': {
          paddingRight: '8px'
        },
        '& div.MuiInputAdornment-positionEnd > button': {
          '&:hover, :focus': {
            backgroundColor: 'unset',
          },
          '& > span:first-child': {
            fontSize: '12px',
            cursor: 'default'
          },
        } 
      },
      '& .market-place': {
        width: '50%',
        paddingRight: '12px',
        margin: '10px 0'
      },
      '& .styleActivation': {
        width: '50%',
        paddingLeft: '12px',
        margin: '12px 0 0 0',
        '& > div': {
          '& > label': {
            margin: '6px 16px 0 0',
            '& > span.MuiRadio-root': {
              padding: '2px'
            }
          },
        },
      }
    },
  },
  btnClear: {
    border: `1px solid ${defaultColors.borderColor}`,
    height: '36px',
    width: '94px',
    marginRight: '8px'
  },
  btnPrimary: {
    height: '36px',
    width: '94px',
  },
  btnSave: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
}));

export default styleForm;
