const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],clamp=v=>Math.min(1,Math.max(0,v));
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches,root=document.documentElement;
const NS="http://www.w3.org/2000/svg",mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.append(e);return e};

/* PCB scene: traces draw, chip turns and the board changes colour as you scroll */
const D=["M0 360H380L440 300H700L760 360H900","M0 440H200L260 500H600L660 440H900","M0 600H340L400 540H700L760 520H900","M1000 330V200L1060 140H1440","M1100 400H1260L1320 460H1440","M1000 550V700L940 760H500L440 820H0","M1100 520H1180L1240 580V900","M0 220H180L240 160H560","M300 900V760L360 700H520","M1440 300H1300L1240 240V0","M600 0V120L660 180H760","M0 760H120L180 820V900"];
const T=D.map(d=>mk("path",{d,pathLength:1,class:"tr"},$("#tr")));
[[380,360],[700,300],[600,500],[760,520],[1060,140],[1260,400],[500,760],[520,700],[1240,580]].forEach(([cx,cy])=>mk("circle",{cx,cy,r:7},$("#vi")));
const ch=$("#chip");
mk("rect",{class:"b",x:900,y:330,width:200,height:220,rx:26},ch);mk("rect",{class:"d",x:932,y:362,width:136,height:156,rx:16},ch);
[360,400,440,480,520].forEach(y=>{mk("path",{class:"p",d:`M884 ${y}H900M1100 ${y}H1116`},ch)});[940,1000,1060].forEach(x=>{mk("path",{class:"p",d:`M${x} 314V330M${x} 550V566`},ch)});
const cl=mk("text",{x:1000,y:448},ch),cs=mk("text",{x:1000,y:476,class:"s"},ch);
const LB={top:["STM32","Cortex-M"],work:["dsPIC33","16-bit DSC"],path:["RS-485","Modbus RTU"],skills:["XBee","API mode"],contact:["KiCad","PCB design"]};
const tls=$(".tls");let tk=0;
const upd=()=>{tk=0;const H=root.scrollHeight-innerHeight,p=H>0?scrollY/H:0,r=tls.getBoundingClientRect();
root.style.setProperty("--h",(220-p*100).toFixed(1));
T.forEach((t,i)=>t.style.strokeDashoffset=1-clamp(.2+p*1.5-i*.06));
$("#vi").style.opacity=clamp(p*3);
$("#scene").style.transform=`translateY(${-p*150}px) scale(${1+p*.14})`;
ch.style.transform=`rotate(${-4+p*10}deg) scale(${1+p*.12})`;
tls.style.setProperty("--tp",clamp((innerHeight*.7-r.top)/r.height))};
addEventListener("scroll",()=>{tk||(tk=requestAnimationFrame(upd))},{passive:true});addEventListener("resize",upd);
requestAnimationFrame(()=>requestAnimationFrame(upd));

/* sliding glass thumb for the nav and the filter */
const put=(box,a)=>{const t=$(".th",box);if(a){t.style.width=a.offsetWidth+"px";t.style.transform="translateX("+a.offsetLeft+"px)"}};
const nav=$("#nav");
const so=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const a=$$("a",nav).find(x=>x.hash==="#"+e.target.id);$$("a",nav).forEach(x=>x.toggleAttribute("aria-current",x===a));put(nav,a);
[cl.textContent,cs.textContent]=LB[e.target.id];[cl,cs].forEach(n=>{n.classList.remove("swap");void n.getBBox();n.classList.add("swap")})}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section[id]").forEach(s=>so.observe(s));
addEventListener("load",()=>put(nav,$("a[aria-current]",nav)||$("a",nav)));addEventListener("resize",()=>put(nav,$("a[aria-current]",nav)));

/* glass highlight follows the pointer */
addEventListener("pointermove",e=>{const g=e.target.closest&&e.target.closest(".g");if(!g)return;const r=g.getBoundingClientRect();g.style.setProperty("--x",e.clientX-r.left+"px");g.style.setProperty("--y",e.clientY-r.top+"px")});

