var O={l:t=>t,i1:t=>1-Math.cos(t*Math.PI/2),o1:t=>Math.sin(t*Math.PI/2),io1:t=>-(Math.cos(Math.PI*t)-1)/2,i2:t=>Math.pow(t,2),o2:t=>1-(1-t)*(1-t),io2:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,i3:t=>Math.pow(t,3),o3:t=>1-Math.pow(1-t,3),io3:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,i4:t=>Math.pow(t,4),o4:t=>1-Math.pow(1-t,4),io4:t=>t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2,i5:t=>Math.pow(t,5),o5:t=>1-Math.pow(1-t,5),io5:t=>t<.5?16*Math.pow(t,5):1-Math.pow(-2*t+2,5)/2,i6:t=>0===t?0:Math.pow(2,10*t-10),o6:t=>1===t?1:1-Math.pow(2,-10*t),io6:t=>0===t?0:1===t?1:t<.5?Math.pow(2,20*t-10)/2:(2-Math.pow(2,-20*t+10))/2,i7:t=>1-Math.sqrt(1-Math.pow(t,2)),o7:t=>sqrt(1-Math.pow(t-1,2)),io7:t=>t<.5?(1-Math.sqrt(1-Math.pow(2*t,2)))/2:(Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2},g=(t,s,i)=>Math.min(Math.max(t,i),s),y=(t,s,i)=>(1-i)*t+i*s,Y=(t,s,i)=>g(0,1,(i-t)/(s-t)),et=(t,s,i,e,h)=>Y(t,s,h)*(e-i)+i,st=(t,s)=>{s=s?Math.pow(10,s):100;return Math.round(t*s)/s},it=(t,s)=>window.hasOwnProperty.call(t,s),M=t=>{t=t.getBoundingClientRect();return{w:t.width,h:t.height,t:t.top,b:t.bottom,l:t.left,r:t.right}},A=t=>window.getComputedStyle(t),J=t=>{let s,i,e;if("object"!=typeof t||null===t)return t;for(e in s=Array.isArray(t)?[]:{},t)i=t[e],s[e]=J(i);return s},x={o:(t,s)=>t.style.opacity=s,d:(t,s)=>t.style.display=s,p:(t,s)=>t.style.pointerEvents=s,id:t=>document.getElementById(t),el:t=>document.querySelector(t),els:t=>[...document.querySelectorAll(t)]},q=class{constructor(){this.store=new Map}set(t,s){this.store.set(t,s)}get(t){return this.store.get(t)}},X=q,N=class{constructor(){this.subs={}}obs(t){return this.subs[t]={items:[]},{cb:function(){var s=this[t],i=Array.prototype.slice.call(arguments);for(let t=0;t<s.items.length;t++)s.items[t].cb(...i)}.bind(this.subs),name:t}}add(t,s){this.subs[t]||console.error(t);let i=this.subs[t].items,e={cb:s,id:i.length+1};return i.push(e),{r:(s=>{for(let t=0;t<i.length;t++)i[t].id==s&&i.splice(t,1)}).bind({},e.id)}}check(t){return!!this.subs[t]}},c=new N,k=class{constructor({late:t,cb:s}){this.late=1e3*t,this.cb=s,this.time=0}run(){clearTimeout(this.time),this.time=setTimeout(this.cb,this.late)}},V=class{constructor({late:t,o:s,cb:i}){this.d=t||0,this.o=s,this.cb=i,this.on=!1,this.stop=!1}play(){this.on=!0,this.stop=!1,0==this.d?this.Elp():(this.id=S.push({cb:this.run.bind(this)}),this.f=performance.now()+1e3*this.d)}kill(){this.stop=!0,this.on=!1}run(t){t>this.f&&(S.kill(this.id),this.Elp())}Elp(){this.stop||(this.on=!1,S.push(this.o),this.cb&&this.cb())}},P=class{constructor(){this.items=[],this.on=!1,this.id=-1}push(t){return 0==t.d?void t.cb(1):(t.id=++this.id,this.items.push(t),this.on||this.loop(),t.id)}update(s){for(let t=0;t<this.items.length;t++){var i,e=this.items[t];e.d?(e.st||(e.st=s),i=(s-e.st)/(1e3*e.d),i=g(0,1,i),!e.cb(i)&&1!=i||this.kill(e.id)):e.cb(s)}this.loop()}kill(i){this.items.map((t,s)=>{t.id===i&&(t.id=null,t.st=null,this.items.splice(s,1))})}loop(){0===this.items.length?(this.on=!1,window.cancelAnimationFrame(this.raf)):(this.on=!0,this.raf=window.requestAnimationFrame(this.update.bind(this)))}},S=new P;async function rt(t){try{var s="json"==t.type,i=new Request(t.url,{headers:new Headers({"Content-type":s?"text/html":"application/x-ww-form-urlencodeed"}),method:s?"POST":"GET",mode:"same-origin"}),e=(t.body&&(i.body=t.body),await(await fetch(i))[s?"json":"text"]());t.cb({url:t.url,parser:e})}catch(t){console.error(t.message)}}var ht=rt;function lt(t,s){for(var i in s)i.match(/^on/)?t.addEventListener(i.match(/[A-Z](.*)/)[0].toLowerCase(),s[i]):t.setAttribute(i,s[i])}function T(t){let s;return"string"==typeof t||"number"==typeof t?s=document.createTextNode(t):(s=document.createElement(t.type),t.props&&lt(s,t.props),t.content&&("string"==typeof t.content||"number"==typeof t.content?s.appendChild(T(t.content)):t.content.map(T).forEach(s.appendChild.bind(s)))),s}function ot(t,s={}){return t.appendChild(T(s))}var at=ot,j={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},pt=/([astvzqmhlc])([^astvzqmhlc]*)/gi,nt=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;function W(t){let h=[];return t.replace(pt,function(t,s,i){let e=s.toLowerCase();for(i=dt(i),"m"==e&&2<i.length&&(h.push([s].concat(i.splice(0,2))),e="l",s="m"==s?"l":"L");;){if(i.length==j[e])return i.unshift(s),h.push(i);if(i.length<j[e])throw new Error("malformed path data");h.push([s].concat(i.splice(0,j[e])))}}),h}function dt(t){t=t.match(nt);return t?t.map(Number):[]}var G=t=>{var s=[],i=t.split(" "),e=i.length;for(let t=0;t<e;t++){var h=i[t].split(","),r=h.length;for(let t=0;t<r;t++){var a=h[t];s.push(isNaN(a)?a:+a)}}return s},ft={t:(t,s,i,e,h,r,a)=>{let l,o,n,p,d,c,u=a.transform,m;return 6<u.length&&(m=u.match(/\((.+)\)$/)[1].split(", ")),p=m?(l={s:!t||"px"===t[1]?+m[4]:+m[4]/parseFloat(a.width)*100,e:t?t[0]:+m[4],unit:t[1]||"px"},o={s:!s||"px"===s[1]?+m[5]:+m[5]/parseFloat(a.height)*100,e:s?s[0]:+m[5],unit:s[1]||"px"},n={s:+m[0],e:i?i[0]:+m[0]},{s:+m[3],e:e?e[0]:+m[3]}):(l={s:0,e:t[0]||0,unit:t[1]||"px"},o={s:0,e:s[0]||0,unit:s[1]||"px"},n={s:1,e:i?i[0]:1},{s:1,e:e?e[0]:1}),d={s:h?h[0]:0,e:h?h[1]:0},c={s:r?r[0]:0,e:r?r[1]:0},l.lerp=l.e-l.s,o.lerp=o.e-o.s,n.lerp=n.e-n.s,p.lerp=p.e-p.s,d.lerp=d.e-d.s,c.lerp=c.e-c.s,h||r?t=>{return`translate(${""+(l.s+l.lerp*t)+l.unit}, ${""+(o.s+o.lerp*t)+o.unit}) scale(${""+(n.s+n.lerp*t)}, ${""+(p.s+p.lerp*t)}) rotateX(${d.s+d.lerp*t+"deg"}) rotateY(${c.s+c.lerp*t+"deg"})`}:t=>{return`translate(${""+(l.s+l.lerp*t)+l.unit}, ${""+(o.s+o.lerp*t)+o.unit}) scale(${""+(n.s+n.lerp*t)}, ${""+(p.s+p.lerp*t)})`}},o:(t,s)=>{let i={s:+s.opacity,e:t[0]};return i.lerp=i.e-i.s,t=>""+(i.s+i.lerp*t)},dash:(t,s)=>{let i={s:parseFloat(s.strokeDashoffset),e:t[0]};return i.lerp=i.e-i.s,t=>""+(i.s+i.lerp*t)},points(t,s){let h=G(s.el.getAttribute("points")),r=G(t[0]);return s=>{let i="",e="";for(let t=0;t<h.length;t++)i+=y(h[t],r[t],s)+" ",e=i.trim();return e}},d:(t,s)=>{let a=W(s.el.getAttribute("d")),l=W(t[0]);return s=>{let i="",e="";for(let t=0;t<a.length;t++){var h=a[t],r=l[t];for(let t=0;t<h.length;t++)i+=(isNaN(h[t])?h[t]:y(h[t],r[t],s))+" ";e=i.trim()}return e}},top:(t,s)=>{let i;var e;return(i="auto"==s.top?{s:0,e:t[0],unit:t[1]||"px"}:(e=parseFloat(s.top),{s:"px"==t[1]?e:e/M(s.pa).h*100,e:t[0],unit:t[1]||"px"})).lerp=i.e-i.s,t=>""+(i.s+i.lerp*t)+i.unit}},v=ft;function $(s,t,i){var e=[];if(t)for(var h in i){let t=i[h],s={s:t[0],lerp:t[1]-t[0]};e.push({name:h,cb:t=>s.s+s.lerp*t})}else{var r,a,l,o,n,p,d,c,u,m,b,t=A(s);t.el=s,t.pa=s.parentNode,r=i.x||!1,a=i.y||!1,o=i.sx||!1,n=i.sy||!1,p=i.rx||!1,d=i.ry||!1,l=i.o||!1,c=i.dash||!1,u=i.points||!1,m=i.d||!1,b=i.t||!1,(r||a||o||n||p||d)&&e.push({setV:t=>s.style.transform=t,cb:v.t(r,a,o,n,p,d,t)}),l&&e.push({setV:t=>s.style.opacity=t,cb:v.o(l,t)}),c&&e.push({setV:t=>s.style.strokeDashoffset=t,cb:v.dash(c,t)}),u&&e.push({setV:t=>s.setAttribute("points",t),cb:v.points(u,t)}),m&&e.push({setV:t=>s.setAttribute("d",t),cb:v.d(m,t)}),b&&e.push({setV:t=>s.style.top=t,cb:v.top(b,t)})}return e}function B(t){this.obj=!1,"string"==typeof t?this.target=x.el(t):(t instanceof Node||(this.obj=!0),this.target=t)}var D=class{constructor(t,s){B.call(this,t),this.o=s,this.mode,this.prog=0,this.elp=0,this.to()}to(){this.d=this.o.d,this.late=this.o.late,this.ease=O[this.o.ease]||O.l,this.ps=this.o.p,this.cbO={cb:this.run.bind(this),d:this.d},this.late=new V({late:this.late,o:this.cbO}),this.results=$(this.target,this.obj,this.ps)}run(t){if(this.on=!0,this.ti=this.prog+t,this.elp=g(0,1,this.ti),this.e=Math.abs(this.dir-this.ease(this.elp)),this.results.map(t=>{var s=t.cb(this.e);this.obj?this.target[t.name]=s:t.setV(s)}),this.raf&&this.raf(this.e,this.target),1===this.elp)return this.kill()}control(t,s){this.late.on&&this.mode!=t&&(this.mode=t,this.late.kill()),this.mode==t&&!this.obj||("r"==(this.mode=t)?(this.dir=1,this.late.cb=null):(this.dir=0,this.late.cb=()=>this.start&&this.start(this.target)),this.late.on)||(this.on?(this.cbO.st=null,this.prog=s?0:1-this.elp):this.late.play())}reverse(t){this.late.d="number"==typeof t?t:this.late.d,this.control("r")}kill(){return this.on=!1,this.prog=0,this.completed&&"p"==this.mode&&this.completed(this.target),!0}play(t){this.start=t.start,this.completed=t.completed,this.raf=t.raf,JSON.stringify(this.ps)!=JSON.stringify(t.p)?(this.late.d=t.late||0,this.cbO.d=t.d,this.ease=O[t.ease]||this.ease,this.ps=t.p,this.results=$(this.target,this.obj,this.ps),this.mode="r",this.control("p",!0)):this.control("p")}},Z=D,_=new X;function K(t,s){let i=_.get(t),e=i;return i||(e=new Z(t,s),_.set(t,e)),{reverse:t=>e.reverse(t),play:t=>e.play(t),item:t,tween:e,obj:s}}function ut(t,h){if(t instanceof NodeList||Array.isArray(t)){let s=[...t].map((t,s)=>{s=(h.late||0)+(h.stagger||0)*s;return K(t,{...h,late:s})}),e=(s.map(({play:t,obj:s},i)=>{i=0==i;t({...s,start:i&&h.start,raf:i&&h.raf,completed:i&&h.completed})}),s.map(t=>t.tween.late.d));return{reverse:(t=0)=>{let i=(h.late||0)-t;s.reverse().map(({reverse:t},s)=>t(e[s]-i))},play:()=>s.map(({play:t})=>t(h))}}return(t=K(t,h)).play(h),t}var E=ut;function ct(t,s,i,e){var h=this.its[this.id-1],h=h?(h.late||0)+h.d:0,h=(s.late||0)+h+i,t=E(t,{...s,late:h},e);0==this.id&&(this.fl=s.late),this.its.push({tween:t,late:h,d:s.d,t:i})}var I=class{constructor(){this.its=[],this.id=-1,this.fl=0}to(t,s,i=0){if(t&&s)return++this.id,ct.call(this,t,s,i),this}reverse(){this.id=-1;let e=this.its.length-1;this.its.map(({tween:t,t:s},i)=>{t.reverse(this.its[e-i].late-this.fl-s)}),this.its=[]}},mt=I,F=class{constructor(t,s,i,e){this.iscroll=c.add(i,this.raf.bind(this)),this.iresize=c.add("resize",this.resize.bind(this)),this.o=s,this.el=t,this.dir=e,this.d=e?"y":"x",s.target||(s.target=t),s.scroll&&(this.ps=$(s.target.length?s.target[0]:s.target,!1,s.o.p)),this.resize()}raf(t){var s,i,e;this.ps?(i=("number"==typeof this.o.s?this.o.s:.2)*this.l,s=t[this.d]+this.l,e=this.p-i,i=this.si+i+this.l,this.scroll(Y(e,i,s)),e<=s&&(this.in=!0),i<=s&&(this.in=!1)):(e=t[this.d]+this.l,(this.o.s||0)/100*this.l+this.p<e&&this.fire())}fire(){E(this.o.target||this.el,this.o.o),this.o.cb&&this.o.cb(),this.iscroll.r()}scroll(t){this.in&&(this.o.raf&&this.o.raf(t),this.ps.map(s=>{this.o.target.length?this.o.target.forEach(t=>{t.style[s.name]=s.cb(t)}):this.o.target.style[s.name]=s.cb(t)}))}resize(){this.b=M(this.el),this.dir?(this.p=this.b.t,this.si=this.b.b):(this.p=this.b.l,this.si=this.b.r),this.l=this.dir?window.innerHeight:window.innerWidth}},Q=F;function L(t,s){return t.prev=t.e,t.e=s,-(t.e-t.s)}var H=class{constructor(t,s={}){history.scrollRestoration="manual",this.el=t,this.ease=s.ease||.1,this.dir=null==s.dir,this.dragOn=s.drag||!0,this.wheelOn=s.wheel||!0,this.dragOn&&(this.ipointerdown=c.add("pointerdown",this.down.bind(this)),this.ipointermove=c.add("pointermove",this.move.bind(this)),this.ipointerup=c.add("pointerup",this.up.bind(this))),this.wheelOn&&(this.iwheel=c.add("wheel",this.wheel.bind(this))),this.all=x.id("all"),this.throttle=new k({late:.3,cb:()=>x.p(this.all,"none")}),this.Init()}Init(){this.lerp={x:0,y:0},this.prevLerp={x:0,y:0},this.prevDist={x:0,y:0},this.scroll={x:0,y:0},this.drag={x:{s:0,e:0,sp:0,ep:0},y:{s:0,e:0,sp:0,ep:0}},this.dist={x:0,y:0},this.distance={x:0,y:0},this.iresize=c.add("resize",this.resize.bind(this)),this.iraf=c.add("raf",this.raf.bind(this)),this.sscroll=c.obs("scroll"),this.sdist=c.obs("dist"),this.resize()}wheel(t){this.lerp.x+=t.deltaY*this.ease*7,this.lerp.y+=t.deltaY*this.ease*7,this.dist.x+=t.deltaY*this.ease*7,this.dist.y+=t.deltaY*this.ease*7,x.p(this.all,"all"),this.throttle.run()}down(t){this.drag.y.s=t.pageY,this.drag.x.s=t.pageX,this.dn=!0,this.prevLerp.x=this.lerp.x,this.prevLerp.y=this.lerp.y,this.prevDist.x=this.dist.x,this.prevDist.y=this.dist.y}move(t){this.dn&&(x.p(this.all,"all"),this.throttle.run(),this.dir?(this.lerp.y=L(this.drag.y,t.pageY)+this.prevLerp.y,this.dist.y=L(this.drag.y,t.pageY)+this.prevDist.y):(this.lerp.x=L(this.drag.x,t.pageX)+this.prevLerp.x,this.dist.x=L(this.drag.x,t.pageX)+this.prevDist.x))}up(){this.dn=!1}add(t,s){new Q(t,s,this.sscroll.name,this.dir)}raf(){var t=this.bs.w-window.innerWidth,s=this.bs.h-window.innerHeight;this.distance.x=y(this.distance.x,this.dist.x,this.ease),this.distance.y=y(this.distance.y,this.dist.y,this.ease),this.lerp.x=g(0,t<0?0:t,this.lerp.x),this.lerp.y=g(0,s<0?0:s,this.lerp.y),this.scroll.x=y(this.scroll.x,this.lerp.x,this.ease),this.scroll.y=y(this.scroll.y,this.lerp.y,this.ease),this.dir?this.el.style.transform=`translateY(${-this.scroll.y}px)`:this.el.style.transform=`translateX(${-this.scroll.x}px)`,this.sscroll.cb(this.scroll),this.sdist.cb(this.distance)}resize(){this.bs=M(this.el)}destroy(){this.iresize.r(),this.iraf.r(),this.sscroll.r(),this.sdist.r(),this.dragOn&&(this.ipointerdown.r(),this.ipointermove.r(),this.ipointerup.r()),this.wheelOn&&this.iwheel.r()}},bt=H;export{M as Bounds,g as Clamp,A as Computed,O as Ease,it as Has,V as Late,y as Lerp,at as Mount,$ as Props,S as Raf,Y as Remap,st as Round,ht as Route,bt as Scroll,X as Store,c as Sub,mt as TL,k as Throttle,E as Tween,J as deepCopy,et as iRemap,x as iSet};