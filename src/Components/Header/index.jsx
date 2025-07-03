import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleHalfStroke,
  faArrowUpRightFromSquare,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
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
  const authenticated = localStorage.getItem('auth') === 'true';

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
        <div>
          <FontAwesomeIcon
            onClick={() => setMenuVisible(!menuVisible)}
            id='theme'
            icon={faBars}
            size='2xl'
            style={{ cursor: 'pointer' }}
          />
          <div
            style={{
              opacity: menuVisible ? '1' : '0',
              visibility: menuVisible ? 'visible' : 'hidden',
            }}
            className={styles.divMenu}
          >
            {!authenticated ? (
              <>
                <h1>Login</h1>
                <button
                  className={styles.buttonGitHub}
                  onClick={() => {
                    window.location.href =
                      'https://github.com/login/oauth/authorize?client_id=Ov23liWJCDfwHQ9HJB1Y&scope=user:email';
                  }}
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className={styles.githubLogo}
                    size='xl'
                  />
                  GitHub
                </button>
                {/* <button className={styles.buttonGoogle}>
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className={styles.googleLogo}
                    size='xl'
                  />
                  Google
                </button> */}
              </>
            ) : (
              <h1>Logado</h1>
            )}
          </div>
        </div>
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
