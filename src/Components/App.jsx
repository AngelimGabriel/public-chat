import './App.css';
import Header from './Header';
import Main from './Main';
import UserData from './UserData';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import saveToken from '../utils/saveToken';
import verificarToken from '../utils/verifyJWT';

export default function App() {
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  useEffect(() => {
    saveToken();
    verificarToken();
  }, []);

  return (
    <>
      <UserData onReady={() => setIsUserDataReady(true)} />
      {isUserDataReady && (
        <>
          <Header />
          <Main />
          <Footer />
        </>
      )}
    </>
  );
}
