/* @khalidvsalah | Stabraq | v1.0.0 | MIT License | https://github.com/khalidvsalah/stabraq | https://www.khalidsalah.com */var w=e=>3*e,J=(e,t)=>1-w(t)+w(e),K=(e,t)=>w(t)-6*e,P=(e,t,s)=>((J(t,s)*e+K(t,s))*e+w(t))*e;function Q(e,t,s){return w(J(t,s))*Math.pow(e,2)+2*K(t,s)*e+w(t)}var Mt=(e,t,s,i,r)=>{let o=0,n=0,l=0;do n=t+(s-t)/2,o=P(n,i,r)-e,o>0?s=n:t=n;while(Math.abs(o)>1e-7&&++l<10);return n},Vt=(e,t,s,i)=>{for(let r=0;r<4;++r){let o=Q(t,s,i);if(o===0)return t;t-=(P(t,s,i)-e)/o}return t},$t=e=>{let t=e[0],s=e[1],i=e[2],r=e[3];if(t===s&&i===r)return Y.l;let o=new Float32Array(11);for(let l=0;l<11;++l)o[l]=P(l*.1,t,i);function n(l){let h=0,c=1;for(;c!==10&&o[c]<=l;++c)h+=.1;--c;let M=(l-o[c])/(o[c+1]-o[c]),f=h+M*.1,R=Q(f,t,i);return R>=.001?Vt(l,f,t,i):R===0?f:Mt(l,h,h+.1,t,i)}return l=>l===0||l===1?l:P(n(l),s,r)},Y={custom:$t,l:e=>e,i1:e=>1-Math.cos(e*Math.PI/2),o1:e=>Math.sin(e*Math.PI/2),io1:e=>-(Math.cos(Math.PI*e)-1)/2,i2:e=>Math.pow(e,2),o2:e=>1-(1-e)*(1-e),io2:e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2,i3:e=>Math.pow(e,3),o3:e=>1-Math.pow(1-e,3),io3:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,i4:e=>Math.pow(e,4),o4:e=>1-Math.pow(1-e,4),io4:e=>e<.5?8*e*e*e*e:1-Math.pow(-2*e+2,4)/2,i5:e=>Math.pow(e,5),o5:e=>1-Math.pow(1-e,5),io5:e=>e<.5?16*Math.pow(e,5):1-Math.pow(-2*e+2,5)/2,i6:e=>e===0?0:Math.pow(2,10*e-10),o6:e=>e===1?1:1-Math.pow(2,-10*e),io6:e=>e===0?0:e===1?1:e<.5?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2,i7:e=>1-Math.sqrt(1-Math.pow(e,2)),o7:e=>sqrt(1-Math.pow(e-1,2)),io7:e=>e<.5?(1-Math.sqrt(1-Math.pow(2*e,2)))/2:(Math.sqrt(1-Math.pow(-2*e+2,2))+1)/2},a=e=>typeof e=="object"?Y.custom(e):Y[e];var C=(e,t)=>Math.max(e,t),m=(e,t,s)=>Math.min(Math.max(e,s),t),d=(e,t,s)=>(1-s)*e+s*t,T=(e,t,s)=>m(0,1,(s-e)/(t-e)),kt=(e,t,s,i,r)=>T(e,t,r)*(i-s)+s,V=(e,t)=>{let s=t?Math.pow(10,t):100;return Math.round(e*s)/s},zt=(e,t)=>Math.sqrt(e**2+t**2),Et=(e,t,s,i=.50399)=>d(e,t,1-Math.exp(-s*i));var St=(e,t)=>window.hasOwnProperty.call(e,t),k=e=>{let t=e.getBoundingClientRect();return{w:t.width,h:t.height,x:t.x,y:t.y,xE:t.right,yE:t.bottom}},z=e=>window.getComputedStyle(e),b={alpha:(e,t)=>e.style.opacity=t,display:(e,t)=>e.style.display=t,pointer:(e,t)=>e.style.pointerEvents=t,position:(e,t)=>e.style.position=t,visible:(e,t)=>e.style.visibility=t,form:(e,t,s,i)=>e.style.transform=`translate3d(${s+t},${i+t},0)`},u={id:e=>document.getElementById(e),el:e=>document.querySelector(e),els:e=>[...document.querySelectorAll(e)],sEl:(e,t)=>e.querySelector(t),sEls:(e,t)=>[...e.querySelectorAll(t)],node:e=>document.createElement(e),text:e=>document.createTextNode(e)},g={get size(){return{w:window.innerWidth,h:window.innerHeight}},string:e=>JSON.stringify(e)},$=class{constructor({d:t,cb:s}){this.d=t*1e3,this.cb=s,this.time=0}run(){clearTimeout(this.time),this.time=setTimeout(this.cb,this.d)}};var qt=(e,{opacity:t})=>{let s={s:+t,e:e[0],ease:a(e[1])};return s.lerp=s.e-s.s,i=>`${s.s+s.lerp*s.ease(i)}`},Pt=(e,t)=>e.style.opacity=t,U={cb:qt,setValue:Pt};var Tt=(e,{filter:t})=>{let s;return t==="none"?s={s:0,e:e[0]}:s={s:+t.match(/(\d.*)px/)[1],e:e[0]},s.lerp=s.e-s.s,s.ease=a(e[1]),i=>s.s+s.lerp*s.ease(i)},Ot=(e,t)=>e.style.filter=`blur(${t}px)`,Z={cb:Tt,setValue:Ot};var j={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},_t=/([astvzqmhlc])([^astvzqmhlc]*)/gi,Yt=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;function Ct(e){let t=e.match(Yt);return t?t.map(Number):[]}function tt(e){let t=[];return e.replace(_t,function(s,i,r){let o=i.toLowerCase();for(r=Ct(r),o==="m"&&r.length>2&&(t.push([i].concat(r.splice(0,2))),o="l",i=i==="m"?"l":"L");;){if(r.length===j[o])return r.unshift(i),t.push(r);if(r.length<j[o])throw new Error("malformed path data");t.push([i].concat(r.splice(0,j[o])))}}),t}var jt=(e,{el:t})=>{let s=tt(t.getAttribute("d")),i=tt(e[0]),r=a(e[1]);return o=>{let n="",l="";for(let h=0;h<s.length;h++){let c=s[h],M=i[h];for(let f=0;f<c.length;f++)n+=(isNaN(c[f])?c[f]:d(c[f],M[f],r(o)))+" ";l=n.trim()}return l}},Ft=(e,t)=>e.setAttribute("d",t),et={cb:jt,setValue:Ft};var Nt=(e,{el:t})=>{let s=t.getTotalLength(),i={s:e[0]*s,e:e[1]*s,ease:a(e[2])};return i.lerp=i.e-i.s,r=>`${i.s+i.lerp*i.ease(r)}`},Lt=(e,t)=>e.style.strokeDasharray=t,st={cb:Nt,setValue:Lt};var Ht=(e,{el:t})=>{let s=t.getTotalLength();t.style.strokeDasharray=s;let i={s:e[1]*s,e:e[0]*s,ease:a(e[2])};return i.lerp=i.e-i.s,r=>`${i.s+i.lerp*i.ease(r)}`},It=(e,t)=>e.style.strokeDashoffset=t,it={cb:Ht,setValue:It};var rt=e=>{let t=[],s=e.split(" "),i=s.length;for(let r=0;r<i;r++){let o=s[r].split(","),n=o.length;for(let l=0;l<n;l++){let h=o[l];t.push(isNaN(h)?h:+h)}}return t},Wt=(e,{el:t})=>{let s=rt(t.getAttribute("points")),i=rt(e[0]),r=ease(e[1]);return o=>{let n="",l="";for(let h=0;h<s.length;h++)n+=d(s[h],i[h],r(o))+" ",l=n.trim();return l}},Dt=(e,t)=>e.setAttribute("points",t),ot={cb:Wt,setValue:Dt};var nt=(e,t,s)=>{let i={s:e?e[1]=="px"?t:t/parseFloat(s)*100:t,e:e?e[0]:t,unit:e&&e[1]?e[1]:"px"};return i.lerp=i.e-i.s,e?i.ease=a(e[2]):i.ease=a("l"),r=>`${i.s+i.lerp*i.ease(r)}${i.unit}`},lt=(e,t)=>{let s={s:t,e:e?e[0]:t};return s.lerp=s.e-s.s,e?s.ease=a(e[1]):s.ease=a("l"),i=>`${s.s+s.lerp*s.ease(i)}`},ht=e=>{let t={s:e?e[0]:0,e:e?e[1]:0};return t.lerp=t.e-t.s,e?t.ease=a(e[1]):t.ease=a("l"),s=>`${t.s+t.lerp*t.ease(s)}deg`},At=e=>{let t=e.match(/^matrix3d\((.+)\)$/),s=e.match(/\((.+)\)$/);return t?(s=t[1].split(", "),s=[s[0],s[1],s[4],s[5],s[12],s[13]]):s&&(s=s[1].split(", ")),s},Bt=(e,{transform:t,width:s,height:i})=>{let r=At(t),o=nt(e.x,r?+r[4]:0,s),n=nt(e.y,r?+r[5]:0,i),l=lt(e.sx,r?+r[0]:1),h=lt(e.sy,r?+r[3]:1),c=ht(e.rx),M=ht(e.ry);return f=>`translate3d(${o(f)}, ${n(f)}, 0) scale(${l(f)}, ${h(f)}) rotateX(${c(f)}) rotateY(${M(f)})`},Xt=(e,t)=>e.style.transform=t,at={cb:Bt,setValue:Xt};var Gt=(e,{pa:t,top:s})=>{let i;if(s==="auto")i={s:0,e:e[0],unit:e[1]||"px"};else{let r=parseFloat(s);i={s:e[1]==="px"?r:r/k(t).h*100,e:e[0],unit:e[1]||"px"}}return i.lerp=i.e-i.s,i.ease=a(e[2]),r=>`${i.s+i.lerp*i.ease(r)}${i.unit}`},Rt=(e,t)=>e.style.top=t,pt={cb:Gt,setValue:Rt};var Jt=(e,{pa:t,width:s})=>{let i=parseFloat(s),r={s:e[1]==="px"?i:i/t.clientWidth*100,e:e[0],unit:e[1]==="px"?"px":"%",ease:a(e[2])};return r.lerp=r.e-r.s,o=>`${r.s+r.lerp*r.ease(o)}${r.unit}`},Kt=(e,t)=>e.style.width=t,ct={cb:Jt,setValue:Kt};var Qt=(e,{pa:t,height:s})=>{let i=parseFloat(s),r={s:e[1]==="px"?i:i/t.clientHeight*100,e:e[0],unit:e[1]==="px"?"px":"%",ease:a(e[2])};return r.lerp=r.e-r.s,o=>`${r.s+r.lerp*r.ease(o)}${r.unit}`},Ut=(e,t)=>e.style.height=t,ft={cb:Qt,setValue:Ut};var Zt=[[/^(form)$/,at],[/^(a)$/,U],[/^(draw)$/,it],[/^(dash)$/,st],[/^(points)$/,ot],[/^(d)$/,et],[/^(top)$/,pt],[/^(blur)$/,Z],[/^(width)$/,ct],[/^(height)$/,ft]],F=Zt;function N(e){let t=F.length;for(let s=0;s<t;s++){let i=F[s];if(e.match(i[0]))return i[1]}}function te(e,t,s){let i=z(e);i.el=e,i.pa=e.parentNode;for(let r of Object.entries(t)){let o=N(r[0]),n=o.cb(r[1],i);s.push({setV:o.setValue,cb:n})}}function ee(e,t,s){for(let i in t){let r={s:e[i],e:t[i][0],ease:a(t[i][1])};r.lerp=r.e-r.s,s.push({setV:(o,n)=>o[i]=n,cb:o=>r.s+r.lerp*r.ease(o)})}}function se(e,t,s){let i=[];return t?ee(e,s,i):te(e,s,i),i}var y=se;var L=class{constructor(){this.items=[],this.id=-1}push(t){return t.id=++this.id,this.items.push(t),this.on||this.loop(),t.id}update(t){for(let s=0;s<this.items.length;s++){let i=this.items[s];if(i.d){i.st||(i.st=t);let r=(t-i.st)/(i.d*1e3),o=m(0,1,r);(i.cb(o)||o===1)&&this.kill(i.id)}else i.cb(t)}this.loop()}kill(t){this.items.map((s,i)=>{s.id===t&&(s.id=null,s.st=null,this.items.splice(i,1))})}loop(){this.items.length===0?(this.on=!1,window.cancelAnimationFrame(this.raf)):(this.on=!0,this.raf=window.requestAnimationFrame(this.update.bind(this)))}},E=new L;var H=class{constructor(){this.observers={}}obs(t){this.observers[t]={items:[],id:0};function s(){let r=this[t],o=Array.prototype.slice.call(arguments);for(let n=0;n<r.items.length;n++)r.items[n].cb(...o)}let i=r=>{this.observers[r].items=[]};return{cb:s.bind(this.observers),name:t,r:i.bind(this,t)}}add(t,s){this.observers[t]||console.error(t);let i=this.observers[t].items,r=this.observers[t].id++,o={cb:s,id:r,on:!0};return i.push(o),{item:o,r:(l=>{for(let h=0;h<i.length;h++)i[h].id==l.id&&(i[h].on=!1,i.splice(h,1))}).bind({},o)}}check(t){return!!this.observers[t]}},p=new H;function dt(e){let t=document.createElement("section"),s={start:0,end:0,lerp:.75};t.style.cssText=` position: fixed; height: 32px; width: 32px; display: flex; align-items: center; justify-content: center; font-size: 12px; background: #333; color: #fff; border-radius: 50%; pointer-events: none; `,p.add("pointermove",i=>{let r=V(i.pageX/g.size.w);t.style.top=i.pageY+-30+"px",t.style.left=i.pageX+-30*r+"px",t.textContent=r,s.start=m(0,.99999,r)}),p.add("raf",()=>{s.end=d(s.start,s.end,s.lerp),e(s.end)}),document.body.appendChild(t)}var v=class{constructor({d:t,o:s,cb:i}){this.d=t||0,this.o=s,this.cb=i,this.on=!1,this.stop=!1}play(){this.on=!0,this.stop=!1,this.d==0?this.Elp():(this.id=E.push({cb:this.loop.bind(this)}),this.f=performance.now()+this.d*1e3)}destroy(){this.stop=!0,this.on=!1}loop(t){t>this.f&&(E.kill(this.id),this.Elp())}Elp(){this.stop||(this.on=!1,E.push(this.o),this.cb&&this.cb())}};function I(e){this.isObj=!1,e instanceof Node?this.target=e:typeof e=="string"?this.target=u.el(e):(this.isObj=!0,this.target=e)}var ut=new Map;function W(e){let t=ut.get(e);return t||(ut.set(e,this),!1)}var D=class{constructor(t,s){let i=W.call(this,t);if(!i)I.call(this,t),this.init(s);else return i}init(t){this.o=t,this.mode,this.prog=0,this.elapsed=0,this.dir=0,this.d=t.d,this.late=t.late,this.from=t.from,this.oProps=t.p,this.lateO={cb:this.run.bind(this),d:this.d},this.late=new v({d:this.late,o:this.lateO}),this.props=y(this.target,this.isObj,t.p),t.from&&this.props.map(({setV:s,cb:i})=>s(this.target,i(0)))}run(t){this.on=!0,this.elapsed=m(0,1,this.prog+t);let s=Math.abs(this.dir-this.elapsed);if(this.props.map(({setV:i,cb:r})=>{let o=this.from?1-s:s;i(this.target,r(o))}),this.raf&&this.raf(s,this.target),this.elapsed==1)return this.destroy()}control(t,s){this.late.on&&this.mode!==t&&(this.mode=t,this.late.destroy()),this.mode!==t&&(this.mode=t,t==="r"?this.dir=1:this.dir=0,this.late.cb=()=>this.start&&this.start(this.target),!this.late.on&&(this.on?(this.lateO.st=null,s?this.prog=0:this.prog=1-this.elapsed):this.late.play()))}reverse(t){this.late.d=t.late||this.late.d,this.index===0&&(this.start=t.start,this.completed=t.completed,this.raf=t.raf),this.control("r")}play(t,s){this.index=s,this.index===0&&(this.start=t.start,this.completed=t.completed,this.raf=t.raf),g.string(this.oProps)!=g.string(t.p)?(this.late.d=t.late||0,this.lateO.d=t.d,this.oProps=t.p,this.props=y(this.target,this.isObj,t.p),this.mode="r",this.control("p",!0)):this.control("p")}destroy(){return this.on=!1,this.prog=0,this.completed&&this.completed(this.target),!0}},mt=D;function ie(e,t){let s;Array.isArray(e)&&!t.obj?s=e:s=[e];let i=s.map((o,n)=>{let l=(t.late||0)+(t.space*n||0);return new mt(o,{...t,late:l})});i.map((o,n)=>o.play(t,n));let r=i.map(o=>o.late.d);return{reverse:(o={})=>{let n=(t.late||0)-o.late;i.map((l,h)=>{o.late=r[h]-n,l.reverse(o)})},play:()=>i.map((o,n)=>o.play(t,n))}}var A=ie;var x=(e,t)=>{let s=e.match(/(\+|\-)(.*)/);if(s){if(s[1]=="+")return t+ +s[2];if(s[1]=="-")return t-+s[2]}else return+e},B=class{constructor(t,s,i){this.el=t,this.target=s.target,this.o=s,this.from=s.from,this.dir=i,this.dirE=i=="y"?"yE":"xE",this.Init(s)}Init(t){t.target||(this.target=this.el),t.scroll&&(this.ps=t.p?y(this.target,!1,t.p):[]),t.pin&&(this.pin=t.pin,this.pin.target=t.pin.target||this.target),this.iresize=p.add("resize",this.resize.bind(this)),this.resize(),this.iraf=p.add(t.obsname,this.raf.bind(this))}resize(){let t=this.el.length?this.el[0]:this.el,s={y:t.offsetTop,yE:t.offsetTop+t.offsetHeight,x:t.offsetLeft,xE:t.offsetLeft+t.offsetWidth};this.o.scroll?(this.startpint=x(this.o.scroll.start||"+0",s[this.dir]),this.endpoint=x(this.o.scroll.end||"+0",s[this.dirE])):(this.startpint=x(this.o.start||"+0",s[this.dir]),this.endpoint=x(this.o.end||"+0",s[this.dirE])),this.o.pin&&(this.pin.start=x(this.pin.a||"+0",s[this.dir]),this.pin.end=x(this.pin.z||"+0",s[this.dirE]))}raf(t){if(this.coord=t,this.o.scroll){let s=T(this.startpint,this.endpoint,this.coord);this.scroll(s),this.o.pin&&this.piner(),this.o.raf&&this.o.raf(s,this.target,this.coord)}else this.startpint<=this.coord&&this.fire()}scroll(t){let s=this.from?1-t:t;this.ps.map(i=>{this.target.length?this.target.forEach(r=>i.setV(r,i.cb(s))):i.setV(this.target,i.cb(t))})}fire(){this.o.tween&&A(this.target,this.o.tween),this.o.completed&&this.o.completed(this.target),this.destroy()}piner(){if(this.pined&&!(this.coord>=this.pin.end)){let t=C(0,this.coord-this.pin.pxS);this.pin.target.style.transform=`translate3d(${this.dir?"0px,"+t+"px":t+"px,0px"},0px)`}this.coord<this.pin.start?this.pined=!1:this.coord>=this.pin.start&&!this.pined&&(this.pin.pxS=this.coord,this.pined=!0)}destroy(){this.iraf.r(),this.iresize.r()}},gt=B;var bt=!1;function X(){if(!bt){history.scrollRestoration="manual",window.onpointerdown=p.obs("pointerdown").cb,window.onpointermove=p.obs("pointermove").cb,window.onpointerup=p.obs("pointerup").cb,window.onkeydown=p.obs("keydown").cb,window.onwheel=p.obs("wheel").cb,bt=!0;let e=u.node("div");e.setAttribute("data-overlay",""),e.style.cssText=` height: 100%; width: 100%; position: fixed; top: 0; left: 0; z-index: 999; pointer-events: none; `,document.body.appendChild(e)}}var S=class{constructor(t,s){this.options=s,this.attacher=t,this.target=s.target,this.dir=s.dir?s.dir:"y",this.isY=this.dir=="y",this.ePage=this.dir=="y"?"pageY":"pageX",this._init(s),this.chokeEl=u.el("[data-overlay]"),this.choke=new $({d:.3,cb:()=>b.pointer(this.chokeEl,"none")})}_init(t){X(),Object.is(this.attacher,window)?(t.drag!==!1&&(this.ipointerdown=p.add("pointerdown",this._down.bind(this)),this.ipointermove=p.add("pointermove",this._move.bind(this))),t.key!==!1&&(this.ikey=p.add("keydown",this._onkey.bind(this))),t.wheel!==!1&&(this.iwheel=p.add("wheel",this._wheel.bind(this))),this.globalevents=p.obs("globalevents").cb):(t.wheel!==!1&&(this.attacher.onwheel=this._wheel.bind(this)),t.drag!==!1&&(this.attacher.onpointerdown=this._down.bind(this),this.attacher.onpointermove=this._move.bind(this))),this.ipointerup=p.add("pointerup",this._up.bind(this)),this.dist=0,this.scroll={value:0,lerp:0,dir:1},this.speed={value:0,lerp:0}}_wheel(t){this.loop();let s=t.deltaMode==1?.83:.55,i=t.wheelDeltaY*s;this.scroll.value-=i,this.scroll.dir=Math.sign(i),this.globalevents&&this.globalevents(t,i)}_onkey(t){if(t.keyCode==40||t.keyCode==38){this.loop();let s=0;t.keyCode==40?s=-66.6:t.keyCode==38&&(s=66.6),this.scroll.value-=s,this.globalevents&&this.globalevents(t,s)}}_down(t){this.mousedown=!0,this.dist=t[this.ePage]}_move(t){if(this.mousedown){this.loop();let s=t[this.ePage]-this.dist;this.scroll.value-=s,this.dist=t[this.ePage],this.scroll.dir=Math.sign(s),this.globalevents&&(b.pointer(this.chokeEl,"all"),this.globalevents(t,s))}}_up(){this.mousedown=!1,this.choke.run()}_destroy(){this.iraf.r(),this.sub.r(),this.iresize.r(),Object.is(this.attacher,window)?(this.ipointerdown&&(this.ipointerdown.r(),this.ipointermove.r()),this.ikey&&this.ikey.r(),this.iwheel&&this.iwheel.r()):this.options!==!1&&(this.attacher.onpointerdown=null,this.attacher.onpointermove=null),this.ipointerup.r()}};var O=(e,t,s)=>{s?b.form(e,"px",0,t):b.form(e,"px",t,0)},wt=(e,t,s,i,r,o)=>{e<=s.z&&t>=s.a?(O(i,-o,r),s.out=!1):s.out||(O(i,-o,r),s.out=!0)},G=class extends S{constructor(t,s){super(t,s),this.ease=s.ease||.09,this.infinite=s.infinite,this.sub=p.obs(s.obs||Symbol("foo")),this.speed={time:performance.now(),offset:0,value:0,ease:s.speed||.3},this.iresize=p.add("resize",this.resize.bind(this)),this.iraf=p.add("raf",this.raf.bind(this)),this.resize()}loop(){this.iraf.item.on||(this.iraf=p.add("raf",this.raf.bind(this)))}add(t,s){s.obsname=this.sub.name;let i=new gt(t,s,this.dir);return this.loop(),i}raf(t){this.kids||(this.scroll.value=m(0,this.dim,this.scroll.value)),this.scroll.lerp=d(this.scroll.lerp,this.scroll.value,this.ease);let s=V(this.scroll.lerp);this.speed.time=t-this.speed.time,this.speed.offset=s-this.speed.offset,this.speed.value=d(this.speed.value,this.speed.offset/this.speed.time,this.speed.ease),this.kids?(s>this.dim?(this.scroll.value=this.scroll.value-this.dim,this.scroll.lerp=s-this.dim):s<0&&(this.scroll.value=this.dim+this.scroll.value,this.scroll.lerp=this.dim+s),this.kids.map(([i,r])=>{let o=s,n=o+this.s;if(s>this.dim-this.s){let l=s-(this.dim-this.s)-this.s,h=l+this.s;l<=r.z&&h>=r.a?O(i,this.s-h,this.isY):wt(o,n,r,i,this.isY,s)}else wt(o,n,r,i,this.isY,s)})):O(this.target,-s,this.isY),this.speed.time=t,this.speed.offset=s,this.sub&&this.sub.cb(s),s==this.scroll.value&&this.iraf.r()}resize(){if(this.bs=k(this.target),this.infinite){let s=[...this.target.children];this.kids=s.map(i=>{let r=this.isY?i.offsetTop:i.offsetLeft,o=this.isY?i.offsetHeight:i.offsetWidth;return[i,{a:r,z:r+o}]})}let t=this.isY?"h":"w";this.s=g.size[t],this.dim=this.bs[t]-(this.kids?0:this.s),this.loop()}},re=G;var _=" ";function oe(e,t){document.body.append(e),e.style.visibility="hidden",e.style.position="absolute",e.style.whiteSpace="nowrap",e.style.fontFamily=t.getPropertyValue("font-family"),e.style.fontSize=t.getPropertyValue("font-size"),e.style.fontWeight=t.getPropertyValue("font-weight"),e.style.textTransform=t.getPropertyValue("text-transform"),e.style.letterSpacing=t.getPropertyValue("letter-spacing"),e.style.lineHeight=t.getPropertyValue("line-height")}function yt(e){let t=e.childNodes,s=[];for(let i=0;i<t.length;i++)s.push(ne(t[i]));return s}function ne(e){let t;return e.nodeType===3?t={value:e.nodeValue.split(" "),type:3}:t={value:yt(e),type:1,node:e},t}function vt(e){for(let t=0;t<e.length;t++){let s=e[t];if(s.type===3){let i=[];for(let r=0;r<s.value.length;r++)s.value[r]=s.value[r].replace(/\n/g,""),s.value[r]!==""&&i.push(s.value[r]);s.value=i}else vt(s.value)}}function xt(e,t,s){if(s.words){let i=e.words.length,r;s.ltrs?r=e.words.reduce((o,n,l)=>{let h="";for(let c=0;c<n.length;c++)h+=q(n[c],3);return o+q(h+(l==i-1?"":_),2)},""):r=e.words.reduce((o,n,l)=>o+q(n+(l==i-1?"":_),2),""),t.push({line:q(r,1)})}else t.push({line:q(e.value,1)})}function q(e,t){if(t===1)return`<div class="tfx"><span>${e}</span></div>`;if(t===2)return`<span class="word">${e}</span>`;if(t===3)return`<span class="ltr">${e}</span>`}function le(e,t,s,i,r,o){for(let n=0;n<e.length;n++){let l=e[n];t.value+=l,s.innerHTML=t.value,t.words.push(l),s.offsetWidth>i&&(t.words.pop(),xt(t,r,o),t.value=l,t.words=[l+_]),t.value+=_}}function he(e,t,s,i){let r={value:"",words:[]},o=[];for(let n=0;n<e.length;n++){let l=e[n];l.type===3&&le(l.value,r,t,s,o,i)}return xt(r,o,i),o}function ae(e,t){let s=z(e),i=document.createElement("div");t.ltrs&&(t.words=!0),oe(i,s);let r=e.offsetWidth,o=yt(e);vt(o);let n=he(o,i,r,t);return e.innerHTML="",document.body.removeChild(i),n.map(({line:l})=>e.innerHTML+=l),{lines:u.sEls(e,".tfx"),words:u.sEls(e,".word"),ltrs:u.sEls(e,".ltr")}}var pe=ae;export{k as bounds,$ as choke,m as clamp,z as computed,b as cssSet,Et as damp,zt as dist,a as ease,St as has,g as iSet,v as late,d as lerp,pe as line,T as map,y as props,u as query,E as raf,kt as remap,V as round,re as scroll,dt as scrub,p as sub,A as tween,C as zero};
