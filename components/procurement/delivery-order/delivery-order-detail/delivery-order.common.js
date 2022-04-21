export const convertItemDataStructure = (data) =>
  data.map((rowData, index) => ({
    id: rowData.id,
    no: index + 1,
    common: {
      imgUrl: '',
      id: rowData.itemId,
    },
    ...rowData.item,
    ...rowData,
  }));
