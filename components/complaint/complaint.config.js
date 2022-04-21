import React from 'react';
import FileUpload from '../shared/file-upload/file-upload.component';
import ItemGrid from '../shared/table-grid/item-grid.component';

const renderImage = rowData => (
  <ItemGrid image={rowData.imageUrl}>
    <div>Description: {rowData.description}</div>
    <div>ID: {rowData.roleId}</div>
    <div>Name: {rowData.roleName}</div>
    <div>Name: {rowData.roleName}</div>
    <div>Name: {rowData.roleName}</div>
  </ItemGrid>
);
const renderFileUpload = (rowData, attachFiles) => (
  <FileUpload
    files={rowData.attachFiles || []}
    allowMultiple={true}
    onupdatefiles={files => attachFiles(rowData, files)}
    attachFiles
  />
);
const columns = attachFiles => {
  const complaintColumns = [
    {
      title: 'Image',
      field: 'image',
      render: rowData => renderImage(rowData),
      cellStyle: {
        width: 400,
      },
    },
    { title: 'Role Name', field: 'roleName' },
    { title: 'Description', field: 'description' },
    {
      title: 'File',
      field: 'file',
      render: rowData => renderFileUpload(rowData, attachFiles),
      cellStyle: {
        width: 200,
      },
    },
  ];
  return complaintColumns;
};

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

export { columns, options };
