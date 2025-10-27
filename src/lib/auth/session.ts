import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

/**
 * Get the current user session on the server
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Try to get user profile from our profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    // If profile exists, return it
    if (profile && !profileError) {
      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      };
    }

    // If profile doesn't exist yet (new user), fall back to auth user data
    // This prevents the broken auth flow where users get redirected back to login
    console.log('Profile not found for user, falling back to auth user data:', user.id);
    
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
      avatar_url: user.user_metadata?.avatar_url || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use this in Server Components that need authentication
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Check if user is authenticated (for conditional rendering)
 * Returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
