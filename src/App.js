import React, { useEffect } from 'react';
import 'styles/reset_202305.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/font.scss';
import 'styles/common_202305.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'styles/aggrid_custom.css';
import 'styles/table_custom.css';

import Home from 'components/base/Home';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Modals from 'components/modal';

import Login from 'components/base/Login';
import Logout from 'components/base/Logout';
import { logger } from 'util/com';
import ProtectedRoute from 'components/common/ProtectedRoute';

import NavigateCtr from 'components/common/NavigateCtr';
import UserManagement from 'components/user/UserManagement';
import UserManagement_Detail from 'components/user/UserManagement_Detail';

import FormManagement from 'components/form/FormManagement';

import PaymentManagement from 'components/payment/PaymentManagement';
import PaymentManagement_Refund from 'components/payment/PaymentManagement_Refund';

import CSCenterManagement from 'components/cscenter/CSCenterManagement';

//const Router = process.env.REACT_APP_SSR === '1' ? BrowserRouter : HashRouter;

export function App() {
  logger.render('App');
  useEffect(() => {
    logger.debug('mount App');
  }, []);
  return (
    <RecoilRoot>
      <BrowserRouter>
        <RecoilNexus />
        <NavigateCtr />
        <Routes>
          <Route
            path=""
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="user_management">
            <Route
              path=""
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="detail"
              element={
                <ProtectedRoute>
                  <UserManagement_Detail />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="payment_management">
            <Route
              path=""
              element={
                <ProtectedRoute>
                  <PaymentManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="refund"
              element={
                <ProtectedRoute>
                  <PaymentManagement_Refund />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="form_management"
            element={
              <ProtectedRoute>
                <FormManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="cscenter_management"
            element={
              <ProtectedRoute>
                <CSCenterManagement />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1>Not Found Page</h1>} />
          <Route path="empty" element={null} />
        </Routes>
        <Modals />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
