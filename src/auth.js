const USERS_KEY = 'gm_users';
const SESSION_KEY = 'gm_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

export function signup(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { ok: false, error: 'An account with this email already exists.' };
  const user = { id: Date.now().toString(), name, email, password, plan: 'free', joinedAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

export function updateUser(fields) {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === session.id);
  if (idx === -1) return null;
  const updated = { ...users[idx], ...fields };
  users[idx] = updated;
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}
