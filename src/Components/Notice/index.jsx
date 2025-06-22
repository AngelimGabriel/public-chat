import styles from './style.module.css';

export default function Notice() {
  return (
    <div className={styles.divNotice}>
      <div className={styles.divMessage}>
        <h1>
          Esta aplicação é um chat público. Não compartilhe dados pessoais nem
          ofenda outros usuários.
        </h1>
        <div className={styles.divMessageBotoes}>
          <input
            type='button'
            value='Concordo'
            onClick={localStorage.setItem('notice', true)}
          />
          <input type='button' value='Discordo' />
        </div>
      </div>
    </div>
  );
}
