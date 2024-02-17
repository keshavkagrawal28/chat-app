import { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { getRequest, baseUrl } from '../utils/services';

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

      if (response.error) {
        return console.error('Error gettign messages...', response.error);
      }

      const lastMessage = response[response?.length - 1];

      setLatestMessage(lastMessage);
    };
    getMessages();
  }, [newMessage, notifications, chat]);

  return { latestMessage };
};
