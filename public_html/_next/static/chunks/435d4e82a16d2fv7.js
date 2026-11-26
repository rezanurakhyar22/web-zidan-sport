(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20464,60107,e=>{"use strict";var t=e.i(43476);e.i(23842);var a=e.i(51390),i=e.i(17595),s=e.i(18566),r=e.i(71645),n=e.i(5766),o=e.i(55487);let l=["/dashboard","/dashboard/categories","/dashboard/contingents","/dashboard/coaches","/dashboard/athletes"];function d(d){let c=c=>{let u=(0,s.useRouter)(),h=(0,s.usePathname)(),{isAuthenticated:g,user:x}=(0,o.useSelector)(e=>e.auth),[m,p]=(0,r.useState)(!1),f=async()=>{let{authRepo:t}=await e.A(31756),a=i.default.get("zs_refreshToken");!g&&a?await t.refreshToken(u):g||a||u.replace("/auth/login"),p(!0)};return((0,r.useEffect)(()=>{f()},[g]),(0,r.useEffect)(()=>{m&&g&&x&&0!=x.access&&l.includes(h)&&(n.default.error("Anda sedang tidak login sebagai admin!",{duration:3e3,style:{fontSize:"12px",lineHeight:"16px"}}),u.replace("/"),i.default.remove("zs_refreshToken"),i.default.remove("zs_v2_token"))},[m]),m)?(0,t.jsx)(d,{...c}):(0,t.jsx)(a.LoaderModal,{})};return c.displayName=`withAuth(${d.displayName||d.name||"Component"})`,c}e.s(["withAuth",()=>d],60107),e.s([],20464)},60516,e=>{"use strict";var t=e.i(28719);e.s(["athleteRepo",0,t])},60061,e=>{"use strict";e.i(2970);var t=e.i(11596),a=e.i(63507),i=e.i(60032),s=e.i(34182),r=e.i(67351),n=e.i(66932),o=e.i(61172);e.s(["ModalCategory",()=>t.default,"ModalEditEvent",()=>a.default,"ModalEvent",()=>r.default,"ModalEventCategories",()=>n.default,"ModalExtraPoint",()=>s.default,"ModalForgotPassword",()=>i.default,"ModalRegistrationEvent",()=>o.default])},68216,e=>{"use strict";var t=e.i(97305);e.s(["eventRepo",0,t])},73973,e=>{"use strict";
var t=e.i(43476), // jsx / jsxs
a=e.i(71645), // useState, useEffect, useMemo
i=e.i(63662), // Icon
s=e.i(88653), // AnimatePresence
r=e.i(46932), // motion
n=e.i(57688); // Image
e.i(23842);
var o=e.i(78367), // DashboardLayout
l=e.i(60061),
d=e.i(2153), // withWrapSuspense
c=e.i(18566); // useRouter, useSearchParams
e.i(12243);
var u=e.i(60516), // athleteRepo
h=e.i(68216), // eventRepo
g=e.i(55487), // useSelector
x=e.i(60107); // withAuth
var cRepo=e.i(4617); // contingentRepo

let f=(0,d.withWrapSuspense)((0,x.withAuth)(()=>{
    let codeParam=(0,c.useSearchParams)().get("code");
    let router=(0,c.useRouter)();
    let authUser=(0,g.useSelector)(e=>e?.auth?.user);
    let myContId=authUser?.contingent?.id?Number(authUser.contingent.id):null;

    let [loading,setLoading]=(0,a.useState)(!0);
    let [eventData,setEventData]=(0,a.useState)(null);
    let [allAthletes,setAllAthletes]=(0,a.useState)([]);
    let [conts,setConts]=(0,a.useState)([]);

    let [search,setSearch]=(0,a.useState)("");
    let [genderFilter,setGenderFilter]=(0,a.useState)("all");
    let [catFilter,setCatFilter]=(0,a.useState)("all");
    let [tabType,setTabType]=(0,a.useState)("individual"); // "individual" or "team"

    let [modalOpen,setModalOpen]=(0,a.useState)(!1);
    let [modalMode,setModalMode]=(0,a.useState)("add"); // "add" or "edit"
    let [editingPartId,setEditingPartId]=(0,a.useState)(null);
    let [editingAthId,setEditingAthId]=(0,a.useState)(null);
    let [isNewAth,setIsNewAth]=(0,a.useState)(!1);
    let [loadingAction,setLoadingAction]=(0,a.useState)(!1);
    let [teamAthSearch,setTeamAthSearch]=(0,a.useState)("");
    let [showAllAthletes,setShowAllAthletes]=(0,a.useState)(!1);

    let [form,setForm]=(0,a.useState)({
        category_id:"",
        contingent_id:myContId?String(myContId):"",
        athlete_id:"",
        athlete_ids:[],
        team_name:"",
        name:"",
        gender:1,
        date_of_birth:"",
        body_weight:""
    });

    let loadData=async()=>{
        if(!codeParam)return;
        setLoading(!0);
        let [resE,resA,resC]=await Promise.all([
            h.eventRepo.getEventByCode(codeParam.toString()),
            myContId?u.athleteRepo.getAthletesByContingent(myContId):u.athleteRepo.findAthletes({page:1,limit:1000,sort_by:"name",order:"asc"}),
            cRepo.getAllContingents()
        ]);
        if(resE.status)setEventData(resE.data?.data||resE.data);
        if(resA.status)setAllAthletes(resA.data?.data||resA.data||[]);
        if(resC.status)setConts(resC.data?.data||resC.data||[]);
        setLoading(!1);
    };

    (0,a.useEffect)(()=>{loadData()},[codeParam]);

    let cats=eventData?.categories||[];
    let participants=eventData?.participants||[];

    // Filter participants to user's contingent if logged in as contingent
    let displayParticipants=(0,a.useMemo)(()=>{
        let list=participants;
        if(myContId){
            list=list.filter(p=>{
                let pContId=p.event_contingent?.contingent_id||p.event_contingent?.contingent?.id||p.athlete?.contingent_id;
                return !pContId||Number(pContId)===myContId;
            });
        }
        return list;
    },[participants,myContId]);

    // Date and string formatting helpers
    let formatDate=d=>{
        if(!d)return "-";
        try{
            let dt=new Date(d);
            if(isNaN(dt.getTime()))return String(d).split("T")[0];
            let day=String(dt.getDate()).padStart(2,"0");
            let month=String(dt.getMonth()+1).padStart(2,"0");
            return `${day}/${month}/${dt.getFullYear()}`;
        }catch(e){return String(d);}
    };

    let formatWeight=w=>{
        if(w===undefined||w===null||w===""||w===0)return "-";
        return `${w} Kg`;
    };

    let formatGender=g=>{
        if(g===1||g==="1")return "Putra";
        if(g===2||g==="2")return "Putri";
        return "-";
    };

    // Filtered by search, gender, category, individual/team
    let filteredParticipants=(0,a.useMemo)(()=>{
        return displayParticipants.filter(p=>{
            let ath=p.athlete;
            let catObj=cats.find(c=>c.id===p.category_id);
            let catName=catObj?.category?.name||p.category?.category?.name||"";
            let contName=p.event_contingent?.contingent?.name||p.event_contingent?.contingent?.abbreviation||ath?.contingent?.name||"";
            let athName=ath?.name||p.team_name||"";
            let isTeam=Boolean(p.team_name||catObj?.category?.is_team||/beregu/i.test(catName));

            if(tabType==="individual"&&isTeam)return false;
            if(tabType==="team"&&!isTeam)return false;

            if(genderFilter==="1"&&ath?.gender!==1&&catObj?.category?.gender!==1)return false;
            if(genderFilter==="2"&&ath?.gender!==2&&catObj?.category?.gender!==2)return false;

            if(catFilter!=="all"&&String(p.category_id)!==String(catFilter))return false;

            if(search.trim()){
                let q=search.trim().toLowerCase();
                let match=athName.toLowerCase().includes(q)||
                    catName.toLowerCase().includes(q)||
                    contName.toLowerCase().includes(q);
                if(!match)return false;
            }
            return true;
        });
    },[displayParticipants,cats,search,genderFilter,catFilter,tabType]);

    let selModalCat=(0,a.useMemo)(()=>cats.find(c=>String(c.id)===String(form.category_id)),[cats,form.category_id]);
    let isModalTeam=Boolean(selModalCat?.category?.is_team||/beregu/i.test(selModalCat?.category?.name||""));
    let eligibleAthletes = (0, a.useMemo)(() => {
        let list = allAthletes.filter(a => !form.contingent_id || String(a.contingent_id) === String(form.contingent_id));
        if (showAllAthletes) return list;
        if (!selModalCat?.category) return list;
        let cat = selModalCat.category;
        let catGen = Number(cat.gender);
        if (!catGen || catGen === 0) {
            let cName = cat.name || "";
            if (/putri/i.test(cName)) catGen = 2;
            else if (/putra/i.test(cName)) catGen = 1;
        }
        let minY = cat.min_year ? parseInt(cat.min_year, 10) : null;
        let maxY = cat.max_year ? parseInt(cat.max_year, 10) : null;
        if (minY && maxY && minY > maxY) { let tmpY = minY; minY = maxY; maxY = tmpY; }

        return list.filter(a => {
            if (catGen === 1 && a.gender !== 1) return false;
            if (catGen === 2 && a.gender !== 2) return false;
            if (a.date_of_birth && (minY || maxY)) {
                let by = new Date(a.date_of_birth).getFullYear();
                if (minY && by < minY) return false;
                if (maxY && by > maxY) return false;
            }
            return true;
        });
    }, [allAthletes, form.contingent_id, selModalCat, showAllAthletes]);

    let searchedAthletes = (0, a.useMemo)(() => {
        let base = eligibleAthletes;
        if (!teamAthSearch.trim()) return base;
        let q = teamAthSearch.trim().toLowerCase();
        return base.filter(a => (a.name || "").toLowerCase().includes(q) || String(a.code || "").toLowerCase().includes(q));
    }, [eligibleAthletes, teamAthSearch]);

    // Export CSV with exact requested columns
    let exportCSV=()=>{
        let headers=["No","Nama","Kontingen","Kelas","Jenis Kelamin","Tanggal Lahir","Berat badan"];
        let rows=[headers];
        filteredParticipants.forEach((p,idx)=>{
            let ath=p.athlete;
            let catObj=cats.find(c=>c.id===p.category_id);
            let catName=catObj?.category?.name||p.category?.category?.name||"-";
            let contName=p.event_contingent?.contingent?.name||p.event_contingent?.contingent?.abbreviation||ath?.contingent?.name||"-";
            let athName=ath?.name||p.team_name||"-";
            let gender=ath?.gender?formatGender(ath.gender):formatGender(catObj?.category?.gender);
            let dob=ath?.date_of_birth?formatDate(ath.date_of_birth):"-";
            let weight=ath?.body_weight?formatWeight(ath.body_weight):"-";

            rows.push([
                idx+1,
                `"${athName.replace(/"/g,'""')}"`,
                `"${contName.replace(/"/g,'""')}"`,
                `"${catName.replace(/"/g,'""')}"`,
                gender,
                dob,
                weight
            ]);
        });
        let csvContent="data:text/csv;charset=utf-8,"+rows.map(e=>e.join(",")).join("\n");
        let encodedUri=encodeURI(csvContent);
        let link=document.createElement("a");
        link.setAttribute("href",encodedUri);
        link.setAttribute("download",`Participant_List_${(eventData?.name||'Event').replace(/[^a-zA-Z0-9]/g,'_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let openAdd=()=>{
        setModalMode("add");
        setEditingPartId(null);
        setEditingAthId(null);
        setIsNewAth(!1);
        setTeamAthSearch("");
        setShowAllAthletes(!1);
        setForm({
            category_id:cats[0]?.id?String(cats[0].id):"",
            contingent_id:myContId?String(myContId):"",
            athlete_id:"",
            athlete_ids:[],
            team_name:"",
            name:"",
            gender:(()=>{
                let initCatObj=cats[0];
                let catGen=Number(initCatObj?.category?.gender);
                if(!catGen||catGen===0){
                    let cName=initCatObj?.category?.name||"";
                    if(/putri/i.test(cName))catGen=2;
                    else if(/putra/i.test(cName))catGen=1;
                }
                return (catGen===1||catGen===2)?catGen:1;
            })(),
            date_of_birth:"",
            body_weight:""
        });
        setModalOpen(!0);
    };

    let openEdit=(part)=>{
        let ath=part.athlete||{};
        let pContId=part.event_contingent?.contingent_id||part.event_contingent?.contingent?.id||ath.contingent_id||myContId||"";
        setModalMode("edit");
        setEditingPartId(part.id);
        setEditingAthId(ath.id||null);
        setIsNewAth(!1);
        setForm({
            category_id:String(part.category_id||""),
            contingent_id:String(pContId),
            athlete_id:ath.id?String(ath.id):"",
            athlete_ids:[],
            team_name:part.team_name||"",
            name:ath.name||part.team_name||"",
            gender:ath.gender||1,
            date_of_birth:ath.date_of_birth?ath.date_of_birth.split("T")[0]:"",
            body_weight:ath.body_weight!==undefined&&ath.body_weight!==null?String(ath.body_weight):""
        });
        setModalOpen(!0);
    };

    let saveParticipant=async(ev)=>{
        ev.preventDefault();
        if(!form.category_id)return alert("Pilih kategori pertandingan terlebih dahulu!");
        let targetContId=form.contingent_id?Number(form.contingent_id):myContId;
        if(!targetContId)return alert("Pilih kontingen terlebih dahulu!");

        setLoadingAction(!0);
        try{
            if(modalMode==="edit"){
                let updateData={
                    category_id:Number(form.category_id),
                    contingent_id:targetContId
                };
                if(isModalTeam){
                    updateData.team_name=form.team_name?form.team_name.trim():form.name;
                }else if(editingAthId){
                    updateData.athlete_id=Number(editingAthId);
                    try{
                        await u.athleteRepo.updateAthlete(editingAthId,{
                            name:form.name,
                            gender:Number(form.gender),
                            date_of_birth:form.date_of_birth||void 0,
                            body_weight:form.body_weight!==""?Number(form.body_weight):0,
                            contingent_id:targetContId
                        });
                    }catch(e){}
                }
                let {status:ok}=await h.eventRepo.updateParticipant(eventData.id,editingPartId,updateData);
                if(ok){
                    setModalOpen(!1);
                    loadData();
                }else{
                    alert("Gagal memperbarui data peserta.");
                }
            }else{
                if(isModalTeam){
                    if(!form.team_name||!form.team_name.trim()){
                        setLoadingAction(!1);
                        return alert("Nama Tim / Regu wajib diisi!");
                    }
                    let teamIds=[...form.athlete_ids];
                    if(isNewAth&&form.name){
                        let {status:okA,data:resA}=await u.athleteRepo.createAthlete({
                            name:form.name,
                            gender:Number(form.gender),
                            date_of_birth:form.date_of_birth||void 0,
                            body_weight:form.body_weight!==""?Number(form.body_weight):0,
                            contingent_id:targetContId,
                            is_verified:!0
                        });
                        if(okA&&resA?.data?.id)teamIds.push(resA.data.id);
                    }
                    if(teamIds.length<3){
                        setLoadingAction(!1);
                        return alert("Kategori beregu wajib memilih minimal 3 atlet dalam 1 tim/regu!");
                    }
                    let {status:ok}=await h.eventRepo.register(eventData.id,{
                        contingent_id:targetContId,
                        team_name:form.team_name.trim(),
                        athletes:teamIds.map(aid=>({
                            athlete_id:Number(aid),
                            category_id:Number(form.category_id),
                            contingent_id:targetContId,
                            team_name:form.team_name.trim()
                        }))
                    });
                    if(ok){
                        setModalOpen(!1);
                        loadData();
                    }else{
                        alert("Gagal mendaftarkan tim.");
                    }
                }else{
                    let targetAthId=form.athlete_id?Number(form.athlete_id):null;
                    if(isNewAth){
                        if(!form.name){
                            setLoadingAction(!1);
                            return alert("Nama atlet baru wajib diisi!");
                        }
                        let {status:okA,data:resA}=await u.athleteRepo.createAthlete({
                            name:form.name,
                            gender:Number(form.gender),
                            date_of_birth:form.date_of_birth||void 0,
                            body_weight:form.body_weight!==""?Number(form.body_weight):0,
                            contingent_id:targetContId,
                            is_verified:!0
                        });
                        if(!okA||!resA?.data?.id){
                            setLoadingAction(!1);
                            return alert("Gagal membuat atlet baru.");
                        }
                        targetAthId=resA.data.id;
                    }else if(!targetAthId){
                        setLoadingAction(!1);
                        return alert("Pilih atlet terlebih dahulu!");
                    }
                    let {status:ok}=await h.eventRepo.register(eventData.id,{
                        contingent_id:targetContId,
                        athletes:[{
                            athlete_id:targetAthId,
                            category_id:Number(form.category_id),
                            contingent_id:targetContId
                        }]
                    });
                    if(ok){
                        setModalOpen(!1);
                        loadData();
                    }else{
                        alert("Gagal mendaftarkan atlet.");
                    }
                }
            }
        }catch(err){
            alert("Terjadi kesalahan.");
        }
        setLoadingAction(!1);
    };

    let deletePart=async(ev,partId)=>{
        ev.preventDefault();
        ev.stopPropagation();
        if(!confirm("Yakin ingin menghapus peserta ini dari event?"))return;
        setLoadingAction(!0);
        try{
            let {status:ok}=await h.eventRepo.deleteParticipant(eventData.id,partId);
            if(ok)loadData();
            else alert("Gagal menghapus peserta.");
        }catch(err){
            alert("Gagal menghapus peserta.");
        }
        setLoadingAction(!1);
    };

    if(loading||!eventData){
        return (0,t.jsx)(o.DashboardLayout,{children:(0,t.jsx)("div",{className:"p-8 text-center text-gray-500",children:"Memuat data registrasi event..."})});
    }

    return (0,t.jsxs)(o.DashboardLayout,{
        children:[
            // Modal Add / Edit
            modalOpen && (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 overflow-y-auto bg-black/60 p-2 sm:p-4 flex items-center justify-center",
                style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" },
                onClick: () => setModalOpen(!1),
                children: (0, t.jsxs)("div", {
                    className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col my-auto",
                    style: { maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" },
                    onClick: e => e.stopPropagation(),
                    children: [
                        // Modal Header (Pinned at top)
                        (0, t.jsxs)("div", {
                            className: "flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/80 shrink-0",
                            style: { flexShrink: 0 },
                            children: [
                                (0, t.jsxs)("div", {
                                    children: [
                                        (0, t.jsx)("h3", {
                                            className: "text-lg font-bold text-gray-800",
                                            children: modalMode === "edit" ? "Edit Data Peserta" : (isModalTeam ? "Daftarkan Tim / Regu Baru" : "Daftarkan Atlet Baru")
                                        }),
                                        isModalTeam && (0, t.jsx)("p", {
                                            className: "text-xs text-gray-500 mt-0.5",
                                            children: selModalCat?.category?.name || "Kategori Beregu"
                                        })
                                    ]
                                }),
                                (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => setModalOpen(!1),
                                    className: "text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition",
                                    children: "✕"
                                })
                            ]
                        }),

                        // Modal Form Body (Scrollable, never pushes buttons off)
                        (0, t.jsxs)("form", {
                            id: "regosh-modal-form-435",
                            onSubmit: saveParticipant,
                            className: "p-6 space-y-4 text-sm flex-1 overflow-y-auto",
                            style: { overflowY: "auto", flex: "1 1 auto", maxHeight: "calc(90vh - 130px)" },
                            children: [
                                (0, t.jsxs)("div", {
                                    children: [
                                        (0, t.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Kategori Pertandingan (Kelas) *" }),
                                        (0, t.jsxs)("select", {
                                            required: !0,
                                            value: form.category_id,
                                            onChange: e => {
                                                let val = e.target.value;
                                                let foundCat = cats.find(c => String(c.id) === String(val));
                                                let catGen = Number(foundCat?.category?.gender);
                                                if (!catGen || catGen === 0) {
                                                    let cName = foundCat?.category?.name || "";
                                                    if (/putri/i.test(cName)) catGen = 2;
                                                    else if (/putra/i.test(cName)) catGen = 1;
                                                }
                                                setTeamAthSearch("");
                                                setForm(prev => ({ ...prev, category_id: val, athlete_id: "", athlete_ids: [], gender: (catGen === 1 || catGen === 2) ? catGen : prev.gender }));
                                            },
                                            className: "w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500",
                                            children: [
                                                (0, t.jsx)("option", { value: "", disabled: !0, children: "-- Pilih Kategori / Kelas --" }),
                                                cats.map(c => (0, t.jsx)("option", { value: c.id, children: c.category?.name }, c.id))
                                            ]
                                        })
                                    ]
                                }),
                                (0, t.jsxs)("div", {
                                    children: [
                                        (0, t.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Kontingen *" }),
                                        (0, t.jsxs)("select", {
                                            required: !0,
                                            disabled: Boolean(myContId),
                                            value: form.contingent_id,
                                            onChange: e => setForm({ ...form, contingent_id: e.target.value }),
                                            className: `w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white ${myContId ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-green-500 focus:border-green-500'}`,
                                            children: [
                                                (0, t.jsx)("option", { value: "", disabled: !0, children: "-- Pilih Kontingen --" }),
                                                myContId ? (
                                                    (0, t.jsx)("option", { value: myContId, children: authUser?.contingent?.name || "Kontingen Anda" })
                                                ) : (
                                                    conts.map(c => (0, t.jsxs)("option", { value: c.id, children: [c.name, c.abbreviation ? ` (${c.abbreviation})` : ""] }, c.id))
                                                )
                                            ]
                                        }),
                                        myContId && (0, t.jsx)("p", { className: "text-[11px] text-gray-500 mt-1", children: "Terkunci sesuai akun kontingen Anda." })
                                    ]
                                }),
                                modalMode === "edit" ? (
                                    (0, t.jsxs)("div", {
                                        className: "space-y-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200",
                                        children: [
                                            (0, t.jsx)("div", { className: "text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1", children: "Detail Data Peserta / Atlet" }),
                                            (0, t.jsxs)("div", {
                                                children: [
                                                    (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: isModalTeam ? "Nama Tim / Regu *" : "Nama Lengkap Atlet *" }),
                                                    (0, t.jsx)("input", {
                                                        required: !0,
                                                        type: "text",
                                                        value: form.name,
                                                        onChange: e => setForm({ ...form, name: e.target.value }),
                                                        className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                    })
                                                ]
                                            }),
                                            !isModalTeam && (0, t.jsxs)("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    (0, t.jsxs)("div", {
                                                        children: [
                                                            (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Jenis Kelamin" }),
                                                            (0, t.jsxs)("select", {
                                                                value: form.gender,
                                                                onChange: e => setForm({ ...form, gender: e.target.value }),
                                                                className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white",
                                                                children: [
                                                                    (0, t.jsx)("option", { value: 1, children: "Putra" }),
                                                                    (0, t.jsx)("option", { value: 2, children: "Putri" })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    (0, t.jsxs)("div", {
                                                        children: [
                                                            (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Berat Badan (Kg)" }),
                                                            (0, t.jsx)("input", {
                                                                type: "number",
                                                                value: form.body_weight,
                                                                onChange: e => setForm({ ...form, body_weight: e.target.value }),
                                                                placeholder: "Contoh: 40",
                                                                className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                            })
                                                        ]
                                                    }),
                                                    (0, t.jsxs)("div", {
                                                        className: "col-span-2",
                                                        children: [
                                                            (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Tanggal Lahir" }),
                                                            (0, t.jsx)("input", {
                                                                type: "date",
                                                                value: form.date_of_birth,
                                                                onChange: e => setForm({ ...form, date_of_birth: e.target.value }),
                                                                className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ) : isModalTeam ? (
                                    (0, t.jsxs)(t.Fragment, {
                                        children: [
                                            (0, t.jsxs)("div", {
                                                children: [
                                                    (0, t.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Nama Tim / Regu *" }),
                                                    (0, t.jsx)("input", {
                                                        required: !0,
                                                        type: "text",
                                                        value: form.team_name,
                                                        onChange: e => setForm({ ...form, team_name: e.target.value }),
                                                        placeholder: "Contoh: Regu A, INKAI Batam 1",
                                                        className: "w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            (0, t.jsxs)("div", {
                                                className: "space-y-2 pt-1",
                                                children: [
                                                    (0, t.jsxs)("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            (0, t.jsxs)("label", {
                                                                className: "block font-medium text-gray-700",
                                                                children: [
                                                                    "Pilih Anggota Tim / Regu ",
                                                                    (0, t.jsxs)("span", {
                                                                        className: form.athlete_ids.length >= 3 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold",
                                                                        children: ["(", form.athlete_ids.length, " Terpilih, min 3) *"]
                                                                    })
                                                                ]
                                                            }),
                                                            (0, t.jsx)("button", {
                                                                type: "button",
                                                                onClick: () => setShowAllAthletes(!showAllAthletes),
                                                                className: "text-[11px] font-medium text-primary-600 hover:underline cursor-pointer",
                                                                children: showAllAthletes ? "Terapkan Filter Kategori" : "Tampilkan Semua Atlet"
                                                            })
                                                        ]
                                                    }),

                                                    // Selected chips preview
                                                    form.athlete_ids.length > 0 && (0, t.jsxs)("div", {
                                                        className: "p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-lg space-y-1.5",
                                                        children: [
                                                            (0, t.jsxs)("div", {
                                                                className: "flex justify-between items-center text-xs font-semibold text-emerald-800",
                                                                children: [
                                                                    (0, t.jsxs)("span", { children: ["Anggota Regu Terpilih (", form.athlete_ids.length, " atlet):"] }),
                                                                    (0, t.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => setForm(prev => ({ ...prev, athlete_ids: [] })),
                                                                        className: "text-[11px] text-red-600 hover:underline cursor-pointer",
                                                                        children: "Hapus Semua"
                                                                    })
                                                                ]
                                                            }),
                                                            (0, t.jsx)("div", {
                                                                className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto",
                                                                children: form.athlete_ids.map((aid, idx) => {
                                                                    let ath = allAthletes.find(a => Number(a.id) === Number(aid));
                                                                    return (0, t.jsxs)("span", {
                                                                        className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium shadow-2xs",
                                                                        children: [
                                                                            (0, t.jsxs)("span", { children: [idx + 1, ". ", ath?.name || `Atlet #${aid}`, ath?.body_weight ? ` (${ath.body_weight} kg)` : ""] }),
                                                                            (0, t.jsx)("button", {
                                                                                type: "button",
                                                                                onClick: () => setForm(prev => ({ ...prev, athlete_ids: prev.athlete_ids.filter(x => x !== aid) })),
                                                                                className: "text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer",
                                                                                children: "✕"
                                                                            })
                                                                        ]
                                                                    }, aid);
                                                                })
                                                            })
                                                        ]
                                                    }),

                                                    // Search input
                                                    (0, t.jsx)("input", {
                                                        type: "text",
                                                        placeholder: "🔍 Cari nama atlet...",
                                                        value: teamAthSearch,
                                                        onChange: e => setTeamAthSearch(e.target.value),
                                                        className: "w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                                    }),

                                                    // Athletes List Box with clean scrolling
                                                    (0, t.jsx)("div", {
                                                        className: "border border-gray-300 rounded-lg p-2 max-h-56 overflow-y-auto space-y-1 bg-white divide-y divide-gray-50",
                                                        children: searchedAthletes.length === 0 ? (
                                                            (0, t.jsxs)("div", {
                                                                className: "p-4 text-center space-y-1.5",
                                                                children: [
                                                                    (0, t.jsx)("p", { className: "text-xs text-amber-600 font-medium", children: "Tidak ada atlet yang cocok dengan kriteria." }),
                                                                    !showAllAthletes && (0, t.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => setShowAllAthletes(!0),
                                                                        className: "text-xs text-blue-600 hover:underline font-semibold cursor-pointer",
                                                                        children: "Tampilkan Semua Atlet Kontingen"
                                                                    })
                                                                ]
                                                            })
                                                        ) : (
                                                            searchedAthletes.map(a => {
                                                                let isChecked = form.athlete_ids.includes(a.id);
                                                                let by = a.date_of_birth ? new Date(a.date_of_birth).getFullYear() : null;
                                                                return (0, t.jsxs)("label", {
                                                                    className: `flex items-center justify-between p-2 rounded cursor-pointer text-xs transition ${isChecked ? "bg-green-100/70 border border-green-300" : "hover:bg-gray-50 border border-transparent"}`,
                                                                    children: [
                                                                        (0, t.jsxs)("div", {
                                                                            className: "flex items-center gap-2.5 min-w-0 pr-2",
                                                                            children: [
                                                                                (0, t.jsx)("input", {
                                                                                    type: "checkbox",
                                                                                    checked: isChecked,
                                                                                    onChange: () => {
                                                                                        let next = isChecked ? form.athlete_ids.filter(id => id !== a.id) : [...form.athlete_ids, a.id];
                                                                                        setForm(prev => ({ ...prev, athlete_ids: next }));
                                                                                    },
                                                                                    className: "rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0"
                                                                                }),
                                                                                (0, t.jsxs)("div", {
                                                                                    className: "truncate",
                                                                                    children: [
                                                                                        (0, t.jsx)("span", { className: `font-medium ${isChecked ? "text-green-900 font-semibold" : "text-gray-800"}`, children: a.name }),
                                                                                        (0, t.jsxs)("span", {
                                                                                            className: "text-gray-400 text-[11px] ml-1.5",
                                                                                            children: [
                                                                                                "(", a.gender === 1 ? "Putra" : a.gender === 2 ? "Putri" : "-",
                                                                                                by ? `, Thn ${by}` : "",
                                                                                                a.body_weight ? `, ${a.body_weight} kg` : "",
                                                                                                ")"
                                                                                            ]
                                                                                        })
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        }),
                                                                        isChecked && (0, t.jsx)("span", { className: "text-[11px] font-bold text-green-700 shrink-0", children: "✓ Terpilih" })
                                                                    ]
                                                                }, a.id);
                                                            })
                                                        )
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ) : (
                                    (0, t.jsxs)(t.Fragment, {
                                        children: [
                                            (0, t.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Pilih Atlet Terdaftar *" }),
                                            !isNewAth ? (
                                                (0, t.jsxs)("select", {
                                                    required: !0,
                                                    value: form.athlete_id,
                                                    onChange: e => setForm({ ...form, athlete_id: e.target.value }),
                                                    className: "w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500",
                                                    children: [
                                                        (0, t.jsx)("option", { value: "", disabled: !0, children: eligibleAthletes.length === 0 ? "-- Tidak ada atlet yang sesuai dengan kategori ini --" : "-- Pilih Atlet --" }),
                                                        eligibleAthletes.map(a => (
                                                            (0, t.jsxs)("option", { value: a.id, children: [a.name, " (", a.gender === 1 ? "Putra" : "Putri", a.body_weight ? `, ${a.body_weight} Kg` : "", a.date_of_birth ? `, Thn ${new Date(a.date_of_birth).getFullYear()}` : "", ")"] }, a.id)
                                                        ))
                                                    ]
                                                })
                                            ) : (
                                                (0, t.jsxs)("div", {
                                                    className: "p-3.5 bg-green-50/50 rounded-lg border border-green-200 space-y-3",
                                                    children: [
                                                        (0, t.jsxs)("div", {
                                                            children: [
                                                                (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Nama Atlet Baru *" }),
                                                                (0, t.jsx)("input", {
                                                                    required: !0,
                                                                    type: "text",
                                                                    value: form.name,
                                                                    onChange: e => setForm({ ...form, name: e.target.value }),
                                                                    placeholder: "Nama lengkap atlet",
                                                                    className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                                })
                                                            ]
                                                        }),
                                                        (0, t.jsxs)("div", {
                                                            className: "grid grid-cols-2 gap-2",
                                                            children: [
                                                                (0, t.jsxs)("div", {
                                                                    children: [
                                                                        (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Jenis Kelamin" }),
                                                                        (0, t.jsxs)("select", {
                                                                            value: form.gender,
                                                                            onChange: e => setForm({ ...form, gender: e.target.value }),
                                                                            className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white",
                                                                            children: [
                                                                                (0, t.jsx)("option", { value: 1, children: "Putra" }),
                                                                                (0, t.jsx)("option", { value: 2, children: "Putri" })
                                                                            ]
                                                                        })
                                                                    ]
                                                                }),
                                                                (0, t.jsxs)("div", {
                                                                    children: [
                                                                        (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Berat Badan (Kg)" }),
                                                                        (0, t.jsx)("input", {
                                                                            type: "number",
                                                                            value: form.body_weight,
                                                                            onChange: e => setForm({ ...form, body_weight: e.target.value }),
                                                                            placeholder: "Contoh: 40",
                                                                            className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                                        })
                                                                    ]
                                                                }),
                                                                (0, t.jsxs)("div", {
                                                                    className: "col-span-2",
                                                                    children: [
                                                                        (0, t.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Tanggal Lahir" }),
                                                                        (0, t.jsx)("input", {
                                                                            type: "date",
                                                                            value: form.date_of_birth,
                                                                            onChange: e => setForm({ ...form, date_of_birth: e.target.value }),
                                                                            className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            )
                                        ]
                                    })
                                )
                            ]
                        }),

                        // Modal Footer (Pinned at bottom, NEVER CUT OFF!)
                        (0, t.jsxs)("div", {
                            className: "flex justify-end gap-2 px-6 py-3.5 border-t border-gray-100 bg-gray-50/80 shrink-0",
                            style: { flexShrink: 0 },
                            children: [
                                (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => setModalOpen(!1),
                                    className: "px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition text-sm font-medium",
                                    children: "Batal"
                                }),
                                (0, t.jsxs)("button", {
                                    type: "submit",
                                    form: "regosh-modal-form-435",
                                    disabled: loadingAction,
                                    className: `px-5 py-2 text-white rounded-lg cursor-pointer transition text-sm font-semibold shadow-sm flex items-center gap-1.5 ${loadingAction ? 'opacity-70 cursor-not-allowed bg-green-500' : 'bg-green-600 hover:bg-green-700'}`,
                                    children: [
                                        loadingAction && (0, t.jsx)("span", { className: "animate-spin", children: "⏳" }),
                                        modalMode === "edit" ? "Simpan Perubahan" : (isModalTeam ? `Daftarkan Tim (${form.athlete_ids.length} Atlet)` : "Simpan & Daftarkan")
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),

            // Main Card (Design matching OSH-Event Participant List)
            (0,t.jsxs)("div",{
                className:"bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                children:[
                    // Card Top Bar Header
                    (0,t.jsxs)("div",{
                        className:"px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 bg-white",
                        children:[
                            // Left Title with User Icon
                            (0,t.jsxs)("div",{
                                className:"flex items-center gap-2.5",
                                children:[
                                    (0,t.jsx)("div",{
                                        className:"text-gray-800 flex items-center justify-center",
                                        children:(0,t.jsx)("svg",{
                                            width:"22",
                                            height:"22",
                                            viewBox:"0 0 24 24",
                                            fill:"currentColor",
                                            children:(0,t.jsx)("path",{
                                                d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                            })
                                        })
                                    }),
                                    (0,t.jsxs)("h3",{
                                        className:"text-gray-800 font-bold text-base md:text-lg tracking-tight",
                                        children:[
                                            tabType==="individual"?"Participant List":"Participant List (Team / Beregu)",
                                            authUser?.contingent?.name?` - ${authUser.contingent.name}`:""
                                        ]
                                    })
                                ]
                            }),
                            // Right Action Buttons: Download & + Add Participant
                            (0,t.jsxs)("div",{
                                className:"flex items-center gap-2",
                                children:[
                                    (0,t.jsxs)("button",{
                                        type:"button",
                                        onClick:exportCSV,
                                        className:"cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white rounded text-xs md:text-sm font-semibold shadow-xs transition",style:{backgroundColor:"#36b9cc",color:"#ffffff",padding:"6px 14px",borderRadius:"4px",fontWeight:"600",fontSize:"13px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"6px"},
                                        children:[
                                            (0,t.jsx)("svg",{
                                                width:"14",
                                                height:"14",
                                                viewBox:"0 0 24 24",
                                                fill:"none",
                                                stroke:"currentColor",
                                                strokeWidth:"2.5",
                                                strokeLinecap:"round",
                                                strokeLinejoin:"round",
                                                children:[
                                                    (0,t.jsx)("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),
                                                    (0,t.jsx)("polyline",{points:"7 10 12 15 17 10"}),
                                                    (0,t.jsx)("line",{x1:"12",y1:"15",x2:"12",y2:"3"})
                                                ]
                                            }),
                                            "Download"
                                        ]
                                    }),
                                    (0,t.jsxs)("button",{
                                        type:"button",
                                        onClick:openAdd,
                                        className:"cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white rounded text-xs md:text-sm font-semibold shadow-xs transition",style:{backgroundColor:"#36b9cc",color:"#ffffff",padding:"6px 14px",borderRadius:"4px",fontWeight:"600",fontSize:"13px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"6px"},
                                        children:[
                                            (0,t.jsx)("svg",{
                                                width:"14",
                                                height:"14",
                                                viewBox:"0 0 24 24",
                                                fill:"none",
                                                stroke:"currentColor",
                                                strokeWidth:"2.5",
                                                strokeLinecap:"round",
                                                strokeLinejoin:"round",
                                                children:[
                                                    (0,t.jsx)("path",{d:"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),
                                                    (0,t.jsx)("circle",{cx:"8.5",cy:"7",r:"4"}),
                                                    (0,t.jsx)("line",{x1:"20",y1:"8",x2:"20",y2:"14"}),
                                                    (0,t.jsx)("line",{x1:"23",y1:"11",x2:"17",y2:"11"})
                                                ]
                                            }),
                                            "+ Add Participant"
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),

                    // Filter & Search Controls Bar
                    (0,t.jsxs)("div",{
                        className:"p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs md:text-sm",
                        children:[
                            // Filters: Type (Individual/Team), Gender, Class
                            (0,t.jsxs)("div",{
                                className:"flex items-center gap-2 flex-wrap",
                                children:[
                                    // Tab Type
                                    (0,t.jsxs)("div",{
                                        className:"inline-flex rounded-md shadow-xs bg-gray-200 p-0.5",
                                        children:[
                                            (0,t.jsx)("button",{
                                                type:"button",
                                                onClick:()=>setTabType("individual"),
                                                className:`px-2.5 py-1 text-xs font-medium rounded ${tabType==='individual'?'bg-white text-gray-800 shadow-xs font-semibold':'text-gray-600 hover:text-gray-900'}`,
                                                children:"Individual"
                                            }),
                                            (0,t.jsx)("button",{
                                                type:"button",
                                                onClick:()=>setTabType("team"),
                                                className:`px-2.5 py-1 text-xs font-medium rounded ${tabType==='team'?'bg-white text-gray-800 shadow-xs font-semibold':'text-gray-600 hover:text-gray-900'}`,
                                                children:"Beregu (Team)"
                                            })
                                        ]
                                    }),
                                    // Gender Filter
                                    (0,t.jsxs)("select",{
                                        value:genderFilter,
                                        onChange:e=>setGenderFilter(e.target.value),
                                        className:"border border-gray-300 rounded-md py-1.5 px-2.5 bg-white text-gray-700 text-xs focus:outline-none",
                                        children:[
                                            (0,t.jsx)("option",{value:"all",children:"Semua Gender"}),
                                            (0,t.jsx)("option",{value:"1",children:"Putra"}),
                                            (0,t.jsx)("option",{value:"2",children:"Putri"})
                                        ]
                                    }),
                                    // Class Filter
                                    (0,t.jsxs)("select",{
                                        value:catFilter,
                                        onChange:e=>setCatFilter(e.target.value),
                                        className:"border border-gray-300 rounded-md py-1.5 px-2.5 bg-white text-gray-700 text-xs focus:outline-none max-w-xs",
                                        children:[
                                            (0,t.jsx)("option",{value:"all",children:"Semua Kelas"}),
                                            cats.map(c=>(0,t.jsx)("option",{value:c.id,children:c.category?.name},c.id))
                                        ]
                                    }),
                                    // Total count
                                    (0,t.jsxs)("span",{
                                        className:"text-xs font-semibold text-gray-500 ml-1",
                                        children:["Total: ",filteredParticipants.length]
                                    })
                                ]
                            }),
                            // Search box placed on right with search icon at far right corner
                            (0,t.jsxs)("div",{
                                className:"relative flex-1 max-w-md md:max-w-xs",
                                style:{position:"relative",marginLeft:"auto"},
                                children:[
                                    (0,t.jsx)("input",{
                                        type:"text",
                                        value:search,
                                        onChange:e=>setSearch(e.target.value),
                                        placeholder:"Cari nama peserta, kelas...",
                                        style:{paddingLeft:"16px",paddingRight:"42px"},
                                        className:"w-full py-1.5 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#36b9cc]"
                                    }),
                                    (0,t.jsx)("div",{
                                        style:{position:"absolute",top:"50%",right:"14px",left:"auto",transform:"translateY(-50%)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",color:"#9ca3af"},
                                        children:(0,t.jsx)(i.Icon,{icon:"solar:magnifer-linear",width:16})
                                    })
                                ]
                            })
                        ]
                    }),

                    // Responsive Table: Exact column order requested by user
                    // Order: 1. No, 2. Nama, 3. Kontingen, 4. Kelas, 5. Jenis Kelamin, 6. Tanggal Lahir, 7. Berat badan, 8. Actions
                    (0,t.jsx)("div",{
                        className:"overflow-x-auto",
                        children:(0,t.jsxs)("table",{
                            className:"w-full text-left border-collapse",
                            children:[
                                (0,t.jsx)("thead",{
                                    style:{color:"#000000"},
                                    children:(0,t.jsxs)("tr",{
                                        className:"bg-[#f8f9fc] text-black text-xs font-bold border-b border-gray-200 uppercase tracking-wider",
                                        style:{color:"#000000"},
                                        children:[
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-3 text-center w-12 border-r border-gray-100 font-bold",children:"No"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 border-r border-gray-100 font-bold",children:"Nama"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 border-r border-gray-100 font-bold",children:"Kontingen"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 border-r border-gray-100 font-bold",children:"Kelas"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 border-r border-gray-100 font-bold",children:"Jenis Kelamin"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 border-r border-gray-100 font-bold",children:"Tanggal Lahir"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 border-r border-gray-100 font-bold",children:"Berat badan"}),
                                            (0,t.jsx)("th",{style:{color:"#000000"},className:"py-3 px-4 text-center font-bold",children:"Actions"})
                                        ]
                                    })
                                }),
                                (0,t.jsx)("tbody",{
                                    className:"divide-y divide-gray-200 bg-white text-xs md:text-sm",
                                    children:filteredParticipants.length===0?(
                                        (0,t.jsx)("tr",{
                                            children:(0,t.jsx)("td",{
                                                colSpan:8,
                                                className:"py-12 text-center text-gray-400",
                                                children:(0,t.jsxs)("div",{
                                                    className:"flex flex-col items-center justify-center gap-2",
                                                    children:[
                                                        (0,t.jsx)(i.Icon,{icon:"solar:user-cross-linear",width:38,className:"text-gray-300"}),
                                                        (0,t.jsx)("span",{className:"font-medium text-gray-500",children:"Tidak ada peserta yang terdaftar pada event ini."}),
                                                        (0,t.jsx)("button",{
                                                            type:"button",
                                                            onClick:openAdd,
                                                            className:"mt-1 text-xs text-[#36b9cc] hover:underline font-semibold",
                                                            children:"+ Klik di sini untuk mendaftarkan atlet pertama"
                                                        })
                                                    ]
                                                })
                                            })
                                        })
                                    ):(
                                        filteredParticipants.map((p,idx)=>{
                                            let ath=p.athlete;
                                            let catObj=cats.find(c=>c.id===p.category_id);
                                            let catName=catObj?.category?.name||p.category?.category?.name||"-";
                                            let contName=p.event_contingent?.contingent?.name||p.event_contingent?.contingent?.abbreviation||ath?.contingent?.name||"-";
                                            let athName=ath?.name||p.team_name||"-";
                                            let genderText=ath?.gender?formatGender(ath.gender):formatGender(catObj?.category?.gender);
                                            let dobText=ath?.date_of_birth?formatDate(ath.date_of_birth):"-";
                                            let weightText=ath?.body_weight?formatWeight(ath.body_weight):"-";

                                            return (0,t.jsxs)("tr",{
                                                className:"hover:bg-gray-50/80 transition duration-100",
                                                children:[
                                                    // 1. No (#)
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-3 text-center text-gray-600 font-medium border-r border-gray-100",
                                                        children:idx+1
                                                    }),
                                                    // 2. Nama
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 font-semibold text-gray-800 tracking-wide border-r border-gray-100",
                                                        children:athName
                                                    }),
                                                    // 3. Kontingen
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 text-gray-700 border-r border-gray-100",
                                                        children:contName
                                                    }),
                                                    // 4. Kelas
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 text-gray-700 border-r border-gray-100",
                                                        children:catName
                                                    }),
                                                    // 5. Jenis Kelamin
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 text-gray-700 border-r border-gray-100",
                                                        children:genderText
                                                    }),
                                                    // 6. Tanggal Lahir
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 text-gray-600 border-r border-gray-100",
                                                        children:dobText
                                                    }),
                                                    // 7. Berat badan
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 text-gray-600 border-r border-gray-100",
                                                        children:weightText
                                                    }),
                                                    // 8. Actions (Edit amber, delete red)
                                                    (0,t.jsx)("td",{
                                                        className:"py-3 px-4 text-center whitespace-nowrap",
                                                        children:(0,t.jsxs)("div",{
                                                            style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"},
                                                            className:"flex items-center justify-center gap-2",
                                                            children:[
                                                                (0,t.jsx)("button",{
                                                                    type:"button",
                                                                    onClick:()=>openEdit(p),
                                                                    className:"px-2.5 py-1 text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer",style:{backgroundColor:"#f6c23e",color:"#ffffff",padding:"4px 10px",borderRadius:"4px",fontWeight:"600",fontSize:"12px",border:"none",cursor:"pointer",display:"inline-block"},
                                                                    children:"Edit"
                                                                }),
                                                                (0,t.jsx)("button",{
                                                                    type:"button",
                                                                    onClick:(e)=>deletePart(e,p.id),
                                                                    className:"px-2.5 py-1 text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer",style:{backgroundColor:"#e74a3b",color:"#ffffff",padding:"4px 10px",borderRadius:"4px",fontWeight:"600",fontSize:"12px",border:"none",cursor:"pointer",display:"inline-block"},
                                                                    children:"Delete"
                                                                })
                                                            ]
                                                        })
                                                    })
                                                ]
                                            },p.id||idx);
                                        })
                                    )
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
}));
e.s(["default",0,f])},31756,e=>{e.v(t=>Promise.all(["static/chunks/c7a6be9968e0cecc.js"].map(t=>e.l(t))).then(()=>t(23145)))}]);