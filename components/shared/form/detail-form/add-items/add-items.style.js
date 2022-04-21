import { makeStyles } from '@material-ui/core/styles';
import { defaultColors } from '../../../../../style/const/style-const';

const addItemsWidth = '85vw';
const formPadding = '24px';
const fieldPadding = '24px';
const SearchFormContentPadding = '16px';
const usedWidth = `calc( 2 * ${formPadding} + 2 * ${SearchFormContentPadding})`;

export const useStyles = makeStyles({
  detailDialog: {
    '& .MuiPaper-root.MuiDialog-paperWidthSm': {
      minWidth: '85%',
      maxHeight: '85%',
      padding: '0px 16px 0px 16px',
      '& .pagination': {
        bottom: 0,
      },
      '& .table-list': {
        paddingBottom: 16,
      },
      '& .MuiGrid-item': {
        display: 'inline-table',
      },
    },
    '& .MuiDialogContent-root': {
      overflow: 'initial',
      flex: 'unset',
      border: 'unset',
      padding: 'unset',
    },
    '& .MuiDialogTitle-root': {
      padding: 'unset',
    },
    '& .add-items-form': {
      '& div': {
        justifyContent: 'space-between',
      },

      '@media screen and (min-width: 240px) and (max-width: 768px)': {
        // Show 1 columns
        '& .field-wrapper': {
          width: `calc(${addItemsWidth} - ${usedWidth})`,
        },
        '& [class*=Field-doubleTextWidth]': {
          width: `calc(${addItemsWidth} - ${usedWidth})`,
        },
        '& .field-none-content': {
          display: 'none',
        },
        '&  .field-none-content:nth-of-type(n + 1)': {
          display: 'none',
        },
      },

      '@media screen and (min-width: 769px) and (max-width: 1279px)': {
        // Show 2 columns
        '& .field-wrapper': {
          width: `calc(
              (${addItemsWidth} - (${usedWidth} + ${fieldPadding})) / 2
            )`,
        },

        '& [class*=Field-doubleTextWidth]': {
          width: `calc(2 * calc(
              (${addItemsWidth} - (${usedWidth} + ${fieldPadding})) / 2
            ) + 22px)`,
        },
        '& .field-none-content': {
          display: 'block',
        },
        '& .field-none-content:nth-of-type(2n + 1)': {
          display: 'none',
        },
      },

      '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
        // Show 3 columns
        '& .field-wrapper': {
          width: `calc(
              (${addItemsWidth} - (${usedWidth} + (2 * ${fieldPadding}))) /
                3
            )`,
        },
        '& [class*=Field-doubleTextWidth]': {
          width: `calc(2 *  calc(
              (${addItemsWidth} - (${usedWidth} + (2 * ${fieldPadding}))) /
                3
            ) + 22px)`,
        },
        '& .field-none-content': {
          display: 'block',
        },
        '& .field-none-content:nth-of-type(3n + 1)': {
          display: 'none',
        },
      },
      '@media screen and (min-width: 1920px)': {
        // Show 4 columns
        '& .field-wrapper': {
          width: ` calc(
              (${addItemsWidth} - (${usedWidth} + (3 * ${fieldPadding}))) /
                4
            )`,
        },
        '& [class*=Field-doubleTextWidth]': {
          width: `calc(2 *  calc(
              (${addItemsWidth} - (${usedWidth} + (3 * ${fieldPadding}))) /
                4
            ) + 22px)`,
        },
        '& .field-none-content': {
          display: 'block',
        },
        '& .field-none-content:nth-of-type(4n + 1)': {
          display: 'none',
        },
      },
    },
  },
  titlePage: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    marginTop: '12px',
    paddingBottom: '4px',
    '& > .MuiDialogTitle-root': {
      '& > h2': {
        fontSize: '24px',
        fontWeight: '400',
        lineHeight: '34px',
      }
    },
    '& .actions': {
      color: defaultColors.primary,
      position: 'relative',
      right: '46px',
      justifyContent: 'space-between',
      cursor: 'pointer',
    },
    '& .close-icon': {
      color: defaultColors.secondary,
      position: 'absolute',
      textAlign: 'center',
      top: 0,
      right: 0,
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      '&:hover': {
        borderRadius: '50%',
        background: 'rgba(253, 121, 3, 0.08)',
      },
    },
  },
  addItemsPopUp: {
    '& .Muidialog-paper': {
      overflowY: 'none',
    },
    '& .table-selection': {
      display: 'contents',
    },
    '& .item-in-cart': {
      width: 16,
      height: 16,
      fontSize: '10px',
      backgroundColor: defaultColors.secondary,
      color: defaultColors.neutral,
      borderRadius: '50%',
      textAlign: 'center',
      position: 'absolute',
      top: 0,
      left: '15px',
      paddingTop: '2px',
    },
    '& .none-item-in-cart': {
      display: 'none',
    },
  },
});
