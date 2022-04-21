import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { ButtonConstant } from '../../../constants/constants';
import Button from '../../shared/buttons/button.component';
import ExportDataComponent from '../../shared/export-data/export-data.component';
import Fields from '../../shared/fields/fields.component';
import { exportConfigs, exportFields } from '../voucher-list.config';
import { default as style } from '../voucher-list.style';

function VoucherExport(props) {
  const {
    t,
    isOpenExportDialog,
    error,
    dataExport,
    handleClosePopup,
    exportDataExternal,
    classes,
  } = props;

  const [typeExport, setTypeExport] = useState(true);
  const [email, setEmail] = useState('');
  const [exportPopupFields, setExportPopupFields] = useState(
    exportFields(typeExport, email)
  );

  // Render fields popup export
  const renderFields = exportFields => {
    const array = [];
    let index = 0;

    // Check to separate fields which have separateInOnline is true
    exportFields &&
      exportFields.forEach(el => {
        if (el.separateInOneLine) {
          array[index] = [el];
          index++;
        } else {
          if (!array[index]) {
            array[index] = [el];
          } else {
            array[index].push(el);
          }
        }
      });

    // Return row
    return array.map((item, index) => (
      <Fields
        key={index}
        conditionalArray={item}
        onChange={handleChangeExport}
      />
    ));
  };

  // Popup export Data
  const handleChangeExport = (e, isRadio) => {
    if (isRadio) {
      const typeValue = e.target.value === 'true' ? true : false;
      setTypeExport(typeValue);
      setExportPopupFields(exportFields(typeValue, email));
    } else {
      const email = e.target.value;
      setEmail(email);
      setExportPopupFields(exportFields(typeExport, email));
    }
  };

  const exportData = () => {
    exportDataExternal(email);
  };

  return (
    <>
      <Dialog
        className={`${classes.detailDialog} ${classes.exportVoucher} `}
        open={isOpenExportDialog}
      >
        <div className={`${classes.titlePage} subtitle`}>
          <DialogTitle id="customized-dialog-title">
            {t('Export Voucher')}
          </DialogTitle>
          <span onClick={handleClosePopup}>
            <CloseIcon className="btnPrimary" />
          </span>
        </div>
        <DialogContent dividers className={`${!typeExport && error.isError ? 'validate' : ''} export-voucher-dialog`} >
          {renderFields(exportPopupFields)}
          {!typeExport && error.isError && <span className="email">{error.message}</span>}
          <div className={classes.btnDiv}>
            <Button
              handleClick={handleClosePopup}
              className={ButtonConstant.type.NEUTRAL}
              title="Cancel"
              disabled={false}
              classCustom={classes.btnClear}
            />
            <ExportDataComponent
              classCustom={classes.btnSearch}
              className={ButtonConstant.type.PRIMARY}
              data={dataExport}
              {...exportConfigs}
              title="Export"
              typeExport={typeExport}
              exportDataExternal={exportData}
              closePopup={handleClosePopup}
              exportFileNameHaveDate={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

VoucherExport.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.any,
  isOpenExportDialog: PropTypes.any,
  error: PropTypes.any,
  typeExport: PropTypes.any,
  dataExport: PropTypes.any,
  handleClosePopup: PropTypes.func,
  exportDataExternal: PropTypes.func,
};

export default withTranslation()(withStyles(style)(VoucherExport));
