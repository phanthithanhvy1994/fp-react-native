import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '../shared/buttons/button.component';
import { buttonConstant } from '../../util/constant';
import { useStyles } from './material-detail.style';
import NoImage from '../../assets/no-image.png';

function MaterialDetail(props) {
  const classes = useStyles();
  const { open, t, dataItem, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog className={classes.detailDialog} open={open} onClose={handleClose}>
      <DialogTitle id="customized-dialog-title" className="subtitle">
        {t('More Details')}
      </DialogTitle>
      {open && (
        <DialogContent dividers>
          <div className="divImage">
            <CardMedia
              component="img"
              src={dataItem.imgUrl}
              className={classes.image}
              onError={e => {
                e.target.src = NoImage;
              }}
            />
          </div>
          <div className={classes.divDetailInfo}>
            {dataItem.details.map((item, index) => (
              <Typography key={index} component="span">
                {t(`${item.label}`)}
                {`: ${item.value}`}
              </Typography>
            ))}
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          className={buttonConstant.type.PRIMARY}
          title="OK"
          isFontAwesome={false}
          handleClick={handleClose}
        ></Button>
      </DialogActions>
    </Dialog>
  );
}

MaterialDetail.propTypes = {
  open: PropTypes.bool,
  dataItem: PropTypes.any,
  onClose: PropTypes.func,
  t: PropTypes.any,
  imgUrl: PropTypes.any,
};

export default withTranslation()(MaterialDetail);
