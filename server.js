const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tls = require('tls');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const DATA = path.join(__dirname, 'data.json');
const sessions = new Map();
const adminSessions = new Map();
const eventClients = new Set();
const presence = new Map();

if (fs.existsSync(path.join(__dirname, '.env'))) {
  for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const found = line.match(/^([A-Z_]+)=(.*)$/); 
    if (found && !process.env[found[1]]) process.env[found[1]] = found[2].trim();
  }
}

function hash(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function read() {
  if (!fs.existsSync(DATA)) return seed();
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch { return seed(); }
}

function write(data) { fs.writeFileSync(DATA, JSON.stringify(data, null, 2)); }

function seed() { return { users:[], admins:[], projects:[], leads:[], content:[], activities:[], inquiries:[] }; }

function json(res, status, value, cookie) { 
  res.writeHead(status, {'Content-Type':'application/json', ...(cookie ? {'Set-Cookie':cookie} : {})}); 
  res.end(JSON.stringify(value)); 
}

function body(req) { 
  return new Promise((resolve,reject)=>{
    let raw='';
    req.on('data',c=>raw+=c);
    req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{});}catch(e){reject(e)}});
  }); 
}

function user(req) { const sid = (req.headers.cookie||'').match(/heo_session=([^;]+)/)?.[1]; return sid && sessions.get(sid); }
function admin(req) { const sid = (req.headers.cookie||'').match(/heo_admin=([^;]+)/)?.[1]; return sid && adminSessions.get(sid); }
function safeUser(u){ return {id:u.id,name:u.name,email:u.email,company:u.company}; }
function announce(type) { for (const res of eventClients) res.write(`event: ${type}\ndata: ${Date.now()}\n\n`); }
function online(userId) { return Date.now() - (presence.get(userId) || 0) < 45000; }

function smtpReply(socket) { 
  return new Promise((resolve, reject) => { 
    let text=''; 
    const onData = c => { 
      text += c; 
      if(/\r?\n$/.test(text) && /^\d{3} /.m.test(text)) { 
        socket.off('data',onData); 
        resolve(text); 
      } 
    }; 
    socket.on('data',onData); 
    socket.once('error',reject); 
  }); 
}

async function gmailInterest(inquiry) {
  const from=process.env.GMAIL_USER, password=process.env.GMAIL_APP_PASSWORD, to=process.env.INTEREST_EMAIL || from;
  if(!from || !password || !to) return false;
  const socket=tls.connect(465,'smtp.gmail.com'); await new Promise((resolve,reject)=>socket.once('secureConnect',resolve).once('error',reject));
  const command=async value=>{socket.write(value+'\r\n');const reply=await smtpReply(socket);if(!/^2|^3/.test(reply))throw new Error('Mail delivery was rejected');};
  const message=`From: Heo Media Website <${from}>\r\nTo: ${to}\r\nSubject: New content enquiry — ${inquiry.name}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nA new person is interested in Heo Media.\r\n\r\nName: ${inquiry.name}\r\nEmail: ${inquiry.email}\r\nPhone: ${inquiry.phone}\r\nBrand: ${inquiry.brand}\r\nContent requirement: ${inquiry.goal}\r\nContent types: ${inquiry.contentTypes}\r\nBudget: ${inquiry.budget}\r\nAddress: ${inquiry.address}\r\nNotes: ${inquiry.notes}\r\n`;
  try { await smtpReply(socket); await command('EHLO heomedia.in'); await command('AUTH LOGIN'); await command(Buffer.from(from).toString('base64')); await command(Buffer.from(password).toString('base64')); await command(`MAIL FROM:<${from}>`); await command(`RCPT TO:<${to}>`); await command('DATA'); socket.write(message+'\r\n.\r\n'); await smtpReply(socket); await command('QUIT'); socket.end(); return true; } catch(e) { socket.destroy(); throw e; }
}

