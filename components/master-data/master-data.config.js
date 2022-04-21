import React from 'react';
import { ReactComponent as ImportIcon } from '../../assets/importIcon.svg';
import { ReactComponent as ExportIcon } from '../../assets/exportIcon.svg';

const columns = [
  {
    title: 'Master data',
    field: 'masterDataType',
    editable: 'never',
  },
];

const options = {
  search: false,
  paging: false,
  showTitle: false,
  sorting: false,
  draggable: false,
};

const icons = (
  hiddenFileInputRef,
  allowedExtensionsForInput,
  handleFileUpload
) => {
  return {
    import: (
      <>
        <input
          type="file"
          ref={hiddenFileInputRef}
          accept={allowedExtensionsForInput}
          onChange={(e) => {
            handleFileUpload(e);
            e.target.value = null;
          }}
          style={{ display: 'none' }}
        />
        <ImportIcon />
      </>
    ),
    export: <ExportIcon />,
  };
};

const exportStockCountConfigs = {
  fileName: 'bbs_masterdata_stockcount',
  headers: [
    'branch group',
    'material_code',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'threshold',
    'valid_from',
    'valid_to',
  ],
  unusedFields: [''],
};

const importStockCountConfigs = {
  headers: [
    'branchGroup',
    'materialCode',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'threshold',
    'validFrom',
    'validTo',
  ],
};

const actions = (
  onHandleImport,
  onHandleExport,
  hiddenFileInputRef,
  allowedExtensionsForInput,
  handleFileUpload
) => [
  {
    icon: () =>
      icons(hiddenFileInputRef, allowedExtensionsForInput, handleFileUpload)
        .import,
    tooltip: 'Import',
    onClick: (event, rowData) => {
      onHandleImport(rowData, event);
    },
    position: 'row',
  },
  {
    icon: () => icons().export,
    tooltip: 'Export',
    onClick: (event, rowData) => {
      onHandleExport(rowData);
    },
    position: 'row',
  },
];

export {
  columns,
  options,
  exportStockCountConfigs,
  importStockCountConfigs,
  actions,
};
