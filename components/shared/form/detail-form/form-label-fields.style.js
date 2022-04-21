const useStyles = {
  root: {
    width: 'inherit',
    '& > div': {
      justifyContent: 'center',
      '& > div': {
        margin: '0 0 4px 0',
      },
    },
    '& .attached-images-label': {
      width: '150px',
      height: '60px',
      backgroundColor: 'rgba(253, 121, 3, 0.08)',
      marginRight: '4px',
      display: 'flex',
      alignItems: 'center',
      '& p': {
        paddingLeft: '8px',
        fontSize: '12px',
      },
    },
    '& .attached-images-area': {
      width: 'calc(100% - 150px)',
      height: '60px',
      backgroundColor: 'rgba(13, 148, 153, 0.16)',
      '& div.slick-slide': {
        width: '44px',
        height: '44px',
        backgroundColor: '#F9F9F9',
        '& > div': { width: '44px' },
        '& div.attached-images-div-cls': {
          width: '44px',
          height: '44px',
          '& .attached-images-img': {
            width: '44px',
            height: '44px',
          },
        },
      },
      display: 'flex',
      alignItems: 'center',
      paddingRight: '24px',
    },
  },
  formAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

export default useStyles;