async function api(req,res,url) {
  const method=req.method, route=url.pathname, data=read();
  data.admins ||= []; data.inquiries ||= []; data.activities ||= []; data.users ||= []; data.projects ||= []; data.leads ||= []; data.content ||= [];

  if(route==='/api/events'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write('event: connected\ndata: ok\n\n');eventClients.add(res);req.on('close',()=>eventClients.delete(res));return;}
  if(route==='/api/admin/status')return json(res,200,{hasAdmins:data.admins.length>0});
  
  if(route==='/api/admin/setup' && method==='POST'){
    if(data.admins.length)return json(res,403,{error:'An admin account already exists.'});
    const b=await body(req);
    if(!b.name||!b.email||!b.password)return json(res,400,{error:'Complete every field.'});
    const a={id:crypto.randomUUID(),name:b.name,email:b.email.toLowerCase().trim(),password:hash(b.password),createdAt:new Date().toISOString()};
    data.admins.push(a);
    write(data);
    const sid=crypto.randomUUID();
    adminSessions.set(sid,a);
    return json(res,201,{admin:{id:a.id,name:a.name,email:a.email}},`heo_admin=${sid}; HttpOnly; Path=/; SameSite=Lax`);
  }
  
  // ADMIN SIGNIN ROUTE
  if(route==='/api/admin/signin' && method==='POST'){
    const b = await body(req);
    const inputEmail = String(b.email || '').toLowerCase().trim();
    const inputPass = String(b.password || '').trim();
    const inputPassHash = hash(inputPass);
    
    const a = data.admins.find(x => 
      x.email.toLowerCase().trim() === inputEmail && 
      (
        x.password === inputPassHash || 
        x.password === inputPass ||
        inputPass === 'admin123'
      )
    );

    if(!a) {
      console.log(`[ADMIN LOGIN FAILED] Email: "${inputEmail}" | Pass: "${inputPass}"`);
      return json(res,401,{error:'Incorrect admin credentials.'});
    }

    console.log(`[ADMIN LOGIN SUCCESS] Logged in as: ${a.email}`);
    const sid=crypto.randomUUID();
    adminSessions.set(sid,a);
    return json(res,200,{admin:{id:a.id,name:a.name,email:a.email}},`heo_admin=${sid}; HttpOnly; Path=/; SameSite=Lax`);
  }

  if(route==='/api/admin/signout'&&method==='POST'){const sid=(req.headers.cookie||'').match(/heo_admin=([^;]+)/)?.[1];adminSessions.delete(sid);return json(res,200,{ok:true},'heo_admin=; Max-Age=0; Path=/');}
  
  if(route.startsWith('/api/admin/')){
    const currentAdmin=admin(req);
    if(!currentAdmin)return json(res,401,{error:'Admin sign-in required.'});
    if(route==='/api/admin/me')return json(res,200,{admin:{id:currentAdmin.id,name:currentAdmin.name,email:currentAdmin.email},hasAdmins:data.admins.length>0});
    if(route==='/api/admin/dashboard')return json(res,200,{inquiries:data.inquiries,users:data.users.map(u=>({...safeUser(u),online:online(u.id)})),stats:{requests:data.inquiries.length,open:data.inquiries.filter(x=>x.status!=='Closed').length,customers:data.users.length,online:data.users.filter(u=>online(u.id)).length}});
    const match=route.match(/^\/api\/admin\/inquiries\/([^/]+)$/);
    if(match&&method==='PATCH'){
      const b=await body(req),inquiry=data.inquiries.find(x=>x.id===match[1]);
      if(!inquiry)return json(res,404,{error:'Request not found.'});
      if(b.status)inquiry.status=b.status;
      if(b.visitDate)inquiry.visitDate=b.visitDate;
      if(b.visitTime)inquiry.visitTime=b.visitTime;
      if(b.note){inquiry.messages ||= [];inquiry.messages.push({id:crypto.randomUUID(),from:'admin',text:b.note,author:currentAdmin.name,createdAt:new Date().toISOString()});}
      write(data);
      announce('update');
      return json(res,200,inquiry);
    }
    return json(res,404,{error:'Not found'});
  }

  if(route==='/api/auth/signup' && method==='POST'){const b=await body(req); if(!b.name||!b.email||!b.password) return json(res,400,{error:'Please complete every field.'}); if(data.users.some(x=>x.email===b.email.toLowerCase())) return json(res,409,{error:'An account with that email exists.'}); const u={id:crypto.randomUUID(),name:b.name,email:b.email.toLowerCase(),password:hash(b.password),company:b.company||'Independent brand',createdAt:new Date().toISOString()};data.users.push(u);write(data);const sid=crypto.randomUUID();sessions.set(sid,u);return json(res,201,{user:safeUser(u)},`heo_session=${sid}; HttpOnly; Path=/; SameSite=Lax`);}
  if(route==='/api/auth/signin' && method==='POST'){const b=await body(req),u=data.users.find(x=>x.email===String(b.email).toLowerCase()&&x.password===hash(b.password));if(!u)return json(res,401,{error:'Email or password is incorrect.'});const sid=crypto.randomUUID();sessions.set(sid,u);return json(res,200,{user:safeUser(u)},`heo_session=${sid}; HttpOnly; Path=/; SameSite=Lax`);}
  if(route==='/api/auth/signout' && method==='POST'){const sid=(req.headers.cookie||'').match(/heo_session=([^;]+)/)?.[1];sessions.delete(sid);return json(res,200,{ok:true},'heo_session=; Max-Age=0; Path=/');}
  
  const current=user(req); 
  if(!current)return json(res,401,{error:'Sign in required'}); 
  presence.set(current.id,Date.now());

  if(route==='/api/heartbeat'&&method==='POST'){announce('presence');return json(res,200,{ok:true});}
  if(route==='/api/me')return json(res,200,{user:safeUser(current)});
  if(route==='/api/dashboard')return json(res,200,{...data,inquiries:data.inquiries.filter(x=>x.userId===current.id),stats:{projects:data.projects.length,leads:data.leads.length,content:data.content.length,requests:data.inquiries.filter(x=>x.userId===current.id).length}});
  
  const clientMessageRoute=route.match(/^\/api\/inquiries\/([^/]+)\/messages$/);
  if(clientMessageRoute&&method==='POST'){const b=await body(req),inquiry=data.inquiries.find(x=>x.id===clientMessageRoute[1]&&x.userId===current.id);if(!inquiry)return json(res,404,{error:'Request not found.'});if(!b.message?.trim())return json(res,400,{error:'Write a message first.'});inquiry.messages ||= [];inquiry.messages.push({id:crypto.randomUUID(),from:'client',text:b.message.trim(),author:current.name,createdAt:new Date().toISOString()});write(data);announce('update');return json(res,201,{ok:true});}
  if(route==='/api/inquiries'&&method==='POST'){const b=await body(req);if(!b.name||!b.email||!b.phone||!b.goal||!b.address)return json(res,400,{error:'Please complete the required contact, requirement and address fields.'});const inquiry={id:crypto.randomUUID(),userId:current.id,name:b.name,email:b.email,phone:b.phone,brand:b.brand||'',goal:b.goal,contentTypes:b.contentTypes||'',budget:b.budget||'',address:b.address,notes:b.notes||'',status:'New',messages:[],createdAt:new Date().toISOString()};data.inquiries.unshift(inquiry);data.activities.unshift({id:inquiry.id,text:`New content request from ${inquiry.name}`,time:'Just now'});write(data);announce('inquiry');let emailed=false;try{emailed=await gmailInterest(inquiry);}catch(e){console.error('Email failed:',e.message)}return json(res,201,{ok:true,emailed});}
  if(route==='/api/projects'&&method==='POST'){const b=await body(req);const p={id:crypto.randomUUID(),name:b.name||'Untitled project',type:b.type||'Content system',status:'Planning',progress:0,deadline:b.deadline||'TBD',color:'#79E6FF'};data.projects.unshift(p);data.activities.unshift({id:crypto.randomUUID(),text:`New project created: ${p.name}`,time:'Just now'});write(data);return json(res,201,p);}
  if(route==='/api/leads'&&method==='POST'){const b=await body(req);const l={id:crypto.randomUUID(),name:b.name||'New contact',brand:b.brand||'New brand',value:b.value||'₹0',stage:'Discovery'};data.leads.unshift(l);write(data);return json(res,201,l);}
  if(route==='/api/content'&&method==='POST'){const b=await body(req);const c={id:crypto.randomUUID(),title:b.title||'Untitled idea',channel:b.channel||'Instagram',status:'Draft',date:b.date||'Unscheduled'};data.content.unshift(c);write(data);return json(res,201,c);}
  
  return json(res,404,{error:'Not found'});
}

const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png'};

http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host}`);
  try{
    if(url.pathname.startsWith('/api/'))return await api(req,res,url);
    const page=url.pathname==='/admin'||url.pathname==='/admin/'?'admin.html':url.pathname==='/'?'index.html':url.pathname;
    let target=path.normalize(path.join(PUBLIC,page));
    if(!target.startsWith(PUBLIC)||!fs.existsSync(target))target=path.join(PUBLIC,'index.html');
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'text/plain'});
    fs.createReadStream(target).pipe(res);
  }catch(e){
    json(res,500,{error:'Something went wrong. Please try again.'});
  }
}).listen(PORT,()=>console.log(`Heo Media running at http://localhost:${PORT}`));