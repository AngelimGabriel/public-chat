import './App.css';
import Header from './Header';
import Main from './Main';
import UserData from './UserData';
import Footer from './Footer';
// import Notice from './Notice';

function App() {
  // const notice = localStorage.getItem('notice');
  return (
    <>
      {/* {notice === 'false' && <Notice />} */}
      <UserData />
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;
