import { defaultColors } from '../../../../style/const/style-const';

const useStyles = () => ({
  generalform :{
    '@media screen and (min-width: 240px) and (max-width: 1279px)': {
      '& .topform':{
        display: 'flex',
        flexDirection: 'column',
        '& >div':{
          width: '100%'
        }
      },
    },
    '@media screen and (min-width: 1280px) and (max-width: 1919px)': {
      '& .topform':{
        display: 'flex',
        justifyContent: 'space-between',
        '& >div':{
          width: '49%'
        }
      },
    },
  },
  addPettyCashForm:{
    '& .full-width': {
      width: '100%'
    },
    '& .half-width': {
      width: '50%'
    },
    '& .left-half-width': {
      width: '50%',
      paddingRight: '8px',
    },
    '& .right-half-width': {
      width: '50%',
      paddingLeft: '8px',
    },
    '& .branch':{
      width: '100%',
      '& > div:nth-child(1)':{
        width: '49%'
      }
    },
    '& .invoiceDate':{
      width: '49%'
    },
    '& .invoiceNo':{
      width: '49%'
    },
    '& .vendor-quater-width':{
      width: '24%',
      '& > div:nth-child(1)':{
        width: '100%'
      }
    },
    '& .vendor-half-width':{
      width: '49%',
      '& > div:nth-child(1)':{
        width: '100%'
      }
    },
    '& .vendor-full-width':{
      width: '100%',
      '& > div:nth-child(1)':{
        width: '100%'
      }
    },
    '& .btnRadio': {
      width: '100%',
      '& > label':{
        marginBottom: 0
      },
      '& .MuiFormControlLabel-label': {
        fontSize: '12px',
      },
      '& .Mui-checked': {
        color: defaultColors.secondary,
      },
    },
    '& .existedVendorName':{
      width: '50%',
      paddingLeft: 28,
      margin : 0,
      '& > label': {
        display: 'none'
      },
      '& > div': {
        height: 29
      },
    }
  },
  Radio: {
    fontSize: '12px',
    color: defaultColors.neutralContent,
    '&.Mui-focused': {
      color: 'rgba(0,0,0,0.54)',
    },
    '& span': {
      color: defaultColors.danger,
    },
  },
});
export default useStyles;
    