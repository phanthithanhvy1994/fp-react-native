import { defaultColors } from '../../../style/const/style-const';

const useStyles = () => ({
  btnAdd: {
    width: 'auto',
    margin: '-8px 0 3px',
  },
  addForm: {
    '& .branch-bom-price-search-bar': {
      '& > div:nth-child(1)': {
        '& > div': {
          justifyContent: 'flex-start',
          '& > div:nth-child(1)': {
            paddingLeft: 'unset',
          },
          '& > div': {
            width: 'calc(100% / 3)',
            height: 60,
            paddingLeft: 25,
          },
        },
      },
    },
    '& .branch-bom-price-add-bar': {
      height: 'max-content',
      padding: '8px',
      '& > div:nth-child(1)': {
        '& > div': {
          justifyContent: 'flex-start',
          '& > div:nth-child(1)': {
            paddingLeft: 'unset',
            '& > div': {
              width: ' 100%',
              height: 60,
            },
          },
          '& > div:nth-child(4)': {
            paddingLeft: 'unset',
          },
          '& > div:nth-child(7)': {
            paddingLeft: 'unset',
            '& > div': {
              width: '100%',
              height: 60,
            },
          },
          '&> div': {
            width: 'calc(100% / 3)',
            height: 60,
            paddingLeft: 20,
            margin: '8px 0px 0px 0px',
          },
        },
      },
      '& > span': {
        margin: '0px',
        float: 'right',
      },
    },
  },
  fieldRoleName: {
    width: '49%',
  },
  searchCover: {
    marginTop: '114px',
    marginBottom: '16px',
    '& .hidden-field': {
      '@media screen and (max-width: 1919px)': {
        display: 'none !important',
      },
    },
  },
  titlePage: {
    justifyContent: 'space-between',
    padding: '12px 16px 16px',
    '& .MuiDialogTitle-root': {
      width: '100%',
      borderBottom: '4px solid',
      fontSize: 24,
      marginBottom: 16,
      padding: '0 0 4px 0',
      'border-image-slice': 1,
      'border-width': 5,
      'border-image-source': 'linear-gradient(90deg, #FD7902 0%, #6B6C99 55.21%, #0D9499 100%);',
      '& > h2': {
        '& > span': {
          fontSize: '24px',
          fontWeight: 400
        },
        '& > button': {
          padding: 0,
          height: '36px',
          width: '36px',
          top: 12,
          right: 16,
          color: defaultColors.secondary,
          '&:hover': {
            backgroundColor: defaultColors.secondaryHover
          }
        },
      }
    },
    '& .MuiDialogContent-root': {
      padding: 'unset',
      '& fieldset': {
        padding: 8,
      },
    },
    '& legend': {
      marginBottom: 0
    }
  },
  btnAction: {
    textAlign: 'end'
  },
  priceListToolBar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btnSecondaryTextOnly: {
    color: defaultColors.secondary,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textTransform: 'initial',
    textDecorationLine: 'underline',
  },
  btnSave: {
    height: '36px',
    width: '94px',
    textTransform: 'none',
  },
  btnClear: {
    height: '36px',
    width: '94px',
    marginRight: '16px'
  },
  pageHeaderMargin: {
    marginTop: '140px',
  },
  hiddenArea: {
    display: 'none',
  },
  BOMPriceList:{
    '& .MuiTable-root': {
      width: 'max-content',
      minWidth: '100%',
    },
    '& .table-grid': {
      // Scroll table grid in View Details and View Edit
      '& .MuiPaper-rounded > div > div > div': {
        '@media screen and (max-width: 1919px)': {
          maxHeight: 395,
        },
        '@media screen and (min-width: 1920px)': {
          maxHeight: 485,
        }
      },
    },
    '&.collapsed-search-area .table-grid .MuiPaper-rounded > div > div > div': {
      '@media screen and (min-width: 1920px)': {
        maxHeight: 600,
      },
      '@media screen and (max-width: 1919px)': {
        maxHeight: 295,
      },
    }
  },
  branchBomPrice: {
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
    },
    '& .grid-large-content': {
      '& .table-grid': {
        '& .MuiTable-root td.MuiTableCell-root': {
          verticalAlign: 'middle',
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
  buttonOnGrid: {
    textAlign: 'end',
    '& button': {
      width: 94,
    },
  },
  branchBomPriceEdit: {
    '& table': {
      '& th:nth-child(2), td:nth-child(2)': {
        width: '5% !important'
      },
      '& thead': {
        '& th:nth-child(2)': {
          '& svg': {
            display: 'none'
          }
        }
      },
      '& tbody': {
        fontSize: '12px',
        '& td': {
          height: '48px',
          paddingTop: 0,
          paddingBottom: 0,
          textAlign: 'center',
          '& > div': {
            color: 'inherit',
            '& > input': {
              fontSize: '12px',
            },
            '& > div > p': {
              fontSize: '12px',
            },
            '& > div > label': {
              display: 'none',
            }
          },
          '& button.view-btn': {
            color: 'rgba(0, 0, 0, 0.87)',
            height: '36px',
            width: '36px',
            minWidth: 'unset',
            padding: 0,
            borderRadius: '50%',
            '& > span': {
              height: '36px',
              width: '36px',
              '& > span': {
                margin: 0
              }
            }
          }
        }
      }
    },
    '& > form': {
      marginTop: 110,
    },
    '& .table-grid': {
      // Scroll table grid in View Details and View Edit
      '& .MuiPaper-rounded > div > div > div': {
        '@media screen and (max-width: 1919px)': {
          maxHeight: 255,
        },
        '@media screen and (min-width: 1920px)': {
          maxHeight: 410,
        }
      },
    },
  },
  editBOMPrice: {
    padding: '12px 16px 16px 16px',
    '& > div.MuiDialogTitle-root': {
      padding: 0,
      height: '36px',
      '& > h2': {
        fontSize: '24px',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '36px',
        letterSpacing: '0em',
        textAlign: 'left',

        '& button': {
          height: '36px',
          width: '36px',
          top: '12px',
          right: '16px',
          '&:hover': {
            backgroundColor: defaultColors.secondaryHover
          },
          '& svg': {
            fill: defaultColors.secondary
          }
        }
      },
    },
    '& > div.MuiDialogContent-root': {
      padding: 0,
      '& .subtitle': {
        margin: '4px 0 16px 0',
        width: '100%'
      },
      '& .table-grid > div > div > div > div > div': {
        maxHeight: 'calc(100vh - 250px)'
      },
      '& .table-grid table': {
        '& thead th': {
          fontSize: '12px'
        },
        '& tbody': {
          fontSize: '12px',
          '& td': {
            height: '48px',
            paddingTop: 0,
            paddingBottom: 0,
            '& > div': {
              color: 'inherit',
              '& > input': {
                fontSize: '12px',
              },
              '& > div > p': {
                fontSize: '12px',
              },
              '& > div > label': {
                display: 'none',
              }
            }
          }
        }
      }
    }
  },
  btnSaveCls: {
    float: 'right',
    paddingRight: '12px'
  }
});
export default useStyles;
