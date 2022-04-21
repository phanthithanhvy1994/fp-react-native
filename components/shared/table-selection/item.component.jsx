import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NoImage from '../../../assets/no-image.png';
import { FieldConstant } from '../../../constants/constants';
import { defaultColors } from '../../../style/const/style-const';

const styles = (theme) => ({
  btnGroup: {
    '& > *': {
      marginLeft: theme.spacing(1),
      float: 'right',
    },
  },
  card: {
    boxShadow: 'none',
    margin: '15px 0 15px 0',
  },
  image: {
    height: 120,
    marginBottom: 8,
  },
  item: {
    padding: 0,
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  customField: {
    display: 'flex',
    flexDirection: 'row',
    '& span': {
      transform: 'translateY(25%)',
    },
  },
  btnAction: {
    width: '100%',
  },
  typo: {
    '&:first-child': {
      fontWeight: 'bold',
    },
  },
  secondary: {
    color: defaultColors.secondary,
  },
  checkIcon: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    fontSize: '26.67px',
    color: defaultColors.secondary,
  },
  actionArea: {
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  focusHighlight: {},
});
class Item extends React.Component {
  constructor(props) {
    super(props);
    let configNegativeNum;
    if (props.dataItem.isNegativeNum) {
      configNegativeNum = {
        maximumValue: 999999999,
        minimumValue: -Math.abs(props.dataItem.totalQty),
        numberDecimalCharacter: 0,
      };
    }
    this.state = {
      rowData: props.dataItem,
      quantityField: {
        label: '',
        id: 'quantity',
        fieldName: 'quantity',
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        ...configNegativeNum,
      },
    };
  }

  getQuantity = (rowData, quantityValue) => {
    let quantity;
    if (quantityValue !== undefined) {
      quantity = quantityValue;
    } else {
      quantity = rowData.quantity;
    }
    const { dataDetailsOnGrid } = this.props;
    if (dataDetailsOnGrid && dataDetailsOnGrid.data && quantity === undefined) {
      const itemIndex = dataDetailsOnGrid.data.findIndex(
        (el) => el.sku === rowData.sku && el.entity === rowData.entity
      );
      if (itemIndex !== -1) {
        quantity = dataDetailsOnGrid.data[itemIndex].quantity;
      }
    }
    return quantity || 0;
  };

  render() {
    const {
      classes,
      dataItem,
      onClick,
      addItemsSelections,
      updateAddItemsSelectionsForDetailForm,
    } = this.props;
    const { common, information } = dataItem;
    const hasCheckIcon =
      addItemsSelections &&
      addItemsSelections.findIndex(
        (el) => el.sku === dataItem.sku && el.entity === dataItem.entity
      ) !== -1;

    if (updateAddItemsSelectionsForDetailForm) {
      updateAddItemsSelectionsForDetailForm(addItemsSelections || []);
    }

    if (dataItem.sku !== this.state.rowData.sku) {
      this.setState({
        rowData: dataItem,
        quantityField: {
          ...this.state.quantityField,
          value: this.getQuantity(dataItem) || 0,
        },
      });
    }

    return (
      <Card
        className={classes.card}
        onClick={onClick && ((e) => onClick(dataItem, e))}
      >
        <CardActionArea
          classes={{
            root: classes.actionArea,
            focusHighlight: classes.focusHighlight,
          }}
        >
          <div className="divImage">
            {hasCheckIcon && <CheckCircleIcon className={classes.checkIcon} />}
            <CardMedia
              component="img"
              src={common.imgUrl}
              className={classes.image}
              onError={(e) => {
                e.target.src = NoImage;
              }}
            />
          </div>
          <CardContent className={classes.item}>
            {information.map((item, index) => (
              <Typography
                key={index}
                component="p"
                className={`${classes.typo} ${
                  item.color ? classes[item.color] : ''
                }`}
              >{`${item.label} ${item.value}`}</Typography>
            ))}
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

Item.propTypes = {
  classes: PropTypes.any,
  dataItem: PropTypes.object,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  hasAddAction: PropTypes.any,
  hasQuantityField: PropTypes.any,
  addItemsSelections: PropTypes.any,
  dataDetailsOnGrid: PropTypes.any,
  updateAddItemsSelectionsForDetailForm: PropTypes.func,
  addItemHandler: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    addItemsSelections: state.detailFormStore.addItemsSelections,
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(Item));
