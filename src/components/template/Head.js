import React, { useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavDropdown, DropdownButton, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import 'styles/Template.scss';
import { useLocation } from 'react-router-dom';

import { img_src, navigate, modal, logger } from 'util/com';
import request from 'util/request';
import Recoils from 'recoils';
import com from 'util/com';
import _ from 'lodash';
import logo_white from 'images/logo_white.svg';
const Head = () => {
  logger.render('Template Head');
  const account = Recoils.useValue('CONFIG:ACCOUNT');
  const location = useLocation();

  useEffect(() => {}, []);
  const onLink = (e) => {
    e.preventDefault();
    logger.debug('href : ', e.currentTarget.name);
    navigate(e.currentTarget.name);

    logger.render('NavigateCtr :');
  };
  return (
    <>
      <div className="header">
        <Nav.Link className="logo" name="">
          <img src={`${img_src}${logo_white}`} alt="로고" />
        </Nav.Link>
        <div className="menu">
          <ul className="right">
            <li className={_.includes(location.pathname, '/user_management') ? 'on' : ''}>
              <Nav.Link className="nav-link" onClick={onLink} name="/user_management">
                회원 관리
              </Nav.Link>
            </li>
            <li className={_.includes(location.pathname, '/payment_management') ? 'on' : ''}>
              <Nav.Link onClick={onLink} name="/payment_management">
                결제 관리
              </Nav.Link>
            </li>
            <li className={_.includes(location.pathname, '/cscenter_management') ? 'on' : ''}>
              <Nav.Link onClick={onLink} name="/cscenter_management">
                공지사항 관리
              </Nav.Link>
            </li>
          </ul>
        </div>
        <div className="member">
          <span>{com.storage.getItem('access_token')}</span>
        </div>
      </div>
    </>
  );
};
export default React.memo(Head);
