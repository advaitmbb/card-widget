// ─────────────────────────────────────────────────────────────
// Miles Beyond Borders — Card Widget
// v1.0
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
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(26,43,60,0.14), 0 0 0 1px rgba(26,43,60,0.06);
        background: #fff;
        margin: 28px 0;
        max-width: 600px;
      }

      /* Hero */
      .mbb-hero {
        background: var(--mbb-navy);
        position: relative;
        padding: 28px 28px 0;
        display: flex;
        align-items: flex-end;
        gap: 24px;
        min-height: 130px;
      }
      .mbb-hero-image {
        flex-shrink: 0;
        width: 160px;
        margin-bottom: -28px;
        position: relative;
        z-index: 2;
      }
      .mbb-hero-image img {
        width: 160px;
        border-radius: 10px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.40);
        display: block;
      }
      .mbb-hero-text { flex: 1; padding-bottom: 20px; }

      /* Status badge */
      .mbb-offer-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .mbb-offer-status .mbb-pulse {
        width: 8px; height: 8px;
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

      .mbb-card-name {
        font-size: 18px;
        font-weight: 800;
        color: #fff;
        line-height: 1.2;
        margin-bottom: 3px;
      }
      .mbb-card-program { font-size: 12px; color: rgba(255,255,255,0.5); }

      /* Offer stat */
      .mbb-offer-stat {
        display: flex;
        align-items: flex-end;
        gap: 20px;
        padding: 32px 28px 20px;
        border-bottom: 1px solid #f0f4f7;
      }
      .mbb-offer-stat-spacer { flex-shrink: 0; width: 160px; }
      .mbb-offer-stat-content { flex: 1; }
      .mbb-offer-label {
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mbb-blue-mid);
        margin-bottom: 4px;
      }
      .mbb-offer-number {
        font-size: 42px;
        font-weight: 900;
        color: var(--mbb-navy);
        line-height: 1;
        letter-spacing: -1px;
      }
      .mbb-offer-number span {
        font-size: 16px;
        font-weight: 600;
        color: #8aa8c0;
        letter-spacing: 0;
        margin-left: 2px;
      }
      .mbb-offer-detail { font-size: 12.5px; color: #7a9ab5; margin-top: 4px; }

      /* Earnings */
      .mbb-earnings-row {
        padding: 18px 28px;
        border-bottom: 1px solid #f0f4f7;
      }
      .mbb-row-label {
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mbb-blue-mid);
        margin-bottom: 10px;
      }
      .mbb-chips { display: flex; flex-wrap: wrap; gap: 7px; }
      .mbb-chip {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        background: var(--mbb-cream);
        border: 1px solid #e8e0d0;
        border-radius: 8px;
        padding: 5px 11px;
        font-size: 12.5px;
        color: var(--mbb-navy);
      }
      .mbb-chip b {
        font-size: 14px;
        font-weight: 800;
        color: var(--mbb-blue-mid);
      }

      /* Verdict */
      .mbb-verdict {
        margin: 20px 28px;
        padding: 16px 18px;
        background: var(--mbb-navy);
        border-radius: 12px;
        position: relative;
      }
      .mbb-verdict::before {
        content: "\\201C";
        position: absolute;
        top: -10px; left: 16px;
        font-size: 48px;
        font-weight: 900;
        color: var(--mbb-blue);
        line-height: 1;
      }
      .mbb-verdict-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--mbb-blue);
        margin-bottom: 6px;
        padding-top: 10px;
      }
      .mbb-verdict-text {
        font-size: 13.5px;
        color: rgba(255,255,255,0.88);
        line-height: 1.6;
      }

      /* Footer */
      .mbb-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 28px 22px;
        gap: 12px;
      }
      .mbb-fee-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #aac0d0;
        margin-bottom: 2px;
      }
      .mbb-fee-amount {
        font-size: 18px;
        font-weight: 800;
        color: var(--mbb-navy);
      }
      .mbb-fee-amount sub {
        font-size: 12px;
        font-weight: 500;
        color: #9ab0c0;
        vertical-align: baseline;
      }
      .mbb-learn-more {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--mbb-blue);
        color: #fff !important;
        font-size: 13.5px;
        font-weight: 700;
        padding: 12px 24px;
        border-radius: 10px;
        text-decoration: none !important;
        letter-spacing: 0.01em;
        transition: background 0.15s, transform 0.1s;
        white-space: nowrap;
      }
      .mbb-learn-more:hover {
        background: var(--mbb-blue-mid);
        transform: translateY(-1px);
      }

      /* Mobile */
      @media (max-width: 540px) {
        .mbb-hero { flex-direction: column; align-items: flex-start; gap: 14px; padding: 20px 20px 0; }
        .mbb-hero-image { width: 130px; margin-bottom: -20px; }
        .mbb-hero-image img { width: 130px; }
        .mbb-hero-text { padding-bottom: 14px; }
        .mbb-card-name { font-size: 16px; }
        .mbb-offer-stat { flex-direction: column; gap: 0; padding: 26px 20px 16px; }
        .mbb-offer-stat-spacer { display: none; }
        .mbb-offer-number { font-size: 36px; }
        .mbb-earnings-row { padding: 14px 20px; }
        .mbb-verdict { margin: 0 20px 16px; }
        .mbb-footer { flex-direction: column; align-items: stretch; padding: 14px 20px 20px; }
        .mbb-learn-more { justify-content: center; padding: 14px; }
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
    // Flexible status check — handles "Elevated", "Elevated Offer", "elevated" etc.
    const isElevated = (card.welcome_offer_status || '').toLowerCase().includes('elevated');
    const statusClass = isElevated ? 'elevated' : 'standard';
    const statusLabel = isElevated ? 'Elevated Offer' : 'Standard Offer';

    // Normalize offer number — add commas if plain number e.g. "150000" → "150,000"
    const offerRaw    = (card.welcome_offer || '').trim();
    const offerMatch  = offerRaw.match(/^([\d,]+)\s*(points?|miles?|cash back)?/i);
    const rawNum      = offerMatch ? offerMatch[1].replace(/,/g, '') : '';
    const offerNumber = rawNum ? Number(rawNum).toLocaleString() : offerRaw;
    const offerUnit   = offerMatch ? (offerMatch[2] || 'pts') : '';
    const offerDetail = (card.bonus_condition || '').trim();

    // Normalize annual fee — add $ if missing
    const feeRaw = (card.annual_fee || '').trim();
    const fee    = feeRaw && !feeRaw.startsWith('$') ? '$' + feeRaw : feeRaw;

    // Earnings chips — stored as "3x dining & travel | 1x everything else"
    const earningsHTML = (card.earnings_summary || '').split('|').map(function(e) {
      const part  = e.trim();
      const match = part.match(/^(\d+x)\s+(.+)$/i);
      return match
        ? '<span class="mbb-chip"><b>' + match[1] + '</b> ' + match[2] + '</span>'
        : (part ? '<span class="mbb-chip">' + part + '</span>' : '');
    }).join('');

    const imageUrl = resolveImageUrl(card.card_image_url);
    const arrowSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    return `
      <div class="mbb-hero">
        <div class="mbb-hero-image">
          <img src="${imageUrl}" alt="${card.card_name}" />
        </div>
        <div class="mbb-hero-text">
          <div class="mbb-offer-status ${statusClass}">
            <span class="mbb-pulse"></span> ${statusLabel}
          </div>
          <div class="mbb-card-name">${card.card_name}</div>
          <div class="mbb-card-program">${card.points_program || ''}</div>
        </div>
      </div>

      <div class="mbb-offer-stat">
        <div class="mbb-offer-stat-spacer"></div>
        <div class="mbb-offer-stat-content">
          <div class="mbb-offer-label">Welcome Offer</div>
          <div class="mbb-offer-number">${offerNumber} <span>${offerUnit}</span></div>
          ${offerDetail ? '<div class="mbb-offer-detail">after ' + offerDetail + '</div>' : ''}
        </div>
      </div>

      ${earningsHTML ? `
      <div class="mbb-earnings-row">
        <div class="mbb-row-label">Earnings Rate</div>
        <div class="mbb-chips">${earningsHTML}</div>
      </div>` : ''}

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
