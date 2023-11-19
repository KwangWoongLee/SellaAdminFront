import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';

import { Table, Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { img_src, useInput, modal, navigate } from 'util/com';
import request from 'util/request';
import UserManagementNavTab from 'components/user/UserManagementNavTab';
import Recoils from 'recoils';
import _ from 'lodash';
import ImageModal from 'components/common/ImageModal';

import com, { logger, time_format } from 'util/com';

import 'styles/CSCenter.scss';

import icon_arrow_left from 'images/icon_arrow_left.svg';
import icon_arrow_right from 'images/icon_arrow_right.svg';
import icon_search from 'images/icon_search.svg';
import icon_reset from 'images/icon_reset.svg';

const UserManagement = () => {
  logger.render('UserManagement');

  const selectDataRef = useRef(null);

  const [modalState, setModalState] = useState(false);

  //row control
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
    request.post(`user_management`, {}).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;
        logger.info(data);
        const rowCount = data.length;
        rowCount ? setDatas(() => data) : setDatas([]);
        rowCount && Math.floor(rowCount / limit) >= 1
          ? setPageCount(Math.floor(rowCount / limit) + 1)
          : setPageCount(1);
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

    request.post(`user_management`, {}).then((ret) => {
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

  const onClickUserAccept = () => {
    setModalState(true);
  };

  const onBlockTrans = (row) => {
    request.post(`user_management/block`, { user_aidx: row.idx, block: !row.block }).then((ret) => {
      if (!ret.err) {
        const datas = _.cloneDeep(rowData);
        const findObj = _.find(datas, { idx: row.idx });
        findObj.block = !row.block;
        setDatas([...datas]);
      }
    });
  };

  const onWithDrawTrans = (row) => {
    request.post(`user_management/withdraw`, { user_aidx: row.idx, withdraw: !row.withdraw }).then((ret) => {
      if (!ret.err) {
        const datas = _.cloneDeep(rowData);
        const findObj = _.find(datas, { idx: row.idx });
        findObj.withdraw = !row.withdraw;
        setDatas([...datas]);
      }
    });
  };

  const onResetPassword = (row) => {
    request.post(`user_management/reset_password`, { user_aidx: row.idx }).then((ret) => {
      if (!ret.err) {
        const { data } = ret.data;

        modal.alert(`새로운 비밀번호\n${data.new_password}`);
      }
    });
  };

  return (
    <>
      <Head />
      <Body title={`ver ${process.env.REACT_APP_VERSION}`} myClass={'cscenter'}>
        <UserManagementNavTab active="/user_management" />

        <div className="page">
          <h3>회원 조회</h3>

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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />{' '}
            <input
              name="title"
              type="text"
              placeholder="아이디"
              className="input_search"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />{' '}
            <input
              name="title"
              type="text"
              placeholder="휴대폰번호"
              className="input_search"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />{' '}
            <input
              name="title"
              type="text"
              placeholder="결제유무"
              className="input_search"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
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
                  <th>결제유무</th>
                  <th>결제 사용기간</th>
                  <th>최근 결제일</th>
                  <th>휴면유무</th>
                  <th>차단여부</th>
                  <th>차단 등록/해제</th>
                  <th>탈퇴여부</th>
                  <th>탈퇴 등록/해제</th>
                  <th>임시 비밀번호 발급</th>
                  <th>최초 가입일</th>
                  <th>최근 접속일</th>
                  <th>고객계정 접속 버튼</th>
                </tr>
              </thead>
            </table>
            <table className="tbody">
              <tbody>
                {rowData.slice(offset, offset + limit).map((row, index) => (
                  <tr style={{ cursor: 'pointer' }}>
                    <td>{row.idx}</td>
                    <td>{row.name}</td>
                    <td>{row.id}</td>
                    <td>{row.phone}</td>
                    <td>{row.is_payment ? 'Y' : 'N'}</td>
                    <td>{row.is_payment ? row.remain_warranty_day : '-'}</td>
                    <td>{row.is_payment ? row.payment_date : '-'}</td>
                    <td>{row.is_dormant ? 'Y' : 'N'}</td>
                    <td>{row.block ? 'Y' : 'N'}</td>
                    <td>
                      <Button
                        onClick={() => {
                          onBlockTrans(row);
                        }}
                      >
                        차단 {row.block ? '해제' : '등록'}
                      </Button>
                    </td>
                    <td>{row.withdraw ? 'Y' : 'N'}</td>
                    <td>
                      <Button
                        onClick={() => {
                          onWithDrawTrans(row);
                        }}
                      >
                        탈퇴 {row.withdraw ? '해제' : '등록'}
                      </Button>
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          onResetPassword(row);
                        }}
                      >
                        임시 비밀번호 발급
                      </Button>
                    </td>
                    <td>{row.reg_date}</td>
                    <td>{row.login_date}</td>
                    <td>
                      <Button onClick={onClickUserAccept}>접속</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Body>
      <Footer />

      <UserAcceptModal modalState={modalState} setModalState={setModalState}></UserAcceptModal>
    </>
  );
};

const UserAcceptModal = React.memo(({ modalState, setModalState, parentEmail }) => {
  logger.render('UserAcceptModal');

  const onClose = () => {
    setModalState(false);
  };

  return (
    <Modal show={modalState} onHide={onClose} className="modal step2">
      <Modal.Header>
        <Modal.Title>테스트</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe width="100%" height="1000" frameborder="0" scrolling="no" src="http://localhost:8080/"></iframe>
      </Modal.Body>
    </Modal>
  );
});

export default React.memo(UserManagement);
