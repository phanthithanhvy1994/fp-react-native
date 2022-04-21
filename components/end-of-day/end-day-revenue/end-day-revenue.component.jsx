import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import PageHeader from '../../shared/page-header/page-header.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import useStyles from './end-day-revenue.style';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Button from '../../shared/buttons/button.component';
import FormLabelFields from '../../shared/form/detail-form/form-label-fields.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import {
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  options,
  fieldArray,
  exportConfigs
} from './end-day-revenue.config';
import SearchForm from '../../shared/search-form/search-form.component';
import { PaginationConfiguration, ButtonConstant, dateFormat, userBranchInfo } from '../../../constants/constants';
import ExportDataComponent from '../../shared/export-data/export-data.component';
import { getDataCompanyCode } from '../../../actions/branch-bom-action';
import { getUserInfo } from '../../../actions/auth-action';
import { getBranchByUser } from '../../../actions/purchase-order-action';
import { formatDropdownList } from '../../../util/format-util';
import { formatDateString } from '../../../util/date-util';
import {
  getEODRevenueTable,
  submitEODRevenue,
} from '../../../actions/en-of-day.action';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions'; 

function EndDayRevenue(props) {
  const {
    classes,
  } = props;

  const [currentPage , setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  const [searchParams, setSearchParams] = useState({createdDate: new Date()});

  // Data for display in form fields/ form label fields
  const [detailData, setDetailData] = useState({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [field, setField] = useState(
    [...fieldArray]
  );

  const getEODRevenue = useCallback(() => {
    const filteredSearchParams = {
      branchCode: {
        eq: searchParams.branchCode || userBranchInfo.defaultBranch,
      },
      companyCode: {
        eq: searchParams.companyCode || undefined,
      },
      createdDate: {
        eq:
        searchParams.createdDate &&
        formatDateString(searchParams.createdDate, dateFormat.searchingDateTime),
      },
      submittedDate: {
        eq:
          searchParams.submittedDate &&
          formatDateString(
            searchParams.submittedDate,
            dateFormat.searchingDateTime
          ),
      },
    };

    const body = {
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...filteredSearchParams,
    };

    getEODRevenueTable(body).then(res => {
      setDetailData({
        ...res.data,
        data: res.data.revenueDetailVOs || [],
        totalItems: res.totalRecord || 0,
        currentPage,
        pageSize,
      });
      setIsSubmitted(res.data.status === 1 ? false : true);
    });
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    getEODRevenue();
  }, [getEODRevenue]);

  useEffect(() => {
    // Get combobox data and reload into state
    const loggedUser = getUserInfo();
    Promise.all([
      getBranchByUser(loggedUser.userId),
      getDataCompanyCode(),
    ]).then((res) => {
      //Temporary for Test
      loggedUser.branch = userBranchInfo.defaultBranch;
      const newField = [...fieldArray];
      newField.map((item) => {
        if (item.fieldName === 'branchCode') {
          item.data = formatDropdownList(res[0].data);
          item.value = loggedUser.branch;
          item.resetValue = loggedUser.branch;
        }
        if (item.fieldName === 'companyCode') {
          item.data = formatDropdownList(res[1].data);
        }
        return item;
      });
      setField(newField);
    });
  }, []);

  const onSubmit = () => {
    submitEODRevenue({revenueId: detailData.revenueId}).then(res => {
      if (!res.message) {
        openDialog({
          title: Message.INFORMATION,
          content: Message.END_OF_DAY.SUBMIT_SUCCESSFUL,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {
                setIsSubmitted(true);
              },
            },
          ],
        });
      } else if (res.message) {
        openDialog({
          title: Message.warning,
          content: res?.message.messages[0].messageContent,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {},
            },
          ],
        });
      }
    });
  };

  const filterExportData = data => {
    const formattedData = [];

    data &&
      data.forEach(item => {
        formattedData.push({
          no: item.no,
          companyCode: item.companyCode || '',
          createdDate:
          formatDateString(item?.createdDate, dateFormat.yyyymmdd, true) ||
          '',
          submittedDate:
          formatDateString(item?.submittedDate, dateFormat.yyyymmdd, true) ||
          '',
          docType: item.docType || '',
          currency: item.currency || '',
          exchangeRate: item.exchangeRate || '',
          reference: item.reference,
          docHeaderText: item.docHeaderText || '',
          businessPlace: item.businessPlace || '',
          postingKey: item.postingKey || '',
          glAccount: item.glAccount || '',
          customerNo: item.customer || '',
          amount: item.amount || '',
          taxCode: item.taxCode || '',
          calculateTax: item.calculateTax || '',
          taxAmount: item.taxAmount || '',
          taxBaseAmount: item.taxBaseAmount || '',
          paymentType: item.paymentType || '',
          profitCenter: item.profitCenter || '',
          assignment: item.assignment || '',
          text: item.text || '',
          branch: item.branch || '',
          menuName: item.menuName || '',
          promotionCategory: item.promotionCategory || '',
          productCategory: item.productCategory || '',
          serviceMode: item.serviceMode || '',
          sgl:item.sgl || '',
          paymentTerm: item.paymentTerm || '',
          paymentMethod: item.paymentMethod || '',
          baselineDate:
          formatDateString(item?.baselineDate, dateFormat.yyyymmdd, true) ||
          '',
          valueDate:
          formatDateString(item?.valueDate, dateFormat.yyyymmdd, true) ||
          '',
          paymentBlock: item.paymentBlock || '',
          costCenter: item.costCenter || '',
          order: item.order || '',
          referenceKey2: item.referenceKey2 || '',
          referenceKey3: item.referenceKey3 || '',
          tradingPartner: item.tradingPartner || '',
          customerBranchCode: item.customerBranchCode || '',
          controllingArea: item.controllingArea || '',
          salesOrganization: item.salesOrganization || '',
          distributionChannel: item.distributionChannel || '',
          division: item.division || '',
          customer: item.customerNo || '',
          customerGroup: item.customerGroup || '',
          customerGroup1: item.customerGroup1 || '',
          customerGroup2: item.customerGroup2 || '',
          country: item.country || '',
          salesOffice: item.salesOffice || '',
          salesGroup: item.salesGroup || '',
          product: item.product || '',
          materialGroup1: item.materialGroup1 || '',
        });
      });

    return formattedData;
  };

  const onSearch = searchFields => {
    setSearchParams(searchFields);
    setCurrentPage(1);
  };

  const onChangePage = (e, page) => {
    setCurrentPage(page);
  };

  const onChangeRowsPerPage = e => {
    const newPageSize = e.target.value;

    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const renderBottomGridButtons = () => {
    let buttons = {};

    buttons =
      bottomGridButtonsArray(onSubmit) &&
      bottomGridButtonsArray(onSubmit, isSubmitted).map((item, index) => (
        <Button
          key={index}
          title={item.title}
          className={item.className}
          classCustom={item.classCustom}
          handleClick={item.handleClick}
          hidden={item.hidden}
        />
      ));

    return buttons;
  };

  const renderInformation = () => {
    return (
      <FormLabelFields
        classFormFieldCustom="eod-general-information-form"
        fieldsLabelArray={fieldsLabelArray(detailData)}
      />
    );
  };

  const pageHeader = {
    pageTitle: 'End Day Revenue',
    showButton: false,
  };

  return (
    <>
      <div>
        <PageHeader {...pageHeader} />
        <div className={classes.searchEODCover}>
          <SearchForm 
            fieldArray={field}
            onSearch={onSearch}
            classCustom="user-search-bar"
          />
        </div>
      </div>
      <div
        className={`${classes.eODCover} eod-form`}
      >
        <div>
          <Fieldset
            title={'General Information'}
            customClasses={'detail-general-info'}
          >
            {renderInformation()}
          </Fieldset>
          <Fieldset title={'Details Information'}>
            <div className={classes.eODDetailGrid}>
              <TableGrid
                columns={columnsDetail}
                dataTable={detailData}
                options={options}
                onChangePage={(e, page) => onChangePage(e, page)}
                onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
              />
            </div>
          </Fieldset>
          <div className={classes.eODBottomGridBtn}>
            <ExportDataComponent
              className={ButtonConstant.type.SECONDARY}
              data={filterExportData(detailData.revenueDetailVOs)}
              typeExport={true}
              {...exportConfigs}
            />
            {renderBottomGridButtons()}
          </div>
        </div>
      </div>
    </>
  );
}

EndDayRevenue.propTypes = {
  classes: PropTypes.object,
  dataDetailsOnGrid: PropTypes.any,
  updateAllFieldArray: PropTypes.func,
  updateDataDetailsOnGrid: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withStyles(useStyles)(EndDayRevenue));
