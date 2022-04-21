import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';

import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useStyles from './file-upload.style';
import { Message } from '../../../constants/messages';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';

import Button from '../buttons/button.component';
import upload from '../../../assets/upload.png';
import noImg from '../../../assets/noImg.svg';

import { ConfigUploadFile } from '../../../constants/constants';
import { dialogConstant, buttonConstant } from '../../../util/constant';

function ArrowLeft({ currentSlide, slideCount, ...otherProps }) {
  return (
    <button {...otherProps} className={'arrowBtn'} type="button">
      <ChevronLeftIcon />
    </button>
  );
}

function ArrowRight({ currentSlide, slideCount, ...otherProps }) {
  return (
    <button {...otherProps} className={'arrowBtn'} type="button">
      <ChevronRightIcon />
    </button>
  );
}

export default function FileUpload(props) {
  const { disableUpload, imgArr, hideLabel } = props.configUpload.config;
  const { fieldName, value } = props.configUpload;
  const { maxSize, acceptFile, defaultValue, maxUpload } = ConfigUploadFile;
  const [fileNames, setFileNames] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [fileSelect, setFileSelect] = useState('');
  const { t } = useTranslation();

  const maxValue = props.configUpload.config.maxValue || defaultValue;
  const classes = useStyles();

  ArrowLeft.propTypes = {
    currentSlide: PropTypes.any,
    slideCount: PropTypes.any,
    style: PropTypes.any,
  };

  ArrowRight.propTypes = {
    currentSlide: PropTypes.any,
    slideCount: PropTypes.any,
    style: PropTypes.any,
  };

  const settings = {
    className: 'slider',
    variableWidth: true,
    adaptiveHeight: true,
    dots: false,
    infinite: false,
    slidesToShow: maxValue,
    slidesToScroll: maxValue,
    arrows: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
  };

  useEffect(() => {
    if (fileNames && fileNames.length) {
      if (fileNames[0].isDeletedLastItem) {
        setFileNames([]);
        if (typeof props.onChange === 'function') {
          props.onChange({
            target: {
              value: [],
              name: fieldName,
            },
          });
        }
      } else {
        if (typeof props.onChange === 'function') {
          props.onChange({
            target: {
              value: fileNames,
              name: fieldName,
            },
          });
        }
      }
    } else if (value && value.length) {
      setFileNames(value);
    }
  }, [fileNames]);

  useEffect(() => {
    if (!_.isEqual(value, fileNames)) {
      setFileNames(value);
    }
  }, [value]);

  const dropzoneRef = React.createRef();
  const openSelectFile = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const handleShowMessage = (message) => {
    openDialog({
      title: Message.INFORMATION,
      content: message,
      actions: [
        {
          name: t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const handleDrop = (acceptedFiles) => {
    let checkSize = false;
    let overSizeArr = [];
    const checkFile = fileNames.length + acceptedFiles.length <= maxUpload;
    acceptedFiles.forEach((item) => {
      checkSize = item.size > maxSize;
      if (checkSize) {
        handleShowMessage(Message.UPLOAD_FILE.FILE_SIZE);
        return;
      }
    });
    overSizeArr = acceptedFiles.filter((item) => item.size > maxSize);
    checkSize = overSizeArr.length > 0;

    if (acceptedFiles.length === 0) {
      handleShowMessage(Message.UPLOAD_FILE.FILE_TYPE);
      return;
    }
    if (checkFile && !checkSize) {
      setFileNames(
        fileNames.concat(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        )
      );
    }
  };

  const removeItem = (index) => {
    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    if (!newFileNames.length) {
      newFileNames[0] = { isDeletedLastItem: true };
    }
    setFileNames(newFileNames);
  };

  const handleClose = () => {
    setOpen(!isOpen);
  };

  const showModal = (item) => {
    // Show popup Img
    setOpen(!isOpen);
    const cloneItem = { src: item.preview };
    setFileSelect(cloneItem);
  };

  const renderImg = () => {
    const array = [];
    // Loop to get amount field per row
    let noOfRow;

    if (disableUpload) {
      noOfRow = maxValue - imgArr.length;
      imgArr.forEach((item) => {
        array.push({
          className: `${classes.img} attached-images-img`,
          src: item.preview,
          onClick: () => showModal(item),
        });
      });
    } else {
      noOfRow = maxValue - fileNames.length;

      fileNames.forEach((item) => {
        array.push({
          className: `${classes.img} attached-images-img`,
          src: item.preview,
          isDelete: true,
          onClick: () => showModal(item),
        });
      });
    }

    for (let i = 1; i <= noOfRow; i += 1) {
      array.push({ className: classes.noImg, src: noImg, alt: '' });
    }
    // Return Img Fld
    return array.map((item, i) => (
      <div className={`${classes.divCls} attached-images-div-cls`} key={i}>
        {item.isDelete && (
          <Button icon={<DeleteIcon />} handleClick={() => removeItem(i)} />
        )}
        <img
          className={item.className}
          key={i}
          src={item.src}
          alt={item.alt}
          onClick={item.onClick}
        />
      </div>
    ));
  };

  return (
    <div className={classes.container}>
      <div className="attached-images-label">
        {!hideLabel && (
          <Typography className={classes.title}>
            {t('Attached Images')}:
          </Typography>
        )}
      </div>
      <div className={`${classes.divImg} attached-images-area`}>
        <Slider {...settings}>{renderImg()}</Slider>
      </div>
      {!disableUpload ? (
        <div className={classes.dropZone}>
          <Dropzone
            ref={dropzoneRef}
            onDrop={handleDrop}
            accept={acceptFile}
            multiple={true}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button iconImg={upload} onClick={openSelectFile} />
              </div>
            )}
          </Dropzone>
        </div>
      ) : (
        ''
      )}

      <Dialog open={isOpen} onClose={handleClose}>
        <img src={fileSelect.src} alt={fileSelect.alt} />
      </Dialog>
    </div>
  );
}

FileUpload.propTypes = {
  configUpload: PropTypes.any,
  onChange: PropTypes.func,
};
