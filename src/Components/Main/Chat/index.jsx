import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../../../supabaseCliente";

const user = localStorage.getItem('user')

export default function Chat() {
  const [text, setText] = useState("");
  const [mensagens, setMensagens] = useState([]);

  async function buscarMensagem() {
    const { error, data } = await supabase.from("messages").select();

    if (error) {
      console.log("Não foi possível efetuar a buscar: ", error);
    } else {
      setMensagens(data);
    }
  }

  async function gravarMensagem() {
    if (!text.trim() || !user.trim()) return;

    await supabase.from("messages").insert({
      username: user,
      text: text,
      country: "brazil",
      is_authenticated: false,
    });
    setText("");
    buscarMensagem();
  }

  /*  Temporizador  */
  const [tempo, setTempo] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const intervaloID = setInterval(() => {
      setTempo(new Date().toLocaleTimeString());
      buscarMensagem();
    }, 500);
    return () => clearInterval(intervaloID);
  }, []);

  return (
    <div className={styles.divChat}>
      <div className={styles.divChatIntern}>
        <div>
          <h1>Public Chat</h1>
          <p>{tempo}</p>
        </div>
        <div>
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={
                mensagem.username === user
                  ? styles.divMyMessages
                  : styles.divOthersMessages
              }
            >
              <strong>{mensagem.username}</strong>
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
            type="text"
            placeholder="Digite uma mensagem"
            value={text}
            onKeyDown={(e) => (e.key === "Enter" ? gravarMensagem() : null)}
          />
          <FontAwesomeIcon
            onClick={gravarMensagem}
            icon={faPaperPlane}
            size="2xl"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
