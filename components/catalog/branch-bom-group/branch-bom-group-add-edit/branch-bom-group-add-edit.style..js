const useStyles = {
  searchCover: {
    marginTop: '114px',
    marginBottom: '5px',
    '& form > div:first-child': {
      marginTop: 0,
      '& div': {
        minWidth: '32.5%',
        '& > div:nth-child(1)': {
          width: '100%',
        },
        '& > div:nth-child(2)': {
          width: '100%',
        },
        '& > div:nth-child(3)': {
          width: '100%',
        },
      },
    },

    '& .field-wrapper': {
      '@media screen and (max-width: 1920px)': {
        width: '32%',
      },
      width: '32.5%',
      minWidth: 'unset',
      '& > div': {
        width: '100%',
      },
    },
  },
  detailCover: {
    marginTop: '114px',
    paddingBottom: '5px',
    '& form > fieldset:first-child': {
      '& > div': {
        '& > div': {
          display: 'flex',
          justifyContent: 'center !important',
          '& > div:nth-child(1)': {
            width: 'fit-content',
            marginRight: '50px'
          },
          '& > div:nth-child(2)': {
            width: 'fit-content',
            marginRight: '50px'
          },
          '& > div:nth-child(3)': {
            width: 'fit-content',
          }
        }
      },
    },
  },
};

export default useStyles;
