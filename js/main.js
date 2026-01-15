document.querySelectorAll('a[href^="#"]').forEach(a=>{
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

if(toggle){
  toggle.addEventListener('click', ()=>{
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    if(nav.style.display==='flex') nav.style.display='none'; else nav.style.display='flex';
  });
}

// header shadow on scroll
function handleScroll(){
  if(window.scrollY > 12) header.classList.add('scrolled'); else header.classList.remove('scrolled');
}
window.addEventListener('scroll', handleScroll, {passive:true});
handleScroll();

// reveal on scroll
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 60) el.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll, {passive:true});
window.addEventListener('load', revealOnScroll);

// smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(!href || href==='#') return;
    if(href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  })
});

// expose small API for onboarding
window.Onboarding = window.Onboarding || {};
window.Onboarding.save = window.Onboarding.save || (()=>{});
