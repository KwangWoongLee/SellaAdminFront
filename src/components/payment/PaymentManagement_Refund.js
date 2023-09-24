import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { modal, navigate } from 'util/com';
import request from 'util/request';

import PaymentManagementNavTab from 'components/payment/PaymentManagementNavTab';
import Recoils from 'recoils';
import * as xlsx from 'xlsx';
import _ from 'lodash';

import { logger } from 'util/com';

const PaymentManagement_Refund = () => {
  logger.render('PaymentManagement_Refund');

  const account = Recoils.useValue('CONFIG:ACCOUNT');
  useEffect(() => {}, []);

  return (
    <>
      <Head />
      <Body title={`ver ${process.env.REACT_APP_VERSION}`} myClass={'payment_management'}>
        <PaymentManagementNavTab active="/payment_management/refund" />
        <div className="page">결제 관리 - 환불 페이지</div>
      </Body>
      <Footer />
    </>
  );
};

for (const name in process.env) {
  logger.info(`${name} = ${process.env[name]}`);
}

export default React.memo(PaymentManagement_Refund);
