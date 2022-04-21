import { getMaterialImage } from '../../../../actions/material-action';

export const convertDataStructureForDetailGrid = (data) =>
  data.map(rowData => ({
    id: rowData.goodsIssuesDetailId,
    no: rowData.no || rowData.lineNumber,
    common: {
      imgUrl: `${getMaterialImage()}?sku=${rowData.sku}`,
      id: rowData && rowData.id,        
    },
    description: rowData.categoryName, 
    ...rowData,
  }));