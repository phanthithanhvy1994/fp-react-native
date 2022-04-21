import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import PageHeader from '../../../shared/page-header/page-header.component';

import {
  columnsDetail,
  totalSummarizeInGrid,
  headerFields,
  options,
} from './delivery-order-detail.config';
import { ActionType } from '../../../../constants/constants';

import { getDeliveryOrder } from '../../../../actions/delivery-order.action';

import { convertItemDataStructure } from './delivery-order.common';

const DeliveryOrderDetail = (props) => {
  const { location } = props;
  const pathname = location.pathname;

  const deliveryOrderId =
    (location.state && location.state.id) || pathname.split('/').pop();

  const dispatch = useDispatch();

  const [fieldsLabelArray, setFieldsLabelArray] = useState(headerFields);

  const [pageHeaderConfigs, setPageHeaderConfigs] = useState({
    pageTitle: 'View Delivery Order Detail <>',
    showButton: false,
  });

  const getDeliveryOrderDetail = useCallback(() => {
    getDeliveryOrder({
      id: deliveryOrderId,
    }).then((res) => {
      setPageHeaderConfigs((prevState) => {
        return {
          ...prevState,
          pageTitle: `View Delivery Order Detail <${res.data.generalInformation.doNumber}>`,
        };
      });

      setFieldsLabelArray(headerFields(res.data.generalInformation));

      const newDetailData = convertItemDataStructure(
        res.data.detailInformation,
        columnsDetail[1].infoList
      );

      const history = (res.data && res.data.doHistoryVOS &&
        res.data.doHistoryVOS.map((el) => ({
          time: el.updateDate,
          note: `${el.action} ${el.document ? el.document : ''}`,
          userName: el.createdBy,
        }))) ||
      [];

      dispatch({
        type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
        dataDetailsOnGrid: {
          data: newDetailData,
          totalItems: newDetailData.length,
          currentPage: 1,
          pageSize: 5,
        },
      });

      dispatch({
        type: ActionType.UPDATE_HISTORY_DATA,
        history: history 
      });
    });
  }, [deliveryOrderId, dispatch]);

  useEffect(() => {
    getDeliveryOrderDetail();
  }, [getDeliveryOrderDetail]);

  const listConfig = {
    totalSummarizeInGrid,
    columnsDetail,
    options,
    hasAddItems: false,
    hasButton: false,
    isDetailsPage: true,
    rowSize: 3,
    classFormFieldCustom: 'return-request-general-info-form',
    bottomGridButtonsArray: [],
  };

  return (
    <>
      <PageHeader {...pageHeaderConfigs} />
      <div style={{ marginTop: '114px' }}></div>
      <DetailForm {...listConfig} fieldsLabelArray={fieldsLabelArray} />
    </>
  );
};

DeliveryOrderDetail.propTypes = {
  location: PropTypes.object,
  open: PropTypes.bool,
  dataItem: PropTypes.any,
  onClose: PropTypes.func,
  t: PropTypes.any,
  imgUrl: PropTypes.any,
};

export default withRouter(withTranslation()(DeliveryOrderDetail));
