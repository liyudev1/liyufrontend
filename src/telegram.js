// src/telegram.js — small helpers for the Telegram Mini App environment.
// Everything is optional-chained: outside Telegram (a normal browser tab)
// window.Telegram is undefined and these simply return null.

/**
 * The signed initData string. Send this to the backend as `init_data`; the
 * server verifies the signature and extracts the real Telegram user id.
 * Never send a bare chat_id taken from initDataUnsafe — it can be faked.
 */
export function getTelegramInitData() {
  try {
    return window?.Telegram?.WebApp?.initData || null;
  } catch {
    return null;
  }
}
