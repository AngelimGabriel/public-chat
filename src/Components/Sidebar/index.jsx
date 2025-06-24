import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseCliente';

export default function Sidebar() {
  const [chat, setChat] = useState('');
  const [lastMessage, setLastMessage] = useState(null);
  const [lastMessageOld, setLastMessageOld] = useState(null);
  const [userParsed, setUserParsed] = useState('');

  // Converte o usuario em array
  function convertString(user) {
    try {
      const parsed = JSON.parse(user);
      return parsed[parsed.length - 1];
    } catch {
      return user;
    }
  }

  function changeChat(newChat) {
    const divChatOld = document.getElementById(chat);
    setChat(newChat);
    const divChatNew = document.getElementById(newChat);
    divChatOld.classList.remove(styles.divSidebarUserCardClicked);
    divChatNew.classList.add(styles.divSidebarUserCardClicked);
  }

  useEffect(() => {
    const channel = supabase
      .channel('lastMessage')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
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
        .from('messages')
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

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    function chatInitial() {
      const firstChat = '1';
      setChat(firstChat);
      const divInitial = document.getElementById(firstChat);
      divInitial.classList.add(styles.divSidebarUserCardClicked);
    }
    chatInitial();
  }, []);

  return (
    <div className={styles.divSidebar}>
      <div>
        <div>
          <h1>Chats</h1>
          <FontAwesomeIcon icon={faLeftLong} />
        </div>
        <hr />
      </div>
      <div
        id='1'
        onClick={(e) => {
          changeChat(e.currentTarget.id);
        }}
        className={styles.divSidebarUserCard}
      >
        <div className={styles.divSidebarUserCard_Photo}>
          <h1>PC</h1>
        </div>
        <div>
          <h1>{userParsed}</h1>
          <p>{lastMessage?.text || lastMessageOld?.text || ''}</p>
        </div>
      </div>
      <div
        id='2'
        onClick={(e) => {
          changeChat(e.currentTarget.id);
        }}
        className={styles.divSidebarUserCard}
      >
        <div className={styles.divSidebarUserCard_Photo}>
          <h1>GA</h1>
        </div>
        <div>
          <h1>Gabriel Angelim</h1>
          <p>Backup's</p>
        </div>
      </div>
      <div
        id='3'
        onClick={(e) => {
          changeChat(e.currentTarget.id);
        }}
        className={styles.divSidebarUserCard}
      >
        <div className={styles.divSidebarUserCard_Photo}>
          <h1>KD</h1>
        </div>
        <div>
          <h1>Kathellen Dantas</h1>
          <p>Vamos comer bacon baiana</p>
        </div>
      </div>
      <div
        id='4'
        onClick={(e) => {
          changeChat(e.currentTarget.id);
        }}
        className={styles.divSidebarUserCard}
      >
        <div className={styles.divSidebarUserCard_Photo}>
          <h1>EG</h1>
        </div>
        <div>
          <h1>Edivan Gomes</h1>
          <p>Pepinha vai fechar</p>
        </div>
      </div>
    </div>
  );
}
