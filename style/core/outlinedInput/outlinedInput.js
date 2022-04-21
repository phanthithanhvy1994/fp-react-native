import { borderStyles, defaultColors } from '../../const/style-const';

const useStyles = () => ({
  // root: {
  //   '&:hover $notchedOutline': {
  //     borderColor: defaultColors.hover,
  //   },
  //   '&$focused $notchedOutline': {
  //     borderColor: defaultColors.secondaryFocused,
  //   },
  // },
  // focused: {},
  // notchedOutline: {},
  root: {
    '& .MuiInputBase-root': {
      height: 28,
      fontSize: 13,
      margin: 0,
      borderRadius: borderStyles.borderRadius,
      '& > .MuiAutocomplete-input': {
        height: 19,
        minWidth: 'calc(10% - 50px)',
        position: 'relative',
        padding: '5px 0px',
      },
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: 0,
    },
    '& .MuiAutocomplete-input': {
      position: 'absolute',
    },
    // Custom css for focus outlined and hover border
    '&:hover:not($disabled):not($focused):not($error) .MuiOutlinedInput-notchedOutline': {
      borderColor: defaultColors.hover,
    },
  },
  textInput: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    position: 'relative',
    maxWidth: '90%',
    marginLeft: 5,
    marginRight: 5,
  },
  optionBody: {
    padding: 0,
    fontSize: 13,
    '& .MuiIconButton-label': { color: defaultColors.secondary },
    '& > span:first-child': {
      maxWidth: '90%',
      marginLeft: 5,
      marginRight: 5,
      // color: defaultColors.secondary,
      // '&:hover': {
      //   backgroundColor: defaultColors.secondaryHover,
      // },

    },
  },
  // Custom css for focus outlined and hover border
  popper: {
    zIndex: 2000,
  },
  listbox: {
    '& > li': {
      padding: 0,
    },
  },
  error: {},
  notchedOutline: {},
  disabled: {},
  focused: {
    '&.Mui-focused:not($disabled):not($error) .MuiOutlinedInput-notchedOutline': {
      borderColor: defaultColors.secondaryFocused,
    },
  },
});

export default useStyles;
