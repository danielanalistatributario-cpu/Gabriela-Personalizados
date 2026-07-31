import { readJsonBody, sendJson, sendError, methodNotAllowed, HttpError } from './_lib/http.js';
import { exigeAdmin } from './_lib/auth.js';
import { salvaFoto } from './_lib/store.js';

const LIMITE_BYTES = 4 * 1024 * 1024;
const PREFIXO = /^data:(image\/[a-z+]+);base64,/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    exigeAdmin(req);

    const { arquivo } = await readJsonBody(req);

    if (typeof arquivo !== 'string' || !PREFIXO.test(arquivo)) {
      throw new HttpError(400, 'Envie a imagem como data URL (data:image/...;base64,...).');
    }

    const tipo = arquivo.match(PREFIXO)[1].toLowerCase();
    const buffer = Buffer.from(arquivo.replace(PREFIXO, ''), 'base64');

    if (buffer.length === 0) {
      throw new HttpError(400, 'A imagem enviada está vazia.');
    }

    if (buffer.length > LIMITE_BYTES) {
      throw new HttpError(413, 'A imagem passou de 4 MB mesmo depois de reduzida.');
    }

    const url = await salvaFoto(buffer, tipo);
    sendJson(res, 200, { url });
  } catch (err) {
    sendError(res, err);
  }
}
