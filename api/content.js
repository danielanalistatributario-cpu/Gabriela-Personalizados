import { readJsonBody, sendJson, sendError, methodNotAllowed, HttpError } from './_lib/http.js';
import { exigeAdmin } from './_lib/auth.js';
import { leConteudo, gravaConteudo, modoArmazenamento } from './_lib/store.js';

// Só estes campos são aceitos: evita que qualquer coisa seja gravada no banco.
const CAMPOS = ['categories', 'products', 'promos', 'promoSettings'];

function validaConteudo(corpo) {
  if (!corpo || typeof corpo !== 'object') {
    throw new HttpError(400, 'Conteúdo inválido.');
  }

  for (const campo of ['categories', 'products', 'promos']) {
    if (!Array.isArray(corpo[campo])) {
      throw new HttpError(400, `O campo "${campo}" precisa ser uma lista.`);
    }
  }

  if (!corpo.promoSettings || typeof corpo.promoSettings !== 'object') {
    throw new HttpError(400, 'O campo "promoSettings" precisa ser um objeto.');
  }

  const limpo = {};
  for (const campo of CAMPOS) limpo[campo] = corpo[campo];
  return limpo;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const conteudo = await leConteudo();

      return sendJson(res, 200, {
        // null significa "ainda não publicaram nada": o site usa o conteúdo inicial.
        conteudo,
        armazenamento: modoArmazenamento()
      });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      exigeAdmin(req);

      const corpo = await readJsonBody(req);
      const documento = await gravaConteudo(validaConteudo(corpo));

      return sendJson(res, 200, {
        ok: true,
        atualizadoEm: documento.atualizadoEm
      });
    }

    methodNotAllowed(res, ['GET', 'PUT']);
  } catch (err) {
    sendError(res, err);
  }
}
