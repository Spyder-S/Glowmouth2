import { supabase, hasSupabase } from '../lib/supabase.js';

// Local fallback storage keys
const LOCAL_USER_KEY = 'glowmouth_user';
const LOCAL_SESSION_KEY = 'glowmouth_session';

// basic local storage helpers
function saveLocalUser(user) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ user, expires: Date.now() + 1000 * 60 * 60 * 24 }));
}

function clearLocalUser() {
  localStorage.removeItem(LOCAL_USER_KEY);
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

function getLocalUser() {
  const u = localStorage.getItem(LOCAL_USER_KEY);
  return u ? JSON.parse(u) : null;
}

export async function signUp({ email, password, name }) {
  if (hasSupabase()) {
    const { data, error } = await supabase.auth.signUp({ email, password }, { data: { name } });
    if (error) throw error;
    // supabase may require email confirmation
    const user = data.user;
    // create a profile row if running database
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, email: user.email, name, created_at: new Date() });
    }
    return user;
  } else {
    if (!email || !password || !name) {
      throw new Error('Missing fields');
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      created_at: new Date().toISOString(),
    };
    saveLocalUser(newUser);
    return newUser;
  }
}

export async function signIn({ email, password }) {
  if (hasSupabase()) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  } else {
    const stored = getLocalUser();
    if (!stored || stored.email !== email) {
      throw new Error('No account with that email');
    }
    // we don't store password locally - accept any for demo
    saveLocalUser(stored);
    return stored;
  }
}

export async function signOut() {
  if (hasSupabase()) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  clearLocalUser();
}

export function getSession() {
  if (hasSupabase()) {
    return supabase.auth.getSession().then(r => r.data.session);
  } else {
    // always return a promise so callers can use `.then`
    return new Promise(resolve => {
      const sess = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!sess) return resolve(null);
      try {
        const parsed = JSON.parse(sess);
        if (parsed.expires && parsed.expires < Date.now()) {
          clearLocalUser();
          return resolve(null);
        }
        resolve({ user: getLocalUser() });
      } catch {
        resolve(null);
      }
    });
  }
}

export function onAuthStateChange(callback) {
  if (hasSupabase()) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  } else {
    // no real events in fallback
    return { data: { subscription: {unsubscribe: () => {}} } };
  }
}

export async function resetPassword(email) {
  if (hasSupabase()) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) throw error;
    return data;
  } else {
    // fake, just pretend
    if (!email) throw new Error('Email required');
    return { message: 'If that account exists, an email has been sent.' };
  }
}

export async function updatePassword(newPassword, accessToken) {
  if (hasSupabase()) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data.user;
  } else {
    // fallback: nothing
    return getLocalUser();
  }
}
