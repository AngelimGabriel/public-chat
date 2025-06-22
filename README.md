# Public Chat

Aplicação desenvolvida para aplicar os conhecimentos adquiridos em desenvolvimento web.

## 🛠 Tecnologias

- **React** – Front-end, requisições para APIs externas e manipulação do banco de dados
- **Vite** – Ferramenta moderna para desenvolvimento e build
- **Supabase** – Banco de dados com dialeto PostgreSQL, usado como backend

## 🌐 APIs Utilizadas

- [Geolocation DB](https://geolocation-db.com/json) – Busca o país de origem do usuário
- [REST Countries](https://restcountries.com/v3.1/name/{country}) – Retorna a bandeira PNG do país

## ⚙️ Funcionalidades

- Ao acessar o site pela primeira vez, o app verifica se o país (`country`) e a bandeira (`flag`) estão armazenados no `localStorage`. Se não estiverem, busca essas informações nas APIs externas e as salva localmente.
- Também gera automaticamente um nome de usuário aleatório no formato `@userXXXXX`, salvo no `localStorage` com a chave `user`.

```js
localStorage.setItem('user', `@user${Math.floor(Math.random() * 100000)}`);
```

## 📝 Como utilizar

1. Clone o repositório:

   - `git clone https://github.com/AngelimGabriel/public-chat.git`

2. Instale as dependências:

   - `npm install`

3. Altere o arquivo package.json:

Altere o script `dev` para o IP da sua máquina para permitir acesso pela rede:

```json
"dev": "vite --host 192.168.0.2"
```

Ou deixe somente para rodar no localhost:

```json
"dev": "vite"
```

logo em seguida inicie o servidor:

4. Inicie o servidor:

   - `npm run dev`

5. Abra o navegador no endereço indicado pelo terminal (normalmente `http://localhost:3000`) e, se quiser, mantenha a aba Network aberta para monitorar as requisições.
