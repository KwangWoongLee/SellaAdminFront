import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button, Modal, InputGroup, Form } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { img_src, modal, navigate, page_reload, time_format_none_time } from 'util/com';
import request from 'util/request';

import PaymentManagementNavTab from 'components/payment/PaymentManagementNavTab';
import Recoils from 'recoils';
import CommonDateModal from 'components/common/CommonDateModal';
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
        rowCount && Math.floor(rowCount / limit) >= 1 ? setPageCount(Math.floor(rowCount / limit)) : setPageCount(1);
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
        rowCount && Math.floor(rowCount / limit) >= 1 ? setPageCount(Math.floor(rowCount / limit)) : setPageCount(1);
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
          <div className="pagination">
            <Button onClick={(e) => onPageNext(false)} className="btn_arrow_left">
              <img src={`${img_src}${icon_arrow_left}`} alt="이전 페이지" />
            </Button>
            <span>
              Page {page} of {pageCount}
            </span>
            <Button onClick={(e) => onPageNext(true)} className="btn_arrow_right">
              <img src={`${img_src}${icon_arrow_right}`} alt="다음 페이지" />
            </Button>{' '}
          </div>

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
                    <td>{row.id}</td>
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
  const refundPriceRef = useRef(null);
  const refundBankRef = useRef(null);
  const refundBankAccountRef = useRef(null);
  const [rowData, setRowData] = useState(null);
  const [dateModalState, setDateModalState] = useState(false);
  const [refundState, setRefundState] = useState(0);

  useEffect(() => {
    const rowData = _.cloneDeep(parentData);

    setRowData(rowData);
  }, [modalState]);

  useEffect(() => {
    if (rowData && refundState === 1) {
      rowData.refund_reg_date = null;
      refundPriceRef.current.value = '';
      refundBankRef.current.value = '';
      refundBankAccountRef.current.value = '';
    }

    setRowData({ ...rowData });
  }, [refundState]);

  const onClose = () => {
    setRefundState(0);
    setModalState(false);
  };

  const onChangeDate = (date) => {
    rowData.refund_reg_date = date;
    setRowData(() => rowData);
  };

  const onRefundReq = () => {
    if (!refundPriceRef.current.value || !refundBankRef.current.value || !refundBankAccountRef.current.value) {
      modal.alert('환불 요청 정보를 입력 해주세요.');
      return;
    }

    const refund_data = {
      ...rowData,
      refund_price: refundPriceRef.current.value,
      refund_bank: refundBankRef.current.value,
      refund_bank_account: refundBankAccountRef.current.value,
      descript: '',
    };

    request.post(`payment_management/refund`, { refund_data }).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;
        page_reload();
      }
    });
  };

  const onCompleteRefund = () => {
    if (rowData.refund_state !== 1) {
      modal.alert('환불 진행 상태에서만 환불 완료가 가능합니다.');
      return;
    }

    request.post(`payment_management/refund/complete`, { refund_data: { ...rowData } }).then((ret) => {
      if (!ret.err) {
        modal.alert('환불 완료 상태로 변경!');
        page_reload();
      }
    });
  };

  const onCancelRefund = () => {
    if (rowData.refund_state !== 1) {
      modal.alert('환불 진행 상태에서만 환불 취소가 가능합니다.');
      return;
    }

    request.post(`payment_management/refund/cancel`, { refund_data: { ...rowData } }).then((ret) => {
      if (!ret.err) {
        modal.alert('환불 취소 완료!');
        page_reload();
      }
    });
  };

  return (
    <>
      <Modal show={modalState} onHide={onClose} className="modal step2">
        <Modal.Header>
          <Modal.Title>환불 상세조회</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="formbox">
            <div className="innerbox">
              <label>계정 번호</label> {rowData && rowData.aidx}
              <br></br>
              <label>ID</label> {rowData && rowData.id}
              <br></br>
              <label>환불 명의(타 명의 X)</label> {rowData && rowData.name}
              <br></br>
              <label>결제 금액</label> {rowData && rowData.payment_price}
              <br></br>
              <label>환불 상태 변경</label>
              {rowData && rowData.refund_state === undefined && (
                <Button className="" onClick={() => setRefundState(1)}>
                  {' '}
                  환불 요청
                </Button>
              )}
              {rowData && rowData.refund_state === 1 && (
                <>
                  <Button className="" onClick={onCompleteRefund}>
                    {' '}
                    환불 완료
                  </Button>
                  <Button onClick={onCancelRefund}>환불 취소</Button>
                </>
              )}
              {refundState === 1 && (
                <>
                  <InputGroup className="inputrefund_require_date">
                    <label>환불요청일</label>
                    {rowData && rowData.refund_reg_date ? time_format_none_time(rowData.refund_reg_date) : '-'}
                    <Button disabled={refundState !== 1} onClick={() => setDateModalState(true)}>
                      변경
                    </Button>
                  </InputGroup>
                  <InputGroup className="inputrefund_price">
                    <label>환불금액</label>
                    <Form.Control ref={refundPriceRef} type="text" placeholder="환불 금액" aria-label="id" />
                  </InputGroup>
                  <InputGroup className="inputrefund_price">
                    <label>환불은행</label>
                    <Form.Control ref={refundBankRef} type="text" placeholder="환불은행" aria-label="id" />
                  </InputGroup>
                  <InputGroup className="inputrefund_price">
                    <label>환불계좌</label>
                    <Form.Control ref={refundBankAccountRef} type="text" placeholder="환불계좌" aria-label="id" />
                  </InputGroup>
                  <Button variant="primary" onClick={onRefundReq} className="btn_blue btn_submit">
                    수정
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <CommonDateModal
        modalState={dateModalState}
        setModalState={setDateModalState}
        onChangeDate={onChangeDate}
      ></CommonDateModal>
    </>
  );
});

export default React.memo(PaymentManagement);
