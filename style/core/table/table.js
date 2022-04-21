import { defaultColors } from '../../const/style-const';

const stylesTableGrid = {
  tableNoneBorder: {
    headerStyle: {
      textAlign: 'center',
      padding: '0.7rem',
      fontSize: 12,
    },
    cellStyle: { textAlign: 'center', fontSize: 12 },
    addRowPosition: 'first',
  },
  tableBorder: {
    headerStyle: {
      border: '1px solid #C4C4C4',
      padding: '0.7rem',
      fontSize: 12,
    },
    cellStyle: { border: '1px solid #C4C4C4', fontSize: 12 },
    actionsCellStyle: {
      border: '1px solid #C4C4C4',
    },
    addRowPosition: 'first',
  },
};

const stylesItemGrid = {
  itemLeft: {
    maxWidth: 70,
  },
  image: {
    width: 70,
    marginRight: 10,
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: `1px solid ${defaultColors.borderColor}`,
  },
  itemRight: {
    marginLeft: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: '12px',
    lineHeight: '14.06px',
    textAlign: 'left',
  },
};

const stylesTable = {
  tableGrip: {
    fontSize: '12px',
    '& .MuiTable-root': {
      borderCollapse: 'unset',
      '& .MuiCheckbox-root': {
        color: defaultColors.secondary,
        '&:hover': {
          backgroundColor: defaultColors.secondaryHover,
        },
      },
    },
    '& .MuiToolbar-gutters': {
      padding: 0,
      minHeight: 50,
    },
    '& .MuiToolbar-regular .MuiIconButton-root': {
      padding: 0,
    },
    '& .MuiTableSortLabel-root': {
      color: defaultColors.primary,
    },
    '& .MuiTable-root thead tr th': {
      backgroundColor: defaultColors.neutral,
      color: defaultColors.primary,
      fontWeight: 'bold',
      border: 'unset !important',
    },
    '& .date-icon': {
      width: '95% !important',
    },
  },
  table: {
    '& .danger': {
      color: defaultColors.danger,
      marginBottom: 0
    },
    '& .MuiPaper-root tr.total-row': {
      background: defaultColors.rgbaPrimaryOpacity.replace('%OPACITY%', 0.15),
      color: defaultColors.secondary,
      fontWeight: 'bold',
      '& .total-summarize-label': {
        textAlign: 'right',
        display: 'block'
      }
    }
  },
  btnAddItem: {
    '& span': {
      lineHeight: '36px',
    },
    '&:hover': {
      background: '#f5f5f5',
      textDecorationLine: 'underline',
    },
    '&:focus': {
      background: '#f5f5f5',
      border: 'none',
      outline: 'none',
    },
    border: 'none',
    outline: 'none',
    fontFamily: 'Roboto',
    height: '22px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    textDecorationLine: 'underline',
    background: 'none',
    padding: '0 5px 0 5px',
    marginLeft: '5px',
    textTransform: 'unset',
    color: defaultColors.secondary,
  },
  errorText: {
    color: '#f44336',
  },
  summarizeArea: {
    minHeight: 36,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    background: defaultColors.rgbaPrimaryOpacity.replace('%OPACITY%', 0.15),
    borderRadius: '0px',
    color: defaultColors.secondary,
    fontSize: '12px',
    lineHeight: '14px',
    '& .total-row': {
      display: 'flex',
      float: 'right',
      width: '25%',
      height: '18px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: '14px',
      marginTop: '5px',
      '& .total-label': {
        width: '40%',
        minWidth: '150px',
      },
      '& .total-amount': {
        width: '60%',
      },
    },
  },
  moreButtonsArea: {
    position: 'absolute',
    height: '100px',
    right: '32px',
    zIndex: '1000',
    marginTop: '-25px',
    display: 'flex',
    '& > .MuiBox-root': {
      display: 'flex',
      top: '0px',
      margin: '0px',
      '& > div': {
        alignItems: 'center',
        justifyContent: 'center',
      }
    },
    '& span.disabled': {
      pointerEvents: 'none'
    },
    '& button': {
      color: defaultColors.secondary,
      '&.Mui-disabled': {
        color: defaultColors.secondary,
      },
      '&:hover': {
        backgroundColor: defaultColors.neutralHover
      },
      '&:focus': {
        backgroundColor: defaultColors.neutralHover
      },
    },
    '& .box-disabled': {
      opacity: 0.3,
      pointerEvents: 'none'
    }
  }
};

export { stylesItemGrid, stylesTableGrid, stylesTable };
