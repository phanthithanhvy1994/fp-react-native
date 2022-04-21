import {defaultColors} from '../../../style/const/style-const';

const useStyles = {
  searchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
  },
  saleOrderDetail: {
    '& .table-grid': {
      '& .MuiPaper-rounded > div:last-child > div': {
        maxHeight: 'calc(100vh - 410px)',
        // Width of Action column
        '& thead > tr > th:last-child,  tbody > tr > td:last-child': {
          width: '10% !important',
          '& > div': {
            minWidth: '172px',
          },
        },
        // Width of No column
        '& thead > tr > th:first-child,  tbody > tr > td:first-child': {
          width: '5% !important',
          '&:hover,:focus': {
            backgroundColor: 'unset'
          },
          '& > div': {
            maxWidth: '53px',
          },
        },
        '& .MuiTableBody-root td': {
          '& button': {
            width: '100%',
            borderRadius: 'unset',
            backgroundColor: 'unset',
            '& .MuiIconButton-label': {
              position: 'relative',
              height: '36px',
              '&:hover': {
                opacity: 0.8
              }
            },
            '& .MuiButton-root': {
              background: defaultColors.secondary,
              color: defaultColors.neutral,
              minWidth: '100%',
              textTransform: 'none',
              fontWeight: '400',
              fontSize: '13px',
              borderRadius: 'unset',
              '&:hover': {
                backgroundColor: defaultColors.secondaryFocused
              }
            },
            '& svg': {
              position: 'absolute',
              top: '10px',
              right: '16px',
              '& path': {
                fill: defaultColors.neutral
              }
            },
          }
        }
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
  }
};

export default useStyles;
