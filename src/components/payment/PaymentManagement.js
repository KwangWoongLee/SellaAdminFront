import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
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

  useEffect(() => {}, []);

  const [detailModalState, setDetailModalState] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  //row control
  const [collapseState, setCollapseState] = useState(false);
  const [rowData, setDatas] = useState([]);
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
                  <tr style={{ cursor: 'pointer' }}>
                    <td>{row.idx}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>{row.payment_date}</td>
                    <td>{row.payment_price}</td>
                    <td>{row.warranty_day}</td>
                    <td>{row.remain_warranty_day}</td>
                    <td>{row.refund_price}</td>
                    <td>{'-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Body>
      <Footer />
    </>
  );
};

for (const name in process.env) {
  logger.info(`${name} = ${process.env[name]}`);
}

export default React.memo(PaymentManagement);
