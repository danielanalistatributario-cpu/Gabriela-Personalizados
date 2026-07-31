/* Servidor de desenvolvimento — usado apenas na máquina local.

   Na Vercel, cada arquivo dentro de api/ vira uma função automaticamente e
   este arquivo é ignorado. Aqui ele serve os arquivos estáticos e encaminha
   /api/* para os mesmos handlers, para dar para testar tudo antes de publicar.

   Uso:  ADMIN_SENHA=1234 npm run dev     (ou apenas: npm run dev) */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PORTA = Number(process.env.PORT) || 4173;

// A camada de armazenamento grava relativo ao diretório atual.
process.chdir(RAIZ);

if (!process.env.ADMIN_SENHA) process.env.ADMIN_SENHA = '1234';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const rotas = {
  '/api/login': () => import('./api/login.js'),
  '/api/content': () => import('./api/content.js'),
  '/api/upload': () => import('./api/upload.js')
};

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const caminho = decodeURIComponent(url.pathname);

  const rota = rotas[caminho];

  if (rota) {
    try {
      const modulo = await rota();
      await modulo.default(req, res);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ erro: 'Erro interno no servidor de desenvolvimento.' }));
    }
    return;
  }

  await serveEstatico(caminho, res);
});

async function serveEstatico(caminho, res) {
  const relativo = caminho === '/' ? 'index.html' : caminho.replace(/^\/+/, '');
  const destino = path.join(RAIZ, relativo);

  // Impede sair da pasta do projeto por caminhos como /../../algo
  if (!destino.startsWith(RAIZ)) {
    res.statusCode = 403;
    res.end('Acesso negado');
    return;
  }

  try {
    const conteudo = await fs.readFile(destino);
    res.statusCode = 200;
    res.setHeader('Content-Type', TIPOS[path.extname(destino).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(conteudo);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Arquivo não encontrado');
  }
}

servidor.listen(PORTA, () => {
  console.log(`Site local em http://localhost:${PORTA}`);
  console.log(`Senha da área restrita: ${process.env.ADMIN_SENHA}`);
  console.log('Conteúdo salvo em .dados/conteudo.json e fotos em uploads/');
});
