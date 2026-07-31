import { readJsonBody, sendJson, sendError, methodNotAllowed, HttpError } from './_lib/http.js';
import { exigeAdmin } from './_lib/auth.js';
import { salvaFoto } from './_lib/store.js';

const LIMITE_BYTES = 4 * 1024 * 1024;
const PREFIXO = /^data:(image\/[a-z+]+);base64,/i;

async function guardaDataUrl(dataUrl, rotulo) {
  if (typeof dataUrl !== 'string' || !PREFIXO.test(dataUrl)) {
    throw new HttpError(400, `${rotulo} precisa vir como data URL (data:image/...;base64,...).`);
  }

  const tipo = dataUrl.match(PREFIXO)[1].toLowerCase();
  const buffer = Buffer.from(dataUrl.replace(PREFIXO, ''), 'base64');

  if (buffer.length === 0) {
    throw new HttpError(400, `${rotulo} enviada está vazia.`);
  }

  if (buffer.length > LIMITE_BYTES) {
    throw new HttpError(413, `${rotulo} passou de 4 MB mesmo depois de reduzida.`);
  }

  return salvaFoto(buffer, tipo);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    exigeAdmin(req);

    const { arquivo, miniatura } = await readJsonBody(req);

    const url = await guardaDataUrl(arquivo, 'A imagem');

    // A miniatura é opcional: sem ela, a própria foto serve de prévia.
    const thumb = miniatura ? await guardaDataUrl(miniatura, 'A miniatura') : url;

    sendJson(res, 200, { url, thumb });
  } catch (err) {
    sendError(res, err);
  }
}
