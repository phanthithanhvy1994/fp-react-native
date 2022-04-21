import React from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import {
  SkipPrevious,
  SkipNext,
  ArrowLeft,
  ArrowRight,
} from '@material-ui/icons';
import map from 'lodash/map';

import {
  rowsPerPageOptions,
  selectPageField,
  pagingStyle,
} from './pagination.config';

import { withStyles } from '@material-ui/core';
import useStyle from './pagination.style';

function TablePaginationActions(props) {
  const classes = pagingStyle();
  const theme = useTheme();
  const { count = 0, rowsPerPage, onChangePage } = props;
  let { page } = props;
  page += 1;
  const totalPages = Math.ceil(count / rowsPerPage);
  const pages = map(new Array(totalPages), (value, i) => ({
    display: i + 1,
    value: i + 1,
  }));
  selectPageField[0].data = pages;
  selectPageField[0].value = page;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 1);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, totalPages);
  };

  const displayItemsOfPage = () => {
    let info = '';
    // case: last page
    if (page === totalPages) {
      info = `${1 + rowsPerPage * (page - 1)} - ${count} of ${count}`;
    } else {
      info = `${1 + rowsPerPage * (page - 1)} - ${
        rowsPerPage * page
      } of ${count}`;
    }
    return info;
  };
  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 1}
        aria-label="first page"
        className={classes.pagingButton}
      >
        {theme.direction === 'rtl' ? <SkipNext /> : <SkipPrevious />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 1}
        aria-label="previous page"
        className={classes.pagingButton}
      >
        {theme.direction === 'rtl' ? <ArrowRight /> : <ArrowLeft />}
      </IconButton>
      <span className="paging-info">{displayItemsOfPage()}</span>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= totalPages}
        aria-label="next page"
        className={classes.pagingButton}
      >
        {theme.direction === 'rtl' ? <ArrowLeft /> : <ArrowRight />}
      </IconButton>
      <IconButton
        className={classes.pagingButton}
        onClick={handleLastPageButtonClick}
        disabled={page >= totalPages}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <SkipPrevious /> : <SkipNext />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

class Pagination extends React.Component {
  render() {
    const {
      onChangePage,
      count,
      page,
      rowsPerPage,
      onChangeRowsPerPage,
      classes,
      rowsPerPageOptionsCustom
    } = this.props;

    return (
      <div className={`${classes.pagination} pagination`}>
        <Row>
          <Col md={12} lg={12}>
            <table className="pagination-group-item-table">
              <tbody>
                <tr>
                  <TablePagination
                    rowsPerPageOptions={rowsPerPageOptionsCustom || rowsPerPageOptions}
                    colSpan={3}
                    count={count}
                    rowsPerPage={+rowsPerPage}
                    page={page - 1}
                    SelectProps={{
                      native: true,
                    }}
                    onChangePage={(e, pageNumber) =>
                      onChangePage(e, pageNumber)
                    }
                    onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
                    ActionsComponent={TablePaginationActions}
                    className="right-pagination"
                  />
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    );
  }
}

Pagination.propTypes = {
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowsPerPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  classes: PropTypes.object,
  paging: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  rowsPerPageOptionsCustom: PropTypes.array,
};

export default withStyles(useStyle)(Pagination);
