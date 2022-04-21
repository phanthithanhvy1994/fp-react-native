import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import useStyles from '../../branch-bom-price-list.style';

import FPDialog from '../../../../shared/dialog/dialog.component';
import TableGrid from '../../../../shared/table-grid/table-grid.component';
import Button from '../../../../shared/buttons/button.component';

import {
  priceEditColumns,
  priceEditOptions,
  valueTaxCodes,
  priceDetailColumns
} from './price-edit.config';
import {
  ButtonConstant,
  PaginationConfiguration,
  BranchBOMPrice,
} from '../../../../../constants/constants';
import { Message } from '../../../../../constants/messages';

import {
  getItemDetail,
  getDataTaxCode,
} from '../../../../../actions/branch-bom-action';
import { showError, calculateExVat } from '../../branch-bom-price.util';
import { withTranslation } from 'react-i18next';
import { formatComboBox } from '../../../../../util/format-util';

const PriceEdit = (props) => {
  const {
    t,
    classes,
    isEditPage,
    grandParentOpenStatus,
    parentBranchBOM,
    getDialogStatusGrandParent,
    getUpdatedPriceItem
  } = props;

  const [parentOpenStatus, setParentOpenStatus] = useState(
    grandParentOpenStatus
  );
  const [parentClosedStatus, setParentClosedStatus] = useState(true);

  const [branchBOM, setBranchBOM] = useState(parentBranchBOM);
  const [taxCode, setTaxCode] = useState();

  const [currentPage] = useState(PaginationConfiguration.currentPage);
  const [pageSize] = useState(PaginationConfiguration.itemsPerPage);
  const [priceEditDetail, setPriceEditDetail] = useState({
    data: [],
    totalItems: 1,
    currentPage: 1,
    pageSize: 25,
  });

  useEffect(() => {
    getDataTaxCode().then((res) => {
      setTaxCode(formatComboBox(res.data));
    });
  }, []);

  useEffect(() => {
    setParentOpenStatus(grandParentOpenStatus);
    setParentClosedStatus(true);
  }, [grandParentOpenStatus]);

  useEffect(() => {
    setBranchBOM(parentBranchBOM);
    branchBOM &&
      setPriceEditDetail((prevState) => ({
        ...prevState,
        data: [parentBranchBOM],
        totalItems: 1,
      }));
  }, [parentBranchBOM, branchBOM]);

  useEffect(() => {
    if (branchBOM?.childBomPriceDetailVO?.length > 0) {
      setPriceEditDetail({
        data: [branchBOM, ...branchBOM.childBomPriceDetailVO],
        totalItems: branchBOM.childBomPriceDetailVO.length,
        currentPage,
        pageSize,
      });
    } else {
      branchBOM?.id &&
        getItemDetail(branchBOM.id).then((res) => {
          res.data.bomBranchDetailRestVOs = res.data.bomBranchDetailRestVOs.map(el => {
            return {
              ...el,
              bomBranchCode: el.bomBranchCode || el.itemCode || el.sku,
              bomBranchName: el.bomBranchName || el.itemDescription || el.itemName
            };
          });
          setPriceEditDetail((prevState) => {
            return {
              data: [prevState.data[0], ...res.data.bomBranchDetailRestVOs],
              totalItems:
                prevState.totalItems + res.data.bomBranchDetailRestVOs.length,
              currentPage,
              pageSize,
            };
          });
        });
    }
  }, [branchBOM, currentPage, pageSize]);

  const getDialogStatusParent = (status) => {
    getDialogStatusGrandParent(status);
  };

  const onTaxCodeChange = (rowData, e) => {
    const valueTaxCode = e.target.value;
    setPriceEditDetail((prevState) => {
      let newItems = [...prevState.data];
      const foundIndex = prevState.data.findIndex((item) => {
        return (
          (item.bomBranchCode || item.itemCode || item.sku) ===
          (rowData.bomBranchCode || rowData.itemCode || rowData.sku)
        );
      });

      if (newItems[foundIndex]) {
        newItems[foundIndex].taxCode = valueTaxCode;
        if (valueTaxCode === valueTaxCodes.O7) {
          newItems.map(item => 
            item.exVat =  calculateExVat(item.price)
          );
          newItems = recalculateExtVAT(newItems);
        } else {
          newItems.map(item => 
            item.exVat = ''
          );
        }
      }
      return {
        ...prevState,
        data: [...newItems],
      };
    });
  };

  /**
   * Recalculate exVAT for level2 first item when total children price equal to parent level 1 price
   * but total exVAT of children not equal to exVAT of parent
   * @param {Array} priceLineItems 
   */
  const recalculateExtVAT = (priceLineItems) => {
    const parentLevel1Index = priceLineItems.findIndex(el => +el.level === +BranchBOMPrice.levels.level_1);
    const priceLevel1 = (priceLineItems[parentLevel1Index].price && +priceLineItems[parentLevel1Index].price) || 0;

    // Get all items line which are not level 1 to get total price
    const itemNotlevel1 = priceLineItems.filter(el => +el.level !== +BranchBOMPrice.levels.level_1);
    let totalChildrenPrice = 0;
    if (itemNotlevel1.length > 0) {
      itemNotlevel1.forEach(el => {
        totalChildrenPrice += (el.price && +el.price) || 0;
      });
    }

    // No need recalculate exVat when total price of children is not equal to price of parent
    if (priceLevel1 !== totalChildrenPrice) {
      return priceLineItems;
    }

    const firstLevel2 = itemNotlevel1[0];
    const level1ExVat = +priceLineItems[parentLevel1Index].exVat;
    let totalChildrenExVat = 0;
    if (itemNotlevel1.length > 0) {
      itemNotlevel1.forEach((el) => {
        totalChildrenExVat += (el.exVat && +el.exVat) || 0;
      });
    }

    if (firstLevel2) {
      // Decide to plus/minus
      firstLevel2.exVat = +(+firstLevel2.exVat + (level1ExVat - totalChildrenExVat)).toFixed(2);
    }

    return priceLineItems;
  };

  const onPriceChange = (rowData, price) => {
    setPriceEditDetail((prevState) => {
      const newItems = [...prevState.data];
      // Re-map bomBranchCode field, since there is a case APi return itemCode or bomBranchCode
      // Will remove when BE support return ony 1 field name
      const foundIndex = prevState.data.findIndex((item) => {
        return (
          (item.bomBranchCode || item.itemCode || item.sku) === (rowData.bomBranchCode || rowData.itemCode || rowData.sku)
        );
      });

      if (newItems[foundIndex]) {
        newItems[foundIndex].price = price;
        if (newItems[0].taxCode === valueTaxCodes.OX){
          newItems.map(item => 
            item.exVat = ''
          );
        }
        else{
          newItems[0].taxCode = valueTaxCodes.O7;
          newItems.map(item => 
            item.exVat =  calculateExVat(item.price)
          );
        }
      }

      const tempNewItems = recalculateExtVAT(newItems);
      return {
        ...prevState,
        data: [...tempNewItems],
      };
    });
  };

  const filterItemType = (itemType) => {
    if (itemType === 'item') {
      return 1;
    }
    if (itemType === 'bom_branch') {
      return 2;
    }
    if (itemType === 'bom_branch_group') {
      return 3;
    }

    return 2;
  };

  const onSave = () => {
    const parentPrice = +priceEditDetail.data[0].price || 0;

    let childrenPrice = 0;

    for (let index = 0; index < priceEditDetail.data.length; index++) {
      const item = priceEditDetail.data[index];
      if (index !== 0) {
        childrenPrice += +item.price || 0;
      }

      if (!Number.isInteger(+item.price) || +item.price === 0) {
        showError(Message.BRANCH_BOM_PRICE.EMPTY_PRICE);
        return;
      }
    }
    
    if (parentPrice !== childrenPrice) {
      showError(Message.BRANCH_BOM_PRICE.CHILDREN_PRICE_NOT_EQUAL_PARENT_PRICE);
      return;
    }

    let newBranchBOM = {
      ...priceEditDetail.data[0],
      childBomPriceDetailVO: [],
    };

    priceEditDetail.data.forEach((item, index) => {
      if (index === 0) {
        return;
      } else {
        newBranchBOM.childBomPriceDetailVO.push({
          ...item,
          itemType: filterItemType(item.entity),
        });
      }
    });

    getUpdatedPriceItem(newBranchBOM);
    setParentClosedStatus(false);
  };

  return (
    <FPDialog
      buttonType={'btnSecondary'}
      titleDialog={t(isEditPage ? 'Input the Price' : 'View Price', {
        bomPriceCode: branchBOM?.bomBranchCode || branchBOM?.itemCode || branchBOM?.sku || '',
      })}
      classCustomDialog={classes.editBOMPrice}
      isAddIcon={false}
      isOpen={parentOpenStatus}
      isClosed={parentClosedStatus}
      getDialogStatus={getDialogStatusParent}
    >
      <div className="subtitle"></div>
      <TableGrid
        columns={isEditPage ? priceEditColumns(onPriceChange, onTaxCodeChange, taxCode) : priceDetailColumns}
        dataTable={priceEditDetail}
        options={priceEditOptions}
        hidePagination={true}
      />
      {isEditPage && <span className={classes.btnSaveCls}>
        <Button
          handleClick={onSave}
          className={ButtonConstant.type.PRIMARY}
          isFontAwesome={false}
          title="Save"
          classCustom={classes.btnSave}
        />
      </span>}
    </FPDialog>
  );
};

PriceEdit.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.any,
  isEditPage: PropTypes.bool,
  grandParentOpenStatus: PropTypes.bool,
  grandParentClosedStatus: PropTypes.bool,
  getDialogStatusGrandParent: PropTypes.func,
  parentBranchBOM: PropTypes.object,
  getUpdatedPriceItem: PropTypes.func,
};

export default withTranslation()(withStyles(useStyles)(PriceEdit));
