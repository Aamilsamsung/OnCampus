// Runs ONLY after the user presses Capture, on the active WhatsApp Web tab.
// No network calls or bulk chat history access. DOM selectors are best-effort.
(()=>{
 const header=document.querySelector('#main header');
 if(!header)return {ok:false,error:'Open an individual WhatsApp group conversation first.'};
 const titleNode=header.querySelector('[title]')||header.querySelector('span[dir="auto"]');
 const title=(titleNode?.getAttribute('title')||titleNode?.textContent||'').trim();
 if(!title)return {ok:false,error:'Unable to identify this chat. WhatsApp may have changed its layout.'};
 const main=document.querySelector('#main');
 const messages=[...main.querySelectorAll('[data-id]')].filter(el=>el.matches('[data-id^="true_"],[data-id^="false_"]')||el.querySelector('.selectable-text'));
 const texts=messages.map(el=>({text:(el.querySelector('.selectable-text')?.innerText||'').trim(),id:el.getAttribute('data-id')||''})).filter(x=>x.text.length>=25&&x.text.length<=2500);
 return {ok:true,title,messages:texts.slice(-150),note:'Visible loaded messages only; no automatic history scrolling.'};
})()
