import { makeStyles } from '@material-ui/core/styles';
import { defaultColors } from '../../../../../style/const/style-const';

export const useStyles = makeStyles({
  detailDialog: {
    '& .MuiPaper-root': {
      minWidth: '85%',
      minHeight: '90%',
    },
    '& .pagination': {
      bottom: 0,
    },
    '& .MuiDialogContent-root': {
      overflow: 'initial',
    },
    '& .MuiDialogTitle-root': {
      padding: '0px !important',
    },
  },
  searchPopUp: {
    '& .MuiDialog-paper': {
      overflowY: 'hidden',
    },
    '& .MuiDialogContent-dividers': {
      padding: '4px 16px 16px 16px',
      border: 'unset',
    },
    '& .collapsed-search-area': {
      '@media screen and (min-width: 240px)': {
        '& .table-grid': {
          '& .MuiPaper-rounded > div:nth-child(2) div': {
            maxHeight: 'calc(100vh - 300px)',
          },
        },
      },
      '@media screen and (min-width: 1920px)': {
        '& .table-grid': {
          '& .MuiPaper-rounded > div:nth-child(2) div': {
            maxHeight: 'calc(100vh - 300px)',
          },
        },
      },
    },
    '@media screen and (min-width: 240px)': {
      '& .table-grid': {
        '& .MuiPaper-rounded > div:nth-child(2) div': {
          maxHeight: 'calc(100vh - 400px)',
        },
      },
    },
    '@media screen and (min-width: 1920px)': {
      '& .table-grid': {
        '& .MuiPaper-rounded > div:nth-child(2) div': {
          maxHeight: 'calc(100vh - 400px)',
        },
      },
    },
    '& .table-grid': {
      '& > div.MuiPaper-rounded': {
        height: '100vh',
      },
      '& .pagination': {
        bottom: '16px',
      },
    },
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '98%',
    marginLeft: '1%',
    '& span': {
      color: defaultColors.primary,
    },
  },
  closeButton: {
    top: '8px',
    color: '#9e9e9e',
    right: '8px',
    position: 'absolute',
  },
});
