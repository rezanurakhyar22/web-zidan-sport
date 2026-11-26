(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20464,60107,e=>{"use strict";var t=e.i(43476);e.i(23842);var s=e.i(51390),a=e.i(17595),i=e.i(18566),r=e.i(71645),n=e.i(5766),l=e.i(55487);let o=["/dashboard","/dashboard/categories","/dashboard/contingents","/dashboard/coaches","/dashboard/athletes"];function d(d){let c=c=>{let u=(0,i.useRouter)(),h=(0,i.usePathname)(),{isAuthenticated:x,user:m}=(0,l.useSelector)(e=>e.auth),[p,g]=(0,r.useState)(!1),f=async()=>{let{authRepo:t}=await e.A(31756),s=a.default.get("zs_refreshToken");!x&&s?await t.refreshToken(u):x||s||u.replace("/auth/login"),g(!0)};return((0,r.useEffect)(()=>{f()},[x]),(0,r.useEffect)(()=>{p&&x&&m&&0!=m.access&&o.includes(h)&&(n.default.error("Anda sedang tidak login sebagai admin!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}}),u.replace("/"),a.default.remove("zs_refreshToken"),a.default.remove("zs_v2_token"))},[p]),p)?(0,t.jsx)(d,{...c}):(0,t.jsx)(s.LoaderModal,{})};return c.displayName=`withAuth(${d.displayName||d.name||"Component"})`,c}e.s(["withAuth",()=>d],60107),e.s([],20464)},80936,e=>{"use strict";var t=e.i(14108);e.s(["usersRepo",0,t])},59772,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(63662);e.i(23842);var i=e.i(78367),r=e.i(23720),n=e.i(81914),l=e.i(2153),o=e.i(46932),d=e.i(88653);e.i(20464);var c=e.i(60107),u=e.i(55487);e.i(82109);var h=e.i(67825),x=e.i(90357);e.i(12243);var m=e.i(19507),p=e.i(80936),g=e.i(18566),f=e.i(5766);
const API_BASE="https://api-v2.zidansport.org/api/v2";
const TOAST_OPT={duration:3500,style:{fontSize:"12px",lineHeight:"16px"}};
function getAuthToken(reduxToken){
  if(reduxToken)return reduxToken;
  if("undefined"==typeof document)return "";
  let m=document.cookie.match(/(?:^|;\s*)zs_v2_token=([^;]+)/);
  return m?decodeURIComponent(m[1]):"";
}
let y=(0,l.withWrapSuspense)((0,c.withAuth)(()=>{
  let authState=(0,u.useSelector)(st=>st.auth),
    e=authState?.user,
    l=(0,g.useRouter)(),
    [c,y]=(0,s.useState)(!1),
    [j,v]=(0,s.useState)(!1),
    [b,w]=(0,s.useState)(!1),
    [N,k]=(0,s.useState)(""),
    [S,C]=(0,s.useState)(""),
    [P,A]=(0,s.useState)(""),
    [z,R]=(0,s.useState)(""),
    [tfOpen,setTfOpen]=(0,s.useState)(!1),
    [tfLoadingStatus,setTfLoadingStatus]=(0,s.useState)(!0),
    [tfEnabled,setTfEnabled]=(0,s.useState)(!1),
    [tfRemaining,setTfRemaining]=(0,s.useState)(0),
    [tfBusy,setTfBusy]=(0,s.useState)(!1),
    [tfEnablePass,setTfEnablePass]=(0,s.useState)(""),
    [tfSetup,setTfSetup]=(0,s.useState)(null),
    [tfVerifyCode,setTfVerifyCode]=(0,s.useState)(""),
    [tfSavedCodes,setTfSavedCodes]=(0,s.useState)(null),
    [tfRegenPass,setTfRegenPass]=(0,s.useState)(""),
    [tfDisablePass,setTfDisablePass]=(0,s.useState)(""),
    [copiedKey,setCopiedKey]=(0,s.useState)("");

  let loadTwoFactorStatus=async()=>{
    let token=getAuthToken(authState?.token);
    if(!token){setTfLoadingStatus(!1);return}
    try{
      let res=await fetch(`${API_BASE}/auth/2fa/status`,{headers:{Authorization:`Bearer ${token}`}}),payload=await res.json().catch(()=>({}));
      if(res.ok&&payload?.data){
        setTfEnabled(Boolean(payload.data.enabled));
        setTfRemaining(Number(payload.data.remaining_backup_codes||0));
      }
    }catch(err){}finally{setTfLoadingStatus(!1)}
  };

  (0,s.useEffect)(()=>{loadTwoFactorStatus()},[authState?.token,e?.id]);

  let copyText=async(text,label)=>{
    try{
      await navigator.clipboard.writeText(text);
      setCopiedKey(label);
      f.default.success("Berhasil disalin ke clipboard!",TOAST_OPT);
      window.setTimeout(()=>setCopiedKey(cur=>cur===label?"":cur),2500);
    }catch(err){
      f.default.error("Gagal menyalin otomatis. Silakan salin manual.",TOAST_OPT);
    }
  };

  let downloadBackupCodes=codes=>{
    let text=["Zidan Sport - Backup Codes 2FA",`Akun: ${e?.email||""}`,"Setiap kode hanya dapat digunakan satu kali.","",...codes,""].join("\n");
    let blob=new Blob([text],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="zidansport-2fa-backup-codes.txt";document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
  };

  let handleStart2FA=async ev=>{
    ev.preventDefault();
    if(!tfEnablePass)return void f.default.error("Masukkan password akun terlebih dahulu.",TOAST_OPT);
    let token=getAuthToken(authState?.token);
    setTfBusy(!0);
    try{
      let res=await fetch(`${API_BASE}/auth/2fa/enable`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({password:tfEnablePass})}),payload=await res.json().catch(()=>({}));
      if(!res.ok||!payload?.data?.qr_data_url){
        f.default.error(payload?.message||"Gagal memulai aktivasi 2FA.",TOAST_OPT);
        return;
      }
      setTfSetup(payload.data);
      setTfEnablePass("");
      setTfVerifyCode("");
    }catch(err){
      f.default.error("Gagal menghubungi server 2FA.",TOAST_OPT);
    }finally{setTfBusy(!1)}
  };

  let handleVerify2FASetup=async ev=>{
    ev.preventDefault();
    let code=String(tfVerifyCode||"").replace(/\s+/g,"");
    if(!/^\d{6}$/.test(code))return void f.default.error("Masukkan kode 6 digit dari aplikasi authenticator.",TOAST_OPT);
    let token=getAuthToken(authState?.token);
    setTfBusy(!0);
    try{
      let res=await fetch(`${API_BASE}/auth/2fa/verify-setup`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({code})}),payload=await res.json().catch(()=>({}));
      if(!res.ok){
        f.default.error(payload?.message||"Kode verifikasi tidak valid.",TOAST_OPT);
        return;
      }
      let codes=tfSetup?.backup_codes||[];
      setTfEnabled(!0);
      setTfRemaining(codes.length);
      setTfSetup(null);
      setTfVerifyCode("");
      if(codes.length)setTfSavedCodes(codes);
      f.default.success("Autentikasi dua faktor (2FA) berhasil diaktifkan!",TOAST_OPT);
    }catch(err){
      f.default.error("Gagal memverifikasi kode 2FA.",TOAST_OPT);
    }finally{setTfBusy(!1)}
  };

  let handleRegenCodes=async ev=>{
    ev.preventDefault();
    if(!tfRegenPass)return void f.default.error("Masukkan password untuk membuat ulang backup codes.",TOAST_OPT);
    let token=getAuthToken(authState?.token);
    setTfBusy(!0);
    try{
      let res=await fetch(`${API_BASE}/auth/2fa/regenerate-backup-codes`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({password:tfRegenPass})}),payload=await res.json().catch(()=>({}));
      if(!res.ok||!payload?.data?.backup_codes){
        f.default.error(payload?.message||"Gagal membuat ulang backup codes.",TOAST_OPT);
        return;
      }
      setTfSavedCodes(payload.data.backup_codes);
      setTfRemaining(payload.data.backup_codes.length);
      setTfRegenPass("");
      f.default.success("Backup codes baru berhasil dibuat!",TOAST_OPT);
    }catch(err){
      f.default.error("Terjadi kesalahan saat membuat ulang backup codes.",TOAST_OPT);
    }finally{setTfBusy(!1)}
  };

  let handleDisable2FA=async ev=>{
    ev.preventDefault();
    if(!tfDisablePass)return void f.default.error("Masukkan password untuk menonaktifkan 2FA.",TOAST_OPT);
    let token=getAuthToken(authState?.token);
    setTfBusy(!0);
    try{
      let res=await fetch(`${API_BASE}/auth/2fa/disable`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({password:tfDisablePass})}),payload=await res.json().catch(()=>({}));
      if(!res.ok){
        f.default.error(payload?.message||"Gagal menonaktifkan 2FA.",TOAST_OPT);
        return;
      }
      setTfEnabled(!1);
      setTfRemaining(0);
      setTfSetup(null);
      setTfSavedCodes(null);
      setTfDisablePass("");
      f.default.success("Autentikasi dua faktor telah dinonaktifkan.",TOAST_OPT);
    }catch(err){
      f.default.error("Terjadi kesalahan saat menonaktifkan 2FA.",TOAST_OPT);
    }finally{setTfBusy(!1)}
  };

  let B=async()=>{if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(N))return void f.default.error("Email tidak valid!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}});let{status:st,data:dt}=await p.usersRepo.updateUser(e.id,{email:N});st&&(f.default.success("Email berhasil diperbarui!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}}),x.store.dispatch((0,h.setUserAction)(dt.data)),k(dt.data.email)),y(!1)},
    I=async()=>{if(P!==z)return void f.default.error("Password baru dan konfirmasi tidak cocok!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}});if(P.length<8)return void f.default.error("Password minimal 8 karakter!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}});let{status:st,data:dt}=await p.usersRepo.updateUser(e.id,{password:P,confirm_password:z});st&&(f.default.success("Password berhasil diperbarui!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}}),x.store.dispatch((0,h.setUserAction)(dt.data))),v(!1)},
    T=async()=>{let{status:st,data:dt}=await p.usersRepo.updateUser(e.id,{phone:S});st&&(f.default.success("Nomor telepon berhasil diperbarui!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}}),x.store.dispatch((0,h.setUserAction)(dt.data)),C(dt.data.phone)),w(!1)},
    U=async()=>await m.authRepo.logout(l);

  return(0,t.jsx)(i.DashboardLayout,{children:(0,t.jsx)("div",{className:"min-h-screen bg-gray-50",children:(0,t.jsx)("div",{className:"w-full md:max-w-4xl",children:(0,t.jsxs)("div",{className:"bg-white rounded-xl border divide-y overflow-hidden",children:[
    e?.access!=3&&(0,t.jsxs)(t.Fragment,{children:[
      (0,t.jsxs)("div",{className:"flex justify-between items-center p-4",children:[
        (0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Nomor Telepon"}),(0,t.jsx)("p",{className:"text-gray-800 font-medium",children:e?.phone})]}),
        (0,t.jsxs)("button",{onClick:()=>w(!b),className:"flex items-center gap-2 text-sm text-green-600 hover:text-green-700 cursor-pointer",children:[(0,t.jsx)(a.Icon,{icon:"solar:pen-new-square-line-duotone",className:"text-lg"}),"Ganti"]})
      ]}),
      (0,t.jsx)(d.AnimatePresence,{children:b&&(0,t.jsxs)(o.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.25},className:"p-4 bg-gray-50 border-t overflow-hidden",children:[
        (0,t.jsx)(n.InputPhone,{no_label:!0,value:e?.phone,onChange:C}),
        (0,t.jsxs)("div",{className:"flex justify-end gap-2 mt-4",children:[
          (0,t.jsx)("button",{onClick:()=>w(!1),className:"px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer",children:"Batal"}),
          (0,t.jsx)("button",{onClick:T,className:"px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition cursor-pointer",children:"Simpan"})
        ]})
      ]})})
    ]}),
    (0,t.jsxs)("div",{className:"flex justify-between items-center p-4",children:[
      (0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Email"}),(0,t.jsx)("p",{className:"text-gray-800 font-medium",children:e?.email})]}),
      (0,t.jsxs)("button",{onClick:()=>y(!c),className:"flex items-center gap-2 text-sm text-green-600 hover:text-green-700 cursor-pointer",children:[(0,t.jsx)(a.Icon,{icon:"solar:pen-new-square-line-duotone",className:"text-lg"}),"Ganti"]})
    ]}),
    (0,t.jsx)(d.AnimatePresence,{children:c&&(0,t.jsxs)(o.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.25},className:"p-4 bg-gray-50 border-t overflow-hidden",children:[
      (0,t.jsx)(r.Input,{id:"email",label:"Email Baru",type:"email",value:N,placeholder:e?.email,onChange:val=>k(val),required:!0}),
      (0,t.jsxs)("div",{className:"flex justify-end gap-2 mt-3",children:[
        (0,t.jsx)("button",{onClick:()=>y(!1),className:"px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer",children:"Batal"}),
        (0,t.jsx)("button",{onClick:B,className:"px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition cursor-pointer",children:"Simpan"})
      ]})
    ]})}),
    (0,t.jsxs)("div",{className:"flex justify-between items-center p-4",children:[
      (0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Password"}),(0,t.jsx)("p",{className:"text-gray-800 font-medium",children:"••••••••"})]}),
      (0,t.jsxs)("button",{onClick:()=>v(!j),className:"flex items-center gap-2 text-sm text-green-600 hover:text-green-700 cursor-pointer",children:[(0,t.jsx)(a.Icon,{icon:"solar:pen-new-square-line-duotone",className:"text-lg"}),"Ganti"]})
    ]}),
    (0,t.jsx)(d.AnimatePresence,{children:j&&(0,t.jsxs)(o.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.25},className:"p-4 bg-gray-50 border-t space-y-3 overflow-hidden",children:[
      (0,t.jsx)(r.Input,{id:"newPassword",label:"Password Baru",type:"password",onChange:val=>A(val),required:!0}),
      (0,t.jsx)(r.Input,{id:"confirmPassword",label:"Konfirmasi Password Baru",type:"password",valueConfirm:P,onChange:val=>R(val),required:!0}),
      (0,t.jsxs)("div",{className:"flex justify-end gap-2 pt-2",children:[
        (0,t.jsx)("button",{onClick:()=>v(!1),className:"px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer",children:"Batal"}),
        (0,t.jsx)("button",{onClick:I,className:"px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition cursor-pointer",children:"Simpan"})
      ]})
    ]})}),
    (0,t.jsxs)("div",{className:"flex justify-between items-center p-4",children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Autentikasi Dua Faktor (2FA)"}),
        (0,t.jsx)("p",{className:`font-medium text-sm ${tfEnabled?"text-green-700":"text-gray-800"}`,children:tfLoadingStatus?"Memuat status...":tfEnabled?`Aktif (sisa ${tfRemaining} backup codes)`:"Belum aktif"})
      ]}),
      (0,t.jsxs)("button",{type:"button",onClick:()=>setTfOpen(!tfOpen),className:"flex items-center gap-2 text-sm text-green-600 hover:text-green-700 cursor-pointer",children:[
        (0,t.jsx)(a.Icon,{icon:"solar:shield-keyhole-line-duotone",className:"text-lg"}),
        tfOpen?"Tutup":tfEnabled?"Kelola":"Aktifkan"
      ]})
    ]}),
    (0,t.jsx)(d.AnimatePresence,{children:tfOpen&&(0,t.jsxs)(o.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.25},className:"p-4 bg-gray-50 border-t space-y-4 overflow-hidden",children:[
      !tfEnabled&&!tfSetup&&(0,t.jsxs)("form",{onSubmit:handleStart2FA,className:"space-y-3",children:[
        (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Lindungi akun Anda dengan aplikasi authenticator (Google Authenticator, Authy, atau 1Password). Masukkan password akun untuk membuat QR code dan backup codes."}),
        (0,t.jsxs)("div",{className:"flex flex-col gap-1",children:[
          (0,t.jsx)("label",{htmlFor:"tf-enable-pass",className:"text-xs font-medium text-gray-700",children:"Password Akun"}),
          (0,t.jsx)("input",{id:"tf-enable-pass",type:"password",value:tfEnablePass,onChange:ev=>setTfEnablePass(ev.target.value),disabled:tfBusy,placeholder:"Masukkan password akun",className:"w-full max-w-sm px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800"})
        ]}),
        (0,t.jsx)("button",{type:"submit",disabled:tfBusy,className:"px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition cursor-pointer",style:{opacity:tfBusy?.6:1},children:tfBusy?"Menyiapkan...":"Mulai Aktivasi 2FA"})
      ]}),
      !tfEnabled&&tfSetup&&(0,t.jsxs)("div",{className:"space-y-4",children:[
        (0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[
          (0,t.jsxs)("div",{className:"bg-white border border-gray-200 rounded-lg p-4 space-y-3",children:[
            (0,t.jsx)("p",{className:"text-sm font-semibold text-gray-800",children:"1. Pindai QR Code"}),
            (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Buka aplikasi authenticator lalu pindai QR code berikut:"}),
            (0,t.jsx)("div",{className:"flex justify-center",children:(0,t.jsx)("div",{className:"p-2 bg-white border border-gray-200 rounded-md",children:(0,t.jsx)("img",{src:tfSetup.qr_data_url,alt:"QR code 2FA authenticator",width:200,height:200,style:{width:"200px",height:"200px"}})})}),
            tfSetup.manual_secret&&(0,t.jsxs)("div",{className:"space-y-1 pt-2 border-t border-gray-100",children:[
              (0,t.jsx)("p",{className:"text-xs text-gray-500",children:"Atau masukkan kunci manual:"}),
              (0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-2",children:[
                (0,t.jsx)("code",{className:"px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200 text-gray-800 break-all",style:{fontFamily:"monospace"},children:tfSetup.manual_secret}),
                (0,t.jsx)("button",{type:"button",onClick:()=>copyText(tfSetup.manual_secret,"secret"),className:"px-2.5 py-1 text-xs border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-700 cursor-pointer",children:"secret"===copiedKey?"Tersalin":"Salin"})
              ]})
            ]})
          ]}),
          (0,t.jsxs)("div",{className:"bg-white border border-gray-200 rounded-lg p-4 space-y-3",children:[
            (0,t.jsx)("p",{className:"text-sm font-semibold text-gray-800",children:"2. Simpan Backup Codes"}),
            (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Simpan kode cadangan ini di tempat aman. Setiap kode hanya berlaku sekali pakai."}),
            (0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:(tfSetup.backup_codes||[]).map(code=>(0,t.jsx)("div",{className:"px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-center text-xs text-gray-800",style:{fontFamily:"monospace"},children:code},code))}),
            (0,t.jsxs)("div",{className:"flex flex-wrap gap-2 pt-1",children:[
              (0,t.jsx)("button",{type:"button",onClick:()=>copyText((tfSetup.backup_codes||[]).join("\n"),"codes"),className:"px-3 py-1.5 text-xs border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-700 cursor-pointer",children:"codes"===copiedKey?"Tersalin":"Salin Semua"}),
              (0,t.jsx)("button",{type:"button",onClick:()=>downloadBackupCodes(tfSetup.backup_codes||[]),className:"px-3 py-1.5 text-xs border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-700 cursor-pointer",children:"Unduh (.txt)"})
            ]})
          ]})
        ]}),
        (0,t.jsxs)("form",{onSubmit:handleVerify2FASetup,className:"bg-white border border-gray-200 rounded-lg p-4 space-y-3",children:[
          (0,t.jsx)("p",{className:"text-sm font-semibold text-gray-800",children:"3. Verifikasi Kode Authenticator"}),
          (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Masukkan kode 6 digit yang muncul di aplikasi authenticator untuk menyelesaikan aktivasi 2FA."}),
          (0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-2",children:[
            (0,t.jsx)("input",{type:"text",inputMode:"numeric",autoComplete:"one-time-code",maxLength:6,value:tfVerifyCode,onChange:ev=>setTfVerifyCode(ev.target.value.replace(/\D/g,"")),disabled:tfBusy,placeholder:"000000",className:"px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800",style:{fontFamily:"monospace",letterSpacing:"4px",width:"160px",textAlign:"center"}}),
            (0,t.jsx)("button",{type:"submit",disabled:tfBusy,className:"px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition cursor-pointer",style:{opacity:tfBusy?.6:1},children:tfBusy?"Memverifikasi...":"Verifikasi & Aktifkan 2FA"}),
            (0,t.jsx)("button",{type:"button",disabled:tfBusy,onClick:()=>{setTfSetup(null),setTfVerifyCode("")},className:"px-3 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer",children:"Batal"})
          ]})
        ]})
      ]}),
      tfEnabled&&tfSavedCodes&&(0,t.jsxs)("div",{className:"bg-white border border-green-200 rounded-lg p-4 space-y-3",children:[
        (0,t.jsx)("p",{className:"text-sm font-semibold text-gray-800",children:"Backup Codes Aktif"}),
        (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Simpan daftar kode ini sekarang sebelum menutup panel. Kode lama sudah tidak berlaku."}),
        (0,t.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-5 gap-2",children:tfSavedCodes.map(code=>(0,t.jsx)("div",{className:"px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-center text-xs text-gray-800",style:{fontFamily:"monospace"},children:code},code))}),
        (0,t.jsxs)("div",{className:"flex flex-wrap gap-2",children:[
          (0,t.jsx)("button",{type:"button",onClick:()=>copyText(tfSavedCodes.join("\n"),"saved"),className:"px-3 py-1.5 text-xs border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-700 cursor-pointer",children:"saved"===copiedKey?"Tersalin":"Salin Semua"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>downloadBackupCodes(tfSavedCodes),className:"px-3 py-1.5 text-xs border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-700 cursor-pointer",children:"Unduh (.txt)"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>setTfSavedCodes(null),className:"px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer",children:"Saya sudah menyimpannya"})
        ]})
      ]}),
      tfEnabled&&(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[
        (0,t.jsxs)("form",{onSubmit:handleRegenCodes,className:"bg-white border border-gray-200 rounded-lg p-4 space-y-3",children:[
          (0,t.jsx)("p",{className:"text-sm font-semibold text-gray-800",children:"Buat Ulang Backup Codes"}),
          (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Membuat 10 backup codes baru akan menonaktifkan seluruh backup codes lama."}),
          (0,t.jsx)("input",{type:"password",value:tfRegenPass,onChange:ev=>setTfRegenPass(ev.target.value),disabled:tfBusy,placeholder:"Masukkan password akun",className:"w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800"}),
          (0,t.jsx)("button",{type:"submit",disabled:tfBusy,className:"px-3 py-2 text-xs font-medium border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-gray-800 cursor-pointer",style:{opacity:tfBusy?.6:1},children:tfBusy?"Memproses...":"Buat Ulang Backup Codes"})
        ]}),
        (0,t.jsxs)("form",{onSubmit:handleDisable2FA,className:"bg-white border border-gray-200 rounded-lg p-4 space-y-3",children:[
          (0,t.jsx)("p",{className:"text-sm font-semibold text-red-700",children:"Nonaktifkan 2FA"}),
          (0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Menghapus verifikasi aplikasi authenticator dari proses login akun Anda."}),
          (0,t.jsx)("input",{type:"password",value:tfDisablePass,onChange:ev=>setTfDisablePass(ev.target.value),disabled:tfBusy,placeholder:"Masukkan password akun",className:"w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800"}),
          (0,t.jsx)("button",{type:"submit",disabled:tfBusy,className:"px-3 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer",style:{opacity:tfBusy?.6:1},children:tfBusy?"Memproses...":"Nonaktifkan 2FA"})
        ]})
      ]})
    ]})}),
    (0,t.jsx)("div",{onClick:U,className:"flex cursor-pointer justify-between items-center p-4 hover:bg-gray-50 transition",children:(0,t.jsxs)("div",{className:"flex items-center gap-3 text-red-600",children:[(0,t.jsx)(a.Icon,{icon:"solar:logout-2-line-duotone",className:"text-xl"}),(0,t.jsx)("p",{className:"font-medium",children:"Keluar"})]})})
  ]})})})})}));e.s(["default",0,y])},31756,e=>{e.v(t=>Promise.all(["static/chunks/c7a6be9968e0cecc.js"].map(t=>e.l(t))).then(()=>t(23145)))}]);
