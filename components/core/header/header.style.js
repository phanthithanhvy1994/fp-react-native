import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  root: {
    flexGrow: 1,
    '& header': {
      maxHeight: 50,
      backgroundColor: defaultColors.neutral,
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.25)',
    },
    '& .MuiToolbar-root': {
      paddingBottom: 16,
    },
    '& button': {
      height: 50,
      textTransform: 'unset',
      fontWeight: 'normal',
      color: defaultColors.neutralContent,
    },
  },
  title: {
    flexGrow: 1,
    marginLeft: 8,
    'background-image':
      '-webkit-gradient( linear, left top, right top, color-stop(0, #FD7902), color-stop(0.15, #6B6C99), color-stop(0.25, #0D9499))',
    color: 'transparent',
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: 'normal',
  },
  divTitle: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginLeft: 36,
  },
  iconLogo: {
    width: 36,
    height: 36,
  },
  userDropdown: {
    '& .MuiPaper-root': {
      width: 170,
      marginTop: 2,
      boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
      borderRadius: 0,
      'border-bottom-left-radius': 4,
      'border-bottom-right-radius': 4,
    },
    '& .MuiList-root': {
      padding: 0,
    },
    '& .MuiDivider-root': {
      backgroundColor: defaultColors.neutralHover,
      height: 1,
    },
    '& .MuiButtonBase-root': {
      fontSize: 16,
      paddingLeft: 12,
      color: defaultColors.neutralContent,
      minHeight: 50,
    },
    '& .MuiButtonBase-root:last-of-type': {
      color: `${defaultColors.secondary} `,
    },
  },

  userTitle: {
    minWidth: 120,
    '& span': {
      paddingLeft: 5,
    },
  },
  btnLogin: {
    color: defaultColors.primary,
    paddingRight: 26,
    'text-decoration-line': ' underline',
    '&:hover': {
      color: defaultColors.primary,
      fontWeight: 'bold',
    },
  },
};

export default useStyles;
