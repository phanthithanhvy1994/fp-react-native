import { makeStyles } from '@material-ui/core/styles';

import { defaultColors } from '../../../style/const/style-const';

const useStyles = makeStyles(() => ({
  container: {
    display: 'inline-flex',
    float: 'left',
  },
  dropZone: {
    float: 'left',
    display: 'block',
    marginTop: 'auto',
    marginBottom: 'auto',
    '& > div': {
      marginLeft: 8,
      width: 36,
      height: 36,
    },
    '& button': {
      width: 36,
      height: 36,
      padding: 0,
      minWidth: 'unset',
      display: 'block',
      borderRadius: '50%',
      backgroundColor: defaultColors.uploadBtn,
      '&:focus': {
        outline: 'unset',
      },
    },
  },
  divImg: {
    '& .MuiButton-root': {
      position: 'absolute',
      width: 24,
      height: 24,
      padding: 0,
      minWidth: 'unset',
      borderRadius: 0,
      right: 0,
      '& span': {
        margin: 'unset',
      },
    },
    height: 80,
    '& .slick-slider.slider.slick-initialized': {
      display: 'flex ',
    },
    '& .slick-track': {
      maxWidth: 312,
      display: 'flex',
    },
    '& .slick-slide.slick-cloned .slick-slide.slick-active': {
      display: 'none',
    },
    '& .slick-list': {
      display: 'flex',
      height: 'unset !important',
      '& svg': {
        fill: defaultColors.error,
        width: 16,
        height: 16,
      },
      '& > div.slick-track': {
        width: '100% !important',
      },
    },
    '& .slick-initialized .slick-slide': {
      position: 'relative',
      margin: '8px 8px',
      width: 64,
      height: 64,
      backgroundColor: defaultColors.backgroundImg,
      borderRadius: 2,
      '& > div': { width: 64 },
    },

    '& .arrowBtn': {
      backgroundColor: 'unset',
      border: 'unset',
      padding: 0,
      '& > svg': {
        borderRadius: '50%',
        '&:focus': {
          background: defaultColors.neutralHover,
        },
        '&:hover': {
          outline: 'unset',
          background: defaultColors.neutralHover,
        },
      },
      '&:focus': {
        outline: 'unset',
      },
    },
  },
  divCls: {
    height: 64,
    width: 64,
    display: 'flex !important',
  },
  noImg: {
    margin: 'auto',
  },
  img: {
    height: 64,
    width: 64,
    borderRadius: 2,
  },
  title: {
    color: defaultColors.neutralContent,
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
}));

export default useStyles;
