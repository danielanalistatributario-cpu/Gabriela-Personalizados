# Como ligar a publicação de verdade

Depois deste commit, o site guarda os produtos, categorias, ofertas e fotos
**no servidor**. O que a Gabriela salva no painel aparece na hora para todos os
clientes, em qualquer aparelho.

Para isso funcionar faltam três coisas no painel da Vercel. Leva uns 5 minutos.

> **Enquanto isso não for feito:** o site continua no ar normalmente para os
> clientes (mostrando o conteúdo do arquivo `dados-iniciais.json`), mas a área
> restrita vai avisar que ainda não foi configurada e não deixará entrar.

---

## 1. Criar o banco de dados (textos e preços)

1. Abra o projeto na Vercel → aba **Storage** → **Create Database**.
2. Escolha **Redis** (Upstash) → região mais perto do Brasil
   (`São Paulo` ou `us-east-1`) → **Create**.
3. Na tela seguinte, clique em **Connect Project** e escolha este projeto,
   marcando os ambientes **Production**, **Preview** e **Development**.

A Vercel cria sozinha as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
Não precisa copiar nada à mão.

## 2. Criar o armazenamento de fotos

1. Ainda em **Storage** → **Create Database** → escolha **Blob**.
2. Dê um nome (por exemplo `fotos-gabriela`) → **Create**.
3. **Connect Project** → este projeto → os três ambientes.

Isso cria a variável `BLOB_READ_WRITE_TOKEN`.

## 3. Definir a senha da área restrita

1. Vá em **Settings** → **Environment Variables**.
2. Adicione:

   | Nome          | Valor                                   |
   |---------------|-----------------------------------------|
   | `ADMIN_SENHA` | a senha que a Gabriela vai usar          |
   | `AUTH_SECRET` | qualquer texto longo e aleatório         |

   Marque os três ambientes em cada uma.

3. **Redeploy** o projeto (aba Deployments → menu do último deploy →
   **Redeploy**), para as variáveis entrarem em vigor.

### Sobre a senha

A senha antiga (`1234`) ficava escrita dentro do arquivo `script.js`, ou seja,
qualquer visitante conseguia lê-la e alterar o site. Agora ela vive só na
Vercel e é conferida no servidor. **Escolha uma senha nova e não use `1234`.**

O `AUTH_SECRET` é o que assina a sessão de 12 horas. Pode ser qualquer coisa
comprida, por exemplo o resultado de digitar teclas ao acaso.

---

## Primeiro acesso depois de configurar

1. Abra o site e entre na área restrita (3 cliques no logo, ou o link
   "Área Restrita" no rodapé).
2. Se a Gabriela tinha produtos cadastrados no navegador dela pela versão
   antiga, o site vai perguntar se quer publicá-los. Respondendo **OK**, as
   fotos sobem para o servidor e o conteúdo passa a valer para todos.
3. A partir daí, cada "Salvar" publica na hora.

O botão **Backup** mostra se a publicação está ativa e permite baixar uma cópia
de tudo em `.json`.

---

## Rodar na sua máquina

```bash
npm install
npm run dev
```

Abre em `http://localhost:4173` com a senha `1234`. Nesse modo o conteúdo vai
para `.dados/conteudo.json` e as fotos para `uploads/` — as duas pastas ficam
fora do Git. Serve para testar sem tocar no site publicado.

---

## Como ficou organizado

| Arquivo                 | Para que serve                                        |
|-------------------------|-------------------------------------------------------|
| `index.html`            | estrutura da página e as telas do painel               |
| `styles.css`            | aparência                                              |
| `script.js`             | a página e o painel; conversa com a API                |
| `dados-iniciais.json`   | conteúdo de partida e reserva se a API cair            |
| `api/content.js`        | lê e publica o conteúdo do site                        |
| `api/upload.js`         | recebe as fotos                                        |
| `api/login.js`          | confere a senha e devolve a sessão                     |
| `api/_lib/`             | armazenamento, autenticação e utilidades compartilhadas|
| `dev-server.js`         | servidor local (a Vercel ignora)                       |
