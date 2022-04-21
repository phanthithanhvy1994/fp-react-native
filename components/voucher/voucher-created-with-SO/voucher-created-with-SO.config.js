import {
  dateFormat,
  EnumDate,
  FieldConstant,
  Voucher,
} from '../../../constants/constants';
import { covertStringToDate } from '../../../util/date-util';

const fieldArray = (detailData, listOptions, saleOrderNo, stateOfChannel) => [
  [
    {
      label: 'Voucher Name',
      id: 'voucherName',
      fieldName: 'name',
      classParent: 'voucher-name-fld',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      value: detailData?.voucherName || '',
      maxLength: 40
    },
    {
      label: 'Sale Order No.',
      id: 'saleOrderNo',
      fieldName: 'saleOrder',
      classParent: 'sale-oder-no-fld',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      value: detailData?.saleOrderNo || saleOrderNo || '',
      disabled: true,
    },
  ],
  [
    {
      label: 'YY',
      id: 'year1',
      fieldName: 'year1',
      classParent: 'year-cls',
      fieldType: FieldConstant.type.NUMBER,
      className: FieldConstant.class.NUMBER,
      disabled: true,
      value: new Date().getFullYear().toString().substr(-2),
    },
    {
      label: 'Type',
      id: 'voucherPrefixType',
      fieldName: 'refix_type',
      classCustom: 'fullWidth type-cls',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      data: listOptions?.typeOfSNPrefixOption || [],
      value: detailData?.voucherPrefixType || '',
    },
  ],
  [
    {
      label: 'Serial No. Digits',
      id: 'voucherSerialNoDigit',
      fieldName: 'serialNo',
      classCustom: 'fullWidth',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      data: listOptions?.serialNoOption || [],
      value: detailData?.voucherSerialNoDigit || '',
    },
    {
      label: 'Issued By',
      id: 'issuedBy',
      fieldName: 'issue',
      classCustom: 'issueWidth',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      data: listOptions?.issueByOption || [],
      value: detailData?.issuedBy || '',
    },
    {
      label: 'YY',
      id: 'year',
      fieldName: 'year',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      disabled: true,
      value: new Date().getFullYear().toString().substr(-2),
    },
    {
      label: 'Type',
      id: 'serialType',
      fieldName: 'serial_type',
      classParent: 'serialTypeWidth',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      disabled: true,
      value: detailData?.voucherPrefixType || '',
    },
  ],
  [
    {
      label: 'Company Code',
      id: 'companyCode',
      fieldName: 'company',
      classCustom: 'leftGroupField',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      match: true,
      value:
        detailData?.companyCode ||
        (listOptions?.companyCodeOption &&
          listOptions.companyCodeOption[0]?.value) ||
        '',
      data: listOptions?.companyCodeOption || [],
    },
    {
      label: 'Channel',
      id: 'channel',
      fieldName: 'channel',
      classCustom: 'rightGroupField',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      disabled: stateOfChannel.disabled ? stateOfChannel.disabled : false,
      match: false,
      data: listOptions?.channelOption || [],
      value:
        detailData?.channel ||
        (listOptions?.channelOption && stateOfChannel.value) ||
        '',
    },
  ],
  [
    {
      label: 'Voucher Mat Desc',
      id: 'voucherValueType',
      fieldName: 'valueType',
      classCustom: 'leftGroupField',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      math: true,
      value:
        detailData?.voucherValueType ||
        (listOptions?.voucherValueTypeOption &&
          listOptions.voucherValueTypeOption[0]?.value) ||
        '',
      disabled: true,
      data: listOptions?.voucherValueTypeOption || [],
    },
    {
      label: 'Total',
      id: 'totalVoucherQty',
      fieldName: 'total',
      classCustom: 'rightGroupField',
      fieldType: FieldConstant.type.QUANTITY,
      required: true,
      disabled: true,
      isOnFormField: true,
      value: detailData?.totalVoucherQty || detailData?.quantity || 1,
    },
    {
      label: 'Promotion',
      id: 'promotionCode',
      fieldName: 'promotion',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      data: listOptions?.promotionOption || [],
      value: detailData?.promotionCode || '',
      hidden:
        (detailData?.voucherPrefixType &&
          Voucher.typeOfSNPrefixVoucher.cash.includes(
            String(detailData.voucherPrefixType)
          )) ||
        true,
    },
  ],
  [
    {
      label: 'Valid From',
      id: 'validFrom',
      fieldName: 'validFrom',
      classCustom: 'leftGroupField',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      required: true,
      value:
        (detailData?.validFrom &&
          covertStringToDate(
            detailData.validFrom,
            dateFormat.savingDateTime
          )) ||
        '',
    },
    {
      label: 'Valid To',
      id: 'validTo',
      fieldName: 'validTo',
      classCustom: 'rightGroupField',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      required: true,
      value:
        (detailData?.validTo &&
          covertStringToDate(detailData.validTo, dateFormat.savingDateTime)) ||
        '',
    },

    {
      label: 'Note',
      id: 'note',
      fieldName: 'note',
      classCustom: 'noteHeight',
      fieldType: FieldConstant.type.TEXT_AREA,
      className: FieldConstant.class.TEXT_AREA,
      noPlaceHolder: true,
      value: detailData?.note || 'Draft Voucher',
      maxLength: 40,
    },
  ],
  [
    {
      label: 'Applied On',
      id: 'applyOnDay',
      fieldName: 'applyOn',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      value:
        detailData?.applyOnDay?.map((data) =>
          Object.keys(EnumDate).find((key) => EnumDate[key] === data)
        ) || [],
    },
  ],
];

const buttonDate = [
  {
    label: 'Sun',
  },
  {
    label: 'Mon',
  },
  {
    label: 'Tue',
  },
  {
    label: 'Wed',
  },
  {
    label: 'Thu',
  },
  {
    label: 'Fri',
  },
  {
    label: 'Sat',
  },
];

export { fieldArray, buttonDate };
