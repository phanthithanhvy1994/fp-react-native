import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import './App.css';
import './style/core/subtitle/subtitle.scss';

import { Row, Col, Container } from 'react-bootstrap';
import Header from './components/core/header/header.component';
import Footer from './components/core/footer/footer.component';
import Register from './components/auth/register.component';
import Login from './components/login/Login';
import Welcome from './components/auth/Welcome.component';
import PrivateRoute from './components/auth/private-route.component';
import UserPrivateRoute from './components/auth/user-private-route.component';
import Dialog from './components/shared/message-dialog/message-dialog.component';
import RejectDialog from './components/shared/reject-dialog/reject-dialog.component';

// Auth
import ChangePassword from './components/auth/change-password.component';
import ResetPassword from './components/auth/reset-password.component';
import ConfirmResetPassword from './components/auth/confirm-reset-password.component';
import SuccessChangePassword from './components/auth/success-change-password.component';
// Others
import Home from './components/home/home.component';
import SideBar from './components/core/sidebar/sidebar.component';
import Complaint from './components/complaint/complaint.component';
// import Master from './components/master/master.component';
import MasterData from './components/master-data/master-data.component';
// User
import User from './components/user/user.component';
import UserAddEditComponent from './components/user/user-add-edit.component';
import UserRoleAdd from './components/user-role/user-role-add/UserRoleAdd';
import UserRoleEdit from './components/user-role/user-role-edit/UserRoleEdit';
import UserRoleList from './components/user-role/user-role-list/UserRoleList';

// Delivery Order
import DeliveryOrderList from './components/procurement/delivery-order/delivery-order-list.component';
import DeliveryOrderDetail from './components/procurement/delivery-order/delivery-order-detail/delivery-order-detail.component';

// Petty Cash
import PettyCashListHeadOffice from './components/procurement/petty-cash/petty-cash-list-head-office/petty-cash-list-head-office.component';
import PettyCashList from './components/procurement/petty-cash/petty-cash-list/petty-cash-list.conponent';
import PettyCashDetail from './components/procurement/petty-cash/petty-cash-detail/petty-cash-detail.component';
import PettyCashAdd from './components/procurement/petty-cash/petty-cash-add/petty-cash-add.component';
import PettyCashEdit from './components/procurement/petty-cash/petty-cash-edit/petty-cash-edit.component';

// Purchase Order
import PurchaseOrderList from './components/purchase-order/purchase-order-list.component';
import AddEditPurchaseOrder from './components/purchase-order/purchase-order-add-edit.component';

import ErrorPage from './components/shared/error-boundary/ErrorPage';
import CustomToastContainer from './components/shared/toast/toast.component';

// Inventory
import Stock from './components/inventory/stock/stock.component';
import GoodsReceiptList from './components/inventory/goods-receipt/list/goods-receipt-list.component';
import GoodsReceiptDetails from './components/inventory/goods-receipt/details/goods-receipt-details.component';
import StockCountList from './components/inventory/stock-count/list/stock-count-list.component';
import StockCountAddEdit from './components/inventory/stock-count/stock-count-add-edit.component';
import ScrapStockList from './components/inventory/scrap-stock/list/scrap-stock-list.component';
import ScrapStockAddEdit from './components/inventory/scrap-stock/add-edit/scrap-stock-add-edit.component';
import ReturnRequestList from './components/inventory/return-request/list/return-request-list.component';
import AddEditReturnRequest from './components/inventory/return-request/return-request-add-edit.component';
import ReturnRequestDetails from './components/inventory/return-request/details/return-request-details.component';
import AddEditGoodsIssues from './components/inventory/goods-issues/goods-issues-add-edit/goods-issues-add-edit.component';

// Goods Issues List
import GoodsIssuesList from './components/inventory/goods-issues/goods-issues-list/goods-issues-list.component';

// Material
import MaterialList from './components/material/material-list.component';

import LinearDeterminate from './components/core/linear-determinate/LinearDeterminate.component';

// Branch BOM Price
import BranchBOMPriceList from './components/catalog/branch-bom-price/branch-bom-price-list.component';
import BranchBOMPriceEdit from './components/catalog/branch-bom-price/branch-bom-price-edit/branch-bom-price-edit.component';
import BranchBOMPriceDetail from './components/catalog/branch-bom-price/branch-bom-price-detail/branch-bom-price-detail.component';

// Branch BOM Group
import BranchBOMGroupList from './components/catalog/branch-bom-group/branch-bom-group-list.component';
import BranchBOMGroupAddEdit from './components/catalog/branch-bom-group/branch-bom-group-add-edit/branch-bom-group-add-edit.component';
// import BranchBOMGroupEdit from './components/catalog/branch-bom-group/branch-bom-group-add-edit/branch-bom-group-edit.component';
// import branchBomGroupDetail from './components/catalog/branch-bom-group/branch-bom-group-detail/branch-bom-group-detail.component';

