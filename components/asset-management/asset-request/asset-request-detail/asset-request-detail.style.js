
const useStyles = {
  searchCover: {
    marginTop: '114px',
    marginBottom: '5px',
  },
  assetRequestDetailsSearch: {
    '& .detail-general-info': {
      '& div.label': {
        width: '170px'
      },
    },
    '& div.total-row': {
      '@media screen and (max-width: 1919px)': {
        marginRight: '30px',
      },
      '@media screen and (min-width: 1920px)': {
        marginRight: '-25px',
      },
      
    },
    
    '& div.table-grid': {
      marginTop: 0,
      '& > div:first-child > div:last-child > div > div': {
        '@media screen and (max-width: 1919px)': {
          maxHeight: '235px',
        },
        '@media screen and (min-width: 1920px)': {
          maxHeight: '420px',
        },
      }
    }
  }
};
  
export default useStyles;