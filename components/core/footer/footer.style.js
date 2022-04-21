import { defaultColors } from '../../../style/const/style-const';

const useStyles = () => ({
  footer: {
    backgroundColor: defaultColors.uploadBtn,
    height: 28,
    textAlign: 'center',
    fontSize: 12,
    color: defaultColors.neutralContent,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 0,
    '& .title-footer': {
      lineHeight: '28px',
    },
  },
});

export default useStyles;
