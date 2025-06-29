import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseCliente';
import { dbName } from '../../../dbName';

export default function Sidebar() {
  const [chat, setChat] = useState('');
  const [lastMessage, setLastMessage] = useState(null);
  const [lastMessageOld, setLastMessageOld] = useState(null);
  const [userParsed, setUserParsed] = useState('');
  const [iconBackSideBar, setIconBackSideBar] = useState(null);
  const [titleChatSideBar, setTitleChatSideBar] = useState('');

  const chats = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];

  const [sidebarResize, setSidebarResize] = useState(true);
  const sidebarClass = {
    expanded: {
      container: styles.divSidebar,
      title: styles.divSidebarTitle,
      userCard: styles.divSidebarUserCard,
      userCardClicked: styles.divSidebarChatClicked,
      userPhoto: styles.divSidebarUserCardPhoto,
    },
    colapsed: {
      container: styles.divSidebar_Colapsed,
      title: styles.divSidebarTitle_Colapsed,
      userCard: styles.divSidebarUserCard_Colapsed,
      userPhoto: styles.divSidebarUserCardPhoto_Colapsed,
      userPhotoClicked: styles.divSidebarUserCardPhotoClicked_Colapsed,
    },
  };

  // Converte o usuario em array
  function convertString(user) {
    try {
      const parsed = JSON.parse(user);
      return parsed[parsed.length - 1];
    } catch {
      return user;
    }
  }

  useEffect(() => {
    setSidebarResize(false);
    setIconBackSideBar(faLeftLong);
    setTitleChatSideBar('Chats');

    const channel = supabase
      .channel('lastMessage')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: dbName,
        },
        (payload) => {
          const Payload = payload.new;
          setLastMessage(Payload);
          const parsedName = convertString(payload.new.username);
          setUserParsed(parsedName);
          console.log(Payload);
        }
      )
      .subscribe();

    async function buscarMensagem() {
      const { data, error } = await supabase
        .from(dbName)
        .select('*')
        .order('id', { ascending: false })
        .limit(1);
      if (!error) {
        const parsedName = convertString(data[0].username);
        setLastMessageOld(data[0]);
        setUserParsed(parsedName);
      }
    }
    buscarMensagem();
    function chatInitial() {
      const firstChat = '1';
      setChat(firstChat);
    }
    chatInitial();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div
      id='sidebar_id'
      className={
        sidebarResize
          ? sidebarClass.colapsed.container
          : sidebarClass.expanded.container
      }
    >
      <div
        className={
          sidebarResize
            ? sidebarClass.colapsed.title
            : sidebarClass.expanded.title
        }
      >
        <h1>{titleChatSideBar}</h1>
        <FontAwesomeIcon
          icon={iconBackSideBar}
          onClick={() => {
            setSidebarResize(sidebarResize === true ? false : true);
            setIconBackSideBar(
              iconBackSideBar === faLeftLong ? faRightLong : faLeftLong
            );
            setTitleChatSideBar(titleChatSideBar === '' ? 'Chats' : '');
          }}
        />
      </div>

      {chats.map((chatDiv) => (
        <div
          key={chatDiv.id}
          onClick={() => setChat(chatDiv.id)}
          className={`${
            sidebarResize
              ? sidebarClass.colapsed.userCard
              : sidebarClass.expanded.userCard
          } ${
            !sidebarResize &&
            chatDiv.id === chat &&
            sidebarClass.expanded.userCardClicked
          }`}
        >
          <div
            className={`${
              sidebarResize
                ? sidebarClass.colapsed.userPhoto
                : sidebarClass.expanded.userPhoto
            } ${
              sidebarResize &&
              chatDiv.id === chat &&
              sidebarClass.colapsed.userPhotoClicked
            }`}
          >
            <h1>PC</h1>
          </div>
          <div>
            <h1>{userParsed}</h1>
            <p>{lastMessage?.text || lastMessageOld?.text || ''}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
