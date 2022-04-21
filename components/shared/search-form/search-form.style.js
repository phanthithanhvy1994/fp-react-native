const sidebarWidth = '57px';
const formPadding = '15px';
const fieldPadding = '24px';
const searchFormContentPadding = ' 16px';
const usedWidth = `calc(${sidebarWidth} + 2 * ${formPadding} + 2 * ${searchFormContentPadding})`;
const endActionWidthAndMargin = '41px';

const useStyles = {
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

      // Layout checkbox inline
      '& .field-half-width': {
        width: `calc( calc(
          (100vw - (${usedWidth} + (2 * ${fieldPadding}))) / 6) - 10px
        )`,
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
      // Layout checkbox inline
      '& .field-half-width': {
        width: `calc( calc(
          (100vw - (${usedWidth} + (3 * ${fieldPadding}))) / 8 ) - 10px
        )`,
      },
    },
  },
};

export default useStyles;
