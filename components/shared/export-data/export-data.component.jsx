import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import clsx from 'clsx';

import Button from '../buttons/button.component';
import { ReactComponent as ExportIcon } from '../../../assets/exportIcon.svg';
import { ButtonConstant, dateFormat } from '../../../constants/constants';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { formatDateString } from '../../../util/date-util';
import {Message} from '../../../constants/messages';

const ExportDataComponent = props => {
  // unusedFields: an array of fields (string) that is disallowed to be exported
  const {
    data,
    fileName,
    headers,
    unusedFields,
    classCustom,
    isFontAwesome,
    className,
    typeExport,
    exportDataExternal,
    contentCustom,
    closePopup,
    isExport,
    isAOA,
    hidden,
    exportFileNameHaveDate
  } = props;

  const classDefault = clsx(classCustom, ButtonConstant.type.PRIMARY);

  useEffect(() => {
    if (isExport) {
      // For export Coupon
      const exportTime = exportFileNameHaveDate ? formatDateString(new Date(), dateFormat.exportDate, true) :'';
      const reFileName = fileName + exportTime;
      exportToExcel(data, reFileName, headers, unusedFields);
    }
  });

  const FILE_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const FILE_EXTENSION = '.xlsx';
  const NO_DATA_CONTENT = contentCustom || 'No data to export!';

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

  const exportToExcel = (
    inputData,
    inputFileName,
    inputHeaders,
    inputUnusedFields,
    isAOA // convert to excel by the array
  ) => {
    // Show error dialog when no data found
    if (inputData.length === 0) {
      handleError(NO_DATA_CONTENT);
      return;
    }

    // Remove unneccessary fields of input json data
    const modifiedUnusedFields = [...inputUnusedFields];
    modifiedUnusedFields.push(DEFAULT_UNUSED_FIELD);
    const modifiedInputData = inputData.map(obj =>
      // Remove input unused fields name by lodash
      _.omit(obj, modifiedUnusedFields)
    );
    let worksheet;
    // Convert JSON to worksheet
    if (isAOA) {
      worksheet = XLSX.utils.aoa_to_sheet(inputData);
    } else {
      worksheet = XLSX.utils.json_to_sheet(modifiedInputData);
      // Change worksheet headers with defined headers
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      if (inputHeaders) {
        for (let i = range.s.c; i <= range.e.c; i += 1) {
          const address = `${XLSX.utils.encode_col(i)}1`;
          if (worksheet[address]) {
            worksheet[address].v = inputHeaders[i];
          }
        }
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
    closePopup && closePopup();
  };

  return (
    <label
      onClick={() => {
        if (typeExport) {
          // For export Voucher
          const exportTime = exportFileNameHaveDate ? formatDateString(new Date(), dateFormat.exportDate, true) :'';
          const reFileName = fileName + exportTime;
          return exportToExcel(data, reFileName, headers, unusedFields, isAOA);
        }
        return exportDataExternal();
      }}
      hidden={hidden}
      className={classCustom}
    >
      <Button
        classCustom={classDefault}
        className={className}
        icon={isFontAwesome && <ExportIcon />}
        title="Export"
        hidden={hidden}
      ></Button>
    </label>
  );
};

ExportDataComponent.propTypes = {
  data: PropTypes.array,
  fileName: PropTypes.string,
  headers: PropTypes.array,
  unusedFields: PropTypes.array,
  classCustom: PropTypes.string,
  isFontAwesome: PropTypes.any,
  className: PropTypes.any,
  typeExport: PropTypes.any,
  exportDataExternal: PropTypes.func,
  contentCustom: PropTypes.string,
  closePopup: PropTypes.func,
  isExport: PropTypes.bool,
  isAOA: PropTypes.bool,
  hidden: PropTypes.bool,
  exportFileNameHaveDate: PropTypes.bool,
};

export default ExportDataComponent;
