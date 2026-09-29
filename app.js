(() => {
 'use strict';
 const items=window.CampaignRotation.ordered(window.CAMPAIGN.items), $=id=>document.getElementById(id), dialog=$('viewer'); let opener;
 const el=(name,cls,text)=>{const e=document.createElement(name);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 const driveId=item=>{try{const u=new URL(item.source);if(u.protocol!=='https:'||u.hostname!=='drive.google.com')return null;return u.pathname.match(/^\/file\/d\/([\w-]+)\//)?.[1]||null;}catch{return null;}};

 function downloadLink(item){const id=driveId(item);if(!id)return null;return id==='1kwLBbuchiEfN_BX6cIaXjHYH-U6_CpBj'?'assets/ditambal-terus.png':`https://drive.google.com/uc?export=download&id=${id}`;}
 function setupDownload(link,item){const url=downloadLink(item);link.hidden=!url;if(!url)return;link.href=url;link.setAttribute('aria-label',`Bisa unduh di sini: ${item.title}`);if(url.startsWith('assets/')){link.download='ditambal-terus.png';link.removeAttribute('target');}else{link.removeAttribute('download');link.target='_blank';link.rel='noopener noreferrer';}}
 function downloadButton(item){const a=el('a','download-link','Bisa unduh di sini');setupDownload(a,item);return a;}
 function fallback(art,item){const box=el('div','preview-fallback',item.type==='video'?'▶':'▧');box.append(el('small','',item.type==='video'?'Buka video kampanye':'Buka poster kampanye'));art.replaceChildren(box);}
 function open(item,button){opener=button;setupDownload($('material-download'),item);$('viewer-title').textContent=item.title;$('viewer-caption').textContent=item.caption;$('viewer-type').textContent=item.type==='video'?'VIDEO KAMPANYE':'POSTER KAMPANYE';const id=driveId(item);$('viewer-media').replaceChildren();$('source-link').hidden=!id;if(id){$('source-link').href=item.source;const frame=el('iframe');frame.src=`https://drive.google.com/file/d/${id}/preview`;frame.title=item.title;frame.allow='fullscreen';frame.allowFullscreen=true;$('viewer-media').append(frame);}else{$('viewer-media').append(el('p','media-error','Tautan media belum tersedia.'));}dialog.showModal();document.body.classList.add('modal-open');$('close-viewer').focus();}
 function card(item){const b=el('button','card');b.type='button';b.dataset.kind=item.type;b.setAttribute('aria-label',`Buka ${item.title}`);const art=el('div','card-art'),id=driveId(item);if(id){const img=el('img');img.alt=item.title;img.loading='lazy';img.referrerPolicy='no-referrer';img.src=id==='1kwLBbuchiEfN_BX6cIaXjHYH-U6_CpBj'?'assets/ditambal-terus.png':`https://drive.google.com/thumbnail?id=${id}&sz=w800`;img.addEventListener('error',()=>fallback(art,item),{once:true});art.append(img);}else fallback(art,item);if(item.type==='video')art.append(el('span','play','▶'));const copy=el('div','card-copy'),meta=el('div','card-meta',item.type==='video'?'VIDEO':'POSTER');if(item.featured)meta.append(el('span','featured-badge','Pilihan'));copy.append(meta,el('h2','',item.title),el('p','tags',item.tags.join(' ')));const bottom=el('div','card-bottom');bottom.append(el('span','',item.type==='video'?'Tonton & baca cerita':'Lihat poster & caption'),el('span','','＋'));copy.append(bottom);b.append(art,copy);b.addEventListener('click',()=>open(item,b));return b;}
 function render(type){const shown=items.filter(i=>type==='all'||i.type===type);$('gallery').replaceChildren(...shown.map(item=>{const group=el('article','catalog-item');group.append(card(item),downloadButton(item));return group;}));$('count').textContent=`${shown.length} materi`;if(!shown.length)$('gallery').append(el('p','empty','Belum ada materi pada kategori ini.'));}
 document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-type]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));render(b.dataset.type);}));
 $('close-viewer').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{$('viewer-media').replaceChildren();document.body.classList.remove('modal-open');if(opener?.isConnected)opener.focus();else $('daily-open')?.focus();});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 if(document.body.dataset.page!=='home'){render('all');return;}
 let currentDay=null, timer;
 function refreshDaily(){
   const now=new Date(), selected=window.CampaignRotation.select(items,now,window.CAMPAIGN_SETTINGS.startDate);
   clearTimeout(timer);
   timer=setTimeout(refreshDaily,Math.max(1000,window.CampaignRotation.nextMidnight(now)-now.getTime()+100));
   if(!selected){$('daily').replaceChildren(el('p','empty','Materi kampanye akan segera tersedia.'));return;}
   if(currentDay===selected.day)return;
   currentDay=selected.day;
   const item=selected.item, media=card(item);
   media.classList.add('daily-media');media.querySelector('.card-copy').remove();
   const img=media.querySelector('img');if(img)img.loading='eager';
   const copy=el('div','daily-copy');
   const meta=el('div','daily-meta');
   meta.append(el('span','eyebrow','CAMPAIGN HARI INI'),el('span','daily-date',new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'}).format(now)));
   copy.append(meta,el('h2','',item.title),el('p','daily-caption',item.caption));
   const button=el('button','button',item.type==='video'?'Tonton video':'Lihat poster penuh');button.id='daily-open';button.type='button';button.addEventListener('click',()=>open(item,button));
   copy.append(button,downloadButton(item),el('p','daily-progress',`Materi ${selected.index+1} dari ${selected.total} · Pesan baru setiap hari`));
   $('daily').replaceChildren(media,copy);
 }
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDaily();});window.addEventListener('focus',refreshDaily);refreshDaily();
})();
