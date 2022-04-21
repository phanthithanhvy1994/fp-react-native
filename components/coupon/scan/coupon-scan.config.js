import { FieldConstant, dateFormat } from '../../../constants/constants';
import Delete from '@material-ui/icons/Delete';
import { Message } from '../../../constants/messages';
import { formatDateString } from '../../../util/date-util';

const fieldArray = (detailData) => [
  {
    label: 'Valid From',
    id: 'validFrom',
    fieldName: 'validFrom',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
    value: detailData && detailData.validFrom
      && formatDateString(detailData.validFrom, dateFormat.mainDate, true)
  },
  {
    label: 'Valid To',
    id: 'validTo',
    fieldName: 'validTo',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
    value: detailData && detailData.validTo
      && formatDateString(detailData.validTo, dateFormat.mainDate, true)
  },
  {
    fieldType: FieldConstant.type.NONE
  },
  {
    fieldType: FieldConstant.type.NONE
  },
];

const fieldsLabelArray = (detailData) => [
  {
    label: 'Coupon Name',
    fieldName: 'couponName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.couponName) || '',
  },
  {
    label: 'Type',
    fieldName: 'couponMatDescName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.couponMatDescName) || '',
  },
  {
    label: 'Coupon Value Type',
    fieldName: 'couponTypeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.couponTypeName) || '',
  },
  {
    label: 'Total Quantity',
    fieldName: 'totalCouponQty',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.totalCouponQty) || '',
  },
  {
    label: 'Scanned Quantity',
    fieldName: 'scannedQuantity',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.scannedQuantity) || 0,
  },
];

const columnsDetail = (couponData) => [
  {
    title: 'Item No.',
    field: 'lineNumber',
    editable: 'never',
  },
  {
    title: 'Coupon Serial No.',
    field: 'serialNo',
    editable: 'never',
  },
  {
    title: 'Valid From',
    field: 'validFrom',
    editable: 'never',
    render: function customRender(rowData) {
      const date = (couponData && !rowData.isAlreadySaved && couponData.validFrom) || rowData.validFrom;
      return (date
        && formatDateString(date, dateFormat.mainDate, true)
      ) || '';
    }
  },
  {
    title: 'Valid To',
    field: 'validTo',
    editable: 'never',
    render: function customRender(rowData) {
      const date = (couponData && !rowData.isAlreadySaved && couponData.validTo) || rowData.validTo;
      return (date
        && formatDateString(date, dateFormat.mainDate, true)
      ) || '';
    }
  },
  {
    title: 'Status',
    field: 'statusName',
    editable: 'never',
  },
];

const actions = (scanDeleteRow) => [
  {
    icon: Delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      scanDeleteRow(rowData);
    },
  }
];

const bottomGridButtonsArray = (onSave, onCancel) => [
  {
    title: 'Cancel',
    className: 'btnNeutral',
    customHandleClick: true,
    handleClick: onCancel,
  },
  {
    title: 'Save',
    handleFor: 'save',
    className: 'btnPrimary',
    customHandleClick: true,
    handleClick: onSave,
  },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const validation = [
  {
    name: 'validFrom',
    rule: {
      required: `Valid From ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'validTo',
    rule: {
      required: `Valid To ${Message.FIELD_REQUIRED}`,
    },
  },
];

export {
  actions,
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  options,
  validation,
  fieldArray,
};
