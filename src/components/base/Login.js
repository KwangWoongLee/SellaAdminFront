import React, { useEffect, useState } from 'react';
import { Button, InputGroup, Form, Nav } from 'react-bootstrap';
import Recoils from 'recoils';
import com, { logger, navigate, get_login_hash, modal } from 'util/com';
import request from 'util/request';

import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import Checkbox from 'components/common/CheckBoxCell';

import 'styles/Login.scss';

const Login = () => {
  logger.render('Login');

  useEffect(() => {
    const idSave = com.storage.getItem('idSave');
    if (idSave == 'true') setIdSaveChecked(true);
  }, []);
  const [idSaveChecked, setIdSaveChecked] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    const email = e.currentTarget[0].value;
    const password = e.currentTarget[1].value;

    if (!email || !password) {
      modal.alert(`아이디 또는 비밀번호를 잘못 입력했습니다.
      입력하신 내용을 다시 확인해주세요.`);
      return;
    }

    request.post('login', { email, password }).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;

        Recoils.setState('CONFIG:ACCOUNT', {
          email: email,
          grade: data.grade,
          name: data.name,
          access_token: data.access_token,
        });

        if (idSaveChecked) {
          com.storage.setItem('idSave', true);
          com.storage.setItem('email', email);
        } else {
          com.storage.setItem('idSave', false);
          com.storage.setItem('email', '');
        }

        com.storage.setItem('access_token', data.access_token);

        Recoils.setState('SELLA:PLATFORM', data.platform);
        Recoils.setState('SELLA:SELLAFORMS', data.sella_forms);
        Recoils.setState('SELLA:CATEGORIES', data.sella_categories);

        navigate('/user_management');
      }
    });

    logger.info(`login : email = ${email}`);
  };

  const checkedItemHandler = (d) => {
    setIdSaveChecked(d);
  };

  return (
    <>
      <Head />
      <Body title={`로그인`} myClass={'login'}>
        <Form onSubmit={onSubmit} id="login-modal-form" className="formbox">
          <h3>관리자 로그인</h3>
          <InputGroup className="mb-3">
            <label>아이디</label>
            <Form.Control
              type="text"
              placeholder="이메일 주소"
              aria-label="id"
              defaultValue={com.storage.getItem('email') !== 'undefined' ? com.storage.getItem('email') : ''}
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <label>비밀번호</label>
            <Form.Control
              type="password"
              placeholder="비밀번호"
              aria-label="password"
              defaultValue={''}
              aria-describedby="basic-addon2"
            />
          </InputGroup>
          <div className="btnbox">
            <div className="btnbox_left">
              <Checkbox checked={idSaveChecked} checkedItemHandler={checkedItemHandler}></Checkbox>
              <label>ID 저장</label>
            </div>
          </div>
          <Button variant="primary" type="submit" form="login-modal-form" className="btn_blue btn_login">
            로그인
          </Button>
        </Form>
      </Body>
      <Footer />
    </>
  );
};

export default React.memo(Login);
