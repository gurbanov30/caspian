(function () {
  'use strict';

  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element && value !== undefined && value !== null) element.textContent = value;
    return element;
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
  const setLabel = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (!element || value === undefined || value === null) return element;
    const textNode = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.nodeValue = ` ${value} `;
    else element.prepend(document.createTextNode(`${value} `));
    return element;
  };
  const setImage = (selector, src, alt, root = document) => {
    const element = root.querySelector(selector);
    if (!element) return;
    if (src) element.src = src;
    if (alt) element.alt = alt;
  };
  const setHref = (element, href) => { if (element && href) element.href = href; };

  function apply(data) {
    const s = data.settings || {};
    const c = data.collections || {};
    const site = s.site || {};
    const header = s.header || {};
    const hero = s.hero || {};
    const about = s.about || {};
    const heritage = s.heritage || {};
    const stats = s.stats?.items || [];
    const servicesSection = s.servicesSection || {};
    const principles = s.principles || {};
    const capabilities = s.capabilities || {};
    const safety = s.safety || {};
    const process = s.process || {};
    const statement = s.statement || {};
    const contact = s.contact || {};
    const footer = s.footer || {};
    const inquiry = s.inquiry || {};

    document.title = `${site.companyName || 'Caspian Motors Clinic'} | Marine Solutions`;
    setText('.brand-text strong', site.companyName);
    document.querySelectorAll('.brand-text span').forEach(el => el.textContent = site.tagline || el.textContent);
    document.querySelectorAll('.brand-mark img').forEach(img => { if (site.logo) img.src = site.logo; });
    const navLinks = [...document.querySelectorAll('.site-nav > a:not(.header-action)')];
    (header.nav || []).forEach((item, index) => { if (!navLinks[index]) return; navLinks[index].textContent = item.label; setHref(navLinks[index], item.href); });
    document.querySelectorAll('.header-action').forEach(button => { const textNode = [...button.childNodes].find(node => node.nodeType === Node.TEXT_NODE); if (textNode) textNode.nodeValue = ` ${header.actionLabel || textNode.nodeValue.trim()} `; });
    const description = document.querySelector('meta[name="description"]');
    if (description && site.description) description.content = site.description;

    setText('.hero .eyebrow', hero.eyebrow);
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && hero.title) {
      const title = escapeHtml(hero.title);
      const emphasis = escapeHtml(hero.emphasis || '');
      heroTitle.innerHTML = emphasis && title.includes(emphasis) ? title.replace(emphasis, `<em>${emphasis}</em>`) : title;
    }
    setText('.hero-copy > p:not(.eyebrow)', hero.description);
    setLabel('.hero .hero-actions .button-primary', hero.primaryLabel);
    setLabel('.hero .hero-actions .button-outline', hero.secondaryLabel);
    setHref(document.querySelector('.hero .hero-actions .button-outline'), hero.secondaryHref);
    (hero.slides || []).forEach((src, index) => {
      const slide = document.querySelectorAll('.hero-bg-slide')[index];
      if (slide && src) slide.style.backgroundImage = `url('${src}')`;
    });

    setText('#haqqimizda .eyebrow', about.eyebrow);
    setText('#haqqimizda h2', about.title);
    const aboutParagraphs = document.querySelectorAll('#haqqimizda .split-copy > p:not(.eyebrow)');
    (about.paragraphs || []).forEach((text, i) => { if (aboutParagraphs[i]) aboutParagraphs[i].textContent = text; });
    setImage('#haqqimizda .photo-composition > img', about.image, about.imageAlt);
    const year = document.querySelector('#haqqimizda .photo-accent .year');
    if (year && about.foundedYear) year.innerHTML = `<i class="live-dot"></i>${escapeHtml(about.foundedYear)}`;
    setText('#haqqimizda .photo-accent span:last-child', about.foundedText);
    const checks = document.querySelectorAll('#haqqimizda .checklist li');
    (about.checklist || []).forEach((text, i) => { if (checks[i]) checks[i].lastChild.textContent = text; });

    setText('#tarixce .eyebrow', heritage.eyebrow);
    setText('#tarixce h2', heritage.title);
    setText('#tarixce .section-heading > p:last-child', heritage.description);
    (c.heritage_items || []).forEach((item, i) => {
      const card = document.querySelectorAll('.heritage-card')[i]; if (!card) return;
      setText('.heritage-year', item.data.eyebrow, card); setText('h3', item.data.title, card); setText('p', item.data.description, card);
    });
    document.querySelectorAll('.stat-box').forEach((box, i) => { if (stats[i]) { setText('.stat-num', stats[i].value, box); setText('.stat-label', stats[i].label, box); } });

    setText('#xidmetler .eyebrow', servicesSection.eyebrow);
    setText('#xidmetler h2', servicesSection.title);
    (c.services || []).forEach((item, i) => {
      const card = document.querySelectorAll('.service-card')[i]; if (!card) return;
      const d = item.data; card.dataset.category = d.category || ''; setImage('img', d.image, d.alt, card); setText('.service-number', d.kicker, card); setText('h3', d.title, card); setText('p', d.description, card);
    });

    setText('.principles .eyebrow', principles.eyebrow); setText('.principles h2', principles.title); setText('.principles .section-heading > p:last-child', principles.description);
    (c.principles || []).forEach((item, i) => { const card = document.querySelectorAll('.principle')[i]; if (!card) return; setText('.principle-index', item.data.index, card); setText('h3', item.data.title, card); setText('p', item.data.description, card); });

    setText('.capabilities .eyebrow', capabilities.eyebrow); setText('.capabilities h2', capabilities.title); setText('.capability-panel > p:last-of-type', capabilities.description); setLabel('.capability-panel .button', capabilities.ctaLabel); setImage('.capability-photo img', capabilities.image, capabilities.imageAlt);
    (c.capabilities || []).forEach((item, i) => { const row = document.querySelectorAll('.capability-list details')[i]; if (!row) return; setText('summary', item.data.title, row); setText('p', item.data.description, row); });

    setText('.safety .eyebrow', safety.eyebrow);
    const safetyTitle = document.querySelector('.safety h2');
    if (safetyTitle && safety.title) { const title = escapeHtml(safety.title); const highlight = escapeHtml(safety.highlight || ''); safetyTitle.innerHTML = highlight && title.includes(highlight) ? title.replace(highlight, `<span>${highlight}</span>`) : title; }
    setText('.safety-copy', safety.description);
    const safetyCardTitle = document.querySelector('.safety-card h3');
    if (safetyCardTitle && safety.cardTitle) safetyCardTitle.innerHTML = `<i class="live-dot"></i>${escapeHtml(safety.cardTitle)}`;
    setText('.safety-card p', safety.cardDescription);
    setText('#proses .eyebrow', process.eyebrow); setText('#proses h2', process.title); setText('#proses .section-heading > p:last-child', process.description);
    (c.process_steps || []).forEach((item, i) => { const row = document.querySelectorAll('.step')[i]; if (!row) return; setText('.step-number', item.data.number, row); setText('h3', item.data.title, row); setText('p', item.data.description, row); });
    setText('.statement .eyebrow', statement.eyebrow); setText('.statement blockquote', statement.quote); setText('.statement cite', statement.cite); setImage('.statement-image img', statement.image, statement.imageAlt);

    setText('#elaqe .eyebrow', contact.eyebrow); setText('#elaqe h2', contact.title); setText('#elaqe .contact-copy > p:not(.eyebrow)', contact.description); setLabel('#elaqe .contact-copy .button', contact.ctaLabel);
    (c.contact_items || []).forEach((item, i) => { const card = document.querySelectorAll('#elaqe .contact-item')[i]; if (!card) return; const d = item.data; setText(':scope > div > span', d.label, card); setText('strong', d.value, card); if (d.href) { card.href = d.href; } });
    setText('.footer-brand > p', footer.description); setText('.footer-heading', footer.navigationTitle); setText('.footer-bottom a', footer.closing);
    setText('#modal-title', inquiry.title); setText('.modal-header > p', inquiry.description); setText('label[for="form-name"]', inquiry.nameLabel); setText('label[for="form-phone"]', inquiry.phoneLabel); setText('label[for="form-service"]', inquiry.serviceLabel); setText('label[for="form-location"]', inquiry.locationLabel); setText('label[for="form-message"]', inquiry.messageLabel); setText('.form-success-msg h3', inquiry.successTitle); setText('.form-success-msg p', inquiry.successDescription);
  }

  function submitInquiry(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    const payload = { name: form.querySelector('#form-name')?.value || '', phone: form.querySelector('#form-phone')?.value || '', service: form.querySelector('#form-service')?.value || '', location: form.querySelector('#form-location')?.value || '', message: form.querySelector('#form-message')?.value || '' };
    fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(response => { if (!response.ok) throw new Error('Unable to submit'); return response.json(); })
      .then(() => { form.style.display = 'none'; const success = document.getElementById('form-success-msg'); if (success) success.style.display = 'block'; })
      .catch(() => { alert('Sorğu göndərilmədi. Zəhmət olmasa yenidən cəhd edin.'); })
      .finally(() => { if (button) button.disabled = false; });
  }

  function boot() {
    fetch('/api/content/public').then(response => response.ok ? response.json() : Promise.reject()).then(apply).catch(() => {});
    const form = document.getElementById('inquiry-form');
    if (form) form.addEventListener('submit', submitInquiry, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

