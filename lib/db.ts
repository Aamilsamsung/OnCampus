import {createClient} from '@supabase/supabase-js';
export const campuses=['All campuses','Electronic City','Ring Road','Hanumanth Nagar'] as const;
export type Campus=(typeof campuses)[number];
export type Event={id:string;title:string;description:string|null;campus:string;category:string;starts_at:string|null;registration_deadline:string|null;venue:string|null;registration_url:string|null;source_type:string;source_url:string|null;created_at:string};
export function publicDb(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;return url&&key?createClient(url,key,{auth:{persistSession:false}}):null}
export function serverDb(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Database not configured');return createClient(url,key,{auth:{persistSession:false}})}
