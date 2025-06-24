import styles from './style.module.css';
import packageJsonInfo from '../../../package.json';

export default function Footer() {
  console.log();
  return (
    <div className={styles.divFooter}>
      <p>
        Projeto desenvolvido por Gabriel Angelim - V{packageJsonInfo.version}
      </p>
    </div>
  );
}
