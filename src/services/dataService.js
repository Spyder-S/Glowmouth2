import { supabase, hasSupabase } from '../lib/supabase.js';

const LOCAL_SCANS_KEY = 'glowmouth_scans';

function loadLocalScans(userId) {
  const all = localStorage.getItem(LOCAL_SCANS_KEY);
  try {
    const arr = all ? JSON.parse(all) : [];
    return arr.filter(s => s.user_id === userId);
  } catch {
    return [];
  }
}

function saveLocalScans(userId, scans) {
  const all = localStorage.getItem(LOCAL_SCANS_KEY);
  let arr = [];
  try {
    arr = all ? JSON.parse(all) : [];
  } catch {}
  const others = arr.filter(s => s.user_id !== userId);
  const merged = [...others, ...scans];
  localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(merged));
}

export async function getScans(userId) {
  if (hasSupabase()) {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } else {
    return loadLocalScans(userId);
  }
}

function dataURItoBlob(dataURI) {
  // credit: https://stackoverflow.com/a/11954337
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export async function addScan(scan) {
  if (hasSupabase()) {
    // if images are data URIs, upload them to storage bucket
    if (scan.image_urls && Array.isArray(scan.image_urls)) {
      try {
        const uploaded = [];
        for (let i = 0; i < scan.image_urls.length; i++) {
          const uri = scan.image_urls[i];
          if (uri.startsWith('data:')) {
            const blob = dataURItoBlob(uri);
            const path = `${scan.user_id}/${Date.now()}_${i}.jpg`;
            const { error: upErr } = await supabase.storage.from('scans').upload(path, blob, { upsert: false });
            if (upErr) {
              console.warn('upload error', upErr);
            } else {
              const { data: urlData } = supabase.storage.from('scans').getPublicUrl(path);
              uploaded.push(urlData?.publicUrl);
            }
          } else {
            uploaded.push(uri);
          }
        }
        scan.image_urls = uploaded;
      } catch (e) {
        console.error('error uploading images', e);
      }
    }
    const { data, error } = await supabase.from('scans').insert(scan).select();
    if (error) throw error;
    return data[0];
  } else {
    const existing = loadLocalScans(scan.user_id);
    const newScan = { ...scan, id: Date.now().toString(), created_at: new Date().toISOString() };
    saveLocalScans(scan.user_id, [newScan, ...existing]);
    return newScan;
  }
}

export async function getScanById(id) {
  if (hasSupabase()) {
    const { data, error } = await supabase.from('scans').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } else {
    const allRaw = localStorage.getItem(LOCAL_SCANS_KEY);
    let arr = [];
    try { arr = allRaw ? JSON.parse(allRaw) : []; } catch {}
    return arr.find(s => s.id === id) || null;
  }
}

export async function clearScans(userId) {
  if (hasSupabase()) {
    const { error } = await supabase.from('scans').delete().eq('user_id', userId);
    if (error) throw error;
    return true;
  } else {
    saveLocalScans(userId, []);
    return true;
  }
}
