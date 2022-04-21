import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';

import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from './petty-cash-detail.style';
import { 
  columnsDetail,
  options,
  headerFields,
  bottomGridButtonsArray,
  totalSummarizeInGrid
} from './petty-cash-detail.config';
import {
  rejectPettyCash,
  closePettyCash,
} from '../../../../actions/petty-cash-action';
import { Action, ActionType } from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { buttonConstant, dialogConstant } from '../../../../util/constant';
import { openRejectDialog } from '../../../../redux/reject-dialog/reject-dialog.actions';

const PettyCashDetail = props => {
  const { 
    t,
    match,
    classes,
    history,
    isDetailsPage
  } = props;

  const defaultData= headerFields();
  const [fieldsLabelArray, setFieldsLabelArray] = useState(defaultData);
  const pettyCashId = match.params.id;

  const pageHeaderConfigs = {
    pageTitle: `View Petty Cash Detail <${pettyCashId}>`,
    showButton: false,
  };

  /**
   * Back to  Petty Cash List View
   */
  const backToListView = () => 
    history.push('/procurement/petty-cash-at-branch');

  const showSystemErrorDialog = (res) => {
    const messageContent = (res && res.messages && res.messages[0].messageContent) || Message.SYSTEM_ERROR;
  
    openDialog({
      title: Message.ERROR,
      type: dialogConstant.type.ERROR,
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

  // Handle Close Petty Cash
  const handleClose =() => {
    const msg = Message.PETTY_CASH.CLOSE;
    const pettyCashId = 1;

    openDialog({
      title: Message.CONFIRM,
      content: msg.replace('%PCNo%', pettyCashId || ''),
      actions: [
        {
          name: t('Cancel'),
          type: dialogConstant.button.NONE_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            closePettyCash({ id: pettyCashId })
              .then(() => {
                // Load to back list view
                backToListView();
              })
              .catch((res) => {
                showSystemErrorDialog(res);
              });;
          },
        },
      ],
    });
  };

  const handleRejectPettyCash =( reasonData) => {
    const pettyCashNo =1;
    const pettyCashId =2;
    const successMsg = Message.PETTY_CASH.REJECT;
    return new Promise((resolve, reject) => {
      rejectPettyCash({id: pettyCashId})
        .then(() => {
          openDialog({
            title: Message.INFORMATION,
            type: dialogConstant.type.INFO,
            content: successMsg.replace('%PCNo%', pettyCashNo),
            disableBackdropClick: true,
            actions: [
              {
                name: props.t(Action.ok),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => backToListView(),
              }
            ],
          });
          resolve();
        })
        .catch((res) => {
          showSystemErrorDialog(res);
          reject();
        });
    });

  };

  // Handle Reject Petty Cash
  const handleReject =() => {
    openRejectDialog({
      title: Message.REJECT_TITLE,
      messageTitle: Message.REJECT_MESSAGE_TITLE,
      submitApiFn: handleRejectPettyCash,
      disableBackdropClick: true,
      actions: [
        {
          name: props.t(Action.cancel),
          type: dialogConstant.button.NONE_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: props.t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const handleSubmit =() => {
    console.log(123, 'submit');
  };
  const handleApprove =() => {};


  const listConfig = {
    totalSummarizeInGrid,
    columnsDetail,
    options,
    isDetailsPage,
    fieldsLabelArray,
    classFormFieldCustom: classes.pettyCashDetailForm,
    bottomGridButtonsArray: bottomGridButtonsArray(handleSubmit,1),
    onCustomClose: handleClose,
    onCustomReject: handleReject,
    onCustomApprove: handleApprove,
  };

  useEffect(()=>{
    props.updateHistoryData([
      {
        note: 'CREATE ',
        time: '20210222170159',
        userName: 'Admin',
      }]);
  },[]);

  return (
    <>
      <PageHeader {...pageHeaderConfigs} />
      <div style={{ marginTop: '114px' }}>
        <DetailForm {...listConfig}/>
      </div>
     
    </>
  );
};

PettyCashDetail.propTypes = {
  t: PropTypes.any,
  match: PropTypes.any,
  classes: PropTypes.any,
  isDetailsPage: PropTypes.any,
  history: PropTypes.any,
  updateHistoryData: PropTypes.any,
};

const mapStateToProps = (state)=> {
  return {
    // Get data details on grids from store map to props
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
  };
};

const mapDispatchToProps = dispatch => ({
  // Update data of details information grid
  updateDataDetailsOnGrid: data =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
  updateHistoryData: (data) =>
    dispatch({ type: ActionType.UPDATE_HISTORY_DATA, history: data }),
});

export default  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(useStyles)(PettyCashDetail)));
