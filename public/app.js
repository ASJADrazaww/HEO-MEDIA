const $ = (s, e=document) => e.querySelector(s);
const app = $('#app');
let state = { user:null, data:null, view:'overview' };

const api = async (url, options={}) => { 
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options }); 
  const j = await r.json(); 
  if(!r.ok) throw new Error(j.error || 'Request failed'); 
  return j; 
};

const icon = { overview:'◈', request:'✦', projects:'◫', calendar:'◷', library:'▣', leads:'◎', analytics:'◔' };

const navbarHTML = `
  <nav class="nav">
    <div class="logo" onclick="landing()" style="cursor:pointer">
      <img src="/logo.png" alt="Heo Media">
    </div>
    <button class="menu-toggle" aria-label="Toggle Menu"><span></span><span></span><span></span></button>
    <div class="navlinks">
      <a onclick="goMarketing('services')">01 Services</a>
      <a onclick="goMarketing('content-wing')">02 Content Wing</a>
      <a onclick="goMarketing('about')">03 About</a>
      <a href="https://www.instagram.com/heomedia_in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener">04 Instagram</a>
    </div>
    <button class="pill" onclick="goAuth('signup')">Build with us <span>↗</span></button>
  </nav>
`;

function landing(){ 
  app.innerHTML=`
    <div class="orb one"></div><div class="orb two"></div>
    ${navbarHTML}
    <main class="hero">
      <section>
        <div class="eyebrow">Mumbai / Everywhere &nbsp; · &nbsp; Est. 2024</div>
        <h1>We build the <em>content wing</em> your company needs to grow.</h1>
        <p>HeoMedia builds and operates content systems for ambitious companies — from strategy and scripting to production, distribution and continuous improvement.</p>
        <div class="actions">
          <button class="button" onclick="goAuth('signup')">Start a project ↗</button>
          <a class="button alt" href="https://www.instagram.com/heomedia_in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener">Instagram ↗</a>
        </div>
      </section>
      <section class="hero-visual">
        <div class="float-card tiny"><span>Creative intelligence</span><div class="bar"></div></div>
        <div class="float-card card-main"><div class="signal"></div><h3>Every good brand deserves a world, not just a feed.</h3><small>HEO / CONTENT INTELLIGENCE</small><div class="ring"></div></div>
        <div class="float-card mini"><span>System health: Ready</span><div class="bar"></div></div>
      </section>
    </main>
    
    <!-- Infrastructure Section -->
    <section class="company-pillars" style="padding: 60px 5.5vw; border-top: 1px solid var(--line);">
      <div style="max-width: 800px;">
        <div class="eyebrow">THE INFRASTRUCTURE</div>
        <h2 style="font-size: clamp(28px, 3.5vw, 42px); letter-spacing: -1px; line-height: 1.2; margin: 12px 0 24px 0;">
          Your company has Sales.<br>
          Your company has Operations.<br>
          <span style="color: var(--accent-blue);">Your company needs a Content Wing.</span>
        </h2>
        <p style="font-size: 16px; line-height: 1.7; color: var(--muted); margin-bottom: 24px;">
          Your customers are constantly consuming content. We build the system that keeps your brand visible, relevant and remembered.
        </p>
      </div>
    </section>

    <!-- System Expansion Section -->
    <section class="system-explanation" style="padding: 60px 5.5vw; background: #eeeff3; border-top: 1px solid var(--line);">
      <div style="max-width: 800px;">
        <div class="eyebrow">BUILT TO COMPOUND</div>
        <h2 style="font-size: clamp(26px, 3vw, 38px); letter-spacing: -1px; line-height: 1.2; margin: 12px 0 20px 0;">
          Content built to compound, not just to fill a calendar.
        </h2>
        <p style="font-size: 16px; line-height: 1.7; color: var(--muted);">
          Great content isn't born from random posts; it runs on architecture. We align research, production, and distribution so your brand builds organic authority every single day without burning out your internal team.
        </p>
      </div>
    </section>

    <section class="landing-pages">
      <div><div class="eyebrow">EXPLORE HEO</div><h2>Built to give a brand its own gravity.</h2></div>
      <div class="page-links">
        <button onclick="goMarketing('services')"><small>01</small> Services <b>↗</b></button>
        <button onclick="goMarketing('content-wing')"><small>02</small> Content Wing <b>↗</b></button>
        <button onclick="goMarketing('about')"><small>03</small> About <b>↗</b></button>
        <a href="https://www.instagram.com/heomedia_in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener"><small>04</small> Instagram <b>↗</b></a>
      </div>
    </section>
    <div class="marquee"><span>STRATEGY &nbsp; ✦ &nbsp; SOCIAL SYSTEMS &nbsp; ✦ &nbsp; CREATIVE DIRECTION &nbsp; ✦ &nbsp; CULTURAL INTELLIGENCE &nbsp; ✦ &nbsp; STRATEGY &nbsp; ✦ &nbsp; SOCIAL SYSTEMS &nbsp; ✦ &nbsp;</span></div>`; 
}

