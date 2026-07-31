/* Autenticação da área administrativa.

   A senha fica na variável de ambiente ADMIN_SENHA, nunca no código que
   vai para o navegador. O login devolve um token assinado com validade
   de 12 horas; as gravações exigem esse token. */

import crypto from 'node:crypto';
import { HttpError } from './http.js';

const VALIDADE_MS = 12 * 60 * 60 * 1000;

function senhaConfigurada() {
  return process.env.ADMIN_SENHA || process.env.ADMIN_PASSWORD || '';
}

function segredo() {
  // Sem AUTH_SECRET próprio a assinatura usa a senha como chave: continua
  // funcionando, mas trocar a senha invalida os tokens já emitidos.
  return process.env.AUTH_SECRET || senhaConfigurada();
}

export function adminEstaConfigurado() {
  return senhaConfigurada().length > 0;
}

// Comparação em tempo constante, para não vazar a senha pelo tempo de resposta.
function comparaSeguro(a, b) {
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function senhaConfere(candidata) {
  const esperada = senhaConfigurada();
  if (!esperada) return false;
  return comparaSeguro(candidata ?? '', esperada);
}

function assina(payload) {
  return crypto.createHmac('sha256', segredo()).update(payload).digest('base64url');
}

export function criaToken() {
  const payload = Buffer
    .from(JSON.stringify({ exp: Date.now() + VALIDADE_MS }), 'utf8')
    .toString('base64url');

  return `${payload}.${assina(payload)}`;
}

export function tokenValido(token) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  if (!segredo()) return false;

  const [payload, assinatura] = token.split('.');
  if (!payload || !assinatura) return false;
  if (!comparaSeguro(assinatura, assina(payload))) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' && Date.now() < exp;
  } catch {
    return false;
  }
}

// Usada pelas rotas de gravação: interrompe com 401 se o token não valer.
export function exigeAdmin(req) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7).trim() : '';

  if (!tokenValido(token)) {
    throw new HttpError(401, 'Sessão expirada ou inválida. Entre novamente na área restrita.');
  }
}
