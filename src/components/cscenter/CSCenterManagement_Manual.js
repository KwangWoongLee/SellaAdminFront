import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button, Modal, Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { modal, navigate, page_reload } from 'util/com';
import request from 'util/request';

import Recoils from 'recoils';
import * as xlsx from 'xlsx';
import _ from 'lodash';

import { logger } from 'util/com';
import CSCenterManagementNavTab from 'components/cscenter/CSCenterManagementNavTab';

const CSCenterManagement_Manual = () => {
  logger.render('CSCenterManagement_Manual');

  const account = Recoils.useValue('CONFIG:ACCOUNT');
  const [rowData, setDatas] = useState([]);
  const [modalState, setModalState] = useState(false);
  useEffect(() => {
    request.post(`cscenter_management/manual`, {}).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;
        logger.info(data);

        const rowCount = data.length;
        rowCount ? setDatas(() => data) : setDatas([]);
      }
    });
  }, []);

  const onAdd = () => {
    setModalState(true);
  };

  const onDelete = (e) => {
    const idx = e.target.parentNode.parentNode.childNodes[0].innerText;

    request.post(`cscenter_management/manual/delete`, { idx }).then((ret) => {
      if (!ret.err) {
        page_reload();
      }
    });
  };

  return (
    <>
      <Head />
      <Body title={`ver ${process.env.REACT_APP_VERSION}`} myClass={'cscenter_management'}>
        <CSCenterManagementNavTab active="/cscenter_management/manual" />
        <div className="page">
          <Button onClick={onAdd}>추가</Button>

          <div className="tablebox">
            <table className="thead">
              <thead>
                <tr>
                  <th>idx</th>
                  <th>카테고리</th>
                  <th>제목</th>
                  <th>내용</th>
                  <th>img_url1</th>
                  <th>img_url2</th>
                  <th>img_url3</th>
                  <th>날짜</th>
                  <th></th>
                </tr>
              </thead>
            </table>
            <table className="tbody">
              <tbody>
                {rowData.map((row, index) => (
                  <tr style={{ cursor: 'pointer' }}>
                    <td>{row.idx}</td>
                    <td>{row.manual_category}</td>
                    <td>{row.title}</td>
                    <td>{row.content}</td>
                    <td>{row.img_url1}</td>
                    <td>{row.img_url2}</td>
                    <td>{row.img_url3}</td>
                    <td>{row.reg_date}</td>
                    <td>
                      <Button onClick={onDelete}>삭제</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Body>
      <Footer />
      <AddModal modalState={modalState} setModalState={setModalState}></AddModal>
    </>
  );
};

const AddModal = React.memo(({ modalState, setModalState }) => {
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imgUrl1Ref = useRef(null);
  const account = Recoils.useValue('CONFIG:ACCOUNT');

  const onClose = () => setModalState(false);

  const onAdd = () => {
    const add_data = {
      category: categoryRef.current.value,
      title: titleRef.current.value,
      content: contentRef.current.value,
      img_url1: imgUrl1Ref.current.value,
    };

    request
      .post(`cscenter_management/manual/insert`, { access_token: account.access_token, add_data: add_data })
      .then((ret) => {
        if (!ret.err) {
          page_reload();
        }
      });
  };

  return (
    <Modal show={modalState} onHide={onClose} centered className="modal setDateModal">
      <Modal.Header>
        <Modal.Title>항목 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="formbox">
          <label>카테고리</label>
          <InputGroup className="inputname">
            <Form.Control ref={categoryRef} type="text" placeholder="카테고리 입력" aria-label="name" />
          </InputGroup>
          <label>제목</label>
          <InputGroup className="inputname">
            <Form.Control ref={titleRef} type="text" placeholder="제목 입력" aria-label="name" />
          </InputGroup>
          <label>내용</label>
          <InputGroup className="inputname">
            <Form.Control ref={contentRef} type="text" placeholder="내용 입력" aria-label="name" />
          </InputGroup>
          <label>img_url1</label>
          <InputGroup className="inputname">
            <Form.Control ref={imgUrl1Ref} type="text" placeholder="이미지 url 입력" aria-label="name" />
          </InputGroup>
        </Form>
        <Button onClick={onAdd}>추가</Button>
      </Modal.Body>
    </Modal>
  );
});

export default React.memo(CSCenterManagement_Manual);
