import { useState, useEffect, useRef } from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../../supabaseCliente';

export default function Chat() {
  const user = localStorage.getItem('user');
  const country = localStorage.getItem('country');
  const flag = localStorage.getItem('flag');
  const [text, setText] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const lastMessageRef = useRef(null);

  function realTimeWebSocket() {
    const channel = supabase
      .channel('messages_supabase')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Mudança recebida em tempo real:', payload);
        }
      )
      .subscribe();
    return channel;
  }

  // Busca mensagens no banco de dados
  async function buscarMensagem() {
    const { error, data } = await supabase
      .from('messages')
      .select()
      .order('timestamp', { ascending: true });
    if (error) {
      console.log('Não foi possível efetuar a buscar: ', error);
    } else {
      setMensagens(data);
    }
  }

  // Grava mensagem no banco de dados
  async function gravarMensagem() {
    if (!text.trim() || !user.trim()) return;
    await supabase.from('messages').insert({
      username: user,
      text: text,
      country: country,
      country_flag: flag,
    });
    setText('');
    buscarMensagem();
  }

  /*  Temporizador para buscar mensagens e atualizar horario no chat */
  const [tempo, setTempo] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    buscarMensagem();
    const intervaloID = setInterval(() => {
      setTempo(new Date().toLocaleTimeString());
    }, 500);
    return () => clearInterval(intervaloID);
  }, []);

  useEffect(() => {
    const channel = realTimeWebSocket();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  return (
    <div className={styles.divChat}>
      <div className={styles.divChatIntern}>
        <div>
          <h1>Public Chat</h1>
          <p>{tempo}</p>
        </div>
        <div>
          {mensagens.map((mensagem, index) => (
            <div
              key={mensagem.id}
              ref={index === mensagens.length - 1 ? lastMessageRef : null}
              className={
                mensagem.username === user
                  ? styles.divMyMessages
                  : styles.divOthersMessages
              }
            >
              <strong>{mensagem.username}</strong>{' '}
              <img
                src={mensagem.country_flag}
                alt=''
                style={{ height: '15px', borderRadius: '4px' }}
              />
              <p>{mensagem.text}</p>
              <div className={styles.divMessageClock}>
                <p>
                  {new Date(
                    new Date(mensagem.timestamp).setHours(
                      new Date(mensagem.timestamp).getHours() - 3
                    )
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <input
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
