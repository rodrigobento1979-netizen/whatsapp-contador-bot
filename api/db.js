import { get, set } from '@vercel/edge-config';

/**
 * Recupera a sessão do usuário.
 */
export async function getSession(user) {
    const data = await get(`session_${user}`);
    return data || {
        step: "awaiting-name",
        name: null,
        company: null,
        department: null
    };
}

/**
 * Salva a sessão do usuário.
 */
export async function saveSession(user, data) {
    await set(`session_${user}`, data);
}
