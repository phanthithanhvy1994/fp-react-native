const useStyles = {
  scrapStock: {
    marginTop: 130,
    '& .field-wrapper.noteFld': { width: '100%' },
    '& .table-grid': {
      '& .MuiOutlinedInput-adornedStart': { paddingLeft: 0 },
      '& .MuiInputAdornment-positionStart': { marginRight: 0 },
      '& .quantity': { '& span': { display: 'flex', alignItems: 'center' } },
    },
  },
  itemTitle: {
    paddingLeft: 5,
  },
  detailForm: {
    marginTop: 130,
    '& .label': {
      '&  .MuiTypography-root': {
        fontSize: 12,
      },
    },
    '& .label-value': {
      '&  .MuiTypography-root': {
        fontSize: 13,
      },
    },
  },
};

export default useStyles;
