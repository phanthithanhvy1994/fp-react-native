import { defaultColors } from '../../../../style/const/style-const';

const useStyles = {
  form: {
    '& div.field-wrapper': {
      '& .MuiInputBase-root.Mui-disabled': {
        background: '#d6d6d6',
      },
      '&.checkbox': {
        position: 'relative',
        transform: 'translateY(25%)',
      },
    },
    '& div.date-icon': {
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
    '& .grid-large-content': {
      '& .table-grid': {
        '& .MuiPaper-rounded > div[class*=Component-horizontalScrollContainer] div': {
          // limit about 5 records, if larger, scroll to see more information
          maxHeight: 650,
        },
        '& .MuiTable-root td.MuiTableCell-root': {
          verticalAlign: 'middle',
          position: 'relative',
          '& div.field-wrapper': {
            '&.checkbox': {
              position: 'unset',
              transform: 'unset',
              '& > span': {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 'auto',
                width: 36,
                height: 36,
              },
            },
          },
        },
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
      '&.form-compare .form-field-label': {
        width: '450px',
        '& > div': {
          display: 'block',
          '& .label': {
            width: '500px'
          },
          '& .label-value': {
            justifyContent: 'center',
            color: defaultColors.secondary,
            width: 'calc(100% - 300px)'
          }
        }
      },
    },
    '& .general-action': {
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': {
        width: 110,
        marginLeft: 16,
      },
    },
    '& .table-grid tr.mrp': {
      background: 'rgba(253, 121, 3 , 0.08)',
    },
    '@media screen and (min-width: 240px) and (max-width: 1279px)': {
      '& .label-form': {
        '& > div': {
          display: 'grid',
          // Show 1 column
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
          // Show 3 columns
          gridTemplateColumns: 'repeat(3, 1fr)',
          columnGap: '24px',
        },
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
    '& > .noOutLineBtn': {
      border: 'none',
    },
    '& button.export-detail-btn': {
      width: 94,
    },
    '& label.export-detail-btn': {
      marginLeft: 16
    }
  },
  info: {
    fontSize: '12px',
    lineHeigh: '14.06',
    '&.multi-fields-inline': {
      display: 'flex',
      justifyContent: 'flex-start',
      '& > p': {
        marginRight: 15,
        marginBottom: 0,
      },
    },
  },
};

export default useStyles;
