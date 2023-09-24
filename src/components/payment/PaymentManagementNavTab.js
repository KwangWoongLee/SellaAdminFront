import React, { useEffect } from 'react';
import {} from 'react-bootstrap';
import { logger } from 'util/com';
import CommonNavTab from 'components/common/CommonNavTab';

const data = [
  { name: '/payment_management', desc: '결제 조회' },
  { name: '/payment_management/refund', desc: '환불' },
];
const PaymentManagementNavTab = ({ active }) => {
  logger.render('PaymentManagementNavTab');

  useEffect(() => {}, []);

  return (
    <>
      <CommonNavTab data={data} active={active}></CommonNavTab>
    </>
  );
};

export default React.memo(PaymentManagementNavTab);
