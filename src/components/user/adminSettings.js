import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Header from '../common/header';
import SettingsContainer from './styles/settingsStyle';
import { fetchRooms, fetchUsers, deleteRoom, createRoom } from '../../actions';
import SingleUserCard from './singleUserCard';
import SingleRoomCard from './singleRoomCard';

const StyledAdminHeader = styled.div`
  display: flex;
  align-items: baseline;
  /* flex-direction: column; */
  width: 90%;
  margin: 2% auto;
`;

const AdminSettings = (props) => {
  const [currentMod, setCurrentMod] = useState('Users');
  const [newRoom, setNewRoom] = useState({ room_name: '', description: '' });

  useEffect(() => {
    props.fetchUsers();
    props.fetchRooms();
  }, []);

  const handleRoomCreation = (e) => {
    e.preventDefault();
    props.createRoom(newRoom)
      .then(() => {
        setNewRoom({ room_name: '', description: '' });
        props.fetchRooms();
      })
      .catch(() => {
        console.log('failed to create room');
      });
  };

  return (
    <>
      <Header history={props.history} />
      <SettingsContainer>
        <StyledAdminHeader>
          <h2>Admin Settings</h2>
          <div className="display-name">
            <button
              className="update"
              onClick={() => {
                setCurrentMod('Users');
              }}
            >
              Modify Users
            </button>
            <button
              className="update"
              onClick={() => {
                setCurrentMod('Rooms');
              }}
            >
              Modify Rooms
            </button>
          </div>
        </StyledAdminHeader>
        {props.user.role_id === 3 ? (
          currentMod == 'Users' ? (
            <div>
              {' '}
              <h3>Users</h3>
              <div className="users-card-wrapper">
                {props.users.map((item) => {
                  return (
                    <SingleUserCard key={item.id} user={item} />
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h3>Rooms</h3>
              <div className="create-new-room">
                <form onSubmit={handleRoomCreation}>
                  <input
                    type="text"
                    value={newRoom.room_name}
                    onChange={(e) => setNewRoom({ ...newRoom, room_name: e.target.value })}
                    id="new-room"
                    name="new-room"
                    placeholder="Room Name"
                  />
                  <input
                    type="text"
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    id="description"
                    name="description"
                    placeholder="Room Description"
                  />
                  <button>Create Room</button>
                </form>
              </div>
              {props.rooms.map(item => {
                return (
                  <SingleRoomCard key={item.id} item={item} />
                );
              })}
            </div>
          )
        ) : (
          ''
        )}
      </SettingsContainer>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    rooms: state.rooms,
    users: state.users,
  };
};

export default connect(mapStateToProps, { fetchRooms, fetchUsers, deleteRoom, createRoom })(AdminSettings);
