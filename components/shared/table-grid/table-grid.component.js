/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialTable, {
  MTableAction,
  MTableToolbar,
  MTableBodyRow,
  MTableHeader,
} from 'material-table';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import View from '@material-ui/icons/Visibility';
import Pagination from '../pagination/pagination.component';
import { tableIcons } from './table-grid.config';
import { Message } from '../../../constants/messages';
import { stylesTableGrid, stylesTable } from '../../../style/core/table/table';
import Button from '../buttons/button.component';
import {
  Action,
  NumberConstant,
  EntityConstant,
} from '../../../constants/constants';
import { formatNumber } from '../../../util/format-util';
import '../../../style/core/table/table-grid.scss';
import Box from '@material-ui/core/Box';
import ExportDataComponent from '../export-data/export-data.component';
import ImportDataComponent from '../import-data/import-data.component';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

function MCustomRow(props) {
  const { data } = props;
  const propsClone = { ...props };
  let className =
    data.entity === EntityConstant.purchaseOrder && data.mrp ? 'mrp' : '';

  className += data.isTotalSummarize ? ' total-row' : '';

  // Set attribute hidden or disabled of action
  propsClone.actions = propsClone.actions.map((action) => {
    if (typeof action === 'function') {
      return action;
    }
    return {
      ...action,
      disabled: action.disabled || action.disabledFunc?.(propsClone.data),
      hidden: action.hidden || action.hiddenFunc?.(propsClone.data),
    };
  });

  return <MTableBodyRow {...propsClone} className={className} />;
}

function MCustomToolbar(props) {
  // If only config for action in position 'toolbar', when select row,
  // the actions will be dissappear, so need to add it to position 'toolbarOnSelect' too
  let actionsTool = props.actions.map((el) => !el.isActionRow && ({
    ...el,
    position: 'toolbarOnSelect',
  }));
  actionsTool = [...props.actions, ...actionsTool];
  return (
    <MTableToolbar
      {...props}
      showTextRowsSelected={false}
      actions={actionsTool}
    />
  );
}

// Write this way the real DOM wont be rerender any have changes
function MCustomAction(props) {
  const {
    classes,
    addHandler,
    isEditing,
    loadItemHandler,
    handleActionTable,
    customToolbarContent,
    onRemoveHandler,
    setFormErrorFn,
    getIsDisableSubmitButton
  } = MCustomAction.prototype.actionsInfo;

  if (props.action && props.action.isAddItemsPopup && !props.action.hidden && !customToolbarContent) {
    return (
      <Button
        className="btnPrimary"
        classCustom={classes.btnAddItem}
        title={props.action.tooltip || 'Add Items'}
        icon={<AddIcon />}
        handleClick={(e) => {
          if (props.action.customHandler) {
            props.action.customHandler();
          }
          addHandler(props, e);
        }}
      />
    );
  }

  if (
    props.action &&
    props.action.tooltip === 'Remove' &&
    !props.action.hidden &&
    !customToolbarContent
  ) {
    return (
      <Button
        className="btnPrimary"
        classCustom={classes.btnAddItem}
        title="Remove Item"
        icon={<RemoveCircleOutlineIcon />}
        handleClick={() => onRemoveHandler(isEditing)}
      />
    );
  }

  if (props.action && props.action.isFreeAction && !props.action.hidden) {
    return (
      <Button
        className="btnPrimary"
        classCustom={classes.btnAddItem}
        title={props.action.tooltip}
        icon={props.action.icon}
        handleClick={(e) => {
          if (!isEditing) {
            switch (props.action.tooltip) {
              case Action.load:
                let isStopLoading = false;
                if (props.action.beforeLoadItemHandler) {
                  isStopLoading = props.action.beforeLoadItemHandler();
                }
                !isStopLoading && loadItemHandler();
                break;
              default:
                if (props.action.customHandler) {
                  props.action.customHandler();
                }
                break;
            }
          }
        }}
      />
    );
  }
  const element =
    (typeof props.action === 'function' && props.action(props.data)) ||
    (typeof props.action.action === 'function' &&
      props.action.action(props.data));
  if (
    includes(['Edit', 'Delete', 'View'], element.tooltip) ||
    element.isCustomGridAction
  ) {
    return (
      <IconButton
        size={props.size}
        color="inherit"
        disabled={element.disabled}
        hidden={element.hidden}
        onClick={(event) => {
          if (element.tooltip === 'Edit') {
            getIsDisableSubmitButton && getIsDisableSubmitButton(true);
          }

          if (handleActionTable) {
            handleActionTable(element.tooltip === 'Edit' ? 'update' : 'delete');
          }

          if (!isEditing) {
            event.target.setError = setFormErrorFn;
            element.onClick(event, props.data);
          }
        }}
      >
        {(element.isCustomGridAction && element.icon) ||
          (element.tooltip === 'Edit' ? <Edit /> : (element.tooltip === 'View' ? <View /> : <Delete />))}
      </IconButton>
    );
  }

  return <MTableAction {...props} />;
}

