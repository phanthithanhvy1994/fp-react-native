export const INITIAL_STATE = {
  messageDialogStore: {
    title: null,
    type: null,
    content: null,
    actions: [],
    isOpen: false,
    isTableLayout: false,
  },
  rejectDialogStore: {
    title: null,
    messageTitle: null,
    messageReason: null,
    actions: [],
    submitApiFn: null, // function which calls to API to handle for submitted data
    isOpen: false,
  },
  authStore: {
    user: null,
    isAuthenticated: false,
  },
  detailFormStore: {},
  addItemsFormStore: {},
  searchPopupStore: {
    openSearchPopup: false,
  },
  pageHeaderStore: {
    substractionValue: 86,
  },
};
