import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  fetchFlaggedPosts,
  archivePost,
  resolvePost,
} from '../../store/actions';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const ModStyledRoom = styled.div`
  /* width: 100%; */
  padding: 2.8%;
  background-color: #141414;
  margin: 1.2rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 12px;
  i {
    margin: 0.4% 0;
    padding: 0 0.3%;
  }
  a {
    text-decoration: none;
    color: #6495ed;
    font-style: italic;
    font-weight: 500;
    font-size: 1.3rem;
    margin: 1% 0;
    transition: 0.25s;
    :hover {
      font-size: 1.4rem;
    }
  }
  h4 {
    color: white;
    font-size: 1.6rem;
    font-weight: 500;
    margin: 1% 0;
  }
  p {
    font-size: 1.1rem;
    font-weight: 500;
    color: lightgrey;
    margin: 1% 0;
  }
  .editable {
    display: flex;
    flex-direction: column;
    margin-top: 2.2%;
    margin-bottom: 2%;
  }
  .mod-button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  button {
    width: 9%;
    margin-top: 1.5%;
    margin-right: 2%;
    padding: 8px 12px;
    box-shadow: 2px 2px 8px #212529;
    border: 1px solid #808080;
    border-radius: 5px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
    color: #ffffff;
    cursor: pointer;
    transition: 0.25s;
    :first-child {
      background-color: #f9fcff;
      background-image: linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%);
      color: black;
      font-weight: 700;
    }
    :last-child {
      background: linear-gradient(to right, #141414, #212121, #282828);
      font-weight: 500;
    }
    :hover {
      opacity: 0.5;
    }
  }
`;

const SingleFlaggedPost = (props) => {
  const { post } = props;
  const [modalIsOpen, setModelIsOpen] = useState(false);
  const [filterReason, setFilterReason] = useState('All');
  const [flags, setFlags] = useState(post.flags);

  useEffect(() => {
    if (filterReason != 'All') {
      const filteredFlags = post.flags.filter((flag) => {
        return flag.reason === filterReason;
      });
      setFlags(filteredFlags);
    } else {
      setFlags(post.flags);
    }
  }, [filterReason]);

  const handleResolvePost = (id) => {
    props
      .resolvePost(id)
      .then(() => {
        props.fetchFlaggedPosts();
        setModelIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleArchivePost = (id) => {
    props
      .archivePost(id)
      .then(() => {
        props.fetchFlaggedPosts();
        setModelIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenModal = () => {
    setModelIsOpen(true);
  };

  const handleCloseModal = () => {
    setModelIsOpen(false);
  };

  const handleFilterByReason = (reason) => {
    setFilterReason(reason);
  };

  return (
    <ModStyledRoom>
      <div className="not-editable">
        <Link to={`/post/${post.id}`}>
          {/* <i class="far fa-clipboard"></i>Click Here To See Original Post */}
          <h4>{post.title}</h4>
        </Link>
        <p>{post.description}</p>
        <p>Num of Flags: {post.flags.length}</p>
        <div className="mod-button-wrapper">
          <button onClick={handleOpenModal}>View Flags</button>
          <button onClick={() => handleArchivePost(post.id)}>Archive</button>
          <button onClick={() => handleResolvePost(post.id)}>Keep</button>
        </div>
      </div>
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Flagged Post"
          ariaHideApp={false}
        >
          <div>
            <button onClick={() => handleArchivePost(post.id)}>Archive</button>
            <button onClick={() => handleResolvePost(post.id)}>Keep</button>
          </div>
          <div>
            <h1>Flagged Post</h1>
            <p>{post.title}</p>
            <p>{post.description}</p>
          </div>
          <h3>Filter by Reason</h3>
          <div>
            <button onClick={() => handleFilterByReason('All')}>All</button>
            {props.reasons.map((reason) => {
              return (
                <button
                  onClick={() => handleFilterByReason(reason.reason)}
                  key={reason.reason}
                >
                  {reason.reason}
                </button>
              );
            })}
          </div>
          {flags.map((flag, index) => {
            return (
              <div className="reason-card" key={index}>
                <h3>{flag.flagger_name}</h3>
                <p>
                  Flagged this as <strong>{flag.reason}</strong>
                </p>
                <p>
                  <strong>Note:</strong> {flag.note ? flag.note : 'null'}
                </p>
              </div>
            );
          })}
        </Modal>
      )}
    </ModStyledRoom>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    reasons: state.reasons,
  };
};

export default connect(mapStateToProps, {
  fetchFlaggedPosts,
  archivePost,
  resolvePost,
})(SingleFlaggedPost);