function goMarketing(page){
  if(page === 'about'){
    app.innerHTML=`
      <div class="orb one"></div><div class="orb two"></div>
      ${navbarHTML}
      <main class="main-content" style="padding: 60px 5.5vw; max-width: 800px; margin: 0 auto;">
        <div class="eyebrow">ABOUT HEOMEDIA</div>
        <h1 style="font-size: clamp(32px, 4vw, 48px); letter-spacing: -1.5px; margin: 16px 0 28px 0; line-height: 1.1;">We believe every ambitious company needs a content wing.</h1>
        <div style="font-size: 16px; line-height: 1.8; color: var(--muted); display: flex; flex-direction: column; gap: 18px;">
          <p>The way people discover, evaluate and remember businesses has changed.</p>
          <p>Today, attention is earned through content — consistently, creatively and strategically.</p>
          <p><strong style="color: var(--ink);">HeoMedia exists to build that system.</strong></p>
          <p>We work with ambitious companies to build and operate their content wing — combining strategy, research, creative development, production, distribution and performance insights into one connected system.</p>
          <p>We don't believe in creating content just to fill a calendar.</p>
          <p>We create content with a purpose: to make brands visible, memorable and impossible to ignore.</p>
          <p>From the first idea to the final piece of content, we build the process around your audience, your positioning and your business goals.</p>
        </div>
      </main>
    `;
    return;
  }

  const info = {
    services: ['Services', 'We make the strategy, social system, visuals and films that make a brand feel inevitable.', 'Strategy · Social systems · Reels & films · Photography · Campaigns'],
    'content-wing': ['Content Wing', 'Your company has Sales. Your company has Operations. Your company needs a Content Wing.', 'Strategy · Research · Creative Development · Production · Distribution · Performance Insights'],
    connect: ['Let’s connect', 'Have a brand, a launch, or a story waiting to become something bigger?', 'Follow along or start your project today.']
  }[page] || ['Content Wing', 'Your company has Sales. Your company has Operations. Your company needs a Content Wing.', 'Strategy · Research · Creative Development · Production · Distribution · Performance Insights'];
  
  app.innerHTML=`
    <div class="orb one"></div><div class="orb two"></div>
    ${navbarHTML}
    <main class="hero">
      <section>
        <div class="eyebrow">HEO MEDIA / ${page.toUpperCase()}</div>
        <h1>${info[0]}</h1>
        <p>${info[1]}</p>
        <p class="eyebrow" style="margin-top:26px">${info[2]}</p>
        <div class="actions">
          <button class="button" onclick="goAuth('signup')">Start a project ↗</button>
        </div>
      </section>
      <section class="hero-visual">
        <div class="float-card card-main"><div class="signal"></div><h3>${info[2]}</h3><small>HEO MEDIA / 2026</small><div class="ring"></div></div>
      </section>
    </main>`;
}

