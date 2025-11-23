// Manually define ImportMetaEnv to avoid "Cannot find type definition file for 'vite/client'"
// and ensure import.meta.env is typed correctly where used.

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
