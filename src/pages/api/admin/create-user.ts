import type { Database } from '@/integrations/supabase/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['admin', 'editor', 'moderator', 'user']),
  title: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type ErrorBody = { error: string };

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return null;
  }
  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: true; userId: string } | ErrorBody>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(500).json({
      error:
        'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to the server environment.',
    });
  }

  const authHeader = req.headers.authorization;
  const token =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const {
    data: { user: caller },
    error: callerError,
  } = await adminClient.auth.getUser(token);
  if (callerError || !caller) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const { data: callerRole, error: roleReadError } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', caller.id)
    .maybeSingle();

  if (roleReadError || callerRole?.role !== 'admin') {
    return res.status(403).json({ error: 'Only administrators can create users' });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().formErrors.join('; ') });
  }

  const { email, password, name, role, title, bio, avatar } = parsed.data;

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      title: title || null,
      bio: bio || null,
      avatar: avatar || null,
    },
  });

  if (createError || !created.user) {
    const msg = createError?.message ?? 'Failed to create user';
    const lower = msg.toLowerCase();
    if (
      lower.includes('already been registered') ||
      lower.includes('already exists') ||
      lower.includes('duplicate') ||
      lower.includes('unique')
    ) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    return res.status(400).json({ error: msg });
  }

  const userId = created.user.id;

  await adminClient.from('user_roles').delete().eq('user_id', userId);
  const { error: roleInsertError } = await adminClient.from('user_roles').insert({
    user_id: userId,
    role,
  });
  if (roleInsertError) {
    return res.status(500).json({ error: `User created but role save failed: ${roleInsertError.message}` });
  }

  const { error: profileError } = await adminClient.from('profiles').upsert(
    {
      id: userId,
      name,
      title: title?.trim() ? title.trim() : null,
      bio: bio?.trim() ? bio.trim() : null,
      avatar: avatar?.trim() ? avatar.trim() : null,
      email_verified: true,
    },
    { onConflict: 'id' }
  );

  if (profileError) {
    return res.status(500).json({
      error: `User created but profile save failed: ${profileError.message}`,
    });
  }

  return res.status(200).json({ ok: true, userId });
}
