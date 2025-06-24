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
  const [newName, setNewName] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const lastMessageRef = useRef(null);

  function changeName() {
    const parsedName = JSON.parse(user);
    parsedName.push(newName);
    localStorage.setItem('user', JSON.stringify(parsedName));
    setNewName('');
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
  }

  /*  Temporizador para buscar mensagens e atualizar horario no chat */
  const [tempo, setTempo] = useState(new Date().toLocaleTimeString());

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
        }
      )
      .subscribe((status) => {
        console.log(status);
      });

    // Busca mensagens no banco de dados
    async function buscarMensagem() {
      const { error, data } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      if (error) {
        console.log('Não foi possível efetuar a buscar: ', error);
      } else {
        setMensagens(data);
      }
    }
    buscarMensagem();
    const intervaloID = setInterval(() => {
      setTempo(new Date().toLocaleTimeString());
    }, 500);
    return () => {
      clearInterval(intervaloID);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  return (
    <div className={styles.divChat}>
      <div className={styles.divChatIntern}>
        <div className={styles.divChatInternChangeName}>
          <input
            type='text'
            placeholder='Digite um nome'
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
          />
          <input type='button' value='Ok' onClick={changeName} />
        </div>
        <div className={styles.divChatInternTitle}>
          <h1>Public Chat</h1>
          <p>{tempo}</p>
        </div>
        <div className={styles.divChatInternMessages}>
          {mensagens.map((mensagem, index) => {
            let userParsed1;
            try {
              const userParsed = JSON.parse(user);
              userParsed1 = Array.isArray(userParsed) ? userParsed : [];
            } catch {
              userParsed1 = [];
            }

            const mensagemUsername = JSON.parse(mensagem.username);
            const mensagemUsernameFinal =
              mensagemUsername[mensagemUsername.length - 1];
            const isMyMessages = mensagemUsername.every((valor) =>
              userParsed1.includes(valor)
            );
            const mensagemId = mensagem.id;
            const mensagemCountryFlag = mensagem.country_flag;
            const mensagemText = mensagem.text;
            const mensagemTimeStamp = new Date(
              new Date(mensagem.timestamp).setHours(
                new Date(mensagem.timestamp).getHours() - 3
              )
            ).toLocaleTimeString();

            return (
              <div
                key={mensagemId}
                ref={index === mensagens.length - 1 ? lastMessageRef : null}
                className={
                  isMyMessages ? styles.divMyMessages : styles.divOthersMessages
                }
              >
                <strong>{mensagemUsernameFinal}</strong>{' '}
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
          })}
        </div>
        <div className={styles.divChatInternInputMessage}>
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
