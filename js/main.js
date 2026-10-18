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
ch.style.opacity=0;const tls=$(".tls");let tk=0;
const upd=()=>{tk=0;const H=root.scrollHeight-innerHeight,p=H>0?scrollY/H:0,r=tls.getBoundingClientRect();
root.style.setProperty("--h",(220-p*100).toFixed(1));
T.forEach((t,i)=>t.style.strokeDashoffset=1-clamp(1.1+p*1.4-i*.09));
$("#vi").style.opacity=clamp(p*3);
$("#scene").style.transform=`translateY(${-p*150}px) scale(${1+p*.14})`;
ch.style.transform=`rotate(${-4+p*10}deg) scale(${1+p*.12})`;
tls.style.setProperty("--tp",clamp((innerHeight*.7-r.top)/r.height))};
addEventListener("scroll",()=>{tk||(tk=requestAnimationFrame(upd))},{passive:true});addEventListener("resize",upd);
requestAnimationFrame(()=>requestAnimationFrame(upd));

/* sliding glass thumb for the nav and the filter */
const put=(box,a)=>{const t=$(".th",box);if(a){t.style.width=a.offsetWidth+"px";t.style.transform="translateX("+a.offsetLeft+"px)"}};
const nav=$("#nav");
const so=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const a=$$("a",nav).find(x=>x.hash==="#"+e.target.id);$$("a",nav).forEach(x=>x.toggleAttribute("aria-current",x===a));put(nav,a);ch.style.opacity=e.target.id==="top"?0:1;
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
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");ro.unobserve(e.target)}}),{threshold:.12});
$$(".rv").forEach(el=>ro.observe(el));

