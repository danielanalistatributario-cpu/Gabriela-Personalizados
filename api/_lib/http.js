/* Utilitários compartilhados pelas funções da API. */

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Lê o corpo da requisição como JSON, funcionando tanto na Vercel
// (que às vezes já entrega req.body pronto) quanto no servidor local.
export async function readJsonBody(req, limitBytes = 6 * 1024 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body;

  if (typeof req.body === 'string' && req.body.length > 0) {
    return parseJson(req.body);
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > limitBytes) {
      throw new HttpError(413, 'O arquivo enviado é grande demais.');
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};
  return parseJson(Buffer.concat(chunks).toString('utf8'));
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, 'O conteúdo enviado não é um JSON válido.');
  }
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

export function sendError(res, error) {
  const status = error instanceof HttpError ? error.status : 500;

  if (status >= 500) console.error(error);

  sendJson(res, status, {
    erro: status >= 500 ? 'Erro interno no servidor.' : error.message
  });
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  sendJson(res, 405, { erro: `Método não permitido. Use: ${allowed.join(', ')}.` });
}
