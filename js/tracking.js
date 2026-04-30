/* Doutor Impressora — Tracking + LGPD + WhatsApp dynamic links */
(function(){
  // Esses IDs vêm do <head> da página (window globals)
  var phone = (window.WA_PHONE || '5511XXXXXXXXX').replace(/\D/g,'');
  var msg = window.WA_MSG || 'Olá! Vim pelo site e quero um orçamento';
  var gadsId = window.GADS_ID || '';
  var gadsLabel = window.GADS_LABEL || '';

  // Year auto
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // WhatsApp links: monta href dinamicamente em todos .wa-link
  var waUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  document.querySelectorAll('.wa-link').forEach(function(el){
    el.setAttribute('href', waUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
    el.addEventListener('click', function(){
      var ev = el.getAttribute('data-event') || 'whatsapp_click';
      if(window.gtag){ gtag('event', ev, {event_category:'engagement', event_label:'whatsapp', value:1}); }
      if(window.fbq){ fbq('track', 'Contact'); }
      if(gadsId && gadsLabel && window.gtag){ gtag('event','conversion',{send_to: gadsId+'/'+gadsLabel}); }
      if(window.dataLayer){ dataLayer.push({event: ev}); }
    });
  });

  // Phone click tracking
  document.querySelectorAll('[data-event="phone_click"]').forEach(function(el){
    el.addEventListener('click', function(){
      if(window.gtag){ gtag('event','phone_click',{event_category:'engagement',value:1}); }
      if(window.dataLayer){ dataLayer.push({event:'phone_click'}); }
    });
  });

  // Scroll depth
  var depths = [25, 50, 75, 90];
  var fired = {};
  window.addEventListener('scroll', function(){
    var pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    depths.forEach(function(d){
      if(pct >= d && !fired[d]){
        fired[d] = true;
        if(window.gtag){ gtag('event','scroll_depth',{event_category:'engagement',event_label:d+'%',value:d}); }
        if(window.dataLayer){ dataLayer.push({event:'scroll_depth', depth:d}); }
      }
    });
  }, {passive: true});

  // Time on page (30s)
  setTimeout(function(){
    if(window.gtag){ gtag('event','time_on_page',{event_category:'engagement',event_label:'30s',value:30}); }
    if(window.dataLayer){ dataLayer.push({event:'time_on_page_30s'}); }
  }, 30000);

  // Form submit tracking
  document.querySelectorAll('form[data-form="contato"]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(f);
      var nome = data.get('nome') || '';
      var problema = data.get('problema') || data.get('mensagem') || '';
      var customMsg = 'Olá! Sou ' + nome + '. ' + problema;
      var customWa = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(customMsg);
      if(window.gtag){ gtag('event','form_submit',{event_category:'conversion',event_label:'contato',value:1}); }
      if(window.fbq){ fbq('track','Lead'); }
      if(gadsId && gadsLabel && window.gtag){ gtag('event','conversion',{send_to: gadsId+'/'+gadsLabel}); }
      if(window.dataLayer){ dataLayer.push({event:'form_submit'}); }
      window.open(customWa, '_blank', 'noopener');
    });
  });

  // Drawer mobile (hamburger menu)
  var burger = document.querySelector('.nav-burger');
  var drawer = document.querySelector('.drawer');
  var overlay = document.querySelector('.drawer-overlay');
  var drawerClose = document.querySelector('.drawer-close');
  function openDrawer(){ if(drawer){ drawer.classList.add('open'); overlay && overlay.classList.add('open'); document.body.classList.add('drawer-open'); burger && burger.setAttribute('aria-expanded','true'); }}
  function closeDrawer(){ if(drawer){ drawer.classList.remove('open'); overlay && overlay.classList.remove('open'); document.body.classList.remove('drawer-open'); burger && burger.setAttribute('aria-expanded','false'); }}
  if(burger){ burger.addEventListener('click', openDrawer); }
  if(drawerClose){ drawerClose.addEventListener('click', closeDrawer); }
  if(overlay){ overlay.addEventListener('click', closeDrawer); }
  document.querySelectorAll('.drawer-nav a').forEach(function(a){ a.addEventListener('click', closeDrawer); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeDrawer(); });

  // LGPD Consent Mode
  var banner = document.getElementById('lgpd-banner');
  var consent = localStorage.getItem('lgpd_consent');
  if(banner && !consent) banner.classList.add('show');

  function setConsent(level){
    localStorage.setItem('lgpd_consent', level);
    if(banner) banner.classList.remove('show');
    if(!window.gtag) return;
    if(level === 'all'){
      gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted',functionality_storage:'granted',personalization_storage:'granted'});
    } else {
      gtag('consent','update',{security_storage:'granted'});
    }
  }
  var btnAll = document.getElementById('lgpd-accept');
  var btnEss = document.getElementById('lgpd-essential');
  if(btnAll) btnAll.addEventListener('click', function(){ setConsent('all'); });
  if(btnEss) btnEss.addEventListener('click', function(){ setConsent('essential'); });
  if(consent === 'all') setConsent('all');
})();
