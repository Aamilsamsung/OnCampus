const DAY=24*60*60*1000;
async function ensureAlarm(){const alarm=await chrome.alarms.get('daily-check');if(!alarm)await chrome.alarms.create('daily-check',{periodInMinutes:1440});}
chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(ensureAlarm);
async function dueCheck(){const {lastDailyCheck}=await chrome.storage.local.get('lastDailyCheck');if(!lastDailyCheck||Date.now()-Date.parse(lastDailyCheck)>DAY){await chrome.storage.local.set({lastDailyCheck:new Date().toISOString(),dailyStatus:'Ready to review approved groups. Open WhatsApp Web and choose Capture in the extension.'});}}
chrome.alarms.onAlarm.addListener(a=>{if(a.name==='daily-check')dueCheck()});
chrome.runtime.onStartup.addListener(dueCheck);
chrome.runtime.onMessage.addListener((msg,sender,respond)=>{if(msg?.type==='status'){chrome.storage.local.get(['approvedGroups','lastDailyCheck','dailyStatus']).then(respond);return true;}});
