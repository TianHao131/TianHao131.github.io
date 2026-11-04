(() => {
  'use strict';
  const KEY = 'tian-jaho-resume-draft-v1';
  const CONTENT_REVISION = '20261104-profile-courses';
  const compatibleBases = new Set(['5ec0556d','b2d168ff','378d3411','be4ab1e9']);
  const DRAFT_REVISION = '20261104-body17';
  const t = value => window.ResumeI18n?.t(value) || value;
  const defaults = {font:'default',body:17,title:44,heading:28,line:1.9,spacing:1};
  const fonts = {default:'',noto:'"Noto Sans SC",sans-serif',system:'"Segoe UI","Microsoft YaHei","PingFang SC",sans-serif',yahei:'"Microsoft YaHei","PingFang SC",sans-serif',song:'SimSun,"Songti SC",serif',kai:'KaiTi,"Kaiti SC",serif',serif:'Georgia,"Times New Roman","Songti SC",serif',arial:'Arial,"Microsoft YaHei",sans-serif'};
  const templateDocument = document.documentElement.cloneNode(true);
  let original = document.querySelector('.page-layout').innerHTML;
  const allowedIds = new Set([...document.querySelector('.page-layout').querySelectorAll('[id]')].map(e=>e.id));
  const allowedClasses = new Set([...document.querySelector('.page-layout').querySelectorAll('[class]')].flatMap(e=>[...e.classList]));
  allowedClasses.add('resume-multiline');
  allowedClasses.add('resume-free-text');
  const allowedTags = new Set('DIV ASIDE MAIN SECTION ARTICLE H1 H2 H3 H4 P A SPAN STRONG SMALL UL OL LI DL DT DD DETAILS SUMMARY TABLE CAPTION THEAD TBODY TR TH TD FOOTER BUTTON SVG USE BR IMG'.split(' '));
  let base;
  let typography = validTypography(readInitialTypography());
  const initialTypography = {...typography};
  let editing = false, selected = null, timer = null, history = [], future = [], rememberedStatus = '';
  let moving=false,drag=null;
  const positionAttributes=['data-free-x','data-free-y','data-free-mobile-x','data-free-mobile-y'];
  const shell = document.createElement('div');
  shell.innerHTML = `<button class="editor-ui editor-launch" id="editor-toggle" type="button" aria-controls="editor-panel" aria-expanded="false">编辑网站</button>
  <aside class="editor-ui editor-panel" id="editor-panel" aria-labelledby="editor-title" hidden>
    <div class="editor-panel-header"><h2 id="editor-title">编辑网站</h2><button type="button" id="editor-panel-fold" data-action="fold" aria-expanded="true">收起面板</button><button type="button" class="editor-close" data-action="close" aria-label="关闭编辑面板">×</button></div>
    <p class="editor-note">点网页中的文字即可改写。修改仅保存在当前浏览器；导出后重新发布，其他设备才能看到。</p>
    <p class="editor-note">当前语言的文字单独保存；切换语言可分别编辑。已有自定义文字会保留。</p>
    <div class="editor-action-row"><button type="button" data-action="undo" id="editor-undo">撤销</button><button type="button" data-action="redo" id="editor-redo">重做</button><button type="button" data-action="preview">预览</button></div>
    <h3>内容与链接</h3><p class="editor-selected-label" id="editor-selection">先点选网页中的一段文字</p>
    <label for="editor-text">选中的文字</label><textarea id="editor-text" disabled placeholder="也可以在这里修改选中的文字"></textarea>
    <p class="editor-note">按 Enter 换行，再按一次可留空行。结束编辑、保存和导出后都会保留。</p>
    <label for="editor-link">链接地址（可选）</label><input type="text" id="editor-link" disabled placeholder="https://、mailto: 或 tel:">
    <div class="editor-action-row"><button type="button" data-action="delete-block" id="editor-delete-block" class="editor-danger" disabled>删除文字块</button></div>
    <p class="editor-note">只删选中的文字块；链接会连图标一起删除。可用「撤销」恢复。</p>
    <p class="editor-note">修改联系方式时，也请检查对应的邮件、电话或 WhatsApp 链接。</p>
    <h3>文字块位置</h3><div class="editor-action-row"><button type="button" data-action="move-mode" id="editor-move-mode" aria-pressed="false">开启自由拖动</button><button type="button" data-action="position-reset" id="editor-position-reset" disabled>重置位置</button></div>
    <p class="editor-note">开启后拖动文字块；关闭后继续改字。电脑与手机位置分别保存，三种语言共用位置。文字可以重叠。</p>
    <div class="editor-position-inputs"><div><label for="editor-position-x">水平 X（px）</label><input id="editor-position-x" type="number" min="-4000" max="4000" step="1" disabled></div><div><label for="editor-position-y">垂直 Y（px）</label><input id="editor-position-y" type="number" min="-4000" max="4000" step="1" disabled></div></div>
    <p class="editor-note" id="editor-position-device">当前调整：电脑位置</p>
    <label for="editor-add-type">新增经历</label><select id="editor-add-type"><option value="education">教育经历</option><option value="project">项目</option><option value="teaching">教学经历</option><option value="award">荣誉与奖项</option></select>
    <div class="editor-action-row"><button type="button" data-action="add">＋ 新增一项</button><button type="button" data-action="remove" id="editor-remove" class="editor-danger" disabled>删除整条经历</button></div>
    <div class="editor-divider"></div><h3>字体与排版</h3>
    <label for="editor-font">全站字体</label><select id="editor-font"><option value="default">Noto Sans SC（默认）</option><option value="noto">Noto Sans SC</option><option value="system">系统字体</option><option value="yahei">微软雅黑 / 苹方</option><option value="song">宋体</option><option value="kai">楷体</option><option value="serif">衬线字体</option><option value="arial">Arial</option></select>
    <div class="editor-range-row"><label for="editor-body">正文字号</label><output for="editor-body" id="output-body"></output></div><input id="editor-body" data-setting="body" type="range" min="12" max="22" step="1">
    <div class="editor-range-row"><label for="editor-title-size">首页标题</label><output for="editor-title-size" id="output-title"></output></div><input id="editor-title-size" data-setting="title" type="range" min="24" max="52" step="1">
    <div class="editor-range-row"><label for="editor-heading">章节标题</label><output for="editor-heading" id="output-heading"></output></div><input id="editor-heading" data-setting="heading" type="range" min="18" max="34" step="1">
    <div class="editor-range-row"><label for="editor-line">正文行距</label><output for="editor-line" id="output-line"></output></div><input id="editor-line" data-setting="line" type="range" min="1.4" max="2.4" step="0.05">
    <div class="editor-range-row"><label for="editor-spacing">章节间距</label><output for="editor-spacing" id="output-spacing"></output></div><input id="editor-spacing" data-setting="spacing" type="range" min="0.6" max="1.6" step="0.1">
    <p class="editor-note">Noto Sans SC 随网页提供。其他字体需在设备上安装。</p>
    <div class="editor-divider"></div><h3>保存与导出</h3>
    <div class="editor-action-row"><button type="button" data-action="save">保存草稿</button><button type="button" data-action="load">载入草稿</button><button type="button" data-action="export" class="editor-primary">导出网站 ZIP</button></div>
    <div class="editor-action-row"><button type="button" data-action="html">导出单文件网页</button><button type="button" data-action="backup">备份草稿</button><button type="button" data-action="import">导入草稿</button></div>
    <div class="editor-action-row"><button type="button" data-action="reset" class="editor-danger">恢复默认</button></div>
    <p class="editor-note">ZIP 解压后的文件可以用于重新发布。单文件网页可直接打开。草稿备份用于跨设备继续编辑。</p>
    <p id="editor-status" class="editor-status" role="status" aria-live="polite">点击网页文字开始编辑。</p>
    <input class="editor-file" id="editor-import" type="file" accept=".json,application/json">
  </aside>
  <div class="editor-ui editor-draft-badge" id="editor-draft-badge" hidden>本地草稿 · 尚未发布</div>
  <dialog class="editor-ui editor-preview" id="editor-preview" data-device="desktop"><div class="editor-preview-bar"><h2>当前修改预览</h2><button type="button" data-action="desktop">电脑</button><button type="button" data-action="mobile">手机</button><button type="button" data-action="preview-close">关闭预览</button></div><div class="editor-preview-stage"><iframe id="editor-preview-frame" title="当前网站预览" sandbox="allow-scripts allow-downloads"></iframe></div></dialog>
  <dialog class="editor-ui editor-confirm" id="editor-confirm"><p>恢复到这个网站文件的默认内容与排版？当前修改仍可用「撤销」找回。</p><div class="editor-action-row"><button type="button" data-action="reset-confirm">恢复默认</button><button type="button" data-action="reset-cancel">取消</button></div></dialog>`;
  document.body.append(...shell.children);
  const $ = selector => document.querySelector(selector);
  const root = () => $('.page-layout');
  const panel = $('#editor-panel');
  function hash(value) { let n=2166136261;for(let i=0;i<value.length;i++)n=Math.imul(n^value.charCodeAt(i),16777619);return (n>>>0).toString(16); }
  function readInitialTypography() {try{return JSON.parse(document.querySelector('#resume-custom-style')?.dataset.settings||'null')}catch{return null} }
  function validTypography(value) {
    const v=value&&typeof value==='object'?value:{};
    const result={font:Object.hasOwn(fonts,v.font)?v.font:'default'};
    for(const [key,min,max] of [['body',12,22],['title',24,52],['heading',18,34],['line',1.4,2.4],['spacing',.6,1.6]])result[key]=Number.isFinite(v[key])?Math.max(min,Math.min(max,v[key])):defaults[key];
    return result;
  }
  function safeURL(value) { if(!value)return '';if(value==='TIAN_Jaho_CV.pdf')return value;if(value.startsWith('#'))return /^#[\w-]+$/.test(value)?value:null;try{const u=new URL(value);return ['https:','http:','mailto:','tel:'].includes(u.protocol)?value:null}catch{return null} }
  function migrateProfileContent(container){
    const main=container.querySelector('#main');
    if(!main||main.dataset.contentRevision===CONTENT_REVISION)return;
    for(const anchor of container.querySelectorAll('a[href]')){
      if(anchor.closest('.profile'))continue;
      try{if(['github.com','www.github.com'].includes(new URL(anchor.getAttribute('href'),'https://local.invalid/').hostname.toLowerCase()))anchor.remove()}catch{/* Invalid links are handled by sanitize. */}
    }
    for(const element of container.querySelectorAll('.all-projects,#education .academic-details'))element.remove();
    for(const links of container.querySelectorAll('.project-links,.intro-links'))if(!links.children.length&&!links.textContent.trim())links.remove();
    const about=container.querySelector('#about'),academic=templateDocument.querySelector('.about-academic');
    if(about&&academic&&!about.querySelector('.about-academic')){
      const copy=about.querySelector('.about-copy');if(copy)copy.after(academic.cloneNode(true));else about.prepend(academic.cloneNode(true));
    }
    const awards=container.querySelector('#honors .awards-list'),courses=templateDocument.querySelector('.course-award');
    if(awards&&courses&&!awards.querySelector('.course-award'))awards.prepend(courses.cloneNode(true));
    main.dataset.contentRevision=CONTENT_REVISION;
  }
  function migratePhysicsSource(container){
    const main=container.querySelector('#main');if(!main||main.dataset.physicsSourceRevision==='1')return;
    const project=[...container.querySelectorAll('#projects .project')].find(element=>element.querySelector('h3')?.textContent.trim()==='Physics Adventure'||/Pygame/.test(element.querySelector('.project-category')?.textContent||''));
    const source=templateDocument.querySelector('.physics-source');
    if(project&&source&&!project.querySelector('a[href="https://github.com/TianHao131/phys-adventure"]')){const body=project.querySelector('.project-body');if(body){let links=body.querySelector('.project-links');if(!links){links=document.createElement('div');links.className='project-links';body.append(links)}links.append(source.cloneNode(true))}}
    main.dataset.physicsSourceRevision='1';
  }
  function migrateAvatar(container){
    const main=container.querySelector('#main');if(!main||main.dataset.avatarRevision==='1')return;
    const photo=templateDocument.querySelector('.avatar-with-photo');if(photo){const avatar=container.querySelector('.profile .avatar');if(avatar)avatar.replaceWith(photo.cloneNode(true));else (container.querySelector('.profile-heading')||container.querySelector('.profile'))?.prepend(photo.cloneNode(true))}
    main.dataset.avatarRevision='1';
  }
  function sanitize(html) {
    if(typeof html!=='string'||html.length>600000)throw Error('草稿格式不正确或内容过大。');
    const parsed=new DOMParser().parseFromString('<div>'+html+'</div>','text/html');
    const container=parsed.body.firstElementChild;
    migrateProfileContent(container);
    migratePhysicsSource(container);
    migrateAvatar(container);
    window.ResumeUI?.normalizeLayout(container);
    window.ResumeI18n?.annotate(container);
    for(const element of [...container.querySelectorAll('*')]) {
      const tag=element.tagName.toUpperCase();
      if(!allowedTags.has(tag)){element.remove();continue}
      for(const attr of [...element.attributes]) {
        const name=attr.name;
        if(name==='class'){element.className.baseVal!==undefined?element.setAttribute('class',attr.value.split(/\s+/).filter(c=>allowedClasses.has(c)).join(' ')):element.className=attr.value.split(/\s+/).filter(c=>allowedClasses.has(c)).join(' ');}
        else if(name==='id'){if(!allowedIds.has(attr.value))element.removeAttribute(name)}
        else if(name==='href'&&(tag==='A'||tag==='USE')){const url=safeURL(attr.value);if(url===null)element.removeAttribute(name)}
        else if(name==='target'&&tag==='A'){element.setAttribute('target','_blank');element.setAttribute('rel','noopener noreferrer')}
        else if(name==='src'&&tag==='IMG'){if(!/^(avatar\.jpg(?:\?v=[a-f0-9]{12})?|data:image\/jpeg;base64,[A-Za-z0-9+/=]+)$/.test(attr.value))element.removeAttribute(name)}
        else if(tag==='IMG'&&['alt','width','height','decoding','fetchpriority'].includes(name))continue;
        else if(positionAttributes.includes(name)){const value=Number(attr.value);if(!Number.isFinite(value))element.removeAttribute(name);else element.setAttribute(name,String(clampPosition(value)))}
        else if(!['lang','aria-label','aria-labelledby','aria-live','aria-hidden','role','scope','open','rel','type','viewBox','download','data-block-deleted','data-content-revision','data-physics-source-revision','data-avatar-revision','data-layout-revision','data-body-size-revision','data-i18n-values','data-i18n-reviewed'].includes(name))element.removeAttribute(name);
      }
    }
    for(const id of ['main','about','education','projects','teaching','honors','skills','copy-wechat','wechat-id','copy-status'])if(container.querySelectorAll('#'+id).length!==1)throw Error('草稿缺少必要的页面区域，未载入。');
    if(!container.querySelector('.profile'))throw Error('草稿缺少个人资料区域。');
    const legacyLayout=!container.querySelector('#resume-content');
    const about=container.querySelector('#about'),skills=container.querySelector('#skills'),main=container.querySelector('#main');
    skills.className='skills-inline';const introLinks=about.querySelector('.intro-links');if(introLinks)introLinks.before(skills);else if(!skills.parentElement?.classList.contains('about-lower'))about.append(skills);
    if(legacyLayout&&!about.querySelector('.cv-download')){const cv=templateDocument.querySelector('.cv-download');if(cv)about.querySelector('.intro-links')?.append(cv.cloneNode(true))}
    const wrapper=document.createElement('div');wrapper.id='resume-content';wrapper.className='resume-content';wrapper.append(templateDocument.querySelector('#resume-tabs').cloneNode(true));
    const panels=document.createElement('div');panels.className='content-panels';
    for(const id of ['projects','education','teaching','honors']){const section=container.querySelector('#'+id);section.classList.add('content-panel');section.hidden=false;section.removeAttribute('role');section.setAttribute('aria-labelledby',id+'-title');panels.append(section)}
    container.querySelector('#resume-content')?.remove();container.querySelector('#resume-tabs')?.remove();wrapper.append(panels);main.insertBefore(wrapper,main.querySelector('.main-footer'));
    return container.innerHTML;
  }
  function cleanLayout() {
    const clone=root().cloneNode(true);
    for(const element of clone.querySelectorAll('[style]'))if(!element.style.cssText.trim())element.removeAttribute('style');
    for(const multiline of clone.querySelectorAll('.resume-multiline'))multiline.replaceWith(...multiline.childNodes);
    for(const field of clone.querySelectorAll('[data-editor-field]')){
      const value=field.textContent.replace(/\r\n?/g,'\n');
      if(value.includes('\n')){const multiline=document.createElement('span');multiline.className='resume-multiline';multiline.textContent=value;field.replaceWith(multiline)}
      else field.replaceWith(document.createTextNode(value));
    }
    for(const element of clone.querySelectorAll('.editor-selected')){element.classList.remove('editor-selected');if(!element.className)element.removeAttribute('class')}
    window.ResumeI18n?.canonicalize(clone);
    clone.querySelector('#copy-status').textContent='';
    clone.querySelector('#resume-tabs')?.removeAttribute('role');
    for(const tab of clone.querySelectorAll('#resume-tabs a'))for(const attr of ['role','aria-controls','aria-selected','tabindex'])tab.removeAttribute(attr);
    for(const section of clone.querySelectorAll('.content-panel')){section.removeAttribute('hidden');section.removeAttribute('role');section.setAttribute('aria-labelledby',section.id+'-title')}
    return clone.innerHTML;
  }
  function snapshot() {return {version:1,base,html:cleanLayout(),typography:{...typography}}}
  function status(message) {rememberedStatus=message;$('#editor-status').textContent=t(message)}
  function prepare() {
    window.ResumeI18n?.annotate(root());
    const walker=document.createTreeWalker(root(),NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode()){const n=walker.currentNode;if((n.textContent.trim()||n.parentElement.closest('.resume-multiline'))&&!n.parentElement.closest('svg,button,#copy-status,#resume-tabs'))nodes.push(n)}
    nodes.forEach((n,i)=>{const field=document.createElement('span');field.dataset.editorField=String(i);field.textContent=n.textContent;n.replaceWith(field)});
    window.ResumeI18n?.renderRoot(root());applyPositions();setFields();clearSelection();window.ResumeUI?.refresh();
  }
  function clampPosition(value){return Math.round(Math.max(-4000,Math.min(4000,Number(value)||0))*10)/10}
  function positionKeys(){return innerWidth<=680?['data-free-mobile-x','data-free-mobile-y']:['data-free-x','data-free-y']}
  function moveTarget(field=selected){if(!field)return null;const existing=field.closest(positionAttributes.map(name=>'['+name+']').join(','));if(existing)return existing;const anchor=field.closest('a');if(anchor&&(field===anchor||anchor.querySelectorAll('[data-editor-field]').length===1))return anchor;const host=field.closest('[data-i18n-values],.resume-multiline,.resume-free-text');if(host)return host;const span=document.createElement('span');span.className='resume-free-text';field.replaceWith(span);span.append(field);return span}
  function applyPositions(){for(const element of root().querySelectorAll(positionAttributes.map(name=>'['+name+']').join(',')))for(const [attribute,property]of positionAttributes.map((name,i)=>[name,['--free-x','--free-y','--free-mobile-x','--free-mobile-y'][i]]))element.style.setProperty(property,clampPosition(element.getAttribute(attribute))+'px');syncPositionControls()}
  function syncPositionControls(){const target=selected&&root().contains(selected)?moveTarget():null,keys=positionKeys();for(const [i,axis]of ['x','y'].entries()){const input=$('#editor-position-'+axis);input.disabled=!target;input.value=target?clampPosition(target.getAttribute(keys[i])):''}$('#editor-position-reset').disabled=!target;$('#editor-position-device').textContent=t(innerWidth<=680?'当前调整：手机位置':'当前调整：电脑位置')}
  function setPosition(target,x,y){const keys=positionKeys();target.setAttribute(keys[0],String(clampPosition(x)));target.setAttribute(keys[1],String(clampPosition(y)));applyPositions()}
  function setMoving(value){moving=Boolean(value&&editing);document.body.classList.toggle('resume-moving',moving);$('#editor-move-mode').setAttribute('aria-pressed',String(moving));$('#editor-move-mode').textContent=t(moving?'关闭自由拖动':'开启自由拖动');setFields()}
  function finishDrag(cancel=false){if(!drag)return;const current=drag;drag=null;try{current.field.releasePointerCapture(current.id)}catch{}if(cancel){for(const [name,value]of current.original){if(value===null)current.target.removeAttribute(name);else current.target.setAttribute(name,value)}for(const property of ['--free-x','--free-y','--free-mobile-x','--free-mobile-y'])current.target.style.removeProperty(property);applyPositions()}else{commit();status('已移动文字块，可用「撤销」恢复。')}}
  function syncCaretBreak(field){for(const marker of field.querySelectorAll('[data-editor-caret]'))marker.remove();if(editing&&!moving&&field.textContent.endsWith('\n')){const marker=document.createElement('br');marker.dataset.editorCaret='';field.append(marker)}}
  function setFields() {for(const field of root().querySelectorAll('[data-editor-field]')){if(editing){field.setAttribute('contenteditable',moving?'false':'plaintext-only');field.setAttribute('spellcheck','false');if(moving)field.setAttribute('tabindex','0');else field.removeAttribute('tabindex')}else{field.removeAttribute('contenteditable');field.removeAttribute('spellcheck');field.removeAttribute('tabindex');field.classList.remove('editor-selected')}syncCaretBreak(field)}if(!editing)for(const element of root().querySelectorAll('.editor-selected'))element.classList.remove('editor-selected')}
  function clearSelection(){selected?.classList.remove('editor-selected');selected=null;$('#editor-text').value='';$('#editor-link').value='';$('#editor-text').disabled=true;$('#editor-link').disabled=true;$('#editor-remove').disabled=true;$('#editor-remove').textContent=t('删除整条经历');$('#editor-delete-block').disabled=true;$('#editor-selection').textContent=t('先点选网页中的一段文字')}
  function applyTypography() {
    if(JSON.stringify(typography)===JSON.stringify(initialTypography)){
      $('#resume-custom-style')?.remove();const initial=templateDocument.querySelector('#resume-custom-style');if(initial)document.head.append(initial.cloneNode(true));syncControls();window.dispatchEvent(new Event('resize'));return;
    }
    let style=$('#resume-custom-style');if(!style){style=document.createElement('style');style.id='resume-custom-style';document.head.append(style)}
    const v=typography;style.dataset.settings=JSON.stringify(v);
    style.textContent=(v.font==='default'?'':`body .page-layout *:not(svg):not(use),body .brand{font-family:${fonts[v.font]}!important}`)+`
      body .about-copy p{font-size:${v.body}px;line-height:${v.line}}
      body .project-body>p:not(.project-category),body .entry-description,body .entry-subtitle,body .institution-en,body .skills-inline .skills-list dd,body .awards-list strong,body .awards-list p{font-size:${v.body}px;line-height:${v.line}}
      body .skills-list .skill-tag{font-size:inherit}
      body .contact-link>span>span,body .wechat-contact>div{font-size:${v.body*.86}px}
      body h1{font-size:${v.title}px;overflow-wrap:anywhere}body .section-heading h2{font-size:${v.heading}px}body .skills-inline .section-heading h2{font-size:${Math.max(18,v.heading*.72)}px}
      body .section{margin-bottom:${43*v.spacing}px;padding-bottom:${45*v.spacing}px}
      @media(max-width:680px){body h1{font-size:clamp(28px,9vw,${v.title}px)}body .section{margin-bottom:${34*v.spacing}px;padding-bottom:${34*v.spacing}px}body .contact-link>span>span{font-size:${Math.min(12,v.body*.8)}px}}
      @media print{body .about-copy p,body .project-body>p:not(.project-category){font-size:11px}body .section{padding-bottom:22px;margin-bottom:22px}}`;
    syncControls();window.dispatchEvent(new Event('resize'));
  }
  function syncControls(){ $('#editor-font').value=typography.font;for(const input of panel.querySelectorAll('[data-setting]')){const key=input.dataset.setting;input.value=typography[key];$('#output-'+key).textContent=key==='line'?Number(typography[key]).toFixed(2):key==='spacing'?Math.round(typography[key]*100)+'%':typography[key]+' px'} }
  function saveDraft(){try{localStorage.setItem(KEY,JSON.stringify(snapshot()));status('草稿已保存到当前浏览器。尚未发布到网站。');return true}catch{status('浏览器无法保存草稿，请使用「备份草稿」或导出网站保存。');return false}}
  function markChanged(){const current=snapshot();const changed=current.html!==original||JSON.stringify(current.typography)!==JSON.stringify(initialTypography);$('#editor-draft-badge').hidden=!changed;$('#editor-undo').disabled=history.length<2;$('#editor-redo').disabled=!future.length}
  function commit(){clearTimeout(timer);timer=null;const current=snapshot();if(JSON.stringify(history.at(-1))!==JSON.stringify(current)){history.push(current);if(history.length>50)history.shift();future=[];saveDraft()}markChanged()}
  function deferCommit(){clearTimeout(timer);timer=setTimeout(commit,450)}
  function restore(state){
    const html=sanitize(state.html);root().innerHTML=html;typography=validTypography(state.typography);
    if(!state.html.includes('data-body-size-revision="20261104-body17"'))typography.body=17;
    root().querySelector('#main').dataset.bodySizeRevision='20261104-body17';
    if(!state.html.includes('data-layout-revision="20261104-user-draft"')){typography.line=Math.max(1.75,typography.line);typography.spacing=Math.max(.85,typography.spacing)}
    prepare();applyTypography();markChanged();window.dispatchEvent(new Event('resize'));
  }
  function changeEditing(value){finishDrag();commit();editing=value;if(editing){panel.classList.remove('editor-panel-folded');$('#editor-panel-fold').setAttribute('aria-expanded','true');$('#editor-panel-fold').textContent=t('收起面板')}if(!editing)setMoving(false);document.body.classList.toggle('resume-editing',editing);panel.hidden=!editing;$('#editor-toggle').textContent=t(editing?'结束编辑':'编辑网站');$('#editor-toggle').setAttribute('aria-expanded',String(editing));setFields();if(!editing)clearSelection()}
  function selectField(field){if(selected!==field)commit();selected?.classList.remove('editor-selected');selected=field;field.classList.add('editor-selected');$('#editor-text').disabled=false;$('#editor-link').disabled=false;$('#editor-text').value=field.textContent;$('#editor-link').value=field.closest('a')?.getAttribute('href')||'';const entry=entryOf(field);$('#editor-remove').disabled=!entry;$('#editor-remove').textContent=t(entry?.matches('.project')?'删除整条项目':entry?.matches('.timeline-item')?'删除整条教育经历':entry?.matches('.teaching-entry')?'删除整条教学经历':entry?'删除整条奖项':'删除整条经历');$('#editor-delete-block').disabled=false;$('#editor-selection').textContent=t('已选中：')+(field.textContent.trim().slice(0,35)||t('链接图标'));syncPositionControls()}
  function entryOf(field){return field?.closest('.timeline-item,.project,.teaching-entry,.awards-list>li')}
  function deleteTextBlock(){
    if(!selected||!root().contains(selected))return;
    const boundary=entryOf(selected)||selected.closest('#about,#skills,.profile,.content-panel')||root();
    const anchor=selected.closest('a');
    const target=anchor&&(selected===anchor||anchor.querySelectorAll('[data-editor-field]').length<=1)?anchor:selected;
    const parent=target.parentElement;
    const region=parent.closest('p,small,dd,dt,h1,h2,h3,h4')||parent;
    target.remove();
    for(const separator of [...region.querySelectorAll('.mid-dot')]){
      if(!separator.textContent.trim()){separator.remove();continue}
      const before=document.createRange(),after=document.createRange();before.selectNodeContents(separator.parentElement);before.setEndBefore(separator);after.selectNodeContents(separator.parentElement);after.setStartAfter(separator);
      if(!before.toString().trim()||!after.toString().trim())separator.remove();
    }
    for(let element=parent;element&&element!==boundary&&element!==root();){
      if(element.matches('td,th,tr,tbody,thead,table'))break;
      if(element.textContent.trim()||element.querySelector('svg,button'))break;
      if(element.id||element.querySelector('[id]')){element.setAttribute('data-block-deleted','true');break}
      if(!element.matches('span,strong,small,p,h1,h2,h3,h4,dd,dt,.project-links,.intro-links,.entry-top,.section-heading,.project-marker,.about-copy,.skills-list>div'))break;
      const next=element.parentElement;element.remove();element=next;
    }
    root().innerHTML=cleanLayout();prepare();commit();status('已删除文字块，可用「撤销」恢复。');
  }
  function renumberProjects(){for(const [i,marker] of [...root().querySelectorAll('.project-marker')].entries())marker.textContent=String(i+1).padStart(2,'0')}
  function plainInsert(value){const selection=getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);range.deleteContents();const text=document.createTextNode(value);range.insertNode(text);range.setStart(text,text.length);range.collapse(true);syncCaretBreak(selected);selection.removeAllRanges();selection.addRange(range);$('#editor-text').value=selected.textContent;deferCommit()}
  function updateLink(value){if(!selected)return;const url=safeURL(value.trim());if(url===null){status('链接格式不正确，请使用 https://、mailto:、tel: 或页面锚点。');return}let anchor=selected.closest('a');if(url){if(!anchor){anchor=document.createElement('a');selected.replaceWith(anchor);anchor.append(selected)}anchor.setAttribute('href',url);if(/^https?:/.test(url)){anchor.target='_blank';anchor.rel='noopener noreferrer'}}else if(anchor)anchor.replaceWith(...anchor.childNodes);commit()}
  function addEntry(){commit();const type=$('#editor-add-type').value;let element,container;
    if(type==='education'){container=$('#education .timeline');element=document.createElement('article');element.className='timeline-item';element.innerHTML='<span class="timeline-dot" aria-hidden="true"></span><div class="entry-top"><h3>新教育经历</h3><p class="date">起止时间</p></div><p class="institution-en">机构英文名称</p><p class="entry-subtitle">学历／课程</p><p class="entry-description">补充说明</p>'}
    if(type==='project'){container=$('#projects');element=document.createElement('article');element.className='project';element.innerHTML='<div class="project-marker" aria-hidden="true">'+String(container.querySelectorAll('.project').length+1).padStart(2,'0')+'</div><div class="project-body"><div class="entry-top"><h3>新项目</h3><p class="date">年份</p></div><p class="project-category">类型 / 技术</p><p>在这里介绍你的项目与贡献。</p></div>'}
    if(type==='teaching'){container=$('#teaching');element=document.createElement('article');element.className='teaching-entry';element.innerHTML='<div class="entry-top"><h3>新教学经历</h3><p class="date">起止时间</p></div><p class="entry-subtitle">角色／职位</p><p class="entry-description">在这里介绍你的教学内容。</p>'}
    if(type==='award'){container=$('.awards-list');element=document.createElement('li');element.innerHTML='<span class="award-year">年份</span><div><strong>新荣誉与奖项</strong><p>补充说明</p></div>'}
    if(type==='project')container.insertBefore(element,container.querySelector('.all-projects'));else container.append(element);
    renumberProjects();const html=cleanLayout();root().innerHTML=html;prepare();window.ResumeUI?.selectPanel(type==='project'?'projects':type==='award'?'honors':type);const fresh=type==='education'?$('#education .timeline-item:last-child'):type==='project'?$('#projects .project:last-of-type'):type==='teaching'?$('#teaching .teaching-entry:last-child'):$('.awards-list>li:last-child');selectField(fresh.querySelector('h3 [data-editor-field],strong [data-editor-field]'));fresh.scrollIntoView({block:'center',behavior:'smooth'});commit();status('已新增一项，点选占位文字即可改写。')
  }
  function download(name,data,type){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
  function buildDocument(standalone=false,preview=false){const clone=templateDocument.cloneNode(true);clone.querySelector('.page-layout').innerHTML=cleanLayout();clone.querySelector('#resume-custom-style')?.remove();const style=$('#resume-custom-style');if(style)clone.querySelector('head').append(style.cloneNode(true));
    window.ResumeI18n?.renderDocument(clone);
    if(standalone){const photo=clone.querySelector('.avatar-photo');if(photo){if(!window.ResumeAvatar)throw Error(t('头像资源未载入，请重新加载页面。'));photo.setAttribute('src','data:image/jpeg;base64,'+window.ResumeAvatar)}}
    if(standalone){const assets=window.ResumeAssets;if(!assets||!window.ResumeFont)throw Error('字体或导出资源未载入，请重试。');for(const link of [...clone.querySelectorAll('link[rel=stylesheet]')]){const name=link.getAttribute('href').split('?')[0];const s=document.createElement('style');s.textContent=(assets[name]||'').replace('fonts/NotoSansSC-VF.woff2','data:font/woff2;base64,'+window.ResumeFont);link.replaceWith(s)}const license=document.createComment(assets['fonts/OFL.txt']);clone.querySelector('head').append(license);for(const script of [...clone.querySelectorAll('script')])script.remove();const icon=clone.querySelector('link[rel=icon]');icon.href='data:image/svg+xml,'+encodeURIComponent(assets['favicon.svg']);
      const code=[cvSource(),assets['i18n.js'],assets['app.js']];if(!preview)code.push(assetSource(),assets['editor.js']);for(const text of code){const script=document.createElement('script');script.textContent=text.replace(/<\/script/gi,'<\\/script');clone.querySelector('body').append(script)}}
    clone.dataset.theme=document.documentElement.dataset.theme;clone.querySelector('meta[name="theme-color"]')?.setAttribute('content',document.documentElement.dataset.theme==='light'?'#f7f8fa':'#414141');clone.querySelector('body').classList.remove('resume-editing','resume-moving');return '<!doctype html>\n'+clone.outerHTML;
  }
  function assetSource(){return 'window.ResumeAssets = '+JSON.stringify(window.ResumeAssets).replace(/</g,'\\u003c')+';\nwindow.ResumeFontURL = '+JSON.stringify(window.ResumeFontURL||'font-data.js')+';\nwindow.ResumeCVURL = '+JSON.stringify(window.ResumeCVURL||'cv-data.js')+';\nwindow.ResumeAvatar = '+JSON.stringify(window.ResumeAvatar)+';\n'}
  function cvSource(){return 'window.ResumeCV = '+JSON.stringify(window.ResumeCV)+';\n'}
  let cvLoading;
  async function ensureCV(){if(window.ResumeCV)return;if(!cvLoading)cvLoading=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=window.ResumeCVURL||'cv-data.js';script.onload=()=>window.ResumeCV?resolve():reject(Error('未能载入 CV，请重试。'));script.onerror=()=>{cvLoading=null;script.remove();reject(Error('未能载入 CV，请重新加载页面。'))};document.head.append(script)});await cvLoading}
  let fontLoading;
  async function ensureFont(){
    if(window.ResumeFont)return;
    for(const style of document.querySelectorAll('style')){const match=style.textContent.match(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/);if(match){window.ResumeFont=match[1];return}}
    if(!fontLoading)fontLoading=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=window.ResumeFontURL||'font-data.js';script.onload=()=>window.ResumeFont?resolve():reject(Error('未能载入字体，请重试。'));script.onerror=()=>{fontLoading=null;script.remove();reject(Error('未能载入字体，请重新加载页面。'))};document.head.append(script)});
    await fontLoading;
  }
  function zipFiles(files){const encoder=new TextEncoder();const chunks=[],central=[];let offset=0;let entries=0;
    const crc=data=>{let n=0xffffffff;for(const b of data){n^=b;for(let k=0;k<8;k++)n=(n>>>1)^((n&1)?0xedb88320:0)}return (n^0xffffffff)>>>0};
    const header=(size)=>{const bytes=new Uint8Array(size);return [bytes,new DataView(bytes.buffer)]};
    for(const [name,value]of Object.entries(files)){const data=value instanceof Uint8Array?value:encoder.encode(value),filename=encoder.encode(name),checksum=crc(data);const [local,l]=header(30);l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint32(14,checksum,true);l.setUint32(18,data.length,true);l.setUint32(22,data.length,true);l.setUint16(26,filename.length,true);chunks.push(local,filename,data);const[c,v]=header(46);v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint32(16,checksum,true);v.setUint32(20,data.length,true);v.setUint32(24,data.length,true);v.setUint16(28,filename.length,true);v.setUint32(42,offset,true);central.push(c,filename);offset+=30+filename.length+data.length;entries++}
    const centralSize=central.reduce((sum,b)=>sum+b.length,0);const[end,e]=header(22);e.setUint32(0,0x06054b50,true);e.setUint16(8,entries,true);e.setUint16(10,entries,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);return new Blob([...chunks,...central,end],{type:'application/zip'});
  }
  function loadState(value){if(!value||value.version!==1)throw Error('这不是有效的个人主页草稿。');restore(value);commit();status('草稿已载入。当前修改尚未发布。')}
  async function action(name){if(name!=='undo'&&name!=='redo')commit();
    if(name==='fold'){const folded=panel.classList.toggle('editor-panel-folded');$('#editor-panel-fold').setAttribute('aria-expanded',String(!folded));$('#editor-panel-fold').textContent=t(folded?'展开面板':'收起面板')}
    if(name==='close')changeEditing(false);
    if(name==='save')saveDraft();
    if(name==='undo'){if(timer)commit();if(history.length>1){future.push(history.pop());restore(history.at(-1));saveDraft();markChanged();status('已撤销。')}}
    if(name==='redo'&&future.length){const state=future.pop();history.push(state);restore(state);saveDraft();markChanged();status('已重做。')}
    if(name==='add')addEntry();
    if(name==='delete-block')deleteTextBlock();
    if(name==='move-mode')setMoving(!moving);
    if(name==='position-reset'&&selected){const target=moveTarget();for(const attribute of positionAttributes)target.removeAttribute(attribute);for(const property of ['--free-x','--free-y','--free-mobile-x','--free-mobile-y'])target.style.removeProperty(property);syncPositionControls();commit();status('已重置文字块位置。')}
    if(name==='remove'){const entry=entryOf(selected);if(entry){entry.remove();renumberProjects();root().innerHTML=cleanLayout();prepare();commit();status('已删除整条记录，可用「撤销」恢复。')}}
    if(name==='load'){const raw=localStorage.getItem(KEY);if(raw)loadState(JSON.parse(raw));else status('当前浏览器还没有保存的草稿。')}
    if(name==='reset')$('#editor-confirm').showModal();
    if(name==='reset-cancel')$('#editor-confirm').close();
    if(name==='reset-confirm'){$('#editor-confirm').close();restore({html:original,typography:initialTypography});commit();status('已恢复此网站文件的默认内容与排版。')}
    if(name==='backup')download('田哲豪-主页草稿.json',JSON.stringify({...snapshot(),savedAt:new Date().toISOString()},null,2),'application/json');
    if(name==='import')$('#editor-import').click();
    if(name==='html'){status('正在准备网页和字体…');await Promise.all([ensureFont(),ensureCV()]);download('田哲豪-个人主页.html',buildDocument(true),'text/html;charset=utf-8');status('已导出单文件网页，包含字体和 CV。')}
    if(name==='export'){if(!window.ResumeAssets||!window.ResumeAvatar)throw Error('导出资源未载入，请重新加载页面后再试。');status('正在打包网页和字体…');await Promise.all([ensureFont(),ensureCV()]);const bytes=Uint8Array.from(atob(window.ResumeFont),c=>c.charCodeAt(0)),cv=Uint8Array.from(atob(window.ResumeCV),c=>c.charCodeAt(0)),avatar=Uint8Array.from(atob(window.ResumeAvatar),c=>c.charCodeAt(0));download('田哲豪-个人主页-完整网站.zip',zipFiles({'index.html':buildDocument(),...window.ResumeAssets,'editor-assets.js':assetSource(),'fonts/NotoSansSC-VF.woff2':bytes,'font-data.js':'window.ResumeFont = '+JSON.stringify(window.ResumeFont)+';\n','TIAN_Jaho_CV.pdf':cv,'cv-data.js':cvSource(),'avatar.jpg':avatar}),'application/zip');status('已导出完整网站 ZIP。重新发布后，线上内容才会更新。')}
    if(name==='preview'){status('正在准备预览…');await Promise.all([ensureFont(),ensureCV()]);$('#editor-preview-frame').srcdoc=buildDocument(true,true);$('#editor-preview').showModal();status('已打开预览。')}
    if(name==='desktop'||name==='mobile')$('#editor-preview').dataset.device=name;
    if(name==='preview-close'){$('#editor-preview').close();$('#editor-preview-frame').removeAttribute('srcdoc')}
  }
  $('#editor-toggle').addEventListener('click',()=>changeEditing(!editing));
  document.addEventListener('pointerdown',event=>{const anchor=event.target.closest('a'),direct=event.target.closest('[data-editor-field]');if(anchor?.closest('#resume-tabs'))return;const fields=anchor?.querySelectorAll('[data-editor-field]');const field=direct||(anchor?(fields.length===1?fields[0]:anchor):null);if(!editing||!moving||!field||!root().contains(field)||event.button!==0)return;event.preventDefault();event.stopPropagation();finishDrag();selectField(field);field.focus({preventScroll:true});const target=moveTarget(field),keys=positionKeys();drag={field,target,id:event.pointerId,x:event.clientX,y:event.clientY,startX:clampPosition(target.getAttribute(keys[0])),startY:clampPosition(target.getAttribute(keys[1])),original:positionAttributes.map(name=>[name,target.getAttribute(name)])};field.setPointerCapture(event.pointerId)},true);
  document.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;event.preventDefault();setPosition(drag.target,drag.startX+event.clientX-drag.x,drag.startY+event.clientY-drag.y)},{passive:false});
  document.addEventListener('pointerup',event=>{if(drag&&event.pointerId===drag.id)finishDrag()});
  document.addEventListener('pointercancel',()=>finishDrag(true));
  document.addEventListener('dragstart',event=>{if(editing&&moving&&root().contains(event.target)&&event.target.closest('a'))event.preventDefault()});
  document.addEventListener('keydown',event=>{if(drag&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finishDrag(true);return}if(!moving||!selected||!(event.target.matches('[data-editor-field]')||event.target===selected)||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();event.stopImmediatePropagation();const target=moveTarget(),keys=positionKeys(),step=event.shiftKey?10:1;setPosition(target,Number(target.getAttribute(keys[0]))+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),Number(target.getAttribute(keys[1]))+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0));deferCommit()},true);
  for(const axis of ['x','y']){$('#editor-position-'+axis).addEventListener('change',()=>{if(!selected)return;setPosition(moveTarget(),$('#editor-position-x').value,$('#editor-position-y').value);commit()});$('#editor-position-'+axis).addEventListener('keydown',event=>{if(event.key==='Enter')event.target.blur()})}
  window.addEventListener('resize',()=>{finishDrag(true);syncPositionControls()});
  document.addEventListener('click',event=>{const trigger=event.target.closest('[data-action]');if(trigger){action(trigger.dataset.action).catch(e=>status(e.message));return}if(editing&&event.target.closest('#resume-tabs,.site-header nav')){commit();clearSelection();return}if(!editing||!root().contains(event.target))return;const anchor=event.target.closest('a');if(anchor)event.preventDefault();const field=event.target.closest('[data-editor-field]');if(field){if(field.closest('summary'))event.preventDefault();selectField(field)}else if(anchor)selectField(anchor)},true);
  document.addEventListener('focusin',event=>{if(editing&&event.target.matches('[data-editor-field]'))selectField(event.target)});
  document.addEventListener('input',event=>{if(editing&&event.target.matches('[data-editor-field]')){syncCaretBreak(event.target);$('#editor-text').value=event.target.textContent;deferCommit()}});
  document.addEventListener('paste',event=>{if(editing&&event.target.matches('[data-editor-field]')){event.preventDefault();plainInsert(event.clipboardData.getData('text/plain'))}});
  document.addEventListener('beforeinput',event=>{if(editing&&event.target.matches('[data-editor-field]')&&['insertParagraph','insertLineBreak'].includes(event.inputType)){event.preventDefault();plainInsert('\n')}});
  $('#editor-text').addEventListener('input',event=>{if(selected){selected.textContent=event.target.value;syncCaretBreak(selected);deferCommit()}});
  $('#editor-text').addEventListener('change',commit);$('#editor-link').addEventListener('change',event=>updateLink(event.target.value));
  $('#editor-font').addEventListener('change',event=>{typography.font=event.target.value;applyTypography();commit()});
  for(const input of panel.querySelectorAll('[data-setting]')){input.addEventListener('input',()=>{typography[input.dataset.setting]=Number(input.value);applyTypography()});input.addEventListener('change',commit)}
  $('#editor-import').addEventListener('change',async event=>{try{const file=event.target.files[0];if(file){if(file.size>1000000)throw Error('草稿文件过大。');loadState(JSON.parse(await file.text()))}}catch(e){status(e.message)}finally{event.target.value=''}});
  document.addEventListener('keydown',event=>{if(editing&&event.target.closest('#resume-tabs')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)){commit();clearSelection()}if(event.key==='Escape'&&editing&&!$('#editor-preview').open&&!$('#editor-confirm').open)changeEditing(false)});
  window.addEventListener('pagehide',()=>{if(timer)commit()});
  document.addEventListener('resume-language-beforechange',()=>{finishDrag();commit();clearSelection()});
  document.addEventListener('resume-language-change',()=>{setFields();clearSelection();$('#editor-panel-fold').textContent=t(panel.classList.contains('editor-panel-folded')?'展开面板':'收起面板');if(rememberedStatus)status(rememberedStatus);window.ResumeUI?.refresh()});
  root().innerHTML=sanitize(original);prepare();original=cleanLayout();base=hash(original);syncControls();history=[snapshot()];markChanged();
  try{const raw=localStorage.getItem(KEY);if(raw){const draft=JSON.parse(raw);if(draft.version===1&&(draft.base===base||compatibleBases.has(draft.base)||(typeof draft.html==='string'&&draft.html.includes('data-avatar-revision="1"')))){const upgrading=draft.base!==base;if(upgrading){const backupKey=KEY+'-before-'+DRAFT_REVISION;if(!localStorage.getItem(backupKey))localStorage.setItem(backupKey,raw)}restore(draft);history=[snapshot()];markChanged();saveDraft();status(upgrading?'已更新旧草稿，保留其他修改。原草稿已在当前浏览器留存。':'已恢复本地草稿。修改尚未发布。')}else status('有另一版本的草稿。需要时可点「载入草稿」，或先备份当前内容。')}}catch{status('未能载入本地草稿。可导入备份继续编辑。')}
})();
