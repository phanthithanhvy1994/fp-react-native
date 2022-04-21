import { defaultColors } from '../../style/const/style-const';

const useStyles = {
  masterDataListCover: {
    marginTop: '114px',
    paddingBottom: '5px',
    '& .table-grid': {
      '& button': {
        '& svg': {
          '& path': {
            fill: defaultColors.neutralContent,
          },
        },
      },
    },
  },
};

export default useStyles;
