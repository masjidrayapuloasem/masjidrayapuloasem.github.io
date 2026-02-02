/**
 * Centralized error handling utilities
 * Maps database errors to user-friendly messages to prevent information leakage
 */

type PostgresErrorCode = string;

const ERROR_CODE_MAP: Record<PostgresErrorCode, string> = {
  '23505': 'Data sudah ada', // unique_violation
  '23503': 'Referensi data tidak valid', // foreign_key_violation
  '23502': 'Data wajib tidak boleh kosong', // not_null_violation
  '23514': 'Data tidak valid', // check_violation
  '22001': 'Data terlalu panjang', // string_data_right_truncation
  '42501': 'Akses ditolak', // insufficient_privilege
  '42P01': 'Terjadi kesalahan sistem', // undefined_table (hide table info)
  'PGRST301': 'Akses ditolak', // RLS violation via PostgREST
};

/**
 * Maps a database error to a user-friendly message
 * Prevents leaking internal database structure information
 */
export function mapErrorToUserMessage(error: unknown, fallbackMessage: string): string {
  if (!error || typeof error !== 'object') {
    return fallbackMessage;
  }

  const err = error as { code?: string; message?: string };

  // Check for known Postgres error codes
  if (err.code && ERROR_CODE_MAP[err.code]) {
    return ERROR_CODE_MAP[err.code];
  }

  // Check for RLS-related errors in message (without exposing details)
  if (err.message?.toLowerCase().includes('rls') || 
      err.message?.toLowerCase().includes('policy') ||
      err.message?.toLowerCase().includes('permission')) {
    return 'Akses ditolak';
  }

  // Check for network errors
  if (err.message?.toLowerCase().includes('network') ||
      err.message?.toLowerCase().includes('fetch')) {
    return 'Gagal terhubung ke server';
  }

  // Development mode: show actual error for debugging
  if (import.meta.env.DEV && err.message) {
    return err.message;
  }

  // Production: return generic fallback
  return fallbackMessage;
}

/**
 * Validates a URL to ensure it uses safe protocols
 * Only allows http:, https:, and relative URLs starting with /
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim();
  
  // Allow relative URLs starting with single /
  if (trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(trimmedUrl, window.location.origin);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * List of dangerous URL protocols that should be blocked
 */
export const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'file:',
  'vbscript:',
  'blob:',
];
