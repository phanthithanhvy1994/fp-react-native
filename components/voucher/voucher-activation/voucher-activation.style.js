const useStyles = {
  searchVOActivationCover: {
    marginTop: '114px',
    marginBottom: '16px',
    '& .form-fields': {
      '@media (min-width: 1366px)': {
        '& .field-wrapper': {
          width: 'calc((100vw - 150px) / 4)',
          '& .field-end-action': {
            width: 'calc(calc((100vw - 150px) / 4) - 41px)',
          },
        },
      },
    },
    '& .table-grid': {
      '& .MuiPaper-rounded > div[class*=Component-horizontalScrollContainer] div': {
        // limit about 5 records, if larger, scroll to see more information
        maxHeight: '450px'
      },
      '& button.Mui-disabled': {
        opacity: 0.3
      }
    },
    '@media screen and (min-width: 900px)': {
      '& .label-form': {
        '& > div': {
          display: 'grid',
          // Show 3 columns
          gridTemplateColumns: 'repeat(3, 1fr)',
          columnGap: '24px',
        },
      },
    },
  },
};

export default useStyles;
