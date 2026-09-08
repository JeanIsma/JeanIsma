/* Rebuild the self-contained GitHub profile artwork: node design/build-assets.cjs
 * Requires Node.js and sharp. Animated SVGs have no scripts or remote dependencies.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'assets');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, str, size=28, fill='#f2f7f4', extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(str)}</text>`;

async function main() {
  const source = await fs.access(path.join(__dirname,'landscape-source.png')).then(()=> 'landscape-source.png').catch(()=> 'landscape-source.jpg');
  const photo = source.endsWith('.png') ? await sharp(path.join(__dirname,source)).resize(1600).jpeg({quality:84, mozjpeg:true}).toBuffer() : await fs.readFile(path.join(__dirname,source));
  await fs.writeFile(path.join(__dirname,'landscape-source.jpg'),photo);
  const bg = 'data:image/jpeg;base64,'+photo.toString('base64');
  const logo = 'data:image/png;base64,'+(await fs.readFile(path.join(assets,'simpletrain-logo.png'))).toString('base64');
  const styles = `text{font-family:Arial,Helvetica,sans-serif} .mono{font-family:monospace;letter-spacing:3px} .soft{fill:#c4d5d0} .bold{font-weight:700} .float{animation:float 9s ease-in-out infinite} .float2{animation:float2 11s ease-in-out infinite} .shine{animation:shine 8s ease-in-out infinite} .pulse{animation:pulse 4s ease-in-out infinite} .ripples{transform-box:fill-box;transform-origin:center;animation:ripple 7s ease-in-out infinite} @keyframes float{0%,100%{transform:translate(0,0) rotate(-8deg)}50%{transform:translate(-16px,-24px) rotate(5deg)}} @keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(16px,18px)}} @keyframes shine{0%,100%{transform:translateX(-520px);opacity:0}15%,85%{opacity:0}40%,60%{opacity:.75}75%{transform:translateX(1350px);opacity:0}} @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}} @keyframes ripple{0%,100%{transform:scale(.94);opacity:.35}50%{transform:scale(1.04);opacity:.65}} @media(prefers-reduced-motion:reduce){.float,.float2,.shine,.pulse,.ripples{animation:none}.shine{opacity:0}}`;
  const defs = `
    <linearGradient id="shade" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#071812" stop-opacity=".16"/><stop offset=".58" stop-color="#071812" stop-opacity=".08"/><stop offset="1" stop-color="#051712" stop-opacity=".78"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9eee7" stop-opacity=".23"/><stop offset=".35" stop-color="#102d24" stop-opacity=".55"/><stop offset="1" stop-color="#051b16" stop-opacity=".76"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".85"/><stop offset=".28" stop-color="#dbf8ec" stop-opacity=".22"/><stop offset=".58" stop-color="#fff" stop-opacity=".05"/><stop offset=".82" stop-color="#d8fff3" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".75"/></linearGradient>
    <linearGradient id="sweep"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#e9fff6" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".4"/><stop offset=".26" stop-color="#e7fff3" stop-opacity=".04"/><stop offset=".7" stop-color="#091e14" stop-opacity=".02"/><stop offset="1" stop-color="#edfff8" stop-opacity=".36"/></linearGradient>
    <radialGradient id="lensRim"><stop offset=".69" stop-color="#ecfff7" stop-opacity="0"/><stop offset=".88" stop-color="#ecfff7" stop-opacity=".04"/><stop offset=".96" stop-color="#d3fff0" stop-opacity=".48"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></radialGradient>
    <radialGradient id="glow"><stop stop-color="#bbffe0" stop-opacity=".20"/><stop offset="1" stop-color="#bbffe0" stop-opacity="0"/></radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#03140b" flood-opacity=".3"/></filter>
    <image id="photo" href="${bg}" width="1600" height="1067" preserveAspectRatio="xMidYMid slice"/>
  `;
  const shell = (w,h,title,desc,inside,more='') => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc><defs>${defs}${more}</defs><style>${styles}</style>${inside}</svg>`;
  const imageUse = '<use href="#photo"/>';
  const lens = `<g transform="translate(1320 401)"><g class="float">
      <circle r="144" fill="#0e2a1d" opacity=".16" filter="url(#shadow)"/>
      <g clip-path="url(#lensClip)"><use href="#photo" transform="translate(-1450,-449) scale(1.1)"/><circle r="145" fill="url(#lens)"/><circle r="145" fill="url(#lensRim)"/></g>
      <circle r="144" fill="none" stroke="url(#edge)" stroke-width="2.5"/>
      <ellipse cx="-55" cy="-98" rx="45" ry="8" fill="#fff" opacity=".65" transform="rotate(-32 -55 -98)"/>
      <path d="M-115 -64 A131 131 0 0 1 44 -126" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
      <path d="M -37 127 A133 133 0 0 0 128 28" fill="none" stroke="#dcfff2" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>
    </g></g>`;
  let hero = shell(1600,1000,'Jean Yildirim — AI Solutions Architect & Software Developer','A photographic-style alpine lake beneath moving refractive glass. Based in Germany. Open to AI and software opportunities. Building SimpleTrain.ai.',`
  <g clip-path="url(#outer)">
    ${imageUse}<rect width="1600" height="1000" fill="url(#shade)"/>
    <rect x="40" y="40" width="1520" height="920" rx="30" fill="none" stroke="#fff" stroke-opacity=".23"/>
    <rect x="72" y="70" width="70" height="70" rx="23" fill="#0b2019" fill-opacity=".44" stroke="url(#edge)"/>
    ${text(88,118,'JY',29,'#fff','font-weight="700" letter-spacing="-2"')}
    ${text(162,100,'JEAN YILDIRIM',22,'#f3f8f5','font-weight="700" letter-spacing="2.6"')}
    ${text(162,131,'SOFTWARE / APPLIED AI',15,'#e1eae5','class="mono"')}
    <rect x="1150" y="80" width="378" height="48" rx="24" fill="#0b2019" fill-opacity=".55" stroke="url(#edge)"/>
    <circle cx="1179" cy="104" r="5" fill="#b7f4c8" class="pulse"/>
    ${text(1197,111,'OPEN TO OPPORTUNITIES',17,'#f0fff7','letter-spacing="1.6"')}
    ${lens}
    <g transform="translate(1149 247)"><g class="float2"><circle r="32" fill="url(#lens)" stroke="url(#edge)" stroke-width="1.5"/><path d="M-20 -15 Q -14 -26 0 -25" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2" stroke-linecap="round"/></g></g>
    <ellipse cx="1308" cy="704" rx="162" ry="19" fill="url(#glow)" class="ripples"/>
    <g clip-path="url(#mainGlass)"><g filter="url(#blur)">${imageUse}</g><rect x="72" y="325" width="1010" height="460" rx="40" fill="url(#glass)"/>
    <path d="M-200 280 L-50 280 400 820 250 820Z" fill="url(#sweep)" class="shine"/></g>
    <rect x="72" y="325" width="1010" height="460" rx="40" fill="none" stroke="url(#edge)" stroke-width="1.6"/>
    <rect x="79" y="332" width="996" height="446" rx="34" fill="none" stroke="#fff" stroke-opacity=".065"/>
    ${text(117,379,'AI SOLUTIONS ARCHITECT  /  SOFTWARE DEVELOPER',18,'#d7eee1','letter-spacing="1.8"')}
    ${text(110,511,'Jean Yildirim.',116,'#fbfffd','font-weight="700" letter-spacing="-6"')}
    ${text(118,574,'Complex systems.',41,'#fff','letter-spacing="-1"')}
    ${text(118,626,'Thoughtfully simple experiences.',41,'#d8f0e3','letter-spacing="-1"')}
    <path d="M118 666 H1036" stroke="#edfff5" stroke-opacity=".2"/>
    ${text(118,716,'Applied AI',25,'#f2f7f4')}
    <circle cx="266" cy="709" r="2.5" fill="#b6d2c6"/>
    ${text(287,716,'Business software',25,'#f2f7f4')}
    <circle cx="522" cy="709" r="2.5" fill="#b6d2c6"/>
    ${text(543,716,'Infrastructure',25,'#f2f7f4')}
    <g clip-path="url(#brandGlass)"><g filter="url(#blur)">${imageUse}</g><rect x="1110" y="582" width="418" height="202" rx="32" fill="url(#glass)"/></g>
    <rect x="1110" y="582" width="418" height="202" rx="32" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
    <image href="${logo}" x="1142" y="619" width="92" height="92" clip-path="url(#brandLogo)"/>
    ${text(1252,631,'BUILDING',15,'#d8e6e1','letter-spacing="2.5"')}
    ${text(1252,667,'SimpleTrain',31,'#fff','font-weight="700" letter-spacing="-1"')}
    ${text(1252,695,'.ai',29,'#c8efd8')}
    ${text(1145,754,'AI compute made simple.',22,'#d3e5db')}
    <rect x="72" y="824" width="1456" height="101" rx="29" fill="#0a2019" fill-opacity=".58" stroke="url(#edge)"/>
    ${text(111,860,'BASED IN',14,'#adc8bd','letter-spacing="2"')}
    ${text(111,894,'Germany',25,'#fff')}
    <path d="M394 849 V900 M917 849 V900" stroke="#fff" stroke-opacity=".17"/>
    ${text(438,860,'CURRENT ROLE',14,'#adc8bd','letter-spacing="2"')}
    ${text(438,894,'AI Solutions Architect · GHS',25,'#fff')}
    ${text(961,860,'MY FOCUS',14,'#adc8bd','letter-spacing="2"')}
    ${text(961,894,'Useful AI. Usable products.',25,'#fff')}
  </g>`, '<clipPath id="outer"><rect width="1600" height="1000" rx="42"/></clipPath><clipPath id="mainGlass"><rect x="72" y="325" width="1010" height="460" rx="40"/></clipPath><clipPath id="brandGlass"><rect x="1110" y="582" width="418" height="202" rx="32"/></clipPath><clipPath id="brandLogo"><rect x="1142" y="619" width="92" height="92" rx="22"/></clipPath><clipPath id="lensClip"><circle r="144"/></clipPath>');
  await fs.writeFile(path.join(assets,'landscape-glass.svg'),hero);
  const still = svg => svg.replace('</style>','.float,.float2,.shine,.pulse,.ripples{animation:none}.shine{opacity:0}</style>');
  await sharp(Buffer.from(still(hero))).resize(1200).png().toFile(path.join(assets,'landscape-glass-still.png'));

  const mobile = shell(800,1000,'Jean Yildirim — AI Solutions Architect & Software Developer','Based in Germany. Open to opportunities. Building SimpleTrain.ai. An animated glass panel over an alpine lake.',`
    <g clip-path="url(#mobileClip)"><use href="#photo" transform="translate(-560,0)"/><rect width="800" height="1000" fill="url(#shade)"/>
    <rect x="22" y="22" width="756" height="956" rx="28" fill="none" stroke="#fff" stroke-opacity=".24"/>
    ${text(51,79,'JEAN / APPLIED AI',22,'#fff','letter-spacing="2.5" font-weight="700"')}
    <rect x="49" y="111" width="359" height="42" rx="21" fill="#0d2b20" fill-opacity=".64" stroke="url(#edge)"/>
    <circle cx="73" cy="132" r="4" fill="#b7f4c8" class="pulse"/>
    ${text(90,139,'OPEN TO OPPORTUNITIES',17,'#f0fff7','letter-spacing="1.2"')}
    <g transform="translate(655,257)"><g class="float"><circle r="88" fill="url(#lens)" stroke="url(#edge)" stroke-width="2"/><circle r="86" fill="url(#lensRim)"/><path d="M-65 -45 A79 79 0 0 1 23 -76" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="2"/></g></g>
    <g clip-path="url(#mobileGlass)"><use href="#photo" transform="translate(-560,0)" filter="url(#blur)"/><rect x="42" y="372" width="716" height="381" rx="33" fill="url(#glass)"/><path d="M-350 300 L-200 300 280 820 130 820Z" fill="url(#sweep)" class="shine"/></g>
    <rect x="42" y="372" width="716" height="381" rx="33" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
    ${text(75,420,'AI SOLUTIONS ARCHITECT',22,'#d3eadd','letter-spacing="1.5"')}
    ${text(71,508,'Jean Yildirim.',88,'#fff','font-weight="700" letter-spacing="-4"')}
    ${text(76,558,'Software developer. Product builder.',29,'#e5f3ea')}
    <path d="M76 594 H724" stroke="#fff" stroke-opacity=".2"/>
    ${text(76,641,'Complex systems.',35,'#f2fff7','letter-spacing="-1"')}
    ${text(76,687,'Thoughtfully simple experiences.',35,'#d0ebda','letter-spacing="-1"')}
    <rect x="42" y="787" width="716" height="150" rx="29" fill="#0a2119" fill-opacity=".74" stroke="url(#edge)"/>
    <image href="${logo}" x="69" y="815" width="94" height="94"/>
    ${text(187,831,'BUILDING SIMPLETRAIN.AI',22,'#fff','font-weight="700" letter-spacing=".4"')}
    ${text(187,870,'AI compute made simple.',27,'#d6eade')}
    ${text(188,910,'Germany · AI Solutions Architect at GHS',21,'#accfbc')}
    </g>`, '<clipPath id="mobileClip"><rect width="800" height="1000" rx="32"/></clipPath><clipPath id="mobileGlass"><rect x="42" y="372" width="716" height="381" rx="33"/></clipPath>');
  await fs.writeFile(path.join(assets,'landscape-glass-mobile.svg'),mobile);
  await sharp(Buffer.from(still(mobile))).resize(800).png().toFile(path.join(assets,'landscape-glass-mobile-still.png'));

  const project = shell(1600,440,'SimpleTrain.ai — AI compute made simple','Building toward launch. A clearer path from an idea to a running AI workspace.',`
    <g clip-path="url(#projectClip)"><use href="#photo" transform="translate(0,-390)"/><rect width="1600" height="440" fill="#081e18" fill-opacity=".65"/>
    <circle cx="1420" cy="140" r="400" fill="url(#glow)"/>
    <rect x="25" y="25" width="1550" height="390" rx="28" fill="url(#glass)" stroke="url(#edge)"/>
    <path d="M-350 -100 L-200 -100 280 500 130 500Z" fill="url(#sweep)" class="shine"/>
    ${text(70,87,'01  /  FEATURED PROJECT',18,'#c1d7cc','letter-spacing="2.3"')}
    ${text(67,184,'SimpleTrain.ai',80,'#fff','font-weight="700" letter-spacing="-3"')}
    ${text(72,239,'AI compute made simple.',33,'#dff1e6')}
    ${text(72,297,'A clearer path from an idea to a running AI workspace.',25,'#cbded4')}
    <rect x="70" y="335" width="265" height="41" rx="20" fill="#e7fff0" fill-opacity=".12" stroke="#e0fff0" stroke-opacity=".25"/>
    <circle cx="95" cy="355" r="4" fill="#b4efc8" class="pulse"/>
    ${text(112,362,'BUILDING TOWARD LAUNCH',14,'#e4ffef','letter-spacing="1"')}
    ${text(1127,368,'EXPLORE THE PROJECT  ↗',18,'#e1f6e9','letter-spacing="1.4"')}
    <g transform="translate(1260,192)"><g class="float2"><rect x="-128" y="-128" width="256" height="256" rx="70" fill="url(#lens)" stroke="url(#edge)" stroke-width="2"/><rect x="-117" y="-117" width="234" height="234" rx="61" fill="none" stroke="#f4fff9" stroke-opacity=".13"/><image href="${logo}" x="-95" y="-95" width="190" height="190" clip-path="url(#projectLogo)"/></g></g>
    </g>`, '<clipPath id="projectClip"><rect width="1600" height="440" rx="34"/></clipPath><clipPath id="projectLogo"><rect x="-95" y="-95" width="190" height="190" rx="45"/></clipPath>');
  await fs.writeFile(path.join(assets,'simpletrain-feature.svg'),project);
  await sharp(Buffer.from(project)).resize(1200).png().toFile(path.join(__dirname,'project-preview.png'));

  const contact = shell(1600,300,'Let’s build something useful.','Jean Yildirim. Open to AI solutions, applied AI and software development opportunities. Email ismailjeany@gmail.com.',`
  <g clip-path="url(#contactClip)"><use href="#photo" transform="translate(0,-730)"/><rect width="1600" height="300" fill="#071e18" fill-opacity=".79"/>
  <rect x="24" y="24" width="1552" height="252" rx="27" fill="url(#glass)" stroke="url(#edge)"/>
  <path d="M-350 -100 L-200 -100 280 500 130 500Z" fill="url(#sweep)" class="shine"/>
  ${text(72,81,'NEXT CHAPTER',17,'#b8d6c7','letter-spacing="3"')}
  ${text(67,163,'Let’s build something useful.',65,'#f8fff9','font-weight="700" letter-spacing="-2.7"')}
  ${text(72,220,'AI solutions  /  Applied AI  /  Software development',25,'#c9e2d4')}
  <rect x="1200" y="99" width="315" height="88" rx="28" fill="#e0f5e8" fill-opacity=".12" stroke="url(#edge)"/>
  ${text(1242,153,'LET’S TALK',23,'#f5fff9','letter-spacing="1.5"')}
  <path d="M1440 150 l22 -22 M1440 128 h22 v22" fill="none" stroke="#d4efdf" stroke-width="2.4"/>
  </g>`, '<clipPath id="contactClip"><rect width="1600" height="300" rx="34"/></clipPath>');
  await fs.writeFile(path.join(assets,'contact-glass.svg'),contact);

  const btn=(name,label,w,light=false)=>fs.writeFile(path.join(assets,name),`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="46" viewBox="0 0 ${w} 46"><title>${esc(label)}</title><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${light?'#e3f2e7':'#234537'}"/><stop offset="1" stop-color="${light?'#bfd9c8':'#10281e'}"/></linearGradient></defs><rect x=".75" y=".75" width="${w-1.5}" height="44.5" rx="14" fill="url(#g)" stroke="${light?'#adcab8':'#779386'}" stroke-width="1.5"/><text x="${w/2}" y="28.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="600" fill="${light?'#143223':'#eff8f2'}">${esc(label)}</text></svg>`);
  await btn('contact-button.svg','Email Jean  ↗',166,true);
  await btn('project-button.svg','Explore SimpleTrain.ai  ↗',232);
  await btn('work-button.svg','Selected work  ↓',181);
  console.log('Built profile artwork and static preview.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
