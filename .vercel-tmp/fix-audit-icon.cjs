const fs = require('fs');

const pages = [
  { file: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\index.html', iconPath: 'assets/favicon.png?v=2' },
  { file: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\about.html', iconPath: '../assets/favicon.png?v=2' },
  { file: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\services.html', iconPath: '../assets/favicon.png?v=2' },
  { file: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\reviews.html', iconPath: '../assets/favicon.png?v=2' },
  { file: 'c:\\Users\\Connect2Aryans\\Desktop\\Mr-Soomro\\pages\\blogs.html', iconPath: '../assets/favicon.png?v=2' },
];

const oldIcon = `<div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#f5911e,#f5a623);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
      </div>`;

for (const p of pages) {
  let s = fs.readFileSync(p.file, 'utf8');
  const newIcon = `<img src="${p.iconPath}" alt="Logo" style="width:52px;height:52px;border-radius:14px;object-fit:contain;margin:0 auto 14px;display:block;">`;
  s = s.replace(oldIcon, newIcon);
  fs.writeFileSync(p.file, s, 'utf8');
  console.log(`✓ ${p.file.split('\\').pop()}: icon replaced with favicon`);
}

console.log('Done!');
