import {NextRequest,NextResponse} from 'next/server';
import {adminFromRequest} from '@/lib/admin';
import {createWorker} from 'tesseract.js';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 try{
  const db=await adminFromRequest(req);
  if(!db)return NextResponse.json({error:'Admin authentication required'},{status:401});
  const form=await req.formData();const file=form.get('image');
  if(!(file instanceof File)||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5_000_000||file.size===0)return NextResponse.json({error:'PNG/JPEG/WebP under 5MB required'},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer());const worker=await createWorker('eng');
  try{const result=await worker.recognize(bytes);return NextResponse.json({ok:true,text:result.data.text,confidence:result.data.confidence})}
  finally{await worker.terminate()}
 }catch(e){console.error('OCR failure',e);return NextResponse.json({error:'OCR failed'},{status:503})}
}
