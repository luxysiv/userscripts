// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. See generate/ directory for more info
// ==UserScript==
// @name         Cosmetic Ad Block for Browser
// @namespace    luxysiv
// @version      2026.10.28
// @description  Blocks annoying elements in pages, sourced from many different filter lists
// @author       luxysiv 
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @homepage     https://github.com/luxysiv/userscripts
// @updateURL    https://userscripts.timie.workers.dev/cosmetic.user.js
// @downloadURL  https://userscripts.timie.workers.dev/cosmetic.user.js
// ==/UserScript==
/// @stats blockers for 344 domains, injected CSS rules for 0 domains
{
    "use strict";

    // Set to true to get verbose console output (defaults to off).
    const DEBUG = false;

    let log = function (...data) {
        if (DEBUG) console.log("[Cosmetic filters by luxysiv (v2026.10.28 full)]:", ...data);
    }

    // A single invalid member of a selector list is ignored by CSS, so the
    // combined selector string is safe even if one source rule is broken.
    const HIDE_RULE = "{display:none!important;visibility:hidden!important}";

    // ---------------------------------------------------------------------
    // Inline rules (the complete rule set of the build).
    // ---------------------------------------------------------------------
    let deduplicatedStrings = ["","#catfish","#catfish,#topbanner","#catfish-ad-banner","#catfish-ads","#flyer","#m-bet,.bg-overlay,.btn-bet-top,.mmo,.mzdal,a[rel=\"nofollow\"]","#player + div[id],.jw-logo,.playover",".__ads_click",".adbox",".ads",".advertisement",".afw-topbanner",".banner",".banner-top",".bg-black\\/70.justify-center.items-center.flex.z-\\[9999\\].inset-0.fixed",".cashfish,.mini-player",".catfish-bottom",".float-ck-center-lt",".footer-fixed-br-container",".gwd-banner-image",".info-footer:nth-child(4)",".mp-adz",".odds-button,.odds-button2",".p-4.bg-black\\/65.justify-center.items-center.flex.z-\\[90\\].inset-0.fixed,.pointer-events-none.justify-center.flex.z-\\[80\\].bottom-0.inset-x-0.fixed",".pcs-modal",".quangcaomobile",".sspp-area",".sticky-footer",".sys-ads",".unit-bar,.unit-fish,.unit-sheet","[id^=\"admzone\"]","a[rel=\"nofollow\"]","a[rel=\"noopener noreferrer\"]","div[id^=\"ads_\"]"];
    let injectionRules = {};
    let rules = {"":"#_AM_POPUP_FRAME,#ads-preload,#banner-top,#mobileCatfish,#pmadv,.aanetwork-ads-box,.ad_location,.adsbygoogle[data-ad-slot],.banner-ads,.close-ads,.float-ck,.google-auto-placed,.jw-cue,.midroll-marker,.quangcao,.right-box.top-block,.samBannerUnit,.tpm-unit,[class^=\"adHTML\"],[id^=\"bn_bottom_fixed_\"],div[style=\"position: fixed; inset: 0px; z-index: 2147483647; pointer-events: auto;\"]","123nhadatviet.com":14,"123nhadatviet.net":14,"18tube.uk":".ads-gated","24h.com.vn":"#background_bg_link,#subRightAboveHome,.adv-24h-mid,.box-2coll-24h-t.box-2coll-24h\u003e.mar-auto.container\u003e.row\u003e.col-300,.col:has(a[rel=\"nofollow\"]),.col:has(a[rel=\"sponsored\"]),.fixad300x600,.module3,[id^=\"ADS_\"]","2banh.vn":"#position_full_top_banner_pc","2game.vn":".gc-header__wrapper + div[style]","abysscdn.com":7,"afamily.vn":12,"amlich.org":".banner-container","anime47.best":"#qc_clgt,#swiper-wrapper","animehay15.site":"#catfish,#header-ads + center,#sponsor-balloon,#top-banner,.under_player.flex-hozi-center.flex-column.flex,[src*=\".gif\"],body\u003ediv[style^=\"position: fixed\"],div[style=\"position: fixed; bottom: 0px; z-index: 98; width: 100%; text-align: center; box-sizing: border-box;\"]","animesub.site":"#fbox-background,#menubentrai,.gnartyx-offads,.jw-logo,.mp-adz,.sticky_bottom","animetvn.gay":"#fbox-background,#mobile-ads,.gnarty-offads","animevietsub.sale":"#_preload-ads-1,#invideo_wrapper,.Ads,.mobile-catfish-top,.mobile-catfixx,.pc-catfixx","antt.vn":10,"api.anime3s.com":".t_logo","audiotruyenfull.com":".code-block-24.code-block","autodaily.vn":"#banner3double","autopro.com.vn":".admicro,.pushed","baddaythemovie.co.uk":"#section_553754114,.section-catfish","bantincongnghe.net":"[href*=\"cellphones.com.vn\"]","baodauthau.vn":"div[class*=\"ads\"],div[id^=\"adsWeb\"]","baohaugiang.com.vn":".top-header","baomoi.com":".block:has([data-adaptive]),.is-show.xxxxxx,.masthead-wrapper,[id^=\"ZAP-zone-\"]","baonga.com":".monkey-content-duoicanbiet,.monkey-section-tinnoibat,div.monkey-qc","baoquangninh.vn":".bottom-right-ads","baoxaydung.vn":13,"bing.com":".b_algo:has(.rms_img[src*=\"/th?id=OADD2.\"][src$=\"21.2\"]),.b_algo:has(.rms_img[src*=\"=AdsPlus\"])","blog.abit.vn":".button-dangkyngay,[class*=\"_banner\"]","blogkiienthuc.net":".textwidget","boctem.org":"#popup-giua-man-hinh","bongda12h365.com":".list-dat-cuoc","bongda24h.vn":10,"bongdainfox.tv":32,"bongdanet.online":"#xs-ads,.ads-home-hide,.widget-bets,div.w-menu-datcuoc,div[id^=\"ads_banner_bdn\"]","bongdaso66.net":"#right_float,[class*=\"_banner\"],[id$=\"float_banner\"]","buomtv.page":"._1vguhxv.cosll6e._3yp41v.row-3.lgy\u003e._1lbf8q9,._1vguhxv.cwzsl22.czdj0j5.c1skg1w3.c1q1n9rc.c1f8a55r.c2wbcgy.c1qs0lzc.cq980mc.cosll6e.cjq7bud.c10dklm2.c1xtmnwt.dlnefd1,._9xtpcl.c1mnguco.c9pdtme.c1q1n9rc.c1f8a55r.c2wbcgy.c1qs0lzc.cq980mc.cosll6e.cxngf0m.c199xq07.c1xtmnwt,._9xtpcl.c4je67d.c1qs0lzc.c1hrlkpu.cc2icwl.c1i0iccj.cfd18df,._9xtpcl.cxwrp3i.c1skg1w3.cxngf0m.c199xq07.c10dklm2.c1xtmnwt.cvk29a4.w-\\[300px\\],._9xtpcl.e1e6v8dt,.blbew80,.llnefd1,.lpp0nsn,.luq51lg.a13wihj,.pointer-events-auto.block,.zbgpvb19.zbgpvb16.zbgpvbj.zbgpvbh.zbgpvbg.zbgpvbf.zbgpvbe.zbgpvb1","cafebiz.vn":".bgadmtoptotal","cafef.vn":"#lstblock1\u003e.pushed,#wrapper\u003e[id^=\"adm-slot\"],.bannertop,.box-adm,[class^=\"ads_\"]","cap3.video":3,"cbox.ws":33,"chap.vn":".my_responsive_add,.titleBar + *,[class1=\"my_responsive_add\"]","chatboxn.com":"a[target=\"_blank\"][rel=\"nofollow\"]","checkscam.vn":".qh_qcbp","chodansinh.net":".link-gold,[id^=\"banner\"]","chophim.app":24,"chophim.fun":24,"chophimviet.top":"#scriptDiv:has(.adsbygoogle)","chotlo3s.com":"div[id^=\"float\"],div[id^=\"hide_float\"]","chuoichientv2.live":".ad-catfish,.ad-topbanners,.cct-partner-row,.cct-sponsor-strip","cliphot69.cloud":"#custom_html-42,.float-ck-center-lt","cliphotvn69.com":18,"clipphot.co":16,"coinphoton.com":".header-fix-ads,.lepopup-popup-container,.lepopup-popup-overlay","coiphim.club":".ad-floater,.ads,.banner,.popunder-link,.promotion-popup,.video-ad-layer,li.special.parent","colatv45.live":"#catfish-ad,.blv-follow-btn,.btn-primary.btn,.btn-secondary.btn,.hero-slider,div.ad.chat-message","comong.info":"#layer-popup-link3,#transparentLayer,#virtualLayer","congan.com.vn":"#subiz_wrapper,.ad-embed","congluan.vn":".exp_qc_share","congly.vn":".c-banner","congthucvatly.com":".fixed,.mb-4\u003e[style=\"min-height: 350px;\"]","contuhoc.com":33,"cryptoviet.com":".widget-wrap.widget_text","damconuong.win":".catfish-ad,a[rel=\"nofollow\"]","dantri.com.vn":"#bannerMasthead,#desktop-home-top-page,#mobile-home-middle-1,#mobile-home-middle-2,#mobile-home-top-page,#tpmInpageContainer,.ads-masthead","danviet.vn":"#ads_inpage_bottom,.ads-top,.bg-gray,.sidebar\u003ediv[style]","diadiem.com":".div_box_adv","docnhanh.vn":".ad-position-container,.ads-position,.lg\\:\\!h-\\[260px\\].\\!h-\\[240px\\].lg\\:mb-3.lg\\:mt-1.tss-widget","doctruyen3qhub.fit":11,"doctruyenqq.net":"#flyer,.md-overlay,.md-show.md-effect.popup1","docviewer.yandex.com":".js-doc-html\u003ediv\u003ediv[id]","doisongphapluat.com.vn":29,"download.com.vn":9,"download.vn":".adbox,div[id^=\"adsbg\"]","dubaotiente.net":".ad-pin-right-bottom,.adv","dynadot.rsocdomains.com":"#video_player ~ div[id],.float-ck-center-lt","ebookbkmt.com":".top-right","ephoto360.com":".ad-container,.line-ads","eva.vn":".banrpstn","fhd-01.cctvsignal.xyz":".banner-player,.bet-button-player","file.gocmod.com":"div.ad","film4k.fun":30,"film4k.net":30,"film4k.pl":30,"freeplayervideo.com":7,"freetube.com.mx":"#ads-1xbet-catfish,#popup-1720497466,.container\u003ediv[style^=\"height: 228px\"]","fshare.vn":"#myElementz,.bannerinfooter,.quang-cao-ben-phai","fullcliphot.org":".cashfish,.mini-player,div#recent-content:nth-of-type(1)","fulllivehot.us":16,"gaingon3d.com":"#iklan-atas-wrapper","game24h.vn":"#vi-smartbanner,.LRBanner","gamek.vn":31,"gamer18.net":".fixed-banner-bottom,div[id^=\"divFLR\"]","gamevui.vn":9,"genk.vn":".khw-ads-wrapper.clearfix","ghienphimz.life":".ad-floater,.ads,.banner,.no-ads,.parent.special,.partner-me,.popunder-link,.promotion-popup,.video-ad-layer","giadinhonline.vn":".adv,.exp_qc_share","giavang.org":".sponsor-img,.tradingview-widget-copyright","giovang.uno":".balloon-wrapper,.banner_popup,.banners-bottom,.bc-hidden-link.seo4s-resolve-link,.box-odds-match,.is-active.football.preview-detail-item\u003e.col-info\u003e.tiny-info\u003e.cta\u003e.btn-2.btn,.nav-top-nha-cai","gockhuat.net":"#ad_global_below_navbar","gocmod.com":"#bannerContainer1,#bannerContainer2,#sp-wrapper-hovering-format,.downline-line-list\u003ecenter,.wam-banner,.wrp-min\u003ecenter,center:has(.adsbygoogle),div[style^=\"position: fixed\"]","googleapiscdn.com":"#avs-banner-overlay,#avs-pause-ad","grupoalfoz.com":"#popup-ad-box,.banner-ad","haysexvn.shop":"#vl-header-adx,.castfish-wrappe,.popup","hentaibox.top":"[id$=\"bnr\"]","hh2d.top":1,"hh3dhay.ceo":"#footer_fixed_ads,#overlay,#top_addd","hhdragon.blog":"#catfish,.catfish-img","hhninja1.lol":1,"hhtm.club":4,"hhtq.press":"#catfish,#sponsor-balloon,#top-banner-pc","hhtq.sh":"#footer_fixed_ads,#top_addd,#xs-addd0,.btn-fanpage.btn-default.btn-block.btn,.underplayer_btn","hhtq13.vip":2,"hhtq3d.net":2,"hhtrungquoc9.com":"#topbanner","hhvsub1.com":1,"hoahoc247.com":".btn_small_fix_container","hoatieu.vn":"#adrightspecial,#adsposttop,#adsuggestion,div[class^=\"adbox\"]","hocaz.vn":".banner-estudyme-container","hoidap247.com":".ads-home-feed","hopphim.online":".items-end.flex-col.flex.z-\\[9998\\].right-4.fixed,.max-\\[1023px\\]\\:pb-\\[5rem\\].gap-2.flex-col.flex.z-50.right-4.left-4.bottom-4.fixed","i2pd.website":"#m-bet,.active.bg-overlay,.box-host,.btn-bet-top,.btn-betnow,.ibs-bet,.item-betnow,.modal-backdropz,.mzdal,a[rel=\"nofollow\"],div[class*=\"size-\"]","idpvn.com":"[id^=\"idpvn-\"]","ipatool.codevn.net":".ad-left,.ad-right","javgiga.wordpress.com":".pum-overlay","javhdz.one":17,"javtiful.com":"#latest-censored-videos\u003e.row\u003ediv.pb-3.col:nth-of-type(1)","javtopxx2.com":"#fbox-background,.logo-player,.sticky_bottom","jophim.top":18,"kenh14.vn":".ads-sponsor,.khw-adk14-wrapper","keoso.me":".banner_list,.item-more,.nc_sidebar_home,.widget-sidebar-block","ketqua16.net":".baloon,.col-sm-10.kqcenter,.kqbackground.vien ~ a[target=\"_blank\"],a[rel=\"nofollow\"]","khoahoc.tv":9,"khotruyen.ac":20,"kickass.sx":".dssdffds,.novertpad.clearleft.downloadButtonGroup.buttonsline","kienthuc.net.vn":".ads,.sponsor-zone","kinhtedothi.vn":".top-banner-mobile,[id^=\"adv\"]","laalmirchitakeaway.co.uk":".banner-preload,.catfish-bottom,.catfish-top","laocai24.com":25,"laptrinhcanban.com":".ezoic-ad","lazi.vn":".quang_cao_pc_right_hoc_tap","lichngaytot.com":".advbox","lichvannien365.com":"div[style=\"padding: 0px; margin: 10px 0 0 0 ; width: 100%;text-align: center;min-height: 280px;\"],div[style=\"width: 100%; min-height: 240px; text-align: center;\"],div[style=\"width: 100%; min-height: 90px; text-align: center;\"],div[style=\"width: 100%;text-align: center;min-height: 280px;\"]","linkneverdie.net":21,"linkneverdie.top":21,"live10.chuoichientv.me":".bet-btn-wrap,.fixed.inset-0.z-\\[9999\\].bg-black\\/80.flex.items-center.justify-center.p-4,.fixed.inset-0.z-\\[9999\\].flex.items-center.justify-center.p-4.popup-backdrop,.quality-right-group\u003ea[rel=\"noopener sponsored\"]","lmssplus.org":"p[style=\"color: rgb(174, 174, 174); margin-top: 10px; margin-bottom: 20px;\"]","loigiaihay.com":"#countdown,.section-gqc1,div[style=\"margin: 10px 0 5px 0; min-height: 250px;\"]","luatduonggia.vn":".ads-tags,.img_side_bar,.poka-image","lxmanga.top":28,"mamphim.space":".modal-backdrop,.sspp-area,.sspp-modal","mangamori.dev":".pb-6.px-4.max-w-md.w-full.mx-auto","mannhan97.xyz":".bet-btn-8423,.btn_betnow_632132,.highlight,.images-bnr,.images_fixed,.popup,.sticky,a.btn_fb:nth-of-type(2)","metruyen.fit":"#layer-popup-link3,#virtualLayer","metruyenchuvn.org":5,"metruyencv.com":".text-muted,[href$=\"/goout/lazada\"],section.nh-section:nth-of-type(5)","metruyencv.net":"[href$=\"/goout/lazada\"],section.nh-section:nth-of-type(5)","minhngoc.net.vn":"[id^=\"adv\"]","misseschloe.co.za":"#vl-header-adx,.catfish-bottom,.catfish-popup,.catfish-top","mmo4me.com":"div[class*=\"ads\"]","monkeyd.net.vn":"#affLayer,.justify-content-center.d-flex.mx-3.mx-lg-4.mt-3\u003e[href]","monkeydtruyen.com":"#affLayer,#affLayer2","motchillt.cx":15,"motchilltvphim.com":"#popup_banner_beta,.sda-catfish","motchillxe.cc":".overlay-1","motphimc.mx":15,"motphimchilll.xyz":"#catfish_ad_top","nettruyen14s.com":".ad_info,.ads_insert_shop","nettruyenar.com":13,"new.tructiepnba.me":".truct-catfish,.truct-widget,a[rel=\"nofollow\"]","ngaytho.me":".body_wrapper1","nghean24h.vn":32,"nghenhinvietnam.vn":10,"nguoiduatin.vn":".ndt-ads","nguongmo.com":25,"nhaccuatui.com":"#banner-qc_outstream,.adv_home_300_250,.nqc-zone","nhacdj.vn":"#top-adv","nhipcaudautu.vn":34,"olm.vn":".olm-ads","onflix.lat":".fixed.inset-0.z-\\[100\\].flex.items-center.justify-center.bg-black\\/60.p-4.animate-in.fade-in.duration-300,.lg\\:bottom-0.bottom-\\[94px\\].duration-300.transition-all.pointer-events-none.justify-center.flex.z-40.inset-x-0.fixed,.space-y-0.py-2.lg\\:pl-14.md\\:px-12.px-1.w-full \u003e .px-4.mx-auto.container.my-4.w-full.items-center.justify-center.flex,.space-y-0.py-2.lg\\:pl-14.md\\:px-12.px-1.w-full\u003e.lg\\:px-8.sm\\:px-6.px-3.my-4.w-full","outlook.live.com":".LBktY\u003e.GssDD,div[data-viewport-type=\"element\"] .Ogt7j","pagerrentablespotlight.com":"#ad_info_top","petrotimes.vn":8,"phapluatplus.baophapluat.vn":"div[style=\"text-align:center;margin-top:0px;margin-bottom:0px;\"]","phe69.men":"#ad-banner,#phe-overlay-root","phim.xxxmeo.com":"#divExoLayerWrapper,.ldg-y-x-header","phim1080.in":".ff-banner","phim18hd.site":".cash-fish,.cash-fish-pc,.preload-pc,.top-mobile-banner,.under-player-pc-banner","phim24k.top":18,"phimbet.top":"#banner,#overlay","phimchautinhtri.net":".ban-top-left-host,.ban-top-right-host,[href=\"https://snapback.vn/\"],[href^=\"https://s.shopee.vn/\"]","phimchill.life":"#mb-catfish,#pc-catfish,.ad-container,.popUpBannerBox","phimdacap.tv":"#ads-popup,#catfish","phimhdc.com":22,"phimhdcss.com":22,"phimmoic.biz":15,"phimmoichillz.top":"#pm_quangcao,#preload","phimmoihd.online":".\\32 xl\\:left-2.sm\\:left-1.left-0.-translate-y-1\\/2.z-40.top-1\\/2.fixed,.\\32 xl\\:right-2.sm\\:right-1.right-0.-translate-y-1\\/2.z-40.top-1\\/2.fixed,.p-4.bg-black\\/70.overflow-y-auto.justify-center.items-center.flex.z-\\[70\\].inset-0.fixed,.pt-3.pb-1.px-2.z-\\[60\\].bottom-0.inset-x-0.fixed","phimsexhay3x.com":26,"phimsexhayvne.com":18,"phimsexsuong3x.net":17,"phimsextrung.cc":".xx-ads","phimtho.cc":"#popup_banner_beta","phimtuoitho.tv":".pc-catfixx","phunumoi.net.vn":34,"phuongtrinhhoahoc.com":".fixed,.shadow-card + .mt-2","play.zpic.org":".btm_bar,div.ad-container","player-cdn.com":7,"plcdn.xyz":23,"qdnd.vn":".box-banner","qmanga.art":20,"qmh.garden":3,"qmhv3.live":".global-sticky-ads,.header\u003eapp-banner,.p-4.justify-center.items-center.flex.backdrop-blur-sm.bg-black\\/80.z-\\[9999\\].inset-0.fixed","quantrimang.com":"#adrighttop,#adsposttop,.adbox","quatvn.garden":".adace-slideup-slot-wrap,.adace-slot,.g1-advertisement,.popup-banner,.popup-overlay,.preroll-content,body\u003ediv[style^=\"position: fixed;\"]","rakhoizar.cc":"#wap_bottombanner,.bookmaker-selector-container,.btn-8xbet,.btn-odds,.footer-banner,.sk_balloon","reatimes.vn":"div[class^=\"adv-\"]","rophim1.vip":27,"rophim10.cam":".adserver,.mt-3.topics-line.topics-grid.topics-list","rophimz.bz":27,"rophimz.top":18,"rphang.beer":"#aboveFirstPost,.bbMediaWrapper-inner\u003e.samCodeUnit,.js-replyNewMessageContainer.block-body\u003ediv.samCodeUnit\u003e.samItem,.p-footer,.samVideoOverlay,div.samCodeUnit[data-position=\"footer_fixed\"],div.samItem:has(video.topmobileads)","sachmoi.net":".boxzilla-bottom-right-container,[href^=\"https://gotrackecom.info\"]","saostar.vn":"#mobi-top,.ads,.pc-bill","sayhentai.cx":18,"sexhihi18.pro":".catfish-bottom,.catfish-top,.xx-ads","sexmupxinh.net":".catfish-top,.catfix,.xx-ads","sexphimhayw.pro":26,"sextop.asia":"#video_player ~ div[id],div[style^=\"position:fixed;inset:0px;z-index:100000;\"]","sexviet69.cc":18,"soha.vn":31,"soicau247s.org":".linkBanner","sport5.vn":12,"ss.90phut27.com":"#m-bet,.btn-bet-top,.for-desktop,.ft-box,.item-betnow,.modal-backdropz,.to-left,.to-right","st.90phut27.com":"#m-bet,.modal-backdropz,div[class*=\"size-\"]","streamobs.net":"#AgeModal","subnhanh.plus":"#footer_fixed_ads,#popup_banner_beta,.sda-catfish,.video-ad-layer","taichinhdoanhnghiep.net.vn":".adv,.banner","tapchikientruc.com.vn":"#topbn","tctruyen.org":".adpia_banner,.img-banner-poster.main","tech.zingnews.vn":"#Zingnews_SiteHeader","techrum.vn":".block:has(.block-container\u003e.block-body\u003ea[href]),.block:has(.block-container\u003e.block-body\u003eins)","tenovi.net":"#ad_balloon,.adpia_banner","thanhnien.vn":".asd-headt,.detail__foru,.mb-40.section__qadd,.super-masthead,.top-banner,[class*=\"box-home\"],[data-marked-zoneid=\"tn_detail_danhchoban\"],[data-marked-zoneid=\"tn_detail_quantam\"],[id^=\"dablewidget_\"],zone","thapcam24h.net":".AdsPrBtn_adsButton__8xvdb,.btn-ads-radColor,.btn-player-ads","thapcam73.life":6,"thapcam73.live":6,"the.tube":".ads-container","thefaplive.com":"#backgroundPopupp,#ds_top,#popupContact,#popup_fi,#wap_bottombanner,.hidden-md.right.col-3,body\u003e.container\u003ediv","thethao1.mannhan24.pro":"#hots-btn,.bn-popup-bottom-sdwdwxw,[href=\"/top-nha-cai.html\"],li.for-desktop-2\u003e[href],li.for-mobile-2\u003e[href]","thethao247.vn":"div[class$=\"_ads\"]","thethaovanhoa.vn":".zone-top,[id^=\"pos-\"]","thiepmung.com":".ad-container","thitruongtaichinhtiente.vn":".c-banner,.c-banner-item","thoidai.com.vn":8,"thuocbietduoc.com.vn":"#neo-right-ads","thuongtruong.com.vn":"#BannerAdv","thuthuatjb.com":".stream-item","thuthuattienich.com":"#footer-widget-area","thuysanvietnam.com.vn":"#gallery-2,.hd-cate-wrap,.home-qc-wrap,.home-sec-right .widget_media_image,.noname-left","tienphong.vn":".banner,.banner-top,.fyi,div[id^=\"adsMobile\"],div[id^=\"adsWeb\"]","tiim.com.vn":".ads-common-box","tinhte.vn":".hidden-md\u003e.main.jsx-2126301199,.jsx-3569995709,.micro,.middle-comment-promotion,.pro-container,div[style=\"width:300px;height:250px\"],div[style=\"width:300px;height:600px\"],div[style=\"width:320px;height:100px\"]","tinmoi.vn":"#pc-top,.ads-position","tinnhanhchungkhoan.vn":".fyi","tinxe.vn":".box-bound-midd-middetail.box-bound-midd","toquoc.vn":13,"trangsexdam.net":"#f186fb23a33995d91ce3c2212189178c8,.hd-tube-desktop,.hd-tube-mobile,.w1e48c4420b7073bc11916c6c1de226bb","truyenaudiocv.org":".col-xs-12\u003e.ads-large,.js-editors-choice-slider.editors-choice-slider\u003e.adsbygoogle","truyenfull.live":"#header-ads-full,#shoppe_ads_fly,.ads-responsive,[id^=\"ads-\"]","truyenmmhayr.com":".fixed","truyennung.net":"#hide_float_right","truyenqqko.com":"#_pop-qqgo-11,#ad_info_top,#catfish-banner-reading-container,#catfishAd,#floating-banner-left,#floating-banner-right,.chapter_content\u003e.text-center,.text_ads,.w-overlay-catfish,div#ad_info,span[style=\"display: flex;flex-direction: column;align-items: center; color: white; padding-bottom: 10px\"]","truyensextv.com":28,"truyensieuhay.com":"#topbanner,.footer-info","tuoitre.vn":"#LeaderBoardTop,#admbackground,#adsMainFooter,.banner-top,.box-qad,.content-amuasam,.section__r-vietlot","tv.manhvl.com":"#adstop2,.col-lg-4.hidden-xs.d-flex.flex-column.address-wrap,.float-right,a[rel=\"nofollow\"]","tvso1.com":"[class*=\"_banner\"]","universalwindscreens.co.uk":".banner-fixed","v4u.vn":".Flagrow-Ads-under-header","vailonxx.me":"#ab_ctl,.vailo-sticky,.vailo-under-navbar,.vailo-under-navbar-mobile","vebo8.buzz":"#m-bet,.box-host,.btn-bet-top,.btn-betnow,.ibs-bet,.item-betnow,.modal-backdropz,div[class*=\"size-\"]","vebo8.fun":"#m-bet,.box-host,.btn-bet-top,.btn-betnow,.for-desktop,.for-mobile,.ft-box,.item-betnow,.modal-backdropz,.to-left,.to-right,div.vebo-sp.container","vesotantai.com":".item-qc","vi.xnxx.studio":"#f186fb23a33995d91ce3c2212189178c8","videophapluat.baophapluat.vn":"[class^=\"sticky-top\"],[href*=\"vietcombank.com.vn\"]","vieclam.tv":"#bnc0,#bnc1","viet69.be":19,"viet69hayz.cfd":"#castfish,.popup","viet69vn.at":19,"vietcetera.com":".styles_topBanner__NL_gW","vietfones.vn":".vfs_banner","vietgiaitri.com":"#BigBanner,.ads_position","vietjack.com":".ads_txt,.box-most-viewed.box-course.box-slide,.theiaStickySidebar,[href=\"https://tailieugiaovien.com.vn/\"],div.ads_ads,h3.sub-title,ul.list:nth-of-type(2)","vietmoz.net":".elementor-widget-image","vietnamfinance.vn":".ads-right,.ads_sticky,.header-ads","vietnammedia.vnanet.vn":"[href*=\"bit.ly\"]","vietnamnet.vn":".vmcadszone","vietq.vn":"section.mar20:nth-of-type(2),section.mar20:nth-of-type(4)","vlxx.rip":"#f186fb23a33995d91ce3c2212189178c8,.hd-tube-desktop,.hd-tube-mobile","vlxxhot.net":"#ab_ctl,.adx1","vn-motchill.com":"#vl-header-adx,.banner-preload,.catfish-bottom,.float-contact","vn-z.vn":".ads,.adsbygoogle,[id^=\"adv\"]","vndoc.com":".adbox,div[class^=\"adbox\"]","vnesports.net":".banner_site,.banner_top,.sidebar_box_gray","vnexpress.net":"#admbackground,#banner_top,#rich-media-banner-ads,#supper_masthead,.box-kd-300,.section_ads_300x250,div[id^=\"ads_\"]","voz.vn":"#floating-ad-img-container,.adsbypubpower,.p-body-sidebar\u003e.block\u003e.block-container:has(.adsbypubpower),.p-body-sidebar\u003e.block\u003e.block-container:has([data-widget_id]),.voz-adSlot,[data-dest=\"placeholder\"],div.message--post,div[style]:has(.adsbypubpower)","vozer.net":".Notices.PanelScroller","vtcnews.vn":29,"vuonhoalan.net":".content_middle_rightbar","webhoctienganh.com":".button-action-float-banner","wikidichvn.com":5,"www.2banh.vn":".grp-grp.header_wp,.lb_overlay","www.7mvn9.com":"#bottomFixedDiv,#js_pup_navigation,tr[id^=\"word_\"]","www.8phim.vip":".BanerTop100,.adv-300-right,.banner-container,.banner-preload,.banner-preload-container,.catfish-bottom,.catfish-top,a[rel=\"nofollow\"],div[class^=\"catfish-\"]","www.asianbookie.org":"a[href^=\"/cgi-bin/to.cgi\"]","www.asu.baby":".nhacai,.nhacai2","www.clbgamesvn.com":".bannerBox,.footerBanner,center\u003e[href*=\"tlink.vn\"]","www.gvnvh18z.com":18,"www.hayvn.net":"#bar_float_r,.adspopupgiua,.adspopupleft,.adspopupright,.float-ckgiua,.quangcaomb","www.iosviet.com":"[href^=\"https://shope.ee\"]","www.paylia.io":"a.news__item--action:nth-of-type(2)","www.saostar.vn":"#mobi-sapo,#page-skin-top-holder,#pc-bill-top,#pc-bill-top-1","www.sieutamphim.top":"#scriptDiv","www.toptruyenzone13.com":11,"www.webtretho.vn":".wtt-ads","x.phimsexvn1.co.uk":"#ads-wrapper,#cashfit-spacer,.ads-header","xamvn.yachts":".float-ck-center-lt,.float-contact,.float-contact2,.js-notices","xehay.vn":"#banner1ab,#banner3double","xem1080.com":".banner-masthead","xem20.net":".fixed,.float-ck-center-lt","xfast.sbs":"#overlay","xiuren.org":"#bannerIn,#exoIMFrame,#nativeAds_1505931906161,div[id^=\"exo_slider_\"]","xnhau.pub":".fp-ui\u003ediv[style],.sponsor,.spot","xnxx.com":"#content-ad-top-zone","xoilac.livecdnem.com":23,"yanhh3d.chat":4,"ybox.vn":"#ybox-H1\u003ediv[style]","ycongnghe.com":".td-container-wrap.td-logo-wrap-full.td-banner-wrap-full,.td-crumb-container","yeah1.com":".Float_ads,[id^=\"zone-ads\"]","z1.chinav.sex":"#cashfit-banner-host,.adbox,.banner-container","znews.vn":"#Zingnews_SiteHeader,.banner-slider-wrapper,.znews-banner","zpic.org":".ad-banner"};

    // ---------------------------------------------------------------------
    // Domain-suffix rule lookup
    // ---------------------------------------------------------------------
    function getRules(store, host) {
        let domainSplit = host.split(".");
        let output = [];

        // Check host, then each shorter suffix (sub.example.com, example.com, ...).
        for (let i = 0; i < domainSplit.length - 1; i++) {
            let domain = domainSplit.slice(i, domainSplit.length).join(".").toLowerCase();

            let rule = store.rules[domain];
            if (rule != null) {
                if (typeof rule === 'number') {
                    output.push({ "s": store.dedup[rule] });
                } else {
                    output.push({ "s": rule });
                }
            }

            let injection = store.inj[domain];
            if (injection != null) {
                if (typeof injection === 'number') {
                    output.push({ "i": store.dedup[injection] });
                } else {
                    output.push({ "i": injection });
                }
            }
        }

        return output;
    }

    function resolveVal(v, store) {
        return (typeof v === 'number') ? store.dedup[v] : v;
    }

    // ---------------------------------------------------------------------
    // Style injection
    // ---------------------------------------------------------------------
    let active = { sig: "", page: "" };
    let observer = null;
    let pendingScan = false;
    let styleEls = [];

    function appendStyle(cssText) {
        let style = document.createElement('style');
        style.type = "text/css";
        style.textContent = cssText;
        // documentElement already exists at document-start (it is created
        // before the body), so we never have to wait for <head>.
        (document.documentElement || document.head).appendChild(style);
        styleEls.push(style);
    }

    // Two injections per page:
    //   1. the "common" <style>: general "*##..." rules that apply everywhere
    //   2. the site's own <style>: rules specific to the visited domain
    function applyStore(store) {
        let host = (location.hostname || "").toLowerCase();
        let found = getRules(store, host);

        let general = resolveVal(store.rules[""], store);
        let generalInj = resolveVal(store.inj[""], store);

        let generic = found.filter(r => r["s"] != null)
            .map(r => r["s"]).join(",");
        let css = found.filter(r => r["i"] != null).map(r => r["i"]).join("");

        log("Applying rules for", host,
            "common:" + (general ? general.length : 0) + " own:" + generic.length + " selector chars");

        let sig = (general || "") + "|" + (generalInj || "") + "|" + generic + "|" + css;
        if (sig !== active.sig) {
            styleEls.forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
            styleEls = [];

            let common = "";
            if (general) common += general + HIDE_RULE;
            if (generalInj) common += generalInj;
            if (common) appendStyle(common);

            let own = "";
            if (generic) own += generic + HIDE_RULE;
            if (css) own += css;
            if (own) appendStyle(own);

            active.sig = sig;
        }

        active.page = generic;
        ensureObserver();
        scanPage("apply");
    }

    // ---------------------------------------------------------------------
    // Hiding elements that resist the stylesheet (inline styles)
    // ---------------------------------------------------------------------
    function applyHide(el) {
        let st = el.style;
        // Inline styles beat <style> rules, so override them directly.
        st.setProperty("display", "none", "important");
        st.setProperty("visibility", "hidden", "important");
    }

    function scanPage(source) {
        let page = active.page;
        if (!page) return;

        let elems = [];
        try {
            elems = document.querySelectorAll(page);
        } catch (e) {
            // One broken selector must not nuke hiding for everything else.
            let parts = page.split(",");
            for (let i = 0; i < parts.length; i++) {
                try {
                    elems.push.apply(elems, document.querySelectorAll(parts[i]));
                } catch (e2) { /* skip bad selector */ }
            }
        }
        elems.forEach(applyHide);
        log("scan(", source, ") hid", elems.length, "elements");
    }

    function scheduleScan() {
        if (pendingScan) return;
        pendingScan = true;
        setTimeout(function () {
            pendingScan = false;
            scanPage("observer");
        }, 200);
    }

    function ensureObserver() {
        if (observer || typeof MutationObserver === "undefined") return;
        observer = new MutationObserver(function () {
            // The stylesheet already hides static matches; this catches
            // elements inserted later (cookie banners, lazy ads, ...).
            if (active.page) scheduleScan();
        });
        try {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        } catch (e) { /* documentElement missing (should not happen) */ }
    }

    // ---------------------------------------------------------------------
    // Boot
    // ---------------------------------------------------------------------

    // Older lazy-load builds cached the rules under a per-day key in
    // localStorage ("cosmetic-rules-v*"). This build no longer writes any
    // cache, so purge those stale keys once (no new cache is ever created).
    try {
        let cache = localStorage;
        for (let i = cache.length - 1; i >= 0; i--) {
            let key = cache.key(i);
            if (key && key.indexOf("cosmetic-rules-v") === 0) cache.removeItem(key);
        }
    } catch (e) { /* storage unavailable (private mode, file: URI, ...) */ }

    let baseline = { dedup: deduplicatedStrings, inj: injectionRules, rules: rules };

    // Runs once, synchronously, at document-start (documentElement exists
    // before <head>), so every page gets its styles immediately, with no
    // network dependency.
    applyStore(baseline);
}