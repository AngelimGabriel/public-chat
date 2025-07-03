export default async function verificarToken() {
  const token = localStorage.getItem('token');
  const userOld = localStorage.getItem('userOld');
  if (!token) return;
  try {
    const response = await fetch(
      'https://public-chat-react-backend.onrender.com/verifytoken',
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok)
      throw new Error('Não foi possível efetuar a verificação.');

    const data = await response.json();

    if (!data.auth) {
      localStorage.setItem('auth', 'false');
      localStorage.removeItem('token');
      localStorage.setItem('user', userOld);
      localStorage.setItem('userOld', '');
    } else {
      localStorage.setItem('auth', 'true');
    }
  } catch (error) {
    localStorage.setItem('auth', 'false');
    localStorage.removeItem('token');
    console.log(error);
  }
}
