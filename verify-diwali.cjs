const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const html = fs.readFileSync('index.html','utf8');
assert(!/mesa-journey|mesa-unbox|mesa-story|diary-scene/i.test(html),'Old journey references remain');
const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate IDs');
for (const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id),`Missing anchor ${id}`);
for (const [,path] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
 if (!/^[a-z]+:/i.test(path)) assert(fs.existsSync(path),`Missing asset ${path}`);
}
for (const [width,height,reduce] of [[1440,900,false],[390,844,false],[390,600,false],[1440,900,true],[844,390,false]]) {
 let distance=0;
 const props={};
 const classes=new Set();
 const objects=Array.from({length:6},()=>({style:{}}));
 const chapters=Array.from({length:6},(_,i)=>({offsetTop:i*height}));
 const links=Array.from({length:6},()=>({setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]},addEventListener(){}}));
 const counter={textContent:''};
 const root={classList:{toggle(k,v){v?classes.add(k):classes.delete(k)},contains:k=>classes.has(k)},style:{setProperty(k,v){props[k]=v}},getBoundingClientRect:()=>({top:-distance}),querySelector:s=>s==='.diwali-stage'?{clientHeight:height,clientWidth:width}:counter,querySelectorAll:s=>s==='.diwali-object'?objects:s==='.diwali-chapter'?chapters:links};
 const events={};
 const context={document:{querySelector:()=>root},matchMedia:()=>({matches:reduce,addEventListener(){}}),innerWidth:width,innerHeight:height,scrollY:0,scrollTo(){},requestAnimationFrame:f=>f(),addEventListener:(k,f)=>events[k]=f};
 vm.runInNewContext(fs.readFileSync('diwali-story.js','utf8'),context);
 assert.equal(classes.has('has-motion'),!reduce&&height>=550);
 if(classes.has('has-motion')) {
  for(distance=0;distance<=height*5;distance+=height/10){events.scroll();for(const o of objects){assert(!/NaN|undefined/.test(o.style.transform));assert(o.style.opacity>=0&&o.style.opacity<=1)}}
  distance=height*5;events.scroll();assert.equal(counter.textContent,'06 / 06');assert.equal(objects[5].style.opacity,1);
  distance=0;events.scroll();assert.equal(counter.textContent,'01 / 06');assert.equal(objects[1].style.opacity,1);assert.equal(objects[5].style.opacity,0);
 }
 console.log(`PASS ${width}x${height}${reduce?' reduced motion':''}`);
}
console.log('PASS local assets, anchor targets, unique IDs, scroll progression and reverse scrolling');
