/**
 * ============================================================================
 * SUPABASE CONFIGURATION (js/supabase-config.js)
 * Cloud Database & Storage Connector with Dual-Mode Local/Offline Fallback
 * ============================================================================
 */

// Replace these placeholders with your actual Supabase project credentials
// Or configure them in the Admin Settings panel inside admin.html
const SUPABASE_CONFIG = {
  // e.g. "https://xyzcompany.supabase.co"
  url: window.localStorage.getItem('supabase_custom_url') || "https://your-supabase-project.supabase.co",
  // e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  anonKey: window.localStorage.getItem('supabase_custom_key') || "your-supabase-anon-key",
  // Cloud Storage bucket name for images & certificate uploads
  bucketName: "portfolio-assets"
};

// Global Supabase client instance
window.supabaseClient = null;

/**
 * Initializes the Supabase client if valid credentials and the SDK are present
 */
function initSupabaseClient() {
  const isDefaultOrPlaceholder = 
    !SUPABASE_CONFIG.url || 
    SUPABASE_CONFIG.url.includes("your-supabase-project") || 
    !SUPABASE_CONFIG.anonKey || 
    SUPABASE_CONFIG.anonKey.includes("your-supabase-anon-key");

  if (!isDefaultOrPlaceholder && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      window.supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log("⚡ Supabase Client initialized successfully.");
    } catch (err) {
      console.warn("⚠️ Failed to initialize Supabase client, running in local storage fallback mode:", err);
      window.supabaseClient = null;
    }
  } else {
    // Graceful fallback to LocalStorage engine
    window.supabaseClient = null;
  }
}

// Auto initialize when loaded
if (typeof window !== 'undefined') {
  initSupabaseClient();
}

/**
 * Helper to upload an image file to Supabase Storage bucket 'portfolio-assets'
 * Falls back to local Base64 Data URL if Supabase is not configured
 * @param {File} file - Browser File object from <input type="file">
 * @param {string} folder - Destination subfolder, e.g. 'certificates' or 'projects'
 * @returns {Promise<string>} Public URL of the uploaded image
 */
async function uploadImageToSupabase(file, folder = 'uploads') {
  if (!file) return null;

  // 1. Try Supabase Cloud Storage if client is active
  if (window.supabaseClient) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { data, error } = await window.supabaseClient.storage
        .from(SUPABASE_CONFIG.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn("Supabase Storage upload error, falling back to local storage:", error);
      } else {
        const { data: publicUrlData } = window.supabaseClient.storage
          .from(SUPABASE_CONFIG.bucketName)
          .getPublicUrl(fileName);

        if (publicUrlData && publicUrlData.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Cloud upload exception, falling back to local encoding:", e);
    }
  }

  // 2. Resilient Fallback: Convert File to Base64 Data URL for instant local display & localStorage persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

window.uploadImageToSupabase = uploadImageToSupabase;
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initSupabaseClient = initSupabaseClient;

