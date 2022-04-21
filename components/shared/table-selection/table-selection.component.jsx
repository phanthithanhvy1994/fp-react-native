import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import map from 'lodash/map';
import Item from './item.component';
import Pagination from '../pagination/pagination.component';
import { Message } from '../../../constants/messages';
import useStyles from '../../../style/core/table/table-selection';

class TableSelection extends React.Component {
  render() {
    const {
      classes,
      data,
      onChangePage,
      onChangeRowsPerPage,
      onClick,
      onChange,
      t,
      hasQuantityField,
      hasAddAction,
      onClickItemHandler,
      updateAddItemsSelectionsForDetailForm
    } = this.props;
    const { totalItems, currentPage, pageSize, pageOfItems } = data;
    return (
      <div className={`${classes.table} table-selection`}>
        <div className="table-list">
          {totalItems && totalItems !== 0 ? (
            <Grid container wrap="wrap" className={classes.root}>
              <Grid item xs={12}>
                <Grid container spacing={3} className={classes.container}>
                  {map(pageOfItems, (dataItem, i) => (
                    <Grid item key={i}>
                      <Item
                        dataItem={dataItem}
                        onClick={onClickItemHandler ? onClickItemHandler : onClick}
                        onChange={onChange}
                        hasQuantityField={hasQuantityField}
                        hasAddAction={hasAddAction}
                        updateAddItemsSelectionsForDetailForm={updateAddItemsSelectionsForDetailForm}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Typography className={classes.tableMessage}>
              {t(`${Message.common.comMSG002}`)}
            </Typography>
          )}
        </div>
        {totalItems && totalItems !== 0 ? (
          <Pagination
            count={totalItems}
            page={currentPage}
            rowsPerPage={pageSize}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

TableSelection.propTypes = {
  classes: PropTypes.any,
  data: PropTypes.any,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onClick: PropTypes.func,
  t: PropTypes.any,
  onChange: PropTypes.func,
  hasQuantityField: PropTypes.any,
  hasAddAction: PropTypes.any,
  onClickItemHandler: PropTypes.any,
  updateAddItemsSelectionsForDetailForm: PropTypes.func
};

export default withTranslation()(withStyles(useStyles)(TableSelection));
