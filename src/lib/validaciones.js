// ─── Utilidades de validación y sanitización de inputs (Admin Web) ────────────
// Importar donde se necesite: import { soloLetras, soloDni, ... } from '@/lib/validaciones'

/**
 * Solo permite letras (incluye tildes, ñ, espacios).
 * Uso en Input: onChange={e => setVal(soloLetras(e.target.value))}
 */
export function soloLetras(text) {
  return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
}

/**
 * Solo permite dígitos, máximo 8 caracteres (DNI peruano).
 */
export function soloDni(text) {
  return text.replace(/[^0-9]/g, '').slice(0, 8);
}

/**
 * Solo permite dígitos sin límite de longitud.
 */
export function soloNumeros(text) {
  return text.replace(/[^0-9]/g, '');
}

/**
 * Letras y números, sin caracteres especiales. Para placa de bus.
 * Convierte a mayúsculas y permite guión.
 */
export function soloAlfanumerico(text) {
  return text.replace(/[^a-zA-Z0-9\-]/g, '').toUpperCase();
}

/**
 * Capitaliza automáticamente la primera letra de cada palabra.
 * Útil al aplicar después de soloLetras en campos nombre/apellido.
 */
export function capitalizarPalabras(text) {
  return text
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
