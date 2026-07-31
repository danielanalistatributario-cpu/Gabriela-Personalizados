import { readJsonBody, sendJson, sendError, methodNotAllowed } from './_lib/http.js';
import { adminEstaConfigurado, senhaConfere, criaToken } from './_lib/auth.js';
import { modoArmazenamento } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    if (!adminEstaConfigurado()) {
      return sendJson(res, 503, {
        erro: 'A área administrativa ainda não foi configurada neste site. Defina a variável ADMIN_SENHA na Vercel.'
      });
    }

    const { senha } = await readJsonBody(req);

    if (!senhaConfere(senha)) {
      return sendJson(res, 401, { erro: 'Senha incorreta.' });
    }

    sendJson(res, 200, {
      token: criaToken(),
      armazenamento: modoArmazenamento()
    });
  } catch (err) {
    sendError(res, err);
  }
}
