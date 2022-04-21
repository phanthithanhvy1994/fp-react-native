import { cloneDeep } from 'lodash';
import { INITIAL_STATE } from '../initialState';
import { ActionType, DetailStateName } from '../../constants/constants';

/**
 * Update data inside fieldArray by fieldName
 * fieldArray is use in search form or detail form
 */
const updateFieldArrayState = (
  fieldArray,
  fieldName,
  property,
  updatedData,
  defaultValue = null,
  isKeptInitialValue = false
) => {
  const fieldIndex =
    fieldArray && fieldArray.findIndex((el) => el.fieldName === fieldName);
  const parts = property.split('.');
  const partObject = parts.length > 1 && parts.shift();
  const field =
    fieldIndex !== undefined
      ? fieldIndex !== -1 && partObject
        ? fieldArray[fieldIndex][partObject]
        : fieldArray[fieldIndex]
      : null;
  const updateFieldArray = cloneDeep(fieldArray);

  if (field) {
    field[parts] = updatedData;
    if (partObject) {
      updateFieldArray[fieldIndex][partObject] = field;
    } else {
      updateFieldArray[fieldIndex] = field;
    }
    // Set default value if any
    if (defaultValue && updateFieldArray[fieldIndex]) {
      const defaultVal = updatedData.find(
        (el) => el.value === defaultValue.value
      );
      updateFieldArray[fieldIndex].value =
        (defaultValue.isArray && [defaultVal]) ||
        (defaultVal && defaultVal.value);
      isKeptInitialValue && (updateFieldArray[fieldIndex].resetValue =
        (defaultValue.isArray && [defaultVal]) ||
        (defaultVal && defaultVal.value));
    }
  }

  return updateFieldArray;
};

const updateMultipleFieldArrayState = (fieldArray, detailsData) => {
  let updateFieldArray = fieldArray;

  detailsData.forEach((detail) => {
    updateFieldArray = updateFieldArrayState(
      updateFieldArray,
      detail.fieldName,
      detail.property,
      detail.updatedData,
      detail.defaultValue,
      detail.isKeptInitialValue
    );
  });

  return updateFieldArray;
};

// Clone data to update new data for state
const updateStateData = (state, data, fieldName) => {
  return {
    ...state,
    [fieldName]: data,
  };
};

// Reducer for detail form
export const detailFormReducer = (
  state = INITIAL_STATE.detailFormStore,
  action
) => {
  switch (action.type) {
    case ActionType.UPDATE_DETAIL_FIELD_ARRAY:
      return {
        ...state,
        fieldArray:
          (action.fieldName &&
            updateFieldArrayState(
              state.fieldArray,
              action.fieldName,
              action.property,
              action.updatedData,
              action.defaultValue
            )) ||
          state.fieldArray,
      };
    case ActionType.UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY:
      return {
        ...state,
        fieldArray:
          (action.detailsData &&
            updateMultipleFieldArrayState(
              state.fieldArray,
              action.detailsData
            )) ||
          state.fieldArray,
      };
    case ActionType.UPDATE_ALL_FIELD_ARRAY:
      return {
        ...state,
        fieldArray: action.fieldArray,
      };
    case ActionType.UPDATE_DATA_DETAILS_ON_GRID:
      return updateStateData(
        state,
        action.dataDetailsOnGrid,
        DetailStateName.dataDetailsOnGrid,
      );
    case ActionType.UPDATE_HISTORY_DATA:
      return updateStateData(
        state,
        action.history,
        DetailStateName.history,
      );

    case ActionType.UPDATE_COLUMNS_DETAIL:
      return updateStateData(
        state,
        action.columnsDetail,
        DetailStateName.columnsDetail,
      );
    case ActionType.UPDATE_ADD_ITEMS_SELECTIONS:
      return updateStateData(
        state,
        action.addItemsSelections,
        DetailStateName.addItemsSelections,
      );
    default:
      return { ...state };
  }
};

// Reducer for add items popup in detail page
export const addItemsFormReducer = (
  state = INITIAL_STATE.addItemsFormStore,
  action
) => {
  switch (action.type) {
    case ActionType.UPDATE_DETAIL_ADD_ITEMS_FIELD_ARRAY:
      return {
        ...state,
        fieldArray:
          (action.fieldName &&
            updateFieldArrayState(
              state.fieldArray || [],
              action.fieldName,
              action.property,
              action.updatedData,
              action.defaultValue
            )) ||
          state.fieldArray,
      };
    case ActionType.UPDATE_ALL_ADD_ITEMS_FIELD_ARRAY:
      return {
        ...state,
        fieldArray: action.fieldArray,
      };
    default:
      return { ...state };
  }
};

export const searchPopupReducer = (
  state = INITIAL_STATE.searchPopupStore,
  action
) => {
  switch (action.type) {
    case ActionType.UPDATE_OPEN_STATE_SEARCH_POPUP:
      return {
        openSearchPopup: action.openSearchPopup,
      };
    default:
      return { ...state };
  }
};
