const useStyles = {
  branchBomFrom: {
    '& .branchBOM-link': {
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: 12,
      lineHeight: '14.06px',
    },
    '& div.field-wrapper.textAlign-center': {
      margin: '0 auto ',
      transform: 'translateY(0) ',
    },

    '& .selectRight': {
      '& div[class*=Field-fldText]': {
        marginTop: 0,
        padding: ' 0 10px 0 0 ',
        width: '100%',
      },
      '& div[class*=Field-fldSelect]': {
        marginTop: 19,
      },
    },
    '& .number-field-without-spin': {
      '& input[type="number"]::-webkit-clear-button': {
        display: 'none',
      },
      '& input[type="number"]::-webkit-inner-spin-button': {
        display: 'none',
      },
      '& input[type="number"]::-webkit-outside-spin-button': {
        display: 'none',
      },
    },
    '& .grid-large-content': {
      '& .table-grid': {
        '& .MuiPaper-rounded  > div[class*=Component-horizontalScrollContainer] div ': {
          // limit about 5 records, if larger, scroll to see more information
          maxHeight: 400,
        },
      },
    },
  },
  searchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
  },
};

export default useStyles;
