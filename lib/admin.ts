import {NextRequest} from 'next/server';
import {serverDb} from './db';
export async function adminFromRequest(req:NextRequest){const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)return null;const db=serverDb();const {data:{user},error}=await db.auth.getUser(token);if(error||!user)return null;const {data}=await db.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();return data?db:null}
