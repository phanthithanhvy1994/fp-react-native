import { makeStyles } from '@material-ui/core/styles';
import { defaultColors } from '../../../style/const/style-const';

const drawerWidth = 250;
const backgroundColorMenu = defaultColors.neutral;
const backgroundColorMenuHover = defaultColors.neutralHover;
const borderColorLeftMenu = defaultColors.secondary;
const borderColorBottomMenu = '#D6D6D6';

const sizeText = 13;
export const sizeIcon = '24';
export const useStyles = makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '10px',
      'background-color': defaultColors.iconColor,
    },
    '*::-webkit-scrollbar-track': {
      width: '10px',
      ' -webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      'background-color': defaultColors.iconColor,
    },
    '*::-webkit-scrollbar-thumb': {
      ' -webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      'background-color': 'rgba(27, 27, 27, 0.5)',
      'border-radius': '1px',
      opacity: 0.5,
      width: '10px'
    },
  },
  hoverSidebar: {
    marginLeft: -(drawerWidth - theme.spacing(7) - 1),
    '& .MuiDrawer-root': {
      transition: 'none',
    },
  },
  hoverToolbar: {
    marginLeft: drawerWidth - theme.spacing(7) - 1,
  },
  setTransitions: {
    '& .MuiDrawer-root': {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },

  menuItemsParent: {
    width: '100%',
    paddingTop: '0px ',
    paddingBottom: '0px ',
    paddingRight: '10px',
    height: '44px',
    paddingLeft: '17px',
    backgroundColor: backgroundColorMenu,
    ' &:hover': {
      backgroundColor: backgroundColorMenuHover,
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-primary, & MuiTypography-root, & span': {
      color: defaultColors.neutralContent,
      fill: defaultColors.iconColor,
    },
    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
    '& .MuiSvgIcon-root ': {
      color: defaultColors.neutralContent,
    },
  },
  menuItemsChildren: {
    width: '100%',
    paddingTop: '0px ',
    paddingBottom: '0px ',
    paddingRight: '10px',
    height: '44px',
    paddingLeft: '57px',
    color: defaultColors.neutralContent,
    ' &:hover': {
      ' & .MuiListItemText-primary': {
        color: defaultColors.neutralContent,
      },
      width: `calc(100% + ${13}px)`,
      backgroundColor: backgroundColorMenuHover,
      '~ a': {
        borderBottom: `1px solid ${backgroundColorMenuHover}`,
      },
    },

    '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiTypography-root, & span': {
      fill: defaultColors.neutral,
    },
    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
    ' & .MuiListItemText-primary': {
      maxWidth: '150px',
    },
  },

  parentActive: {
    backgroundColor: backgroundColorMenuHover,
    paddingLeft: 13,
    borderLeft: `4px solid ${borderColorLeftMenu}`,
    '& .MuiListItemIcon-root': {
      fill: defaultColors.primary,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 'bold',
    },
  },
  children: {
    backgroundColor: backgroundColorMenuHover,
    marginLeft: -13,
    width: `calc(100% + ${13}px)`,
    '& .MuiListItemText-root': {
      paddingLeft: 13,
    },
  },
  childrenActive: {
    backgroundColor: backgroundColorMenuHover,
    paddingLeft: 25,
    ' & .MuiTypography-root': {
      color: defaultColors.neutralContent,
      fontWeight: 'bold',
    },
    '&:before': {
      content: '""',
      marginRight: 24,
      backgroundColor: defaultColors.primary,
      width: 8,
      height: 8,
      borderRadius: '50%',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    minHeight: '64px',
    position: 'fixed',
    top: '-8px',
    zIndex: 999999,
    color: defaultColors.neutral,
    paddingLeft: '16px',
    '& .MuiSvgIcon-root ': {
      color: defaultColors.primary,
    },
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  drawerOpen: {
    width: drawerWidth,
  },
  drawerClose: {
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  titleMenu: {
    borderTop: `0.5px solid ${borderColorBottomMenu}`,
    backgroundColor: backgroundColorMenu,
    fontSize: '12px',
    lineHeight: '14px',
    textTransform: 'uppercase',
    color: borderColorBottomMenu,
    padding: '16px 8px 14px 8px',
    minHeight: 44,
    fontWeight: 400,
  },
  titleOpen: {
    borderTop: `1px solid ${borderColorBottomMenu}`,
    marginLeft: '-5px',
    backgroundColor: backgroundColorMenu,
    fontSize: '8px',
    lineHeight: '9px',
    textTransform: 'uppercase',
    color: defaultColors.ligtgray,
    padding: ' 16px 12px',
    textAlign: 'center',
    minHeight: 45,
  },

  sideBar: {
    '& .MuiListItem-button': {
      transition: 'none',
    },
    '& .MuiPaper-root': {
      backgroundColor: backgroundColorMenu,
      border: 'unset',
      color: defaultColors.neutral,
      zIndex: 1,
      boxShadow: '1px 0px 4px rgba(0, 0, 0, 0.25)',
    },
    '& .MuiListItemText-primary': {
      fontSize: sizeText,
    },
    '& .MuiList-padding': {
      paddingTop: '50px',
      paddingBottom: '0px',
    },
  },
}));
