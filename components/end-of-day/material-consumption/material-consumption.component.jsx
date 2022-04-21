import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import PageHeader from '../../shared/page-header/page-header.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import useStyles from './material-consumtion.style';
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
  exportConfigs,
} from './material-consumption.config';
import SearchForm from '../../shared/search-form/search-form.component';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import {
  PaginationConfiguration,
  ButtonConstant,
  dateFormat,
  userBranchInfo
} from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import { getDataCompanyCode } from '../../../actions/branch-bom-action';
import { getUserInfo } from '../../../actions/auth-action';
import { getBranchByUser } from '../../../actions/purchase-order-action';
import ExportDataComponent from '../../shared/export-data/export-data.component';
import {
  formatDropdownList,
  mapColumnAndDataForMessageSAP,
} from '../../../util/format-util';
import { formatDateString } from '../../../util/date-util';
import {
  getMaterialConsumptionTable,
  submitMaterialConsumption,
} from '../../../actions/en-of-day.action';

function MaterialConsumption(props) {
  const { classes } = props;

  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  const [searchParams, setSearchParams] = useState({createdDate: new Date()});

  // Data for display in form fields/ form label fields
  const [detailData, setDetailData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [field, setField] = useState([...fieldArray]);

  const getMaterialConsumption = useCallback(() => {
    const filteredSearchParams = {
      branchCode: {
        eq: searchParams.branchCode || userBranchInfo.defaultBranch, //value default on branch code user
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

    //value default on branch code user
    getMaterialConsumptionTable(body).then(res => {
      setDetailData({
        ...res.data,
        data: res.data.consumptionDetails || [],
        totalItems: res.totalRecord || 0,
        currentPage,
        pageSize,
      });
      setIsSubmitted(res.data.submit === 1 ? false : true); // comment code
    });
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    getMaterialConsumption();
  }, [getMaterialConsumption]);

  useEffect(() => {
    // Get combobox data and reload into state
    const loggedUser = getUserInfo();
    Promise.all([
      getBranchByUser(loggedUser.userId),
      getDataCompanyCode(),
    ]).then(res => {
      //Temporary for Test
      loggedUser.branch = userBranchInfo.defaultBranch;
      const newField = [...fieldArray];
      newField.map(item => {
        if (item.fieldName === 'branchCode') {
          item.data = formatDropdownList(res[0].data);
          item['value'] = loggedUser.branch;
          item['resetValue'] = loggedUser.branch;
        }
        if (item.fieldName === 'companyCode') {
          item.data = formatDropdownList(res[1].data);
        }
        return item;
      });
      setField(newField);
    });
  }, []);

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

  const onSubmit = () => {
    openDialog({
      title: Message.CONFIRM,
      content: Message.MATERIAL_CONSUMPTION.SUBMIT_CONFIRM,
      type: dialogConstant.type.CONFIRM,
      actions: [
        {
          name: 'Cancel',
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            submitMaterialConsumption({
              consumptionId: detailData.consumptionId,
              branchCode: detailData.branchCode,
            }).then((res) => {
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
                const msgContent = mapColumnAndDataForMessageSAP(
                  res.message.messages
                );

                openDialog({
                  title: Message.ERROR,
                  type: dialogConstant.type.ERROR,
                  isTableLayout: true,
                  content: msgContent,
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
          },
        },
      ],
    });
  };

  const filterExportData = data => {
    const formattedData = [];

    data &&
      data.forEach(item => {
        formattedData.push({
          no: item.no,
          createdDate:
            formatDateString(item?.createdDate, dateFormat.yyyymmdd, true) ||
            '',
          submittedDate:
            formatDateString(item?.submittedDate, dateFormat.yyyymmdd, true) ||
            '',
          note: item.note || '',
          gmCode: item.gmCode || '',
          branch: item.branch || '',
          companyCode: item.companyCode || '',
          itemName: item.itemName || '',
          storageTypeName: item.storageTypeName || '',
          quantity: item.quantity || '',
          baseUnit: item.baseUnit || '',
          menuName: item.menuName || '',
          itemCategory: item.itemCategory || '',
          productCategory: item.productCategory || '',
          serviceMode: item.serviceMode || '',
          materialGroupName: item.materialGroupName || '',
          materialTypeName: item.materialTypeName || '',
        });
      });

    return formattedData;
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
    pageTitle: 'Material Consumption',
    showButton: false,
  };
  return (
    <>
      <div>
        <PageHeader {...pageHeader} />
        <div className={classes.searchMCCover}>
          <SearchForm
            fieldArray={field}
            onSearch={onSearch}
            classCustom="user-search-bar"
          />
        </div>
      </div>
      <div className={`${classes.mCCover} eod-form`}>
        <div>
          <Fieldset
            title={'General Information'}
            customClasses={'detail-general-info'}
          >
            {renderInformation()}
          </Fieldset>
          <Fieldset title={'Details Information'}>
            <div className={classes.mCDetailGrid}>
              <TableGrid
                columns={columnsDetail}
                dataTable={detailData}
                options={options}
                onChangePage={(e, page) => onChangePage(e, page)}
                onChangeRowsPerPage={e => onChangeRowsPerPage(e)}
              />
            </div>
          </Fieldset>
          <div className={classes.mCBottomGridBtn}>
            <ExportDataComponent
              className={ButtonConstant.type.SECONDARY}
              data={filterExportData(detailData.consumptionDetails)}
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

MaterialConsumption.propTypes = {
  classes: PropTypes.object,
  updateAllFieldArray: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withStyles(useStyles)(MaterialConsumption));
