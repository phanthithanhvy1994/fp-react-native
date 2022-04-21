
const useStyles = {
  searchCover: {
    marginTop: '130px',
    paddingBottom: '5px',
  },
  goodIssuesDetailsSearch: {
    '& .table-grid': {
      '& .MuiPaper-rounded > div:last-child > div > div': {
        // Table grid always show in layout
        maxHeight: 'calc(100vh - 465px)',
      }
    }
  }
};
  
export default useStyles;