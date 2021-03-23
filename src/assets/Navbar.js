import React from 'react';
import { connect } from 'react-redux';
import { retrieveFullSearchResults } from '../store/actions';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

import AlumniLogo from '../img/AlumniLogo.svg';
import ProfileIcon from './ProfileIcon';
import SearchBar from './SearchBar';

const Navbar = (props) => {
  return (
    <Row
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Col span={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ width: '60%', maxWidth: '200px' }}>
          <Link to='/' >
            <img src={AlumniLogo} width="100%" />
          </Link>
        </div>
      </Col>
      <Col
        span={6}
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
        }}
      >
        <SearchBar/>
      </Col>
      <Col
        span={6}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <ProfileIcon />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    searchResults: state.mainSearchResults,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  retrieveFullSearchResults,
})(Navbar);
