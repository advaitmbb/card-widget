/* ============================================================
   Miles Beyond Borders — Card Page Widget
   Showit embed:
   <div id="mbb-cards"></div>
   <script src="https://advaitmbb.github.io/card-widget/cards.js?v=17"></script>

   v8:
   - Mobile-first card layout
   - Compact mobile filter pill
   - Top-opening mobile filter sheet
   - Smooth accordion animation
   - Offer buttons read affiliate_link from cards.json
   ============================================================ */
(function () {
  "use strict";

  function bootMbbCardsWidget() {
  var VERSION = "17";
  var DATA_URL = "https://advaitmbb.github.io/card-widget/cards.json?v=" + VERSION;

  var LINK_PILLS = {
    affiliate: { label: "Affiliate link", cls: "aff" },
    referral: { label: "Referral link", cls: "ref" },
    public: { label: "Public offer · no commission", cls: "pub" }
  };

  var pageMount = document.getElementById("mbb-cards");
  var singleMounts = Array.prototype.slice.call(document.querySelectorAll("[data-mbb-card]"));
  if (!pageMount && !singleMounts.length) return;

  var mount = pageMount || document.createElement("div");

  if (!document.getElementById("mbbc-fonts")) {
    var fl = document.createElement("link");
    fl.id = "mbbc-fonts";
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(fl);
  }

  var CSS = `
#mbb-cards{
  --cream:#FAF6EE;
  --navy:#17283A;
  --accent:#0B72B5;
  --accent-dark:#075F98;
  --ink:#17283A;
  --muted:#647383;
  --soft:#F7F2EA;
  --line:#E6DDCF;
  --card:#FFFFFF;
  --good:#1F7A4D;
  --good-bg:#EAF6EF;
  --blue-bg:#EEF7FC;
  --shadow:0 8px 28px rgba(23,40,58,.08);
  --shadow-soft:0 2px 10px rgba(23,40,58,.06);
  font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  color:var(--ink);
  font-size:16px;
  line-height:1.45;
  box-sizing:border-box;
}
#mbb-cards *{box-sizing:border-box}
#mbb-cards a{color:var(--accent);text-decoration:none}
#mbb-cards button,#mbb-cards input,#mbb-cards select{font:inherit}
#mbb-cards .mbbc-wrap{max-width:1180px;margin:0 auto;padding:0 4px}
#mbb-cards .mbbc-controls{padding:4px 0 18px;border-bottom:1px solid var(--line);margin-bottom:24px}
#mbb-cards .mbbc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
#mbb-cards .mbbc-row2,#mbb-cards .mbbc-row3{margin-top:10px}
#mbb-cards .mbbc-search{flex:1 1 260px;position:relative}
#mbb-cards .mbbc-search input{
  width:100%;
  min-height:46px;
  padding:11px 14px 11px 40px;
  border:1px solid var(--line);
  border-radius:14px;
  background:#fff;
  color:var(--ink);
  font-size:15px;
  box-shadow:var(--shadow-soft);
}
#mbb-cards .mbbc-search input:focus{outline:2px solid rgba(11,114,181,.22);border-color:var(--accent)}
#mbb-cards .mbbc-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);opacity:.55;pointer-events:none}
#mbb-cards select{
  appearance:none;
  -webkit-appearance:none;
  min-height:44px;
  padding:10px 38px 10px 14px;
  border:1px solid var(--line);
  border-radius:14px;
  background:#fff;
  color:var(--ink);
  font-size:14px;
  font-weight:600;
  cursor:pointer;
  box-shadow:var(--shadow-soft);
  background-image:linear-gradient(45deg,transparent 50%,#6B7886 50%),linear-gradient(135deg,#6B7886 50%,transparent 50%);
  background-position:calc(100% - 18px) 19px,calc(100% - 13px) 19px;
  background-size:5px 5px,5px 5px;
  background-repeat:no-repeat;
}
#mbb-cards select:focus{outline:2px solid rgba(11,114,181,.22);border-color:var(--accent)}
#mbb-cards .mbbc-toggle{
  display:inline-flex;
  align-items:center;
  gap:9px;
  min-height:44px;
  padding:10px 14px;
  border:1px solid var(--line);
  border-radius:14px;
  background:#fff;
  color:var(--ink);
  font-size:14px;
  font-weight:700;
  cursor:pointer;
  user-select:none;
  box-shadow:var(--shadow-soft);
}
#mbb-cards .mbbc-toggle input{accent-color:var(--accent);width:17px;height:17px;cursor:pointer}
#mbb-cards .mbbc-mobile-actions{display:none}
#mbb-cards .mbbc-filter-btn,#mbb-cards .mbbc-icon-btn,#mbb-cards .mbbc-apply{
  border:1px solid var(--line);
  border-radius:14px;
  background:#fff;
  color:var(--ink);
  font-weight:800;
  cursor:pointer;
  min-height:46px;
}
#mbb-cards .mbbc-filter-btn{display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:var(--shadow-soft)}
#mbb-cards .mbbc-filter-btn:before{content:"";width:15px;height:15px;background:currentColor;display:inline-block;clip-path:polygon(7% 14%,93% 14%,62% 50%,62% 86%,38% 86%,38% 50%)}
#mbb-cards .mbbc-icon-btn{width:52px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-soft)}
#mbb-cards .mbbc-meta{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:13px;color:var(--muted);gap:12px}
#mbb-cards .mbbc-meta b{color:var(--ink);font-weight:800}
#mbb-cards .mbbc-mobile-sort{display:none;align-items:center;gap:6px;white-space:nowrap}
#mbb-cards .mbbc-mobile-sort select{border:0;background:transparent;box-shadow:none;padding:0 18px 0 0;min-height:0;font-size:12px;color:var(--ink);font-weight:700}
#mbb-cards .mbbc-clear{background:none;border:0;color:var(--accent);font-size:13px;cursor:pointer;font-weight:800;padding:0}
#mbb-cards .mbbc-clear:hover{text-decoration:underline}
#mbb-cards .mbbc-chipbar{display:none;gap:7px;flex-wrap:wrap;margin-top:10px}
#mbb-cards .mbbc-chip{
  display:inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid #D6E8F4;
  background:var(--blue-bg);
  color:var(--accent-dark);
  border-radius:999px;
  padding:6px 10px;
  font-size:12px;
  font-weight:800;
}
#mbb-cards .mbbc-chip button{border:0;background:transparent;color:inherit;cursor:pointer;padding:0;font-size:15px;line-height:1}

#mbb-cards .mbbc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;padding-bottom:10px}
#mbb-cards .mbbc-card{
  background:var(--card);
  border:1px solid var(--line);
  border-radius:18px;
  box-shadow:var(--shadow);
  padding:20px;
  display:flex;
  flex-direction:column;
  transition:transform .16s ease,box-shadow .16s ease;
}
#mbb-cards .mbbc-card:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(23,40,58,.12)}
#mbb-cards .mbbc-top{display:flex;gap:14px;align-items:flex-start}
#mbb-cards .mbbc-art{
  flex:0 0 96px;
  height:62px;
  border-radius:12px;
  overflow:hidden;
  background:linear-gradient(135deg,#E8EEF3,#CAD8E2);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#8294a3;
  font-size:10px;
  font-weight:800;
  letter-spacing:.05em;
  text-align:center;
  padding:4px;
}
#mbb-cards .mbbc-art img{width:100%;height:100%;object-fit:contain}
#mbb-cards .mbbc-head{flex:1;min-width:0}
#mbb-cards .mbbc-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:7px}
#mbb-cards .mbbc-badge{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:4px 9px;border-radius:999px}
#mbb-cards .mbbc-badge.high,#mbb-cards .mbbc-badge.elev{background:#FFE9BC;color:#654000}
#mbb-cards .mbbc-badge.end{background:#E23B3B;color:#fff}
#mbb-cards .mbbc-name{
  font-family:'Fraunces',Georgia,serif;
  font-weight:650;
  font-size:19px;
  line-height:1.15;
  margin:0;
  color:var(--navy);
}
#mbb-cards .mbbc-fee{font-size:12.5px;color:var(--muted);margin-top:5px}
#mbb-cards .mbbc-fee .dot{margin:0 6px;opacity:.5}
#mbb-cards .mbbc-offer{margin:16px 0 0;padding-top:15px;padding-bottom:5px;border-top:1px solid var(--line)}
#mbb-cards .mbbc-lab{font-size:10px;font-weight:850;letter-spacing:.085em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
#mbb-cards .mbbc-pts{font-family:'Fraunces',Georgia,serif;font-weight:650;font-size:22px;line-height:1.1;color:var(--navy)}
#mbb-cards .mbbc-req{font-size:12.5px;color:var(--muted);margin-top:3px;margin-bottom:7px}
#mbb-cards .mbbc-vchip{font-family:'Fraunces',Georgia,serif;font-weight:650;font-size:16px;color:var(--good);margin-left:8px}
#mbb-cards .mbbc-acc{border-top:1px solid var(--line);overflow:hidden}
#mbb-cards .mbbc-acc-sum{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;list-style:none;padding:12px 0;font-size:14px;font-weight:850;color:var(--ink);-webkit-tap-highlight-color:transparent}
#mbb-cards .mbbc-acc-sum::-webkit-details-marker{display:none}
#mbb-cards .mbbc-acc-sum:hover{color:var(--accent)}
#mbb-cards .mbbc-acc-lab.take{font-family:'Fraunces',Georgia,serif;color:var(--accent);font-weight:650}
#mbb-cards .mbbc-chev{color:var(--muted);transition:transform .18s ease;flex:0 0 auto}
#mbb-cards details[open] .mbbc-chev{transform:rotate(180deg)}
#mbb-cards .mbbc-acc-body{
  font-size:13.5px;
  line-height:1.5;
  color:#3A4855;
  overflow:hidden;
  max-height:0;
  opacity:0;
  transform:translateY(-4px);
  padding-top:0;
  padding-bottom:0;
  transition:max-height 280ms ease,opacity 220ms ease,transform 220ms ease,padding-bottom 220ms ease;
  will-change:max-height,opacity,transform;
}
#mbb-cards .mbbc-acc.is-open .mbbc-acc-body{opacity:1;transform:translateY(0);padding-bottom:13px}
#mbb-cards .mbbc-acc.is-closing .mbbc-acc-body{opacity:0;transform:translateY(-4px)}
#mbb-cards .mbbc-acc-value .mbbc-acc-body{color:#3F6B54}
#mbb-cards .mbbc-bens{margin:0;padding:0;list-style:none;font-size:13px}
#mbb-cards .mbbc-bens li{position:relative;padding-left:17px;margin-bottom:5px;color:#3A4855}
#mbb-cards .mbbc-bens li:before{content:"";position:absolute;left:2px;top:7px;width:6px;height:6px;border-radius:50%;background:var(--accent)}
#mbb-cards .mbbc-foot{margin-top:auto;padding-top:16px}
#mbb-cards .mbbc-ltype{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;padding:5px 10px;border-radius:999px;margin:0 0 11px}
#mbb-cards .mbbc-ltype:before{content:"";width:7px;height:7px;border-radius:50%}
#mbb-cards .mbbc-ltype.aff{background:#EAF2F8;color:#0B72B5}#mbb-cards .mbbc-ltype.aff:before{background:#0B72B5}
#mbb-cards .mbbc-ltype.ref{background:#F4EEFB;color:#6B3FA0}#mbb-cards .mbbc-ltype.ref:before{background:#6B3FA0}
#mbb-cards .mbbc-ltype.pub{background:var(--good-bg);color:var(--good)}#mbb-cards .mbbc-ltype.pub:before{background:var(--good)}
#mbb-cards .mbbc-cta-row{display:flex;align-items:center;gap:14px}
#mbb-cards .mbbc-cta{flex:1;text-align:center;background:var(--accent);color:#fff;font-weight:850;font-size:15px;padding:12px 16px;border-radius:13px;transition:background .15s,transform .15s;box-shadow:0 8px 18px rgba(11,114,181,.18)}
#mbb-cards .mbbc-cta:hover{background:var(--accent-dark);transform:translateY(-1px)}
#mbb-cards .mbbc-cta[aria-disabled="true"]{background:#C9D2DA;color:#fff;box-shadow:none;cursor:not-allowed;pointer-events:none}
#mbb-cards .mbbc-review{font-size:13.5px;font-weight:850;white-space:nowrap}
#mbb-cards .mbbc-review:hover{text-decoration:underline}
#mbb-cards .mbbc-empty,#mbb-cards .mbbc-state{grid-column:1/-1;text-align:center;padding:50px 20px;color:var(--muted)}
#mbb-cards .mbbc-empty b{display:block;font-family:'Fraunces',Georgia,serif;font-size:20px;color:var(--ink);margin-bottom:6px}
#mbb-cards .mbbc-panel-head,#mbb-cards .mbbc-apply,#mbb-cards .mbbc-panel-backdrop{display:none}

@media(max-width:680px){
  #mbb-cards{font-size:13px;line-height:1.38}
  #mbb-cards .mbbc-wrap{padding:12px 8px 28px}
  #mbb-cards .mbbc-controls{padding:0 0 12px;margin-bottom:14px;border-bottom:0}
  #mbb-cards .mbbc-row{gap:8px}
  #mbb-cards .mbbc-row1{margin-bottom:10px}
  #mbb-cards .mbbc-search{flex:1 1 100%}
  #mbb-cards .mbbc-search input{min-height:42px;border-radius:14px;font-size:13px;padding-left:38px;box-shadow:0 2px 12px rgba(23,40,58,.06)}
  #mbb-cards .mbbc-search svg{left:13px;width:16px;height:16px}
  #mbb-cards .mbbc-mobile-actions{display:flex;justify-content:flex-start;align-items:center;gap:8px;margin-bottom:10px}
  #mbb-cards .mbbc-filter-btn{
    flex:0 0 auto;
    width:auto;
    min-height:36px;
    height:36px;
    padding:8px 13px;
    border-radius:999px;
    font-size:12.5px;
    font-weight:850;
    line-height:1;
    background:#fff;
    box-shadow:0 2px 10px rgba(23,40,58,.06);
  }
  #mbb-cards .mbbc-filter-btn:before{width:13px;height:13px}
  #mbb-cards .mbbc-icon-btn{
    flex:0 0 auto;
    width:38px;
    min-width:38px;
    min-height:36px;
    height:36px;
    border-radius:999px;
    background:#fff;
  }
  #mbb-cards .mbbc-row2,#mbb-cards .mbbc-row3{display:none}
  #mbb-cards .mbbc-meta{margin-top:0;font-size:12px}
  #mbb-cards .mbbc-meta .mbbc-clear{display:none}
  #mbb-cards .mbbc-mobile-sort{display:inline-flex}
  #mbb-cards .mbbc-mobile-sort select{font-size:12px}
  #mbb-cards .mbbc-chipbar.has-chips{display:flex}
  #mbb-cards .mbbc-chip{font-size:11px;padding:5px 8px}
  #mbb-cards .mbbc-grid{grid-template-columns:1fr;gap:12px;padding-bottom:0}
  #mbb-cards .mbbc-card{padding:13px;border-radius:18px;box-shadow:0 8px 24px rgba(23,40,58,.075)}
  #mbb-cards .mbbc-card:hover{transform:none;box-shadow:0 8px 24px rgba(23,40,58,.075)}
  #mbb-cards .mbbc-top{gap:10px}
  #mbb-cards .mbbc-art{flex:0 0 76px;width:76px;height:48px;border-radius:10px}
  #mbb-cards .mbbc-name{font-size:15px;line-height:1.16}
  #mbb-cards .mbbc-fee{font-size:10.5px;line-height:1.3;margin-top:3px}
  #mbb-cards .mbbc-badges{gap:4px;margin-bottom:4px}
  #mbb-cards .mbbc-badge{font-size:8.5px;padding:3px 7px}
  #mbb-cards .mbbc-offer{margin-top:11px;padding-top:11px;padding-bottom:6px}
  #mbb-cards .mbbc-lab{font-size:8.5px;margin-bottom:2px}
  #mbb-cards .mbbc-pts{font-size:17px}
  #mbb-cards .mbbc-req{font-size:10.5px;line-height:1.25;margin-bottom:9px}
  #mbb-cards .mbbc-vchip{font-size:13px;margin-left:4px}
  #mbb-cards .mbbc-acc-sum{padding:9px 0;font-size:12px}
  #mbb-cards .mbbc-acc-body{font-size:11.5px;transition:max-height 240ms ease,opacity 190ms ease,transform 190ms ease,padding-bottom 190ms ease}
  #mbb-cards .mbbc-acc.is-open .mbbc-acc-body{padding-bottom:10px}
  #mbb-cards .mbbc-bens{font-size:11.5px}
  #mbb-cards .mbbc-foot{padding-top:11px}
  #mbb-cards .mbbc-ltype{font-size:9.5px;padding:5px 9px;margin-bottom:9px}
  #mbb-cards .mbbc-cta-row{gap:9px}
  #mbb-cards .mbbc-cta{min-height:42px;padding:10px 14px;font-size:13.5px;border-radius:13px}
  #mbb-cards .mbbc-review{font-size:12px}

  #mbb-cards .mbbc-panel-backdrop{
    position:fixed;
    inset:0;
    background:rgba(20,34,47,.42);
    backdrop-filter:blur(2px);
    z-index:999998;
  }
  #mbb-cards .mbbc-panel{
    position:fixed;
    top:max(10px, env(safe-area-inset-top));
    left:10px;
    right:10px;
    bottom:auto;
    max-height:calc(100vh - 20px - env(safe-area-inset-top));
    background:#fff;
    z-index:999999;
    padding:14px;
    transform:translateY(-115%);
    transition:transform .22s ease;
    overflow-y:auto;
    -webkit-overflow-scrolling:touch;
    display:block;
    border:1px solid rgba(230,221,207,.9);
    border-radius:22px;
    box-shadow:0 24px 70px rgba(23,40,58,.28);
  }
  #mbb-cards.mbbc-panel-open .mbbc-panel{transform:translateY(0)}
  #mbb-cards.mbbc-panel-open .mbbc-panel-backdrop{display:block}
  #mbb-cards .mbbc-panel-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:12px;
    padding-bottom:10px;
    border-bottom:1px solid var(--line);
    position:sticky;
    top:0;
    background:#fff;
    z-index:2;
  }
  #mbb-cards .mbbc-panel-title{font-weight:900;font-size:16px;color:var(--navy)}
  #mbb-cards .mbbc-close{border:0;background:#F3F0EA;border-radius:999px;width:32px;height:32px;font-size:22px;line-height:1;color:var(--ink);cursor:pointer;padding:0}
  #mbb-cards .mbbc-panel-body{display:flex;flex-direction:column;gap:10px;padding-bottom:4px}
  #mbb-cards .mbbc-panel .mbbc-row2,#mbb-cards .mbbc-panel .mbbc-row3{display:flex;flex-direction:column;align-items:stretch;margin-top:0;gap:10px}
  #mbb-cards .mbbc-panel select,#mbb-cards .mbbc-panel .mbbc-toggle{
    width:100%;
    min-height:43px;
    border-radius:14px;
    font-size:13px;
    box-shadow:none;
    background-color:#FBFAF7;
  }
  #mbb-cards .mbbc-panel .mbbc-toggle{justify-content:flex-start}
  #mbb-cards .mbbc-apply{
    display:block;
    width:100%;
    margin-top:12px;
    background:var(--accent);
    border-color:var(--accent);
    color:#fff;
    border-radius:14px;
    font-weight:900;
    min-height:44px;
    font-size:14px;
    position:sticky;
    bottom:0;
    z-index:2;
  }
  body.mbbc-lock{overflow:hidden}
}

@media (prefers-reduced-motion: reduce) {
  #mbb-cards .mbbc-card,
  #mbb-cards .mbbc-cta,
  #mbb-cards .mbbc-panel,
  #mbb-cards .mbbc-acc .mbbc-acc-body {
    transition:none !important;
    transform:none !important;
  }
}


/* v9 mobile filter overlay bug fix
   - Removes cropped ghost panel near the top of the page
   - Makes filter panel scrollable on mobile
   - Keeps desktop unchanged
*/
@media(max-width:680px){
  #mbb-cards .mbbc-panel-backdrop{
    display:none;
    position:fixed !important;
    inset:0 !important;
    background:rgba(20,34,47,.48) !important;
    backdrop-filter:blur(2px) !important;
    z-index:2147483646 !important;
  }

  #mbb-cards .mbbc-panel{
    display:flex !important;
    flex-direction:column !important;
    position:fixed !important;
    top:0 !important;
    left:0 !important;
    right:0 !important;
    bottom:0 !important;
    width:100vw !important;
    height:100dvh !important;
    max-height:100dvh !important;
    margin:0 !important;
    padding:calc(14px + env(safe-area-inset-top)) 14px calc(14px + env(safe-area-inset-bottom)) !important;
    background:#fff !important;
    border:0 !important;
    border-radius:0 !important;
    box-shadow:none !important;
    z-index:2147483647 !important;
    transform:translateY(-105%) !important;
    transition:transform .22s ease !important;
    overflow:hidden !important;
    visibility:hidden !important;
    pointer-events:none !important;
  }

  #mbb-cards.mbbc-panel-open .mbbc-panel{
    transform:translateY(0) !important;
    visibility:visible !important;
    pointer-events:auto !important;
  }

  #mbb-cards.mbbc-panel-open .mbbc-panel-backdrop{
    display:block !important;
  }

  #mbb-cards .mbbc-panel-head{
    flex:0 0 auto !important;
    display:flex !important;
    align-items:center !important;
    justify-content:space-between !important;
    margin:0 0 12px !important;
    padding:0 0 12px !important;
    border-bottom:1px solid var(--line) !important;
    background:#fff !important;
    position:relative !important;
    top:auto !important;
    z-index:2 !important;
  }

  #mbb-cards .mbbc-panel-title{
    font-size:16px !important;
    font-weight:900 !important;
  }

  #mbb-cards .mbbc-close{
    width:36px !important;
    height:36px !important;
    border-radius:999px !important;
    background:#F3F0EA !important;
  }

  #mbb-cards .mbbc-panel-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    -webkit-overflow-scrolling:touch !important;
    display:flex !important;
    flex-direction:column !important;
    gap:10px !important;
    padding:0 0 14px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-row2,
  #mbb-cards .mbbc-panel .mbbc-row3{
    display:flex !important;
    flex-direction:column !important;
    align-items:stretch !important;
    gap:10px !important;
    margin:0 !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle{
    width:100% !important;
    min-height:44px !important;
    font-size:13px !important;
    border-radius:14px !important;
    background-color:#FBFAF7 !important;
    box-shadow:none !important;
  }

  #mbb-cards .mbbc-apply{
    flex:0 0 auto !important;
    position:relative !important;
    bottom:auto !important;
    margin:12px 0 0 !important;
    min-height:46px !important;
    border-radius:14px !important;
  }

  body.mbbc-lock{
    overflow:hidden !important;
    touch-action:none !important;
  }

  body.mbbc-lock #mbb-cards .mbbc-panel,
  body.mbbc-lock #mbb-cards .mbbc-panel-body{
    touch-action:auto !important;
  }
}



/* v10 compact mobile filter sheet
   - Smaller mobile filter typography
   - Two-column filter layout
   - Shorter pill-style controls
   - Better internal scrolling
   - Desktop unchanged
*/
@media(max-width:680px){
  #mbb-cards .mbbc-panel{
    padding:calc(10px + env(safe-area-inset-top)) 10px calc(10px + env(safe-area-inset-bottom)) !important;
  }

  #mbb-cards .mbbc-panel-head{
    margin:0 0 8px !important;
    padding:0 0 8px !important;
  }

  #mbb-cards .mbbc-panel-title{
    font-size:13px !important;
    line-height:1.1 !important;
    letter-spacing:.01em !important;
  }

  #mbb-cards .mbbc-close{
    width:30px !important;
    height:30px !important;
    font-size:18px !important;
  }

  #mbb-cards .mbbc-panel-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overscroll-behavior:contain !important;
    -webkit-overflow-scrolling:touch !important;
    display:grid !important;
    grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
    gap:8px !important;
    padding:0 0 10px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-row2,
  #mbb-cards .mbbc-panel .mbbc-row3{
    display:contents !important;
  }

  #mbb-cards .mbbc-panel #mbbc-sort,
  #mbb-cards .mbbc-panel #mbbc-spend{
    grid-column:1 / -1 !important;
  }

  #mbb-cards .mbbc-panel select{
    width:100% !important;
    min-width:0 !important;
    min-height:36px !important;
    height:36px !important;
    padding:7px 28px 7px 10px !important;
    border-radius:999px !important;
    font-size:10.5px !important;
    line-height:1 !important;
    font-weight:800 !important;
    background-position:calc(100% - 15px) 16px,calc(100% - 10px) 16px !important;
    background-size:5px 5px,5px 5px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle{
    width:100% !important;
    min-height:36px !important;
    height:auto !important;
    padding:7px 9px !important;
    border-radius:999px !important;
    font-size:10.5px !important;
    line-height:1.15 !important;
    font-weight:850 !important;
    gap:7px !important;
    background:#FBFAF7 !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle input{
    width:14px !important;
    height:14px !important;
    flex:0 0 auto !important;
  }

  #mbb-cards .mbbc-apply{
    min-height:38px !important;
    margin:8px 0 0 !important;
    border-radius:999px !important;
    font-size:12px !important;
    line-height:1 !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle,
  #mbb-cards .mbbc-apply{
    box-shadow:0 1px 4px rgba(23,40,58,.04) !important;
  }
}

@media(max-width:360px){
  #mbb-cards .mbbc-panel-body{
    gap:7px !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle{
    font-size:10px !important;
    min-height:34px !important;
  }
}



/* v10 iOS scroll safety */
@media(max-width:680px){
  body.mbbc-lock{
    overflow:hidden !important;
    touch-action:auto !important;
  }

  #mbb-cards.mbbc-panel-open .mbbc-panel,
  #mbb-cards.mbbc-panel-open .mbbc-panel-body{
    touch-action:pan-y !important;
  }
}



/* v11 mobile filter overflow fix
   Make the sheet compact, independently scrollable, and keep Apply visible.
   Desktop unchanged.
*/
@media(max-width:680px){
  #mbb-cards .mbbc-panel{
    height:100dvh !important;
    max-height:100dvh !important;
    padding:calc(8px + env(safe-area-inset-top)) 9px calc(8px + env(safe-area-inset-bottom)) !important;
    display:flex !important;
    flex-direction:column !important;
    overflow:hidden !important;
  }

  #mbb-cards .mbbc-panel-head{
    flex:0 0 auto !important;
    margin:0 0 6px !important;
    padding:0 0 6px !important;
  }

  #mbb-cards .mbbc-panel-title{
    font-size:12px !important;
  }

  #mbb-cards .mbbc-close{
    width:28px !important;
    height:28px !important;
    font-size:18px !important;
  }

  #mbb-cards .mbbc-panel-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    display:grid !important;
    grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
    align-content:start !important;
    row-gap:5px !important;
    column-gap:6px !important;
    padding:0 0 8px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-row2,
  #mbb-cards .mbbc-panel .mbbc-row3{
    display:contents !important;
    margin:0 !important;
    padding:0 !important;
    gap:0 !important;
  }

  #mbb-cards .mbbc-panel #mbbc-sort{
    grid-column:1 / -1 !important;
  }

  #mbb-cards .mbbc-panel #mbbc-spend{
    grid-column:auto !important;
  }

  #mbb-cards .mbbc-panel select{
    min-height:30px !important;
    height:30px !important;
    padding:5px 24px 5px 9px !important;
    border-radius:999px !important;
    font-size:9.2px !important;
    line-height:1 !important;
    font-weight:800 !important;
    white-space:nowrap !important;
    text-overflow:ellipsis !important;
    background-position:calc(100% - 13px) 13px, calc(100% - 9px) 13px !important;
    background-size:4px 4px,4px 4px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle{
    min-height:30px !important;
    height:30px !important;
    padding:5px 8px !important;
    border-radius:999px !important;
    font-size:9.2px !important;
    line-height:1.05 !important;
    font-weight:850 !important;
    gap:5px !important;
    overflow:hidden !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle input{
    width:12px !important;
    height:12px !important;
    min-width:12px !important;
    margin:0 !important;
  }

  #mbb-cards .mbbc-apply{
    flex:0 0 auto !important;
    display:block !important;
    position:relative !important;
    bottom:auto !important;
    margin:6px 0 0 !important;
    min-height:38px !important;
    height:38px !important;
    border-radius:999px !important;
    font-size:12px !important;
  }
}

@media(max-width:380px){
  #mbb-cards .mbbc-panel-body{
    row-gap:4px !important;
    column-gap:5px !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle{
    min-height:28px !important;
    height:28px !important;
    font-size:8.8px !important;
    padding-top:4px !important;
    padding-bottom:4px !important;
  }

  #mbb-cards .mbbc-apply{
    min-height:36px !important;
    height:36px !important;
  }
}



/* v12 mobile filter width fix
   Prevents the filter overlay from being cropped on the right.
   Desktop unchanged.
*/
@media(max-width:680px){
  #mbb-cards .mbbc-panel{
    left:8px !important;
    right:8px !important;
    top:8px !important;
    bottom:8px !important;
    width:auto !important;
    max-width:none !important;
    height:calc(100dvh - 16px) !important;
    max-height:calc(100dvh - 16px) !important;
    margin:0 !important;
    box-sizing:border-box !important;
    border-radius:18px !important;
    padding:calc(8px + env(safe-area-inset-top)) 8px calc(8px + env(safe-area-inset-bottom)) !important;
  }

  #mbb-cards .mbbc-panel,
  #mbb-cards .mbbc-panel *{
    max-width:100% !important;
    box-sizing:border-box !important;
  }

  #mbb-cards .mbbc-panel-body{
    grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;
    width:100% !important;
    max-width:100% !important;
    column-gap:5px !important;
    row-gap:5px !important;
    padding-left:0 !important;
    padding-right:0 !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle{
    width:100% !important;
    min-width:0 !important;
    max-width:100% !important;
  }

  #mbb-cards .mbbc-panel select{
    overflow:hidden !important;
    text-overflow:ellipsis !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle{
    justify-content:flex-start !important;
    white-space:nowrap !important;
    overflow:hidden !important;
    text-overflow:ellipsis !important;
  }

  #mbb-cards .mbbc-apply{
    width:100% !important;
    max-width:100% !important;
  }
}

@media(max-width:360px){
  #mbb-cards .mbbc-panel{
    left:6px !important;
    right:6px !important;
    width:auto !important;
    height:calc(100dvh - 12px) !important;
    max-height:calc(100dvh - 12px) !important;
    padding-left:6px !important;
    padding-right:6px !important;
  }

  #mbb-cards .mbbc-panel-body{
    column-gap:4px !important;
  }
}



/* v13 mobile filter sheet height/action fix
   Shorter sheet, internal scroll, sticky visible Apply + Reset.
   Desktop unchanged.
*/
@media(max-width:680px){
  #mbb-cards .mbbc-panel{
    top:auto !important;
    left:8px !important;
    right:8px !important;
    bottom:calc(10px + env(safe-area-inset-bottom)) !important;
    width:auto !important;
    height:auto !important;
    max-height:min(72dvh, 560px) !important;
    min-height:auto !important;
    border-radius:20px !important;
    padding:10px 10px 10px !important;
    display:flex !important;
    flex-direction:column !important;
    overflow:hidden !important;
    transform:translateY(115%) !important;
  }

  #mbb-cards.mbbc-panel-open .mbbc-panel{
    transform:translateY(0) !important;
  }

  #mbb-cards .mbbc-panel-head{
    flex:0 0 auto !important;
    margin:0 0 8px !important;
    padding:0 0 8px !important;
    border-bottom:1px solid var(--line) !important;
  }

  #mbb-cards .mbbc-panel-title{
    font-size:13px !important;
    line-height:1.1 !important;
  }

  #mbb-cards .mbbc-close{
    width:30px !important;
    height:30px !important;
    font-size:18px !important;
  }

  #mbb-cards .mbbc-panel-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    max-height:calc(min(72dvh, 560px) - 104px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    display:grid !important;
    grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;
    align-content:start !important;
    row-gap:5px !important;
    column-gap:5px !important;
    padding:0 1px 8px 0 !important;
  }

  #mbb-cards .mbbc-panel .mbbc-row2,
  #mbb-cards .mbbc-panel .mbbc-row3{
    display:contents !important;
    margin:0 !important;
    padding:0 !important;
    gap:0 !important;
  }

  #mbb-cards .mbbc-panel #mbbc-sort{
    grid-column:1 / -1 !important;
  }

  #mbb-cards .mbbc-panel select{
    min-height:30px !important;
    height:30px !important;
    padding:5px 24px 5px 9px !important;
    border-radius:999px !important;
    font-size:9.2px !important;
    line-height:1 !important;
    font-weight:800 !important;
    white-space:nowrap !important;
    overflow:hidden !important;
    text-overflow:ellipsis !important;
    background-position:calc(100% - 13px) 13px, calc(100% - 9px) 13px !important;
    background-size:4px 4px,4px 4px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle{
    min-height:30px !important;
    height:30px !important;
    padding:5px 8px !important;
    border-radius:999px !important;
    font-size:9.2px !important;
    line-height:1.05 !important;
    font-weight:850 !important;
    gap:5px !important;
    overflow:hidden !important;
    white-space:nowrap !important;
    text-overflow:ellipsis !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle input{
    width:12px !important;
    height:12px !important;
    min-width:12px !important;
    margin:0 !important;
  }

  #mbb-cards .mbbc-panel-actions{
    flex:0 0 auto !important;
    display:grid !important;
    grid-template-columns:0.8fr 1.2fr !important;
    gap:8px !important;
    padding:8px 0 0 !important;
    margin:0 !important;
    border-top:1px solid var(--line) !important;
    background:#fff !important;
  }

  #mbb-cards .mbbc-panel-reset,
  #mbb-cards .mbbc-apply{
    display:block !important;
    width:100% !important;
    height:38px !important;
    min-height:38px !important;
    border-radius:999px !important;
    font-size:12px !important;
    font-weight:900 !important;
    line-height:1 !important;
    margin:0 !important;
    position:relative !important;
    bottom:auto !important;
    cursor:pointer !important;
  }

  #mbb-cards .mbbc-panel-reset{
    background:#F7F2EA !important;
    color:var(--ink) !important;
    border:1px solid var(--line) !important;
  }

  #mbb-cards .mbbc-apply{
    background:var(--accent) !important;
    color:#fff !important;
    border:1px solid var(--accent) !important;
  }
}

@media(max-width:360px){
  #mbb-cards .mbbc-panel{
    left:6px !important;
    right:6px !important;
    bottom:calc(8px + env(safe-area-inset-bottom)) !important;
    max-height:74dvh !important;
    padding:8px !important;
  }

  #mbb-cards .mbbc-panel-body{
    max-height:calc(74dvh - 98px) !important;
    row-gap:4px !important;
    column-gap:4px !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle{
    min-height:28px !important;
    height:28px !important;
    font-size:8.8px !important;
  }

  #mbb-cards .mbbc-panel-reset,
  #mbb-cards .mbbc-apply{
    height:36px !important;
    min-height:36px !important;
    font-size:11.5px !important;
  }
}



/* v14 mobile filter placement fix
   Top-positioned compact sheet; Reset + Apply remain visible.
   Desktop unchanged.
*/
@media(max-width:680px){
  #mbb-cards .mbbc-panel{
    top:calc(10px + env(safe-area-inset-top)) !important;
    left:8px !important;
    right:8px !important;
    bottom:auto !important;
    width:auto !important;
    height:auto !important;
    min-height:auto !important;
    max-height:none !important;
    border-radius:20px !important;
    padding:9px !important;
    display:flex !important;
    flex-direction:column !important;
    overflow:visible !important;
    transform:translateY(-115%) !important;
  }

  #mbb-cards.mbbc-panel-open .mbbc-panel{
    transform:translateY(0) !important;
  }

  #mbb-cards .mbbc-panel-head{
    flex:0 0 auto !important;
    margin:0 0 6px !important;
    padding:0 0 6px !important;
    border-bottom:1px solid var(--line) !important;
  }

  #mbb-cards .mbbc-panel-title{
    font-size:12.5px !important;
    line-height:1.1 !important;
  }

  #mbb-cards .mbbc-close{
    width:28px !important;
    height:28px !important;
    font-size:18px !important;
  }

  #mbb-cards .mbbc-panel-body{
    flex:0 0 auto !important;
    min-height:auto !important;
    max-height:none !important;
    height:auto !important;
    overflow:visible !important;
    display:grid !important;
    grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;
    align-content:start !important;
    row-gap:4px !important;
    column-gap:5px !important;
    padding:0 !important;
  }

  #mbb-cards .mbbc-panel .mbbc-row2,
  #mbb-cards .mbbc-panel .mbbc-row3{
    display:contents !important;
    margin:0 !important;
    padding:0 !important;
    gap:0 !important;
  }

  #mbb-cards .mbbc-panel #mbbc-sort{
    grid-column:1 / -1 !important;
  }

  #mbb-cards .mbbc-panel select{
    min-height:27px !important;
    height:27px !important;
    padding:4px 22px 4px 8px !important;
    border-radius:999px !important;
    font-size:8.8px !important;
    line-height:1 !important;
    font-weight:800 !important;
    white-space:nowrap !important;
    overflow:hidden !important;
    text-overflow:ellipsis !important;
    background-position:calc(100% - 12px) 12px, calc(100% - 8px) 12px !important;
    background-size:4px 4px,4px 4px !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle{
    min-height:27px !important;
    height:27px !important;
    padding:4px 7px !important;
    border-radius:999px !important;
    font-size:8.8px !important;
    line-height:1 !important;
    font-weight:850 !important;
    gap:4px !important;
    overflow:hidden !important;
    white-space:nowrap !important;
    text-overflow:ellipsis !important;
  }

  #mbb-cards .mbbc-panel .mbbc-toggle input{
    width:11px !important;
    height:11px !important;
    min-width:11px !important;
    margin:0 !important;
  }

  #mbb-cards .mbbc-panel-actions{
    flex:0 0 auto !important;
    display:grid !important;
    grid-template-columns:0.8fr 1.2fr !important;
    gap:7px !important;
    padding:7px 0 0 !important;
    margin:7px 0 0 !important;
    border-top:1px solid var(--line) !important;
    background:#fff !important;
  }

  #mbb-cards .mbbc-panel-reset,
  #mbb-cards .mbbc-apply{
    display:block !important;
    width:100% !important;
    height:34px !important;
    min-height:34px !important;
    border-radius:999px !important;
    font-size:11.5px !important;
    font-weight:900 !important;
    line-height:1 !important;
    margin:0 !important;
    position:relative !important;
    bottom:auto !important;
    cursor:pointer !important;
  }

  #mbb-cards .mbbc-panel-reset{
    background:#F7F2EA !important;
    color:var(--ink) !important;
    border:1px solid var(--line) !important;
  }

  #mbb-cards .mbbc-apply{
    background:var(--accent) !important;
    color:#fff !important;
    border:1px solid var(--accent) !important;
  }
}

@media(max-width:360px){
  #mbb-cards .mbbc-panel{
    left:6px !important;
    right:6px !important;
    top:calc(8px + env(safe-area-inset-top)) !important;
    padding:7px !important;
  }

  #mbb-cards .mbbc-panel-body{
    row-gap:3px !important;
    column-gap:4px !important;
  }

  #mbb-cards .mbbc-panel select,
  #mbb-cards .mbbc-panel .mbbc-toggle{
    min-height:25px !important;
    height:25px !important;
    font-size:8.2px !important;
  }

  #mbb-cards .mbbc-panel-reset,
  #mbb-cards .mbbc-apply{
    height:32px !important;
    min-height:32px !important;
    font-size:11px !important;
  }
}


/* v16 individual card container support */
.mbb-card-widget{display:block;width:100%;box-sizing:border-box}
.mbb-card-widget .mbbc-wrap{max-width:100%;padding:0}
.mbb-card-widget .mbbc-single-grid{display:grid;grid-template-columns:1fr;gap:0;padding:0}
.mbb-card-widget .mbbc-card{width:100%;max-width:100%}
.mbb-card-widget .mbbc-card:hover{transform:none}
`;

  var st = document.createElement("style");
  st.textContent = CSS + "\n" + CSS.replace(/#mbb-cards/g, ".mbb-card-widget");
  document.head.appendChild(st);

  if (pageMount) mount.innerHTML = `
    <div class="mbbc-wrap">
      <div class="mbbc-controls">
        <div class="mbbc-row mbbc-row1">
          <label class="mbbc-search" aria-label="Search cards">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M10.7 18a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input id="mbbc-q" type="search" placeholder="Search cards..." autocomplete="off">
          </label>
        </div>

        <div class="mbbc-mobile-actions">
          <button class="mbbc-filter-btn" id="mbbc-open-filters" type="button">Filter <span id="mbbc-filter-count">(0)</span></button>
          <button class="mbbc-icon-btn" id="mbbc-mobile-reset" type="button" aria-label="Reset filters">↻</button>
        </div>

        <div class="mbbc-row mbbc-row2" id="mbbc-filter-row-a">
          <select id="mbbc-sort" aria-label="Sort cards">
            <option value="rec">Sort: Recommended</option>
            <option value="wo">Welcome offer: High → Low</option>
            <option value="val">My value: High → Low</option>
            <option value="feelo">Annual fee: Low → High</option>
            <option value="feehi">Annual fee: High → Low</option>
          </select>
        </div>

        <div class="mbbc-row mbbc-row3" id="mbbc-filter-row-b">
          <select id="mbbc-issuer" aria-label="Issuer">
            <option value="">All issuers</option>
          </select>
          <select id="mbbc-type" aria-label="Card type">
            <option value="">All types</option>
            <option value="Personal">Personal</option>
            <option value="Business">Business</option>
          </select>
          <select id="mbbc-fee" aria-label="Annual fee">
            <option value="">Any annual fee</option>
            <option value="0">$0</option>
            <option value="u100">Under $100</option>
            <option value="100-300">$100–$300</option>
            <option value="300">$300+</option>
          </select>
          <select id="mbbc-wo" aria-label="Welcome offer">
            <option value="">Welcome offer: any</option>
            <option value="50000">50k+ points / $500+</option>
            <option value="75000">75k+ points / $750+</option>
            <option value="100000">100k+ points / $1k+</option>
            <option value="150000">150k+ points / $1.5k+</option>
          </select>
          <select id="mbbc-spend" aria-label="Spend requirement">
            <option value="">Spend requirement: any</option>
            <option value="1000">≤ $1,000</option>
            <option value="3000">≤ $3,000</option>
            <option value="5000">≤ $5,000</option>
            <option value="8000">≤ $8,000</option>
          </select>
          <label class="mbbc-toggle"><input id="mbbc-transfer" type="checkbox"> Transferable points only</label>
          <label class="mbbc-toggle"><input id="mbbc-elev" type="checkbox"> Elevated offers only</label>
        </div>

        <div class="mbbc-meta">
          <div><b id="mbbc-count">0</b> cards</div>
          <div class="mbbc-mobile-sort">
            <span>Sort:</span>
            <select id="mbbc-sort-mobile" aria-label="Mobile sort cards">
              <option value="rec">Recommended</option>
              <option value="wo">Offer high</option>
              <option value="val">Value high</option>
              <option value="feelo">Fee low</option>
              <option value="feehi">Fee high</option>
            </select>
          </div>
          <button class="mbbc-clear" id="mbbc-reset" type="button">Reset filters</button>
        </div>

        <div class="mbbc-chipbar" id="mbbc-chipbar"></div>

        <div class="mbbc-panel-backdrop" id="mbbc-filter-backdrop"></div>
        <div class="mbbc-panel" id="mbbc-filter-panel" aria-hidden="true">
          <div class="mbbc-panel-head">
            <div class="mbbc-panel-title">Refine cards</div>
            <button class="mbbc-close" id="mbbc-close-filters" type="button" aria-label="Close filters">×</button>
          </div>
          <div class="mbbc-panel-body" id="mbbc-panel-body"></div>
          <div class="mbbc-panel-actions">
            <button class="mbbc-panel-reset" id="mbbc-panel-reset" type="button">Reset</button>
            <button class="mbbc-apply" id="mbbc-apply-filters" type="button">Apply filters</button>
          </div>
        </div>
      </div>

      <div class="mbbc-grid" id="mbbc-grid">
        <div class="mbbc-state">Loading cards…</div>
      </div>
    </div>
  `;

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];
    });
  }

  function money(n){
    var value = Number(n);
    if (!isFinite(value)) return "";
    return "$" + value.toLocaleString("en-US");
  }

  function num(s){
    var m = String(s == null ? "" : s).replace(/,/g,"").match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function isCashOffer(c){
    var offer = String((c && c.welcome_offer) || "").toLowerCase();
    return offer.indexOf("$") !== -1 ||
      offer.indexOf("cash") !== -1 ||
      offer.indexOf("cashback") !== -1 ||
      offer.indexOf("statement credit") !== -1 ||
      (offer.indexOf("bonus") !== -1 && offer.indexOf("point") === -1 && offer.indexOf("mile") === -1);
  }

  function offerFaceValue(c){
    var amount = num(c && c.welcome_offer);
    if (amount == null) return 0;
    return isCashOffer(c) ? amount : 0;
  }

  function offerPointsEquivalent(c){
    var amount = num(c && c.welcome_offer);
    if (amount == null) return 0;
    if (isCashOffer(c)) return amount * 100;
    return amount;
  }

  function estimatedOfferValue(c){
    var amount = num(c && c.welcome_offer);
    if (amount == null) return 0;

    if (isCashOffer(c)) {
      var cppCash = parseFloat(c.cpp);
      if (!isNaN(cppCash) && cppCash > 1) return Math.round(amount * cppCash);
      return Math.round(amount);
    }

    var cpp = parseFloat(c.cpp);
    return !isNaN(cpp) ? Math.round(amount * cpp / 100) : 0;
  }

  function lc(s){ return String(s == null ? "" : s).trim().toLowerCase(); }

  function clean(s){ return String(s == null ? "" : s).trim(); }

  function initials(n){
    return clean(n).split(/\s+/).filter(Boolean).slice(0,2).join(" ").toUpperCase() || "CARD";
  }

  function normalizeBool(value){
    var v = lc(value);
    return v === "yes" || v === "true" || v === "1";
  }

  function firstNonEmpty(){
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
      card.affiliate_link,
      card.offer_url,
      card.affiliate_url,
      card.apply_link,
      card.apply_url,
      card.button_url,
      card.link_url,
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

  function isElevated(c){
    var s = lc(c.welcome_offer_status);
    return s === "elevated" || s === "all-time high" || s === "all time high" || s === "alltimehigh";
  }

  function linkType(c){
    var key = lc(c.link_type).replace(/\s+/g, "");
    if (key === "affiliate") return LINK_PILLS.affiliate;
    if (key === "referral") return LINK_PILLS.referral;
    if (key === "public") return LINK_PILLS.public;
    if (key === "nocommission" || key === "no-commission") return LINK_PILLS.public;
    return LINK_PILLS.affiliate;
  }

  function optionText(select){
    return select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : "";
  }

  function chevron(){
    return '<svg class="mbbc-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function cardHTML(c){
    var status = lc(c.welcome_offer_status);
    var badges = "";
    if (status === "all-time high" || status === "all time high" || status === "alltimehigh") {
      badges += '<span class="mbbc-badge high">All-time high</span>';
    } else if (status === "elevated") {
      badges += '<span class="mbbc-badge elev">Elevated</span>';
    }

    var img = clean(c.card_image_url)
      ? '<img src="' + esc(c.card_image_url) + '" alt="' + esc(c.card_name || "Credit card") + '" loading="lazy">'
      : esc(initials(c.card_name));

    var rawOfferAmount = num(c.welcome_offer);
    var cpp = parseFloat(c.cpp);
    var valueBlock = "";
    if (rawOfferAmount != null) {
      var val = estimatedOfferValue(c);
      if (val > 0) {
        var vbody = "";
        if (isCashOffer(c)) {
          if (!isNaN(cpp) && cpp > 1) {
            vbody = 'This offer is displayed as cash back because that is how the issuer markets it. For cards where cash back can become transferable points, I estimate the value using a point-equivalent conversion at ' + esc(String(cpp)) + '¢ per point.';
          } else {
            vbody = 'This offer is displayed and valued as cash back based on the face value shown in the welcome offer.';
          }
        } else if (!isNaN(cpp)) {
          vbody = 'What I think the ' + esc(c.welcome_offer || "welcome bonus") + ' is realistically worth, valued at a conservative ' + esc(String(cpp)) + '¢ per point.<br>I value points by what you’ll actually get — not a best-case redemption.';
        }

        if (vbody) {
          valueBlock =
            '<details class="mbbc-acc mbbc-acc-value">' +
              '<summary class="mbbc-acc-sum"><span>My value <span class="mbbc-vchip">≈ ' + esc(money(val)) + '</span></span>' + chevron() + '</summary>' +
              '<div class="mbbc-acc-body">' + vbody + '</div>' +
            '</details>';
        }
      }
    }

    var takeBlock = clean(c.advait_quick_take)
      ? '<details class="mbbc-acc">' +
          '<summary class="mbbc-acc-sum"><span class="mbbc-acc-lab take">✦ My take</span>' + chevron() + '</summary>' +
          '<div class="mbbc-acc-body">' + esc(c.advait_quick_take) + '</div>' +
        '</details>'
      : "";

    var benefits = String(c.highlighted_features || "")
      .split("|")
      .map(function(b){ return b.trim(); })
      .filter(Boolean);

    var hiBlock = benefits.length
      ? '<details class="mbbc-acc">' +
          '<summary class="mbbc-acc-sum"><span>Card highlights</span>' + chevron() + '</summary>' +
          '<div class="mbbc-acc-body"><ul class="mbbc-bens">' +
            benefits.map(function(b){ return '<li>' + esc(b) + '</li>'; }).join("") +
          '</ul></div>' +
        '</details>'
      : "";

    var lt = linkType(c);
    var ltypeHTML = lt
      ? '<div class="mbbc-ltype ' + esc(lt.cls) + '">' + esc(lt.label) + '</div>'
      : "";

    var relAttr = (lt && lt.cls === "pub") ? "nofollow noopener" : "sponsored nofollow noopener";
    var offerUrl = getOfferUrl(c);
    var reviewUrl = getReviewUrl(c);
    var review = reviewUrl ? '<a class="mbbc-review" href="' + esc(reviewUrl) + '">Full review</a>' : "";
    var offer = offerUrl
      ? '<a class="mbbc-cta" href="' + esc(offerUrl) + '" target="_blank" rel="' + relAttr + '">View offer →</a>'
      : '<span class="mbbc-cta" aria-disabled="true">Offer unavailable</span>';

    return '' +
      '<article class="mbbc-card">' +
        '<div class="mbbc-top">' +
          '<div class="mbbc-art">' + img + '</div>' +
          '<div class="mbbc-head">' +
            '<div class="mbbc-badges">' + badges + '</div>' +
            '<h3 class="mbbc-name">' + esc(c.card_name) + '</h3>' +
            '<div class="mbbc-fee">' + esc(c.annual_fee || "") + ' annual fee<span class="dot">•</span>' + esc(c.card_type || "") + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="mbbc-offer">' +
          '<div class="mbbc-lab">Welcome offer</div>' +
          '<div class="mbbc-pts">' + esc(c.welcome_offer || "") + '</div>' +
          '<div class="mbbc-req">' + esc(c.bonus_condition || "") + '</div>' +
        '</div>' +

        valueBlock + takeBlock + hiBlock +

        '<div class="mbbc-foot">' +
          ltypeHTML +
          '<div class="mbbc-cta-row">' + offer + review + '</div>' +
        '</div>' +
      '</article>';
  }

  var CARDS = [];
  var el = {};

  function feeMatch(f, v){
    if (!v) return true;
    if (f == null) return false;
    if (v === "0") return f === 0;
    if (v === "u100") return f > 0 && f < 100;
    if (v === "100-300") return f >= 100 && f <= 300;
    if (v === "300") return f > 300;
    return true;
  }

  function cardValue(c){
    return estimatedOfferValue(c);
  }

  function chip(label, clearFn){
    var id = "mbbc-chip-" + Math.random().toString(36).slice(2);
    setTimeout(function(){
      var b = document.getElementById(id);
      if (b) b.addEventListener("click", function(){ clearFn(); render(); });
    }, 0);
    return '<span class="mbbc-chip">' + esc(label) + ' <button id="' + id + '" type="button" aria-label="Remove ' + esc(label) + '">×</button></span>';
  }

  function renderChips(){
    var chips = [];
    if (el.issuer.value) chips.push(chip(el.issuer.value, function(){ el.issuer.value = ""; }));
    if (el.type.value) chips.push(chip(el.type.value, function(){ el.type.value = ""; }));
    if (el.fee.value) chips.push(chip(optionText(el.fee), function(){ el.fee.value = ""; }));
    if (el.wo.value) chips.push(chip(optionText(el.wo), function(){ el.wo.value = ""; }));
    if (el.spend.value) chips.push(chip(optionText(el.spend), function(){ el.spend.value = ""; }));
    if (el.transfer.checked) chips.push(chip("Transferable", function(){ el.transfer.checked = false; }));
    if (el.elev.checked) chips.push(chip("Elevated", function(){ el.elev.checked = false; }));
    el.chipbar.innerHTML = chips.join("");
    el.chipbar.classList.toggle("has-chips", chips.length > 0);
    el.filterCount.textContent = "(" + chips.length + ")";
  }

  function initAccordions(root){
    root = root || mount;
    var detailsList = Array.prototype.slice.call(root.querySelectorAll(".mbbc-acc"));
    detailsList.forEach(function(details){
      if (details.dataset.smoothReady === "yes") return;
      details.dataset.smoothReady = "yes";

      var summary = details.querySelector(".mbbc-acc-sum");
      var body = details.querySelector(".mbbc-acc-body");
      if (!summary || !body) return;

      if (details.open) {
        details.classList.add("is-open");
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        details.classList.remove("is-open");
        body.style.maxHeight = "0px";
      }

      summary.addEventListener("click", function(event){
        event.preventDefault();

        var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var isOpen = details.open;

        if (reduceMotion) {
          details.open = !isOpen;
          details.classList.toggle("is-open", !isOpen);
          body.style.maxHeight = !isOpen ? "none" : "0px";
          return;
        }

        if (isOpen) {
          details.classList.remove("is-open");
          details.classList.add("is-closing");
          body.style.maxHeight = body.scrollHeight + "px";

          requestAnimationFrame(function(){
            body.style.maxHeight = "0px";
          });

          window.setTimeout(function(){
            details.open = false;
            details.classList.remove("is-closing");
          }, 285);
        } else {
          details.open = true;
          details.classList.remove("is-closing");
          details.classList.add("is-open");
          body.style.maxHeight = "0px";

          requestAnimationFrame(function(){
            body.style.maxHeight = body.scrollHeight + "px";
          });

          window.setTimeout(function(){
            if (details.open) body.style.maxHeight = "none";
          }, 285);
        }
      });
    });
  }


  function renderSingles(allCards){
    if (!singleMounts.length) return;
    var byId = {};
    allCards.forEach(function(c){
      if (clean(c.card_id)) byId[clean(c.card_id)] = c;
    });

    singleMounts.forEach(function(node){
      var id = clean(node.getAttribute("data-mbb-card"));
      var c = byId[id];
      node.classList.add("mbb-card-widget", "mbbc-single");
      if (!c) {
        node.innerHTML = '<div class="mbbc-state">Card details could not be loaded.</div>';
        return;
      }
      node.innerHTML = '<div class="mbbc-wrap"><div class="mbbc-grid mbbc-single-grid">' + cardHTML(c) + '</div></div>';
      initAccordions(node);
    });
  }

  function render(){
    var q = lc(el.q.value);
    var list = CARDS.filter(function(c){
      if (el.issuer.value && c.card_issuer !== el.issuer.value) return false;
      if (el.type.value && c.card_type !== el.type.value) return false;
      if (!feeMatch(num(c.annual_fee), el.fee.value)) return false;
      if (el.wo.value && !(offerPointsEquivalent(c) >= parseFloat(el.wo.value))) return false;
      if (el.spend.value && !(num(c.bonus_condition) != null && num(c.bonus_condition) <= parseFloat(el.spend.value))) return false;
      if (el.transfer.checked && !normalizeBool(c.transferable)) return false;
      if (el.elev.checked && !isElevated(c)) return false;
      if (q && (lc(c.card_name) + " " + lc(c.card_issuer) + " " + lc(c.points_program)).indexOf(q) === -1) return false;
      return true;
    });

    var srt = el.sort.value;
    if (srt === "wo") list.sort(function(a,b){ return offerPointsEquivalent(b) - offerPointsEquivalent(a); });
    else if (srt === "val") list.sort(function(a,b){ return cardValue(b) - cardValue(a); });
    else if (srt === "feelo") list.sort(function(a,b){ return (num(a.annual_fee) || 0) - (num(b.annual_fee) || 0); });
    else if (srt === "feehi") list.sort(function(a,b){ return (num(b.annual_fee) || 0) - (num(a.annual_fee) || 0); });
    else list.sort(function(a,b){ return (num(a.sort_order) || 999) - (num(b.sort_order) || 999); });

    el.sortMobile.value = el.sort.value;
    el.count.textContent = list.length;
    el.grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<div class="mbbc-empty"><b>No cards match those filters</b>Try widening the fee range or clearing your search.</div>';

    initAccordions();
    renderChips();
  }

  function buildIssuerOptions(){
    var seen = {};
    CARDS.forEach(function(c){
      if (clean(c.card_issuer)) seen[c.card_issuer] = true;
    });
    Object.keys(seen).sort().forEach(function(n){
      var o = document.createElement("option");
      o.value = n;
      o.textContent = n;
      el.issuer.appendChild(o);
    });
  }

  function openPanel(){
    syncFilterPlacement();
    mount.classList.add("mbbc-panel-open");
    document.body.classList.add("mbbc-lock");
    document.body.style.overflow = "hidden";
    if (el.panelBody) el.panelBody.scrollTop = 0;
    if (el.panel) {
      el.panel.scrollTop = 0;
      el.panel.setAttribute("aria-hidden", "false");
    }
  }

  function closePanel(){
    mount.classList.remove("mbbc-panel-open");
    document.body.classList.remove("mbbc-lock");
    document.body.style.overflow = "";
    if (el.panel) el.panel.setAttribute("aria-hidden", "true");
  }

  function syncFilterPlacement(){
    if (!el.filterRowA || !el.filterRowB || !el.panelBody || !el.controls) return;
    var mobile = window.matchMedia && window.matchMedia("(max-width: 680px)").matches;

    if (mobile) {
      if (el.filterRowA.parentNode !== el.panelBody) el.panelBody.appendChild(el.filterRowA);
      if (el.filterRowB.parentNode !== el.panelBody) el.panelBody.appendChild(el.filterRowB);
    } else {
      var backdrop = mount.querySelector("#mbbc-filter-backdrop");
      if (el.filterRowA.parentNode !== el.controls) el.controls.insertBefore(el.filterRowA, backdrop);
      if (el.filterRowB.parentNode !== el.controls) el.controls.insertBefore(el.filterRowB, backdrop);
      closePanel();
    }
  }

  function resetAll(){
    el.q.value = "";
    el.issuer.value = "";
    el.type.value = "";
    el.fee.value = "";
    el.wo.value = "";
    el.spend.value = "";
    el.transfer.checked = false;
    el.elev.checked = false;
    el.sort.value = "rec";
    el.sortMobile.value = "rec";
    closePanel();
    render();
  }

  function wire(){
    el.q = mount.querySelector("#mbbc-q");
    el.issuer = mount.querySelector("#mbbc-issuer");
    el.type = mount.querySelector("#mbbc-type");
    el.fee = mount.querySelector("#mbbc-fee");
    el.wo = mount.querySelector("#mbbc-wo");
    el.spend = mount.querySelector("#mbbc-spend");
    el.transfer = mount.querySelector("#mbbc-transfer");
    el.elev = mount.querySelector("#mbbc-elev");
    el.sort = mount.querySelector("#mbbc-sort");
    el.sortMobile = mount.querySelector("#mbbc-sort-mobile");
    el.count = mount.querySelector("#mbbc-count");
    el.grid = mount.querySelector("#mbbc-grid");
    el.reset = mount.querySelector("#mbbc-reset");
    el.mobileReset = mount.querySelector("#mbbc-mobile-reset");
    el.panelReset = mount.querySelector("#mbbc-panel-reset");
    el.chipbar = mount.querySelector("#mbbc-chipbar");
    el.filterCount = mount.querySelector("#mbbc-filter-count");
    el.panel = mount.querySelector("#mbbc-filter-panel");
    el.panelBody = mount.querySelector("#mbbc-panel-body");
    el.controls = mount.querySelector(".mbbc-controls");
    el.filterRowA = mount.querySelector("#mbbc-filter-row-a");
    el.filterRowB = mount.querySelector("#mbbc-filter-row-b");

    el.q.addEventListener("input", render);

    [el.issuer, el.type, el.fee, el.wo, el.spend, el.transfer, el.elev, el.sort].forEach(function(x){
      x.addEventListener("change", render);
    });

    el.sortMobile.addEventListener("change", function(){
      el.sort.value = el.sortMobile.value;
      render();
    });

    el.reset.addEventListener("click", resetAll);
    el.mobileReset.addEventListener("click", resetAll);
    if (el.panelReset) el.panelReset.addEventListener("click", resetAll);

    mount.querySelector("#mbbc-open-filters").addEventListener("click", openPanel);
    mount.querySelector("#mbbc-close-filters").addEventListener("click", closePanel);
    mount.querySelector("#mbbc-filter-backdrop").addEventListener("click", closePanel);
    mount.querySelector("#mbbc-apply-filters").addEventListener("click", closePanel);

    if (el.panel) {
      el.panel.addEventListener("touchmove", function(e){
        if (!mount.classList.contains("mbbc-panel-open")) return;
        e.stopPropagation();
      }, { passive:true });
    }

    if (el.panelBody) {
      el.panelBody.addEventListener("touchmove", function(e){
        if (!mount.classList.contains("mbbc-panel-open")) return;
        e.stopPropagation();
      }, { passive:true });
      el.panelBody.addEventListener("wheel", function(e){
        if (!mount.classList.contains("mbbc-panel-open")) return;
        e.stopPropagation();
      }, { passive:true });
    }

    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closePanel();
    });

    window.addEventListener("resize", syncFilterPlacement);
    syncFilterPlacement();
  }

  fetch(DATA_URL)
    .then(function(r){
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function(data){
      var obj = (data && data.cards) ? data.cards : data;
      if (Array.isArray(obj)) {
        CARDS = obj;
      } else {
        CARDS = Object.keys(obj || {}).map(function(k){ return obj[k]; });
      }

      var ALL_CARDS = CARDS.slice();
      renderSingles(ALL_CARDS);

      CARDS = ALL_CARDS.filter(function(c){
        return lc(c.show_on_card_page) === "yes";
      });

      if (pageMount) {
        wire();
        buildIssuerOptions();
        render();
      }
    })
    .catch(function(){
      if (pageMount) {
        var g = mount.querySelector("#mbbc-grid");
        if (g) g.innerHTML = '<div class="mbbc-state">Couldn’t load cards right now. Please refresh in a moment.</div>';
      }
      singleMounts.forEach(function(node){
        node.classList.add("mbb-card-widget");
        node.innerHTML = '<div class="mbbc-state">Couldn’t load card details right now. Please refresh in a moment.</div>';
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMbbCardsWidget);
  } else {
    bootMbbCardsWidget();
  }
})();