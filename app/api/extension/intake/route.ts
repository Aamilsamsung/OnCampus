import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {adminFromRequest} from '@/lib/admin';
export async function POST(req:NextRequest){
 try{
  const db=await adminFromRequest(req);
  if(!db)return NextResponse.json({error:'Admin authentication required'},{status:401});
  const body=await req.json();
  if(!['Electronic City','Ring Road','Hanumanth Nagar'].includes(body.campus)||!Array.isArray(body.items)||body.items.length>50)return NextResponse.json({error:'Invalid batch'},{status:400});
  const rows=[];
  for(const item of body.items){
   if(typeof item?.text!=='string'||item.text.length<25||item.text.length>2500||typeof item.chat!=='string'||item.chat.length>200)continue;
   const clean=item.text.trim();
   const lines=clean.split(/\n/).map((x:string)=>x.trim()).filter(Boolean);
   const title=(lines.find((x:string)=>/hackathon|workshop|competition|seminar|fest|event|conference|webinar|bootcamp|symposium|meetup/i.test(x))||lines[0]||'').slice(0,250);
   if(title.length<5)continue;
   const category=/hackathon/i.test(clean)?'Hackathon':/workshop|bootcamp|webinar/i.test(clean)?'Workshop':/competition|contest|quiz/i.test(clean)?'Competition':/fest|cultural/i.test(clean)?'Cultural':'Other';
   const fingerprint=createHash('sha256').update(clean.toLowerCase().replace(/\s+/g,' ')).digest('hex');
   rows.push({title,description:clean,campus:body.campus,category,source_type:'whatsapp_group',source_ref:item.chat,fingerprint,status:'pending'});
  }
  if(!rows.length)return NextResponse.json({ok:true,received:0,submitted:0});
  const {error}=await db.from('events').upsert(rows,{onConflict:'fingerprint',ignoreDuplicates:true});
  if(error)throw error;
  return NextResponse.json({ok:true,received:body.items.length,submitted:rows.length});
 }catch{return NextResponse.json({error:'Unable to accept candidates. Verify database and admin configuration.'},{status:503})}
}
