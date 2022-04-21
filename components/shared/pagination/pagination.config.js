import { makeStyles } from '@material-ui/core/styles';

const rowsPerPageOptions = [25, 50, 100];

const selectPageField = [
  {
    id: 'pageNumber',
    fieldName: 'pageNumber',
    fieldType: 'select',
    required: false,
    data: [
      {
        display: 'Ten',
        value: 10,
      },
      {
        display: 'Twenty',
        value: 20,
      },
    ],

    className: 'fldSelect',
    classCustom: 'fldSelectPaging',
  },
];

const pagingStyle = makeStyles(() => ({
  root: {
    flexShrink: 0,
    marginLeft: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  pagingButton: {
    borderRadius: 2,
    padding: 5,
    width: '33px',
    height: '32px',
    backgroundColor: '#F5F5F5 !important',
    margin: '0 4px 0 4px',
    color: 'black',
    fontSize: 'inherit',
  },
}));

export { rowsPerPageOptions, selectPageField, pagingStyle };
