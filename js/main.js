const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches,root=document.documentElement;

/* theme */
$("#theme").onclick=()=>{const d=root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches,n=d?"light":"dark";root.dataset.theme=n;try{localStorage.setItem("theme",n)}catch(e){}};

/* mobile menu */
const hd=$("header"),mb=$("#menu");
mb.onclick=()=>{const o=hd.classList.toggle("open");mb.setAttribute("aria-expanded",o);mb.textContent=o?"✕":"☰"};
$$("#nav a").forEach(a=>a.onclick=()=>{hd.classList.remove("open");mb.textContent="☰"});

/* toast, email (assembled here so it is not plain text in the page source) */
const tt=$("#toast");let tm;
const toast=m=>{tt.textContent=m;tt.classList.add("on");clearTimeout(tm);tm=setTimeout(()=>tt.classList.remove("on"),2200)};
const addr=["nitishghadage2126","gmail.com"].join("@");
$("#mail").href="mailto:"+addr;
$("#copy").onclick=()=>navigator.clipboard.writeText(addr).then(()=>toast("Email copied"),()=>{location.href="mailto:"+addr});

/* scroll progress, hero glow */
const pg=$("#pg");
addEventListener("scroll",()=>{pg.style.transform="scaleX("+scrollY/Math.max(1,root.scrollHeight-innerHeight)+")"},{passive:true});
const hero=$("#hero");
hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();hero.style.setProperty("--mx",e.clientX-r.left+"px");hero.style.setProperty("--my",e.clientY-r.top+"px")});

/* heartbeat and store-and-forward simulation */
const sg=$("#sg"),st=$("#st"),bf=$("#bf"),N=[];let on=true,buf=0;
for(let i=1;i<=48;i++){const d=document.createElement("i");d.className="n";d.title="Controller "+String(i).padStart(2,"0");sg.append(d);N.push(d)}
const beat=d=>{d.classList.remove("pulse");void d.offsetWidth;d.classList.add("pulse")};
setInterval(()=>{if(document.hidden)return;if(on){for(let k=0;k<4;k++)beat(N[Math.random()*48|0])}else{buf+=4;bf.textContent=buf}},420);
$("#drop").onclick=()=>{if(!on)return;on=false;buf=0;bf.textContent=0;N.forEach(d=>d.className="n buf");st.textContent="Coordinator offline. Every node keeps logging to flash."};
$("#back").onclick=()=>{if(on)return;on=true;const n=buf;N.forEach((d,i)=>setTimeout(()=>{d.className="n";beat(d)},rm?0:i*28));buf=0;bf.textContent=0;st.textContent="Link restored. "+n+" buffered records re-sent."};

