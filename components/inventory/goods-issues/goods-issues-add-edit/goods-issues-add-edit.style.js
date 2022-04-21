const useStyles = {
  goodsIssuesAddEditSearchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
    '& form > div:first-child': {
      marginTop: 0,
    },
  },

  goodsIssuesForm: {
    '& .full-width-column-field': {
      width: '100%',
    },
    '& table > tbody > tr': {
      '&:nth-child(odd) .qty-value div.Mui-disabled > input': {
        background: '#f9f9f9'
      },
      '&:nth-child(even) .qty-value div.Mui-disabled > input': {
        background: '#fff'
      },
      '& .qty-value': {
        '& > div > div': {
          '& > div input': {
            height: '28px',
            padding: 0,
          },
          // '& > span.disabled > button': {
          //   backgroundColor: '#D6D6D6'
          // }
        }
      } 
    }
  },
};

export default useStyles;