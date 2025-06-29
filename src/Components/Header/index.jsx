import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleHalfStroke,
  faArrowUpRightFromSquare,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';

function alterar_tema() {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  useEffect(() => {
    const savedtheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedtheme);
  }, []);
  return (
    <div className={styles.divHeader}>
      <div>
        <h1>Public Chat</h1>
        <h1>
          GitHub:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://github.com/angelimgabriel/'
            style={{ fontWeight: 'normal', textDecoration: 'none' }}
          >
            Gabriel Angelim <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </h1>
      </div>
      <div className={styles.divGitHub}>
        {/* <div>
          <FontAwesomeIcon
            style={{ cursor: 'pointer' }}
            icon={faBars}
            size='2xl'
            onClick={() => setMenuVisible(!menuVisible)}
          />
          <div
            style={{ display: menuVisible ? 'flex' : 'none' }}
            className={styles.divMenu}
          >
            <button
              className={styles.buttonGitHub}
              type='button'
              onClick={() =>
                window.open(
                  'https://github.com/login/oauth/authorize?client_id=Ov23liWJCDfwHQ9HJB1Y&scope=read:user',
                  'Login com GitHub',
                  'width=600,height=700'
                )
              }
            >
              <FontAwesomeIcon
                icon={faGithub}
                size='xl'
                className={styles['icon-brands']}
              />
              Login
            </button>
          </div>
        </div> */}
        <FontAwesomeIcon
          onClick={alterar_tema}
          id='theme'
          icon={faCircleHalfStroke}
          size='2xl'
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