/* count-up stats */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,t=+el.dataset.n,d=+el.dataset.d||0,p=el.dataset.p||"",s=performance.now();
const f=now=>{const k=rm?1:Math.min((now-s)/1400,1);el.textContent=p+(t*(1-Math.pow(1-k,3))).toFixed(d);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
$$("[data-n]").forEach(el=>co.observe(el));

/* scroll reveal and active nav link */
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target)}}),{threshold:.15});
$$(".rv").forEach(el=>ro.observe(el));
const no=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$("#nav a").forEach(a=>a.toggleAttribute("aria-current",a.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section[id]").forEach(s=>no.observe(s));

/* projects: edit this list to add or change entries */
const L={industrial:"Industrial",academic:"Academic",personal:"Personal"};
const P=[
{t:"Solar tracker firmware",c:"industrial",d:"dsPIC33 controller firmware for a 48-node XBee solar network",s:"Redeveloped firmware for an existing solar tracker controller to fix issues seen in the field and enable remote configuration and control.",b:["Five tilt sensors, five motor drivers and five motor-current channels","XBee API-mode telemetry with 30 s heartbeats; remote commands for calibration, night, hazard and cleaning modes","Setpoints computed on the controller with the NREPL backtracking algorithm","Under field deployment: 48 controllers per coordinator"],k:["Embedded C","dsPIC33EP256MU810","MPLAB X","XBee API","RS-485","PWM"]},
{t:"Polyhouse monitoring",c:"industrial",d:"STM32 sensor nodes that recover their data after coordinator downtime",s:"Sensor-node firmware running in an operational polyhouse for about 1.5 years.",b:["Polls 9+ RS-485 sensor types: temperature, humidity, soil, EC, pH, PAR, dissolved oxygen and weather","RTC timestamps and W25Q64 flash with cyclic storage; unacknowledged records are re-sent after downtime","XBee XR868 API mode with node addressing from an 8-position DIP switch","Feeds a team-built web dashboard and Grafana Cloud"],k:["STM32L431","Embedded C","Modbus RTU","XBee XR868","SPI flash"]},
{t:"Four-port serial-to-Ethernet gateway",c:"industrial",d:"RS-232 and RS-485 bridged to Ethernet with a DMA data path",s:"Firmware and a PC monitoring app for a four-port gateway.",b:["STM32F405 with a USR-TCP232-E2 Ethernet module","Per-port RS-232 or RS-485 selection through a DIP switch, mux and MAX3232/MAX485","Interrupt and DMA data path for non-blocking transfers","PC app for monitoring, settings and logging, plus an AT-command configuration utility"],k:["STM32F405","UART","DMA","RS-232","RS-485","Ethernet"]},
{t:"Solar string-current monitor",c:"industrial",d:"Eight-channel current monitoring for solar plants, under deployment",s:"Eight-channel string-current monitor for high-current solar plants.",b:["Two ADS1015 ADCs over I2C with OPA2322 buffer stages","RTC timestamps, W25Q32 flash and Ethernet serial conversion","Per-channel LEDs and a buzzer alarm","PC app with live view, logging and Excel export"],k:["STM32L431","I2C","ADS1015","SPI flash"]},
{t:"XBee-to-Ethernet gateway",c:"industrial",d:"Wireless nodes bridged to Ethernet with timestamped frames",s:"STM32L431 gateway connecting XBee XR868 wireless nodes to an Ethernet serial-conversion module.",b:["XBee API-mode communication with custom timestamped frames","RTC, W25Q64 flash and 4-position DIP-switch addressing","PC app for monitoring, logging and module setup over AT commands"],k:["STM32L431","XBee API","UART","Ethernet"]},
{t:"Data-center cooling controller",c:"industrial",d:"Temperature-driven fan control with RS-485 telemetry",s:"STM32L431 controller for a data-center cooling application.",b:["DS18B20 digital temperature sensing","Threshold switching of three 24 V DC fans","ASCII telemetry over RS-485, monitored in Docklight"],k:["STM32L431","DS18B20","RS-485"]},
{t:"DiffLens",c:"personal",d:"Open-source visual diff tool for source files",s:"A desktop app for comparing text and source-code files through a graphical interface.",b:["Interactive highlighting of differences","Multi-language support and several themes","Keyboard-driven navigation"],k:["HTML","CSS","JavaScript"],u:"https://github.com/nitu2126/DiffLens"},
{t:"Smart cold-chain prototype",c:"academic",d:"An ESP32-CAM recognises produce and adapts the cooling",s:"A cold-chain prototype that identifies produce and adjusts cooling automatically.",b:["Edge Impulse model running on an ESP32-CAM","LM35 temperature sensing with a Peltier module tuned per detected fruit or vegetable","IR-triggered operation and remote monitoring on Blynk IoT"],k:["ESP32-CAM","Edge Impulse","LM35","Peltier","Blynk","NodeMCU"]},
{t:"IoT air-quality monitor",c:"academic",d:"Arduino node streaming pollutants to ThingSpeak",s:"Remote monitoring of temperature, humidity, air quality index and pollutant gases.",b:["CO, CO2, NH3, NOx and particulate matter","Readings stream to ThingSpeak","Compact enough for dense urban areas"],k:["Arduino","Proteus","ThingSpeak"]},
{t:"Sanitary waste machine automation",c:"academic",d:"Raspberry Pi automation of a manual machine, sponsored by Techlance",s:"Automated a manually operated sanitary-waste disposal machine. Sponsored by Techlance Pvt. Ltd.",b:["Servo-actuated metal doors (SG90/MG90) with a solenoid lock","IR object detection on a Raspberry Pi","HDMI display for usage guidance, plus a mesh water-scrubbing air purifier"],k:["Raspberry Pi","Servo control","IR sensor"]}];
const grid=$("#grid"),dlg=$("#dlg");let cur=P,idx=0;
const chips=a=>a.map(x=>"<span>"+x+"</span>").join("");
function draw(f){cur=P.filter(p=>f==="all"||p.c===f);grid.innerHTML="";cur.forEach((p,i)=>{const c=document.createElement("button");c.className="card";c.style.setProperty("--i",i);c.innerHTML='<span class="t">'+L[p.c]+"</span><h3>"+p.t+"</h3><p>"+p.d+'</p><div class="ks">'+chips(p.k.slice(0,3))+"</div>";c.onclick=()=>show(i);grid.append(c)})}
grid.addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--x",e.clientX-r.left+"px");c.style.setProperty("--y",e.clientY-r.top+"px")});
function show(i){idx=(i+cur.length)%cur.length;const p=cur[idx];
dlg.innerHTML='<div class="in"><button class="x" aria-label="Close">×</button><span class="t">'+L[p.c]+"</span><h3>"+p.t+"</h3><p>"+p.s+"</p><ul>"+p.b.map(x=>"<li>"+x+"</li>").join("")+'</ul><div class="ks">'+chips(p.k)+'</div><div class="dn">'+(p.u?'<a class="btn p" href="'+p.u+'" target="_blank" rel="noopener">View on GitHub</a>':"")+'<button class="btn" data-d="-1">Previous</button><button class="btn" data-d="1">Next</button></div></div>';
if(!dlg.open)dlg.showModal()}
dlg.onclick=e=>{if(e.target===dlg||e.target.closest(".x"))return dlg.close();const b=e.target.closest("[data-d]");if(b)show(idx+ +b.dataset.d)};
addEventListener("keydown",e=>{if(!dlg.open)return;if(e.key==="ArrowRight")show(idx+1);if(e.key==="ArrowLeft")show(idx-1)});
const fb=$("#f");[["all","All"],["industrial","Industrial"],["academic","Academic"],["personal","Personal"]].forEach(([k,n],i)=>{const b=document.createElement("button");b.textContent=n;b.setAttribute("aria-pressed",i===0);b.onclick=()=>{$$("button",fb).forEach(x=>x.setAttribute("aria-pressed",x===b));draw(k)};fb.append(b)});
draw("all");
