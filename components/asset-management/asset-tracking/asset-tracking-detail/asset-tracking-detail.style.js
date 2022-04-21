const useStyles = {
  searchCover: {
    marginTop: '114px',
    marginBottom: '5px',
  },
  assetTrackingDetailsSearch: {
    '& .detail-general-info': {
      '& div.label': {
        width: '170px'
      },
      '& > div > div': {
        '@media screen and (min-width: 240px) and (max-width: 1279px)': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
        '@media screen and (min-width: 1280px)': {
          display: 'grid',
          // Show 2 columns
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: '24px',
        },
      }
    },
      
    // '& div.table-grid': {
    //   marginTop: 0,
    //   '& > div:first-child > div:last-child > div > div': {
    //     '@media screen and (max-width: 1919px)': {
    //       maxHeight: '235px',
    //     },
    //     '@media screen and (min-width: 1920px)': {
    //       maxHeight: '420px',
    //     },
    //   }
    // }
  }
};
    
export default useStyles;