// ─────────────────────────────────────────────────────────────
// Miles Beyond Borders — Card Widget
// v1.1
//
// HOW TO USE:
//   1. Replace SHEET_URL below with your deployed Apps Script URL.
//   2. Host this file and add one <script> tag to your site globally.
//   3. Embed cards anywhere with:
//        <div data-mbb-card="chase-sapphire-reserve"></div>
// ─────────────────────────────────────────────────────────────

(function () {
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycby7U-ibKQpTY1b0WQCYp936SvkmVzoDos_gXlLytTu2irlITfTGU6-Ni4fXsMjS0JtJ/exec';

  // ── Inject styles (runs once) ──────────────────────────────
  function injectStyles() {
    if (document.getElementById('mbb-card-styles')) return;
    const css = `
      :root {
        --mbb-navy:       #1a2b3c;
        --mbb-blue:       #38b6ff;
        --mbb-blue-mid:   #0e6ba8;
        --mbb-blue-light: #beddfd;
        --mbb-cream:      #faf6ee;
      }

      [data-mbb-card] {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(26,43,60,0.12), 0 0 0 1px rgba(26,43,60,0.06);
        background: #fff;
        margin: 28px 0;
        display: flex;
        flex-direction: row;
        max-width: 780px;
        min-height: 0;
      }

      /* ── Left panel ── */
      .mbb-left {
        background: var(--mbb-navy);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 28px 24px;
        flex-shrink: 0;
        width: 210px;
        gap: 14px;
      }

      .mbb-offer-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .mbb-offer-status .mbb-pulse {
        width: 7px; height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .mbb-offer-status.elevated { color: var(--mbb-blue); }
      .mbb-offer-status.elevated .mbb-pulse {
        background: var(--mbb-blue);
        box-shadow: 0 0 0 3px rgba(56,182,255,0.25);
        animation: mbb-pulse 2s infinite;
      }
      .mbb-offer-status.standard { color: #6b8fa8; }
      .mbb-offer-status.standard .mbb-pulse { background: #6b8fa8; }

      @keyframes mbb-pulse {
        0%, 100% { box-shadow: 0 0 0 3px rgba(56,182,255,0.25); }
        50%       { box-shadow: 0 0 0 6px rgba(56,182,255,0.08); }
      }

      .mbb-left img {
        width: 162px;
        border-radius: 9px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        display: block;
      }

      /* ── Right panel ── */
      .mbb-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .mbb-right-top {
        padding: 20px 22px 14px;
        border-bottom: 1px solid #f0f4f7;
      }

      .mbb-card-name {
        font-size: 17px;
        font-weight: 800;
        color: var(--mbb-navy);
        line-height: 1.2;
        margin-bottom: 2px;
      }
      .mbb-card-program {
        font-size: 12px;
        color: #8aa8c0;
      }

      /* Offer + earnings row */
      .mbb-right-mid {
        display: flex;
        gap: 0;
        border-bottom: 1px solid #f0f4f7;
      }

      .mbb-offer-block {
        padding: 14px 22px;
        border-right: 1px solid #f0f4f7;
        flex-shrink: 0;
      }
      .mbb-row-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mbb-blue-mid);
        margin-bottom: 4px;
      }
      .mbb-offer-number {
        font-size: 32px;
        font-weight: 900;
        color: var(--mbb-navy);
        line-height: 1;
        letter-spacing: -0.5px;
      }
      .mbb-offer-number span {
        font-size: 13px;
        font-weight: 600;
        color: #8aa8c0;
        margin-left: 2px;
      }
      .mbb-offer-detail {
        font-size: 11px;
        color: #7a9ab5;
        margin-top: 3px;
      }

      .mbb-earnings-block {
        padding: 14px 22px;
        flex: 1;
      }
      .mbb-chips { display: flex; flex-wrap: wrap; gap: 5px; }
      .mbb-chip {
        display: inline-flex;
        align-items: baseline;
        gap: 3px;
        background: var(--mbb-cream);
        border: 1px solid #e8e0d0;
        border-radius: 6px;
        padding: 3px 8px;
        font-size: 11.5px;
        color: var(--mbb-navy);
      }
      .mbb-chip b {
        font-size: 12.5px;
        font-weight: 800;
        color: var(--mbb-blue-mid);
      }

      /* Verdict */
      .mbb-verdict {
        margin: 14px 22px;
        padding: 12px 14px;
        background: var(--mbb-navy);
        border-radius: 10px;
        position: relative;
      }
      .mbb-verdict::before {
        content: "\\201C";
        position: absolute;
        top: -8px; left: 12px;
        font-size: 40px;
        font-weight: 900;
        color: var(--mbb-blue);
        line-height: 1;
      }
      .mbb-verdict-label {
        font-size: 8.5px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--mbb-blue);
        margin-bottom: 4px;
        padding-top: 8px;
      }
      .mbb-verdict-text {
        font-size: 12.5px;
        color: rgba(255,255,255,0.88);
        line-height: 1.55;
      }

      /* Footer */
      .mbb-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 22px 18px;
        gap: 12px;
        margin-top: auto;
      }
      .mbb-fee-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #aac0d0;
        margin-bottom: 1px;
      }
      .mbb-fee-amount {
        font-size: 16px;
        font-weight: 800;
        color: var(--mbb-navy);
      }
      .mbb-fee-amount sub {
        font-size: 11px;
        font-weight: 500;
        color: #9ab0c0;
        vertical-align: baseline;
      }
      .mbb-learn-more {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: var(--mbb-blue);
        color: #fff !important;
        font-size: 13px;
        font-weight: 700;
        padding: 10px 20px;
        border-radius: 8px;
        text-decoration: none !important;
        letter-spacing: 0.01em;
        transition: background 0.15s, transform 0.1s;
        white-space: nowrap;
      }
      .mbb-learn-more:hover {
        background: var(--mbb-blue-mid);
        transform: translateY(-1px);
      }

      /* ── Mobile: stack vertically ── */
      @media (max-width: 560px) {
        [data-mbb-card] { flex-direction: column; }
        .mbb-left {
          width: 100%;
          flex-direction: row;
          justify-content: flex-start;
          padding: 18px 18px 14px;
          gap: 16px;
        }
        .mbb-left img { width: 120px; }
        .mbb-right-mid { flex-direction: column; }
        .mbb-offer-block { border-right: none; border-bottom: 1px solid #f0f4f7; }
        .mbb-footer { flex-direction: column; align-items: stretch; }
        .mbb-learn-more { justify-content: center; }
      }
    `;
    const style = document.createElement('style');
    style.id = 'mbb-card-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Convert Google Drive share URL to direct image URL ────
  function resolveImageUrl(url) {
    if (!url) return '';
    const match = url.match(/\/d\/([^/]+)/);
    if (match) return 'https://drive.google.com/uc?export=view&id=' + match[1];
    return url;
  }

  // ── Build the card HTML from a data row ────────────────────
  function buildCardHTML(card) {
    const isElevated = (card.welcome_offer_status || '').toLowerCase().includes('elevated');
    const statusClass = isElevated ? 'elevated' : 'standard';
    const statusLabel = isElevated ? 'Elevated Offer' : 'Standard Offer';

    const offerRaw    = (card.welcome_offer || '').trim();
    const offerMatch  = offerRaw.match(/^([\d,]+)\s*(points?|miles?|cash back)?/i);
    const rawNum      = offerMatch ? offerMatch[1].replace(/,/g, '') : '';
    const offerNumber = rawNum ? Number(rawNum).toLocaleString() : offerRaw;
    const offerUnit   = offerMatch ? (offerMatch[2] || 'pts') : '';
    const offerDetail = (card.bonus_condition || '').trim();

    const feeRaw = (card.annual_fee || '').trim();
    const fee    = feeRaw && !feeRaw.startsWith('$') ? '$' + feeRaw : feeRaw;

    const earningsHTML = (card.earnings_summary || '').split('|').map(function(e) {
      const part  = e.trim();
      const match = part.match(/^(\d+x)\s+(.+)$/i);
      return match
        ? '<span class="mbb-chip"><b>' + match[1] + '</b> ' + match[2] + '</span>'
        : (part ? '<span class="mbb-chip">' + part + '</span>' : '');
    }).join('');

    const imageUrl = resolveImageUrl(card.card_image_url);
    const arrowSVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    return `
      <div class="mbb-left">
        <div class="mbb-offer-status ${statusClass}">
          <span class="mbb-pulse"></span> ${statusLabel}
        </div>
        <img src="${imageUrl}" alt="${card.card_name}" />
      </div>

      <div class="mbb-right">
        <div class="mbb-right-top">
          <div class="mbb-card-name">${card.card_name}</div>
          <div class="mbb-card-program">${card.points_program || ''}</div>
        </div>

        <div class="mbb-right-mid">
          <div class="mbb-offer-block">
            <div class="mbb-row-label">Welcome Offer</div>
            <div class="mbb-offer-number">${offerNumber} <span>${offerUnit}</span></div>
            ${offerDetail ? '<div class="mbb-offer-detail">' + offerDetail + '</div>' : ''}
          </div>
          ${earningsHTML ? `
          <div class="mbb-earnings-block">
            <div class="mbb-row-label">Earnings Rate</div>
            <div class="mbb-chips">${earningsHTML}</div>
          </div>` : ''}
        </div>

        ${card.advait_quick_take ? `
        <div class="mbb-verdict">
          <div class="mbb-verdict-label">Advait's Verdict</div>
          <div class="mbb-verdict-text">${card.advait_quick_take}</div>
        </div>` : ''}

        <div class="mbb-footer">
          <div class="mbb-fee-wrap">
            <div class="mbb-fee-label">Annual Fee</div>
            <div class="mbb-fee-amount">${fee || 'See offer'} <sub>/yr</sub></div>
          </div>
          <a class="mbb-learn-more" href="${card.affiliate_link || '#'}" target="_blank" rel="noopener sponsored">
            Learn More ${arrowSVG}
          </a>
        </div>
      </div>
    `;
  }

  // ── Render all card placeholders on the page ───────────────
  function renderCards(allCards) {
    document.querySelectorAll('[data-mbb-card]').forEach(function(el) {
      const cardId = el.getAttribute('data-mbb-card');
      const card   = allCards[cardId];
      if (!card) {
        el.innerHTML = '<p style="color:#c00;font-size:13px;padding:12px;">MBB: card not found — "' + cardId + '"</p>';
        return;
      }
      el.innerHTML = buildCardHTML(card);
    });
  }

  // ── Entry point ────────────────────────────────────────────
  function init() {
    const placeholders = document.querySelectorAll('[data-mbb-card]');
    if (!placeholders.length) return;

    injectStyles();

    fetch(SHEET_URL)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.ok) throw new Error(data.error);
        renderCards(data.cards);
      })
      .catch(function(err) {
        console.error('[MBB card widget]', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
