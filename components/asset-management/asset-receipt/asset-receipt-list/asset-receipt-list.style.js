const addItemsWidth = '85vw';
const formPadding = '24px';
const fieldPadding = '24px';
const SearchFormContentPadding = '16px';
const usedWidth = `calc( 2 * ${formPadding} + 2 * ${SearchFormContentPadding})`;

const useStyles = {
  searchCover: {
    marginTop: '114px',
    paddingBottom: '5px',
  },
  searchCoverPopup: {
    paddingBottom: '5px',
    '& form > div:first-child': {
      marginTop: 0,
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
};

export default useStyles;
