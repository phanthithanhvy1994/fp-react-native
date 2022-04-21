import React, { useState, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import PageHeader from '../shared/page-header/page-header.component';
import TableGrid from '../shared/table-grid/table-grid.component';
import { MasterDataConstant } from '../../constants/constants';
import { openDialog } from '../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../util/constant';
import { dateFormat } from '../../constants/constants';
import { Message } from '../../constants/messages';
import {
  formatDateString,
  convertToDateServerFormat,
} from '../../util/date-util';

import useStyles from './master-data.style';

import {
  getStockCountExportData,
  importStockCountMasterData,
} from '../../actions/master-data.action';

import {
  columns,
  options,
  exportStockCountConfigs,
  importStockCountConfigs,
  actions,
} from './master-data.config';

function MasterData(props) {
  const { classes } = props;
  const pageHeader = {
    pageTitle: `${MasterDataConstant.pageTitle}`,
  };

  const [importHeaders, setImportHeaders] = useState([]);
  const hiddenFileInputRef = useRef(null);

  // For import
  const allowedExtensions = ['xlsx', 'xls', 'csv'];
  const allowedExtensionsForInput = '.xlsx,.xls,.csv';
  const dialogTitleExtension = Message.MASTER_DATA.INCORRECT_FILE_TYPE_TITLE;
  const dialogContentExtension =
    Message.MASTER_DATA.INCORRECT_FILE_TYPE_CONTENT;
  const dialogTitleStructure = Message.MASTER_DATA.INVALID_FILE_TITLE;
  const dialogContentStructure = Message.MASTER_DATA.INVALID_FILE_CONTENT;
  const invalidDataMessage = Message.MASTER_DATA.INVALID_DATA_IN_FILE;

  const handleImportError = (title, content) => {
    openDialog({
      type: dialogConstant.type.ERROR,
      title,
      content,
      actions: [
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  // Process data from file
  const processData = (dataString, inputFileName) => {
    // Regex pattern to split data fields in the same row
    const regex = /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/;
    const list = [];

    // Split data into multiple lines
    const dataStringLines = dataString.split(/\r\n|\n/);
    dataStringLines.shift();

    // Create an array of data object with props headers and file data
    for (let i = 0; i < dataStringLines.length; i += 1) {
      // Split data in the same row
      const row = dataStringLines[i].split(regex);

      if (importHeaders && row.length === importHeaders.length) {
        const obj = {};
        for (let j = 0; j < importHeaders.length; j += 1) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') {
              d = d.substring(1, d.length - 1);
            }
            if (d[d.length - 1] === '"') {
              d = d.substring(d.length - 2, 1);
            }
          }
          if (importHeaders[j]) {
            obj[importHeaders[j]] = d;
          }
        }

        // Remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // If data are not rendered, show error message and stop
    if (list.length === 0) {
      handleImportError(dialogTitleStructure, dialogContentStructure);
      return;
    }

    // Output: Send data to parent component
    importDataFn(list);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop();

    // Validate file extension
    // If file extension is incorrect,
    // stop the function and open dialog
    if (!allowedExtensions.includes(fileExtension)) {
      handleImportError(dialogTitleExtension, dialogContentExtension);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      // Parse data
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary', dateNF: 'dd"/"mm"/"yyyy' });

      // Get first worksheet
      const worksheetName = wb.SheetNames[0];
      const worksheet = wb.Sheets[worksheetName];

      // Get new data
      const newData = XLSX.utils.sheet_to_csv(worksheet);

      processData(newData, file.name.split('.').shift());
    };
    reader.readAsBinaryString(file);
  };

  // For export
  const FILE_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const FILE_EXTENSION = '.xlsx';
  const NO_DATA_CONTENT = 'No data to export!';

  // This field is auto added when convert json to worksheet,
  // so we should remove it in the output excel file
  const DEFAULT_UNUSED_FIELD = 'dataTable';

  // Show error dialog
  const handleError = (content) => {
    openDialog({
      type: dialogConstant.type.ERROR,
      title: Message.ERROR,
      content,
      actions: [
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const replaceSpaceKeys = (object) => {
    Object.keys(object).forEach(function (key) {
      var newKey = key.replace(/\s+/g, '');
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
    return object;
  };

  const convertDateStringImport = (dateString) => {
    const dateMomentObject = moment(dateString, dateFormat.ddmmyyyy);
    const convertedDateString = moment(dateMomentObject).format(
      dateFormat.mmddyyyy
    );

    const importDateString = convertToDateServerFormat(convertedDateString);
    return importDateString;
  };

  const isValidImportData = (formatData) => {
    let isValid = true;
    const constraintNumber = [0, 1];

    formatData.forEach((row) => {
      if (
        !constraintNumber.includes(row.daily) ||
        !constraintNumber.includes(row.weekly) ||
        !constraintNumber.includes(row.monthly) ||
        !constraintNumber.includes(row.yearly) ||
        row.threshold < 0 ||
        row.threshold > 100 ||
        isNaN(row.threshold) ||
        row.validFrom === 'Invalid date' ||
        row.validTo === 'Invalid date'
      ) {
        isValid = false;
        return;
      }
    });

    if (!isValid) {
      openDialog({
        type: dialogConstant.type.ERROR,
        title: Message.ERROR,
        content: invalidDataMessage,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
    }

    return isValid;
  };

  const handleImportFail = (res) => {
    const message = res.message;
    const messageContent =
      message &&
      message.messages &&
      message.messages[0] &&
      message.messages[0].messageContent;

    openDialog({
      type: dialogConstant.type.ERROR,
      title: Message.ERROR,
      content: messageContent,
      actions: [
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const importDataFn = (importDataList) => {
    if (importDataList.length === 0) {
      openDialog({
        type: dialogConstant.type.ERROR,
        title: Message.IMPORT_EXPORT.NO_FILE_SELECT,
        content: Message.IMPORT_EXPORT.CHOOSE_FILE_IMPORT,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return;
    }
    const formatData = importDataList.map((item) => {
      const formatItem = replaceSpaceKeys(item);
      return {
        branchGroup: formatItem.branchGroup,
        materialCode: formatItem.materialCode,
        daily: Number(formatItem.daily) || 0,
        weekly: Number(formatItem.weekly) || 0,
        monthly: Number(formatItem.monthly) || 0,
        yearly: Number(formatItem.yearly) || 0,
        threshold: Number(formatItem.threshold),
        validFrom: convertDateStringImport(formatItem.validFrom),
        validTo: convertDateStringImport(formatItem.validTo),
      };
    });

    if (!isValidImportData(formatData)) {
      return;
    }

    const dataImport = { stockItemWOs: formatData };
    importStockCountMasterData(dataImport).then((res) => {
      if (!res.message) {
        openDialog({
          type: dialogConstant.type.INFO,
          title: Message.IMPORT_EXPORT.IMPORT_SUCCESSFUL,
          content: Message.IMPORT_EXPORT.IMPORT_SUCCESSFUL,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
      } else {
        handleImportFail(res);
      }
    });
  };

  const exportToExcel = (
    inputData,
    inputFileName,
    inputHeaders,
    inputUnusedFields
  ) => {
    // Show error dialog when no data found
    if (inputData.length === 0) {
      handleError(NO_DATA_CONTENT);
      return;
    }

    // Remove unneccessary fields of input json data
    const modifiedUnusedFields = [...inputUnusedFields];
    modifiedUnusedFields.push(DEFAULT_UNUSED_FIELD);
    const modifiedInputData = inputData.map((obj) =>
      // Remove input unused fields name by lodash
      _.omit(obj, modifiedUnusedFields)
    );
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(modifiedInputData);

    // Change worksheet headers with defined headers
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let i = range.s.c; i <= range.e.c; i += 1) {
      const address = `${XLSX.utils.encode_col(i)}1`;
      if (worksheet[address]) {
        worksheet[address].v = inputHeaders[i];
      }
    }

    // Create excel file
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const newData = new Blob([excelBuffer], { type: FILE_TYPE });

    // Save excel file to user's pc
    FileSaver.saveAs(newData, inputFileName + FILE_EXTENSION);
  };

  const getDataForTableGrid = () => {
    const dataForTable = [];
    const masterTypeArray = [
      MasterDataConstant.masterDataType.stockCount,
      MasterDataConstant.masterDataType.branchBom,
      MasterDataConstant.masterDataType.branchBomPrice,
    ];

    masterTypeArray.forEach((item) => {
      dataForTable.push({
        masterDataType: item,
      });
    });

    return {
      data: dataForTable,
    };
  };

  const handleImport = (rowData, event) => {
    if (
      rowData.masterDataType === MasterDataConstant.masterDataType.stockCount
    ) {
      setImportHeaders(importStockCountConfigs.headers);
      hiddenFileInputRef.current.click();
    }
  };

  const filterExportData = (data) => {
    const formattedData = [];

    data &&
      data.forEach((item) => {
        formattedData.push({
          branchGroup: item.branchGroup,
          materialCode: item.materialCode,
          daily: item.daily,
          weekly: item.weekly,
          monthly: item.monthly,
          yearly: item.yearly,
          threshold: item.threshold,
          validFrom:
            formatDateString(item?.validFrom, dateFormat.mainDate, true) || '',
          validTo:
            formatDateString(item?.validTo, dateFormat.mainDate, true) || '',
        });
      });

    return formattedData;
  };

  const handleExport = (rowData) => {
    if (
      rowData.masterDataType === MasterDataConstant.masterDataType.stockCount
    ) {
      // temp params for testing
      getStockCountExportData().then((res) => {
        let formattedExportData = [];
        if (res && res.data && res.data.length) {
          formattedExportData = filterExportData(res.data);
        }
        exportToExcel(
          formattedExportData,
          exportStockCountConfigs.fileName,
          exportStockCountConfigs.headers,
          exportStockCountConfigs.unusedFields
        );
      });
    }
  };

  return (
    <div className={classes.masterDataList}>
      <PageHeader {...pageHeader} />
      <div className={classes.masterDataListCover}>
        <TableGrid
          columns={columns}
          options={options}
          actions={actions(
            handleImport,
            handleExport,
            hiddenFileInputRef,
            allowedExtensionsForInput,
            handleFileUpload
          )}
          dataTable={getDataForTableGrid()}
          defaultStyle={true}
          hidePagination={true}
        />
      </div>
    </div>
  );
}

MasterData.propTypes = {
  classes: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(MasterData));
