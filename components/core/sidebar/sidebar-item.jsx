import React from 'react';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import IcomoonReact from 'icomoon-react';
import iconSet from '../../../assets/custom-font-icon/icomoon/selection.json';
import { useStyles, sizeIcon } from './sidebar.styles';

function SidebarMenuItem(props) {
  const classes = useStyles();
  const {
    t: translate,
    itemsData,
    openSidebar,
    item,
    handleDrawerOpen,
  } = props;
  const [isOpen, setOpen] = React.useState(false);

  const classItems = item.class;
  const isExpandable = item.children && item.children.length > 0;
  const isCategory = item.category && item.category.length > 0;
  const isIcon = item.icon && item.icon.length > 0;

  const handleClick = event => {
    if (isExpandable) {
      event.preventDefault();
    }
    handleDrawerOpen();
    setOpen(!isOpen);
  };

  const removeClass = items => {
    const removeClassAllItems = document.querySelectorAll('[id^=parent');
    removeClassAllItems.forEach(itemData => {
      itemData.classList.remove(`${items}`);
    });
  };

  const setClass = (items, option) => {
    /* Remove all class */
    removeClass(`${classes.parent}`);
    removeClass(`${classes.parentActive}`);
    removeClass(`${classes.childrenActive}`);
    /* Set class based on Parent ID */
    const AllItemChild = document.querySelectorAll(`[id^=${items.parentId}`);
    AllItemChild.forEach(itemChildren => {
      if (itemChildren.id.split('#')[0] === items.parentId) {
        itemChildren.classList.add(`${classes.parent}`);
      }
    });
    if (option === 'children') {
      /* Case Set Active Children Menu */
      const getParent = document.getElementById(items.parentId);
      const getChildren = document.getElementById(
        `${items.parentId}#${items.id}`
      );
      getParent.classList.add(`${classes.parentActive}`);
      getChildren.classList.add(`${classes.childrenActive}`);
    } else {
      /* Case Set Active Parent Menu */
      const getParent = document.getElementById(items.id);
      getParent.classList.add(`${classes.parentActive}`);
    }
  };

  React.useEffect(() => {
    /* Case Parent Menu */
    itemsData.forEach(items => {
      if (window.location.pathname === items.url) {
        setClass(items, 'parent');
      } else if (items.children) {
        /* Case Children Menu */
        items.children.forEach(itemChildren => {
          if (window.location.pathname.includes(itemChildren.url)) {
            setClass(itemChildren, 'children');
          }
        });
      } else if (window.location.pathname === '/') {
        removeClass(`${classes.parent}`);
        removeClass(`${classes.parentActive}`);
        removeClass(`${classes.childrenActive}`);
      }
    });
  });

  const MenuItemChildrenExtend = isExpandable ? (
    <Collapse
      in={isOpen}
      timeout="auto"
      className={!openSidebar && isOpen ? classes.hide : classes.marginSidebar}
    >
      <List component="div" disablePadding>
        {props.item.children.map((items, index) => (
          <SidebarMenuItem
            item={items}
            key={index}
            id={`${items.parentId}#${items.id}`}
            openSidebar={openSidebar}
            t={translate}
            itemsData={itemsData}
            handleDrawerOpen={handleDrawerOpen}
          />
        ))}
      </List>
    </Collapse>
  ) : null;

  const MenuItemRoot = (
    <div>
      {/* Display category items */}
      {isCategory ? (
        <Typography
          variant="h6"
          className={clsx(classes.titleMenu, {
            [classes.titleOpen]: !openSidebar,
          })}
        >
          {translate(`${props.item.category}`)}
        </Typography>
      ) : null}
      <ListItem
        id={props.id}
        button
        onClick={handleClick}
        component={Link}
        to={props.item.url}
        className={`${classes[classItems]} `}
      >
        {/* Display an icon if any */}
        {isIcon ? (
          <ListItemIcon>
            <IcomoonReact
              iconSet={iconSet}
              size={sizeIcon}
              icon={props.item.icon}
            />
          </ListItemIcon>
        ) : null}
        <ListItemText primary={translate(`${props.item.name}`)} />
        {/* Display the expand menu if the item has children */}
        {isExpandable && !isOpen && <KeyboardArrowRightIcon />}
        {isExpandable && isOpen && <KeyboardArrowDownIcon />}
      </ListItem>
      <div>{MenuItemChildrenExtend}</div>
    </div>
  );

  return (
    <>
      {/* Show Parent Menu */}
      {MenuItemRoot}
    </>
  );
}

SidebarMenuItem.propTypes = {
  t: PropTypes.any,
  itemsData: PropTypes.array,
  id: PropTypes.string,
  item: PropTypes.object,
  openSidebar: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
};

export default withTranslation()(SidebarMenuItem);
