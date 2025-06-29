import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../../supabaseCliente';
import axios from 'axios';
import styles from './style.module.css';

export default function Chat() {
  const user = localStorage.getItem('user');
  const country = localStorage.getItem('country');
  const flag = localStorage.getItem('flag');
  const authenticated = localStorage.getItem('auth') === 'true';
  const lastMessageRef = useRef(null);
  const [text, setText] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [semMensagem, setSemMensagem] = useState(null);

  // Grava mensagem no banco de dados
  async function gravarMensagem() {
    if (!text.trim()) return;
    const payload = {
      text: text,
      country: country,
      country_flag: flag,
      authenticated: authenticated,
      username: user,
    };
    console.log(payload);
    axios.post(
      'https://public-chat-react-backend.onrender.com/sendmessage',
      payload,
      {
        headers: { Accept: 'application/jsn' },
      }
    );
    setText('');
  }

  useEffect(() => {
    // Canal Supabase
    const channel = supabase
      .channel('chat_publico')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMensagens((prev) => [...prev, payload.new]);
          setSemMensagem(false);
        }
      )
      .subscribe();

    // Busca mensagens no banco de dados
    async function buscarMensagem() {
      setIsLoading(true);
      const response = await fetch(
        `https://public-chat-react-backend.onrender.com/getmessages/${user}`
      );
      const data = await response.json();
      setIsLoading(false);

      if (data.length === 0) {
        setSemMensagem(true);
      } else {
        setSemMensagem(false);
      }
      setMensagens(data);
    }
    buscarMensagem();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  return (
    <div className={styles.divChat}>
      <div className={styles.divChatIntern}>
        <h1>Usuário: {user}</h1>
        <div className={styles.divChatInternMessages}>
          {isLoading ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '15px',
              }}
            >
              <h1>Carregando mensagens...</h1>
            </div>
          ) : semMensagem ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '15px',
              }}
            >
              <h1>Sem mensagens, seja o primeiro!</h1>
            </div>
          ) : (
            mensagens.map((mensagem, index) => {
              const isMyMessages = mensagem.username
                ? mensagem.username === user
                : mensagem.github_username === user;
              const userbase = mensagem.username
                ? mensagem.username
                : mensagem.github_username;
              const mensagemId = mensagem.id;
              const mensagemCountryFlag = mensagem.country_flag;
              const mensagemText = mensagem.text;
              const timestamp =
                mensagem.timestamp.replace(/(\.\d{3})\d*/, '$1') + 'Z';
              const mensagemTimeStamp = new Date(timestamp)
                .toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                .replace(',', ' - ');

              return (
                <div
                  key={mensagemId}
                  ref={index === mensagens.length - 1 ? lastMessageRef : null}
                  className={
                    isMyMessages
                      ? styles.divMyMessages
                      : styles.divOthersMessages
                  }
                >
                  <strong>{userbase}</strong>{' '}
                  <img
                    src={mensagemCountryFlag}
                    alt=''
                    style={{ height: '15px', borderRadius: '4px' }}
                  />
                  <p>{mensagemText}</p>
                  <div className={styles.divMessageClock}>
                    <p>{mensagemTimeStamp}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={styles.divChatInternInputMessage}>
          <input
            name='mensagem'
            onChange={(e) => setText(e.target.value)}
            type='text'
            placeholder='Digite uma mensagem'
            value={text}
            onKeyDown={(e) => (e.key === 'Enter' ? gravarMensagem() : null)}
          />
          <FontAwesomeIcon
            onClick={gravarMensagem}
            icon={faPaperPlane}
            size='2xl'
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
