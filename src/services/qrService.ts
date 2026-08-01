/**
 * QR Code Service for DevTech IT Solution
 * Ensures QR codes encode ONLY a secure verification URL and never raw PII.
 */

export const getVerificationUrl = (employeeId: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://devtechitsolution.com';
  return `${origin}/verify/${encodeURIComponent(employeeId)}`;
};

export const parseVerificationIdFromUrl = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  
  // Search for pattern matching DTS followed by digits or alphanumeric sequences (e.g. DTS001, DTS-2026-0001)
  const match = trimmed.match(/DTS(?:-?[A-Z0-9]+)+/i);
  if (match) {
    return match[0].toUpperCase();
  }
  
  return trimmed.toUpperCase();
};