function MCustomTableHeader(props) {
  const onCustomOrderChange = (orderById, orderByDirection) => {
    // Keep current sorting
    const columns = props.columns;
    const previousDefaultSort = columns.findIndex((el) => !!el.defaultSort);
    if (
      previousDefaultSort !== -1 &&
      columns[previousDefaultSort].defaultSort
    ) {
      delete columns[previousDefaultSort].defaultSort;
    }
    if (orderByDirection) {
      columns[orderById].defaultSort = orderByDirection;
    }

    props.onOrderChange(orderById, orderByDirection);
  };
  return <MTableHeader {...props} onOrderChange={onCustomOrderChange} />;
}

class TableGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      no: 0,
    };
  }

  checkDataRowChange = (oldData, newData) => {
    let dataChanged = {};

    if (isEmpty(oldData)) {
      // Add Mode
      dataChanged = newData;
    } else {
      // Edit Mode
      dataChanged = omitBy(newData, (value, key) => oldData[key] === value);

      delete dataChanged.tableData;
    }
    return !isEmpty(dataChanged);
  };

  validateField = (fieldProps) =>
    !(
      fieldProps.columnDef.required &&
      fieldProps.rowData.submitted &&
      !fieldProps.value &&
      fieldProps.value !== 0
    );

  onRemoveHandler = (isEditing) => {
    const { removeHandler } = this.props;
    // SHould check specific true value since isEditing can be an object(event), in that case isEditing should be false
    removeHandler(this.state.selectedRows, (isEditing === true));
    this.setState({
      selectedRows: [],
    });
  };

  getTotalSummarizeData = () => {
    let totalSummarizeData = [];
    const { dataDetailsOnGrid, totalSummarizeInGrid } = this.props;
    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length > 0
    ) {
      totalSummarizeInGrid &&
        totalSummarizeInGrid.forEach((el) => {
          if (!el.isOnlyShowLabelTotal) {
            const name = el.fieldName;
            totalSummarizeData[name] = 0;
            dataDetailsOnGrid.data.forEach((item) => {
              totalSummarizeData[name] += item[name] ? Number(item[name]) : 0;
            });
          }
        });
    }

    return totalSummarizeData;
  };

  getTotalSummarizeRowData = (configSummarize, summarizeData) => {
    let returnSummarize = {
      isHideAllActions: true,
      isTotalSummarize: true
    };
    configSummarize.forEach((el) => {
      returnSummarize[el.fieldName] = el.isOnlyShowLabelTotal ? el.label : summarizeData[el.fieldName];
    });
    return returnSummarize;
  };

  render() {
    const {
      dataTable,
      options,
      className,
      onChangeRowsPerPage,
      onChangePage,
      hidePagination,
      classCustom,
      classes,
      handleActionTable,
      isEditing,
      isEditable,
      isEditableHidden,
      typeMessage,
      addHandler,
      loadItemHandler,
      totalSummarizeInGrid,
      handleRowChange,
      handleRowClick,
      handleRowSelect,
      updateDataDetailsOnGrid,
      dataDetailsOnGrid,
      defaultStyle,
      setFormErrorFn,
      forceUseDataTable,
      showTotalByColumn,
      // Using add, remove item in same box with import export. Not using add/remove items in toolbar
      // it'll cause the error happens
      hasImportExport,
      importHeaders,
      handleImportData,
      importRef,
      filterExportData,
      exportConfigs,
      onClickImportData,
      typeExport,
      getIsDisableSubmitButton,
      rowsPerPageOptionsCustom,
      customToolbarContent,
      ...otherProps
    } = this.props;

    let dataDetails = dataTable;
    if (
      (!dataTable || !dataTable.data) &&
      dataDetailsOnGrid &&
      !forceUseDataTable
    ) {
      dataDetails = dataDetailsOnGrid;
    }
    const { onRemoveHandler } = this;
    const customStyle = defaultStyle ? 'tableBorder' : classCustom;
    const { totalItems, currentPage, pageSize, data } = dataDetails || {};
    const optionsCombine = { ...options, ...stylesTableGrid[customStyle] };
    const messNoRecord = Message[typeMessage] || Message.NO_RECORD_LIST_TABLE;
    let totalSummarizeData = [];

    if (updateDataDetailsOnGrid) {
      updateDataDetailsOnGrid(dataDetails);
    }

    if (dataDetailsOnGrid) {
      totalSummarizeData = this.getTotalSummarizeData();
      dataDetailsOnGrid.data &&
        dataDetailsOnGrid.data.sort(
          (prev, cur) => prev.lineNumber - cur.lineNumber
        );

      // Show total summarize in associated column in grid
      if (showTotalByColumn) {
        const summarizeIndex = dataDetailsOnGrid.data.findIndex(el => el.isTotalSummarize);
        const summarizeRowData = this.getTotalSummarizeRowData(totalSummarizeInGrid, totalSummarizeData);
        if (dataDetailsOnGrid.data[summarizeIndex]) {
          dataDetailsOnGrid.data[summarizeIndex] = summarizeRowData;
        } else {
          dataDetailsOnGrid.data.push(summarizeRowData);
        }
      }
    }
    MCustomAction.prototype.actionsInfo = {
      classes,
      addHandler,
      isEditing,
      loadItemHandler,
      handleActionTable,
      onRemoveHandler,
      setFormErrorFn,
      customToolbarContent,
      getIsDisableSubmitButton
    };

    return (
      <div className={`${classes.table} table-grid`}>
        {customToolbarContent && <div className={classes.moreButtonsArea}>
          {customToolbarContent.map((children, index) => {
            switch (children.type) {
              case 'import':
                return (<Box className={`${classes.priceListToolBar} ${children.disabled ? 'box-disabled' : ''}`} m={4} key={index}>
                  <div  hidden={!!children.hidden}><ImportDataComponent
                    headers={children.importHeaders}
                    updateImportData={children.handleImportData}
                    ref={children.importRef}
                    disabled={!!children.disabled}
                    msgNotValidFile={children.msgNotValidFile}
                  /></div>
      
                  <span onClick={children.onClickImportData}>
                    <Button
                      classCustom={classes.btnSecondaryTextOnly}
                      title={children.title || 'Import file'}
                      icon={<SaveAltIcon />}
                      disabled={!!children.disabled}
                      hidden={!!children.hidden}
                    />
                  </span>
                </Box>);
              case 'export':
                return (<Box className={`${classes.priceListToolBar} ${children.disabled ? 'box-disabled' : ''}`} m={4} key={index}  hidden={!!children.hidden}>
                    <ExportDataComponent
                      classCustom={classes.btnSecondaryTextOnly}
                      data={children.filterExportData((dataDetailsOnGrid && dataDetailsOnGrid.data) || [])}
                      typeExport={children.typeExport}
                      {...children.exportConfigs}
                      disabled={!!children.disabled}
                      hidden={!!children.hidden}
                    />
                  </Box>
                );
              default:
                let onCustomClick = children.type === 'add-item' ? addHandler : (
                  children.type === 'remove-item' ? onRemoveHandler : children.handler
                );
                if (children.type === 'load-item') {
                  onCustomClick = loadItemHandler;
                }
                return (<span onClick={onCustomClick} key={index} className={`${children.disabled ? 'disabled' : ''}`}>
                  <Button
                    classCustom={classes.btnSecondaryTextOnly}
                    title={children.title}
                    icon={children.icon}
                    disabled={!!children.disabled}
                    hidden={!!children.hidden}
                  />
                </span>);
            }
          })}
          </div>
        }
        <MaterialTable
          stickyHeader={true}
          icons={tableIcons}
          data={data}
          options={optionsCombine}
          columns={this.props.columns}
          onRowClick={handleRowClick}
          components={{
            Row: MCustomRow,
            Toolbar: MCustomToolbar,
            Action: MCustomAction,
            Header: MCustomTableHeader,
          }}
          localization={{
            body: {
              emptyDataSourceMessage: messNoRecord,
            },
          }}
          {...otherProps}
          editable={
            isEditable
              ? {
                  isEditHidden: isEditableHidden,
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      const dataUpdate = [...data];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      // setData([...dataUpdate]);
                      this.props.handleRowChange(dataUpdate);
                      this.props.getIsDisableSubmitButton(false);
                      resolve();
                    }),
                  onRowUpdateCancelled: () =>
                    this.props.getIsDisableSubmitButton(false),
                }
              : {}
          }
          onSelectionChange={(selectedRows) => {
            this.setState(
              {
                selectedRows,
              },
              () => {
                handleRowSelect && handleRowSelect(selectedRows);
              }
            );
          }}
        />
        {/* Render summarize total area if it has this config.
        Can set multiple total row(ex: for total tax amount, total quantity, total price,...)
        by set it in 'totalSummarizeInGrid', and the value of these total
        will be define in 'totalSummarizeData'
        */}
        {!showTotalByColumn && <div className={totalSummarizeInGrid && classes.summarizeArea}>
          {totalSummarizeInGrid &&
            totalSummarizeInGrid.length > 0 &&
            totalSummarizeInGrid.map((el, index) => (
              <div key={index} className="total-row">
                <span className="total-label">{el.label}</span>
                <span className="total-amount">
                  {formatNumber(
                    totalSummarizeData[el.fieldName] || 0,
                    NumberConstant.normalDecimalCharacter
                  )} {el.currency || ''}
                </span>
              </div>
            ))}
        </div>}
        {!hidePagination && !isEmpty(dataTable || dataDetailsOnGrid) && (
          <Pagination
            count={totalItems || 0}
            page={currentPage}
            rowsPerPage={pageSize}
            onChangePage={(e, page) => onChangePage(e, page)}
            onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
            rowsPerPageOptionsCustom={rowsPerPageOptionsCustom}
          />
        )}
      </div>
    );
  }
}

