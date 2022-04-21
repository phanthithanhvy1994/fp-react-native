import { FieldConstant, CouponConstant, dateFormat, EnumDate } from '../../../constants/constants';
import {covertStringToDate} from '../../../util/date-util';

const fieldArray = (
  detailData,
  couponName,
  type,
  comboOptions,
  optionsRadio
) => [
  // Left Top Dialog
  [
    {
      label: 'Coupon Name',
      id: 'couponName',
      fieldName: 'name',
      classParent: `type-of-${type} full-width`,
      classCustom: 'full-width',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      value: detailData?.couponName || couponName || '',
    },
    {
      label: 'Type',
      id: 'couponType',
      fieldName: 'type',
      classParent: `type-of-${type} left-half-width`,
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      value:  detailData?.couponType || type,
      match: true,
      data: comboOptions?.typeCouponCombo || [],
    },
    {
      label: 'Company Code',
      id: 'companyCode',
      fieldName: 'companyCode',
      classParent: `type-of-${type} right-half-width`,
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      match: true,
      data: comboOptions?.companyCodeCombo || [],
      value: detailData?.companyCode || (comboOptions?.companyCodeCombo && comboOptions.companyCodeCombo[0]?.value) || '',
    }
  ],
  [
    {
      label: 'Serial Code Type',
      id: 'serialCodeType',
      fieldName: 'serialCodeType',
      classCustom: 'codeTypeLeaflet',
      fieldType: FieldConstant.type.RADIO,
      className: FieldConstant.class.RADIO,
      required: true,
      hidden: !(type === CouponConstant.typeCoupon.paperLeaflet),
      value: detailData?.serialCodeType || (optionsRadio?.serialCodeTypeCombo && optionsRadio.serialCodeTypeCombo[0]?.value) || '',
      data: optionsRadio?.serialCodeTypeCombo || [],
    },
    {
      label: 'Serial Code Type',
      id: 'serialCodeType',
      fieldName: 'serialCodeTypeElectronic',
      classCustom: 'codeTypeElectronic',
      fieldType: FieldConstant.type.RADIO,
      className: FieldConstant.class.RADIO,
      required: true,
      hidden: !(type === CouponConstant.typeCoupon.Electronic),
      value: detailData?.serialCodeType || (optionsRadio?.serialCodeTypeCombo && optionsRadio.serialCodeTypeCombo[0]?.value) || '',
      data: optionsRadio?.serialCodeTypeCombo || [],
    },
    {
      label: 'Serial Code Type',
      id: 'serialCodeType',
      classCustom: 'codeTypeReceipt',
      fieldName: 'serialCodeTypeReceipt',
      fieldType: FieldConstant.type.RADIO,
      className: FieldConstant.class.RADIO,
      required: true,
      hidden: !(type === CouponConstant.typeCoupon.paperReceipt),
      value: detailData?.serialCodeType || (optionsRadio?.serialCodeTypeCombo && optionsRadio.serialCodeTypeCombo[0]?.value) || '',
      data: optionsRadio?.serialCodeTypeCombo || [],
    },
    {
      label: 'Validate Date Type',
      id: 'validateDateType',
      fieldName: 'validateDateType',
      classCustom: 'validateDateType',
      fieldType: FieldConstant.type.RADIO,
      className: FieldConstant.class.RADIO,
      required: true,
      hidden: !(type === CouponConstant.typeCoupon.paperReceipt),
      value: (detailData?.validateDateType? String(detailData.validateDateType) : (optionsRadio?.validateDateTypeCombo && optionsRadio.validateDateTypeCombo[0]?.value)) || '',
      data: optionsRadio?.validateDateTypeCombo || [],
    },
    {
      label: 'Total Coupon',
      id: 'totalCouponQty',
      fieldName: 'totalCouponElectronic',
      classCustom: (type === CouponConstant.typeCoupon.paperReceipt) ? 'total-receipt' : 'total-electric',
      fieldType: FieldConstant.type.QUANTITY,
      required: true,
      minimumValue: 1,
      numberDecimalCharacter: 0,
      isOnFormField: true,
      value: detailData?.totalCouponQty || '',
      hidden: detailData?.serialCodeType ? (detailData.serialCodeType === CouponConstant.serialCodeType.fix || type === CouponConstant.typeCoupon.paperLeaflet) : true,
    },
  ], 
  // Right Top Dialog
  [
    {
      label: 'Coupon Mat Desc',
      id: 'couponMatDesc',
      fieldName: 'couponValueTypeLeaflet',
      classCustom: `type-of-${type} fullWidth`,
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      hidden: type !== CouponConstant.typeCoupon.paperLeaflet,
      value: detailData?.couponMatDesc || '',
      data: comboOptions?.couponValueTypeCombo || [],
    },
    {
      label: 'Coupon Value Type',
      id: 'couponValue',
      fieldName: 'couponValueType',
      classCustom: 'couponValueTypeRadio',
      fieldType: FieldConstant.type.RADIO,
      className: FieldConstant.class.RADIO,
      required: true,
      value: CouponConstant.couponValueType.amount,
      data: [
        {
          value: 'Amount',
          name: 'Amount',
          inputField: {
            id: 'amountValue',
            fieldName: 'amountValue',
            fieldType: FieldConstant.class.NUMBER,
            className: FieldConstant.class.RADIO,
            value: detailData?.couponValue || '',
            minVal: 1,
            isDecimal: true,
            autoComplete: 'off'
          },
        },
      ],
      hidden: type === CouponConstant.typeCoupon.paperLeaflet
    },
  ],
  [
    {
      label: 'Valid From',
      id: 'fromValidDate',
      fieldName: 'validFrom',
      classCustom: `type-of-${type} left-half-width`,
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      value: (detailData?.fromValidDate && covertStringToDate(detailData.fromValidDate, dateFormat.savingDateTime)) || '',
      required: true,
      hidden: detailData?.validateDateType ? 
        (detailData.validateDateType === +CouponConstant.validateDateType.determined) && (type === CouponConstant.typeCoupon.paperReceipt) : false,
      disabled: (type === CouponConstant.typeCoupon.paperLeaflet)
    },
    {
      label: 'Valid To',
      id: 'toValidDate',
      fieldName: 'validTo',
      classCustom: `type-of-${type} right-half-width`,
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      value: (detailData?.toValidDate && covertStringToDate(detailData.toValidDate, dateFormat.savingDateTime)) || '',
      required: true,
      hidden: detailData?.validateDateType ? 
        (detailData.validateDateType === +CouponConstant.validateDateType.determined) && (type === CouponConstant.typeCoupon.paperReceipt) : false,
      disabled: (type === CouponConstant.typeCoupon.paperLeaflet)
    },
    {
      label: 'Valid After',
      id: 'validAfter',
      fieldName: 'validAfter',
      classCustom: 'fullWidth',
      classParent: `type-of-${type} left-half-width small-end-adornment valid-after-cls`,
      fieldType: FieldConstant.type.NUMBER_DECIMAL,
      className: FieldConstant.class.NUMBER,
      required: true,
      minVal: 0,
      maxVal: 365,
      isDecimal: true,
      endAdornment: {
        icon: function customIcon() {
          return 'Days';
        },
        handleClick: () => {},
      },
      hidden: detailData?.validateDateType ? 
        !((detailData.validateDateType === +CouponConstant.validateDateType.determined) && (type === CouponConstant.typeCoupon.paperReceipt)) : true,
      value: (detailData?.validAfter !== undefined) ? detailData?.validAfter : '',
    },
    {
      label: 'Valid Duration',
      id: 'validDuration',
      fieldName: 'validDuration',
      classCustom: 'fullWidth',
      classParent: `type-of-${type} right-half-width small-end-adornment`,
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
      hidden: detailData?.validateDateType ? 
        !((detailData.validateDateType === +CouponConstant.validateDateType.determined) && (type === CouponConstant.typeCoupon.paperReceipt)) : true,
      value: detailData?.validDuration || '',
    },
    {
      label: 'Promotion',
      id: 'promotionCode',
      fieldName: 'promotion',
      classCustom: `type-of-${type} fullWidth`,
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      hidden: (type !== CouponConstant.typeCoupon.paperLeaflet) || (CouponConstant.product.includes(+detailData?.typeSystemRunning) ? false : true),
      data: comboOptions?.promotionCombo || [],
      value: detailData?.promotionCode || '',
    },
  ],

  // Left Bottom Dialog
  [
    {
      label: 'Applied On',
      id: 'appliedOnDay',
      fieldName: 'applyOn',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      value: detailData?.appliedOnDay?.map(data =>
        Object.keys(EnumDate).find(key => EnumDate[key] === data)
      )?.filter(date => date) || [],
    },
  ],
  [
    {
      label: 'Total Coupon',
      id: 'totalCouponQty',
      fieldName: 'totalCoupon',
      classCustom: 'totalCoupon',
      fieldType: FieldConstant.type.QUANTITY,
      required: true,
      minimumValue: 1,
      numberDecimalCharacter: 0,
      isOnFormField: true,
      value: detailData?.totalCouponQty || '',
      hidden: detailData.serialCodeType ? (detailData.serialCodeType === CouponConstant.serialCodeType.fix || type !== CouponConstant.typeCoupon.paperLeaflet) : true
    },
    {
      label: 'Number of Coupon/Booklet',
      id: 'qtyPerBooklet',
      fieldName: 'numberOfCoupon',
      classCustom: 'numOfCoupon',
      fieldType: FieldConstant.type.QUANTITY,
      required: true,
      minimumValue: 1,
      numberDecimalCharacter: 0,
      isOnFormField: true,
      value: detailData?.qtyPerBooklet || 1,
      hidden: (detailData && detailData.serialCodeType === CouponConstant.serialCodeType.fix) || (type !== CouponConstant.typeCoupon.paperLeaflet)
    },
  ],
  [ 
    {
      label: 'YY',
      id: 'yearPrefix',
      fieldName: 'yearPrefix',
      classParent: 'year-cls',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      value: new Date().getFullYear().toString().substr(-2),
      disabled: true
    },
    {
      label: 'Type',
      id: 'typeSystemRunning',
      fieldName: 'prefixType',
      classCustom: 'full-width',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      value: detailData?.typeSystemRunning || '',
      data: ((type === CouponConstant.typeCoupon.Electronic) ?
        comboOptions?.eCouponTypeOfSNPrefixOption
        : comboOptions?.pCouponTypeOfSNPrefixOption) || [],
    },
  ],
  [
    {
      label: 'Serial No. Digits',
      id: 'serialNoDigits',
      fieldName: 'serialNo',
      classCustom: 'full-width',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      data: comboOptions?.serialNoCombo || [],
      value: detailData?.serialNoDigits || '',
    },
    {
      label: 'Issued By',
      id: 'issuedBy',
      fieldName: 'issue',
      classCustom: 'half-width',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      value: detailData?.issuedBy || '',
      data: comboOptions?.issueCombo || [],
    },
    {
      label: 'YY',
      id: 'year',
      fieldName: 'yearYY',
      classCustom: 'full-width',
      classParent: 'year-cls',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      value: new Date().getFullYear().toString().substr(-2),
      disabled: true,
    },
    {
      label: 'Type',
      id: 'typeSystemRunning',
      fieldName: 'serialType',
      classCustom: 'full-width',
      classParent: 'serial-type',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      value: detailData?.typeSystemRunning || '',
      disabled: true,
    },
  ],

  // Right Bottom Dialog
  [
    {
      label: 'Promotion',
      id: 'promotionCode',
      fieldName: 'promotion',
      classCustom: `type-of-${type} fullWidth`,
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      hidden: (type === CouponConstant.typeCoupon.paperLeaflet) || (CouponConstant.product.includes(+detailData?.typeSystemRunning) ? false : true),
      data: comboOptions?.promotionCombo || [],
      value: detailData?.promotionCode || '',
    },
    {
      label: 'Note',
      id: 'note',
      fieldName: 'note',
      classCustom: `type-of-${type} noteCoupon`,
      fieldType: FieldConstant.type.TEXT_AREA,
      className: FieldConstant.class.TEXT_AREA,
      noPlaceHolder: true,
      value: detailData?.note || 'Draft Coupon',
    },
  ],

];

const fieldButton = [
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

export { fieldArray, fieldButton };