/* projects: edit this list to add or change entries */
const L={industrial:"Industrial",academic:"Academic",personal:"Personal"};
const P=[
{t:"Solar tracker firmware",c:"industrial",d:"dsPIC33 controller firmware for a 48-node XBee solar network",g:"An existing solar tracking system had issues in the field. I redeveloped its embedded firmware to improve field operation, fix the observed problems and enable remote configuration and control.",b:["dsPIC33EP256MU810 firmware in MPLAB X, integrating a DS3231 RTC, battery-voltage measurement, five single-axis tilt sensors, five motor drivers and five motor-current channels","XBee API-mode link with custom telemetry and heartbeat frames carrying sensor readings, RTC data, calculated setpoints, motor currents, communication status, operating modes and fault flags","Remote commands for calibration, timing, GPS coordinates, maintenance, cleaning, hazard mode, night mode, fault clearing, acknowledgements and operating-mode control","Setpoints calculated on the controller with the configured NREPL backtracking algorithm, using sun-position angles supplied remotely","Priority-based operating modes and PWM actuator control","Three-layer architecture: central server, Network Control Units (NCUs) and MSAT200 tracker controllers","PC utilities for tilt-sensor configuration and monitoring, and for simulating field scenarios"],r:"Status: under field deployment and observation, with 48 MSAT200 devices per coordinator NCU, automatic command transmission and 30 s heartbeats.",k:["Embedded C","dsPIC33EP256MU810","MPLAB X","XBee API","RS-485","RTC","PWM"]},
{t:"Polyhouse monitoring",c:"industrial",d:"STM32 sensor nodes that recover their data after coordinator downtime",g:"A polyhouse needed environmental, soil, crop-solution and weather measurements collected and sent as timestamped data to a central monitoring system.",b:["STM32L431RCT6 sensor-controller boards polling RS-485 sensors for temperature, humidity, soil temperature and moisture, EC, pH, PAR, dissolved oxygen and weather","XBee XR868 API-mode communication with custom data frames, periodic telemetry and node addressing from an 8-position DIP switch","RTC timestamps and external W25Q64 flash with cyclic memory management","Acknowledgement handling and retransmission of unacknowledged records, including recovery of historical data after coordinator downtime","Remote commands for RTC setting, transmission intervals and flash clearing","Integrated with a team-built web app (live view, logging, history, Excel export) and Grafana Cloud dashboards"],r:"Status: running in an operational polyhouse for approximately 1.5 years, according to the deployment history.",k:["STM32L431RCT6","STM32CubeIDE","Embedded C","RS-485","Modbus RTU","XBee XR868","SPI flash"]},
{t:"Four-port serial-to-Ethernet gateway",c:"industrial",d:"RS-232 and RS-485 bridged to Ethernet with a DMA data path",g:"A gateway that connects four configurable RS-232 or RS-485 serial devices to an Ethernet network, with a custom PC application to monitor and configure it.",b:["STM32F405RGT6 firmware in STM32CubeIDE with a USR-TCP232-E2 Ethernet-to-serial module","Port configuration from a 4-position DIP switch, with RS-232 or RS-485 selected through a 74HC4053D multiplexer and MAX3232 and MAX485 interface ICs","Bidirectional serial-to-Ethernet data flow using interrupt- and DMA-based processing, so transfers never block the main loop","RTC-based timestamps on the data","PC application to monitor device data, show port and Ethernet-module settings, change them and log data","A separate utility that configures the Ethernet module through AT commands"],k:["STM32F405RGT6","STM32CubeIDE","UART","DMA","Interrupts","RS-232","RS-485","Ethernet"]},
{t:"Solar string-current monitor",c:"industrial",d:"Eight-channel current monitoring for solar plants, under deployment",g:"An eight-channel string-current monitor for high-current solar plant applications.",b:["STM32L431RCT6 firmware reading two ADS1015 ADCs over I2C for multichannel current measurement","Signal conditioning with OPA2322AID op-amps as unity-gain buffers for positive and negative sensor outputs","RTC timestamps and W25Q32 flash storage for data frames","Ethernet serial-conversion module for timestamped data transmission","Channel-level LED indication and a buzzer alarm","PC application with live current visualization, periodic polling, logging and Excel report export"],r:"Status: under deployment.",k:["STM32L431RCT6","I2C","ADS1015","Analog signal conditioning","SPI flash","Ethernet"]},
{t:"XBee-to-Ethernet gateway",c:"industrial",d:"Wireless nodes bridged to Ethernet with timestamped frames",g:"A gateway that joins an XBee XR868 wireless network to Ethernet through a serial-conversion module.",b:["STM32L431RCT6 firmware with XBee API-mode communication and custom timestamped data frames","RTC timestamps and W25Q64 external flash storage","Device addressing from a 4-position DIP switch","Custom PC application for data monitoring, logging, RTC configuration and Ethernet-module configuration over AT commands"],k:["STM32L431RCT6","XBee API","UART","SPI flash","Ethernet"]},
{t:"Data-center cooling controller",c:"industrial",d:"Temperature-driven fan control with RS-485 telemetry",g:"A temperature-controlled cooling system for a data-center application.",b:["STM32L431RCT6 with a DS18B20 digital temperature sensor","Threshold-based switching of three 24 V DC fans from one shared temperature measurement","Periodic, formatted ASCII data over RS-485, monitored in Docklight"],k:["STM32L431RCT6","DS18B20","Embedded C","RS-485"]},
{t:"DiffLens",c:"personal",d:"Open-source visual diff tool for source files",g:"A personal software project: a desktop application that compares text and source-code files through a graphical interface.",b:["Compares files with interactive visual highlighting of the differences","Supports multiple programming languages","Multiple themes and a clean, user-friendly interface","Keyboard shortcuts for fast navigation and operation"],r:"Open source, with the code on GitHub.",k:["HTML","CSS","JavaScript"],u:"https://github.com/nitu2126/DiffLens"},
{t:"Smart cold-chain prototype",c:"academic",d:"An ESP32-CAM recognises produce and adapts the cooling",g:"Different produce keeps best at different temperatures. This prototype identifies what is stored and adapts the cooling to it automatically.",b:["Object detection on an ESP32-CAM, using a model trained on the Edge Impulse platform","Temperature sensing with an LM35 and adaptive cooling through a Peltier module, tuned per detected fruit or vegetable","IR-sensor-triggered operation","Real-time remote monitoring on the Blynk IoT platform, with a NodeMCU in the build"],r:"Academic project at AISSMS IOIT.",k:["ESP32-CAM","Edge Impulse","LM35","Peltier module","Blynk IoT","NodeMCU"]},
{t:"IoT air-quality monitor",c:"academic",d:"Arduino node streaming pollutants to ThingSpeak",g:"A system to remotely monitor temperature, humidity and air quality index, along with the main gases that cause air pollution.",b:["Sensors and Arduino boards measuring CO, CO2, NH3, NOx and particulate matter","Built and simulated with Proteus and the Arduino IDE","Readings sent to the ThingSpeak IoT platform for remote viewing","A compact design for effective measurement in small areas of urban cities"],r:"Academic project, built with a teammate.",k:["Arduino","Arduino IDE","Proteus","ThingSpeak","Sensors"]},
{t:"Sanitary waste machine automation",c:"academic",d:"Raspberry Pi automation of a manual machine, sponsored by Techlance",g:"A manually operated sanitary-waste disposal machine, automated with a Raspberry Pi controller.",b:["SG90 and MG90 servo motors operating the metal door","IR sensor for object detection and a solenoid lock for door security","Integrated HDMI display used for advertising and as a usage guide","A water-scrubbing air purifier with a mesh structure for air filtering","Proposed next steps: ventilation system, isolated electronics compartment, maintenance alarms and remote monitoring"],r:"Academic project with two teammates, sponsored by Techlance Pvt. Ltd.",k:["Raspberry Pi","Servo control","IR sensor","Process automation"]}];
const grid=$("#grid"),dlg=$("#dlg"),fb=$("#f");let cur=P,idx=0;
const chips=a=>a.map(x=>"<span>"+x+"</span>").join("");
function draw(f){cur=P.filter(p=>f==="all"||p.c===f);grid.innerHTML="";cur.forEach((p,i)=>{const c=document.createElement("button");c.className="g card";c.style.setProperty("--i",i);c.innerHTML='<span class="t">'+L[p.c]+"</span><h3>"+p.t+"</h3><p>"+p.d+'</p><div class="ks">'+chips(p.k.slice(0,3))+"</div>";c.onclick=()=>show(i);grid.append(c)})}
function show(i){idx=(i+cur.length)%cur.length;const p=cur[idx];
dlg.innerHTML='<div class="in"><button class="x" aria-label="Close">×</button><span class="t">'+L[p.c]+"</span><h3>"+p.t+"</h3><p>"+p.g+"</p><h4>What I built</h4><ul>"+p.b.map(x=>"<li>"+x+"</li>").join("")+"</ul>"+(p.r?'<p class="rs">'+p.r+"</p>":"")+'<h4>Stack</h4><div class="ks">'+chips(p.k)+'</div><div class="dn">'+(p.u?'<a class="btn p" href="'+p.u+'" target="_blank" rel="noopener">View on GitHub</a>':"")+'<button class="btn" data-d="-1">Previous</button><button class="btn" data-d="1">Next</button></div></div>';
if(!dlg.open)dlg.showModal()}
dlg.onclick=e=>{if(e.target===dlg||e.target.closest(".x"))return dlg.close();const b=e.target.closest("[data-d]");if(b)show(idx+ +b.dataset.d)};
addEventListener("keydown",e=>{if(!dlg.open)return;if(e.key==="ArrowRight")show(idx+1);if(e.key==="ArrowLeft")show(idx-1)});
[["all","All"],["industrial","Industrial"],["academic","Academic"],["personal","Personal"]].forEach(([k,n],i)=>{const b=document.createElement("button");b.textContent=n;b.setAttribute("aria-pressed",i===0);b.onclick=()=>{$$("button",fb).forEach(x=>x.setAttribute("aria-pressed",x===b));put(fb,b);draw(k)};fb.append(b)});
addEventListener("load",()=>put(fb,$("[aria-pressed=true]",fb)));
draw("all");

/* theme switcher */
const TM=$("#tm"),TB=$("#tb");
const setT=t=>{root.dataset.theme=t;try{localStorage.setItem("theme",t)}catch(e){}$$("button",TM).forEach(b=>b.setAttribute("aria-checked",b.dataset.t===t))};
TB.onclick=e=>{e.stopPropagation();TM.hidden=!TM.hidden;TB.setAttribute("aria-expanded",!TM.hidden)};
TM.onclick=e=>{const b=e.target.closest("[data-t]");if(b){setT(b.dataset.t);TM.hidden=true}};
document.addEventListener("click",e=>{if(!TM.hidden&&!e.target.closest("#tm")){TM.hidden=true}});
setT(root.dataset.theme||"glass");
addEventListener("resize",()=>put(fb,$("[aria-pressed=true]",fb)));
