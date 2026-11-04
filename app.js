(() => {
  const ids = ['projects','education','teaching','honors'];
  const themeKey = 'tian-jaho-theme-v1';
  const t = value => window.ResumeI18n?.t(value) || value;
  let active = ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'projects';
  let scheduled = false;
  let cvLoading;
  async function loadCV(){if(window.ResumeCV)return;if(!cvLoading)cvLoading=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=window.ResumeCVURL||'cv-data.js';script.onload=()=>window.ResumeCV?resolve():reject(Error('CV unavailable'));script.onerror=()=>{cvLoading=null;script.remove();reject(Error('CV unavailable'))};document.head.append(script)});await cvLoading}
  function applyTheme(value, save = false) {
    const light = value === 'light';
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    const button = document.querySelector('#theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed',String(light));
      button.setAttribute('aria-label',t(light?'切换到暗色':'切换到亮色'));
      button.querySelector('.theme-icon').textContent = light ? '☾' : '☀';
      button.querySelector('.theme-label').textContent = t(light ? '暗色' : '亮色');
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f7f8fa':'#414141');
    if(save)try{localStorage.setItem(themeKey,document.documentElement.dataset.theme)}catch{/* Theme still works when storage is unavailable. */}
  }
  function refresh() {
    const tabs=document.querySelector('#resume-tabs');
    if(!tabs)return;
    tabs.setAttribute('role','tablist');
    for(const id of ids) {
      const panel=document.getElementById(id),tab=document.getElementById('tab-'+id);
      if(!panel||!tab)continue;
      const selected=id===active;
      panel.hidden=!selected;
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('aria-labelledby',tab.id);
      tab.setAttribute('role','tab');tab.setAttribute('aria-controls',id);
      tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
    }
    updateNavigation();
  }
  function selectPanel(id, options={}) {
    if(!ids.includes(id))return;
    active=id;refresh();
    if(options.url&&location.hash!=='#'+id)updateHash(id,options.replace);
    if(options.scroll)scrollTarget('#resume-content');
  }
  function updateHash(id,replace=false){if(location.protocol==='about:')return;try{history[replace?'replaceState':'pushState'](null,'','#'+id)}catch{/* Sandboxed previews keep navigation inside the frame. */}}
  function scrollTarget(selector){requestAnimationFrame(()=>{document.querySelector(selector)?.scrollIntoView({block:'start',behavior:'instant'});updateNavigation()})}
  function updateNavigation() {
    const threshold=(document.querySelector('.site-header')?.getBoundingClientRect().height||84)+95;
    const content=document.querySelector('#resume-content');
    const current=content&&content.getBoundingClientRect().top<=threshold?active:'about';
    for(const link of document.querySelectorAll('.site-header nav a')) {
      if(link.hash==='#'+current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    }
    scheduled=false;
  }
  function scheduleNavigation(){if(!scheduled){scheduled=true;requestAnimationFrame(updateNavigation)}}
  function routeHash(){const id=location.hash.slice(1);if(ids.includes(id))selectPanel(id,{scroll:true});else if(id==='about')scrollTarget('#about');}
  document.addEventListener('click',async event=>{
    if(event.target.closest('#theme-toggle')){applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light',true);return;}
    const anchor=event.target.closest('a[href^="#"]');
    if(anchor&&!event.defaultPrevented){const id=anchor.hash.slice(1);if(ids.includes(id)){event.preventDefault();selectPanel(id,{url:true,scroll:true})}else if(id==='about'){event.preventDefault();updateHash('about');scrollTarget('#about')}}
    const cv=event.target.closest('a.cv-download');
    if(cv&&cv.getAttribute('href')==='TIAN_Jaho_CV.pdf'&&!event.defaultPrevented){event.preventDefault();try{await loadCV();const bytes=Uint8Array.from(atob(window.ResumeCV),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download='TIAN_Jaho_CV.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}catch{location.assign(cv.href)}}
  });
  document.addEventListener('keydown',event=>{
    const tab=event.target.closest('#resume-tabs a');
    if(!tab||!['ArrowRight','ArrowLeft','Home','End','ArrowDown','ArrowUp'].includes(event.key))return;
    event.preventDefault();let index=ids.indexOf(tab.hash.slice(1));
    if(event.key==='Home')index=0;else if(event.key==='End')index=ids.length-1;else index=(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+ids.length)%ids.length;
    selectPanel(ids[index],{url:true,replace:true});document.getElementById('tab-'+ids[index]).focus();
  });
  document.addEventListener('click',async event=>{
    const button=event.target.closest('#copy-wechat');if(!button)return;
    const value=document.querySelector('#wechat-id').textContent;if(!value.trim()){document.querySelector('#copy-status').textContent=t('未填写微信号。');return}let copied=false;
    try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);copied=true}}catch{/* Use the compatible copy path. */}
    if(!copied){const field=document.createElement('textarea');field.value=value;field.setAttribute('aria-label','微信号');field.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(field);field.select();try{copied=document.execCommand('copy')}catch{copied=false}field.remove();button.focus({preventScroll:true})}
    document.querySelector('#copy-status').textContent=t(copied?'已复制微信号：'+value:'请选中微信号 '+value+'，手动复制。');
  });
  window.addEventListener('scroll',scheduleNavigation,{passive:true});
  window.addEventListener('resize',refresh);
  window.addEventListener('load',()=>{refresh();if(ids.includes(location.hash.slice(1)))routeHash()});
  window.addEventListener('hashchange',routeHash);window.addEventListener('popstate',routeHash);
  document.addEventListener('toggle',scheduleNavigation,true);
  function normalizeLayout(container){
    for(const icon of container.querySelectorAll('#projects > svg.icon'))if(icon.querySelector('use')?.getAttribute('href')==='#i-arrow')icon.remove();
    const main=container.querySelector('#main'),about=container.querySelector('#about');if(!main||!about||main.dataset.layoutRevision==='20261104-user-draft')return;
    for(const element of about.querySelectorAll('[data-free-x],[data-free-y],[data-free-mobile-x],[data-free-mobile-y]')){for(const name of ['data-free-x','data-free-y','data-free-mobile-x','data-free-mobile-y'])element.removeAttribute(name);for(const name of ['--free-x','--free-y','--free-mobile-x','--free-mobile-y'])element.style.removeProperty(name);if(!element.style.cssText)element.removeAttribute('style')}
    const skills=about.querySelector('#skills'),links=about.querySelector('.intro-links');
    if(skills&&links){let lower=about.querySelector('.about-lower');if(!lower){lower=document.createElement('div');lower.className='about-lower';about.insertBefore(lower,skills)}lower.append(skills,links);links.classList.add('about-actions');const cv=links.querySelector('.cv-download');if(cv)links.prepend(cv);const list=skills.querySelector('.skills-list');if(list){const order=['语言','工具','编程','开发工具'];const label=element=>{const node=element.querySelector('dt [data-i18n-values]');if(node)try{return JSON.parse(node.dataset.i18nValues)['zh-CN'].trim()}catch{}return element.querySelector('dt')?.textContent.trim()};const rows=[...list.children];for(const text of order){const row=rows.find(row=>label(row)===text);if(row)list.append(row)}}}
    main.dataset.layoutRevision='20261104-user-draft';
  }
  normalizeLayout(document.querySelector('.page-layout'));
  window.ResumeUI={selectPanel,refresh,applyTheme,loadCV,normalizeLayout};
  let theme=document.documentElement.dataset.theme||'dark';try{theme=localStorage.getItem(themeKey)||theme}catch{}
  applyTheme(theme);refresh();
})();
