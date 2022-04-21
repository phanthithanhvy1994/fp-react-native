import { defaultColors } from '../../const/style-const';

const useStyles = {
  root: {
    flexGrow: 1,
  },
  tableMessage: {
    fontSize: 16,
    textAlign: 'center',
    '@media (max-width: 1366px)': {
      paddingTop: '20vh',
    },
    '@media (min-width: 1920px)': {
      paddingTop: '30vh',
    },
  },
  container: {
    display: 'grid',
    gridGap: '16px 32px',
    padding: '16px 0px 16px 0px',
    'grid-template-columns': 'repeat(auto-fit, minmax(120px, 0fr))',
    justifyContent: 'center',
    '& .MuiGrid-item': {
      padding: 0,
      width: 120,
      '& > .MuiCard-root': {
        maxWidth: '140px',
        overflowWrap: 'anywhere'
      }
    },
  },
  table: {
    '& .table-list': {
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 16,
      '& .MuiPaper-root': {
        margin: '0px -8px 0px -8px',
        padding: 8,
        borderRadius: 0,
        '& button[class*=Item-btnAction]': {
          borderRadius: 0,
        },
        ' &:hover': {
          backgroundColor: defaultColors.neutral,
          boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.08)',
          borderRadius: 4,
        },
      },
      '&  div[class*=Field-quantityField]': {
        '& button.MuiButtonBase-root': {
          width: 36,
          height: 36,
        },
      },

      '& .MuiCardContent-root .MuiTypography-root': {
        fontSize: 13,
      },
      '& .right-pagination': {
        width: '100%',
        maxWidth: '100%',
        flex: '0 0 100%',
      },
      '& .MuiCardActionArea': {
        ' &:focus': {
          outline: 'unset',
        },
      },
      '& .MuiCardActionArea-root': {
        '& .divImage': {
          border: `1px solid ${defaultColors.borderColor}`,
          borderRadius: 4,
          display: 'flex',
          verticalAlign: 'middle',
          width: 120,
          height: 120,
          '& img': {
            marginBottom: 0,
            objectFit: 'cover',
          },
        },
        '& .MuiCardContent-root': {
          marginTop: 8,
        },
      },
    },
    '& .pagination': {
      position: 'sticky',
      bottom: 28,
      marginBottom: 16,
    },
    '& .pagination .paging-info': {
      minWidth: 100,
      width: 'unset',
    },
  },
};

export default useStyles;
