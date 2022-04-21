import { defaultColors } from '../../../../style/const/style-const';
import { makeStyles } from '@material-ui/core/styles';

const defaultWidth = 24;
export const styleForm = makeStyles({
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
  createdDialog: {
    '& .MuiPaper-root': {
      width: '70%',
      padding: '12px 16px 16px 16px',
      maxWidth: 'unset'
    },
    '& div.subtitle': {
      margin: 0,
      ' & > div': {
        padding: 0,
        '& > h2': {
          fontSize: '24px',
          fontWeight: '400'
        }
      }
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
      padding: '4px 0'
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

  leftGroup: {
    flex: 1,
    paddingRight: '12px',
    height: 'fit-content',
    '& legend': {
      margin: 0
    },
    '& .voucher-name-fld': {
      width: '75%',
      paddingRight: '16px'
    },
    '& .sale-oder-no-fld': {
      flex: '1'
    },
    '& .formGroupField': {
      display: 'flex',
      marginTop: '12px',
      '& .leftFormGroupField': {
        '& .prefixGroup': {
          height: '100%',
          padding: '6px 16px 12px 16px',
          '& > div': {
            margin: 0,
            flexDirection: 'column',
          },
          '& div.year-cls': {
            width: '55px',
            margin: '6px 0 28px 0',
          },
          '& div.type-cls': {
            margin: 0,
          },
        },
      },
      '& .rightFormGroupField': {
        '& .serialGroup': {
          height: '100%',
          marginBottom: '4px',
          '& > legend': {
            marginBottom: 0
          },
          '& > div': {
            display: 'initial',
          },
          '& .field-wrapper': {
            width: '50px',
            float: 'left',
            margin: 0
          },
          '& .serialTypeWidth': {
            float: 'right',
          },
          '& div.fullWidth': {
            width: '100%',
            margin: '6px 0 24px 0'
          },
          '& .issueWidth': {
            width: 'calc(100% - 110px)',
            margin: '0 5px 4px 0',
          },
        },
      }
    },
    '& .comboGroupField': {
      marginTop: '4px',
      '& > div': {
        display: 'flex',
      }
    }
  },
  rightGroup: {
    flex: 1,
    paddingLeft: '12px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& > div:last-child': {
      flex: 1,
      '& > div > textarea': {
        height: '95.5% !important',
        overflowY: 'auto !important',
        fontSize: '12px',
      }
    }
  },
  contentGroup: {
    display: 'flex',
    overflow: 'hidden',
    height: 'fit-content',
    '& div.MuiFormControl-root': {
      width: '100%'
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: defaultColors.neutralContent
    },
    '& .leftGroupField': {
      flex: 1,
      paddingRight: '8px'
    },
    '& .rightGroupField': {
      flex: 1,
      paddingLeft: '8px'
    },
    '& .ApplyDate': {
      color: defaultColors.neutralContent,
      fontSize: '12px',
      fontWeight: '400',
      margin: '12px 0 4px 0'
    },
    '& .MuiButtonGroup-root': {
      width: '100%',
      height: '32px',
      border: '1px solid #C4C4C4',
      borderBottom: `1px solid ${defaultColors.borderColor}`,
      display: 'flex',
      borderRadius: '0',
      '& .MuiButtonGroup-grouped': {
        flex: 1,
        border: 'none',
        borderRadius: '0',
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
  btnAction: {
    padding: '12px 0 0 0' 
  },
});

export default styleForm;
