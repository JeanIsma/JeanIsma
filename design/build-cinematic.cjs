/* node design/build-cinematic.cjs — Requires sharp. All motion is inside standalone SVGs. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname,'..');
const out = path.join(root,'assets/v2');
const xml = s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const t=(x,y,s,n=26,c='#eff7f3',a='')=>`<text x="${x}" y="${y}" font-size="${n}" fill="${c}" ${a}>${xml(s)}</text>`;
const rect=(x,y,w,h,r=22,fill='url(#glass)',stroke='url(#edge)')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const label=(x,y,s,c='#b6cfbf')=>t(x,y,s,17,c,'letter-spacing="2.5" font-weight="600"');
const chip=(x,y,w,s)=>rect(x,y,w,42,21,'#d9f9e511','#c7ffdf33')+t(x+w/2,y+27,s,16,'#d9f2e4','text-anchor="middle"');

async function main(){
  await fs.mkdir(out,{recursive:true});
  const source=await fs.access(path.join(__dirname,'cinematic-source.png')).then(()=> 'cinematic-source.png').catch(()=> 'cinematic-source.jpg');
  const photo=source.endsWith('.png')?await sharp(path.join(__dirname,source)).resize(1600).jpeg({quality:86,mozjpeg:true}).toBuffer():await fs.readFile(path.join(__dirname,source));
  await fs.writeFile(path.join(__dirname,'cinematic-source.jpg'),photo);
  const shotSource=await fs.access(path.join(__dirname,'simpletrain-demo.png')).then(()=> 'simpletrain-demo.png').catch(()=> 'simpletrain-demo.jpg');
  const shot=shotSource.endsWith('.png')?await sharp(path.join(__dirname,shotSource)).jpeg({quality:91,mozjpeg:true}).toBuffer():await fs.readFile(path.join(__dirname,shotSource));
  await fs.writeFile(path.join(__dirname,'simpletrain-demo.jpg'),shot);
  const image='data:image/jpeg;base64,'+photo.toString('base64');
  const demo='data:image/jpeg;base64,'+shot.toString('base64');
  const logo='data:image/png;base64,'+(await fs.readFile(path.join(root,'assets/simpletrain-logo.png'))).toString('base64');
  const css=`text{font-family:Arial,Helvetica,sans-serif}.bold{font-weight:700}.micro{letter-spacing:2px}.bob{animation:bob 7s ease-in-out infinite}.bob2{animation:bob 9s ease-in-out -3s infinite}.shine{opacity:0;animation:shine 8s ease-in-out infinite}.pulse{animation:pulse 4s ease-in-out infinite}.orbit{animation:orbit 22s linear infinite;transform-origin:center;transform-box:fill-box}.signal{stroke-dasharray:7 19;animation:signal 6s linear infinite}.wave{animation:wave 8s ease-in-out infinite;transform-origin:center;transform-box:fill-box}.marquee{animation:marquee 40s linear infinite}.mist{animation:mist 12s ease-in-out infinite}.glint{animation:glint 5s ease-in-out infinite;transform-origin:center;transform-box:fill-box}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}@keyframes shine{0%,100%{transform:translateX(-600px);opacity:0}25%{opacity:0}45%{opacity:.8}70%{transform:translateX(2000px);opacity:0}}@keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}@keyframes orbit{to{transform:rotate(360deg)}}@keyframes signal{to{stroke-dashoffset:-156}}@keyframes wave{0%,100%{transform:scale(.95);opacity:.2}50%{transform:scale(1.06);opacity:.55}}@keyframes marquee{to{transform:translateX(-1764px)}}@keyframes mist{0%,100%{transform:translateX(-10px);opacity:.18}50%{transform:translateX(18px);opacity:.35}}@keyframes glint{0%,100%{opacity:.3;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}@media(prefers-reduced-motion:reduce){.bob,.bob2,.shine,.pulse,.orbit,.signal,.wave,.marquee,.mist,.glint{animation:none}.motion-only,.shine{display:none}}`;
  const defs=`
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e5fff5" stop-opacity=".19"/><stop offset=".4" stop-color="#789b9020"/><stop offset="1" stop-color="#061813" stop-opacity=".6"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0fff9" stop-opacity=".75"/><stop offset=".3" stop-color="#d6f5e0" stop-opacity=".15"/><stop offset=".65" stop-color="#d6f5e0" stop-opacity=".07"/><stop offset="1" stop-color="#f0fff9" stop-opacity=".54"/></linearGradient>
  <linearGradient id="cover"><stop stop-color="#030e0c" stop-opacity=".69"/><stop offset=".5" stop-color="#05120e" stop-opacity=".28"/><stop offset="1" stop-color="#03120c" stop-opacity="0"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#061916" stop-opacity="0"/><stop offset="1" stop-color="#051712" stop-opacity=".98"/></linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".42" stop-color="#fbfff9"/><stop offset=".74" stop-color="#e0f3e5"/><stop offset="1" stop-color="#97b7a7"/></linearGradient>
  <linearGradient id="sweep"><stop stop-color="#eafff1" stop-opacity="0"/><stop offset=".5" stop-color="#eafff1" stop-opacity=".22"/><stop offset="1" stop-color="#eafff1" stop-opacity="0"/></linearGradient>
  <radialGradient id="glow"><stop stop-color="#c4ff97" stop-opacity=".14"/><stop offset="1" stop-color="#a6ffa7" stop-opacity="0"/></radialGradient>
  <radialGradient id="purpleGlow"><stop stop-color="#ada9ff" stop-opacity=".28"/><stop offset="1" stop-color="#7b91ff" stop-opacity="0"/></radialGradient>
  <pattern id="grid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="#b0eec2" stroke-opacity=".035"/></pattern>
  <filter id="blur"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-opacity=".45" flood-color="#000"/></filter>
  <filter id="liquid" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".009 .018" numOctaves="1" seed="12" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" values="0;9;0" dur="9s" repeatCount="indefinite"/></feDisplacementMap></filter>`;
  const svg=(w,h,title,desc,body,more='')=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${xml(title)}</title><desc id="desc">${xml(desc)}</desc><defs>${defs}${more}</defs><style>${css}</style>${body}</svg>`;
  const pane=(w,h,inside)=>`<g clip-path="url(#outer)"><rect width="${w}" height="${h}" fill="#09181a"/><rect width="${w}" height="${h}" fill="url(#grid)"/><ellipse cx="${w*.85}" cy="${h*.3}" rx="${w*.4}" ry="${h*.9}" fill="url(#glow)"/>${inside}</g><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="28" fill="none" stroke="url(#edge)"/>`;
  const clip=(w,h)=>`<clipPath id="outer"><rect width="${w}" height="${h}" rx="30"/></clipPath>`;
  const save=async(name,content,preview=true)=>{
    content=content.replaceAll(`<image href="${image}" width="1600" height="1067"`,`<use href="#landscape-scene"`);
    if(content.includes('href="#landscape-scene"')) content=content.replace('<defs>',`<defs><image id="landscape-scene" href="${image}" width="1600" height="1067"/>`);
    await fs.writeFile(path.join(out,name+'.svg'),content);
    if(preview){const still=content.replace(/<animate\b[^>]*\/>/g,'').replace('</style>','.bob,.bob2,.shine,.pulse,.orbit,.signal,.wave,.marquee,.mist,.glint{animation:none}.motion-only,.shine{display:none}</style>');await sharp(Buffer.from(still)).resize({width:1200,withoutEnlargement:true}).png().toFile(path.join(out,name+'-still.png'));}
  };

  const background=`<image href="${image}" width="1600" height="1067"/>`;
  const hero=svg(1600,1040,'Jean Yildirim — AI Solutions Architect & Software Developer','A monumental liquid-glass sculpture in an alpine lake, with animated refraction, floating glass and moving highlights. Based in Germany. Building AI systems at GHS and SimpleTrain.ai.',`
  <g clip-path="url(#outer)">
    ${background}<g clip-path="url(#liquidRegion)" class="motion-only"><image href="${image}" width="1600" height="1067" filter="url(#liquid)"/></g>
    <rect width="1600" height="1040" fill="url(#cover)"/><rect y="605" width="1600" height="435" fill="url(#floor)"/>
    <rect x="27" y="27" width="1546" height="986" rx="23" fill="none" stroke="#e4fff1" stroke-opacity=".18"/>
    ${label(77,91,'JEANISMA / SELECTED WORK','#f0f6ef')}
    ${rect(1160,56,366,48,24,'#061812aa')}
    <circle cx="1188" cy="80" r="5" fill="#d6ff91" class="pulse"/>${t(1208,87,'OPEN TO OPPORTUNITIES',16,'#edffe2','letter-spacing="1.5"')}
    ${label(81,257,'SOFTWARE. INTELLIGENCE. EXPERIENCE.','#b6d8c1')}
    ${t(68,423,'JEAN',188,'url(#silver)','font-weight="700" letter-spacing="-9"')}
    ${t(70,563,'YILDIRIM',140,'url(#silver)','font-weight="700" letter-spacing="-7"')}
    ${t(82,637,'AI Solutions Architect',40,'#f3fff6','letter-spacing="-1"')}
    ${t(82,686,'Software Developer',32,'#b4d5c2','letter-spacing="-.5"')}
    <g transform="translate(1353,239)"><g class="glint"><path d="M-25 0H25M0-25V25" stroke="#fffdeb" stroke-width="1.5"/><circle r="3" fill="#fffdeb"/></g></g>
    <g transform="translate(1483,601)"><g class="glint"><path d="M-13 0H13M0-13V13" stroke="#fffdeb" stroke-width="1.2"/></g></g>
    <ellipse cx="1240" cy="711" rx="229" ry="15" fill="none" stroke="#d8f9e7" stroke-opacity=".3" class="wave"/>
    <ellipse cx="1240" cy="721" rx="280" ry="25" fill="none" stroke="#d8f9e7" stroke-opacity=".14" class="wave"/>
    <g transform="translate(1013,637)"><g class="bob2">${rect(0,0,248,57,28,'#12332677')}${t(124,36,'IDEA → SYSTEM',18,'#f5fff8','text-anchor="middle" letter-spacing="2"')}</g></g>
    <g clip-path="url(#statement)">${background.replace('height="1067"','height="1067" filter="url(#blur)"')}<rect x="75" y="755" width="805" height="138" fill="#11291eb3"/><path d="M-300 690L-170 690 100 940H-30Z" fill="url(#sweep)" class="shine"/></g>
    <rect x="75" y="755" width="805" height="138" rx="26" fill="none" stroke="url(#edge)"/>
    ${t(109,809,'Make complex systems',34,'#fff','letter-spacing="-.6"')}
    ${t(109,854,'feel beautifully simple.',34,'#d6ff91','letter-spacing="-.6"')}
    <g transform="translate(1126,772)"><g class="bob">${rect(0,0,399,120,29,'#10281bb0')}<image href="${logo}" x="18" y="18" width="84" height="84" clip-path="url(#logoClip)"/>${label(120,36,'BUILDING','#b4d5c2')}${t(119,77,'SimpleTrain.ai',33,'#fff','font-weight="700" letter-spacing="-1"')}${t(120,101,'AI compute made simple.',17,'#afccbb')}</g></g>
    <path d="M77 940H1523" stroke="#e2f3e8" stroke-opacity=".2"/>
    ${label(79,982,'GERMANY','#e3f1e9')}${label(534,982,'AI SOLUTIONS ARCHITECT / GHS','#b8d5c3')}${label(1264,982,'SCROLL TO EXPLORE ↓','#d6ff91')}
  </g>`,clip(1600,1040)+'<clipPath id="liquidRegion"><path d="M840 190H1555V677H840Z"/></clipPath><clipPath id="statement"><rect x="75" y="755" width="805" height="138" rx="26"/></clipPath><clipPath id="logoClip"><rect x="18" y="18" width="84" height="84" rx="22"/></clipPath>');
  await save('hero',hero);
  const mobile=svg(800,1110,'Jean Yildirim — AI Solutions Architect & Software Developer','Based in Germany. Open to opportunities. Building SimpleTrain.ai and applied AI systems at GHS.',`
    <g clip-path="url(#outer)"><rect width="800" height="1110" fill="#051712"/><image href="${image}" width="1000" height="667" x="-200"/><rect y="380" width="800" height="287" fill="url(#floor)"/>
    <g transform="translate(664,143)"><g class="glint"><path d="M-16 0H16M0-16V16" stroke="#fffce9" stroke-width="1.5"/><circle r="2" fill="#fff"/></g></g>
    ${rect(33,33,367,46,23,'#061812bb')}<circle cx="57" cy="56" r="5" fill="#d6ff91" class="pulse"/>${t(76,63,'OPEN TO OPPORTUNITIES',17,'#f2ffe8','letter-spacing="1.6"')}
    ${label(44,530,'JEANISMA / SOFTWARE & APPLIED AI','#c8e5d3')}
    ${t(33,653,'JEAN',133,'url(#silver)','font-weight="700" letter-spacing="-7"')}
    ${t(35,759,'YILDIRIM',106,'url(#silver)','font-weight="700" letter-spacing="-5"')}
    ${t(44,811,'AI Solutions Architect · Software Developer',29,'#e8faef')}
    <path d="M45 848H755" stroke="#dafce3" stroke-opacity=".22"/>
    ${t(45,893,'Make complex feel beautifully simple.',32,'#d6ff91','letter-spacing="-.8"')}
    ${rect(40,939,720,132,26,'#abcabc08')}<image href="${logo}" x="60" y="960" width="87" height="87"/>
    ${t(170,990,'Building SimpleTrain.ai',34,'#f7fff9','font-weight="700" letter-spacing="-1"')}${t(171,1034,'Germany · AI systems at GHS',24,'#b2d1bf')}
    </g><rect x="16" y="16" width="768" height="1078" rx="23" fill="none" stroke="#d1f7df" stroke-opacity=".19"/>`,clip(800,1110));
  await save('hero-mobile',mobile);

  const preview=svg(1600,650,'SimpleTrain.ai — explore the actual interactive prototype','A real screenshot from simpletrain.ai/demo. The product is in development. No live GPU sessions or payments. Product experience, workspace selection and compute configuration.',pane(1600,650,`
    <ellipse cx="1160" cy="290" rx="470" ry="410" fill="url(#purpleGlow)"/>
    ${label(65,64,'01 / INDEPENDENT PRODUCT','#b9c3ed')}
    <image href="${logo}" x="62" y="109" width="98" height="98"/>
    ${t(184,156,'SimpleTrain.ai',53,'#f4f5ff','font-weight="700" letter-spacing="-2"')}
    ${t(184,194,'AI compute made simple.',23,'#bcc7e5')}
    ${t(63,287,'Your idea.',60,'#eff7f3','font-weight="700" letter-spacing="-2"')}
    ${t(63,353,'Your workspace.',60,'#eff7f3','font-weight="700" letter-spacing="-2"')}
    ${t(63,419,'Less friction.',60,'#c0c3ff','font-weight="700" letter-spacing="-2"')}
    ${chip(65,463,209,'Product experience')}${chip(286,463,179,'AI workspaces')}
    ${t(66,555,'EXPLORE THE PROTOTYPE ↗',21,'#e1e5ff','letter-spacing="1.4" font-weight="700"')}
    ${t(66,598,'In development · No live GPU sessions or payments',18,'#9cb1bf')}
    <g transform="translate(715,78) rotate(-3 420 250)"><g class="bob2">
      ${rect(0,0,824,528,22,'#182337','#93a4d880')}
      <circle cx="24" cy="24" r="4" fill="#8596b0"/><circle cx="40" cy="24" r="4" fill="#8596b0"/><circle cx="56" cy="24" r="4" fill="#8596b0"/>
      ${t(91,31,'simpletrain.ai / demo',16,'#b7c6e0')}${t(799,31,'ACTUAL PRODUCT PREVIEW',13,'#c7cbff','text-anchor="end" letter-spacing="1"')}
      <image href="${demo}" x="8" y="48" width="808" height="472" preserveAspectRatio="xMidYMid slice" clip-path="url(#screen)"/>
    </g></g>
  `),clip(1600,650)+'<clipPath id="screen"><rect x="8" y="48" width="808" height="472" rx="14"/></clipPath>');
  await save('simpletrain',preview);

  const ghslines=`<path d="M990 210H1060Q1095 210 1095 238V280M1360 142H1270Q1240 142 1240 200V220M1360 331H1260Q1230 331 1230 290V264" fill="none" stroke="#85bbaa" stroke-opacity=".3" stroke-width="2"/><path d="M990 210H1060Q1095 210 1095 238V280M1360 142H1270Q1240 142 1240 200V220M1360 331H1260Q1230 331 1230 290V264" fill="none" stroke="#d6ff91" stroke-opacity=".8" stroke-width="2" class="signal"/>`;
  const ghs=svg(1600,460,'Applied AI at GHS','Professional work: internal AI systems, LLM integration and business workflows. The visual is conceptual and contains no proprietary interface or data.',pane(1600,460,`
    ${label(64,64,'02 / PROFESSIONAL WORK')}
    ${t(62,151,'Applied AI.',67,'#f5fcf7','font-weight="700" letter-spacing="-2.4"')}
    ${t(62,222,'In the real world.',67,'#d6ff91','font-weight="700" letter-spacing="-2.4"')}
    ${t(65,286,'Building internal AI systems at GHS.',29,'#c7dfd1')}
    ${chip(65,330,192,'LLM integration')}${chip(269,330,241,'Business workflows')}
    ${t(65,416,'COMPANY-INTERNAL WORK · PROPRIETARY CODE',16,'#91b1a3','letter-spacing="1.3"')}
    <circle cx="1190" cy="235" r="180" fill="url(#glow)"/><circle cx="1190" cy="235" r="144" fill="none" stroke="#c1f3d7" stroke-opacity=".13"/>
    <circle cx="1190" cy="235" r="113" fill="none" stroke="#c1f3d7" stroke-opacity=".26" stroke-dasharray="3 11" class="orbit"/>
    ${ghslines}
    <g transform="translate(1107,187)"><g class="bob">${rect(0,0,166,97,27,'#203c2dbb')}${t(83,64,'AI',53,'#e6ffd8','text-anchor="middle" font-weight="700"')}</g></g>
    ${rect(857,162,207,72,22,'#112820')}${t(960,206,'BUSINESS DATA',17,'#d8eee1','text-anchor="middle" letter-spacing="1.2"')}
    ${rect(1300,104,233,72,22,'#122920')}${t(1416,148,'USEFUL ANSWERS',17,'#d8eee1','text-anchor="middle" letter-spacing="1.2"')}
    ${rect(1299,300,234,72,22,'#122920')}${t(1416,344,'DAILY WORKFLOWS',17,'#d8eee1','text-anchor="middle" letter-spacing="1.2"')}
    ${label(1047,418,'PRACTICAL AI INTEGRATION','#89aa98')}
  `),clip(1600,460));
  await save('ghs-ai',ghs);

  const guard=svg(1600,440,'ReleaseGuard Europe','Independent private product in development. Release governance, evidence and software assurance for regulated AI environments. Conceptual illustration, not a product screenshot.',pane(1600,440,`
    ${label(64,64,'03 / INDEPENDENT PRODUCT','#c0cae3')}
    ${t(61,150,'ReleaseGuard',69,'#f4f8ff','font-weight="700" letter-spacing="-2.4"')}
    ${t(63,222,'Europe.',69,'#c6d9fd','font-weight="700" letter-spacing="-2.4"')}
    ${t(65,281,'Bring structure to release decisions.',29,'#bdcfe0')}
    ${chip(65,320,214,'Release governance')}${chip(291,320,157,'Evidence')}
    ${t(65,401,'PRIVATE PROJECT · IN DEVELOPMENT',16,'#93a9bc','letter-spacing="1.5"')}
    <ellipse cx="1220" cy="229" rx="300" ry="235" fill="url(#purpleGlow)"/>
    <g transform="translate(929,113) rotate(-10 210 120)">${rect(0,0,447,235,27,'#708db622','#b3cef355')}${label(29,49,'SOFTWARE ASSURANCE','#9fbcdf')}</g>
    <g transform="translate(989,91) rotate(5 210 120)">${rect(0,0,447,235,27,'#314d6933','#b3cef366')}${label(29,49,'EVIDENCE & GOVERNANCE','#b8cfe7')}</g>
    <g transform="translate(1010,108)"><g class="bob2">${rect(0,0,447,235,27,'#152936ed','#b3cef388')}${label(29,47,'RELEASEGUARD EUROPE','#c4d8ef')}
      <path d="M224 70L268 89V121Q268 159 224 181Q180 159 180 121V89Z" fill="#c1dafa10" stroke="#c5dcf4" stroke-width="2"/>
      <path d="M210 108h29M210 120h29M210 132h20" fill="none" stroke="#cbddf2" stroke-width="2" stroke-linecap="round"/>
      ${t(224,213,'EVIDENCE. CONTEXT. DECISIONS.',14,'#a6c1da','text-anchor="middle" letter-spacing="1.2"')}
      <path d="M25 232H420" stroke="#cbdfff" stroke-opacity=".3" class="pulse"/>
    </g></g>
  `),clip(1600,440));
  await save('releaseguard',guard);

  const names=['.NET','C#','VB.NET','Python','JavaScript','SQLite','Git','Blazor','Ollama'];
  const rail=names.map((name,i)=>`${rect(0+i*196,0,178,78,22,'#bcdac00c','#d6f4df38')}${t(89+i*196,50,name,name.length>8?24:29,'#e4f6e7','text-anchor="middle" font-weight="700"')}`).join('');
  const stack=svg(1600,244,'Tools I build with','.NET, C#, VB.NET, Python, JavaScript, SQLite, Git, Blazor and Ollama.',pane(1600,244,`
    ${label(62,58,'THE WORKING STACK')}${label(1184,58,'SOFTWARE × APPLIED AI','#d6ff91')}
    <g clip-path="url(#railClip)"><g transform="translate(58,93)"><g class="marquee">${rail}<g transform="translate(1764,0)">${rail}</g></g></g></g>
    ${t(62,211,'Business applications · Language models · Web interfaces · Development tools',20,'#9dbbad')}
  `),clip(1600,244)+'<clipPath id="railClip"><rect x="57" y="90" width="1486" height="85" rx="20"/></clipPath>');
  await save('stack',stack);

  const timeline=svg(1600,365,'From infrastructure to software to applied AI','Field Engineer since December 2022; Software Developer and Support since January 2025; AI Solutions Architect since August 2026. The software and support role continues alongside the architect role.',pane(1600,365,`
    ${label(63,59,'EXPERIENCE / BUILT FROM THE GROUND UP')}
    <path d="M90 180H1482" fill="none" stroke="#c8ecda" stroke-opacity=".15" stroke-width="2"/><path d="M90 180H1482" fill="none" stroke="#d6ff91" stroke-opacity=".7" stroke-width="2" class="signal"/>
    ${[82,582,1082].map((x,i)=>`<circle cx="${x}" cy="180" r="7" fill="${i===2?'#d6ff91':'#91b4a0'}"/><circle cx="${x}" cy="180" r="15" fill="none" stroke="#d6ff91" stroke-opacity=".2"/>`).join('')}
    ${t(61,146,'2022',67,'#d1e6d7','font-weight="700" letter-spacing="-2"')}${t(560,146,'2025',67,'#d1e6d7','font-weight="700" letter-spacing="-2"')}${t(1060,146,'2026 →',67,'#d6ff91','font-weight="700" letter-spacing="-2"')}
    ${t(63,243,'Field Engineer',31,'#f3fbf4','font-weight="700"')}${t(565,243,'Developer + Support',31,'#f3fbf4','font-weight="700"')}${t(1065,243,'AI Solutions Architect',31,'#f3fbf4','font-weight="700"')}
    ${t(63,287,'Customer sites. Servers. Systems.',22,'#9dbbad')}${t(565,287,'Software and real user problems.',22,'#9dbbad')}${t(1065,287,'Practical AI inside business tools.',22,'#9dbbad')}
    ${t(63,333,'The software development and support role continues alongside my AI role.',18,'#7fa38f')}
  `),clip(1600,365));
  await save('journey',timeline);

  const contact=svg(1600,420,'Let’s build what comes next.','Open to AI solutions, applied AI and software development opportunities. Contact Jean Yildirim at ismailjeany@gmail.com.',`
  <g clip-path="url(#outer)">${background.replace('height="1067"','height="1067" y="-575"')}<rect width="1600" height="420" fill="#061611bb"/>
  ${rect(25,25,1550,370,26,'#d9f9df08')}${label(70,85,'NEXT CHAPTER / YOUR TEAM?','#d6ff91')}
  ${t(64,176,'Let’s build',85,'#fff','font-weight="700" letter-spacing="-3"')}${t(64,266,'what comes next.',85,'#e4f6e4','font-weight="700" letter-spacing="-3"')}
  ${t(71,344,'AI solutions · Applied AI · Software development',26,'#b8d5c3')}
  <g transform="translate(1010,140)"><g class="bob">${rect(0,0,509,146,32,'#dfffd415')}${label(31,42,'GET IN TOUCH','#cee7d4')}${t(31,91,'ismailjeany@gmail.com',28,'#efffeb','font-weight="700" letter-spacing="-.5"')}<path d="M446 56h25v25m0-25-29 29" fill="none" stroke="#d6ff91" stroke-width="2.5"/></g></g>
  </g>`,clip(1600,420));
  await save('contact',contact);
  console.log('Built cinematic hero, phone hero, three project panels, technology rail, journey and contact artwork.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
