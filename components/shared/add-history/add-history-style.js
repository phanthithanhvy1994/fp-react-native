import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  addHistory: {
    '& .add-history-time-line': {
      fontSize: 13,
      padding: '27px 0 0 0',
      maxHeight: 376,
      overflow: 'auto',
      '& svg': {
        height: 9,
        width: 9,
        fontsize: 9,
        borderRadius: 0,
        fill: defaultColors.primary,
        '& text': {
          display: 'none',
        },
      },
      '& .MuiStepLabel-root': {
        height: 9,
      },
      '& .MuiStepContent-root': {
        marginLeft: 4,
        marginTop: 'unset',
        paddingLeft: 12,
        paddingBottom: 16,
        '& .MuiCollapse-wrapper': {
          paddingTop: 9,
        },
      },
      '& .MuiStepConnector-root': {
        padding: 'unset',
        marginLeft: 4,
      },
    },
    '& .add-new-note-field': {
      width: '100%',
      height: 'fit-content',
      cursor: 'text',
      '& input': {
        height: 19,
        padding: '5px 10px',
        fontSize: 13,
      },
      '& fieldset': {
        padding: 'unset',
        borderRadius: 2,
        height: 28,
        marginTop: 5,
        '& legend': {
          display: 'none',
        },
      },
      '& .MuiOutlinedInput-root:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline': {
        borderColor: defaultColors.secondary,
      },
      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: defaultColors.primary,
      },
    },
    '& .add-new-note-button': {
      width: 19.5,
      height: 19.5,
      paddingRight: 4.5,
      '& svg': {
        fill: defaultColors.primary,
      },
    },
    '& .add-new-note-button:focus': {
      outline: 'none',
    },
  },
};

export default useStyles;
