/* ============================================================
   Miles Beyond Borders — Card Page widget
   Mobile-optimized card page for Showit.
   Embed in Showit with:
   <div id="mbb-cards"></div>
   <script src="https://advaitmbb.github.io/card-widget/cards.js?v=5"></script>
   ============================================================ */
(function () {
  "use strict";

  function firstNonEmpty() {
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return "";
  }

  function getOfferUrl(card) {
    return firstNonEmpty(
      card.offer_url,
      card.affiliate_url,
      card.affiliate_link,
      card.apply_link,
      card.apply_url,
      card.button_url,
      card.link,
      card.url,
      card.referral_link,
      card.partner_link,
      card.card_link
    );
  }

  function getReviewUrl(card) {
    return firstNonEmpty(
      card.review_url,
      card.full_review_url,
      card.review_link,
      card.full_review_link
    );
  }


  var VERSION = "5";
  var DATA_URL = "https://advaitmbb.github.io/card-widget/cards.json?v=" + VERSION;

  var LINK_PILLS = {
    affiliate: { label: "Affiliate link", cls: "aff" },
    referral: { label: "Referral link", cls: "ref" },
    public: { label: "Public offer · no commission", cls: "pub" }
  };

  var mount = document.getElementById("mbb-cards");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "mbb-cards";
    var here = document.currentScript;
    if (here && here.parentNode) here.parentNode.insertBefore(mount, here.nextSibling);
    else document.body.appendChild(mount);
  }

  if (!document.getElementById("mbbc-fonts")) {
    var fl = document.createElement("link");
    fl.id = "mbbc-fonts";
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(fl);
  }

  var CSS = `
#mbb-cards{--cream:#FAF6EE;--navy:#1A2B3C;--accent:#0E6BA8;--bright:#38b6ff;--footer:#14222F;--ink:#1A2B3C;--muted:#5d6b78;--line:#e4dccd;--card:#fff;--good:#1f7a4d;--good-bg:#eaf5ee;--radius:14px;--shadow:0 1px 2px rgba(26,43,60,.06),0 6px 24px rgba(26,43,60,.06);font-family:'Inter',system-ui,sans-serif;color:var(--ink);font-size:16px;line-height:1.55;box-sizing:border-box}
#mbb-cards *{box-sizing:border-box}
#mbb-cards a{color:var(--accent);text-decoration:none}
#mbb-cards button,#mbb-cards input,#mbb-cards select{font:inherit}
#mbb-cards .mbbc-wrap{max-width:1180px;margin:0 auto;padding:0 4px}
#mbb-cards .mbbc-controls{padding:4px 0 14px;border-bottom:1px solid var(--line);margin-bottom:24px}
#mbb-cards .mbbc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
#mbb-cards .mbbc-row2,#mbb-cards .mbbc-row3{margin-top:10px}
#mbb-cards .mbbc-search{flex:1 1 260px;position:relative}
#mbb-cards .mbbc-search input{width:100%;padding:11px 13px 11px 38px;border:1px solid var(--line);border-radius:10px;font-size:15px;background:#fff;color:var(--ink)}
#mbb-cards .mbbc-search input:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}
#mbb-cards .mbbc-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);opacity:.5;pointer-events:none}
#mbb-cards select{appearance:none;-webkit-appearance:none;padding:10px 34px 10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:14px;color:var(--ink);cursor:pointer;min-height:42px}
#mbb-cards select:focus{outline:2px solid var(--accent);outline-offset:1px}
#mbb-cards .mbbc-toggle{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:500;cursor:pointer;user-select:none;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;min-height:42px}
#mbb-cards .mbbc-toggle input{accent-color:var(--accent);width:16px;height:16px;cursor:pointer}
#mbb-cards .mbbc-mobile-actions{display:none}
#mbb-cards .mbbc-filter-btn,#mbb-cards .mbbc-icon-btn,#mbb-cards .mbbc-apply{border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);font-weight:700;min-height:46px;cursor:pointer}
#mbb-cards .mbbc-filter-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:var(--shadow)}
#mbb-cards .mbbc-icon-btn{width:54px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow)}
#mbb-cards .mbbc-meta{display:flex;justify-content:space-between;align-items:center;margin-top:11px;font-size:13px;color:var(--muted);gap:12px}
#mbb-cards .mbbc-meta b{color:var(--ink);font-weight:700}
#mbb-cards .mbbc-mobile-sort{display:none;align-items:center;gap:6px;white-space:nowrap}
#mbb-cards .mbbc-mobile-sort select{border:0;background:transparent;padding:0 18px 0 0;min-height:0;font-size:12.5px;color:var(--ink)}
#mbb-cards .mbbc-clear{background:none;border:none;color:var(--accent);font-size:13px;cursor:pointer;font-weight:600;padding:0}
#mbb-cards .mbbc-clear:hover{text-decoration:underline}
#mbb-cards .mbbc-chipbar{display:none;gap:7px;flex-wrap:wrap;margin-top:10px}
#mbb-cards .mbbc-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #d7e5ef;background:#eef6fb;color:var(--accent);border-radius:999px;padding:5px 9px;font-size:12px;font-weight:700}
#mbb-cards .mbbc-chip button{border:0;background:transparent;color:inherit;cursor:pointer;padding:0;font-size:14px;line-height:1}
#mbb-cards .mbbc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;padding-bottom:10px}
#mbb-cards .mbbc-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;display:flex;flex-direction:column;transition:transform .15s,box-shadow .15s}
#mbb-cards .mbbc-card:hover{transform:translateY(-3px);box-shadow:0 4px 10px rgba(26,43,60,.08),0 14px 40px rgba(26,43,60,.12)}
#mbb-cards .mbbc-top{display:flex;gap:14px;align-items:flex-start}
#mbb-cards .mbbc-art{flex:0 0 96px;height:62px;border-radius:8px;overflow:hidden;background:linear-gradient(135deg,#dfe7ee,#c7d4de);display:flex;align-items:center;justify-content:center;color:#8294a3;font-size:10px;font-weight:700;letter-spacing:.05em;text-align:center;padding:4px}
#mbb-cards .mbbc-art img{width:100%;height:100%;object-fit:contain}
#mbb-cards .mbbc-head{flex:1;min-width:0}
#mbb-cards .mbbc-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:7px}
#mbb-cards .mbbc-badge{font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:999px;box-shadow:0 1px 3px rgba(26,43,60,.18)}
#mbb-cards .mbbc-badge.high,#mbb-cards .mbbc-badge.elev{background:#F5A623;color:#3a2600}
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
#mbb-cards .mbbc-acc-sum{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;list-style:none;padding:13px 0 12px;font-size:14px;font-weight:700;color:var(--ink)}
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
#mbb-cards .mbbc-ltype{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;padding:5px 11px;border-radius:999px;margin:0 0 12px}
#mbb-cards .mbbc-ltype:before{content:"";width:7px;height:7px;border-radius:50%}
#mbb-cards .mbbc-ltype.aff{background:#eaf1f7;color:#0E6BA8}#mbb-cards .mbbc-ltype.aff:before{background:#0E6BA8}
#mbb-cards .mbbc-ltype.ref{background:#f4eefb;color:#6b3fa0}#mbb-cards .mbbc-ltype.ref:before{background:#6b3fa0}
#mbb-cards .mbbc-ltype.pub{background:var(--good-bg);color:var(--good)}#mbb-cards .mbbc-ltype.pub:before{background:var(--good)}
#mbb-cards .mbbc-cta-row{display:flex;align-items:center;gap:14px}
#mbb-cards .mbbc-cta{flex:1;text-align:center;background:var(--accent);color:#fff;font-weight:700;font-size:15px;padding:12px 16px;border-radius:10px;transition:background .15s}
#mbb-cards .mbbc-cta:hover{background:#0a5688}
#mbb-cards .mbbc-review{font-size:13.5px;font-weight:700;white-space:nowrap}
#mbb-cards .mbbc-review:hover{text-decoration:underline}
#mbb-cards .mbbc-empty,#mbb-cards .mbbc-state{grid-column:1/-1;text-align:center;padding:50px 20px;color:var(--muted)}
#mbb-cards .mbbc-empty b{display:block;font-family:'Fraunces',Georgia,serif;font-size:20px;color:var(--ink);margin-bottom:6px}
#mbb-cards .mbbc-panel-head,#mbb-cards .mbbc-apply,#mbb-cards .mbbc-panel-backdrop{display:none}

@media(max-width:680px){
  #mbb-cards{font-size:15px;line-height:1.45}
  #mbb-cards .mbbc-wrap{padding:0}
  #mbb-cards .mbbc-controls{padding:0 0 14px;margin-bottom:18px;border-bottom:0}
  #mbb-cards .mbbc-row1{margin-bottom:12px}
  #mbb-cards .mbbc-search{flex:1 1 100%}
  #mbb-cards .mbbc-search input{min-height:46px;border-radius:13px;font-size:14px}
  #mbb-cards .mbbc-mobile-actions{display:flex;gap:10px;margin-bottom:12px}
  #mbb-cards .mbbc-row2,#mbb-cards .mbbc-row3{display:none}
  #mbb-cards .mbbc-meta{margin-top:0;font-size:12.5px}
  #mbb-cards .mbbc-meta .mbbc-clear{display:none}
  #mbb-cards .mbbc-mobile-sort{display:inline-flex}
  #mbb-cards .mbbc-chipbar.has-chips{display:flex}
  #mbb-cards .mbbc-grid{grid-template-columns:1fr;gap:14px;padding-bottom:0}
  #mbb-cards .mbbc-card{padding:16px 14px;border-radius:16px;box-shadow:0 1px 2px rgba(26,43,60,.06),0 8px 20px rgba(26,43,60,.07)}
  #mbb-cards .mbbc-card:hover{transform:none;box-shadow:0 1px 2px rgba(26,43,60,.06),0 8px 20px rgba(26,43,60,.07)}
  #mbb-cards .mbbc-top{gap:12px}
  #mbb-cards .mbbc-art{flex-basis:92px;height:58px;border-radius:9px}
  #mbb-cards .mbbc-name{font-size:17px}
  #mbb-cards .mbbc-fee{font-size:11.5px;line-height:1.35}
  #mbb-cards .mbbc-badges{margin-bottom:5px}
  #mbb-cards .mbbc-badge{font-size:9.5px;padding:3px 8px}
  #mbb-cards .mbbc-offer{margin-top:14px;padding-top:14px}
  #mbb-cards .mbbc-lab{font-size:10px}
  #mbb-cards .mbbc-pts{font-size:20px}
  #mbb-cards .mbbc-req{font-size:12px}
  #mbb-cards .mbbc-vchip{font-size:15px;margin-left:6px}
  #mbb-cards .mbbc-acc-sum{padding:11px 0;font-size:13.5px}
  #mbb-cards .mbbc-acc-body{font-size:13px;padding-bottom:12px}
  #mbb-cards .mbbc-foot{padding-top:14px}
  #mbb-cards .mbbc-ltype{font-size:10.5px;margin-bottom:10px}
  #mbb-cards .mbbc-cta-row{gap:12px}
  #mbb-cards .mbbc-cta{padding:11px 14px;font-size:14px;border-radius:10px}
  #mbb-cards .mbbc-review{font-size:12.5px}

  #mbb-cards .mbbc-panel-backdrop{position:fixed;inset:0;background:rgba(20,34,47,.38);z-index:999998}
  #mbb-cards .mbbc-panel{position:fixed;inset:0;background:#fff;z-index:999999;padding:16px;transform:translateX(105%);transition:transform .2s ease;overflow:auto;display:block}
  #mbb-cards.mbbc-panel-open .mbbc-panel{transform:translateX(0)}
  #mbb-cards.mbbc-panel-open .mbbc-panel-backdrop{display:block}
  #mbb-cards .mbbc-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line)}
  #mbb-cards .mbbc-panel-title{font-weight:800;font-size:18px}
  #mbb-cards .mbbc-close{border:0;background:transparent;font-size:28px;line-height:1;color:var(--ink);cursor:pointer;padding:2px 4px}
  #mbb-cards .mbbc-panel .mbbc-row2,#mbb-cards .mbbc-panel .mbbc-row3{display:flex;flex-direction:column;align-items:stretch;margin-top:0;gap:12px}
  #mbb-cards .mbbc-panel select,#mbb-cards .mbbc-panel .mbbc-toggle{width:100%;min-height:48px;border-radius:12px;font-size:15px}
  #mbb-cards .mbbc-panel .mbbc-toggle{justify-content:flex-start}
  #mbb-cards .mbbc-panel-label{display:block;font-size:12px;font-weight:800;color:var(--muted);margin:6px 0 -6px;text-transform:uppercase;letter-spacing:.04em}
  #mbb-cards .mbbc-apply{display:block;width:100%;margin-top:16px;background:var(--accent);border-color:var(--accent);color:#fff;border-radius:12px;font-weight:800}
  body.mbbc-lock{overflow:hidden}
}
`;

  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  mount.innerHTML = `
    <div class="mbbc-wrap">
      <div class="mbbc-controls">
        <div class="mbbc-row mbbc-row1">
          <label class="mbbc-search" aria-label="Search cards">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
            <input id="mbbc-q" type="search" placeholder="Search cards (e.g. Sapphire, Hyatt, Amex...)" autocomplete="off">
          </label>
        </div>

        <div class="mbbc-mobile-actions">
          <button class="mbbc-filter-btn" id="mbbc-open-filters" type="button">Filter <span id="mbbc-filter-count">0</span></button>
          <button class="mbbc-icon-btn" id="mbbc-focus-search" type="button" aria-label="Search">⌕</button>
        </div>

        <div class="mbbc-row mbbc-row2" id="mbbc-filter-row-a">
          <select id="mbbc-sort" aria-label="Sort cards">
            <option value="rec">Sort: Recommended</option>
            <option value="wo">Welcome offer: High → Low</option>
            <option value="val">My value: High → Low</option>
            <option value="feelo">Annual fee: Low → High</option>
            <option value="feehi">Annual fee: High → Low</option>
          </select>
          <select id="mbbc-issuer" aria-label="Issuer"><option value="">All issuers</option></select>
          <select id="mbbc-type" aria-label="Card type"><option value="">All types</option><option>Personal</option><option>Business</option></select>
          <select id="mbbc-fee" aria-label="Annual fee"><option value="">Any annual fee</option><option value="0">$0</option><option value="u100">Under $100</option><option value="100-300">$100–$300</option><option value="300">$300+</option></select>
          <select id="mbbc-wo" aria-label="Welcome offer"><option value="">Welcome offer: any</option><option value="50000">50,000+ points</option><option value="75000">75,000+ points</option><option value="100000">100,000+ points</option><option value="150000">150,000+ points</option></select>
          <select id="mbbc-spend" aria-label="Spend requirement"><option value="">Spend requirement: any</option><option value="1000">≤ $1,000</option><option value="3000">≤ $3,000</option><option value="5000">≤ $5,000</option><option value="8000">≤ $8,000</option></select>
        </div>
        <div class="mbbc-row mbbc-row3" id="mbbc-filter-row-b">
          <label class="mbbc-toggle"><input id="mbbc-transfer" type="checkbox"> Transferable points only</label>
          <label class="mbbc-toggle"><input id="mbbc-elev" type="checkbox"> Elevated offers only</label>
        </div>

        <div class="mbbc-panel-backdrop" id="mbbc-filter-backdrop"></div>
        <div class="mbbc-panel" id="mbbc-filter-panel" aria-hidden="true">
          <div class="mbbc-panel-head"><div class="mbbc-panel-title">Filters</div><button class="mbbc-close" id="mbbc-close-filters" type="button" aria-label="Close filters">×</button></div>
          <span class="mbbc-panel-label">Sort</span><div class="mbbc-row mbbc-row2" id="mbbc-mobile-row-a"></div>
          <span class="mbbc-panel-label">Refine</span><div class="mbbc-row mbbc-row3" id="mbbc-mobile-row-b"></div>
          <button class="mbbc-apply" id="mbbc-apply-filters" type="button">Apply filters</button>
        </div>

        <div class="mbbc-chipbar" id="mbbc-chipbar"></div>
        <div class="mbbc-meta">
          <span><b id="mbbc-count">0</b> cards</span>
          <span class="mbbc-mobile-sort">Sort: <select id="mbbc-sort-mobile" aria-label="Mobile sort"><option value="rec">Recommended</option><option value="wo">Offer</option><option value="val">Value</option><option value="feelo">Fee ↑</option><option value="feehi">Fee ↓</option></select></span>
          <button class="mbbc-clear" id="mbbc-reset" type="button">Reset filters</button>
        </div>
      </div>
      <div class="mbbc-grid" id="mbbc-grid"><div class="mbbc-state">Loading cards…</div></div>
    </div>`;

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>\"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c];}); }
  function money(n){ return "$" + Number(n).toLocaleString("en-US"); }
  function num(s){ var m=String(s == null ? "" : s).replace(/,/g,"").match(/\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; }
  function lc(s){ return String(s == null ? "" : s).trim().toLowerCase(); }
  function initials(n){ return String(n || "").split(/\s+/).slice(0,2).join(" ").toUpperCase(); }
  function isElevated(c){ var s=lc(c.welcome_offer_status); return s === "elevated" || s === "all-time high"; }
  function optText(sel){ return sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent : ""; }

  function cardHTML(c){
    var status = lc(c.welcome_offer_status), badges = "";
    if(status === "all-time high") badges += '<span class="mbbc-badge high">All-time high offer</span>';
    else if(status === "elevated") badges += '<span class="mbbc-badge elev">Elevated offer</span>';

    var art = c.card_image_url ? '<img src="'+esc(c.card_image_url)+'" alt="Image of '+esc(c.card_name)+'" loading="lazy">' : esc(initials(c.card_name));
    var chev = '<span class="mbbc-chev">⌄</span>';
    var pts = num(c.welcome_offer), cpp = parseFloat(c.cpp), valueBlock = "";
    if(pts != null && !isNaN(cpp)){
      var val = Math.round(pts * cpp / 100);
      var vbody = "What I think the " + esc(c.welcome_offer || "welcome bonus") + " is realistically worth, valued at a conservative " + esc(String(cpp)) + "¢ per point.<br>I value points by what you’ll actually get — not a best-case redemption.";
      valueBlock = '<details class="mbbc-acc mbbc-acc-value"><summary class="mbbc-acc-sum"><span>My value <span class="mbbc-vchip">≈ '+esc(money(val))+'</span></span>'+chev+'</summary><div class="mbbc-acc-body">'+vbody+'</div></details>';
    }
    var takeBlock = c.advait_quick_take ? '<details class="mbbc-acc"><summary class="mbbc-acc-sum"><span class="mbbc-acc-lab take">✦ My take</span>'+chev+'</summary><div class="mbbc-acc-body">'+esc(c.advait_quick_take)+'</div></details>' : "";
    var bens = String(c.highlighted_features || "").split("|").map(function(b){ return b.trim(); }).filter(Boolean);
    var hiBlock = bens.length ? '<details class="mbbc-acc"><summary class="mbbc-acc-sum"><span>Card highlights</span>'+chev+'</summary><div class="mbbc-acc-body"><ul class="mbbc-bens">'+bens.map(function(b){return '<li>'+esc(b)+'</li>';}).join("")+'</ul></div></details>' : "";
    var lt = LINK_PILLS[lc(c.link_type)];
    var ltypeHTML = lt ? '<div class="mbbc-ltype '+lt.cls+'">'+lt.label+'</div>' : "";
    var relAttr = (lt && lt.cls === "pub") ? "nofollow noopener" : "sponsored nofollow noopener";
    var offerUrl = getOfferUrl(c);
    var reviewUrl = getReviewUrl(c);
    var review = reviewUrl ? '<a class="mbbc-review" href="'+esc(reviewUrl)+'">Full review</a>' : "";
    var offer = offerUrl ? '<a class="mbbc-cta" href="'+esc(offerUrl)+'" target="_blank" rel="'+relAttr+'">View offer →</a>' : '<span class="mbbc-cta" aria-disabled="true">Offer unavailable</span>';

    return '<article class="mbbc-card">'
      + '<div class="mbbc-top"><div class="mbbc-art">'+art+'</div><div class="mbbc-head">'
      + (badges ? '<div class="mbbc-badges">'+badges+'</div>' : '')
      + '<h3 class="mbbc-name">'+esc(c.card_name)+'</h3>'
      + '<div class="mbbc-fee">'+esc(c.annual_fee || "")+' annual fee <span class="dot">•</span> '+esc(c.card_type || "")+'</div>'
      + '</div></div>'
      + '<div class="mbbc-offer"><div class="mbbc-lab">Welcome offer</div><div class="mbbc-pts">'+esc(c.welcome_offer || "")+'</div><div class="mbbc-req">'+esc(c.bonus_condition || "")+'</div></div>'
      + valueBlock + takeBlock + hiBlock
      + '<div class="mbbc-foot">'+ltypeHTML+'<div class="mbbc-cta-row">'+offer+review+'</div></div>'
      + '</article>';
  }

  var CARDS = [], el = {};

  function feeMatch(f,v){
    if(!v) return true;
    if(f == null) return false;
    if(v === "0") return f === 0;
    if(v === "u100") return f > 0 && f < 100;
    if(v === "100-300") return f >= 100 && f <= 300;
    if(v === "300") return f > 300;
    return true;
  }

  function activeFilterCount(){
    var n = 0;
    if(el.issuer.value) n++;
    if(el.type.value) n++;
    if(el.fee.value) n++;
    if(el.wo.value) n++;
    if(el.spend.value) n++;
    if(el.transfer.checked) n++;
    if(el.elev.checked) n++;
    return n;
  }

  function chip(label, clearFn){
    var id = "mbbc-chip-" + Math.random().toString(36).slice(2);
    setTimeout(function(){
      var b = document.getElementById(id);
      if(b) b.addEventListener("click", function(){ clearFn(); render(); });
    }, 0);
    return '<span class="mbbc-chip">'+esc(label)+' <button id="'+id+'" type="button" aria-label="Remove '+esc(label)+'">×</button></span>';
  }

  function renderChips(){
    var chips = [];
    if(el.issuer.value) chips.push(chip(el.issuer.value, function(){ el.issuer.value = ""; }));
    if(el.type.value) chips.push(chip(el.type.value, function(){ el.type.value = ""; }));
    if(el.fee.value) chips.push(chip(optText(el.fee), function(){ el.fee.value = ""; }));
    if(el.wo.value) chips.push(chip(optText(el.wo), function(){ el.wo.value = ""; }));
    if(el.spend.value) chips.push(chip(optText(el.spend), function(){ el.spend.value = ""; }));
    if(el.transfer.checked) chips.push(chip("Transferable", function(){ el.transfer.checked = false; }));
    if(el.elev.checked) chips.push(chip("Elevated", function(){ el.elev.checked = false; }));
    el.chipbar.innerHTML = chips.join("");
    el.chipbar.classList.toggle("has-chips", chips.length > 0);
    el.filterCount.textContent = "(" + chips.length + ")";
  }

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
    function val(c){ var p=num(c.welcome_offer), k=parseFloat(c.cpp); return (p != null && !isNaN(k)) ? p*k/100 : 0; }
    if(srt === "wo") list.sort(function(a,b){return (num(b.welcome_offer)||0)-(num(a.welcome_offer)||0);});
    else if(srt === "val") list.sort(function(a,b){return val(b)-val(a);});
    else if(srt === "feelo") list.sort(function(a,b){return (num(a.annual_fee)||0)-(num(b.annual_fee)||0);});
    else if(srt === "feehi") list.sort(function(a,b){return (num(b.annual_fee)||0)-(num(a.annual_fee)||0);});
    else list.sort(function(a,b){return (num(a.sort_order)||999)-(num(b.sort_order)||999);});

    el.sortMobile.value = el.sort.value;
    el.count.textContent = list.length;
    el.grid.innerHTML = list.length ? list.map(cardHTML).join("") : '<div class="mbbc-empty"><b>No cards match those filters</b>Try widening the fee range or clearing your search.</div>';
    renderChips();
  }

  function buildIssuerOptions(){
    var seen = {};
    CARDS.forEach(function(c){ if(c.card_issuer) seen[c.card_issuer] = true; });
    Object.keys(seen).sort().forEach(function(n){ var o=document.createElement("option"); o.value=n; o.textContent=n; el.issuer.appendChild(o); });
  }

  function openPanel(){ mount.classList.add("mbbc-panel-open"); document.body.classList.add("mbbc-lock"); el.panel.setAttribute("aria-hidden", "false"); }
  function closePanel(){ mount.classList.remove("mbbc-panel-open"); document.body.classList.remove("mbbc-lock"); el.panel.setAttribute("aria-hidden", "true"); }

  function resetAll(){
    el.q.value = ""; el.issuer.value = ""; el.type.value = ""; el.fee.value = ""; el.wo.value = ""; el.spend.value = "";
    el.transfer.checked = false; el.elev.checked = false; el.sort.value = "rec"; el.sortMobile.value = "rec";
    render();
  }

  function wire(){
    el.q=mount.querySelector("#mbbc-q");
    el.issuer=mount.querySelector("#mbbc-issuer");
    el.type=mount.querySelector("#mbbc-type");
    el.fee=mount.querySelector("#mbbc-fee");
    el.wo=mount.querySelector("#mbbc-wo");
    el.spend=mount.querySelector("#mbbc-spend");
    el.transfer=mount.querySelector("#mbbc-transfer");
    el.elev=mount.querySelector("#mbbc-elev");
    el.sort=mount.querySelector("#mbbc-sort");
    el.sortMobile=mount.querySelector("#mbbc-sort-mobile");
    el.count=mount.querySelector("#mbbc-count");
    el.grid=mount.querySelector("#mbbc-grid");
    el.reset=mount.querySelector("#mbbc-reset");
    el.chipbar=mount.querySelector("#mbbc-chipbar");
    el.filterCount=mount.querySelector("#mbbc-filter-count");
    el.panel=mount.querySelector("#mbbc-filter-panel");

    [el.issuer,el.type,el.fee,el.wo,el.spend,el.transfer,el.elev,el.sort].forEach(function(x){ x.addEventListener("change", render); });
    el.q.addEventListener("input", render);
    el.sortMobile.addEventListener("change", function(){ el.sort.value = el.sortMobile.value; render(); });
    el.reset.addEventListener("click", resetAll);
    mount.querySelector("#mbbc-open-filters").addEventListener("click", openPanel);
    mount.querySelector("#mbbc-close-filters").addEventListener("click", closePanel);
    mount.querySelector("#mbbc-filter-backdrop").addEventListener("click", closePanel);
    mount.querySelector("#mbbc-apply-filters").addEventListener("click", function(){ closePanel(); render(); });
    mount.querySelector("#mbbc-focus-search").addEventListener("click", function(){ el.q.focus(); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closePanel(); });
  }

  fetch(DATA_URL)
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(data){
      var obj = (data && data.cards) ? data.cards : {};
      CARDS = Object.keys(obj).map(function(k){ return obj[k]; }).filter(function(c){ return lc(c.show_on_card_page) === "yes"; });
      wire();
      buildIssuerOptions();
      render();
    })
    .catch(function(){
      var g = mount.querySelector("#mbbc-grid");
      if(g) g.innerHTML = '<div class="mbbc-state">Couldn’t load cards right now. Please refresh in a moment.</div>';
    });
})();


  (function injectMobileFontPatch() {
    var patch = document.createElement("style");
    patch.textContent = `
/* MBB MOBILE FONT SIZE PATCH V4 */

    @media (max-width: 640px) {
      #mbb-cards {
        font-size: 70% !important;
      }

      #mbb-cards .mbb-shell,
      #mbb-cards .mbb-card,
      #mbb-cards .mbb-filters,
      #mbb-cards .mbb-mobile-filter-panel {
        font-size: 1em !important;
      }

      #mbb-cards h1,
      #mbb-cards h2,
      #mbb-cards h3,
      #mbb-cards .mbb-card-title {
        font-size: 1.35rem !important;
        line-height: 1.15 !important;
      }

      #mbb-cards .mbb-offer-value,
      #mbb-cards .mbb-points,
      #mbb-cards .mbb-welcome-points {
        font-size: 1.55rem !important;
        line-height: 1.05 !important;
      }

      #mbb-cards .mbb-card-meta,
      #mbb-cards .mbb-muted,
      #mbb-cards .mbb-subtext,
      #mbb-cards .mbb-spend {
        font-size: 0.95rem !important;
      }

      #mbb-cards input,
      #mbb-cards select,
      #mbb-cards button,
      #mbb-cards .mbb-btn,
      #mbb-cards .mbb-chip {
        font-size: 1rem !important;
      }

      #mbb-cards .mbb-card {
        padding: 18px !important;
      }

      #mbb-cards .mbb-card-top {
        gap: 14px !important;
      }

      #mbb-cards .mbb-card-image,
      #mbb-cards .mbb-card-img {
        max-width: 116px !important;
      }

      #mbb-cards .mbb-primary-btn,
      #mbb-cards .mbb-apply-btn {
        min-height: 44px !important;
      }
    }
`;
    document.head.appendChild(patch);
  })();


  (function injectMobileV5Patch() {
    var patch = document.createElement("style");
    patch.textContent = `
/* MBB MOBILE SIZE + LINK PATCH V5 */
@media (max-width: 640px) {
  #mbb-cards {
    --mobile-scale-note: "v5";
  }

  #mbb-cards .mbbc-wrap {
    padding: 14px 8px 28px !important;
  }

  #mbb-cards .mbbc-tools {
    gap: 8px !important;
    margin-bottom: 12px !important;
  }

  #mbb-cards .mbbc-search {
    height: 42px !important;
    font-size: 14px !important;
    padding: 0 14px 0 40px !important;
    border-radius: 12px !important;
  }

  #mbb-cards .mbbc-filter-btn,
  #mbb-cards .mbbc-icon-btn,
  #mbb-cards .mbbc-sort,
  #mbb-cards select {
    min-height: 38px !important;
    height: 38px !important;
    font-size: 13px !important;
    border-radius: 12px !important;
  }

  #mbb-cards .mbbc-resultsbar {
    font-size: 12px !important;
    margin: 10px 0 12px !important;
  }

  #mbb-cards .mbbc-chip {
    font-size: 11px !important;
    padding: 5px 8px !important;
  }

  #mbb-cards .mbbc-grid {
    gap: 14px !important;
  }

  #mbb-cards .mbbc-card {
    padding: 14px !important;
    border-radius: 16px !important;
  }

  #mbb-cards .mbbc-top {
    gap: 10px !important;
    align-items: flex-start !important;
  }

  #mbb-cards .mbbc-art {
    flex: 0 0 78px !important;
    width: 78px !important;
    height: 50px !important;
    border-radius: 8px !important;
  }

  #mbb-cards .mbbc-name {
    font-size: 15px !important;
    line-height: 1.17 !important;
  }

  #mbb-cards .mbbc-fee {
    font-size: 10.5px !important;
    line-height: 1.3 !important;
    margin-top: 3px !important;
  }

  #mbb-cards .mbbc-badges {
    margin-bottom: 4px !important;
  }

  #mbb-cards .mbbc-badge {
    font-size: 8.5px !important;
    padding: 3px 7px !important;
  }

  #mbb-cards .mbbc-offer {
    margin-top: 11px !important;
    padding-top: 11px !important;
  }

  #mbb-cards .mbbc-lab {
    font-size: 8.5px !important;
    letter-spacing: .075em !important;
  }

  #mbb-cards .mbbc-pts {
    font-size: 17px !important;
    line-height: 1.1 !important;
  }

  #mbb-cards .mbbc-req {
    font-size: 10.5px !important;
    line-height: 1.25 !important;
  }

  #mbb-cards .mbbc-value {
    font-size: 13px !important;
    padding: 10px 0 !important;
  }

  #mbb-cards .mbbc-vchip {
    font-size: 13px !important;
    margin-left: 4px !important;
  }

  #mbb-cards .mbbc-acc-sum {
    padding: 9px 0 !important;
    font-size: 12px !important;
  }

  #mbb-cards .mbbc-acc-body {
    font-size: 11.5px !important;
    line-height: 1.45 !important;
    padding-bottom: 10px !important;
  }

  #mbb-cards .mbbc-foot {
    padding-top: 11px !important;
  }

  #mbb-cards .mbbc-ltype {
    font-size: 9.5px !important;
    padding: 5px 9px !important;
    margin-bottom: 9px !important;
  }

  #mbb-cards .mbbc-cta-row {
    gap: 9px !important;
  }

  #mbb-cards .mbbc-cta {
    min-height: 42px !important;
    padding: 10px 16px !important;
    font-size: 14px !important;
    border-radius: 11px !important;
  }

  #mbb-cards .mbbc-review {
    font-size: 12px !important;
  }

  #mbb-cards .mbbc-drawer {
    font-size: 13px !important;
  }

  #mbb-cards .mbbc-drawer h3 {
    font-size: 16px !important;
  }

  #mbb-cards .mbbc-drawer label {
    font-size: 11px !important;
  }

  #mbb-cards .mbbc-apply {
    min-height: 42px !important;
    font-size: 14px !important;
  }
}
`;
    document.head.appendChild(patch);
  })();
