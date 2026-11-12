// Passive observer of the currently open chat. Never navigates between chats.
let lastChat='',seen=new Set(),timer=null;
const eventRx=/hackathon|workshop|competition|register|registration|seminar|event|deadline|fest|conference|coding contest|quiz|symposium|webinar|bootcamp|meetup|apply now|call for/i;
const getChat=()=>{const h=document.querySelector('#main header');return (h?.querySelector('[title]')?.getAttribute('title')||h?.querySelector('span[dir="auto"]')?.textContent||'').trim()};
function scan(){const chat=getChat();if(!chat)return;if(chat!==lastChat){lastChat=chat;seen=new Set()}chrome.storage.local.get(['approvedGroups','autoScan'],async s=>{if(!s.autoScan||!s.approvedGroups?.[chat])return;const nodes=[...document.querySelectorAll('#main .message-in, #main .message-out')];const messages=[];for(const el of nodes){const body=(el.querySelector('.selectable-text')?.innerText||'').trim();if(body.length<25||body.length>2500||!eventRx.test(body))continue;const id=el.getAttribute('data-id')||body;if(seen.has(id))continue;seen.add(id);messages.push({text:body})}if(messages.length)chrome.runtime.sendMessage({type:'eventCandidates',chat,messages}).catch(()=>{})})}
const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(scan,900)});
function start(){obs.observe(document.body,{subtree:true,childList:true});scan()}
if(document.body)start();else addEventListener('DOMContentLoaded',start,{once:true});
