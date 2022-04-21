import { makeStyles } from '@material-ui/core';
import { borderStyles, defaultColors } from '../../const/style-const';

const sidebarWidth = '57px';
const formPadding = '15px';
const fieldPadding = '24px';
const searchFormContentPadding = ' 16px';
const usedWidth = `calc(${sidebarWidth} + 2 * ${formPadding} + 2 * ${searchFormContentPadding})`;
const endActionWidthAndMargin = '41px';

const useStyles = makeStyles({
  fpbForm: {
    padding: '6px 16px',
    borderTop: '0px',
    boxShadow: borderStyles.boxShadow,
    borderRadius: '4px',
    marginBottom: 16,
    '& > div:nth-child(1)': {
      '& > div': {
        '& > div': {
          '& > p': {
            margin: '0px 0px',
          },
        },
      },
    },
    '& > div': {
      margin: '10px 0px',
    },

    '& div.field-wrapper': {
      '&.checkbox': {
        position: 'relative',
        transform: 'translateY(25%)',
      },
    },

    '& .MuiCheckbox-root': {
      color: defaultColors.secondary,
      '&:hover': {
        backgroundColor: defaultColors.secondaryHover,
      }
    },
  },
  btnColl: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  formAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  formActionCol: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  collapse: {
    display: 'flex',
    position: 'absolute',
  },
  btnClear: {
    border: `0.5px solid ${defaultColors.borderColor}`,
    height: '36px',
    width: '94px',
    '&:focus': {
      border: 'unset',
    },
    textTransform: 'none',
    marginRight: '16px',
  },
  btnSearch: {
    height: '36px',
    width: '94px',
    textTransform: 'none'
  },
  btnCollapse: {
    width: 36,
    padding: 0,
    minWidth: 'unset',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: defaultColors.secondaryHover
    },
    '&:focus': {
      backgroundColor: defaultColors.secondaryHover
    },
  },
  spanSearch: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: '36px',
    position: 'absolute',
  },
  searchForm: {
    '& div': {
      justifyContent: 'space-between',
    },

    '@media screen and (min-width: 240px) and (max-width: 768px)': {
      // Show 1 columns
      '& .field-wrapper': {
        width: `calc(100vw - ${usedWidth})`,
        '& .field-end-action': {
          width: `calc(calc(100vw - ${usedWidth})- ${endActionWidthAndMargin})`,
        },
      },

      '& [class*=Field-doubleTextWidth]': {
        width: `calc(100vw - ${usedWidth})`,
      },

      '& .field-none-content': {
        display: 'none',
      },

      '& .field-none-content:nth-of-type(n + 1)': {
        display: 'none',
      },
    },

    '@media screen and (min-width: 769px) and (max-width: 1279px)': {
      // Show 2 columns
      '& .field-wrapper': {
        width: `calc((100vw - (${usedWidth} + ${fieldPadding})) / 2)`,
        '& .field-end-action': {
          width: `calc(calc((100vw - (${usedWidth} + ${fieldPadding})) / 2) - ${endActionWidthAndMargin})`,
        },
      },

      '& [class*=Field-doubleTextWidth]': {
        width: `calc(2 * calc((100vw - (${usedWidth} + ${fieldPadding})) / 2) + 22px)`,
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
        (100vw - (${usedWidth} + (2 * ${fieldPadding}))) / 3
      )`,
        '& .field-end-action': {
          width: `calc(calc(
          (100vw - (${usedWidth} + (2 * ${fieldPadding}))) / 3
        ) - ${endActionWidthAndMargin})`,
        },
      },

      '& [class*=Field-doubleTextWidth]': {
        width: `calc(2 * calc(
        (100vw - (${usedWidth} + (2 * ${fieldPadding}))) / 3
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
        width: `calc(
        (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
      )`,
        '& .field-end-action': {
          width: `calc(calc(
          (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
        ) - ${endActionWidthAndMargin})`,
        },
      },

      '& [class*=Field-doubleTextWidth]': {
        width: `calc(2 * calc(
        (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 4
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
});

export default useStyles;
