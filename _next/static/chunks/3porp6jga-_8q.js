(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,122146,t=>{t.v(e=>Promise.all(["static/chunks/3p42b1x54wu--.js"].map(e=>t.l(e))).then(()=>e(78504)))},960760,t=>{t.v(e=>Promise.all(["static/chunks/147qeitdrix81.js"].map(e=>t.l(e))).then(()=>e(834940)))},743097,t=>{t.v(e=>Promise.all(["static/chunks/3-oga3bgw-cj4.js"].map(e=>t.l(e))).then(()=>e(849793)))},9847,t=>{t.v(e=>Promise.all(["static/chunks/37o-j4ltvwine.js"].map(e=>t.l(e))).then(()=>e(111739)))},594099,t=>{t.v(e=>Promise.all(["static/chunks/11xgayt78o6gp.js"].map(e=>t.l(e))).then(()=>e(570304)))},947360,t=>{t.v(e=>Promise.all(["static/chunks/0sjvrou_do3tl.js"].map(e=>t.l(e))).then(()=>e(654891)))},661717,t=>{t.v(e=>Promise.all(["static/chunks/301k4ze4k2kfg.js"].map(e=>t.l(e))).then(()=>e(655518)))},359375,t=>{t.v(e=>Promise.all(["static/chunks/11_6s-jxjttqz.js"].map(e=>t.l(e))).then(()=>e(132990)))},300660,t=>{t.v(e=>Promise.all(["static/chunks/1z2s_tj2wdzd4.js"].map(e=>t.l(e))).then(()=>e(669865)))},67731,t=>{t.v(e=>Promise.all(["static/chunks/0azp7zon7i06y.js"].map(e=>t.l(e))).then(()=>e(265054)))},73703,t=>{t.v(e=>Promise.all(["static/chunks/1aihn8p466mf3.js"].map(e=>t.l(e))).then(()=>e(247095)))},918776,t=>{t.v(e=>Promise.all(["static/chunks/2b1i0mhbsz5jv.js"].map(e=>t.l(e))).then(()=>e(998729)))},210083,t=>{t.v(e=>Promise.all(["static/chunks/1jblqlcffqcg7.js"].map(e=>t.l(e))).then(()=>e(944476)))},403746,t=>{t.v(e=>Promise.all(["static/chunks/1xgad3fci5wgj.js"].map(e=>t.l(e))).then(()=>e(432653)))},429592,t=>{t.v(e=>Promise.all(["static/chunks/37k3rcifs6a5q.js"].map(e=>t.l(e))).then(()=>e(39611)))},80022,t=>{"use strict";var e=t.i(291238),a=t.i(508203),i=t.i(467541),l=t.i(581985),s=t.i(511386),r=t.i(461842),n=t.i(366479),o=t.i(238139),c=t.i(6765),p=l.f.pie,h={sections:new Map,showData:!1,config:p},d=h.sections,m=h.showData,g=structuredClone(p),u=(0,r.p)(()=>structuredClone(g),"getConfig"),f=(0,r.p)(()=>{d=new Map,m=h.showData,(0,l.M)()},"clear"),v=(0,r.p)(({label:t,value:e})=>{if(e<0)throw Error(`"${t}" has invalid value: ${e}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);d.has(t)||(d.set(t,e),s.d.debug(`added new section: ${t}, with value: ${e}`))},"addSection"),k=(0,r.p)(()=>d,"getSections"),x=(0,r.p)(t=>{m=t},"setShowData"),w=(0,r.p)(()=>m,"getShowData"),y={getConfig:u,clear:f,setDiagramTitle:l.a,getDiagramTitle:l.F,setAccTitle:l.b,getAccTitle:l.d,setAccDescription:l.C,getAccDescription:l.j,addSection:v,getSections:k,setShowData:x,getShowData:w},$=(0,r.p)((t,a)=>{(0,e.f)(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),b={parse:(0,r.p)(async t=>{let e=await (0,n.x)("pie",t);s.d.debug(e),$(e,y)},"parse")},j=(0,r.p)(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),S=(0,r.p)(t=>{let e=[...t.values()].reduce((t,e)=>t+e,0),a=[...t.entries()].map(([t,e])=>({label:t,value:e})).filter(t=>t.value/e*100>=1);return(0,o.Q)().value(t=>t.value).sort(null)(a)},"createPieArcs"),C=(0,r.p)((t,e,r,n)=>{s.d.debug("rendering pie chart\n"+t);let p=n.db,h=(0,l.z)(),d=(0,i.z)(p.getConfig(),h.pie),m=(0,a.f)(e),g=m.append("g");g.attr("transform","translate(225,225)");let{themeVariables:u}=h,[f]=(0,i.X)(u.pieOuterStrokeWidth);f??=2;let v=d.legendPosition,k=d.textPosition,x=d.donutHole>0&&d.donutHole<=.9?d.donutHole:0,w=(0,o.y)().innerRadius(185*x).outerRadius(185),y=(0,o.y)().innerRadius(185*k).outerRadius(185*k),$=g.append("g");$.append("circle").attr("cx",0).attr("cy",0).attr("r",185+f/2).attr("class","pieOuterCircle");let b=p.getSections(),j=S(b),C=[u.pie1,u.pie2,u.pie3,u.pie4,u.pie5,u.pie6,u.pie7,u.pie8,u.pie9,u.pie10,u.pie11,u.pie12],T=0;b.forEach(t=>{T+=t});let P=j.filter(t=>"0"!==(t.data.value/T*100).toFixed(0)),z=(0,c.X)(C).domain([...b.keys()]);$.selectAll("mySlices").data(P).enter().append("path").attr("d",w).attr("fill",t=>z(t.data.label)).attr("class",t=>{let e="pieCircle";return"hover"===d.highlightSlice?e+=" highlightedOnHover":d.highlightSlice===t.data.label&&(e+=" highlighted"),e}),$.selectAll("mySlices").data(P).enter().append("text").text(t=>(t.data.value/T*100).toFixed(0)+"%").attr("transform",t=>"translate("+y.centroid(t)+")").style("text-anchor","middle").attr("class","slice");let D=g.append("text").text(p.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText"),A=[...b.entries()].map(([t,e])=>({label:t,value:e})),O=g.selectAll(".legend").data(A).enter().append("g").attr("class","legend");O.append("rect").attr("width",18).attr("height",18).style("fill",t=>z(t.label)).style("stroke",t=>z(t.label)),O.append("text").attr("x",22).attr("y",14).text(t=>p.getShowData()?`${t.label} [${t.value}]`:t.label);let R=Math.max(...O.selectAll("text").nodes().map(t=>t?.getBoundingClientRect().width??0)),M=450,F=490,q=22*A.length;switch(v){case"center":O.attr("transform",(t,e)=>"translate("+(-R/2-22)+","+(22*e-22*A.length/2)+")");break;case"top":M+=q,O.attr("transform",(t,e)=>`translate(${-R/2-22}, ${22*e-185})`),$.attr("transform",()=>`translate(0, ${q+22})`);break;case"bottom":M+=q,O.attr("transform",(t,e)=>"translate("+(-R/2-22)+","+(22*e- -207)+")");break;case"left":F+=22+R,O.attr("transform",(t,e)=>"translate(-207,"+(22*e-22*A.length/2)+")"),$.attr("transform",()=>`translate(${R+18+4}, 0)`);break;default:F+=22+R,O.attr("transform",(t,e)=>"translate(216,"+(22*e-22*A.length/2)+")")}let B=D.node()?.getBoundingClientRect().width??0,H=Math.min(0,225-B/2),W=Math.max(F,225+B/2)-H;m.attr("viewBox",`${H} 0 ${W} ${M}`),(0,l.m)(m,M,W,d.useMaxWidth)},"draw");t.s(["diagram",0,{parser:b,db:y,renderer:{draw:C},styles:j}])}]);