TableGrid.propTypes = {
  dataTable: PropTypes.object,
  dataDetailsOnGrid: PropTypes.any,
  options: PropTypes.object,
  className: PropTypes.string,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  handleActionTable: PropTypes.func,
  classes: PropTypes.any,
  hidePagination: PropTypes.bool,
  isEditing: PropTypes.bool,
  isEditable: PropTypes.bool,
  isEditableHidden: PropTypes.func,
  classCustom: PropTypes.any,
  typeMessage: PropTypes.string,
  columns: PropTypes.any,
  removeHandler: PropTypes.any,
  addHandler: PropTypes.any,
  totalSummarizeData: PropTypes.any,
  totalSummarizeInGrid: PropTypes.any,
  actions: PropTypes.any,
  addNewItem: PropTypes.any,
  handleRowChange: PropTypes.func,
  loadItemHandler: PropTypes.any,
  handleRowClick: PropTypes.func,
  handleRowSelect: PropTypes.func,
  updateDataDetailsOnGrid: PropTypes.func,
  defaultStyle: PropTypes.bool,
  setFormErrorFn: PropTypes.func,
  forceUseDataTable: PropTypes.bool,
  getIsDisableSubmitButton: PropTypes.func,
  customToolbarContent: PropTypes.any,
  hasImportExport: PropTypes.bool,
  importHeaders: PropTypes.array,
  handleImportData: PropTypes.func,
  importRef: PropTypes.object,
  filterExportData: PropTypes.any,
  exportConfigs: PropTypes.any,
  onClickImportData: PropTypes.func,
  typeExport: PropTypes.bool,
  rowsPerPageOptionsCustom: PropTypes.array,
  showTotalByColumn: PropTypes.bool
};

MCustomRow.propTypes = {
  data: PropTypes.object,
};

MCustomToolbar.propTypes = {
  actions: PropTypes.any,
};

MCustomAction.propTypes = {
  action: PropTypes.any,
  size: PropTypes.any,
  disabled: PropTypes.bool,
  data: PropTypes.any,
  getIsDisableSubmitButton: PropTypes.func,
  customToolbarContent: PropTypes.any
};

MCustomTableHeader.propTypes = {
  onOrderChange: PropTypes.func,
  columns: PropTypes.array,
};

const mapStateToProps = (state) => ({
  dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
});

export default connect(mapStateToProps)(withStyles(stylesTable)(TableGrid));
