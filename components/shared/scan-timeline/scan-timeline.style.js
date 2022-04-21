import { defaultColors } from '../../../style/const/style-const';

const useStyles = {
  scanTimeLine: {
    '& .scan-time-line-container': {
      display: 'flex',
      flexDirection: 'row',
      maxWidth: '94.9vw',
      alignItems: 'center',
      '& .previous-time-line': {
        cursor: 'pointer',
        borderRadius: '50%',
        '&:focus': {
          background: defaultColors.neutralHover,
        },
        '&:hover': {
          background: defaultColors.neutralHover,
        },
      },
      '& .next-time-line': {
        cursor: 'pointer',
        borderRadius: '50%',
        '&:focus': {
          background: defaultColors.neutralHover,
        },
        '&:hover': {
          background: defaultColors.neutralHover,
        },
      },
      '& .scan-time-line-wrapper': {
        overflow: 'hidden',
        '& .scan-time-line': {
          '& svg': {
            height: 36,
            width: 36,
            fontSize: 36,
            borderRadius: 0,
            color: defaultColors.primary,
            '& text': {
              display: 'none',
            },
          },
          '& button': {
            outline: 'none',
            cursor: 'auto',
          },
          '& .MuiStep-horizontal': {
            minWidth: 252,
          },
          '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
            marginTop: 5,
          },
          '& .MuiStepConnector-root': {
            padding: 'unset',
            marginTop: 6,
            '& .MuiStepConnector-line.MuiStepConnector-lineHorizontal': {
              borderColor: defaultColors.borderColor,
            },
          },
          '& .time-label': {
            '& .MuiStepLabel-label': {
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 14,
              color: defaultColors.neutralContent,
              lineHeight: '16px',
            },
          },
          '& .content-label': {
            '& .MuiStepLabel-label': {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 13,
              marginTop: 5,
              color: defaultColors.neutralContent,
              lineHeight: '15px',
            },
          },
        },
      },
    },
  },
};

export default useStyles;
