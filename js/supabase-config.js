/**
 * ============================================================================
 * SUPABASE CONFIGURATION (js/supabase-config.js)
 * Official Supabase Client Integration & Storage Asset Management
 * ============================================================================
 */

// Provided Supabase Project Credentials
const SUPABASE_RAW_URL = "https://poilrmokmvxkgmrvxzym.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaWxybW9rbXZ4a2dtcnZ4enltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTc1ODEsImV4cCI6MjEwNzYzMzU4MX0.TbxesTYatB3KEqnqa-rQBHdVVrU_XRJ5fpY6evOE0N0";

// Normalize to root project URL for SDK compatibility (removes trailing /rest/v1/)
const SUPABASE_URL = SUPABASE_RAW_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const SUPABASE_BUCKET = "portfolio-assets";

// Global client reference
let supabaseClient = null;

/**
 * Initializes the Supabase client using createClient from the loaded Supabase JS SDK
 */
function initSupabase() {
  try {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      window.supabaseClient = supabaseClient;
      console.log("⚡ Supabase Client initialized successfully:", SUPABASE_URL);
    } else {
      console.warn("⚠️ Supabase JS SDK not loaded yet. Make sure https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 is included.");
    }
  } catch (err) {
    console.error("❌ Failed to initialize Supabase client:", err);
  }
  return supabaseClient;
}

// Auto-initialize immediately
if (typeof window !== 'undefined') {
  initSupabase();
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
    initSupabase();
  }

  if (supabaseClient) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}_${cleanName}`;

      console.log(`Uploading ${file.name} to ${SUPABASE_BUCKET}/${filePath}...`);
      
      const { data, error } = await supabaseClient.storage
        .from(SUPABASE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Supabase Storage upload error:", error);
        throw error;
      }

      const { data: urlData } = supabaseClient.storage
        .from(SUPABASE_BUCKET)
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
  window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    rawUrl: SUPABASE_RAW_URL,
    anonKey: SUPABASE_ANON_KEY,
    bucketName: SUPABASE_BUCKET
  };
  window.supabaseClient = supabaseClient;
  window.uploadImageToSupabase = uploadImageToSupabase;
  window.initSupabase = initSupabase;
}
