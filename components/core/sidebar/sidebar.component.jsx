import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import menuItems from './sidebarItemsData';
import SidebarMenuItems from './sidebar-item';
import { useStyles } from './sidebar.styles';
import { PageHeaderAction } from '../../../redux/page-header/page-header.types';

function SideBar() {
  const classes = useStyles();
  const [isOpen, setOpen] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const isHomePage = history.location.pathname === '/';
  const isErrorPage = history.location.pathname === '/error';
  const isNotFoundPage = history.location.pathname === '/404';
  const [isHide, setHide] = React.useState(
    isHomePage || isErrorPage || isNotFoundPage
  );

  const configTree = menuItems.map((item, index) => ({
    ...item,
    id: `parent-${index}`,
    children:
      item.children &&
      item.children.map((children, i) => ({
        ...children,
        id: `children-${i}`,
        parentId: `parent-${index}`,
      })),
  }));

  const handleDrawerOpen = () => {
    const substractionValue = 86;
    dispatch({
      type: PageHeaderAction.SET_SUBSTRACTION_VALUE,
      payload: substractionValue,
    });

    setOpen(!isOpen);
    if (isErrorPage || isHomePage || isNotFoundPage) {
      setHide(!isHide && isOpen);
    }
  };

  const handleHover = () => {
    setOpen(!isOpen);
    if (isErrorPage || isHomePage || isNotFoundPage) {
      setHide(!isHide && isOpen);
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      setOpen(!isOpen);
    }
  };

  return (
    <div
      className={clsx(classes.sideBar, {
        [classes.hoverSidebar]: isOpen,
      })}
    >
      <CssBaseline />
      <Toolbar
        className={clsx(classes.menuButton, {
          [classes.hoverToolbar]: isOpen,
        })}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <div className="clearfix " />
      {!isHide ? (
        <Drawer
          onMouseLeave={isOpen ? handleHover : null}
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isOpen,
            [classes.drawerClose]: !isOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: isOpen,
              [classes.drawerClose]: !isOpen,
            }),
          }}
        >
          <List>
            {configTree.map((item, index) => (
              <SidebarMenuItems
                item={item}
                key={index}
                openSidebar={isOpen}
                id={item.id}
                itemsData={configTree}
                handleDrawerOpen={handleOpen}
              />
            ))}
          </List>
        </Drawer>
      ) : (
        ''
      )}
    </div>
  );
}

export default SideBar;