function auth(mode='signin'){
  app.innerHTML=`
    <div class="auth">
      <section class="auth-side">
        <div class="logo" onclick="landing()" style="cursor:pointer">
          <img src="/logo.png" alt="Heo Media" style="filter: brightness(0) invert(1); height: 28px;">
        </div>
        <div>
          <div class="eyebrow" style="color: rgba(247,246,239,0.7);">THE CLIENT PORTAL</div>
          <h1 style="color: var(--paper); font-size: clamp(36px, 4vw, 52px); letter-spacing: -1.5px; margin-top: 24px;">Make every<br>post mean <em style="font-family:'Playfair Display'; color:var(--lime);">more.</em></h1>
        </div>
        <small style="color: rgba(247,246,239,0.7); font-family:'DM Mono',monospace;">© 2026 HEO MEDIA &nbsp; / &nbsp; CONTENT IS INFRASTRUCTURE</small>
      </section>
      <section class="auth-form">
        <form class="formbox" id="authForm">
          <div class="logo" onclick="landing()" style="cursor:pointer; margin-bottom: 20px;">
            <img src="/logo.png" alt="Heo Media" style="height: 24px;">
          </div>
          <h2>${mode==='signin'?'Welcome back.':'Let’s build something.'}</h2>
          <p>${mode==='signin'?'Sign in to your content command centre.':'Create your workspace in under a minute.'}</p>
          ${mode==='signup'?`<label class="field">YOUR NAME<input name="name" required></label><label class="field">COMPANY / BRAND<input name="company"></label>`:''}
          <label class="field">WORK EMAIL<input type="email" name="email" required></label>
          <label class="field">PASSWORD<input type="password" name="password" required minlength="6"></label>
          <div class="error" id="authError"></div>
          <button class="button submit" style="width:100%; justify-content:center;">${mode==='signin'?'Enter your workspace →':'Create workspace →'}</button>
          <div class="switch">${mode==='signin'?'New around here?':'Already have an account?'} <a onclick="goAuth('${mode==='signin'?'signup':'signin'}')">${mode==='signin'?'Create an account':'Sign in'}</a></div>
        </form>
      </section>
    </div>`;
  $('#authForm').onsubmit = async e => {
    e.preventDefault();
    const b = Object.fromEntries(new FormData(e.target));
    try {
      const r = await api('/api/auth/'+mode, { method:'POST', body:JSON.stringify(b) });
      state.user = r.user; 
      await load();
    } catch(err) {
      $('#authError').textContent = err.message;
    }
  };
}

function shell(){
  const nav = ['overview','request','projects','calendar','library','leads','analytics'];
  app.innerHTML = `
    <aside class="side">
      <div class="logo" onclick="landing()"><img src="/logo.png" alt="Heo Media" style="height: 24px;"></div>
      <div class="workspace">WORKSPACE</div>
      ${nav.map(v => `<button class="navitem ${state.view===v?'active':''}" onclick="navigate('${v}')"><i class="ico">${icon[v]}</i><span>${v==='request'?'Start a request':v[0].toUpperCase()+v.slice(1)}</span></button>`).join('')}
      <div class="side-bottom"><button class="navitem" onclick="signout()"><i class="ico">↗</i><span>Sign out</span></button></div>
    </aside>
    <main class="main" id="content"></main>
  `;
  renderView();
}

function header(title, sub){
  return `<div class="topbar"><div><h1>${title}</h1><p>${sub}</p></div><div class="user"><span>${state.user.name}</span><div class="avatar">${state.user.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div></div></div>`;
}

