import React, { useEffect } from 'react';
import {} from 'react-bootstrap';
import { logger } from 'util/com';
import CommonNavTab from 'components/common/CommonNavTab';

const data = [
  { name: '/cscenter_management', desc: '공지사항 관리' },
  { name: '/cscenter_management/faq', desc: 'FAQ 관리' },
  { name: '/cscenter_management/manual', desc: '이용 방법 관리' },
];
const CSCenterManagementNavTab = ({ active }) => {
  logger.render('CSCenterManagementNavTab');

  useEffect(() => {}, []);

  return (
    <>
      <CommonNavTab data={data} active={active}></CommonNavTab>
    </>
  );
};

export default React.memo(CSCenterManagementNavTab);
