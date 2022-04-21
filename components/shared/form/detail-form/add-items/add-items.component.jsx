import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import { ShoppingCart } from '@material-ui/icons/';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import SearchForm from '../../../search-form/search-form.component';
import { useStyles } from './add-items.style';
import { PaginationConfiguration } from '../../../../../constants/constants';
import TableSelection from '../../../table-selection/table-selection.component';
import store from '../../../../../redux/store';

function AddItems(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    fieldArray,
    getAddItemsParams,
    loadAddItemsData,
    convertItemDataStructure,
    informationConvert,
    classPopUp,
    hasQuantityField = true,
    updateAddItemsSelectionsForDetailForm,
    handleAddItemsToGrid,
    // addItemsSelections,
    onClickItemHandler,
    isMultipleAddItemsEntity,
    titleSelectPopup,
    getNumItemsInCart,
  } = props;

  const [searchParams, setSearchParams] = useState({});
  const [fieldSearch, setFieldSearch] = useState(fieldArray);
  const [fieldArrayInitial, setFieldArrayInitial] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numItemsInCart, setNumItemsInCart] = useState(null);
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  // itemsArray for search fields on search form
  const [itemsArray, setItemsArray] = useState({
    pageSize,
    currentPage,
  });

  const [entity, setEntity] = useState(null);
  const currentState = store.getState();
  const detailFormStore = currentState && currentState.detailFormStore;
  const addItemsSelections = detailFormStore.addItemsSelections;

  //Set initial field array to reset
  useEffect(() => {
    setFieldSearch(fieldArray);
    setFieldArrayInitial(JSON.parse(JSON.stringify(fieldArray)));
  }, [fieldArray]);

  /**
   * Load data into grid base on search condition
   * The `loadAddItemsData` will be define in specific detail page
   * to get material list or anything and show in this page.
   * For ex: loadAddItemsData func in purchase-order-form.component
   * @param {Object} params
   */
  const loadItemsData = (params = null) => {
    if (!loadAddItemsData) {
      return;
    }
    loadAddItemsData(params).then((res) => {
      if (isMultipleAddItemsEntity) {
        setEntity(res.entity);
      }
      setItemsArray({
        ...itemsArray,
        pageSize: (params && params.pageSize) || pageSize,
        currentPage: (params && params.currentPage) || currentPage,
        pageOfItems: convertItemDataStructure(res.data, informationConvert),
        // totalItems: res.data && res.data.length,
        totalItems: res.totalRecord,
        maxResult: pageSize,
      });
    });
  };

  /**
   * Get search params for add items page
   * The `getAddItemsParams` will be define in specific detail page
   * to handle the input param will be sent to the server
   */
  const getSearchParams = (searchFields) => ({
    currentPage,
    pageSize,
    maxResult: pageSize,
    deleteFlag: 0,
    countFlag: PaginationConfiguration.countFlag,
    ...getAddItemsParams(searchFields),
  });

  const onSearch = (searchFields) => {
    const inputParams = getSearchParams(searchFields);
    setSearchParams(inputParams);
    loadItemsData(inputParams);
  };

  /**
   * Close popup when click 'Add' btn, and perform
   * add item into item list in detail page
   * @param {Object} rowData
   */
  const onAddItemBtnClick = (rowData) => {
    const selections = onClickItemHandler(rowData);
    updateAddItemsSelectionsForDetailForm &&
      updateAddItemsSelectionsForDetailForm(selections);
    const selectionsInPopup =
      (isMultipleAddItemsEntity &&
        selections.filter((el) => el.entity === entity)) ||
      selections ||
      [];
    setNumItemsInCart(selectionsInPopup.length);
    getNumItemsInCart && getNumItemsInCart(selectionsInPopup.length);
  };

  useEffect(() => {
    loadItemsData({
      pageSize,
      currentPage,
      maxResult: pageSize,
      countFlag: PaginationConfiguration.countFlag,
    });
    setItemsArray({
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: 1,
    });
  }, []);

  useEffect(() => {
    let selections = addItemsSelections || [];
    if (isMultipleAddItemsEntity) {
      selections = selections.filter((el) => el.entity === entity);
    }
    setNumItemsInCart(selections.length);
    getNumItemsInCart && getNumItemsInCart(selections.length);
  }, [entity, addItemsSelections]);

  /**
   * Reload data on grid when changing page
   */
  const onChangePage = (e, page) => {
    const searchFieldsParam = {
      ...searchParams,
      currentPage: page,
      maxResult: pageSize,
      countFlag: PaginationConfiguration.countFlag,
    };
    setItemsArray({
      ...itemsArray,
      currentPage: page,
    });
    loadItemsData(searchFieldsParam);
  };

  const handleClearSearch = () => {
    setFieldSearch(JSON.parse(JSON.stringify(fieldArrayInitial)));
  };

  /**
   * Reload data on grid when changing rows per page
   * @param {Object} e
   */
  const onChangeRowsPerPage = (e) => {
    const size = e.target.value;
    const currPage = 1;
    const searchFieldsParam = {
      ...searchParams,
      pageSize: size,
      currentPage: currPage,
      maxResult: size,
      countFlag: PaginationConfiguration.countFlag,
    };
    setPageSize(size);
    setCurrentPage(currPage);
    setItemsArray({
      ...itemsArray,
      pageSize: size,
    });
    loadItemsData(searchFieldsParam);
  };

  return (
    <Dialog
      className={`${classes.detailDialog} ${classPopUp} ${classes.addItemsPopUp}`}
      open={open}
      onClose={handleClose}
      disableBackdropClick={true}
    >
      <div className={`${classes.titlePage} subtitle`}>
        <DialogTitle id="customized-dialog-title">
          {' '}
          {titleSelectPopup || 'Select Items'}{' '}
        </DialogTitle>
        <div onClick={handleAddItemsToGrid} className="actions">
          <ShoppingCart className="btnPrimary" />
          <div className="item-in-cart">{numItemsInCart}</div>
        </div>
        <div onClick={handleClose} className="close-icon">
          <CloseIcon />
        </div>
      </div>
      {open && (
        <DialogContent dividers>
          <SearchForm
            fieldArray={fieldSearch}
            onSearch={onSearch}
            classCustom="user-search-bar"
            isAddItemsForm={true}
            isPopup={true}
            onClearCustom={handleClearSearch}
          />
        </DialogContent>
      )}
      <TableSelection
        data={itemsArray}
        onChangePage={(e, page) => onChangePage(e, page)}
        onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
        hasQuantityField={hasQuantityField}
        hasAddAction={true}
        onClickItemHandler={onAddItemBtnClick}
        updateAddItemsSelectionsForDetailForm={
          updateAddItemsSelectionsForDetailForm
        }
      />
    </Dialog>
  );
}

AddItems.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  t: PropTypes.any,
  imgUrl: PropTypes.any,
  fieldArray: PropTypes.array,
  rowSize: PropTypes.number,
  handleClose: PropTypes.func,
  getAddItemsParams: PropTypes.func,
  loadAddItemsData: PropTypes.func,
  onClickItemHandler: PropTypes.func,
  convertItemDataStructure: PropTypes.func,
  informationConvert: PropTypes.array,
  classPopUp: PropTypes.any,
  isHideBtnCollapse: PropTypes.bool,
  hasQuantityField: PropTypes.bool,
  updateAddItemsSelectionsForDetailForm: PropTypes.func,
  addItemsSelections: PropTypes.array,
  handleAddItemsToGrid: PropTypes.func,
  isMultipleAddItemsEntity: PropTypes.bool,
  titleSelectPopup: PropTypes.any,
  getNumItemsInCart: PropTypes.func,
};

export default withTranslation()(AddItems);
