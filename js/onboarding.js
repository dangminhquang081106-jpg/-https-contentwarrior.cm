(() => {
  function setProgress(step, total=7){
    const pct = Math.round((step/total)*100);
    const bar = document.querySelector('.progress > i');
    if(bar) bar.style.width = pct + '%';
    const pctText = document.querySelector('.progress-text');
    if(pctText) pctText.textContent = pct + '%';
  }

  // restore values
  function restore(){
    try{
      const data = JSON.parse(localStorage.getItem('cw_onboard')||'{}');
      Object.keys(data).forEach(k=>{
        const el = document.querySelector('[name="'+k+'"]');
        if(!el) return;
        if(el.type==='checkbox' || el.type==='radio') el.checked = data[k];
        else el.value = data[k];
      })
    }catch(e){/* ignore */}
  }

  function saveForm(){
    const els = document.querySelectorAll('[name]');
    const obj = JSON.parse(localStorage.getItem('cw_onboard')||'{}');
    els.forEach(el=>{
      if(el.type==='checkbox' || el.type==='radio') obj[el.name] = el.checked ? el.value : (obj[el.name]||false);
      else obj[el.name] = el.value;
    });
    localStorage.setItem('cw_onboard', JSON.stringify(obj));
  }

  // send saved onboarding data to Formspree (or any JSON endpoint)
  function submitToEndpoint(url, timeout = 3000){
    if(!url) return Promise.reject(new Error('No endpoint provided'));
    try{
      const payload = JSON.parse(localStorage.getItem('cw_onboard')||'{}');
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal
      }).then(r=>{
        if(!r.ok) throw new Error('Send failed: '+r.status);
        return r.json().catch(()=>({ok:true}));
      });
      const timeoutId = setTimeout(()=> controller.abort(), timeout);
      return fetchPromise.finally(()=> clearTimeout(timeoutId));
    }catch(err){
      return Promise.reject(err);
    }
  }

  // Send saved onboarding data to a Google Apps Script webapp that writes to Google Sheets.
  // Usage: Onboarding.submitToGoogleSheet('https://script.google.com/macros/s/XXX/exec')
  // The Apps Script should implement a doPost(e) handler that accepts JSON in e.postData.contents
  function submitToGoogleSheet(url, timeout = 8000){
    if(!url) return Promise.reject(new Error('No Google Apps Script URL provided'));
    try{
      const payload = JSON.parse(localStorage.getItem('cw_onboard')||'{}');
      // add a timestamp so rows can be ordered in the sheet
      payload._submittedAt = (new Date()).toISOString();
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        signal
      }).then(async r=>{
        const txt = await r.text().catch(()=>'');
        if(!r.ok) throw new Error('Send failed: '+r.status+' '+txt);
        // Apps Script often returns plain text; try to parse JSON fallback
        try{ return JSON.parse(txt); }catch(e){ return {ok:true, text: txt}; }
      });
      const timeoutId = setTimeout(()=> controller.abort(), timeout);
      return fetchPromise.finally(()=> clearTimeout(timeoutId));
    }catch(err){
      return Promise.reject(err);
    }
  }

  // attach auto-save
  document.addEventListener('input', ()=> saveForm());
  document.addEventListener('change', ()=> saveForm());

  window.Onboarding = { setProgress, restore, saveForm, submitToEndpoint, submitToGoogleSheet };
})();
