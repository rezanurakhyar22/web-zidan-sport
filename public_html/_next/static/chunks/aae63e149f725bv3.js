(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,60061,e=>{"use strict";e.i(2970);var t=e.i(11596),a=e.i(63507),r=e.i(60032),s=e.i(34182),i=e.i(67351),l=e.i(66932),o=e.i(61172);e.s(["ModalCategory",()=>t.default,"ModalEditEvent",()=>a.default,"ModalEvent",()=>i.default,"ModalEventCategories",()=>l.default,"ModalExtraPoint",()=>s.default,"ModalForgotPassword",()=>r.default,"ModalRegistrationEvent",()=>o.default])},45301,e=>{"use strict";var t=e.i(43476);e.i(23842);var a=e.i(54231),r=e.i(63666),s=e.i(60061),i=e.i(2153);e.i(12243);var l=e.i(19507);e.i(82109);var L=e.i(67825),o=e.i(81048),n=e.i(90357),d=e.i(46932),c=e.i(22016),m=e.i(18566),u=e.i(71645),g=e.i(5766),f=e.i(63662);
const API_BASE="https://api-v2.zidansport.org/api/v2";
const TOAST_STYLE={duration:4e3,style:{fontSize:"12px",lineHeight:"16px"}};
let G=()=>(0,t.jsxs)("svg",{width:18,height:18,viewBox:"0 0 24 24","aria-hidden":"true",style:{flexShrink:0},children:[(0,t.jsx)("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),(0,t.jsx)("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),(0,t.jsx)("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),(0,t.jsx)("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]});
let x=(0,i.withWrapSuspense)(()=>{
  let[e,i]=(0,u.useState)(!1),
    [x,y]=(0,u.useState)(""),
    [b,v]=(0,u.useState)(""),
    [w,k]=(0,u.useState)(null),
    [j,N]=(0,u.useState)(""),
    [S,C]=(0,u.useState)(!1),
    [q,M]=(0,u.useState)(!1),
    [tfToken,setTfToken]=(0,u.useState)(""),
    [tfEmail,setTfEmail]=(0,u.useState)(""),
    [tfMethod,setTfMethod]=(0,u.useState)("totp"),
    [tfCode,setTfCode]=(0,u.useState)(""),
    [tfTrust,setTfTrust]=(0,u.useState)(!1),
    [tfPending,setTfPending]=(0,u.useState)(!1),
    P=(0,m.useRouter)(),
    completeSession=(userObj,accessToken,refreshToken,trustToken)=>{
      if(trustToken&&userObj?.email){
        try{localStorage.setItem("zs_2fa_trust_"+String(userObj.email).trim().toLowerCase(),trustToken)}catch(err){}
      }
      n.store.dispatch((0,L.loginAction)({user:userObj,token:accessToken,refreshToken:refreshToken}));
      n.store.dispatch((0,o.showLoaderAction)({content:"Memuat ..."}));
      let acc=userObj?.access;
      0==acc?P.replace("/dashboard"):1==acc?P.replace("/dashboard/contingent"):P.replace("/dashboard/profile");
    },
    I=async()=>{
      C(!0),N("");
      try{
        let res=await fetch(`${API_BASE}/auth/captcha`);
        if(res.ok){
          let payload=await res.json();
          if(payload?.data?.question&&payload?.data?.captcha_token){
            y(payload.data.question),v(payload.data.captcha_token),k(null),C(!1);
            return;
          }
        }
      }catch(err){}
      let n1=Math.floor(10*Math.random())+1,n2=Math.floor(10*Math.random())+1,op=Math.random()>.5?"+":"-",a1="-"===op?Math.max(n1,n2):n1,a2="-"===op?Math.min(n1,n2):n2,ans="+"===op?a1+a2:a1-a2;
      y(`${a1} ${op} ${a2}`),v(""),k(String(ans)),C(!1);
    };
  (0,u.useEffect)(()=>{I()},[]),
  (0,u.useEffect)(()=>{
    if("undefined"==typeof window)return;
    let hash=window.location.hash||"";
    if(!hash)return;
    let params=new URLSearchParams(hash.slice(1)),
      gRefresh=params.get("google_refresh"),
      gError=params.get("google_error"),
      gTwoFactor=params.get("two_factor_token"),
      gTwoFactorEmail=params.get("email")||"";
    if(gTwoFactor){
      window.history.replaceState(null,"","/auth/login");
      setTfToken(gTwoFactor);
      setTfEmail(decodeURIComponent(gTwoFactorEmail));
      setTfMethod("totp");
      setTfCode("");
      return;
    }
    if(gRefresh){
      window.history.replaceState(null,"","/auth/login"),M(!0),n.store.dispatch((0,o.showLoaderAction)({content:"Menyelesaikan login Google..."})),(async()=>{
        try{
          let res=await fetch(`${API_BASE}/auth/refresh-token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:gRefresh})}),payload=await res.json();
          if(res.ok&&payload?.data?.access_token){
            completeSession(payload.data.user,payload.data.access_token,payload.data.refresh_token,null);
            return;
          }
          n.store.dispatch((0,o.hideLoaderAction)()),M(!1),g.default.error(payload?.message||"Gagal menyelesaikan sesi Google",TOAST_STYLE);
        }catch(err){
          n.store.dispatch((0,o.hideLoaderAction)()),M(!1),g.default.error("Terjadi kesalahan saat menyelesaikan login Google",TOAST_STYLE);
        }
      })();
    }else gError&&(window.history.replaceState(null,"","/auth/login"),g.default.error("Login Google gagal: "+decodeURIComponent(gError),TOAST_STYLE));
  },[P]);

  let p=async ev=>{
    ev.preventDefault();
    let ans=String(j).trim();
    if(!ans)return void g.default.error("Verifikasi captcha wajib diisi!",TOAST_STYLE);
    if(!b&&null!==w&&ans!==String(w))return g.default.error("Jawaban verifikasi captcha salah!",TOAST_STYLE),void I();
    let uid=localStorage.getItem("uid")||"";
    if(!uid){uid="u-"+Date.now()+"-"+Math.random().toString(36).slice(2,8);try{localStorage.setItem("uid",uid)}catch(err){}}
    let emailEl=document.getElementById("email"),passEl=document.getElementById("password"),emailVal=String(emailEl?.value||"").trim(),passVal=String(passEl?.value||"");
    let savedTrust="";
    try{savedTrust=localStorage.getItem("zs_2fa_trust_"+emailVal.toLowerCase())||""}catch(err){}
    let body=b?{uid,email:emailVal,password:passVal,captcha_token:b,captcha_answer:ans}:{uid,email:emailVal,password:passVal};
    if(savedTrust)body.trust_device_token=savedTrust;
    n.store.dispatch((0,o.showLoaderAction)({content:"Memproses login..."}));
    try{
      let res=await fetch(`${API_BASE}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}),payload=await res.json().catch(()=>({}));
      n.store.dispatch((0,o.hideLoaderAction)());
      if(res.ok&&payload?.data?.two_factor_required&&payload?.data?.two_factor_token){
        setTfToken(payload.data.two_factor_token);
        setTfEmail(payload.data.email||emailVal);
        setTfMethod("totp");
        setTfCode("");
        return;
      }
      if(res.ok&&payload?.data?.access_token){
        completeSession(payload.data,payload.data.access_token,payload.data.refresh_token,null);
        return;
      }
      g.default.error(payload?.message||"Email atau kata sandi tidak sesuai",TOAST_STYLE);
      I();
    }catch(err){
      n.store.dispatch((0,o.hideLoaderAction)());
      g.default.error("Gagal terhubung ke server login. Coba lagi.",TOAST_STYLE);
      I();
    }
  };

  let handleVerify2FA=async ev=>{
    ev.preventDefault();
    let trimmed=String(tfCode||"").trim();
    if("totp"===tfMethod){
      let digits=trimmed.replace(/\s+/g,"");
      if(!/^\d{6}$/.test(digits))return void g.default.error("Masukkan kode 6 digit angka dari aplikasi authenticator.",TOAST_STYLE);
      trimmed=digits;
    }else if(!trimmed){
      return void g.default.error("Masukkan salah satu backup code Anda.",TOAST_STYLE);
    }
    setTfPending(!0);
    n.store.dispatch((0,o.showLoaderAction)({content:"Memverifikasi kode 2FA..."}));
    try{
      let res=await fetch(`${API_BASE}/auth/2fa/verify-login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({two_factor_token:tfToken,code:trimmed,use_backup_code:"backup"===tfMethod,trust_device:tfTrust})}),payload=await res.json().catch(()=>({}));
      n.store.dispatch((0,o.hideLoaderAction)());
      setTfPending(!1);
      if(res.ok&&payload?.data?.access_token){
        g.default.success("Verifikasi 2FA berhasil!",TOAST_STYLE);
        completeSession(payload.data,payload.data.access_token,payload.data.refresh_token,payload.data.trust_device_token||null);
        return;
      }
      g.default.error(payload?.message||"Kode verifikasi 2FA tidak valid.",TOAST_STYLE);
    }catch(err){
      n.store.dispatch((0,o.hideLoaderAction)());
      setTfPending(!1);
      g.default.error("Terjadi kesalahan saat verifikasi 2FA. Coba lagi.",TOAST_STYLE);
    }
  };

  let h=async email=>{i(!1),await l.authRepo.requestResetPassword(email)},
    O=()=>{M(!0),window.location.href=`${API_BASE}/auth/google-start?mode=login`};

  return(0,t.jsxs)(d.motion.main,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.5,delay:.1},className:"min-h-screen flex flex-col text-black bg-white bg-cover bg-center bg-no-repeat",children:[
    (0,t.jsx)(s.ModalForgotPassword,{isOpen:e,onClose:()=>i(!1),onSubmit:h}),
    (0,t.jsx)("div",{className:"flex flex-col items-center md:justify-center text-center px-6 md:py-16 py-8 space-y-4 flex-grow",children:
      tfToken
        ?(0,t.jsxs)("div",{className:"bg-white border border-gray-100 shadow-sm rounded-md p-8 w-full max-w-md text-grey-800 pt-4 text-left",children:[
          (0,t.jsx)("h1",{className:"text-xl text-center my-4 font-semibold text-gray-800",children:"Verifikasi Dua Faktor (2FA)"}),
          (0,t.jsx)("p",{className:"text-xs text-center text-gray-500 mb-5",children:tfEmail?`Masukkan kode verifikasi untuk akun ${tfEmail}.`:"Masukkan kode verifikasi dari aplikasi authenticator atau backup code."}),
          (0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2 mb-4",children:[
            (0,t.jsx)("button",{type:"button",disabled:tfPending,onClick:()=>{setTfMethod("totp"),setTfCode("")},className:`py-2 px-3 rounded-xs text-xs font-medium border cursor-pointer transition ${"totp"===tfMethod?"bg-primary-600 text-white border-primary-600":"bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`,children:"Authenticator"}),
            (0,t.jsx)("button",{type:"button",disabled:tfPending,onClick:()=>{setTfMethod("backup"),setTfCode("")},className:`py-2 px-3 rounded-xs text-xs font-medium border cursor-pointer transition ${"backup"===tfMethod?"bg-primary-600 text-white border-primary-600":"bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`,children:"Backup Code"})
          ]}),
          (0,t.jsxs)("form",{className:"space-y-4",onSubmit:handleVerify2FA,children:[
            "totp"===tfMethod
              ?(0,t.jsxs)("div",{className:"flex flex-col items-start",children:[
                (0,t.jsx)("label",{htmlFor:"two-factor-code",className:"text-sm text-gray-800 mb-1",children:"Kode 6 Digit Authenticator"}),
                (0,t.jsx)("input",{id:"two-factor-code",type:"text",inputMode:"numeric",autoComplete:"one-time-code",maxLength:6,value:tfCode,onChange:ev=>setTfCode(ev.target.value.replace(/\D/g,"")),disabled:tfPending,placeholder:"000000",required:!0,className:"w-full px-4 py-2 rounded-xs text-gray-800 placeholder-gray-300 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary-200",style:{fontFamily:"monospace",letterSpacing:"4px",textAlign:"center",fontSize:"16px"}})
              ]})
              :(0,t.jsxs)("div",{className:"flex flex-col items-start",children:[
                (0,t.jsx)("label",{htmlFor:"two-factor-backup",className:"text-sm text-gray-800 mb-1",children:"Backup Code"}),
                (0,t.jsx)("input",{id:"two-factor-backup",type:"text",autoComplete:"one-time-code",value:tfCode,onChange:ev=>setTfCode(ev.target.value),disabled:tfPending,placeholder:"Contoh: ABCD-EF12",required:!0,className:"w-full px-4 py-2 rounded-xs text-gray-800 placeholder-gray-300 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary-200",style:{fontFamily:"monospace"}})
              ]}),
            (0,t.jsxs)("label",{className:"flex items-center gap-2 text-xs text-gray-700 cursor-pointer",style:{minHeight:"36px"},children:[
              (0,t.jsx)("input",{type:"checkbox",checked:tfTrust,onChange:ev=>setTfTrust(ev.target.checked),disabled:tfPending,className:"cursor-pointer"}),
              (0,t.jsx)("span",{children:"Percayai perangkat ini selama 30 hari"})
            ]}),
            (0,t.jsx)("button",{type:"submit",disabled:tfPending,className:"w-full bg-primary-600 hover:bg-primary-500 transition duration-200 text-white font-semibold py-2 rounded-xs cursor-pointer",style:{opacity:tfPending?.6:1},children:tfPending?"Memverifikasi...":"Verifikasi & Masuk"})
          ]}),
          (0,t.jsx)("div",{className:"text-center mt-5",children:(0,t.jsx)("button",{type:"button",disabled:tfPending,onClick:()=>{setTfToken(""),setTfEmail(""),setTfCode(""),I()},className:"text-sm text-primary-800 hover:underline cursor-pointer",children:"Kembali ke halaman masuk"})})
        ]})
        :(0,t.jsxs)("div",{className:"bg-white border border-gray-100 shadow-sm rounded-md p-8 w-full max-w-md text-grey-800 pt-4",children:[
          (0,t.jsx)("h1",{className:"text-xl text-center my-6 font-semibold text-gray-600",children:"Masuk"}),
          (0,t.jsxs)("form",{className:"space-y-4",onSubmit:p,children:[
            (0,t.jsxs)("div",{className:"flex flex-col justify-start items-start",children:[
              (0,t.jsx)("label",{htmlFor:"email",className:"text-sm text-gray-800 mb-1",children:"Email"}),
              (0,t.jsx)("input",{type:"text",id:"email",className:"w-full px-4 py-2 rounded-xs text-gray-800 placeholder-gray-300 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary-200",placeholder:"contoh@email.com",required:!0})
            ]}),
            (0,t.jsx)(r.InputPassword,{id:"password",label:"Katasandi",placeholder:"********",showStrength:!1}),
            (0,t.jsxs)("div",{className:"flex flex-col justify-start items-start",children:[
              (0,t.jsx)("label",{htmlFor:"captcha",className:"text-sm text-gray-800 mb-1",children:"Verifikasi Captcha"}),
              (0,t.jsxs)("div",{className:"flex items-center gap-2 w-full",children:[
                (0,t.jsxs)("div",{className:"flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-xs",style:{minWidth:"145px",userSelect:"none",backgroundImage:"repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 10px)"},children:[
                  (0,t.jsx)("span",{className:"font-semibold text-gray-800 text-sm",style:{fontFamily:"monospace",letterSpacing:"2px"},children:S?"...":`${x} = ?`}),
                  (0,t.jsx)("button",{type:"button",onClick:I,title:"Muat ulang captcha",className:"text-gray-500 hover:text-primary-600 transition cursor-pointer",style:{marginLeft:"8px"},children:(0,t.jsx)(f.Icon,{icon:"mdi:refresh",width:18,height:18})})
                ]}),
                (0,t.jsx)("input",{type:"number",id:"captcha",value:j,onChange:ev=>N(ev.target.value),className:"w-full px-4 py-2 rounded-xs text-gray-800 placeholder-gray-300 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary-200",placeholder:"Hasil hitungan",required:!0})
              ]})
            ]}),
            (0,t.jsx)("button",{type:"submit",className:"mt-4 w-full bg-primary-600 hover:bg-primary-500 transition duration-200 text-white font-semibold py-2 rounded-xs cursor-pointer",children:"Masuk"})
          ]}),
          (0,t.jsxs)("div",{className:"flex items-center my-4",style:{gap:"12px"},children:[
            (0,t.jsx)("div",{style:{flex:1,height:"1px",backgroundColor:"#e5e7eb"}}),
            (0,t.jsx)("span",{className:"text-xs text-gray-500",children:"atau"}),
            (0,t.jsx)("div",{style:{flex:1,height:"1px",backgroundColor:"#e5e7eb"}})
          ]}),
          (0,t.jsxs)("button",{type:"button",onClick:O,disabled:q,className:"w-full flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 transition duration-200 text-gray-800 font-medium py-2 px-4 rounded-xs cursor-pointer",style:{gap:"10px",minHeight:"44px",opacity:q?.6:1},children:[
            (0,t.jsx)(G,{}),
            (0,t.jsx)("span",{className:"text-sm",children:q?"Mengalihkan ke Google...":"Masuk dengan Google"})
          ]}),
          (0,t.jsxs)("div",{className:"text-center mt-6",children:[
            (0,t.jsxs)("p",{className:"text-sm text-black/80",children:["Belum punya akun?"," ",(0,t.jsx)("button",{onClick:()=>{P.push("/auth/register"),n.store.dispatch((0,o.showLoaderAction)({content:""}))},className:"text-primary-800 hover:underline hover:text-primary-500 transition duration-200 cursor-pointer",children:"Daftar"})]}),
            (0,t.jsx)("button",{onClick:()=>i(!0),className:"cursor-pointer text-sm text-primary-800 hover:underline hover:text-primary-500 transition duration-200 mt-2",children:"Lupa Password ?"})
          ]}),
          (0,t.jsx)(c.default,{href:"/",className:"text-sm text-primary-800 hover:underline inline-block mt-6",children:"← Kembali"})
        ]})
    }),
    (0,t.jsx)(a.Footer,{})
  ]});
});e.s(["default",0,x])}]);
