(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,88201,e=>{"use strict";
var t=e.i(43476); // jsx
var d=e.i(78367); // DashboardLayout
var a=e.i(23720); // Input
var l=e.i(2153);  // withWrapSuspense
var s=e.i(60107); // withAuth
var r=e.i(70522); // categoryRepo
var n=e.i(80065); // rank methods
var i=e.i(63662); // Icon
var c=e.i(71645); // React
var toast=e.i(5766); // toast

let Page = (0,l.withWrapSuspense)((0,s.withAuth)(()=>{
    let [category, setCategory] = (0,c.useState)("");
    let [year, setYear] = (0,c.useState)(`${new Date().getFullYear()}`);
    let [categories, setCategories] = (0,c.useState)([]);
    let [rankData, setRankData] = (0,c.useState)(null);
    let [loading, setLoading] = (0,c.useState)(!1);

    // Detail modal
    let [detailModalOpen, setDetailModalOpen] = (0,c.useState)(!1);
    let [selectedAthlete, setSelectedAthlete] = (0,c.useState)(null);
    let [athleteDetails, setAthleteDetails] = (0,c.useState)(null);
    let [detailLoading, setDetailLoading] = (0,c.useState)(!1);

    // Extra point modal
    let [extraModalOpen, setExtraModalOpen] = (0,c.useState)(!1);
    let [extraData, setExtraData] = (0,c.useState)({ id: null, athlete_id: "", athlete_name: "", point: 0, description: "" });

    // Series result modal
    let [seriesModalOpen, setSeriesModalOpen] = (0,c.useState)(!1);
    let [seriesData, setSeriesData] = (0,c.useState)({ match_result_id: null, athlete_id: "", athlete_name: "", event_id: "", position: 1, point: 50, last_match_point: "" });

    // Load categories
    let loadCategories = async () => {
        try {
            let res = await r.categoryRepo.getCategories();
            if (res?.status) setCategories(res.data?.data || []);
        } catch (err) {}
    };

    // Load ranks
    let loadRanks = async () => {
        if (!category || !year) return;
        setLoading(!0);
        try {
            let res = await n.getRank(year, category);
            if (res?.status) {
                setRankData(res.data?.data || null);
            } else {
                setRankData(null);
            }
        } catch (err) {}
        setLoading(!1);
    };

    (0,c.useEffect)(() => { loadCategories(); }, []);
    (0,c.useEffect)(() => { loadRanks(); }, [category, year]);

    // Open athlete details
    let openDetails = async (ath) => {
        setSelectedAthlete(ath);
        setDetailModalOpen(!0);
        setDetailLoading(!0);
        try {
            let res = await n.getAthleteRankDetails(year, category, ath.athlete_id);
            if (res?.status) {
                setAthleteDetails(res.data?.data || null);
            }
        } catch (err) {}
        setDetailLoading(!1);
    };

    // Open add extra point modal
    let openAddExtra = (ath) => {
        setExtraData({
            id: null,
            athlete_id: ath ? (ath.athlete_id || ath.id) : "",
            athlete_name: ath ? (ath.athlete_name || ath.name) : "",
            point: 10,
            description: ""
        });
        setExtraModalOpen(!0);
    };

    // Open edit extra point modal
    let openEditExtra = (item, ath) => {
        setExtraData({
            id: item.id,
            athlete_id: ath ? (ath.athlete_id || ath.id) : "",
            athlete_name: ath ? (ath.athlete_name || ath.name) : "",
            point: item.point,
            description: item.description || ""
        });
        setExtraModalOpen(!0);
    };

    // Save extra point
    let handleSaveExtra = async (e) => {
        e.preventDefault();
        if (!extraData.athlete_id) {
            toast.default.error("Silakan pilih atlet!");
            return;
        }
        try {
            let res;
            if (extraData.id) {
                res = await n.updateExtraPoint(extraData.id, {
                    point: Number(extraData.point),
                    description: extraData.description
                });
            } else {
                res = await n.saveExtraPoint({
                    athlete_id: Number(extraData.athlete_id),
                    point: Number(extraData.point),
                    description: extraData.description,
                    category_id: category ? Number(category) : null
                });
            }
            if (res?.status) {
                toast.default.success("Extra point berhasil disimpan!");
                setExtraModalOpen(!1);
                loadRanks();
                if (detailModalOpen && selectedAthlete) {
                    openDetails(selectedAthlete);
                }
            } else {
                toast.default.error(res?.error?.message || "Gagal menyimpan extra point!");
            }
        } catch (err) {
            toast.default.error("Terjadi kesalahan sistem!");
        }
    };

    // Delete extra point
    let handleDeleteExtra = async (id) => {
        if (!window.confirm("Yakin ingin menghapus poin ini?")) return;
        try {
            let res = await n.deleteExtraPoint(id);
            if (res?.status) {
                toast.default.success("Poin berhasil dihapus!");
                loadRanks();
                if (detailModalOpen && selectedAthlete) {
                    openDetails(selectedAthlete);
                }
            }
        } catch (err) {
            toast.default.error("Gagal menghapus poin!");
        }
    };

    // Open series result modal
    let openSeriesModal = (ath, eventId, existingMr) => {
        let defaultPoints = { 99: -25 };
        let defPos = existingMr ? existingMr.position : 1;
        setSeriesData({
            match_result_id: existingMr ? existingMr.id : null,
            athlete_id: ath ? (ath.athlete_id || ath.id) : "",
            athlete_name: ath ? (ath.athlete_name || ath.name) : "",
            event_id: eventId || (athleteDetails?.events?.[0]?.id || ""),
            position: defPos,
            point: existingMr ? existingMr.point : (defaultPoints[defPos] !== undefined ? defaultPoints[defPos] : 0),
            last_match_point: (existingMr && existingMr.last_match_point !== null && existingMr.last_match_point !== undefined && Number(existingMr.last_match_point) > 0) ? existingMr.last_match_point : ""
        });
        setSeriesModalOpen(!0);
    };

    // Save series result
    let handleSaveSeries = async (e) => {
        e.preventDefault();
        if (!seriesData.athlete_id || !seriesData.event_id) {
            toast.default.error("Data atlet dan series event wajib diisi!");
            return;
        }
        try {
            let res = await n.saveSeriesResult({
                athlete_id: Number(seriesData.athlete_id),
                event_id: Number(seriesData.event_id),
                category_id: Number(category),
                position: Number(seriesData.position),
                point: Number(seriesData.point),
                last_match_point: seriesData.last_match_point !== "" ? Number(seriesData.last_match_point) : null
            });
            if (res?.status) {
                toast.default.success("Hasil series pertandingan berhasil disimpan!");
                setSeriesModalOpen(!1);
                loadRanks();
                if (detailModalOpen && selectedAthlete) {
                    openDetails(selectedAthlete);
                }
            } else {
                toast.default.error(res?.error?.message || "Gagal menyimpan hasil series!");
            }
        } catch (err) {
            toast.default.error("Terjadi kesalahan sistem!");
        }
    };

    // Delete series result
    let handleDeleteSeries = async (id) => {
        if (!window.confirm("Yakin ingin menghapus hasil pertandingan series ini?")) return;
        try {
            let res = await n.deleteSeriesResult(id);
            if (res?.status) {
                toast.default.success("Hasil series berhasil dihapus!");
                setSeriesModalOpen(!1);
                loadRanks();
                if (detailModalOpen && selectedAthlete) {
                    openDetails(selectedAthlete);
                }
            }
        } catch (err) {
            toast.default.error("Gagal menghapus hasil series!");
        }
    };

    // Filter categories options
    let categoryOptions = [
        { value: "", label: "Pilih Kategori", disabled: !0 },
        ...categories.filter(e => !e.is_best_of_the_best && !e.is_festival && e.is_series && (!e.series_years || !e.series_years.length || e.series_years.includes(Number(year))))
                     .sort((e, t) => e.name.localeCompare(t.name))
                     .map(e => ({ value: e.id.toString(), label: e.name }))
    ];

    // Year options
    let currentYr = new Date().getFullYear();
    let yearOptions = [];
    for (let y = 0; y < 5; y++) {
        yearOptions.push({ value: (currentYr - y).toString(), label: (currentYr - y).toString() });
    }

    return (0,t.jsx)(d.DashboardLayout, {
        children: (0,t.jsxs)("div", {
            className: "p-4 md:p-6 w-full max-w-7xl mx-auto space-y-6",
            children: [
                // Page Header
                (0,t.jsxs)("div", {
                    className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm",
                    children: [
                        (0,t.jsxs)("div", {
                            children: [
                                (0,t.jsxs)("h1", {
                                    className: "text-xl font-bold text-gray-800 flex items-center gap-2",
                                    children: [
                                        (0,t.jsx)(i.Icon, { icon: "solar:cup-star-line-duotone", className: "text-primary-600 text-2xl" }),
                                        "Kelola Peringkat (Series Ranks)"
                                    ]
                                }),
                                (0,t.jsx)("p", {
                                    className: "text-xs text-gray-500 mt-1",
                                    children: "Kelola peringkat atlet, hasil pertandingan per series, dan poin tambahan/penalti kategori series"
                                })
                            ]
                        }),
                        // Action button
                        category && (0,t.jsxs)("div", {
                            className: "flex items-center gap-2",
                            children: [
                                (0,t.jsxs)("button", {
                                    type: "button",
                                    onClick: () => openAddExtra(null),
                                    className: "px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer",
                                    children: [
                                        (0,t.jsx)(i.Icon, { icon: "solar:star-fall-line-duotone", className: "text-base" }),
                                        "Tambah Extra Point"
                                    ]
                                })
                            ]
                        })
                    ]
                }),

                // Filters
                (0,t.jsxs)("div", {
                    className: "bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center",
                    children: [
                        (0,t.jsx)("div", {
                            className: "flex-1 w-full",
                            children: (0,t.jsx)(a.Input, {
                                type: "select",
                                id: "admin-category",
                                value: category,
                                onChange: e => setCategory(e),
                                options: categoryOptions
                            })
                        }),
                        (0,t.jsx)("div", {
                            className: "w-full md:w-44",
                            children: (0,t.jsx)(a.Input, {
                                type: "select",
                                id: "admin-year",
                                value: year,
                                onChange: e => setYear(e),
                                options: yearOptions
                            })
                        })
                    ]
                }),

                // Main Ranks Table
                category ? (0,t.jsxs)("div", {
                    className: "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden",
                    children: [
                        (0,t.jsx)("div", {
                            className: "overflow-x-auto",
                            children: (0,t.jsxs)("table", {
                                className: "w-full text-sm text-left text-gray-600",
                                children: [
                                    (0,t.jsx)("thead", {
                                        className: "bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                        children: (0,t.jsxs)("tr", {
                                            children: [
                                                (0,t.jsx)("th", { className: "px-4 py-3.5 text-center w-16", children: "Peringkat" }),
                                                (0,t.jsx)("th", { className: "px-4 py-3.5", children: "Nama Atlet" }),
                                                Array.from({ length: Math.max(4, rankData?.series || 0) }, (e, idx) => (
                                                    (0,t.jsxs)("th", {
                                                        key: idx,
                                                        className: "px-4 py-3.5 text-center min-w-[70px]",
                                                        children: ["S-", idx + 1]
                                                    })
                                                )),
                                                (0,t.jsx)("th", { className: "px-4 py-3.5 text-center min-w-[80px]", children: "Extra Poin" }),
                                                (0,t.jsx)("th", { className: "px-4 py-3.5 text-center min-w-[80px]", children: "Total Poin" }),
                                                (0,t.jsx)("th", { className: "px-4 py-3.5 text-center w-36", children: "Aksi Admin" })
                                            ]
                                        })
                                    }),
                                    (0,t.jsx)("tbody", {
                                        className: "divide-y divide-gray-100",
                                        children: loading ? (
                                            (0,t.jsx)("tr", {
                                                children: (0,t.jsx)("td", {
                                                    colSpan: 5 + Math.max(4, rankData?.series || 0),
                                                    className: "py-12 text-center text-gray-400",
                                                    children: "Memuat data peringkat..."
                                                })
                                            })
                                        ) : Array.from({ length: 10 }, (e, a) => {
                                            let s = rankData?.ranks?.[a] || null;
                                            return (0,t.jsxs)("tr", {
                                                className: "hover:bg-gray-50/80 transition-colors",
                                                children: [
                                                    // Peringkat & Arrow
                                                    (0,t.jsx)("td", {
                                                        className: "px-4 py-3 text-center",
                                                        children: (0,t.jsxs)("div", {
                                                            className: "flex items-center justify-center gap-1",
                                                            children: [
                                                                (0,t.jsx)("span", {
                                                                    className: `font-bold text-sm ${a < 3 ? "text-primary-700" : "text-gray-700"}`,
                                                                    children: s?.position || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][a] || a + 1
                                                                }),
                                                                s?.rank_change > 0 ? (
                                                                    (0,t.jsx)(i.Icon, { icon: "ic:round-arrow-drop-up", className: "text-green-500 text-2xl" })
                                                                ) : s?.rank_change < 0 ? (
                                                                    (0,t.jsx)(i.Icon, { icon: "ic:round-arrow-drop-down", className: "text-red-500 text-2xl" })
                                                                ) : null
                                                            ]
                                                        })
                                                    }),
                                                    // Nama Atlet
                                                    (0,t.jsx)("td", {
                                                        className: "px-4 py-3",
                                                        children: s?.athlete_name ? (
                                                            (0,t.jsx)("button", {
                                                                type: "button",
                                                                onClick: () => openDetails(s),
                                                                className: "font-semibold text-primary-600 hover:text-primary-800 hover:underline cursor-pointer text-left",
                                                                children: s.athlete_name
                                                            })
                                                        ) : (
                                                            (0,t.jsx)("span", { className: "text-gray-400 italic", children: "-" })
                                                        )
                                                    }),
                                                    // Series Points Columns
                                                    Array.from({ length: Math.max(4, rankData?.series || 0) }, (e, idx) => {
                                                        let serieObj = s?.series?.[idx];
                                                        return (0,t.jsxs)("td", {
                                                            key: idx,
                                                            className: "px-4 py-3 text-center text-xs",
                                                            children: [
                                                                (0,t.jsx)("span", {
                                                                    className: serieObj?.points?.includes(-25) ? "text-red-500 font-semibold" : "text-gray-700",
                                                                    children: (serieObj?.points && serieObj.points.length > 0) ? serieObj.points.join(",") : "-"
                                                                }),
                                                                serieObj?.extra?.length > 0 ? (
                                                                    (0,t.jsxs)("span", { className: "text-blue-500 ml-1 font-medium", children: ["(+", serieObj.extra.join(","), ")"] })
                                                                ) : null
                                                            ]
                                                        });
                                                    }),
                                                    // Extra Point
                                                    (0,t.jsx)("td", {
                                                        className: `px-4 py-3 text-center text-xs font-semibold ${s?.extra_point?.length > 0 ? "text-blue-600" : "text-gray-400"}`,
                                                        children: (s?.extra_point && s.extra_point.length > 0) ? s.extra_point.join(",") : "-"
                                                    }),
                                                    // Total Point
                                                    (0,t.jsx)("td", {
                                                        className: "px-4 py-3 text-center font-bold text-gray-800 text-sm",
                                                        children: s?.total_point ?? "-"
                                                    }),
                                                    // Aksi Admin
                                                    (0,t.jsx)("td", {
                                                        className: "px-4 py-3 text-center",
                                                        children: s ? (
                                                            (0,t.jsxs)("div", {
                                                                className: "flex items-center justify-center gap-1",
                                                                children: [
                                                                    (0,t.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => openDetails(s),
                                                                        title: "Kelola Lengkap & Riwayat Poin",
                                                                        className: "p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition cursor-pointer",
                                                                        children: (0,t.jsx)(i.Icon, { icon: "solar:pen-new-square-line-duotone", className: "text-lg" })
                                                                    }),
                                                                    (0,t.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => openAddExtra(s),
                                                                        title: "Tambah Extra Point / Penalti",
                                                                        className: "p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition cursor-pointer",
                                                                        children: (0,t.jsx)(i.Icon, { icon: "solar:star-line-duotone", className: "text-lg" })
                                                                    })
                                                                ]
                                                            })
                                                        ) : (
                                                            (0,t.jsx)("span", { className: "text-gray-300 text-xs", children: "-" })
                                                        )
                                                    })
                                                ]
                                            }, a);
                                        })
                                    })
                                ]
                            })
                        })
                    ]
                }) : (
                    (0,t.jsx)("div", {
                        className: "bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center text-gray-400",
                        children: "Silakan pilih Kategori untuk menampilkan tabel peringkat atlet."
                    })
                ),

                // Modal 1: Detail & Kelola Riwayat Poin Atlet
                detailModalOpen && (0,t.jsx)("div", {
                    className: "fixed inset-0 z-50 overflow-y-auto bg-black/60 p-2 sm:p-4 flex items-center justify-center",
                    style: { display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9990 },
                    onClick: () => setDetailModalOpen(!1),
                    children: (0,t.jsxs)("div", {
                        className: "bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col border border-gray-100 my-auto",
                        style: { maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column" },
                        onClick: e => e.stopPropagation(),
                        children: [
                            // Modal Header
                            (0,t.jsxs)("div", {
                                className: "px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0",
                                style: { flexShrink: 0 },
                                children: [
                                    (0,t.jsxs)("div", {
                                        className: "flex items-center gap-3.5",
                                        children: [
                                            (0,t.jsx)("img", {
                                                src: selectedAthlete?.athlete_photo || selectedAthlete?.photo || athleteDetails?.athlete?.photo || athleteDetails?.athlete?.athlete_photo || "/no-image.jpg",
                                                alt: selectedAthlete?.athlete_name,
                                                className: "w-12 h-12 rounded-full object-cover border border-gray-200 shadow-xs shrink-0",
                                                onError: e => { e.currentTarget.src = "/no-image.jpg"; }
                                            }),
                                            (0,t.jsxs)("div", {
                                                children: [
                                                    (0,t.jsx)("h3", { className: "text-base font-bold text-gray-800 leading-tight", children: selectedAthlete?.athlete_name }),
                                                    (0,t.jsxs)("p", {
                                                        className: "text-xs text-gray-600 mt-0.5 flex items-center gap-1",
                                                        children: [
                                                            "Kontingen: ",
                                                            (0,t.jsx)("span", {
                                                                className: "font-semibold text-primary-600",
                                                                children: selectedAthlete?.contingent_name || selectedAthlete?.contingent || athleteDetails?.athlete?.contingent_name || athleteDetails?.athlete?.contingent || "-"
                                                            })
                                                        ]
                                                    }),
                                                    (0,t.jsxs)("p", {
                                                        className: "text-xs text-gray-500 mt-0.5",
                                                        children: ["Total Poin Saat Ini: ", (0,t.jsx)("span", { className: "font-bold text-primary-600", children: selectedAthlete?.total_point })]
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    (0,t.jsx)("button", {
                                        type: "button",
                                        onClick: () => setDetailModalOpen(!1),
                                        className: "text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer",
                                        children: (0,t.jsx)(i.Icon, { icon: "ic:round-close", className: "text-2xl" })
                                    })
                                ]
                            }),

                            // Modal Body
                            (0,t.jsx)("div", {
                                className: "p-6 space-y-6 flex-1",
                                style: { overflowY: "auto", flex: "1 1 auto", maxHeight: "calc(88vh - 130px)" },
                                children: detailLoading ? (
                                    (0,t.jsx)("div", { className: "py-12 text-center text-gray-400", children: "Memuat rincian atlet..." })
                                ) : (
                                    (0,t.jsxs)("div", {
                                        className: "space-y-6",
                                        children: [
                                            // Section 1: Series Results
                                            (0,t.jsxs)("div", {
                                                children: [
                                                    (0,t.jsxs)("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            (0,t.jsxs)("h4", {
                                                                className: "text-sm font-bold text-gray-700 flex items-center gap-1.5",
                                                                children: [
                                                                    (0,t.jsx)(i.Icon, { icon: "solar:cup-line-duotone", className: "text-primary-600 text-lg" }),
                                                                    "Hasil Pertandingan Series"
                                                                ]
                                                            }),
                                                            (0,t.jsxs)("button", {
                                                                type: "button",
                                                                onClick: () => openSeriesModal(selectedAthlete, athleteDetails?.events?.[0]?.id, null),
                                                                className: "text-xs px-2.5 py-1 bg-black text-white hover:bg-gray-800 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm",
                                                                children: [
                                                                    (0,t.jsx)(i.Icon, { icon: "solar:add-circle-line-duotone", className: "text-sm text-white" }),
                                                                    "Input Hasil Seri"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    (0,t.jsx)("div", {
                                                        className: "space-y-2 pr-1",
                                                        style: { maxHeight: "200px", overflowY: "auto", paddingRight: "4px" },
                                                        children: athleteDetails?.events?.map((ev, idx) => {
                                                            let mr = athleteDetails?.match_results?.find(m => m.category?.event_id == ev.id || m.category_id == ev.event_category_id);
                                                            let posLabel = mr ? (mr.position === 1 ? "Juara 1 🥇" : mr.position === 2 ? "Juara 2 🥈" : mr.position === 3 || mr.position === 4 ? "Juara 3 🥉" : mr.position >= 5 && mr.position <= 8 ? "Peringkat 5" : mr.position >= 9 && mr.position <= 16 ? "Peringkat 6" : mr.position >= 17 && mr.position <= 32 ? "Peringkat 7" : mr.position === 99 ? "Tidak Mengikuti Series (-25)" : `Peringkat ${mr.position}`) : "Belum Ada Hasil";
                                                            return (0,t.jsxs)("div", {
                                                                key: ev.id,
                                                                className: "p-3 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3",
                                                                children: [
                                                                    (0,t.jsxs)("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            (0,t.jsx)("span", {
                                                                                className: "w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0",
                                                                                children: `S-${idx + 1}`
                                                                            }),
                                                                            (0,t.jsxs)("div", {
                                                                                children: [
                                                                                    (0,t.jsx)("div", { className: "font-semibold text-gray-800 text-xs", children: ev.name }),
                                                                                    (0,t.jsxs)("div", {
                                                                                        className: "text-xs font-medium text-gray-500",
                                                                                        children: [
                                                                                            posLabel,
                                                                                            mr ? ` • Poin: ${mr.point}` : ""
                                                                                        ]
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    (0,t.jsxs)("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            (0,t.jsxs)("button", {
                                                                                type: "button",
                                                                                onClick: () => openSeriesModal(selectedAthlete, ev.id, mr),
                                                                                className: "px-2.5 py-1 text-xs bg-black text-white hover:bg-gray-800 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm",
                                                                                children: [
                                                                                    (0,t.jsx)(i.Icon, { icon: "solar:pen-line-duotone", className: "text-xs text-white" }),
                                                                                    mr ? "Ubah" : "Set Hasil"
                                                                                ]
                                                                            }),
                                                                            mr && (0,t.jsx)("button", {
                                                                                type: "button",
                                                                                onClick: () => handleDeleteSeries(mr.id),
                                                                                className: "p-1 text-gray-400 hover:text-red-500 transition cursor-pointer",
                                                                                title: "Hapus Hasil Pertandingan Ini",
                                                                                children: (0,t.jsx)(i.Icon, { icon: "solar:trash-bin-trash-bold", className: "text-sm" })
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            });
                                                        })
                                                    })
                                                ]
                                            }),

                                            // Section 2: Extra Points & Penalties
                                            (0,t.jsxs)("div", {
                                                children: [
                                                    (0,t.jsxs)("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            (0,t.jsxs)("h4", {
                                                                className: "text-sm font-bold text-gray-700 flex items-center gap-1.5",
                                                                children: [
                                                                    (0,t.jsx)(i.Icon, { icon: "solar:star-line-duotone", className: "text-yellow-500 text-lg" }),
                                                                    "Extra Point & Penalti"
                                                                ]
                                                            }),
                                                            (0,t.jsxs)("button", {
                                                                type: "button",
                                                                onClick: () => openAddExtra(selectedAthlete),
                                                                className: "text-xs px-2.5 py-1 bg-black text-white hover:bg-gray-800 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm",
                                                                children: [
                                                                    (0,t.jsx)(i.Icon, { icon: "solar:add-circle-line-duotone", className: "text-sm text-white" }),
                                                                    "Tambah Poin"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    (0,t.jsx)("div", {
                                                        className: "space-y-2 pr-1",
                                                        style: { maxHeight: "200px", overflowY: "auto", paddingRight: "4px" },
                                                        children: (athleteDetails?.point_history?.filter(p => p.is_extra_point || p.point < 0 || !athleteDetails?.match_results?.some(m => (m.category?.event_id == p.event_id || m.category_id == p.category_id) && m.point === p.point)) || []).length === 0 ? (
                                                            (0,t.jsx)("div", { className: "text-xs text-gray-400 py-3 text-center bg-gray-50 rounded-lg", children: "Belum ada riwayat extra point atau penalti." })
                                                        ) : (
                                                            athleteDetails?.point_history?.filter(p => p.is_extra_point || p.point < 0 || !athleteDetails?.match_results?.some(m => (m.category?.event_id == p.event_id || m.category_id == p.category_id) && m.point === p.point)).map(ph => (
                                                                (0,t.jsxs)("div", {
                                                                    key: ph.id,
                                                                    className: "p-3 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3",
                                                                    children: [
                                                                        (0,t.jsxs)("div", {
                                                                            children: [
                                                                                (0,t.jsx)("div", { className: "text-xs font-semibold text-gray-800", children: ph.description || "Poin Khusus" }),
                                                                                (0,t.jsx)("div", {
                                                                                    className: `text-xs font-bold mt-0.5 ${ph.point > 0 ? "text-blue-600" : "text-red-600"}`,
                                                                                    children: `${ph.point > 0 ? "+" : ""}${ph.point} Poin`
                                                                                })
                                                                            ]
                                                                        }),
                                                                        (0,t.jsxs)("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                (0,t.jsxs)("button", {
                                                                                    type: "button",
                                                                                    onClick: () => openEditExtra(ph, selectedAthlete),
                                                                                    className: "px-2.5 py-1 text-xs bg-black text-white hover:bg-gray-800 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm",
                                                                                    children: [
                                                                                        (0,t.jsx)(i.Icon, { icon: "solar:pen-line-duotone", className: "text-xs text-white" }),
                                                                                        "Edit"
                                                                                    ]
                                                                                }),
                                                                                (0,t.jsx)("button", {
                                                                                    type: "button",
                                                                                    onClick: () => handleDeleteExtra(ph.id),
                                                                                    className: "p-1.5 text-gray-500 hover:text-red-500 transition cursor-pointer",
                                                                                    children: (0,t.jsx)(i.Icon, { icon: "solar:trash-bin-trash-bold", className: "text-base" })
                                                                                })
                                                                            ]
                                                                        })
                                                                    ]
                                                                }, ph.id)
                                                            ))
                                                        )
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                )
                            }),

                            // Modal Footer
                            (0,t.jsx)("div", {
                                className: "px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0",
                                style: { flexShrink: 0 },
                                children: (0,t.jsx)("button", {
                                    type: "button",
                                    onClick: () => setDetailModalOpen(!1),
                                    className: "px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer",
                                    children: "Tutup"
                                })
                            })
                        ]
                    })
                }),

                // Modal 2: Series Result Form (Input / Update Series Match Result)
                seriesModalOpen && (0,t.jsx)("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto",
                    style: { display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10050 },
                    onClick: () => setSeriesModalOpen(!1),
                    children: (0,t.jsxs)("div", {
                        className: "bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 text-black",
                        onClick: e => e.stopPropagation(),
                        children: [
                            (0,t.jsxs)("div", {
                                className: "px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0",
                                children: [
                                    (0,t.jsxs)("div", {
                                        children: [
                                            (0,t.jsx)("h3", { className: "text-base font-bold text-black", children: "Input / Ubah Hasil Series" }),
                                            (0,t.jsx)("p", { className: "text-xs font-semibold text-black mt-0.5", children: seriesData.athlete_name })
                                        ]
                                    }),
                                    (0,t.jsx)("button", {
                                        type: "button",
                                        onClick: () => setSeriesModalOpen(!1),
                                        className: "text-black hover:text-gray-700 p-1 cursor-pointer",
                                        children: (0,t.jsx)(i.Icon, { icon: "ic:round-close", className: "text-xl text-black" })
                                    })
                                ]
                            }),
                            (0,t.jsxs)("form", {
                                onSubmit: handleSaveSeries,
                                className: "p-6 space-y-4 text-black",
                                children: [
                                    (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Pilih Series Event" }),
                                            (0,t.jsx)("select", {
                                                value: seriesData.event_id,
                                                onChange: e => setSeriesData({ ...seriesData, event_id: e.target.value }),
                                                className: "w-full text-xs font-semibold p-2.5 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-black",
                                                children: athleteDetails?.events?.map((ev, idx) => (
                                                    (0,t.jsxs)("option", { value: ev.id, className: "text-black font-medium", children: [`S-${idx + 1}: `, ev.name] }, ev.id)
                                                ))
                                            })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Posisi / Juara Pertandingan" }),
                                            (0,t.jsxs)("select", {
                                                value: seriesData.position,
                                                onChange: e => {
                                                    let p = Number(e.target.value);
                                                    let pts = { 1: 0, 2: 0, 3: 0, 5: 0, 9: 0, 17: 0, 99: -25 };
                                                    setSeriesData({
                                                        ...seriesData,
                                                        position: p,
                                                        point: pts[p] !== undefined ? pts[p] : seriesData.point
                                                    });
                                                },
                                                className: "w-full text-xs font-semibold p-2.5 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-black",
                                                children: [
                                                    (0,t.jsx)("option", { value: 1, className: "text-black font-medium", children: "Juara 1" }),
                                                    (0,t.jsx)("option", { value: 2, className: "text-black font-medium", children: "Juara 2" }),
                                                    (0,t.jsx)("option", { value: 3, className: "text-black font-medium", children: "Juara 3" }),
                                                    (0,t.jsx)("option", { value: 5, className: "text-black font-medium", children: "Peringkat 5" }),
                                                    (0,t.jsx)("option", { value: 9, className: "text-black font-medium", children: "Peringkat 6" }),
                                                    (0,t.jsx)("option", { value: 17, className: "text-black font-medium", children: "Peringkat 7" }),
                                                    (0,t.jsx)("option", { value: 99, className: "text-black font-medium", children: "Tidak Mengikuti Series (-25 Poin)" })
                                                ]
                                            })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Poin Yang Diperoleh" }),
                                            (0,t.jsx)("input", {
                                                type: "number",
                                                value: seriesData.point,
                                                onChange: e => setSeriesData({ ...seriesData, point: e.target.value }),
                                                className: "w-full text-xs font-bold p-2.5 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-black"
                                            })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Skor Akhir / Poin Pertandingan Terakhir (Opsional)" }),
                                            (0,t.jsx)("input", {
                                                type: "number",
                                                placeholder: "Contoh: 8",
                                                value: seriesData.last_match_point,
                                                onChange: e => setSeriesData({ ...seriesData, last_match_point: e.target.value }),
                                                className: "w-full text-xs font-medium p-2.5 rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:border-black"
                                            })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "flex items-center justify-between pt-2 border-t border-gray-200",
                                        children: [
                                            seriesData.match_result_id ? (
                                                (0,t.jsx)("button", {
                                                    type: "button",
                                                    onClick: () => handleDeleteSeries(seriesData.match_result_id),
                                                    className: "px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer",
                                                    children: "Hapus Hasil"
                                                })
                                            ) : (0,t.jsx)("div", {}),
                                            (0,t.jsxs)("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    (0,t.jsx)("button", {
                                                        type: "button",
                                                        onClick: () => setSeriesModalOpen(!1),
                                                        className: "px-3 py-2 text-xs font-semibold text-black hover:bg-gray-100 rounded-lg transition cursor-pointer border border-gray-300",
                                                        children: "Batal"
                                                    }),
                                                    (0,t.jsx)("button", {
                                                        type: "submit",
                                                        className: "px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-lg shadow-sm transition cursor-pointer",
                                                        children: "Simpan Hasil"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                }),

                // Modal 3: Extra Point Form (Tambah / Edit Extra Point & Penalti)
                extraModalOpen && (0,t.jsx)("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto",
                    style: { display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10050 },
                    onClick: () => setExtraModalOpen(!1),
                    children: (0,t.jsxs)("div", {
                        className: "bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 text-black",
                        onClick: e => e.stopPropagation(),
                        children: [
                            (0,t.jsxs)("div", {
                                className: "px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0",
                                children: [
                                    (0,t.jsxs)("div", {
                                        children: [
                                            (0,t.jsx)("h3", { className: "text-base font-bold text-black", children: extraData.id ? "Edit Extra Point / Penalti" : "Tambah Extra Point / Penalti" }),
                                            extraData.athlete_name && (0,t.jsx)("p", { className: "text-xs font-semibold text-black mt-0.5", children: extraData.athlete_name })
                                        ]
                                    }),
                                    (0,t.jsx)("button", {
                                        type: "button",
                                        onClick: () => setExtraModalOpen(!1),
                                        className: "text-black hover:text-gray-700 p-1 cursor-pointer",
                                        children: (0,t.jsx)(i.Icon, { icon: "ic:round-close", className: "text-xl text-black" })
                                    })
                                ]
                            }),
                            (0,t.jsxs)("form", {
                                onSubmit: handleSaveExtra,
                                className: "p-6 space-y-4 text-black",
                                children: [
                                    !extraData.athlete_id && (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Pilih Atlet" }),
                                            (0,t.jsxs)("select", {
                                                value: extraData.athlete_id,
                                                onChange: e => setExtraData({ ...extraData, athlete_id: e.target.value }),
                                                className: "w-full text-xs font-semibold p-2.5 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-black",
                                                children: [
                                                    (0,t.jsx)("option", { value: "", className: "text-black", children: "Pilih Atlet Di Peringkat" }),
                                                    rankData?.ranks?.map(ath => (
                                                        (0,t.jsx)("option", { value: ath.athlete_id, className: "text-black font-medium", children: ath.athlete_name }, ath.athlete_id)
                                                    ))
                                                ]
                                            })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Jumlah Poin" }),
                                            (0,t.jsx)("input", {
                                                type: "number",
                                                placeholder: "Contoh: 10 (bonus) atau -25 (penalti)",
                                                value: extraData.point,
                                                onChange: e => setExtraData({ ...extraData, point: e.target.value }),
                                                className: "w-full text-xs font-bold p-2.5 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-black"
                                            }),
                                            (0,t.jsx)("p", { className: "text-[11px] font-medium text-black", children: "Gunakan angka positif (+) untuk poin tambahan, atau negatif (-) untuk penalti." })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "space-y-1",
                                        children: [
                                            (0,t.jsx)("label", { className: "text-xs font-bold text-black", children: "Keterangan" }),
                                            (0,t.jsx)("input", {
                                                type: "text",
                                                placeholder: "Contoh: Bonus Juara Best of the Best",
                                                value: extraData.description,
                                                onChange: e => setExtraData({ ...extraData, description: e.target.value }),
                                                className: "w-full text-xs font-medium p-2.5 rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:border-black"
                                            })
                                        ]
                                    }),
                                    (0,t.jsxs)("div", {
                                        className: "flex items-center justify-end gap-2 pt-2 border-t border-gray-200",
                                        children: [
                                            (0,t.jsx)("button", {
                                                type: "button",
                                                onClick: () => setExtraModalOpen(!1),
                                                className: "px-3 py-2 text-xs font-semibold text-black hover:bg-gray-100 rounded-lg transition cursor-pointer border border-gray-300",
                                                children: "Batal"
                                            }),
                                            (0,t.jsx)("button", {
                                                type: "submit",
                                                className: "px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-lg shadow-sm transition cursor-pointer",
                                                children: "Simpan Poin"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                })
            ]
        })
    });
}));

e.s(["default",0,Page],88201);
e.s(["default",0,Page]);
}]);
