import { makeStyles } from '@material-ui/core/styles';

import { defaultColors } from '../../const/style-const';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '16px',
    marginBottom: '16px',
    '& .MuiBreadcrumbs-li': {
      cursor: 'pointer',
      '& a': {
        color: defaultColors.primary,
      },
      '& p': {
        color: defaultColors.neutralContent,
      },
    },
    '& .MuiBreadcrumbs-separator svg': {
      fill: defaultColors.neutralContent,
    },
  },
  nav: {
    height: '19px',
    lineHeight: '18.75px',
    ol: {
      height: '19px'
    }
  }
}));

export default useStyles;
