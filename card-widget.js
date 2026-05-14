// ─────────────────────────────────────────────────────────────
// Miles Beyond Borders — Card Widget
// v1.2
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
      }

      /* ── Left panel ── */
      .mbb-left {
        background: var(--mbb-navy);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px 20px;
        flex-shrink: 0;
        width: 200px;
        gap: 12px;
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
        width: 158px;
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

      /* Card name + program */
      .mbb-right-top {
        padding: 18px 20px 14px;
        border-bottom: 1px solid #f0f4f7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .mbb-card-name {
        font-size: 16px;
        font-weight: 800;
        color: var(--mbb-navy);
        line-height: 1.2;
        margin-bottom: 2px;
      }
      .mbb-card-program {
        font-size: 11.5px;
        color: #8aa8c0;
      }

      /* Offer block */
      .mbb-offer-block {
        padding: 14px 20px;
        border-bottom: 1px solid #f0f4f7;
      }
      .mbb-row-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mbb-blue-mid);
        margin-bottom: 3px;
      }
      .mbb-offer-number {
        font-size: 30px;
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
        margin-top: 2px;
      }

      /* Verdict */
      .mbb-verdict-wrap {
        margin: 12px 20px;
      }

      /* Desktop: toggle button hidden, body always visible */
      .mbb-verdict-toggle { display: none; }
      .mbb-verdict-body   { display: block; }

      .mbb-verdict {
        padding: 11px 13px;
        background: var(--mbb-navy);
        border-radius: 10px;
        position: relative;
      }
      .mbb-verdict::before {
        content: "\\201C";
        position: absolute;
        top: -8px; left: 10px;
        font-size: 38px;
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
        margin-bottom: 3px;
        padding-top: 7px;
      }
      .mbb-verdict-text {
        font-size: 12px;
        color: rgba(255,255,255,0.88);
        line-height: 1.55;
      }

      /* ── Expandable highlights ── */
      .mbb-highlights {
        border-top: 1px solid #f0f4f7;
        margin-top: auto;
      }

      .mbb-highlights-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        gap: 8px;
      }
      .mbb-highlights-toggle:hover { background: #f8fbff; }

      .mbb-highlights-toggle-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--mbb-blue-mid);
      }

      .mbb-highlights-arrow {
        width: 16px; height: 16px;
        color: var(--mbb-blue-mid);
        flex-shrink: 0;
        transition: transform 0.2s ease;
      }
      .mbb-highlights.open .mbb-highlights-arrow {
        transform: rotate(180deg);
      }

      .mbb-highlights-body {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        padding: 0 20px;
        transition: max-height 0.35s ease, opacity 0.25s ease, padding 0.35s ease;
      }
      .mbb-highlights.open .mbb-highlights-body {
        max-height: 600px;
        opacity: 1;
        padding: 4px 20px 14px;
      }

      .mbb-highlight-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 12.5px;
        color: var(--mbb-navy);
        padding: 5px 0;
        border-bottom: 1px solid #f4f7fa;
        line-height: 1.4;
      }
      .mbb-highlight-item:last-child { border-bottom: none; }
      .mbb-highlight-item::before {
        content: '';
        width: 5px; height: 5px;
        border-radius: 50%;
        background: var(--mbb-blue);
        flex-shrink: 0;
        margin-top: 5px;
      }

      /* Footer */
      .mbb-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px 16px;
        gap: 12px;
        border-top: 1px solid #f0f4f7;
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
        font-size: 15px;
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
        font-size: 12.5px;
        font-weight: 700;
        padding: 9px 18px;
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

      /* ── Mobile ── */
      @media (max-width: 560px) {
        [data-mbb-card] { flex-direction: column; }
        .mbb-left {
          width: 100%;
          flex-direction: row;
          justify-content: flex-start;
          padding: 16px 18px;
          gap: 14px;
        }
        .mbb-left img { width: 110px; }
        .mbb-footer { flex-direction: column; align-items: stretch; }
        .mbb-learn-more { justify-content: center; }

        /* Verdict becomes a toggle on mobile */
        .mbb-verdict-wrap { margin: 0; border-top: 1px solid #f0f4f7; }
        .mbb-verdict-toggle {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          gap: 8px;
        }
        .mbb-verdict-toggle:hover { background: #f8fbff; }
        .mbb-verdict-toggle-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mbb-blue-mid);
        }
        .mbb-verdict-arrow {
          width: 16px; height: 16px;
          color: var(--mbb-blue-mid);
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .mbb-verdict-wrap.open .mbb-verdict-arrow { transform: rotate(180deg); }

        /* Body hidden by default on mobile, shown when open */
        .mbb-verdict-body {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          padding: 0 18px;
          transition: max-height 0.35s ease, opacity 0.25s ease, padding 0.35s ease;
        }
        .mbb-verdict-wrap.open .mbb-verdict-body {
          max-height: 400px;
          opacity: 1;
          padding: 0 18px 14px;
        }
        .mbb-verdict { margin: 0; }
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

    // Highlighted features — pipe separated
    const highlightItems = (card.highlighted_features || '')
      .split('|')
      .map(function(f) { return f.trim(); })
      .filter(function(f) { return f.length > 0; })
      .map(function(f) { return '<div class="mbb-highlight-item">' + f + '</div>'; })
      .join('');

    const imageUrl = resolveImageUrl(card.card_image_url);
    const arrowSVG = '<svg class="mbb-highlights-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    const ctaArrow = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    return `
      <div class="mbb-left">
        <div class="mbb-offer-status ${statusClass}">
          <span class="mbb-pulse"></span> ${statusLabel}
        </div>
        <img src="${imageUrl}" alt="${card.card_name}" />
      </div>

      <div class="mbb-right">
        <div class="mbb-right-top">
          <div>
            <div class="mbb-card-name">${card.card_name}</div>
            <div class="mbb-card-program">${card.points_program || ''}</div>
          </div>
        </div>

        <div class="mbb-offer-block">
          <div class="mbb-row-label">Welcome Offer</div>
          <div class="mbb-offer-number">${offerNumber} <span>${offerUnit}</span></div>
          ${offerDetail ? '<div class="mbb-offer-detail">' + offerDetail + '</div>' : ''}
        </div>

        ${card.advait_quick_take ? `
        <div class="mbb-verdict-wrap">
          <button class="mbb-verdict-toggle" aria-expanded="false">
            <span class="mbb-verdict-toggle-label">Advait's Verdict</span>
            <svg class="mbb-verdict-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="mbb-verdict-body">
            <div class="mbb-verdict">
              <div class="mbb-verdict-label">Advait's Verdict</div>
              <div class="mbb-verdict-text">${card.advait_quick_take}</div>
            </div>
          </div>
        </div>` : ''}

        ${highlightItems ? `
        <div class="mbb-highlights">
          <button class="mbb-highlights-toggle" aria-expanded="false">
            <span class="mbb-highlights-toggle-label">Card Highlights</span>
            ${arrowSVG}
          </button>
          <div class="mbb-highlights-body">${highlightItems}</div>
        </div>` : ''}

        <div class="mbb-footer">
          <div>
            <div class="mbb-fee-label">Annual Fee</div>
            <div class="mbb-fee-amount">${fee || 'See offer'} <sub>/yr</sub></div>
          </div>
          <a class="mbb-learn-more" href="${card.affiliate_link || '#'}" target="_blank" rel="noopener sponsored">
            Learn More ${ctaArrow}
          </a>
        </div>
      </div>
    `;
  }

  // ── Toggle handler (delegated) ─────────────────────────────
  function handleToggle(e) {
    const btn = e.target.closest('.mbb-highlights-toggle, .mbb-verdict-toggle');
    if (!btn) return;
    const section = btn.closest('.mbb-highlights, .mbb-verdict-wrap');
    const isOpen  = section.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
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
    document.addEventListener('click', handleToggle);
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

