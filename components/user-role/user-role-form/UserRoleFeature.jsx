import React, { useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import camelCase from 'lodash/camelCase';
import reduce from 'lodash/reduce';
import includes from 'lodash/includes';
import useStyles from '../../../style/core/user-role/user-role-feature';
import { deepCopy } from '../../../util/form-util';

export default function UserRoleFeature(props) {
  const {
    userRoleFeatures,
    handleCheckRoleFeature,
    operationIds,
    allFeatures,
  } = props;

  const classes = useStyles();
  const [ItemsCollapse, setItemsCollapse] = React.useState({});

  useEffect(() => {
    const collapses = reduce(
      userRoleFeatures,
      (result, operations, nameFeature) => ({
        [camelCase(nameFeature)]: true,
        ...result,
      }),
      {}
    );
    setItemsCollapse(collapses);
  }, [userRoleFeatures]);

  const collapseItem = item => {
    const ItemsCollapseCopy = deepCopy(ItemsCollapse);
    ItemsCollapseCopy[item] = !ItemsCollapseCopy[item];
    setItemsCollapse(ItemsCollapseCopy);
  };

  const hasOperationCheck = operationId => includes(operationIds, operationId);

  return (
    <div className={classes.root}>
      <List>
        <ListItem key="1" className={classes.allFeatures}>
          <Typography>All Features</Typography>
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              onChange={() => handleCheckRoleFeature(operationIds, 'check-all')}
              checked={operationIds.length === allFeatures.length}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Grid container>
        <Grid item xs={12}>
          {map(userRoleFeatures, (operations, nameFeature) => {
            const nameFeatureCamel = camelCase(nameFeature);

            return (
              <div key={nameFeature} className={classes.featureBlock}>
                <ListItem
                  className={classes.titleFeature}
                  button
                  onClick={() => collapseItem(nameFeatureCamel)}
                >
                  <ListItemText primary={nameFeature} />
                  {ItemsCollapse[nameFeatureCamel] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItem>
                <Collapse
                  in={ItemsCollapse[nameFeatureCamel]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List dense>
                    {map(operations, operation => {
                      const { operationId, description } = operation;
                      return (
                        <ListItem key={operationId} button>
                          <ListItemText primary={description} />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              onChange={() =>
                                handleCheckRoleFeature(operationId)
                              }
                              checked={hasOperationCheck(operationId)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}

UserRoleFeature.propTypes = {
  userRoleFeatures: PropTypes.object,
  handleCheckRoleFeature: PropTypes.func,
  operationIds: PropTypes.array,
  allFeatures: PropTypes.array,
};
