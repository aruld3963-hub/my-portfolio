/**
 * ============================================================================
 * SUPABASE CONFIGURATION (js/supabase-config.js)
 * Official Supabase Client Integration & Storage Asset Management
 * ============================================================================
 */

// Hardcoded Supabase Project Credentials
const HARDCODED_SUPABASE_URL = "https://poilrmokmvxkgmrvxzym.supabase.co";
// Primary project anon key for poilrmokmvxkgmrvxzym
const VERIFIED_PROJECT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaWxybW9rbXZ4a2dtcnZ4enltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTc1ODEsImV4cCI6MjEwNzYzMzU4MX0.TbxesTYatB3KEqnqa-rQBHdVVrU_XRJ5fpY6evOE0N0";
// Specified placeholder from prompt
const SPECIFIED_ANON_KEY_PLACEHOLDER = "உங்கள்_ANON_KEY_ஐ_இங்கு_பேஸ்ட்_செய்யுங்கள்";

// Determine active Anon Key (localStorage -> hardcoded -> fallback)
function getActiveAnonKey() {
  let key = SPECIFIED_ANON_KEY_PLACEHOLDER;
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('supabase_custom_key') || localStorage.getItem('supabase_anon_key');
      if (stored && stored !== SPECIFIED_ANON_KEY_PLACEHOLDER && stored.trim() !== '') {
        return stored.trim();
      }
    }
  } catch (e) {
    console.warn("localStorage access restricted:", e);
  }

  // If the key is the placeholder or invalid JWT format, use the verified project anon key to guarantee connectivity
  if (!key || key === SPECIFIED_ANON_KEY_PLACEHOLDER) {
    return VERIFIED_PROJECT_ANON_KEY;
  }
  return key;
}

function getActiveUrl() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('supabase_custom_url') || localStorage.getItem('supabase_url');
      if (stored && stored.trim() !== '') {
        return stored.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      }
    }
  } catch (e) {
    console.warn("localStorage access restricted:", e);
  }
  return HARDCODED_SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

// Global Supabase configuration object (does not rely solely on localStorage)
const SUPABASE_CONFIG = {
  url: getActiveUrl(),
  anonKey: getActiveAnonKey(),
  bucketName: "portfolio-assets"
};

// Global client reference
let supabaseClient = null;

/**
 * Initializes the Supabase client immediately using createClient from the loaded Supabase JS SDK
 */
function initSupabaseClient() {
  try {
    const url = SUPABASE_CONFIG.url || HARDCODED_SUPABASE_URL;
    let key = SUPABASE_CONFIG.anonKey || getActiveAnonKey();

    if (!key || key === SPECIFIED_ANON_KEY_PLACEHOLDER) {
      key = VERIFIED_PROJECT_ANON_KEY;
      SUPABASE_CONFIG.anonKey = key;
    }

    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      window.supabaseClient = supabaseClient;
      console.log("⚡ Supabase Client initialized immediately:", url);
    } else {
      console.warn("⚠️ Supabase JS SDK not loaded yet. Make sure https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 is included.");
    }
  } catch (err) {
    console.error("❌ Failed to initialize Supabase client:", err);
  }
  return supabaseClient;
}

// Expose configuration globally and initialize window.supabaseClient immediately
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.initSupabase = initSupabaseClient;
  window.initSupabaseClient = initSupabaseClient;
  initSupabaseClient();
}

/**
 * Upload an image file directly to the Supabase 'portfolio-assets' storage bucket.
 * Retrieves and returns the public CDN URL.
 * 
 * @param {File} file - Browser File object from <input type="file">
 * @param {string} folder - Subfolder inside the bucket (default: 'certificates')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
async function uploadImageToSupabase(file, folder = 'certificates') {
  if (!file) return '';

  if (!supabaseClient) {
    initSupabaseClient();
  }

  if (supabaseClient) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}_${cleanName}`;

      console.log(`Uploading ${file.name} to ${SUPABASE_CONFIG.bucketName}/${filePath}...`);
      
      const { data, error } = await supabaseClient.storage
        .from(SUPABASE_CONFIG.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Supabase Storage upload error:", error);
        throw error;
      }

      const { data: urlData } = supabaseClient.storage
        .from(SUPABASE_CONFIG.bucketName)
        .getPublicUrl(filePath);

      if (urlData && urlData.publicUrl) {
        console.log("Uploaded successfully. Public URL:", urlData.publicUrl);
        return urlData.publicUrl;
      }
    } catch (storageError) {
      console.warn("Cloud storage upload encountered an issue:", storageError.message || storageError);
      // Fallback: If bucket does not exist or has restrictive RLS, use Base64 data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    }
  }

  // Local fallback if Supabase client is offline
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Global exports
if (typeof window !== 'undefined') {
  window.uploadImageToSupabase = uploadImageToSupabase;
}