function overview(){
  let d = state.data, accepted = d.inquiries.find(x => x.status==='Accepted');
  return `
    ${header('Your workspace','Your content requests, visits and conversations live here.')}
    ${accepted ? `<section class="visit-highlight"><div><div class="eyebrow" style="color:#0031b3;">✓ REQUEST ACCEPTED</div><h2>Your Heo Media visit is confirmed.</h2><p><b>${accepted.visitDate||'Date being confirmed'}</b> ${accepted.visitTime?'at '+accepted.visitTime:''} · ${accepted.address}</p></div><button class="button" onclick="openChat('${accepted.id}')">Message your team →</button></section>` : ''}
    <section class="panel" style="padding:32px;max-width:760px">
      <div class="eyebrow">CONTENT BRIEF</div>
      <h2 style="font-size:31px;letter-spacing:-2px;margin:12px 0">What would you like us to create?</h2>
      <p style="color:var(--muted);line-height:1.7;max-width:520px;margin-bottom:20px;">Tell us about your brand, the content you need, and where you’re based. Your enquiry goes directly to the Heo Media team.</p>
      <button class="button" onclick="navigate('request')">Start a content request →</button>
    </section>
    <section class="grid">
      <div class="panel">
        <div class="panel-head"><h3>Your active projects</h3><button class="link" onclick="navigate('projects')">View all</button></div>
        ${d.projects.length ? d.projects.map(p => `<div class="project"><i class="project-dot" style="background:${p.color}"></i><div><strong>${p.name}</strong><small>${p.type}</small></div></div>`).join('') : '<div class="empty">No projects yet. Submit a content request to get started.</div>'}
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Your requests</h3></div>
        ${d.inquiries.length ? d.inquiries.map(x => `<div class="activity"><div class="activity-dot">✦</div><div><p>${x.status==='Accepted'&&x.visitDate?`Visit confirmed: ${x.visitDate} at ${x.visitTime}`:x.goal}</p><time>${x.status||'New'} · <button class="link" onclick="openChat('${x.id}')">Open chat</button></time></div></div>`).join('') : '<div class="empty">No requests submitted yet.</div>'}
      </div>
    </section>
  `;
}

function request(){
  return `
    ${header('Start a content request','Share a few details and our team will get back to you.')}
    <section class="panel" style="max-width:850px">
      <form id="interestForm">
        <div style="width:100%;">
          <h2>Tell us what you need.</h2>
          <p>Fields marked required help us prepare the right first conversation.</p>
          <div class="row2">
            <label class="field">YOUR NAME *<input name="name" required></label>
            <label class="field">EMAIL ADDRESS *<input type="email" name="email" required></label>
          </div>
          <div class="row2">
            <label class="field">PHONE / WHATSAPP *<input name="phone" required></label>
            <label class="field">BRAND / COMPANY<input name="brand"></label>
          </div>
          <label class="field">WHAT DO YOU WANT CONTENT FOR? *
            <select name="goal" required>
              <option value="">Select your goal</option>
              <option>Build brand awareness</option>
              <option>Launch a product or service</option>
              <option>Grow social media</option>
              <option>Generate leads and sales</option>
              <option>Event or campaign coverage</option>
              <option>Something else</option>
            </select>
          </label>
          <label class="field">CONTENT YOU NEED
            <select name="contentTypes">
              <option>Social media content</option>
              <option>Reels / video production</option>
              <option>Brand strategy and content system</option>
              <option>Photography</option>
              <option>Full content package</option>
            </select>
          </label>
          <div class="row2">
            <label class="field">MONTHLY BUDGET
              <select name="budget">
                <option>Not sure yet</option>
                <option>Under ₹25,000</option>
                <option>₹25,000 – ₹50,000</option>
                <option>₹50,000 – ₹1,00,000</option>
                <option>₹1,00,000+</option>
              </select>
            </label>
            <label class="field">BUSINESS ADDRESS *<input name="address" required placeholder="City, state / full address"></label>
          </div>
          <label class="field">ANYTHING ELSE WE SHOULD KNOW?<input name="notes" placeholder="Your timing, inspiration, links, or a quick brief"></label>
          <div class="error" id="requestError"></div>
          <button class="button submit">Send request to Heo Media →</button>
        </div>
      </form>
    </section>
  `;
}

