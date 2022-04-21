const menuItems = [
  {
    name: 'Dashboard',
    url: '/',
    icon: 'dashboard',
    class: 'menuItemsParent',
  },
  {
    name: 'Procurement',
    url: '',
    icon: 'procurement',
    class: 'menuItemsParent',
    category: 'Products',
    children: [
      {
        name: 'Delivery Order',
        url: '/procurement/delivery-order',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Purchase Order',
        url: '/procurement/purchase-order',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Petty Cash (Head Office) ',
        url: '/procurement/petty-cash-head-office',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Petty Cash (At Branch) ',
        url: '/procurement/petty-cash-at-branch',
        icon: '',
        class: 'menuItemsChildren',
      },
    ],
  },
  {
    name: 'Catalog Management',
    url: '',
    icon: 'catalog',
    class: 'menuItemsParent',
    children: [
      {
        name: 'Material',
        url: '/catalog/material',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Branch BOM',
        url: '/catalog/branch-bom',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Branch BOM Group',
        url: '/catalog/branch-bom-group',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Branch BOM Price',
        url: '/catalog/branch-bom-price',
        icon: '',
        class: 'menuItemsChildren',
      },
    ],
  },
  {
    name: 'Inventory',
    url: '',
    icon: 'inventory',
    class: 'menuItemsParent',
    children: [
      {
        name: 'Stock',
        url: '/inventory/stock',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Goods Receipt',
        url: '/inventory/goods-receipt',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Return Request',
        url: '/inventory/return-request',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Scrap Stock List',
        url: '/inventory/scrap-stock',
        icon: '',
        class: 'menuItemsChildren',
      },
      // Good Issues List
      {
        name: 'Goods Issues',
        url: '/inventory/goods-issues',
        icon: '',
        class: 'menuItemsChildren',
      },
    ],
  },
  {
    name: 'Voucher Management',
    url: '/voucher-management/voucher-list',
    icon: 'voucher-and-sales',
    class: 'menuItemsParent',
    children: [
      {
        name: 'Voucher',
        url: '/voucher-management/voucher-list',
        icon: '',
        class: 'menuItemsChildren',
      },
      // TODO: Revert at phase 2
      // {
      //   name: 'Value Pack',
      //   url: '/voucher-management/value-pack-list',
      //   icon: '',
      //   class: 'menuItemsChildren',
      // },
    ],
  },
  {
    name: 'Coupon Management',
    url: '/coupon-management/coupon-list',
    icon: 'coupon',
    class: 'menuItemsParent',
  },

  {
    name: 'End of Day',
    url: '',
    icon: 'end-of-day',
    class: 'menuItemsParent',
    children: [
      {
        name: 'Material Consumption',
        url: '/end-of-day/material-consumption',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Stock Count',
        url: '/end-of-day/stock-count',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'End Day Revenue',
        url: '/end-of-day/end-day-revenue',
        icon: '',
        class: 'menuItemsChildren',
      },
    ],
  },
  {
    name: 'Asset Management',
    url: '',
    icon: 'asset-transfer',
    class: 'menuItemsParent',
    children: [
      {
        name: 'Asset Transfer',
        url: '/asset-management/asset-transfer',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Asset Transfer Tracking',
        url: '/asset-management/asset-transfer-tracking',
        icon: '',
        class: 'menuItemsChildren',
      },
      {
        name: 'Asset Request',
        url: '/asset-management/asset-request',
        icon: '',
        class: 'menuItemsChildren',
      },

      {
        name: 'Asset Receiving Management',
        url: '/asset-management/asset-receiving',
        icon: '',
        class: 'menuItemsChildren',
      },

      
    ]
  },
  {
    name: 'Manage Complaint',
    url: '#',
    icon: 'manage-complaint',
    class: 'menuItemsParent',
  },

  {
    name: 'User',
    url: '/account/user-list',
    icon: 'user',
    class: 'menuItemsParent',
    category: 'People',
  },
  {
    name: 'User Role',
    url: '#',
    icon: 'user-role',
    class: 'menuItemsParent',
  },
  {
    name: 'Master Data',
    url: '/master-data',
    icon: 'user-role',
    class: 'menuItemsParent',
  },
];
export default menuItems;
