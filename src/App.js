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

import PaymentManagement from 'components/payment/PaymentManagement';

import CSCenterManagement from 'components/cscenter/CSCenterManagement';
import CSCenterManagement_FAQ from 'components/cscenter/CSCenterManagement_FAQ';
import CSCenterManagement_Manual from 'components/cscenter/CSCenterManagement_Manual';

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
          </Route>

          <Route path="cscenter_management">
            <Route
              path=""
              element={
                <ProtectedRoute>
                  <CSCenterManagement />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="faq"
              element={
                <ProtectedRoute>
                  <CSCenterManagement_FAQ />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="manual"
              element={
                <ProtectedRoute>
                  <CSCenterManagement_Manual />
                </ProtectedRoute>
              }
            ></Route>
          </Route>

          <Route path="*" element={<h1>Not Found Page</h1>} />
          <Route path="empty" element={null} />
        </Routes>
        <Modals />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
