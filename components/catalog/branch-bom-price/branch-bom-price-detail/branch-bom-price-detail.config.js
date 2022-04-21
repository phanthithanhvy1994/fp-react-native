import { FieldConstant, dateFormat, BranchBOMPrice } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

const detailFields = (data, branchGroupList) => [
  {
    label: 'Price List No',
    id: 'bomPriceCode',
    fieldName: 'bomPriceCode',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.bomPriceCode) || '',
  },
  {
    label: 'Channel',
    id: 'channelName',
    fieldName: 'channelName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.channelName) || '',
  },
  {
    label: 'Start Date',
    id: 'startDate',
    fieldName: 'startDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data ? formatDateString(data.startDate, dateFormat.mainDate, true) : '',
  },
  {
    label: 'Price List Name',
    id: 'bomPriceName',
    fieldName: 'bomPriceName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.bomPriceName) || '',
  },
  {
    label: 'Status',
    id: 'statusName',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.statusName) || '',
  },
  {
    label: 'End Date',
    id: 'endDate',
    fieldName: 'endDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data ? formatDateString(data.endDate, dateFormat.mainDate, true) : '',
  },
  {
    label: 'Branch Group',
    id: 'branchGroupCode',
    fieldName: 'branchGroupCode',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && branchGroupList && branchGroupList[+data.branchGroupCode]) || '',
  },
  {
    label: 'Company Code',
    id: 'companyName',
    fieldName: 'companyName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.companyName) || '',
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.createdBy) || '',
  },
  {
    label: 'Last Modified By',
    id: 'updatedBy',
    fieldName: 'updatedBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.updatedBy) || '',
  },
  {
    label: 'Note',
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.description) || '',
  },
];

const bottomGridButtonsArray = (status, handleChangeStatus) => [

  {
    title: 'Edit',
    handleFor: 'edit',
    className: 'btnSecondary',
    handleClick: null,
  }, 
  {
    title: 'Close',
    className: 'btnNeutral',
    customHandleClick: true,
    handleClick: () => handleChangeStatus(BranchBOMPrice.status.closed),
    hidden: !(status === BranchBOMPrice.status.unConfirm || 
      status === BranchBOMPrice.status.draft),
  },
  {
    title: 'InActive',
    className: 'btnDanger',
    customHandleClick: true,
    handleClick: () => handleChangeStatus(BranchBOMPrice.status.inactive),
    hidden: (status !== BranchBOMPrice.status.active),
  }, 
  {
    title: 'Active',
    className: 'btnPrimary',
    customHandleClick: true,
    handleClick: () => handleChangeStatus(BranchBOMPrice.status.active),
    hidden: (status !== BranchBOMPrice.status.inactive)
  }, 
  {
    title: 'UnConfirm',
    className: 'btnDanger',
    customHandleClick: true,
    handleClick: () => handleChangeStatus(BranchBOMPrice.status.unConfirm),
    hidden: (status !== BranchBOMPrice.status.confirm),
  }, 
  {
    title: 'Confirm',
    className: 'btnPrimary',
    customHandleClick: true,
    handleClick: () => handleChangeStatus(BranchBOMPrice.status.confirm),
    hidden: !(status === BranchBOMPrice.status.draft ||
    status === BranchBOMPrice.status.unConfirm),
  }, 
];

const detailOptions = handleCustomRow => ({
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
  rowStyle: (rowData) =>  handleCustomRow(rowData),
});

export { detailFields, detailOptions, bottomGridButtonsArray };