function records(kind){
  const config = {
    projects:['Projects','Everything moving through your studio.',['Project','Service','Status','Progress']],
    leads:['Brand leads','A quieter, smarter sales pipeline.',['Contact','Brand','Value','Stage']],
    library:['Content library','The ideas your audience is waiting for.',['Content piece','Channel','Status','Publish date']]
  };
  let [title, sub, cols] = config[kind], arr = kind==='library' ? state.data.content : state.data[kind];
  return `
    ${header(title, sub)}
    <div class="view-head">
      <h2>${arr.length} ${kind==='library'?'pieces':kind}</h2>
      <button class="button" onclick="openModal('${kind==='library'?'content':kind.slice(0,-1)}')">+ ${kind==='library'?'Add content':kind==='leads'?'New lead':'New project'}</button>
    </div>
    <div class="table">
      <div class="row head">${cols.map(x=>`<span>${x}</span>`).join('')}</div>
      ${arr.map(x => kind==='projects' ? `<div class="row"><strong>${x.name}</strong><span>${x.type}</span><span class="badge ${x.status==='Review'?'review':x.status==='Planning'?'planning':''}">${x.status}</span><span>${x.progress}%</span></div>` : kind==='leads' ? `<div class="row"><strong>${x.name}</strong><span>${x.brand}</span><strong>${x.value}</strong><span class="badge ${x.stage==='Proposal'?'review':''}">${x.stage}</span></div>` : `<div class="row"><strong>${x.title}</strong><span>${x.channel}</span><span class="badge ${x.status==='In review'?'review':''}">${x.status}</span><span>${x.date}</span></div>`).join('')}
    </div>
  `;
}

function calendar(){ return `${header('Content calendar','Your scheduled content will appear here once a project begins.')}<section class="panel"><div class="empty">No content is scheduled yet.</div></section>`; }
function analytics(){ return `${header('Analytics','Performance reporting will be available after your content goes live.')}<section class="panel"><div class="empty">No analytics data available yet.</div></section>`; }

function renderView(){
  let html = state.view==='overview' ? overview() : state.view==='request' ? request() : state.view==='calendar' ? calendar() : state.view==='analytics' ? analytics() : records(state.view);
  $('#content').innerHTML = html;
  if(state.view==='request') $('#interestForm').onsubmit = submitInterest;
}

function navigate(v){ state.view = v; shell(); }
function goAuth(m){ auth(m); }
async function load(){ state.data = await api('/api/dashboard'); shell(); }
async function signout(){ await api('/api/auth/signout',{method:'POST'}); state={user:null, data:null, view:'overview'}; landing(); }

function openChat(id){
  const reqObj = state.data.inquiries.find(x => x.id === id);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal" id="modal">
      <div class="modal-card chat-modal">
        <button class="chat-close" onclick="$('#modal').remove()">×</button>
        <div class="eyebrow">HEO MEDIA CONVERSATION</div>
        <h2>${reqObj.goal}</h2>
        <div class="client-messages">
          ${(reqObj.messages||[]).map(m => `<article class="${m.from}"><small>${m.from==='admin'?'Heo Media':'You'} · ${new Date(m.createdAt).toLocaleString()}</small><p>${m.text}</p></article>`).join('') || '<p class="empty">Your Heo Media team is ready to help.</p>'}
        </div>
        <form id="clientChat" style="display:flex; gap:8px;">
          <input name="message" required placeholder="Write a message to Heo Media…" style="flex:1; padding:12px 16px; border:1px solid var(--line); border-radius:8px; font-family:inherit; font-size:14px;">
          <button class="button">Send</button>
        </form>
      </div>
    </div>
  `);
  $('#clientChat').onsubmit = async e => {
    e.preventDefault();
    const btn = $('#clientChat button');
    btn.disabled = true;
    try {
      await api('/api/inquiries/'+id+'/messages',{method:'POST',body:JSON.stringify({message:new FormData(e.target).get('message')})});
      $('#modal').remove();
      await load();
      openChat(id);
    } catch(err) {
      alert(err.message);
      btn.disabled = false;
    }
  };
}

async function submitInterest(e){
  e.preventDefault();
  const button = $('#interestForm button');
  button.disabled = true;
  button.textContent = 'Sending…';
  try {
    await api('/api/inquiries',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});
    $('#interestForm').innerHTML = '<div style="width:100%;padding:20px 0"><div class="eyebrow">REQUEST SENT</div><h2>Thank you — we have your details.</h2><p>Heo Media will be in touch soon.</p><button class="button" style="margin-top:16px;" onclick="navigate(\'overview\')">Back to workspace</button></div>';
  } catch(err) {
    $('#requestError').textContent = err.message;
    button.disabled = false;
    button.textContent = 'Send request to Heo Media →';
  }
}

function openModal(type){
  // Optional modal opening utility for creation flows if needed
}

// Initial Landing Boot
if (typeof landing === 'function') {
  landing();
}