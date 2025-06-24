import styles from './style.module.css';
import Chat from './Chat';
import Sidebar from '../Sidebar';

export default function Main() {
  return (
    <div className={styles.divMain}>
      <Sidebar />
      <Chat />
    </div>
  );
}
