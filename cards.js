/* ============================================================
   Miles Beyond Borders — Card Page widget
   Embed in Showit with:
     <div id="mbb-cards"></div>
     <script src="https://advaitmbb.github.io/card-widget/cards.js?v=1"></script>
   Reads the same cards.json the in-post widget uses, shows only
   rows where show_on_card_page = yes. Scoped under #mbb-cards.
   ============================================================ */
(function () {
  "use strict";

  var DATA_URL = "https://advaitmbb.github.io/card-widget/cards.json";

  /* link-type pills (set the `link_type` column to one of these keys) */
  var LINK_PILLS = {
    affiliate: { label: "Affiliate link", cls: "aff" },
    referral:  { label: "Referral link", cls: "ref" },
    public:    { label: "Public offer \u00b7 no commission", cls: "pub" }
  };

  /* ---- mount ---- */
  var mount = document.getElementById("mbb-cards");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "mbb-cards";
    var here = document.currentScript;
    if (here && here.parentNode) here.parentNode.insertBefore(mount, here.nextSibling);
    else document.body.appendChild(mount);
  }

  /* ---- fonts ---- */
  if (!document.getElementById("mbbc-fonts")) {
    var fl = document.createElement("link");
    fl.id = "mbbc-fonts"; fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(fl);
  }

  /* ---- styles ---- */
  var CSS = `
  #mbb-cards{--cream:#FAF6EE;--navy:#1A2B3C;--accent:#0E6BA8;--bright:#38b6ff;--footer:#14222F;
    --ink:#1A2B3C;--muted:#5d6b78;--line:#e4dccd;--card:#fff;--good:#1f7a4d;--good-bg:#eaf5ee;
    --radius:14px;--shadow:0 1px 2px rgba(26,43,60,.06),0 6px 24px rgba(26,43,60,.06);
    font-family:'Inter',system-ui,sans-serif;color:var(--ink);font-size:16px;line-height:1.55;box-sizing:border-box}
  #mbb-cards *{box-sizing:border-box}
  #mbb-cards a{color:var(--accent);text-decoration:none}
  #mbb-cards .mbbc-wrap{max-width:1180px;margin:0 auto;padding:0 4px}
  #mbb-cards .mbbc-controls{padding:4px 0 14px;border-bottom:1px solid var(--line);margin-bottom:24px}
  #mbb-cards .mbbc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  #mbb-cards .mbbc-row2,#mbb-cards .mbbc-row3{margin-top:10px}
  #mbb-cards .mbbc-search{flex:1 1 260px;position:relative}
  #mbb-cards .mbbc-search input{width:100%;padding:11px 13px 11px 38px;border:1px solid var(--line);border-radius:10px;font-family:inherit;font-size:15px;background:#fff;color:var(--ink)}
  #mbb-cards .mbbc-search input:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}
  #mbb-cards .mbbc-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);opacity:.5}
  #mbb-cards select{appearance:none;-webkit-appearance:none;padding:10px 32px 10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235d6b78' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>") no-repeat right 11px center;font-family:inherit;font-size:14px;color:var(--ink);cursor:pointer}
  #mbb-cards select:focus{outline:2px solid var(--accent);outline-offset:1px}
  #mbb-cards .mbbc-toggle{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:500;cursor:pointer;user-select:none;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:#fff}
  #mbb-cards .mbbc-toggle input{accent-color:var(--accent);width:16px;height:16px;cursor:pointer}
  #mbb-cards .mbbc-meta{display:flex;justify-content:space-between;align-items:center;margin-top:11px;font-size:13px;color:var(--muted)}
  #mbb-cards .mbbc-meta b{color:var(--ink);font-weight:600}
  #mbb-cards .mbbc-clear{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;cursor:pointer;font-weight:500;padding:0}
  #mbb-cards .mbbc-clear:hover{text-decoration:underline}
  #mbb-cards .mbbc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;padding-bottom:10px}
  #mbb-cards .mbbc-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;display:flex;flex-direction:column;transition:transform .15s,box-shadow .15s}
  #mbb-cards .mbbc-card:hover{transform:translateY(-3px);box-shadow:0 4px 10px rgba(26,43,60,.08),0 14px 40px rgba(26,43,60,.12)}
  #mbb-cards .mbbc-top{display:flex;gap:14px;align-items:flex-start}
  #mbb-cards .mbbc-art{flex:0 0 96px;height:62px;border-radius:8px;overflow:hidden;background:linear-gradient(135deg,#dfe7ee,#c7d4de);display:flex;align-items:center;justify-content:center;color:#8294a3;font-size:10px;font-weight:600;letter-spacing:.05em;text-align:center;padding:4px}
  #mbb-cards .mbbc-art img{width:100%;height:100%;object-fit:contain}
  #mbb-cards .mbbc-head{flex:1;min-width:0}
  #mbb-cards .mbbc-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:7px}
  #mbb-cards .mbbc-badge{font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:999px;box-shadow:0 1px 3px rgba(26,43,60,.18)}
  #mbb-cards .mbbc-badge.high{background:#F5A623;color:#3a2600}
  #mbb-cards .mbbc-badge.elev{background:#F5A623;color:#3a2600}
  #mbb-cards .mbbc-badge.end{background:#e23b3b;color:#fff}
  #mbb-cards .mbbc-name{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:18px;line-height:1.2;margin:0}
  #mbb-cards .mbbc-fee{font-size:12.5px;color:var(--muted);margin-top:4px}
  #mbb-cards .mbbc-fee .dot{margin:0 6px;opacity:.5}
  #mbb-cards .mbbc-offer{margin:16px 0 0;padding-top:15px;border-top:1px solid var(--line)}
  #mbb-cards .mbbc-lab{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  #mbb-cards .mbbc-pts{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:21px;line-height:1.15;color:var(--navy)}
  #mbb-cards .mbbc-req{font-size:12.5px;color:var(--muted);margin-top:2px}
  #mbb-cards .mbbc-vchip{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:16px;color:var(--good);margin-left:10px}
  #mbb-cards .mbbc-acc{border-top:1px solid var(--line)}
  #mbb-cards .mbbc-acc-sum{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;list-style:none;padding:13px 0 12px;font-size:14px;font-weight:600;color:var(--ink)}
  #mbb-cards .mbbc-acc-sum::-webkit-details-marker{display:none}
  #mbb-cards .mbbc-acc-sum:hover{color:var(--accent)}
  #mbb-cards .mbbc-acc-lab.take{font-family:'Fraunces',Georgia,serif;color:var(--accent);font-weight:600}
  #mbb-cards .mbbc-chev{color:var(--muted);transition:transform .18s ease;flex:0 0 auto}
  #mbb-cards details[open] .mbbc-chev{transform:rotate(180deg)}
  #mbb-cards .mbbc-acc-body{padding:0 0 14px;font-size:14px;line-height:1.5;color:#3a4855}
  #mbb-cards .mbbc-acc-value .mbbc-acc-body{color:#3f6b54}
  #mbb-cards .mbbc-bens{margin:0;padding:0;list-style:none;font-size:13px}
  #mbb-cards .mbbc-bens li{position:relative;padding-left:18px;margin-bottom:5px;color:#3a4855}
  #mbb-cards .mbbc-bens li:before{content:"";position:absolute;left:2px;top:7px;width:6px;height:6px;border-radius:50%;background:var(--accent)}
  #mbb-cards .mbbc-foot{margin-top:auto;padding-top:18px}
  #mbb-cards .mbbc-ltype{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:999px;margin:0 0 12px}
  #mbb-cards .mbbc-ltype:before{content:"";width:7px;height:7px;border-radius:50%}
  #mbb-cards .mbbc-ltype.aff{background:#eaf1f7;color:#0E6BA8}
  #mbb-cards .mbbc-ltype.aff:before{background:#0E6BA8}
  #mbb-cards .mbbc-ltype.ref{background:#f4eefb;color:#6b3fa0}
  #mbb-cards .mbbc-ltype.ref:before{background:#6b3fa0}
  #mbb-cards .mbbc-ltype.pub{background:var(--good-bg);color:var(--good)}
  #mbb-cards .mbbc-ltype.pub:before{background:var(--good)}
  #mbb-cards .mbbc-cta-row{display:flex;align-items:center;gap:14px}
  #mbb-cards .mbbc-cta{flex:1;text-align:center;background:var(--accent);color:#fff;font-weight:600;font-size:15px;padding:12px 16px;border-radius:10px;transition:background .15s}
  #mbb-cards .mbbc-cta:hover{background:#0a5688}
  #mbb-cards .mbbc-review{font-size:13.5px;font-weight:600;white-space:nowrap}
  #mbb-cards .mbbc-review:hover{text-decoration:underline}
  #mbb-cards .mbbc-empty,#mbb-cards .mbbc-state{grid-column:1/-1;text-align:center;padding:50px 20px;color:var(--muted)}
  #mbb-cards .mbbc-empty b{display:block;font-family:'Fraunces',Georgia,serif;font-size:20px;color:var(--ink);margin-bottom:6px}
  @media(max-width:560px){#mbb-cards .mbbc-grid{grid-template-columns:1fr}}
  `;
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  /* ---- skeleton (no promise/disclosure banners — added in Showit) ---- */
  mount.innerHTML =
    '<div class="mbbc-wrap">' +
      '<div class="mbbc-controls">' +
        '<div class="mbbc-row">' +
          '<div class="mbbc-search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
            '<input id="mbbc-q" type="text" placeholder="Search cards (e.g. Sapphire, Hyatt, Ink)"></div>' +
          '<select id="mbbc-sort"><option value="rec">Sort: Recommended</option><option value="wo">Welcome offer: High \u2192 Low</option><option value="val">My value: High \u2192 Low</option><option value="feelo">Annual fee: Low \u2192 High</option><option value="feehi">Annual fee: High \u2192 Low</option></select>' +
        '</div>' +
        '<div class="mbbc-row mbbc-row2">' +
          '<select id="mbbc-issuer"><option value="">All issuers</option></select>' +
          '<select id="mbbc-type"><option value="">All types</option><option>Personal</option><option>Business</option></select>' +
          '<select id="mbbc-fee"><option value="">Any annual fee</option><option value="0">$0</option><option value="u100">Under $100</option><option value="100-300">$100\u2013$300</option><option value="300">$300+</option></select>' +
          '<select id="mbbc-wo"><option value="">Welcome offer: any</option><option value="50000">50,000+ points</option><option value="75000">75,000+ points</option><option value="100000">100,000+ points</option><option value="150000">150,000+ points</option></select>' +
          '<select id="mbbc-spend"><option value="">Spend requirement: any</option><option value="1000">\u2264 $1,000</option><option value="3000">\u2264 $3,000</option><option value="5000">\u2264 $5,000</option><option value="8000">\u2264 $8,000</option></select>' +
        '</div>' +
        '<div class="mbbc-row mbbc-row3">' +
          '<label class="mbbc-toggle"><input type="checkbox" id="mbbc-transfer">Transferable points only</label>' +
          '<label class="mbbc-toggle"><input type="checkbox" id="mbbc-elev">Elevated offers only</label>' +
        '</div>' +
        '<div class="mbbc-meta"><div class="mbbc-count"><b id="mbbc-count">0</b> cards</div><button class="mbbc-clear" id="mbbc-reset">Reset filters</button></div>' +
      '</div>' +
      '<div class="mbbc-grid" id="mbbc-grid"><div class="mbbc-state">Loading cards\u2026</div></div>' +
    '</div>';

  /* ---- helpers ---- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function money(n){ return "$" + Number(n).toLocaleString("en-US"); }
  function num(s){ var m=String(s==null?"":s).replace(/,/g,"").match(/\d+(\.\d+)?/); return m?parseFloat(m[0]):null; }
  function lc(s){ return String(s==null?"":s).trim().toLowerCase(); }
  function initials(n){ return String(n||"").split(/\s+/).slice(0,2).join(" ").toUpperCase(); }
  function isElevated(c){ var s=lc(c.welcome_offer_status); return s==="elevated"||s==="all-time high"; }

  function cardHTML(c){
    var s = lc(c.welcome_offer_status), badges = "";
    if(s==="all-time high") badges += '<span class="mbbc-badge high">All-time high offer</span>';
    else if(s==="elevated") badges += '<span class="mbbc-badge elev">Elevated offer</span>';

    var art = c.card_image_url
      ? '<img src="'+esc(c.card_image_url)+'" alt="'+esc(c.card_name)+'">'
      : esc(initials(c.card_name));

    var chev = '<svg class="mbbc-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';

    var pts = num(c.welcome_offer), cpp = parseFloat(c.cpp), valueBlock = "";
    if(pts != null && !isNaN(cpp)){
      var val = Math.round(pts * cpp / 100);
      var vbody = "What I think the " + esc(c.welcome_offer||"welcome bonus") + " is realistically worth, valued at a conservative " + esc(String(cpp)) + "\u00a2 per point. I value points by what you\u2019ll actually get \u2014 not a best-case redemption.";
      valueBlock = '<details class="mbbc-acc mbbc-acc-value"><summary class="mbbc-acc-sum"><span class="mbbc-acc-lab">My value<span class="mbbc-vchip">\u2248 '+esc(money(val))+'</span></span>'+chev+'</summary><div class="mbbc-acc-body">'+vbody+'</div></details>';
    }

    var takeBlock = c.advait_quick_take
      ? '<details class="mbbc-acc"><summary class="mbbc-acc-sum"><span class="mbbc-acc-lab take">\u2726 My take</span>'+chev+'</summary><div class="mbbc-acc-body">'+esc(c.advait_quick_take)+'</div></details>'
      : "";

    var bens = String(c.highlighted_features||"").split("|").map(function(b){return b.trim();}).filter(function(b){return b;});
    var hiBlock = bens.length
      ? '<details class="mbbc-acc"><summary class="mbbc-acc-sum"><span class="mbbc-acc-lab">Card highlights</span>'+chev+'</summary><div class="mbbc-acc-body"><ul class="mbbc-bens">'+bens.map(function(b){return '<li>'+esc(b)+'</li>';}).join("")+'</ul></div></details>'
      : "";

    var lt = LINK_PILLS[lc(c.link_type)];
    var ltypeHTML = lt ? '<div class="mbbc-ltype '+lt.cls+'">'+lt.label+'</div>' : "";
    var relAttr = (lt && lt.cls==="pub") ? "nofollow noopener" : "sponsored nofollow noopener";
    var review = c.review_url ? '<a class="mbbc-review" href="'+esc(c.review_url)+'">Full review</a>' : "";

    return '<article class="mbbc-card">' +
      '<div class="mbbc-top"><div class="mbbc-art">'+art+'</div>' +
        '<div class="mbbc-head"><div class="mbbc-badges">'+badges+'</div>' +
          '<h3 class="mbbc-name">'+esc(c.card_name)+'</h3>' +
          '<div class="mbbc-fee">'+esc(c.annual_fee||"")+' annual fee<span class="dot">\u2022</span>'+esc(c.card_type||"")+'</div></div></div>' +
      '<div class="mbbc-offer"><div class="mbbc-lab">Welcome offer</div><div class="mbbc-pts">'+esc(c.welcome_offer||"")+'</div><div class="mbbc-req">'+esc(c.bonus_condition||"")+'</div></div>' +
      valueBlock + takeBlock + hiBlock +
      '<div class="mbbc-foot">'+ltypeHTML+'<div class="mbbc-cta-row"><a class="mbbc-cta" href="'+esc(c.affiliate_link||"#")+'" target="_blank" rel="'+relAttr+'">View offer \u2192</a>'+review+'</div></div>' +
    '</article>';
  }

  /* ---- state + filtering ---- */
  var CARDS = [], el = {};

  function feeMatch(f,v){ if(!v)return true; if(f==null)return false; if(v==="0")return f===0; if(v==="u100")return f>0&&f<100; if(v==="100-300")return f>=100&&f<=300; if(v==="300")return f>300; return true; }

  function render(){
    var q = lc(el.q.value);
    var list = CARDS.filter(function(c){
      if(el.issuer.value && c.card_issuer !== el.issuer.value) return false;
      if(el.type.value && c.card_type !== el.type.value) return false;
      if(!feeMatch(num(c.annual_fee), el.fee.value)) return false;
      if(el.wo.value && !(num(c.welcome_offer) >= parseFloat(el.wo.value))) return false;
      if(el.spend.value && !(num(c.bonus_condition) != null && num(c.bonus_condition) <= parseFloat(el.spend.value))) return false;
      if(el.transfer.checked && lc(c.transferable) !== "yes") return false;
      if(el.elev.checked && !isElevated(c)) return false;
      if(q && (lc(c.card_name)+" "+lc(c.card_issuer)+" "+lc(c.points_program)).indexOf(q) === -1) return false;
      return true;
    });

    var srt = el.sort.value;
    function val(c){ var p=num(c.welcome_offer), k=parseFloat(c.cpp); return (p!=null&&!isNaN(k))?p*k/100:0; }
    if(srt==="wo") list.sort(function(a,b){return (num(b.welcome_offer)||0)-(num(a.welcome_offer)||0);});
    else if(srt==="val") list.sort(function(a,b){return val(b)-val(a);});
    else if(srt==="feelo") list.sort(function(a,b){return (num(a.annual_fee)||0)-(num(b.annual_fee)||0);});
    else if(srt==="feehi") list.sort(function(a,b){return (num(b.annual_fee)||0)-(num(a.annual_fee)||0);});
    else list.sort(function(a,b){return (num(a.sort_order)||999)-(num(b.sort_order)||999);});

    el.count.textContent = list.length;
    el.grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<div class="mbbc-empty"><b>No cards match those filters</b>Try widening the fee range or clearing your search.</div>';
  }

  function buildIssuerOptions(){
    var seen = {};
    CARDS.forEach(function(c){ if(c.card_issuer) seen[c.card_issuer]=true; });
    Object.keys(seen).sort().forEach(function(n){ var o=document.createElement("option"); o.textContent=n; el.issuer.appendChild(o); });
  }

  function wire(){
    el.q=mount.querySelector("#mbbc-q"); el.issuer=mount.querySelector("#mbbc-issuer");
    el.type=mount.querySelector("#mbbc-type"); el.fee=mount.querySelector("#mbbc-fee");
    el.wo=mount.querySelector("#mbbc-wo"); el.spend=mount.querySelector("#mbbc-spend");
    el.transfer=mount.querySelector("#mbbc-transfer"); el.elev=mount.querySelector("#mbbc-elev");
    el.sort=mount.querySelector("#mbbc-sort"); el.count=mount.querySelector("#mbbc-count");
    el.grid=mount.querySelector("#mbbc-grid"); el.reset=mount.querySelector("#mbbc-reset");
    ["input","change"].forEach(function(ev){
      el.q.addEventListener(ev,render);
      [el.issuer,el.type,el.fee,el.wo,el.spend,el.transfer,el.elev,el.sort].forEach(function(x){x.addEventListener(ev,render);});
    });
    el.reset.addEventListener("click",function(){
      el.q.value="";el.issuer.value="";el.type.value="";el.fee.value="";el.wo.value="";el.spend.value="";
      el.transfer.checked=false;el.elev.checked=false;el.sort.value="rec";render();
    });
  }

  fetch(DATA_URL)
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(data){
      var obj = (data && data.cards) ? data.cards : {};
      CARDS = Object.keys(obj).map(function(k){ return obj[k]; })
        .filter(function(c){ return lc(c.show_on_card_page) === "yes"; });
      wire(); buildIssuerOptions(); render();
    })
    .catch(function(){
      var g = mount.querySelector("#mbbc-grid");
      if(g) g.innerHTML = '<div class="mbbc-state">Couldn\u2019t load cards right now. Please refresh in a moment.</div>';
    });
})();
