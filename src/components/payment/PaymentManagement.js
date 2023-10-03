import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button, Modal, InputGroup, Form } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { img_src, modal, navigate } from 'util/com';
import request from 'util/request';

import PaymentManagementNavTab from 'components/payment/PaymentManagementNavTab';
import Recoils from 'recoils';
import * as xlsx from 'xlsx';
import _ from 'lodash';

import icon_arrow_left from 'images/icon_arrow_left.svg';
import icon_arrow_right from 'images/icon_arrow_right.svg';
import icon_search from 'images/icon_search.svg';
import icon_reset from 'images/icon_reset.svg';
import { logger } from 'util/com';

const PaymentManagement = () => {
  logger.render('PaymentManagement');

  const [modalState, setModalState] = useState(false);

  //row control
  const [rowData, setDatas] = useState([]);
  const selectedRowData = useRef(null);
  //

  // search input
  const [title, setTitle] = useState('');

  // pagination
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const offset = (page - 1) * limit;
  //

  useEffect(() => {
    request.post(`payment_management`, {}).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;
        logger.info(data);
        const rowCount = data.length;
        rowCount ? setDatas(() => data) : setDatas([]);
        rowCount && Math.floor(rowCount / limit) ? setPageCount(Math.floor(rowCount / limit)) : setPageCount(1);
        setPage(1);
      }
    });
  }, []);

  const onPageNext = (next) => {
    if (next) {
      if (pageCount < page + 1) return;
      setPage(page + 1);
    } else {
      if (page == 1) return;
      setPage(page - 1);
    }
  };

  const onSearch = (e) => {
    if (title && title.length < 2) {
      modal.confirm(
        '제목명은 2글자 이상으로 입력하세요.',
        [
          {
            strong: '',
            normal: '상품정보를 등록하시려면 기초정보를 등록해 주세요.',
          },
        ],
        [
          {
            name: '확인',
            callback: () => {},
          },
        ]
      );
      return;
    }

    request.post(`payment_management`, {}).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;
        logger.info(data);

        const rowCount = data.length;
        rowCount ? setDatas(() => data) : setDatas([]);
        rowCount && Math.floor(rowCount / limit) ? setPageCount(Math.floor(rowCount / limit)) : setPageCount(1);
        setPage(1);
      }
    });
  };

  const onReset = () => {
    setDatas([]);
    setPage(1);
  };
  return (
    <>
      <Head />
      <Body title={`ver ${process.env.REACT_APP_VERSION}`} myClass={'payment_management'}>
        <PaymentManagementNavTab active="/payment_management" />
        <div className="page">
          <div className="inputbox">
            <input
              name="title"
              type="text"
              placeholder="이름"
              className="input_search"
              value={''}
              onChange={(e) => {}}
            />{' '}
            <input
              name="title"
              type="text"
              placeholder="아이디"
              className="input_search"
              value={''}
              onChange={(e) => {}}
            />{' '}
            <input
              name="title"
              type="text"
              placeholder="휴대폰번호"
              className="input_search"
              value={''}
              onChange={(e) => {}}
            />{' '}
            <input
              name="title"
              type="text"
              placeholder="결제유무"
              className="input_search"
              value={''}
              onChange={(e) => {}}
            />{' '}
            <Button onClick={onSearch} className="btn btn_search">
              <img src={`${img_src}${icon_search}`} />
            </Button>
            <Button className="btn_reset" onClick={onReset}>
              <img src={`${img_src}${icon_reset}`} />
            </Button>
          </div>

          <div className="tablebox">
            <table className="thead">
              <thead>
                <tr>
                  <th>idx</th>
                  <th>이름</th>
                  <th>아이디</th>
                  <th>휴대폰번호</th>
                  <th>결제일</th>
                  <th>결제금액</th>
                  <th>결제 사용기간</th>
                  <th>잔여 사용기간</th>
                  <th>환불금액</th>
                  <th>환불계좌</th>
                </tr>
              </thead>
            </table>
            <table className="tbody">
              <tbody>
                {rowData.slice(offset, offset + limit).map((row, index) => (
                  <tr
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={(e) => {
                      selectedRowData.current = row;
                      setModalState(true);
                    }}
                  >
                    <td>{row.idx}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>{row.payment_date}</td>
                    <td>{row.payment_price}</td>
                    <td>{row.warranty_day}</td>
                    <td>{row.remain_warranty_day}</td>
                    <td>{row.refund_price ? row.refund_price : '-'}</td>
                    <td>{row.refund_bank_account ? `${row.refund_bank_name}, ${row.refund_bank_account}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Body>
      <Footer />

      <RefundModal
        modalState={modalState}
        setModalState={setModalState}
        parentData={selectedRowData.current}
      ></RefundModal>
    </>
  );
};

const RefundModal = React.memo(({ modalState, setModalState, parentData }) => {
  logger.render('UserAcceptModal');
  const aidxRef = useRef(null);
  const emailRef = useRef(null);
  const paymentPriceRef = useRef(null);
  const refundRegDateRef = useRef(null);
  const refundPriceRef = useRef(null);
  const refundBankRef = useRef(null);
  const refundStateRef = useRef(null);

  useEffect(() => {
    const rowData = parentData;
    if (rowData) {
      aidxRef.current.value = rowData.aidx;
      emailRef.current.value = rowData.email;
      paymentPriceRef.current.value = rowData.payment_price;
      refundRegDateRef.current.value = rowData.refund_reg_date ? rowData.refund_reg_date : '';
      refundPriceRef.current.value = rowData.refund_price ? rowData.refund_price : '';
      refundBankRef.current.value = rowData.refund_bank_account
        ? `${rowData.refund_bank_name}, ${rowData.refund_bank_account}`
        : '';
      refundStateRef.current.value = rowData.refund_state ? rowData.refund_state : '환불 미요청';
    }
  }, [parentData]);

  const onClose = () => {
    setModalState(false);
  };

  return (
    <Modal show={modalState} onHide={onClose} className="modal step2">
      <Modal.Header>
        <Modal.Title>환불 상세조회</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="formbox">
          <div className="innerbox">
            <InputGroup className="inputaidx">
              <label>aidx</label>
              <Form.Control
                ref={aidxRef}
                disabled={true}
                type="text"
                placeholder="aidx"
                aria-label="id"
                defaultValue={''}
              />
            </InputGroup>

            <InputGroup className="inputemail">
              <label>ID/Email</label>
              <Form.Control
                ref={emailRef}
                disabled={true}
                type="text"
                placeholder="ID/Email"
                aria-label="id"
                defaultValue={''}
              />
            </InputGroup>

            <InputGroup className="inputpayment_price">
              <label>결제금액</label>
              <Form.Control
                ref={paymentPriceRef}
                disabled={true}
                type="text"
                placeholder="결제금액"
                aria-label="id"
                defaultValue={''}
              />
            </InputGroup>

            <InputGroup className="inputrefund_require_date">
              <label>환불요청일</label>
              <Form.Control
                ref={refundRegDateRef}
                type="text"
                placeholder="환불요청일"
                aria-label="id"
                defaultValue={''}
              />
            </InputGroup>

            <InputGroup className="inputrefund_price">
              <label>환불금액</label>
              <Form.Control ref={refundPriceRef} type="text" placeholder="환불금액" aria-label="id" defaultValue={''} />
            </InputGroup>

            <InputGroup className="inputrefund_price">
              <label>환불계좌</label>
              <Form.Control ref={refundBankRef} type="text" placeholder="환불계좌" aria-label="id" defaultValue={''} />
            </InputGroup>

            <InputGroup className="inputrefund_price">
              <label>환불상태</label>
              <Form.Control ref={refundStateRef} type="text" placeholder="환불상태" aria-label="id" defaultValue={''} />
            </InputGroup>

            <Button variant="primary" type="submit" form="regist-form" className="btn_blue btn_submit">
              수정완료
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default React.memo(PaymentManagement);
