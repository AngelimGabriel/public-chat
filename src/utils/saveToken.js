export default function saveToken() {
  const hash = window.location.hash;

  if (hash.startsWith('#token=')) {
    const params = new URLSearchParams(window.location.search);
    const userNew = params.get('username');
    const auth = params.get('auth');
    const token = hash.replace('#token=', '');
    localStorage.setItem('token', token);
    localStorage.setItem('auth', auth);
    localStorage.setItem('userOld', localStorage.getItem('user'));
    localStorage.setItem('user', userNew);
    window.history.replaceState(null, '', window.location.pathname);
  }
}
