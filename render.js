import fs from 'fs';
import { marked } from 'marked';
import highlight from 'highlight';


marked.setOptions({ highlight });
const md = fs.readFileSync('doc.md', 'utf-8');
let html = marked.parse(md);

// Tufte sidenote DSL 후처리
// sidenote = {{sn:text for sidenotes}}
let sidenoteIndex = 0;
html = html.replace(/\{\{sn:(.*?)\}\}/g, (_, content) => {
  sidenoteIndex++;
  return `
<label for="sn-${sidenoteIndex}" class="margin-toggle sidenote-number"></label>
<input type="checkbox" id="sn-${sidenoteIndex}" class="margin-toggle"/>
<span class="sidenote">${content}</span>
`;
});

// margin figure = {{img:images/detail.jpg|Detail of the hinge}}
html = html.replace(
  /\{\{img:(.*?)\|(.*?)\}\}/g,
  `
  <span class="marginnote">
    <img src="$1">
    <em>$2</em>
  </span>
  `
);

// image size = ![text](url){w100}
html = html.replace(
  /<img([^>]+)>\{w(\d+)\}/g,
  '<img$1 style="width:$2px">'
);


// 템플릿 삽입
const template = fs.readFileSync('template.html', 'utf-8');

const output = template
  .replace('{{content}}', html)
  .replace('{{title}}', 'Markdown + Tufte');

fs.writeFileSync('index.html', output);

console.log('✔ index.html generated');