// Branch Boom
import BranchBomList from './components/branch-bom/branch-bom-list/branch-bom-list.component';
import BranchBomAddEdit from './components/branch-bom/branch-bom-add-edit/branch-bom-add-edit.component';

// Voucher
import DetailVoucher from './components/voucher/voucher-detail/voucher-detail.component';
import VoucherList from './components/voucher/voucher-list.component';
import VoucherActivation from './components/voucher/voucher-activation/voucher-activation.component';
import DetailSaleOrder from './components/voucher/sale-order/sale-order-detail.component';
import PackVoucherDetail from './components/voucher/pack-voucher/pack-voucher-detail/pack-voucher-detail.component';
import ValuePackAdd from './components/voucher/value-pack-add/value-pack-add.component';
import ValuePackList from './components/voucher/pack-voucher/value-pack-list.component';

// Coupon
import CouponList from './components/coupon/list/coupon-list.component';
import CouponDetail from './components/coupon/detail/coupon-detail.component';
import ValuePackAllocation from './components/voucher/value-pack-allocation/value-pack-allocation.component';


import GoodsIssuesDetail from './components/inventory/goods-issues/goods-issues-detail/goods-issues-detail.component';

//End Of Day
import materialConsumption from './components/end-of-day/material-consumption/material-consumption.component';
import endDayRevenue from './components/end-of-day/end-day-revenue/end-day-revenue.component';

// Asset Transfer
import AssetTransfer from './components/asset-management/asset-transfer/asset-transfer-list.component';
import AssetTransferDetail from './components/asset-management/asset-transfer/asset-transfer-detail/asset-transfer-detail.component';

import AssetRequestList from './components/asset-management/asset-request/asset-request-list/asset-request-list.component';
import AssetRequestDetail from './components/asset-management/asset-request/asset-request-detail/asset-request-detail.component';
import AddEditAssetRequest from './components/asset-management/asset-request/asset-request-add-edit/asset-request-add-edit.component';

// Asset Transfer Tracking
import AssetTrackingDetail from './components/asset-management/asset-tracking/asset-tracking-detail/asset-tracking-detail.component';
//Asset Transfer Tracking List
import AssetTransferTrackingList from './components/asset-management/asset-tracking/asset-tracking-list/asset-tracking-list.component';
// ! lazy load sample

//Asset Receiving 
import AssetReceiptList from './components/asset-management/asset-receipt/asset-receipt-list/asset-receipt-list.component';
import AssetReceiptDetail from './components/asset-management/asset-receipt/asset-receipt-detail/asset-receipt-details.component';

// const RequestClosePromise = import(
//   './components/request/request-close.component'
// );
// const RequestClose = React.lazy(() => RequestClosePromise);

// );
// const RequestClose = React.lazy(() => RequestClosePromise);

class App extends Component {
  WaitingComponent = () => () => (
    <React.Suspense fallback={<div> Loading... </div>}>
      {/* <component {...props} /> */}
    </React.Suspense>
  );

