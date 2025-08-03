export const getFullImageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return '/placeholder.png'; 
  }
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error('Supabase URL is not defined in environment variables');
    return '/placeholder.png';
  }

  return `${supabaseUrl}/storage/v1/object/public/images/${path}`;
};