/* toast and email (assembled here so it is not plain text in the page source) */
const tt=$("#toast");let tm;
const toast=m=>{tt.textContent=m;tt.classList.add("on");clearTimeout(tm);tm=setTimeout(()=>tt.classList.remove("on"),2200)};
const addr=["nitishghadage2126","gmail.com"].join("@");$("#mail").href="mailto:"+addr;
$("#copy").onclick=()=>navigator.clipboard.writeText(addr).then(()=>toast("Email copied"),()=>{location.href="mailto:"+addr});

/* count-up stats and scroll reveal */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,t=+el.dataset.n,d=+el.dataset.d||0,p=el.dataset.p||"",s=performance.now();
const f=n=>{const k=rm?1:Math.min((n-s)/1500,1);el.textContent=p+(t*(1-Math.pow(1-k,3))).toFixed(d);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
$$("[data-n]").forEach(el=>co.observe(el));
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target)}}),{threshold:.12});
$$(".rv").forEach(el=>ro.observe(el));

/* projects: edit this list to add or change entries */
const L={industrial:"Industrial",academic:"Academic",personal:"Personal"};
const P=[
{t:"Solar tracker firmware",c:"industrial",d:"dsPIC33 controller firmware for a 48-node XBee solar network",s:"Redeveloped firmware for an existing solar tracker controller to fix issues seen in the field and enable remote configuration and control.",b:["Five tilt sensors, five motor drivers and five motor-current channels","XBee API-mode telemetry with 30 s heartbeats and remote commands for calibration, night, hazard and cleaning modes","Setpoints computed on the controller with the NREPL backtracking algorithm; under field deployment with 48 controllers per coordinator"],k:["Embedded C","dsPIC33EP256MU810","MPLAB X","XBee API","RS-485","PWM"]},
{t:"Polyhouse monitoring",c:"industrial",d:"STM32 sensor nodes that recover their data after coordinator downtime",s:"Sensor-node firmware running in an operational polyhouse for about 1.5 years.",b:["Polls 9+ RS-485 sensor types: temperature, humidity, soil, EC, pH, PAR, dissolved oxygen and weather","RTC timestamps and W25Q64 flash with cyclic storage; unacknowledged records are re-sent after downtime","XBee XR868 API mode; feeds a team-built web dashboard and Grafana Cloud"],k:["STM32L431","Embedded C","Modbus RTU","XBee XR868","SPI flash"]},
{t:"Four-port serial-to-Ethernet gateway",c:"industrial",d:"RS-232 and RS-485 bridged to Ethernet with a DMA data path",s:"Firmware and a PC monitoring app for a four-port gateway.",b:["STM32F405 with a USR-TCP232-E2 Ethernet module","Per-port RS-232 or RS-485 selection through a DIP switch, mux and MAX3232/MAX485","Interrupt and DMA data path; PC app for monitoring, settings and logging"],k:["STM32F405","UART","DMA","RS-232","RS-485","Ethernet"]},
{t:"Solar string-current monitor",c:"industrial",d:"Eight-channel current monitoring for solar plants, under deployment",s:"Eight-channel string-current monitor for high-current solar plants.",b:["Two ADS1015 ADCs over I2C with OPA2322 buffer stages","RTC timestamps, W25Q32 flash and Ethernet serial conversion","Per-channel LEDs and buzzer alarm; PC app with live view, logging and Excel export"],k:["STM32L431","I2C","ADS1015","SPI flash"]},
{t:"XBee-to-Ethernet gateway",c:"industrial",d:"Wireless nodes bridged to Ethernet with timestamped frames",s:"STM32L431 gateway connecting XBee XR868 wireless nodes to an Ethernet serial-conversion module.",b:["XBee API-mode communication with custom timestamped frames","RTC, W25Q64 flash and 4-position DIP-switch addressing","PC app for monitoring, logging and module setup over AT commands"],k:["STM32L431","XBee API","UART","Ethernet"]},
{t:"Data-center cooling controller",c:"industrial",d:"Temperature-driven fan control with RS-485 telemetry",s:"STM32L431 controller for a data-center cooling application.",b:["DS18B20 digital temperature sensing","Threshold switching of three 24 V DC fans","ASCII telemetry over RS-485, monitored in Docklight"],k:["STM32L431","DS18B20","RS-485"]},
{t:"DiffLens",c:"personal",d:"Open-source visual diff tool for source files",s:"A desktop app for comparing text and source-code files through a graphical interface.",b:["Interactive highlighting of differences","Multi-language support and several themes","Keyboard-driven navigation"],k:["HTML","CSS","JavaScript"],u:"https://github.com/nitu2126/DiffLens"},
{t:"Smart cold-chain prototype",c:"academic",d:"An ESP32-CAM recognises produce and adapts the cooling",s:"A cold-chain prototype that identifies produce and adjusts cooling automatically.",b:["Edge Impulse model running on an ESP32-CAM","LM35 temperature sensing with a Peltier module tuned per detected fruit or vegetable","IR-triggered operation and remote monitoring on Blynk IoT"],k:["ESP32-CAM","Edge Impulse","LM35","Peltier","Blynk","NodeMCU"]},
{t:"IoT air-quality monitor",c:"academic",d:"Arduino node streaming pollutants to ThingSpeak",s:"Remote monitoring of temperature, humidity, air quality index and pollutant gases.",b:["CO, CO2, NH3, NOx and particulate matter","Readings stream to ThingSpeak","Compact enough for dense urban areas"],k:["Arduino","Proteus","ThingSpeak"]},
{t:"Sanitary waste machine automation",c:"academic",d:"Raspberry Pi automation of a manual machine, sponsored by Techlance",s:"Automated a manually operated sanitary-waste disposal machine. Sponsored by Techlance Pvt. Ltd.",b:["Servo-actuated metal doors (SG90/MG90) with a solenoid lock","IR object detection on a Raspberry Pi","HDMI display for usage guidance, plus a mesh water-scrubbing air purifier"],k:["Raspberry Pi","Servo control","IR sensor"]}];
const grid=$("#grid"),dlg=$("#dlg"),fb=$("#f");let cur=P,idx=0;
const chips=a=>a.map(x=>"<span>"+x+"</span>").join("");
function draw(f){cur=P.filter(p=>f==="all"||p.c===f);grid.innerHTML="";cur.forEach((p,i)=>{const c=document.createElement("button");c.className="g card";c.style.setProperty("--i",i);c.innerHTML='<span class="t">'+L[p.c]+"</span><h3>"+p.t+"</h3><p>"+p.d+'</p><div class="ks">'+chips(p.k.slice(0,3))+"</div>";c.onclick=()=>show(i);grid.append(c)})}
function show(i){idx=(i+cur.length)%cur.length;const p=cur[idx];
dlg.innerHTML='<div class="in"><button class="x" aria-label="Close">×</button><span class="t">'+L[p.c]+"</span><h3>"+p.t+"</h3><p>"+p.s+"</p><ul>"+p.b.map(x=>"<li>"+x+"</li>").join("")+'</ul><div class="ks">'+chips(p.k)+'</div><div class="dn">'+(p.u?'<a class="btn p" href="'+p.u+'" target="_blank" rel="noopener">View on GitHub</a>':"")+'<button class="btn" data-d="-1">Previous</button><button class="btn" data-d="1">Next</button></div></div>';
if(!dlg.open)dlg.showModal()}
dlg.onclick=e=>{if(e.target===dlg||e.target.closest(".x"))return dlg.close();const b=e.target.closest("[data-d]");if(b)show(idx+ +b.dataset.d)};
addEventListener("keydown",e=>{if(!dlg.open)return;if(e.key==="ArrowRight")show(idx+1);if(e.key==="ArrowLeft")show(idx-1)});
[["all","All"],["industrial","Industrial"],["academic","Academic"],["personal","Personal"]].forEach(([k,n],i)=>{const b=document.createElement("button");b.textContent=n;b.setAttribute("aria-pressed",i===0);b.onclick=()=>{$$("button",fb).forEach(x=>x.setAttribute("aria-pressed",x===b));put(fb,b);draw(k)};fb.append(b)});
addEventListener("load",()=>put(fb,$("[aria-pressed=true]",fb)));
draw("all");
