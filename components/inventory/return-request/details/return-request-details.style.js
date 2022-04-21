const useStyles = {
  returnRequestAddEditSearchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
    '& form > div:first-child': {
      marginTop: 0,
    },
  },

  returnRequestDetailSearchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
    '& form > div:first-child': {
      marginTop: 0,
    },
    '& div.field-wrapper': {
      '& > div:first-child': {
        width: '100%',
      },
    },
    '& .attached-images-field': {
      '& > div': {
        display: 'flex',
        justifyContent: 'center',
      },
    },
  },
  returnRequestForm: {
    '& .full-width-column-field': {
      width: '100%',
    },
    '& .attached-images-field': {
      display: 'flex',
      justifyContent: 'center',
    },
  },
};

export default useStyles;
