/**
 * Mock backend API for the MIMO Self-Service Printing Kiosk.
 *
 * Replace these functions with real HTTP / WebSocket endpoints when connecting
 * to the physical MIMO print server:
 * - verify(code): POST /api/jobs/verify { code } -> boolean
 * - getPrintJob(code): GET /api/jobs/:code -> { userName, totalPages, documentTitle }
 */

/**
 * Verifies a 4-digit print release code.
 * Resolves after ~800ms. Accepts any 4-digit code except "0000" so the
 * invalid-code shake and error feedback can be tested reliably.
 *
 * @param {string} code - 4-digit numeric string
 * @returns {Promise<boolean>}
 */
export async function verify(code) {
  await new Promise(resolve => setTimeout(resolve, 800));
  const clean = String(code ?? '').trim();
  if (!/^\d{4}$/.test(clean)) return false;
  if (clean === '0000') return false;
  return true;
}

/**
 * Returns mock print job metadata for a verified release code.
 *
 * @param {string} code
 * @returns {{ userName: string, totalPages: number, documentTitle: string }}
 */
export function getPrintJob(code) {
  const digits = String(code ?? '1234').replace(/\D/g, '');
  const seed = digits.split('').reduce((acc, ch) => acc + Number(ch), 0);
  const totalPages = 8 + (seed % 9);

  const userMap = {
    '1234': 'Demo',
    '2027': 'Guest',
    '1111': 'Alex',
    '2222': 'Maya'
  };

  return {
    userName: userMap[digits] || 'Demo',
    totalPages,
    documentTitle: `MIMO-Job-${digits || '2027'}.pdf`
  };
}