  render() {
    const { location } = this.props;
    const isLoginPage = location.pathname === '/login';
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return (
      <ToastProvider placement='top-center' components={{ Toast: CustomToastContainer }}>
        <>
          <Header userInfo={userInfo} />
          <LinearDeterminate />
          <div className="header-margin"></div>
        </>
        <div className="main-body">
          {!isLoginPage && (
            <>
              <SideBar></SideBar>
            </>
          )}
          <div className="main-page">
            <Container fluid>
              <Row>
                <Col xs={12}>
                  <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute
                      path="/procurement/delivery-order"
                      exact
                      component={DeliveryOrderList}
                    />
                    <PrivateRoute
                      path="/procurement/delivery-order/detail/:id"
                      exact
                      component={DeliveryOrderDetail}
                    />

                    <PrivateRoute
                      path="/procurement/petty-cash-head-office"
                      exact
                      component={PettyCashListHeadOffice}
                    />
                    <PrivateRoute
                      path="/procurement/petty-cash-at-branch"
                      exact
                      component={PettyCashList}
                    />
                    <PrivateRoute
                      path="/procurement/petty-cash-at-branch/detail/:id"
                      exact
                      component={(props) => (
                        <PettyCashDetail isDetailsPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      path="/procurement/petty-cash-at-branch/create"
                      exact
                      component={PettyCashAdd}
                    />
                    <PrivateRoute
                      path="/procurement/petty-cash-at-branch/edit/:id"
                      exact
                      component={(props) => (
                        <PettyCashEdit isEditPage {...props} />
                      )}
                    />

                    <PrivateRoute
                      path="/complaint"
                      exact
                      component={Complaint}
                    />
                    <PrivateRoute
                      path="/master-data"
                      exact
                      component={MasterData}
                    />
                    <PrivateRoute path="/account/user-list" exact component={User} />
                    <PrivateRoute
                      exact
                      path="/account/user-list/create"
                      component={UserAddEditComponent} />
                    <PrivateRoute
                      exact
                      path="/account/user-list/edit/:id"
                      component={UserAddEditComponent} />
                    <PrivateRoute
                      exact
                      path="/account/user-list/detail/:id"
                      component={(props) => (
                        <UserAddEditComponent isDetailsPage {...props} /> )}
                    />
                    <PrivateRoute path="/error" exact component={ErrorPage} />
                    <PrivateRoute path="/404" exact component={ErrorPage} />
                    <PrivateRoute
                      path="/inventory/stock"
                      exact
                      component={Stock}
                    />
                    <PrivateRoute
                      exact
                      path="/user-role"
                      component={UserRoleList}
                    />
                    <PrivateRoute
                      exact
                      path="/user-role/create"
                      component={UserRoleAdd}
                    />
                    <PrivateRoute
                      exact
                      path="/user-role/edit/:id"
                      component={UserRoleEdit}
                    />
                    <UserPrivateRoute
                      path="/change-password"
                      component={ChangePassword}
                    />
                    <PrivateRoute
                      exact
                      path="/catalog/material"
                      component={MaterialList}
                    />

                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-group"
                      component={BranchBOMGroupList}
                    />
                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-group/Create-Branch-BOM-Group"
                      component={BranchBOMGroupAddEdit}
                    />
                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-group/Edit-Branch-BOM-Group/:id"
                      component={(props) => (
                        <BranchBOMGroupAddEdit isEditPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-group/View-Branch-BOM-Details/:id"
                      component={(props) => (
                        <BranchBOMGroupAddEdit isDetailPage {...props} />
                      )}
                    />

                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-price"
                      component={BranchBOMPriceList}
                    />
                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-price/edit/:id"
                      component={BranchBOMPriceEdit}
                    />
                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom-price/detail/:id"
                      component={BranchBOMPriceDetail}
                    />

                    <PrivateRoute
                      exact
                      path="/procurement/purchase-order"
                      component={PurchaseOrderList}
                    />
                    <PrivateRoute
                      exact
                      path="/end-of-day/stock-count"
                      component={StockCountList}
                    />
                    <PrivateRoute
                      exact
                      path="/end-of-day/stock-count/create"
                      component={StockCountAddEdit}
                    />
                    <PrivateRoute
                      exact
                      path="/end-of-day/stock-count/edit/:id"
                      component={StockCountAddEdit}
                    />
                    <PrivateRoute
                      exact
                      path="/end-of-day/stock-count/detail/:id"
                      component={(props) => (
                        <StockCountAddEdit isDetailsPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/procurement/purchase-order/edit/:id"
                      component={AddEditPurchaseOrder}
                    />
                    <PrivateRoute
                      exact
                      path="/procurement/purchase-order/detail/:id"
                      component={(props) => (
                        <AddEditPurchaseOrder isDetailsPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/procurement/purchase-order/create"
                      component={AddEditPurchaseOrder}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/goods-receipt"
                      component={GoodsReceiptList}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/goods-receipt/detail/:id"
                      component={GoodsReceiptDetails}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/scrap-stock"
                      component={ScrapStockList}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/scrap-stock/create"
                      component={ScrapStockAddEdit}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/scrap-stock/edit/:id"
                      component={(props) => (
                        <ScrapStockAddEdit isEditPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/scrap-stock/detail/:id"
                      component={(props) => (
                        <ScrapStockAddEdit isDetailPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/return-request"
                      component={ReturnRequestList}
                    />
                    <PrivateRoute
                      path="/inventory/return-request/create"
                      component={AddEditReturnRequest}
                    />
                    <PrivateRoute
                      path="/inventory/return-request/edit/:id"
                      component={(props) => (
                        <AddEditReturnRequest isEditPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/return-request/detail/:id"
                      component={ReturnRequestDetails}
                    />
                    {/* Goods Issues List */}
                    <PrivateRoute
                      exact
                      path="/inventory/goods-issues"
                      component={GoodsIssuesList}
                    />

                    <PrivateRoute
                      path="/inventory/goods-issues/create"
                      component={AddEditGoodsIssues}
                    />
                    <PrivateRoute
                      path="/inventory/goods-issues/edit/:id"
                      component={(props) => (
                        <AddEditGoodsIssues isEditPage {...props} />
                      )}
                    />

                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom"
                      component={BranchBomList}
                    />

                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom/create"
                      component={BranchBomAddEdit}
                    />

                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom/edit/:id"
                      component={BranchBomAddEdit}
                    />

                    <PrivateRoute
                      exact
                      path="/catalog/branch-bom/detail/:id"
                      component={(props) => (
                        <BranchBomAddEdit isDetailPage {...props} />
                      )}
                    />

                    {/* voucher */}
                    <PrivateRoute
                      exact
                      path="/voucher-management/voucher-list"
                      component={VoucherList}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/voucher-list/detail/:id"
                      component={(props) => (
                        <DetailVoucher isDetailsPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/value-pack-list/allocation"
                      component={ValuePackAllocation}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/voucher-list/activation"
                      component={VoucherActivation}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/voucher-list/activation/:saleOrderNo"
                      component={VoucherActivation}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/voucher-list/sale-order-detail/:id"
                      component={(props) => (
                        <DetailSaleOrder isDetailsPage {...props} />
                      )}
                    />

                    <PrivateRoute
                      exact
                      path="/voucher-management/value-pack-list/value-pack-detail/:id"
                      component={(props) => (
                        <PackVoucherDetail isDetailsPage {...props} />
                      )}
                    />
                    {/* coupon */}
                    <PrivateRoute
                      exact
                      path="/coupon-management/coupon-list"
                      component={CouponList}
                    />
                    <PrivateRoute
                      exact
                      path="/coupon-management/coupon-list/detail/:id"
                      component={(props) => (
                        <CouponDetail isDetailsPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/inventory/goods-issues/detail/:id"
                      component={(props) => (
                        <GoodsIssuesDetail isDetailsPage {...props} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/value-pack-list"
                      component={ValuePackList}
                    />
                    <PrivateRoute
                      exact
                      path="/voucher-management/value-pack-list/create-new-value-pack"
                      component={ValuePackAdd}
                    />

                    {/* End Of Day */}
                    <PrivateRoute
                      exact
                      path="/end-of-day/material-consumption"
                      component={materialConsumption}
                    />

                    <PrivateRoute
                      exact
                      path="/end-of-day/end-day-revenue"
                      component={endDayRevenue}
                    />

                    {/* Asset Transfer */}
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-transfer"
                      component={AssetTransfer}
                    />
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-transfer/view-asset-transfer-details/:id"
                      component={(props) => (
                        <AssetTransferDetail isDetailsPage {...props} />
                      )}
                    />

                    {/* Asset Transfer Tracing */}
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-transfer-tracking"
                      component={AssetTransferTrackingList}
                    />
                    {/* Asset Receiving */}
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-receiving"
                      component={AssetReceiptList}
                    />

                    <PrivateRoute
                      exact
                      path="/asset-management/asset-receiving/detail/:id"
                      component={AssetReceiptDetail}
                    />


                    {/* Asset Request */}
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-request"
                      component={AssetRequestList}
                    />
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-request/view-asset-request-details/:id"
                      component={(props) => (
                        <AssetRequestDetail isDetailsPage {...props} />
                      )}
                    />

                    <PrivateRoute
                      path="/asset-management/asset-request/create"
                      component={AddEditAssetRequest}
                    />
                    <PrivateRoute
                      path="/asset-management/asset-request/edit/:id"
                      component={(props) => (
                        <AddEditAssetRequest isEditPage {...props} />
                      )}
                    />

                    {/* Asset Transfer Tracking */}
                    <PrivateRoute
                      exact
                      path="/asset-management/asset-tracking/detail/:id"
                      component={(props) => (
                        <AssetTrackingDetail isDetailsPage {...props} />
                      )}
                    />

                    <UserPrivateRoute path="/login" component={Login} />
                    <UserPrivateRoute path="/register" component={Register} />
                    <UserPrivateRoute path="/welcome" component={Welcome} />
                    <UserPrivateRoute
                      path="/reset-password"
                      component={ResetPassword}
                    />
                    <UserPrivateRoute
                      path="/confirm-reset-password"
                      component={ConfirmResetPassword}
                    />
                    <UserPrivateRoute
                      path="/success-change-password"
                      component={SuccessChangePassword}
                    />
                    {/* Always at last */}
                    <PrivateRoute path="*" component={ErrorPage} />
                  </Switch>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <Footer></Footer>
        <Dialog />
        <RejectDialog />
      </ToastProvider>
    );
  }
}

App.propTypes = {
  location: PropTypes.any,
};

export default withRouter(App);
