import { dateFormat, EnumDate, FieldConstant, Voucher } from '../../../constants/constants';
import { covertStringToDate } from '../../../util/date-util';

const fieldArray = (detailData, type, listOptions) => 
{
  const voucherValueTypeList = (type === Voucher.physVoucher ? listOptions?.pVoucherValueTypeOption : listOptions?.eVoucherValueTypeOption) || [];
  const typeOfSerialPrefixList = (type === Voucher.physVoucher ? listOptions?.pVoucherTypeOfSNPrefixOption : listOptions?.eVoucherTypeOfSNPrefixOption) || [];

  let voucherValueType = detailData?.voucherValueType;
  let typeOfSerialPrefix = detailData?.voucherPrefixType;

  const isExistVoucherValueType = voucherValueTypeList.findIndex(
    (item) => (item?.value === voucherValueType)
  );
  const isExistTypeOfSerialPrefix = typeOfSerialPrefixList.findIndex(
    (item) => (+item?.value === typeOfSerialPrefix)
  );

  if (isExistVoucherValueType === -1) {
    voucherValueType = '';
  }
  if (isExistTypeOfSerialPrefix === -1) {
    typeOfSerialPrefix = '';
  }

  return [
    [
      {
        label: 'Type',
        id: 'voucherType',
        fieldName: 'type',
        classCustom: 'radioFieldCls',
        fieldType: FieldConstant.type.RADIO,
        className: FieldConstant.class.RADIO,
        required: true,
        data: [
          { value: 'P', name: 'Physical Voucher' },
          { value: 'E', name: 'E - Voucher' },
        ],
        value: type || '',
      },
    ],
    [
      {
        label: 'Voucher Name',
        id: 'voucherName',
        fieldName: 'name',
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        required: true,
        data: [],
        value: detailData?.voucherName || '',
        maxLength: 40
      },
    ],
    [
      {
        label: 'Total Voucher',
        id: 'totalVoucherQty',
        fieldName: 'total',
        classCustom: 'total-voucher-fld',
        fieldType: FieldConstant.type.QUANTITY,
        required: true,
        maximumValue: 999999999,
        minimumValue: 1,
        numberDecimalCharacter: 0,
        isOnFormField: true,
        value: detailData?.totalVoucherQty || 1,
      },
      {
        label: 'Number of Voucher/Booklet',
        id: 'qtyPerBooklet',
        fieldName: 'number',
        classCustom: 'num-of-voucher-fld',
        fieldType: FieldConstant.type.QUANTITY,
        required: true,
        maximumValue: 999999999,
        minimumValue: 1,
        numberDecimalCharacter: 0,
        isOnFormField: true,
        value: detailData?.qtyPerBooklet || 1,
      },
    ],
    [
      {
        label: 'Apply On',
        id: 'applyOnDay',
        fieldName: 'applyOn',
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        required: true,
        value: detailData?.applyOnDay?.map(data =>
          Object.keys(EnumDate).find(key => EnumDate[key] === data)
        ) || [],
      },
    ],
    [
      {
        label: 'YY',
        id: 'year1',
        fieldName: 'year1',
        fieldType: FieldConstant.type.TEXT,
        classParent: 'year-cls',
        className: FieldConstant.class.TEXT,
        value: detailData?.year || new Date().getFullYear().toString().substr(-2),
        disabled: true
      },
      {
        label: 'Type',
        id: 'voucherPrefixType',
        fieldName: 'refix_type',
        classCustom: 'fullWidth',
        fieldType: FieldConstant.type.SELECT,
        className: FieldConstant.class.SELECT,
        required: true,
        data: ((type === Voucher.physVoucher) ? listOptions?.pVoucherTypeOfSNPrefixOption : listOptions?.eVoucherTypeOfSNPrefixOption) || [],
        value: typeOfSerialPrefix
      },
    ],
    [
      {
        label: 'Serial No. Digits',
        id: 'voucherSerialNoDigit',
        fieldName: 'serialNo',
        classCustom: 'fullWidth no-digits-cls',
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
        classCustom: 'floatLeft issueWidth',
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
        value: detailData?.year || new Date().getFullYear().toString().substr(-2),
        disabled: true
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
        value: typeOfSerialPrefix
      },
    ],
    [
      {
        label: 'Company Code',
        id: 'companyCode',
        fieldName: 'companyCode',
        fieldType: FieldConstant.type.SELECT,
        className: FieldConstant.class.SELECT,
        required: true,
        match: true,
        value: detailData?.companyCode || (listOptions?.companyCodeOption && listOptions.companyCodeOption[0]?.value) || '',
        data:  listOptions?.companyCodeOption || [],
      },
      {
        label: 'Voucher Mat Desc',
        id: 'voucherValueType',
        fieldName: 'valueType',
        fieldType: FieldConstant.type.SELECT,
        className: FieldConstant.class.SELECT,
        required: true,
        value: voucherValueType,
        data: (type === Voucher.physVoucher ? listOptions?.pVoucherValueTypeOption : listOptions?.eVoucherValueTypeOption) || []
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
        hidden: (detailData?.voucherPrefixType && Voucher.typeOfSNPrefixVoucher.cash.includes(String(detailData.voucherPrefixType))) || true,
      },
      {
        label: 'Note',
        id: 'note',
        fieldName: 'note',
        classCustom: 'noteHeight',
        fieldType: FieldConstant.type.TEXT_AREA,
        className: FieldConstant.class.TEXT_AREA,
        noPlaceHolder: true,
        maxLength: 40,
        value: detailData?.note || 'Draft Voucher',
      },
    ],
    [
      {
        label: 'Total Voucher',
        id: 'totalVoucherQty',
        fieldName: 'total',
        classCustom: 'total-voucher-fld',
        fieldType: FieldConstant.type.QUANTITY,
        required: true,
        maximumValue: 999999999,
        minimumValue: 1,
        numberDecimalCharacter: 0,
        isOnFormField: true,
        hidden: (type === Voucher.physVoucher),
        value: detailData?.totalVoucherQty || 1,
      },
      {
        label: 'Valid From',
        id: 'validFrom',
        fieldName: 'validFrom',
        classCustom: 'valid-from-date',
        fieldType: FieldConstant.type.PICKER,
        className: FieldConstant.class.PICKER,
        required: true,
        hidden: (type !== Voucher.physVoucher && detailData?.otherPlatform) || (type === Voucher.physVoucher),
        value: (detailData?.validFrom && covertStringToDate(detailData.validFrom, dateFormat.savingDateTime)) || '',
      },
      {
        label: 'Valid To',
        id: 'validTo',
        fieldName: 'validTo',
        classCustom: 'valid-to-date',
        fieldType: FieldConstant.type.PICKER,
        className: FieldConstant.class.PICKER,
        required: true,
        hidden: (type !== Voucher.physVoucher && detailData?.otherPlatform) || (type === Voucher.physVoucher),
        value: (detailData?.validTo && covertStringToDate(detailData.validTo, dateFormat.savingDateTime)) || '',
      },
      {
        label: 'Valid After',
        id: 'validAfter',
        fieldName: 'validAfter',
        classCustom: 'fullWidth',
        classParent: 'valid-from-date not-correct',
        fieldType: FieldConstant.type.NUMBER_DECIMAL,
        className: FieldConstant.class.NUMBER,
        required: true,
        minVal: 0,
        maxVal: 365,
        isDecimal: false,
        endAdornment: {
          icon: function customIcon() {
            return 'Days';
          },
          handleClick: () => {},
        },
        hidden:
          (type !== Voucher.physVoucher && !detailData?.otherPlatform) || (type === Voucher.physVoucher),
        value: (detailData?.validAfter !== undefined) ? detailData?.validAfter : '',
      },
      {
        label: 'Valid Duration',
        id: 'validDuration',
        fieldName: 'validDuration',
        classCustom: 'fullWidth',
        classParent: 'valid-to-date not-correct',
        fieldType: FieldConstant.type.NUMBER_DECIMAL,
        className: FieldConstant.class.NUMBER,
        required: true,
        minVal: 1,
        maxVal: 366,
        isDecimal: true,
        endAdornment: {
          icon: function customIcon() {
            return 'Days';
          },
          handleClick: () => {},
        },
        hidden:
          (type !== Voucher.physVoucher && !detailData?.otherPlatform) || (type === Voucher.physVoucher),
        value: detailData?.validDuration || '',
      },
      {
        label: 'Market Place',
        id: 'marketPlace',
        fieldName: 'market',
        classParent: 'market-place',
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        required: true,
        maxLength: 100,
        value: detailData?.marketPlace || '',
        hidden: (type === Voucher.physVoucher)
      },
      {
        label: 'Activation Method',
        id: 'otherPlatform',
        fieldName: 'activation',
        classCustom: 'styleActivation',
        fieldType: FieldConstant.type.RADIO,
        className: FieldConstant.class.RADIO,
        required: true,
        data: [
          { value: 1, name: 'Connect to other platform' },
          { value: 0, name: 'Not connect to other platform' },
        ],
        value: detailData?.otherPlatform || 0,
        hidden: (type === Voucher.physVoucher)
      },
    ],
  ];
};

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
