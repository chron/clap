const API_BASE_URL = '/api';

function generateQueryString(params) {
  return Object.entries(params)
    .filter(([_, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}=${v}`).join('&');
}

async function get(action, params = {}) {
  const queryString = generateQueryString(params);
  const response = await fetch(`${API_BASE_URL}/${action}?${queryString}`);

  return response.json();
}

async function post(action, params, payload = {}) {
  const queryString = generateQueryString(params);
  const response = await fetch(`${API_BASE_URL}/${action}?${queryString}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 204) {
    return true;
  } else {
    return response.json();
  }
}

export async function joinSession(sessionCode, userName, avatar) {
  return get('join-session', { sessionCode, userName, avatar });
}

export async function clap(sessionCode, userName) {
  return post('clap', { sessionCode, userName });
}

export async function kickoff(sessionCode) {
  return post('kickoff', { sessionCode });
}
