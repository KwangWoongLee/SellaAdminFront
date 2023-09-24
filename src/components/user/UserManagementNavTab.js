import React, { useEffect } from 'react';
import {} from 'react-bootstrap';
import { logger } from 'util/com';
import CommonNavTab from 'components/common/CommonNavTab';

const data = [
  { name: '/user_management', desc: '회원 조회' },
  { name: '/user_management/detail', desc: '회원 상세 조회' },
];
const UserManagementNavTab = ({ active }) => {
  logger.render('UserManagementNavTab');

  useEffect(() => {}, []);

  return (
    <>
      <CommonNavTab data={data} active={active}></CommonNavTab>
    </>
  );
};

export default React.memo(UserManagementNavTab);
