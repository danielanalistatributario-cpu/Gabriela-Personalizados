/* Camada de armazenamento.

   Em produção (Vercel):
     - o conteúdo do site (produtos, categorias, ofertas, campanha) fica
       num Redis, gravado como um único documento JSON;
     - as fotos vão para o Vercel Blob.

   Sem essas variáveis de ambiente configuradas, cai para arquivos locais,
   o que permite rodar e testar o site na própria máquina. Na Vercel o disco
   é somente leitura, então lá o modo local não é usado. */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { HttpError } from './http.js';

const CHAVE_CONTEUDO = 'gg:conteudo';
const PASTA_LOCAL = path.join(process.cwd(), '.dados');
const ARQUIVO_LOCAL = path.join(PASTA_LOCAL, 'conteudo.json');
const PASTA_UPLOADS = path.join(process.cwd(), 'uploads');

function configRedis() {
  const url = process.env.KV_REST_API_URL
    || process.env.UPSTASH_REDIS_REST_URL
    || process.env.REDIS_REST_API_URL;

  const token = process.env.KV_REST_API_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN
    || process.env.REDIS_REST_API_TOKEN;

  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

/* Há dois tipos de Redis no marketplace da Vercel:
   - Upstash, que fala HTTP e injeta KV_REST_API_URL / KV_REST_API_TOKEN;
   - Redis Cloud (e similares), que injeta uma conexão redis:// em REDIS_URL.
   Aceitamos os dois para que qualquer escolha no painel funcione. */
function urlRedisTcp() {
  return process.env.REDIS_URL || process.env.REDIS_URI || null;
}

function temArmazenamentoDeConteudo() {
  return Boolean(configRedis() || urlRedisTcp());
}

function blobConfigurado() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function modoArmazenamento() {
  let conteudo = 'arquivo-local';
  if (configRedis()) conteudo = 'redis-http';
  else if (urlRedisTcp()) conteudo = 'redis';

  return {
    conteudo,
    fotos: blobConfigurado() ? 'vercel-blob' : 'arquivo-local',
    publicavel: Boolean(temArmazenamentoDeConteudo() && blobConfigurado())
  };
}

// Abre a conexão, faz a operação e fecha: em funções serverless não vale
// a pena manter conexão viva entre chamadas.
async function comClienteRedis(acao) {
  const { createClient } = await import('redis');

  const cliente = createClient({
    url: urlRedisTcp(),
    socket: {
      connectTimeout: 5000,
      // Sem isto o cliente tentaria reconectar para sempre e a função
      // ficaria pendurada até estourar o tempo limite da Vercel.
      reconnectStrategy: false
    }
  });

  cliente.on('error', err => console.error('Erro no Redis:', err.message));

  try {
    await cliente.connect();
  } catch (err) {
    throw new HttpError(502, `Não foi possível conectar ao banco de dados: ${err.message}`);
  }

  try {
    return await acao(cliente);
  } finally {
    await cliente.quit().catch(() => {});
  }
}

/* ----------------------------- conteúdo ----------------------------- */

async function redisGet(chave) {
  const cfg = configRedis();

  const resposta = await fetch(`${cfg.url}/get/${encodeURIComponent(chave)}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    cache: 'no-store'
  });

  if (!resposta.ok) {
    throw new HttpError(502, `Não foi possível ler os dados do site (Redis ${resposta.status}).`);
  }

  const { result } = await resposta.json();
  return result ?? null;
}

async function redisSet(chave, valor) {
  const cfg = configRedis();

  const resposta = await fetch(`${cfg.url}/set/${encodeURIComponent(chave)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'text/plain; charset=utf-8'
    },
    body: valor
  });

  if (!resposta.ok) {
    throw new HttpError(502, `Não foi possível gravar os dados do site (Redis ${resposta.status}).`);
  }
}

export async function leConteudo() {
  let bruto = null;

  if (configRedis()) {
    bruto = await redisGet(CHAVE_CONTEUDO);
  } else if (urlRedisTcp()) {
    bruto = await comClienteRedis(cliente => cliente.get(CHAVE_CONTEUDO));
  } else {
    try {
      bruto = await fs.readFile(ARQUIVO_LOCAL, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      bruto = null;
    }
  }

  if (!bruto) return null;

  try {
    return typeof bruto === 'string' ? JSON.parse(bruto) : bruto;
  } catch {
    throw new HttpError(500, 'Os dados salvos do site estão corrompidos.');
  }
}

// Na Vercel o disco é somente leitura: sem Redis não há como gravar nada.
function exigeArmazenamentoDeConteudo() {
  if (!temArmazenamentoDeConteudo() && process.env.VERCEL) {
    throw new HttpError(503,
      'O banco de dados do site ainda não foi configurado. ' +
      'Crie um Redis em "Armazenar", na Vercel, e conecte-o a este projeto.'
    );
  }
}

function exigeArmazenamentoDeFotos() {
  if (!blobConfigurado() && process.env.VERCEL) {
    throw new HttpError(503,
      'O armazenamento de fotos ainda não foi configurado. ' +
      'Crie um Blob na aba Storage da Vercel e conecte-o a este projeto.'
    );
  }
}

export async function gravaConteudo(conteudo) {
  exigeArmazenamentoDeConteudo();

  const documento = {
    ...conteudo,
    atualizadoEm: new Date().toISOString()
  };

  const texto = JSON.stringify(documento);

  if (configRedis()) {
    await redisSet(CHAVE_CONTEUDO, texto);
  } else if (urlRedisTcp()) {
    await comClienteRedis(cliente => cliente.set(CHAVE_CONTEUDO, texto));
  } else {
    await fs.mkdir(PASTA_LOCAL, { recursive: true });
    await fs.writeFile(ARQUIVO_LOCAL, texto, 'utf8');
  }

  return documento;
}

/* ------------------------------- fotos ------------------------------ */

const EXTENSAO_POR_TIPO = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

export async function salvaFoto(buffer, tipo) {
  exigeArmazenamentoDeFotos();

  const extensao = EXTENSAO_POR_TIPO[tipo];

  if (!extensao) {
    throw new HttpError(415, 'Formato de imagem não suportado. Envie JPG, PNG, WEBP ou GIF.');
  }

  const nome = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extensao}`;

  if (blobConfigurado()) {
    const { put } = await import('@vercel/blob');

    const blob = await put(`fotos/${nome}`, buffer, {
      access: 'public',
      contentType: tipo,
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000
    });

    return blob.url;
  }

  await fs.mkdir(PASTA_UPLOADS, { recursive: true });
  await fs.writeFile(path.join(PASTA_UPLOADS, nome), buffer);
  return `/uploads/${nome}`;
}
