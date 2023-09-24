import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { modal, navigate } from 'util/com';
import request from 'util/request';

import UserManagementNavTab from 'components/user/UserManagementNavTab';
import Recoils from 'recoils';
import * as xlsx from 'xlsx';
import _ from 'lodash';

import { logger } from 'util/com';

const UserManagement_Detail = () => {
  logger.render('Home');

  const account = Recoils.useValue('CONFIG:ACCOUNT');
  useEffect(() => {}, []);

  return (
    <>
      <Head />
      <Body title={`ver ${process.env.REACT_APP_VERSION}`} myClass={'home'}>
        <UserManagementNavTab active="/user_management/detail" />

        <div className="page">회원 상세 조회 페이지</div>
      </Body>
      <Footer />
    </>
  );
};

for (const name in process.env) {
  logger.info(`${name} = ${process.env[name]}`);
}

export default React.memo(UserManagement_Detail);
