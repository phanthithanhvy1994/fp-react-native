import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import * as XLSX from 'xlsx';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FormControl from '@material-ui/core/FormControl';

import useStyles from '../../../style/core/import-data/import-data';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';

const ImportDataComponent = forwardRef((props, ref) => {
  const { headers, updateImportData, msgNotValidFile } = props;

  const allowedExtensions = ['xlsx', 'xls', 'csv'];
  const allowedExtensionsForInput = '.xlsx,.xls,.csv';
  const dialogTitleExtension = 'Incorrect file type';
  const dialogContentExtension = 'File type is not correct! (csv,xls,xlsx).';
  const dialogTitleStructure = 'Invalid file';
  const dialogContentStructure = msgNotValidFile || 'File is not valid!';

  const [fileName, setFileName] = useState('Choose file');

  const classes = useStyles();
  const inputFile = useRef(null);

  // Open error dialog
  const handleError = (title, content) => {
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
    const checkHeader = dataStringLines[0]?.split(',');
    let isInvalidHeader = false;
    if (checkHeader && headers && checkHeader.length === headers.length) {
      for (let index = 0; index < checkHeader.length; index++) {
        if (checkHeader[index] !== headers[index]) {
          isInvalidHeader = true;
          break;
        }
      }
    } else {
      isInvalidHeader = true;
    }
    dataStringLines.shift();

    // Create an array of data object with props headers and file data
    for (let i = 0; i < dataStringLines.length; i += 1) {
      // Split data in the same row
      const row = dataStringLines[i].split(regex);

      if (headers && row.length === headers.length) {
        let obj = {};
        for (let j = 0; j < headers.length; j += 1) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') {
              d = d.substring(1, d.length - 1);
            }
            if (d[d.length - 1] === '"') {
              d = d.substring(d.length - 2, 1);
            }
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // Remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          obj = {
            ...obj,
            // Add itemNo field for message error
            itemNo: i + 2,
          };
          list.push(obj);
        }
      }
    }

    // If data are not rendered, show error message and stop
    if (list.length === 0 || isInvalidHeader) {
      handleError(dialogTitleStructure, dialogContentStructure);
      return;
    }

    setFileName(inputFileName);

    // Output: Send data to parent component
    updateImportData(list);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop();

    // Validate file extension
    // If file extension is incorrect,
    // stop the function and open dialog
    if (!allowedExtensions.includes(fileExtension)) {
      handleError(dialogTitleExtension, dialogContentExtension);
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

      const ws = XLSX.utils.sheet_to_json(worksheet, {defval: ''});

      const newData = jsonToCSVConvertor(ws, true);

      processData(newData, file.name.split('.').shift());
    };
    reader.readAsBinaryString(file);
  };

  const jsonToCSVConvertor = (JSONData, ShowLabel) => {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData =
      typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';

    //This condition will generate the Label/Header
    if (ShowLabel) {
      let header = '';

      //This loop will extract the label from 1st index of on array
      for (let index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        header += index + ',';
      }

      header = header.slice(0, -1);

      //append Label row with line break
      CSV += header + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      let row = '';

      //2nd loop will extract each column and convert it in string comma-seprated
      for (let index in arrData[i]) {
        row += arrData[i][index] + ',';
      }

      row = row.slice(0, -1);

      //add a line break after each row
      CSV += row + '\r\n';
    }

    return CSV || '';
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const clearFileName = () => {
    setFileName('Choose file');

    updateImportData([]);
  };

  useImperativeHandle(ref, () => ({
    clearFileName,
  }));

  return (
    <div className={classes.root}>
      <input
        ref={inputFile}
        type="file"
        accept={allowedExtensionsForInput}
        onChange={(e) => {
          handleFileUpload(e);
          e.target.value = null;
        }}
        style={{ display: 'none' }}
      />
      <FormControl
        variant="outlined"
        onClick={onButtonClick}
        className={classes.form}
      >
        <OutlinedInput
          disabled
          id="outlined-adornment-amount"
          value={fileName}
          className={classes.fileSelection}
          style={{ fontSize: '13px' }}
          // onChange={handleChange('amount')}
          endAdornment={<AttachFileIcon position="end" fontSize="small" />}
        />
      </FormControl>
    </div>
  );
});

ImportDataComponent.propTypes = {
  headers: PropTypes.array.isRequired,
  updateImportData: PropTypes.any,
  msgNotValidFile: PropTypes.string
};

export default ImportDataComponent;
