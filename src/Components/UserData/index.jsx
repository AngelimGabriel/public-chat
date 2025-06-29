import { useEffect } from 'react';
export default function UserData() {
  useEffect(() => {
    async function InitUser() {
      const country = localStorage.getItem('country');
      const user = localStorage.getItem('user');

      if (!country) {
        try {
          const geoRes = await fetch('https://geolocation-db.com/json/');
          const geoData = await geoRes.json();
          const country_name = geoData.country_name;

          const flagRes = await fetch(
            `https://restcountries.com/v3.1/name/${country_name}`
          );
          const flagData = await flagRes.json();

          const flag_url = flagData[0]?.flags?.png;

          if (country_name && flag_url) {
            localStorage.setItem('country', country_name);
            localStorage.setItem('flag', flag_url);
          } else {
            console.warn('Não foi possivel obter o país e a bandeira.');
          }
        } catch (error) {
          console.error('Erro ao buscar bandeira e pais: ', error);
        }
      }
      if (!user) {
        localStorage.setItem(
          'user',
          `@user${Math.floor(Math.random() * 100000)}`
        );
      } else {
        localStorage.setItem('user', user.replace(/[\[\]"]/g, ''));
      }
    }
    InitUser();
  }, []);
  return null;
}
