import { useFetchRecipientuser } from '../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import profile from '../../assets/profile.svg';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientuser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
    useContext(ChatContext);
  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUsernNotifications = unreadNotifications?.filter(
    (n) => n.senderId === recipientUser?._id
  );

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText = shortText + '...';
    }
    return shortText;
  };

  return (
    <Stack
      direction='horizontal'
      gap={3}
      className='user-card align-items-center p-2 justify-content-between'
      role='button'
      onClick={() => {
        if (thisUsernNotifications?.length !== 0) {
          markThisUserNotificationsAsRead(
            thisUsernNotifications,
            notifications
          );
        }
      }}
    >
      <div className='d-flex'>
        <div className='me-2'>
          <img src={profile} height='35px' alt='profile-icon' />
        </div>
        <div className='text-content'>
          <div className='name'>{recipientUser?.name}</div>
          <div className='text'>
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className='d-flex flex-column align-items-end'>
        <div className='date'>
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={
            thisUsernNotifications?.length ? 'this-user-notifications' : ''
          }
        >
          {thisUsernNotifications?.length > 0
            ? thisUsernNotifications?.length
            : ''}
        </div>
        <span className={isOnline ? 'user-online' : ''}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
