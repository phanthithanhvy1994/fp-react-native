const useStyles = {
  pagination: {
    backgroundColor: '#dbeff0',
    padding: '0 16px 0 16px',
    width: '100%',
    display: 'block',
    borderRadius: 'unset',
    '& .pagination-group-item-table': {
      float: 'right',
    },
    '& .left-pagination': {
      alignItems: 'center',
      display: ' flex',
      minHeight: 44,
      '& span': {
        color: 'white',
        marginRight: 5,
      },
      '& .MuiFormControl-marginNormal': {
        width: 200,
      },
      '& .mr-20': {
        marginRight: 20,
      },
    },
    '& .right-pagination': {
      '& table': {
        float: 'right',
      },
      '& .MuiInputBase-input': {
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 2,
      },
      '& select': {
        height: 18,
        border: '0.5px solid #a0a0a0',
      },
      '& fieldset': {
        height: 'unset',
      },
    },
    '& .MuiSelect-select.MuiSelect-select': {
      backgroundColor: 'white',
    },
    '& .MuiTablePagination-toolbar': {
      minHeight: 44,
    },
    '& .MuiTablePagination-caption': {
      color: 'white',
      display: 'none',
    },
    '& .paging-info': {
      color: '#454545',
      width: 110,
      display: 'inline-block',
      fontWeight: 500,
      lineHeight: '22px',
      textAlign: 'center',
    },
    '& .MuiTablePagination-selectRoot': {
      marginRight: 0,
    },
    '& .MuiFormControl-marginNormal': {
      margin: 0,
    },
    '& .MuiTableCell-root': {
      borderBottom: 'none',
      float: 'right',
    },
    '& .fldSelectPaging': {
      width: 65,
      '& label': {
        display: 'none',
      },
    },
  },
};

export default useStyles;
