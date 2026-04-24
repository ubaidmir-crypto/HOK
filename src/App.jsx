import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Theme ───────────────────────────────────────────────────────────────────
const theme = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root{
    --ivory:#F6F1E8;
    --ivory-2:#EEE6D6;
    --emerald:#0F3D2E;
    --emerald-soft:#1C5A45;
    --saffron:#C9892C;
    --saffron-soft:#E2B66A;
    --ink:#1A1814;
    --muted:#6B6558;
    --line:#D9CFBC;
    --white:#FDFBF6;
    --rose:#B25151;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body,html,#root{background:var(--ivory);color:var(--ink);font-family:'Manrope',sans-serif;font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
  .serif{font-family:'Fraunces',serif;font-weight:400;letter-spacing:-0.01em}
  .italic{font-style:italic}
  button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
  input,textarea,select{font-family:inherit;font-size:14px}
  a{color:inherit;text-decoration:none}
  .hok-root{min-height:100vh}
  .container{max-width:1240px;margin:0 auto;padding:0 28px}
  @media(max-width:640px){.container{padding:0 18px}}

  /* ── Navbar ── */
  .nav{position:sticky;top:0;z-index:50;background:rgba(246,241,232,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
  .nav-inner{display:flex;align-items:center;justify-content:space-between;padding:18px 0}
  .brand{display:flex;align-items:baseline;gap:10px}
  .brand-mark{font-family:'Fraunces',serif;font-size:26px;font-weight:500;letter-spacing:-.02em;color:var(--emerald)}
  .brand-sub{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
  .nav-links{display:flex;gap:32px}
  .nav-links button{font-size:13px;letter-spacing:.04em;color:var(--ink);padding:6px 0;border-bottom:1px solid transparent;transition:.2s}
  .nav-links button:hover,.nav-links button.active{border-bottom-color:var(--saffron);color:var(--emerald)}
  .nav-actions{display:flex;align-items:center;gap:16px}
  .cart-btn{position:relative;background:var(--emerald);color:var(--ivory);padding:10px 18px;border-radius:999px;font-size:13px;letter-spacing:.04em;display:inline-flex;align-items:center;gap:8px}
  .cart-badge{background:var(--saffron);color:#1A1814;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px}
  .admin-link{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  .admin-link:hover{color:var(--emerald)}
  @media(max-width:820px){.nav-links{display:none}}

  /* ── Hero ── */
  .hero{position:relative;overflow:hidden;padding:80px 0 120px;background:
    radial-gradient(ellipse 80% 60% at 80% 20%, rgba(201,137,44,.12), transparent 60%),
    radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,61,46,.08), transparent 60%),
    var(--ivory)}
  .hero::before{content:"";position:absolute;inset:0;background-image:
    repeating-linear-gradient(0deg, rgba(15,61,46,.02) 0 1px, transparent 1px 3px);pointer-events:none}
  .hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:60px;align-items:center;position:relative}
  @media(max-width:900px){.hero-grid{grid-template-columns:1fr;gap:40px}}
  .eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--emerald);margin-bottom:24px}
  .eyebrow::before{content:"";width:32px;height:1px;background:var(--emerald)}
  .hero h1{font-family:'Fraunces',serif;font-size:clamp(40px,6vw,76px);line-height:.98;font-weight:400;letter-spacing:-.025em;color:var(--ink)}
  .hero h1 em{font-style:italic;color:var(--saffron);font-weight:400}
  .hero-sub{font-size:17px;color:var(--muted);margin-top:24px;max-width:480px;line-height:1.6}
  .hero-ctas{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap}
  .btn-primary{background:var(--emerald);color:var(--ivory);padding:14px 26px;border-radius:999px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;transition:.2s}
  .btn-primary:hover{background:var(--ink);transform:translateY(-1px)}
  .btn-ghost{border:1px solid var(--line);color:var(--emerald);padding:14px 26px;border-radius:999px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;transition:.2s}
  .btn-ghost:hover{background:var(--emerald);color:var(--ivory);border-color:var(--emerald)}
  .hero-stats{display:flex;gap:40px;margin-top:60px;padding-top:32px;border-top:1px solid var(--line)}
  .stat-num{font-family:'Fraunces',serif;font-size:32px;color:var(--emerald)}
  .stat-lbl{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-top:4px}
  .hero-visual{position:relative;aspect-ratio:4/5;border-radius:4px;overflow:hidden;background:linear-gradient(135deg, #E8DBBF 0%, #C9892C 100%);box-shadow:0 40px 80px -30px rgba(15,61,46,.3)}
  .hero-visual::before{content:"";position:absolute;inset:20px;border:1px solid rgba(246,241,232,.3)}
  .hero-visual-label{position:absolute;bottom:28px;left:28px;right:28px;color:var(--ivory);font-family:'Fraunces',serif;font-style:italic;font-size:20px;line-height:1.3}
  .hero-visual-mark{position:absolute;top:28px;right:28px;font-size:10px;letter-spacing:.3em;color:var(--ivory);text-transform:uppercase}
  .decorative-dots{position:absolute;top:15%;right:-40px;width:120px;height:120px;background-image:radial-gradient(var(--emerald) 1px, transparent 1.5px);background-size:12px 12px;opacity:.15;pointer-events:none}

  /* ── Section ── */
  .section{padding:100px 0}
  .section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:56px;gap:32px;flex-wrap:wrap}
  .section-title{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,52px);font-weight:400;letter-spacing:-.02em;line-height:1}
  .section-title em{font-style:italic;color:var(--saffron)}
  .section-kicker{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--emerald);margin-bottom:14px}
  .section-desc{max-width:440px;color:var(--muted);font-size:15px}

  /* ── Treatments ── */
  .cat-tabs{display:flex;gap:8px;margin-bottom:32px;flex-wrap:wrap}
  .cat-tab{padding:10px 20px;border:1px solid var(--line);border-radius:999px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);transition:.2s}
  .cat-tab:hover{border-color:var(--emerald);color:var(--emerald)}
  .cat-tab.active{background:var(--emerald);color:var(--ivory);border-color:var(--emerald)}
  .treat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:2px;background:var(--line);border:1px solid var(--line)}
  .treat-card{background:var(--white);padding:32px;display:flex;flex-direction:column;min-height:260px;transition:.3s;position:relative}
  .treat-card:hover{background:var(--ivory-2)}
  .treat-icon{font-size:28px;margin-bottom:18px;opacity:.8}
  .treat-name{font-family:'Fraunces',serif;font-size:24px;line-height:1.15;margin-bottom:10px}
  .treat-short{color:var(--muted);font-size:14px;flex:1;line-height:1.55}
  .treat-foot{display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding-top:20px;border-top:1px solid var(--line)}
  .treat-price{font-family:'Fraunces',serif;font-size:20px;color:var(--emerald)}
  .treat-dur{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
  .treat-book{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--saffron);border-bottom:1px solid var(--saffron);padding-bottom:2px}

  /* ── Products ── */
  .prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:32px}
  .prod-card{background:var(--white);border:1px solid var(--line);display:flex;flex-direction:column;transition:.3s}
  .prod-card:hover{transform:translateY(-4px);box-shadow:0 30px 60px -30px rgba(15,61,46,.25)}
  .prod-img{aspect-ratio:4/5;background:linear-gradient(160deg,var(--ivory-2),#D4C5A8);position:relative;overflow:hidden}
  .prod-img::after{content:"";position:absolute;inset:24px;border:1px solid rgba(15,61,46,.12)}
  .prod-img-label{position:absolute;bottom:24px;left:24px;right:24px;font-family:'Fraunces',serif;font-style:italic;font-size:18px;color:var(--emerald);line-height:1.2}
  .prod-body{padding:22px;display:flex;flex-direction:column;gap:10px;flex:1}
  .prod-cat{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
  .prod-name{font-family:'Fraunces',serif;font-size:19px;line-height:1.2}
  .prod-desc{font-size:13px;color:var(--muted);flex:1;line-height:1.5}
  .prod-foot{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
  .prod-price{font-family:'Fraunces',serif;font-size:22px;color:var(--emerald)}
  .prod-add{background:var(--ink);color:var(--ivory);padding:8px 14px;border-radius:999px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;transition:.2s}
  .prod-add:hover{background:var(--emerald)}
  .prod-add.in{background:var(--saffron);color:var(--ink)}

  /* ── About ── */
  .about{background:var(--emerald);color:var(--ivory);padding:100px 0;position:relative;overflow:hidden}
  .about::before{content:"";position:absolute;top:-40px;right:-40px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(201,137,44,.18),transparent 70%)}
  .about-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:80px;align-items:center;position:relative}
  @media(max-width:900px){.about-grid{grid-template-columns:1fr;gap:40px}}
  .about-portrait{aspect-ratio:4/5;background:linear-gradient(180deg,var(--saffron) 0%, var(--saffron-soft) 50%, var(--emerald-soft) 100%);position:relative;border-radius:2px}
  .about-portrait::after{content:"DR. W";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:130px;font-weight:300;color:var(--ivory);opacity:.25;letter-spacing:.05em}
  .about h2{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,48px);font-weight:400;letter-spacing:-.02em;line-height:1.05;margin-bottom:24px}
  .about h2 em{font-style:italic;color:var(--saffron-soft)}
  .about p{color:rgba(246,241,232,.82);margin-bottom:18px;line-height:1.7;font-size:15px}
  .about-creds{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px;padding-top:32px;border-top:1px solid rgba(246,241,232,.2)}
  .cred-item{font-size:12px;color:var(--ivory)}
  .cred-item strong{display:block;font-family:'Fraunces',serif;font-size:22px;font-weight:400;color:var(--saffron-soft);margin-bottom:4px}

  /* ── Booking & Ask & Contact forms ── */
  .panel{background:var(--white);border:1px solid var(--line);padding:44px}
  @media(max-width:640px){.panel{padding:28px}}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  @media(max-width:640px){.form-row{grid-template-columns:1fr}}
  .field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
  .field label{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
  .field input,.field select,.field textarea{padding:12px 14px;border:1px solid var(--line);background:var(--ivory);border-radius:2px;transition:.15s;color:var(--ink)}
  .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--emerald);background:var(--white)}
  .field textarea{min-height:110px;resize:vertical;font-family:inherit}
  .slot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;margin-top:8px}
  .slot{padding:10px 8px;border:1px solid var(--line);border-radius:2px;font-size:12px;text-align:center;transition:.15s;background:var(--white)}
  .slot:hover:not(:disabled){border-color:var(--emerald);color:var(--emerald)}
  .slot.sel{background:var(--emerald);color:var(--ivory);border-color:var(--emerald)}
  .slot:disabled{opacity:.3;cursor:not-allowed;text-decoration:line-through}
  .booking-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:40px}
  @media(max-width:900px){.booking-grid{grid-template-columns:1fr}}
  .booking-aside{background:var(--emerald);color:var(--ivory);padding:40px;display:flex;flex-direction:column;gap:22px}
  .booking-aside h3{font-family:'Fraunces',serif;font-size:26px;font-weight:400;letter-spacing:-.01em}
  .booking-aside .tidbit{display:flex;gap:14px;font-size:13px;color:rgba(246,241,232,.8);line-height:1.55}
  .booking-aside .tidbit strong{color:var(--saffron-soft);font-family:'Fraunces',serif;font-size:14px}

  .submit-btn{background:var(--ink);color:var(--ivory);padding:16px 32px;border-radius:2px;font-size:13px;letter-spacing:.15em;text-transform:uppercase;transition:.2s;width:100%;margin-top:10px}
  .submit-btn:hover:not(:disabled){background:var(--emerald)}
  .submit-btn:disabled{opacity:.5;cursor:wait}

  /* ── FAQ ── */
  .faq-list{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--line)}
  .faq-item{border-bottom:1px solid var(--line)}
  .faq-q{width:100%;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding:22px 0;text-align:left;font-family:'Fraunces',serif;font-size:19px;line-height:1.3;color:var(--ink);transition:.15s}
  .faq-q:hover{color:var(--emerald)}
  .faq-q-icon{font-family:'Fraunces',serif;font-size:22px;color:var(--saffron);margin-top:-2px;flex-shrink:0;transition:.2s}
  .faq-q.open .faq-q-icon{transform:rotate(45deg)}
  .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s ease;color:var(--muted);line-height:1.7;font-size:14px}
  .faq-a.open{max-height:400px;padding:0 0 22px}

  /* ── Contact ── */
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px}
  @media(max-width:820px){.contact-grid{grid-template-columns:1fr}}
  .contact-info{padding:48px;background:var(--ivory-2);border-left:3px solid var(--saffron)}
  .contact-info h3{font-family:'Fraunces',serif;font-size:28px;font-weight:400;margin-bottom:18px;letter-spacing:-.01em}
  .info-item{padding:18px 0;border-bottom:1px solid var(--line)}
  .info-item:last-child{border:0}
  .info-label{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
  .info-val{font-size:15px;line-height:1.5}
  .info-val a{color:var(--emerald);border-bottom:1px solid var(--saffron)}

  /* ── Cart drawer ── */
  .drawer-bg{position:fixed;inset:0;background:rgba(26,24,20,.5);z-index:100;opacity:0;pointer-events:none;transition:.25s}
  .drawer-bg.open{opacity:1;pointer-events:auto}
  .drawer{position:fixed;top:0;right:0;bottom:0;width:min(440px,100%);background:var(--white);z-index:101;transform:translateX(100%);transition:.3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column}
  .drawer.open{transform:translateX(0)}
  .drawer-head{padding:24px 28px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}
  .drawer-head h3{font-family:'Fraunces',serif;font-size:24px;font-weight:400}
  .drawer-close{font-size:22px;color:var(--muted);padding:4px 10px}
  .drawer-body{flex:1;overflow-y:auto;padding:20px 28px}
  .drawer-foot{padding:24px 28px;border-top:1px solid var(--line);background:var(--ivory)}
  .cart-item{display:grid;grid-template-columns:1fr auto;gap:12px;padding:16px 0;border-bottom:1px dashed var(--line)}
  .cart-item-name{font-family:'Fraunces',serif;font-size:15px;line-height:1.2}
  .cart-item-meta{font-size:12px;color:var(--muted);margin-top:4px}
  .qty-ctrl{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:2px;margin-top:6px}
  .qty-ctrl button{padding:4px 10px;font-size:14px;color:var(--muted)}
  .qty-ctrl span{padding:0 10px;font-size:13px;min-width:18px;text-align:center}
  .remove-btn{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--rose);margin-top:6px;display:block}
  .empty-cart{text-align:center;padding:48px 20px;color:var(--muted);font-family:'Fraunces',serif;font-style:italic;font-size:18px}
  .total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
  .total-row .lbl{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  .total-row .val{font-family:'Fraunces',serif;font-size:28px;color:var(--emerald)}

  /* ── Toast ── */
  .toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--ink);color:var(--ivory);padding:14px 24px;border-radius:2px;font-size:13px;letter-spacing:.05em;z-index:200;transition:.3s;opacity:0;max-width:90%}
  .toast.show{transform:translateX(-50%) translateY(0);opacity:1}
  .toast.ok{background:var(--emerald)}
  .toast.err{background:var(--rose)}

  /* ── Footer ── */
  .footer{background:var(--ink);color:var(--ivory);padding:60px 0 28px;margin-top:0}
  .footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:48px;margin-bottom:40px}
  @media(max-width:700px){.footer-grid{grid-template-columns:1fr;gap:32px}}
  .footer h4{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--saffron-soft);margin-bottom:16px}
  .footer p, .footer li{color:rgba(246,241,232,.7);font-size:14px;line-height:1.8;list-style:none}
  .footer-bottom{border-top:1px solid rgba(246,241,232,.1);padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:12px;color:rgba(246,241,232,.5)}

  /* ── Admin ── */
  .admin-shell{min-height:100vh;background:var(--ivory);padding:40px 0}
  .admin-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:32px;flex-wrap:wrap}
  .admin-tab{padding:14px 22px;font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;transition:.15s}
  .admin-tab:hover{color:var(--emerald)}
  .admin-tab.active{color:var(--emerald);border-bottom-color:var(--saffron)}
  .admin-counts{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:32px}
  .count-card{background:var(--white);border:1px solid var(--line);padding:24px;border-left:3px solid var(--saffron)}
  .count-lbl{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
  .count-val{font-family:'Fraunces',serif;font-size:36px;color:var(--emerald);margin-top:8px;line-height:1}
  .table-wrap{background:var(--white);border:1px solid var(--line);overflow:auto}
  table{width:100%;border-collapse:collapse;font-size:13px;min-width:640px}
  th{text-align:left;padding:14px 16px;background:var(--ivory-2);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:500;border-bottom:1px solid var(--line)}
  td{padding:14px 16px;border-bottom:1px solid var(--line);vertical-align:top}
  tr:hover td{background:var(--ivory)}
  .status-pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
  .st-pending{background:#F4E3C1;color:#7D5A1A}
  .st-confirmed{background:#C7E5D8;color:#0F3D2E}
  .st-completed,.st-delivered,.st-answered{background:#D1E6D9;color:#0F3D2E}
  .st-shipped{background:#C1DDE8;color:#1A4A5C}
  .st-cancelled,.st-no_show{background:#EDD4D4;color:#7A2020}
  .st-new{background:#E8D9F0;color:#4A2A6B}
  .st-closed{background:#E0DCD0;color:#4A4538}
  .mini-btn{font-size:11px;padding:5px 10px;border:1px solid var(--line);border-radius:2px;margin-right:4px;background:var(--white);color:var(--muted);transition:.15s}
  .mini-btn:hover{background:var(--emerald);color:var(--ivory);border-color:var(--emerald)}
  .mini-btn.danger:hover{background:var(--rose);border-color:var(--rose)}
  .admin-login{max-width:420px;margin:100px auto;padding:40px;background:var(--white);border:1px solid var(--line)}
  .admin-login h2{font-family:'Fraunces',serif;font-size:28px;margin-bottom:8px}
  .admin-login p{color:var(--muted);font-size:14px;margin-bottom:24px}
`;

const ADMIN_PASS = "hok2026"; // simple gate — user can change in code or move to Supabase Edge Function later

const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");

// ═══ ICONS (inline SVG, no libs) ═══
const Icon = ({ name, size = 16 }) => {
  const common = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    cart: <><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 3h2l3 12h11l2-8H6"/></>,
    close: <><path d="M18 6 6 18M6 6l12 12"/></>,
    check: <path d="M20 6 9 17l-5-5"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
  };
  return <svg viewBox="0 0 24 24" {...common}>{paths[name]}</svg>;
};

// ═══ APP ═══
export default function App() {
  const [route, setRoute] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [preselectTreatment, setPreselectTreatment] = useState(null);

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  const notify = (msg, kind = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: Number(p.price_inr), qty: 1 }];
    });
    notify(`${p.name} added to cart`);
  };
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const goToBooking = (t) => {
    setPreselectTreatment(t);
    setRoute("book");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const go = (r) => {
    setRoute(r);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  // Detect admin via hash
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#admin") setRoute("admin");
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  if (route === "admin") return <><style>{theme}</style><AdminPanel onExit={() => { window.location.hash = ""; setRoute("home"); }} /></>;

  return (
    <>
      <style>{theme}</style>
      <div className="hok-root">
        <Nav route={route} go={go} cartCount={cartCount} openCart={() => setCartOpen(true)} />

        {route === "home" && <Home go={go} />}
        {route === "treatments" && <TreatmentsPage onBook={goToBooking} />}
        {route === "products" && <ProductsPage addToCart={addToCart} cart={cart} />}
        {route === "book" && <BookingPage preselect={preselectTreatment} notify={notify} />}
        {route === "ask" && <AskPage notify={notify} />}
        {route === "about" && <AboutPage />}
        {route === "contact" && <ContactPage notify={notify} />}

        <Footer go={go} />
        <CartDrawer
          open={cartOpen} onClose={() => setCartOpen(false)}
          cart={cart} updateQty={updateQty} removeItem={removeItem}
          clearCart={clearCart} notify={notify}
        />
        {toast && <div className={`toast show ${toast.kind}`}>{toast.msg}</div>}
      </div>
    </>
  );
}

// ═══ NAV ═══
function Nav({ route, go, cartCount, openCart }) {
  const links = [
    ["home", "Home"], ["treatments", "Treatments"], ["products", "Shop"],
    ["book", "Book"], ["ask", "Ask"], ["about", "About"], ["contact", "Contact"],
  ];
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">Hair of Kashmir</span>
          <span className="brand-sub">Est. Srinagar</span>
        </button>
        <div className="nav-links">
          {links.map(([k, l]) => (
            <button key={k} className={route === k ? "active" : ""} onClick={() => go(k)}>{l}</button>
          ))}
        </div>
        <div className="nav-actions">
          <button className="cart-btn" onClick={openCart}>
            <Icon name="cart" size={14} /> Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ═══ HOME ═══
function Home({ go }) {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Aesthetic Clinic · Srinagar</div>
            <h1>Care for hair <br/>& skin, refined <br/>over a <em>decade</em>.</h1>
            <p className="hero-sub">
              Led by Dr. Mir Waleed Mansoor — Aesthetic Physician, Cosmetologist & Trichologist.
              FDA-approved lasers, PRP, keratin therapy, and personalised treatments, all under one roof.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => go("book")}>Book an appointment</button>
              <button className="btn-ghost" onClick={() => go("treatments")}>Explore treatments</button>
            </div>
            <div className="hero-stats">
              <div><div className="stat-num">10+</div><div className="stat-lbl">Years</div></div>
              <div><div className="stat-num">1000s</div><div className="stat-lbl">Patients</div></div>
              <div><div className="stat-num">FDA</div><div className="stat-lbl">Approved</div></div>
            </div>
          </div>
          <div>
            <div className="hero-visual">
              <div className="hero-visual-mark">HOK · 01</div>
              <div className="hero-visual-label">"Combining traditional craft with modern precision — every patient, every time."</div>
            </div>
          </div>
        </div>
        <div className="decorative-dots"/>
      </section>

      <ServicesStrip go={go}/>
      <FeaturedTreatments onView={() => go("treatments")} onBook={() => go("book")}/>
      <FeaturedProducts go={go}/>
    </>
  );
}

function ServicesStrip({ go }) {
  const items = [
    ["Laser Hair Removal", "Precise, painless, permanent"],
    ["PRP Therapy", "Natural hair regrowth"],
    ["Anti-Aging", "Restore youthful radiance"],
    ["Keratin Care", "6–8 months of smooth"],
  ];
  return (
    <section className="section" style={{paddingTop:60, paddingBottom:60, background:"var(--white)", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)"}}>
      <div className="container" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:0}}>
        {items.map(([t, s], i) => (
          <div key={t} style={{padding:"18px 24px", borderLeft: i ? "1px solid var(--line)" : "none"}}>
            <div style={{fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--saffron)"}}>0{i+1}</div>
            <div className="serif" style={{fontSize:22, marginTop:6, lineHeight:1.15}}>{t}</div>
            <div style={{fontSize:13, color:"var(--muted)", marginTop:6}}>{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedTreatments({ onView, onBook }) {
  const [treatments, setTreatments] = useState([]);
  useEffect(() => {
    sb.from("hok_treatments").select("*").eq("is_active", true).order("sort_order").limit(6)
      .then(({ data }) => setTreatments(data || []));
  }, []);
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Signature care</div>
            <h2 className="section-title">Our most-requested <em>treatments</em></h2>
          </div>
          <p className="section-desc">Every treatment is administered personally by Dr. Waleed or one of our qualified practitioners, with world-class equipment.</p>
        </div>
        <div className="treat-grid">
          {treatments.map(t => (
            <div key={t.id} className="treat-card">
              <div className="treat-icon">✦</div>
              <div className="treat-name">{t.name}</div>
              <div className="treat-short">{t.short_description}</div>
              <div className="treat-foot">
                <div>
                  <div className="treat-price">{money(t.price_inr)}</div>
                  <div className="treat-dur">{t.duration_minutes} min</div>
                </div>
                <button className="treat-book" onClick={onBook}>Book →</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center", marginTop:32}}>
          <button className="btn-ghost" onClick={onView}>See all treatments</button>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ go }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    sb.from("hok_products").select("*").eq("is_active", true).order("sort_order").limit(4)
      .then(({ data }) => setProducts(data || []));
  }, []);
  return (
    <section className="section" style={{background:"var(--ivory-2)"}}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Home care</div>
            <h2 className="section-title">Kashmir <em>Keratin</em> — take the results home</h2>
          </div>
          <p className="section-desc">A sulfate- and paraben-free system built around pure keratin. Extend your in-clinic results, every day.</p>
        </div>
        <div className="prod-grid">
          {products.map(p => (
            <div key={p.id} className="prod-card">
              <div className="prod-img">
                <div className="prod-img-label">{p.name}</div>
              </div>
              <div className="prod-body">
                <div className="prod-cat">{p.category}</div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-foot">
                  <div className="prod-price">{money(p.price_inr)}</div>
                  <button className="prod-add" onClick={() => go("products")}>Shop →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══ TREATMENTS PAGE ═══
function TreatmentsPage({ onBook }) {
  const [categories, setCategories] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [activeCat, setActiveCat] = useState("all");

  useEffect(() => {
    (async () => {
      const { data: cats } = await sb.from("hok_treatment_categories").select("*").order("sort_order");
      const { data: trs } = await sb.from("hok_treatments").select("*").eq("is_active", true).order("sort_order");
      setCategories(cats || []);
      setTreatments(trs || []);
    })();
  }, []);

  const filtered = activeCat === "all" ? treatments : treatments.filter(t => t.category_id === activeCat);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Full catalogue</div>
            <h2 className="section-title">Treatments for <em>hair & skin</em></h2>
          </div>
          <p className="section-desc">From laser to rejuvenation — choose a category, pick a treatment, and book in a couple of taps.</p>
        </div>
        <div className="cat-tabs">
          <button className={`cat-tab ${activeCat === "all" ? "active" : ""}`} onClick={() => setActiveCat("all")}>All</button>
          {categories.map(c => (
            <button key={c.id} className={`cat-tab ${activeCat === c.id ? "active" : ""}`} onClick={() => setActiveCat(c.id)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <div className="treat-grid">
          {filtered.map(t => (
            <div key={t.id} className="treat-card">
              <div className="treat-icon">✦</div>
              <div className="treat-name">{t.name}</div>
              <div className="treat-short">{t.full_description || t.short_description}</div>
              <div className="treat-foot">
                <div>
                  <div className="treat-price">{money(t.price_inr)}</div>
                  <div className="treat-dur">{t.duration_minutes} min</div>
                </div>
                <button className="treat-book" onClick={() => onBook(t)}>Book →</button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p style={{textAlign:"center", padding:60, color:"var(--muted)"}}>No treatments in this category yet.</p>}
      </div>
    </section>
  );
}

// ═══ PRODUCTS PAGE ═══
function ProductsPage({ addToCart, cart }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    sb.from("hok_products").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setProducts(data || []));
  }, []);
  const inCart = id => cart.some(i => i.id === id);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Shop</div>
            <h2 className="section-title">Home-care <em>products</em></h2>
          </div>
          <p className="section-desc">Sulfate- and paraben-free. Safe for chemically-treated and coloured hair. Delivered across India.</p>
        </div>
        <div className="prod-grid">
          {products.map(p => (
            <div key={p.id} className="prod-card">
              <div className="prod-img">
                <div className="prod-img-label">{p.name}</div>
              </div>
              <div className="prod-body">
                <div className="prod-cat">{p.category}</div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-desc">{p.description}</div>
                <div className="prod-foot">
                  <div className="prod-price">{money(p.price_inr)}</div>
                  <button className={`prod-add ${inCart(p.id) ? "in" : ""}`} onClick={() => addToCart(p)}>
                    {inCart(p.id) ? "✓ Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══ BOOKING ═══
function BookingPage({ preselect, notify }) {
  const [treatments, setTreatments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [booked, setBooked] = useState([]);
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "",
    treatment_id: preselect?.id || "",
    appointment_date: "", appointment_time: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: t }, { data: a }, { data: b }] = await Promise.all([
        sb.from("hok_treatments").select("*").eq("is_active", true).order("sort_order"),
        sb.from("hok_availability").select("*").eq("is_active", true),
        sb.from("hok_blocked_dates").select("*"),
      ]);
      setTreatments(t || []);
      setAvailability(a || []);
      setBlocked(b || []);
    })();
  }, []);

  useEffect(() => {
    if (preselect) setForm(f => ({ ...f, treatment_id: preselect.id }));
  }, [preselect]);

  // Load booked slots when date changes
  useEffect(() => {
    if (!form.appointment_date) return setBooked([]);
    sb.from("hok_appointments")
      .select("appointment_time, status")
      .eq("appointment_date", form.appointment_date)
      .in("status", ["pending", "confirmed"])
      .then(({ data }) => setBooked((data || []).map(x => x.appointment_time?.slice(0,5))));
  }, [form.appointment_date]);

  const slots = useMemo(() => {
    if (!form.appointment_date) return [];
    const d = new Date(form.appointment_date + "T00:00:00");
    const dow = d.getDay();
    const rule = availability.find(a => a.day_of_week === dow);
    if (!rule) return [];
    const toMin = s => { const [h,m] = s.split(":").map(Number); return h*60+m; };
    const fmt = n => `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
    const out = [];
    for (let t = toMin(rule.start_time); t + rule.slot_duration_minutes <= toMin(rule.end_time); t += rule.slot_duration_minutes) {
      out.push(fmt(t));
    }
    return out;
  }, [form.appointment_date, availability]);

  const isBlocked = form.appointment_date && blocked.some(b => b.blocked_date === form.appointment_date);
  const minDate = new Date().toISOString().slice(0,10);

  const submit = async () => {
    if (!form.full_name || !form.phone || !form.appointment_date || !form.appointment_time || !form.treatment_id) {
      notify("Please complete all required fields", "err"); return;
    }
    setSaving(true);
    const treatment = treatments.find(t => t.id === form.treatment_id);
    const { data, error } = await sb.from("hok_appointments").insert({
      full_name: form.full_name, phone: form.phone, email: form.email || null,
      treatment_id: form.treatment_id,
      treatment_name: treatment?.name,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      notes: form.notes || null,
    }).select().single();
    setSaving(false);
    if (error) { notify("Booking failed: " + error.message, "err"); return; }
    setConfirmed(data);
    notify("Appointment booked!", "ok");
  };

  if (confirmed) {
    return (
      <section className="section">
        <div className="container" style={{maxWidth:640}}>
          <div className="panel" style={{textAlign:"center"}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:"var(--emerald)",color:"var(--ivory)",display:"inline-flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <Icon name="check" size={28}/>
            </div>
            <h2 className="serif" style={{fontSize:36, marginBottom:12}}>Appointment confirmed</h2>
            <p style={{color:"var(--muted)", marginBottom:24}}>We've received your request. Our team will call you shortly to confirm.</p>
            <div style={{background:"var(--ivory)", padding:24, marginBottom:24, textAlign:"left"}}>
              <div style={{fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--muted)"}}>Reference</div>
              <div className="serif" style={{fontSize:22, color:"var(--emerald)", marginBottom:14}}>{confirmed.appointment_number}</div>
              <div style={{fontSize:14, lineHeight:1.8}}>
                <strong>{confirmed.full_name}</strong><br/>
                {confirmed.treatment_name}<br/>
                {new Date(confirmed.appointment_date).toLocaleDateString("en-IN", {weekday:"long", year:"numeric", month:"long", day:"numeric"})} · {confirmed.appointment_time?.slice(0,5)}
              </div>
            </div>
            <button className="btn-primary" onClick={() => { setConfirmed(null); setForm({full_name:"",phone:"",email:"",treatment_id:"",appointment_date:"",appointment_time:"",notes:""}); }}>Book another</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Appointment</div>
            <h2 className="section-title">Book with <em>Dr. Waleed</em></h2>
          </div>
          <p className="section-desc">Pick a treatment, a date, and a time. You'll get a call back shortly to confirm.</p>
        </div>
        <div className="booking-grid">
          <div className="panel">
            <div className="form-row">
              <div className="field"><label>Full name *</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></div>
              <div className="field"><label>Phone *</label><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            </div>
            <div className="field"><label>Email (optional)</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div className="field">
              <label>Treatment *</label>
              <select value={form.treatment_id} onChange={e=>setForm({...form,treatment_id:e.target.value})}>
                <option value="">Select a treatment…</option>
                {treatments.map(t => <option key={t.id} value={t.id}>{t.name} — {money(t.price_inr)}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="field"><label>Date *</label><input type="date" min={minDate} value={form.appointment_date} onChange={e=>setForm({...form,appointment_date:e.target.value,appointment_time:""})}/></div>
            </div>
            {form.appointment_date && (
              <div className="field">
                <label>Time slot *</label>
                {isBlocked ? <p style={{fontSize:13, color:"var(--rose)"}}>This date is unavailable. Please pick another.</p>
                 : slots.length === 0 ? <p style={{fontSize:13, color:"var(--muted)"}}>Clinic closed this day.</p>
                 : (
                  <div className="slot-grid">
                    {slots.map(s => (
                      <button key={s} type="button" disabled={booked.includes(s)}
                        className={`slot ${form.appointment_time === s ? "sel" : ""}`}
                        onClick={()=>setForm({...form,appointment_time:s})}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="field"><label>Notes</label><textarea placeholder="Anything we should know..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            <button className="submit-btn" onClick={submit} disabled={saving}>{saving ? "Booking…" : "Confirm appointment"}</button>
          </div>
          <aside className="booking-aside">
            <h3>What to expect</h3>
            <div className="tidbit"><strong>01</strong><div>We'll call you within business hours to confirm your slot and share pre-care instructions.</div></div>
            <div className="tidbit"><strong>02</strong><div>Consultation is included with every first visit — treatments are administered by qualified clinicians only.</div></div>
            <div className="tidbit"><strong>03</strong><div>Need to reschedule? Just call us at <strong style={{color:"var(--ivory)"}}>9596 366 088</strong> — no charges.</div></div>
            <div style={{marginTop:"auto", paddingTop:28, borderTop:"1px solid rgba(246,241,232,.2)", fontSize:12, color:"rgba(246,241,232,.7)"}}>
              Hair of Kashmir Building, Near Cancer Society of Kashmir,<br/>Chanpora Bypass, Srinagar 190015
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ═══ ASK PAGE ═══
function AskPage({ notify }) {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ full_name:"", phone:"", email:"", subject:"", question:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sb.from("hok_questions").select("*").eq("is_public", true).eq("status", "answered")
      .order("created_at", { ascending: false })
      .then(({ data }) => setFaqs(data || []));
  }, []);

  const submit = async () => {
    if (!form.full_name || !form.question) { notify("Name and question are required", "err"); return; }
    setSaving(true);
    const { error } = await sb.from("hok_questions").insert(form);
    setSaving(false);
    if (error) return notify("Could not submit: " + error.message, "err");
    setForm({ full_name:"", phone:"", email:"", subject:"", question:"" });
    notify("Thanks — we'll get back to you soon.", "ok");
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Ask us anything</div>
            <h2 className="section-title">Questions, <em>answered</em></h2>
          </div>
          <p className="section-desc">Browse common questions below, or send us yours — Dr. Waleed's team will reply personally.</p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:48}}>
          <div>
            <div className="faq-list">
              {faqs.map(f => (
                <div key={f.id} className="faq-item">
                  <button className={`faq-q ${open === f.id ? "open" : ""}`} onClick={() => setOpen(open === f.id ? null : f.id)}>
                    <span>{f.question}</span>
                    <span className="faq-q-icon">+</span>
                  </button>
                  <div className={`faq-a ${open === f.id ? "open" : ""}`}>{f.answer}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3 className="serif" style={{fontSize:24, marginBottom:18}}>Send a question</h3>
            <div className="form-row">
              <div className="field"><label>Name *</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></div>
              <div className="field"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            </div>
            <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div className="field"><label>Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></div>
            <div className="field"><label>Your question *</label><textarea value={form.question} onChange={e=>setForm({...form,question:e.target.value})}/></div>
            <button className="submit-btn" onClick={submit} disabled={saving}>{saving ? "Sending…" : "Send question"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ ABOUT ═══
function AboutPage() {
  return (
    <section className="about">
      <div className="container about-grid">
        <div className="about-portrait"/>
        <div>
          <div className="eyebrow" style={{color:"var(--saffron-soft)"}}>The practitioner</div>
          <h2>Dr. Mir Waleed <em>Mansoor</em></h2>
          <p>
            A highly esteemed Aesthetic Physician, Cosmetologist, and Trichologist with over a decade of experience.
            Dr. Waleed is committed to holistic healthcare, combining traditional herbal approaches with cutting-edge modern practices.
          </p>
          <p>
            Equipped with USFDA-approved laser technology, he delivers a comprehensive range of treatments tailored to each individual —
            from precise laser hair removal and tattoo removal to PRP, anti-aging therapy, and skin rejuvenation.
          </p>
          <div className="about-creds">
            <div className="cred-item"><strong>10+ yrs</strong>Clinical practice</div>
            <div className="cred-item"><strong>MBCT</strong>British Board of Complementary Therapies</div>
            <div className="cred-item"><strong>Greifswald</strong>Institute of Laser & Aesthetic Medicine, Germany</div>
            <div className="cred-item"><strong>PG</strong>Skin & Venereal Disease, Inamdar Hospital</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ CONTACT ═══
function ContactPage({ notify }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Visit · Call · Write</div>
            <h2 className="section-title">Find <em>us</em></h2>
          </div>
          <p className="section-desc">We're in the heart of Lal Nagar, Chanapora Bypass — above the National Centre of Diabetes & Hormone.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Hair of Kashmir</h3>
            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-val">
                Hair of Kashmir Building<br/>
                Near Cancer Society of Kashmir<br/>
                Chanpora Bypass, Srinagar<br/>
                Jammu and Kashmir 190015
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Phone</div>
              <div className="info-val"><a href="tel:+919596366088">+91 95963 66088</a></div>
            </div>
            <div className="info-item">
              <div className="info-label">Hours</div>
              <div className="info-val">Mon – Fri · 10:00 – 18:00<br/>Saturday · 10:00 – 16:00<br/>Sunday · Closed</div>
            </div>
            <div className="info-item">
              <div className="info-label">Landmark</div>
              <div className="info-val">Above National Centre of Diabetes & Hormone, opposite timber shops.</div>
            </div>
          </div>
          <div style={{background:"linear-gradient(160deg,var(--ivory-2),#D4C5A8)", minHeight:400, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", padding:40}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11, letterSpacing:".3em", textTransform:"uppercase", color:"var(--emerald)", marginBottom:12}}>Location</div>
              <div className="serif italic" style={{fontSize:28, color:"var(--emerald)", lineHeight:1.2, marginBottom:20}}>Srinagar,<br/>Jammu & Kashmir</div>
              <a href="https://maps.google.com/?q=Hair+of+Kashmir+Chanpora+Bypass+Srinagar" target="_blank" rel="noreferrer" className="btn-primary" style={{display:"inline-block"}}>Open in Maps ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ FOOTER ═══
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-mark" style={{color:"var(--saffron-soft)", fontSize:30}}>Hair of Kashmir</div>
            <p style={{marginTop:14, maxWidth:360}}>An aesthetic clinic in Srinagar specialising exclusively in hair and skin concerns — where research, education, and refined practice meet.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><button onClick={() => go("treatments")}>Treatments</button></li>
              <li><button onClick={() => go("products")}>Shop</button></li>
              <li><button onClick={() => go("book")}>Book appointment</button></li>
              <li><button onClick={() => go("ask")}>Ask a question</button></li>
            </ul>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li>Chanpora Bypass, Srinagar</li>
              <li>J&K 190015</li>
              <li><a href="tel:+919596366088">+91 95963 66088</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Hair of Kashmir. All rights reserved.</span>
          <a href="#admin" onClick={() => window.location.hash = "admin"} style={{color:"rgba(246,241,232,.4)"}}>Staff login</a>
        </div>
      </div>
    </footer>
  );
}

// ═══ CART DRAWER ═══
function CartDrawer({ open, onClose, cart, updateQty, removeItem, clearCart, notify }) {
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ full_name:"", phone:"", email:"", shipping_address:"", notes:"" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const subtotal = cart.reduce((a,b) => a + b.price * b.qty, 0);

  const submit = async () => {
    if (!form.full_name || !form.phone || !form.shipping_address) return notify("Name, phone, and address are required", "err");
    if (cart.length === 0) return notify("Your cart is empty", "err");
    setSaving(true);
    const { data, error } = await sb.from("hok_orders").insert({
      full_name: form.full_name,
      phone: form.phone,
      email: form.email || null,
      shipping_address: form.shipping_address,
      items: cart.map(i => ({ product_id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subtotal,
      total: subtotal,
      notes: form.notes || null,
    }).select().single();
    setSaving(false);
    if (error) return notify("Order failed: " + error.message, "err");
    setSuccess(data);
    clearCart();
  };

  const resetAndClose = () => {
    setCheckout(false); setSuccess(null);
    setForm({ full_name:"", phone:"", email:"", shipping_address:"", notes:"" });
    onClose();
  };

  return (
    <>
      <div className={`drawer-bg ${open ? "open" : ""}`} onClick={resetAndClose}/>
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <h3>{success ? "Order placed" : checkout ? "Checkout" : "Your cart"}</h3>
          <button className="drawer-close" onClick={resetAndClose}><Icon name="close" size={20}/></button>
        </div>

        {success ? (
          <div className="drawer-body">
            <div style={{textAlign:"center", padding:"20px 0"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"var(--emerald)",color:"var(--ivory)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                <Icon name="check" size={22}/>
              </div>
              <div className="serif" style={{fontSize:22, marginBottom:6}}>Thank you</div>
              <p style={{color:"var(--muted)", fontSize:13, marginBottom:20}}>We'll call you to confirm. Pay on delivery or via UPI after confirmation.</p>
              <div style={{background:"var(--ivory)", padding:16, borderRadius:2, textAlign:"left"}}>
                <div style={{fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"var(--muted)"}}>Order number</div>
                <div className="serif" style={{fontSize:18, color:"var(--emerald)"}}>{success.order_number}</div>
                <div style={{fontSize:13, marginTop:10}}>Total: <strong>{money(success.total)}</strong></div>
              </div>
              <button className="btn-primary" onClick={resetAndClose} style={{marginTop:20}}>Continue shopping</button>
            </div>
          </div>
        ) : checkout ? (
          <>
            <div className="drawer-body">
              <div className="field"><label>Full name *</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></div>
              <div className="field"><label>Phone *</label><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div className="field"><label>Shipping address *</label><textarea value={form.shipping_address} onChange={e=>setForm({...form,shipping_address:e.target.value})}/></div>
              <div className="field"><label>Order notes</label><textarea style={{minHeight:70}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
              <div style={{background:"var(--ivory)", padding:14, fontSize:13, marginTop:8}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <div style={{display:"flex",justifyContent:"space-between", marginTop:4}}><span>Shipping</span><strong>Calculated at confirmation</strong></div>
              </div>
            </div>
            <div className="drawer-foot">
              <button className="mini-btn" onClick={()=>setCheckout(false)}>← Back to cart</button>
              <button className="submit-btn" onClick={submit} disabled={saving}>{saving ? "Placing order…" : `Place order · ${money(subtotal)}`}</button>
            </div>
          </>
        ) : (
          <>
            <div className="drawer-body">
              {cart.length === 0 ? <div className="empty-cart">Your cart is empty.</div>
               : cart.map(i => (
                <div key={i.id} className="cart-item">
                  <div>
                    <div className="cart-item-name">{i.name}</div>
                    <div className="cart-item-meta">{money(i.price)} × {i.qty}</div>
                    <div className="qty-ctrl">
                      <button onClick={()=>updateQty(i.id,-1)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={()=>updateQty(i.id,1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={()=>removeItem(i.id)}>Remove</button>
                  </div>
                  <div className="serif" style={{fontSize:16, color:"var(--emerald)"}}>{money(i.price * i.qty)}</div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="drawer-foot">
                <div className="total-row"><span className="lbl">Subtotal</span><span className="val">{money(subtotal)}</span></div>
                <button className="submit-btn" onClick={()=>setCheckout(true)}>Checkout</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ═══ ADMIN PANEL ═══
function AdminPanel({ onExit }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem("hok_admin") === "ok");
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("overview");

  if (!authed) {
    return (
      <div className="admin-shell">
        <div className="container">
          <div className="admin-login">
            <h2 className="serif">Staff access</h2>
            <p>Enter the admin passcode to view orders, appointments, and questions.</p>
            <div className="field"><label>Passcode</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && (pass===ADMIN_PASS ? (sessionStorage.setItem("hok_admin","ok"), setAuthed(true)) : alert("Wrong passcode"))}/>
            </div>
            <button className="submit-btn" onClick={()=>pass===ADMIN_PASS ? (sessionStorage.setItem("hok_admin","ok"), setAuthed(true)) : alert("Wrong passcode")}>Sign in</button>
            <button className="mini-btn" style={{marginTop:14, width:"100%"}} onClick={onExit}>← Back to site</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="container">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12}}>
          <div>
            <div className="section-kicker">Staff console</div>
            <h1 className="serif" style={{fontSize:36}}>Hair of Kashmir · Admin</h1>
          </div>
          <div style={{display:"flex", gap:10}}>
            <button className="mini-btn" onClick={onExit}>← View site</button>
            <button className="mini-btn danger" onClick={()=>{sessionStorage.removeItem("hok_admin");setAuthed(false);}}>Sign out</button>
          </div>
        </div>
        <div className="admin-tabs">
          {["overview","appointments","orders","questions","treatments","products"].map(t => (
            <button key={t} className={`admin-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>
        {tab==="overview" && <AdminOverview/>}
        {tab==="appointments" && <AdminAppointments/>}
        {tab==="orders" && <AdminOrders/>}
        {tab==="questions" && <AdminQuestions/>}
        {tab==="treatments" && <AdminList type="treatment"/>}
        {tab==="products" && <AdminList type="product"/>}
      </div>
    </div>
  );
}

function AdminOverview() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    (async () => {
      const [a, o, q, t, p] = await Promise.all([
        sb.from("hok_appointments").select("id, status", { count: "exact" }),
        sb.from("hok_orders").select("id, status, total", { count: "exact" }),
        sb.from("hok_questions").select("id, status", { count: "exact" }),
        sb.from("hok_treatments").select("id", { count: "exact" }).eq("is_active", true),
        sb.from("hok_products").select("id", { count: "exact" }).eq("is_active", true),
      ]);
      setCounts({
        appts: a.count || 0,
        pendingAppts: (a.data || []).filter(x => x.status === "pending").length,
        orders: o.count || 0,
        pendingOrders: (o.data || []).filter(x => x.status === "pending").length,
        revenue: (o.data || []).filter(x => x.status !== "cancelled").reduce((s, x) => s + Number(x.total || 0), 0),
        newQs: (q.data || []).filter(x => x.status === "new").length,
        treatments: t.count || 0,
        products: p.count || 0,
      });
    })();
  }, []);
  if (!counts) return <p>Loading…</p>;
  return (
    <div>
      <div className="admin-counts">
        <div className="count-card"><div className="count-lbl">Pending appointments</div><div className="count-val">{counts.pendingAppts}</div></div>
        <div className="count-card"><div className="count-lbl">Total appointments</div><div className="count-val">{counts.appts}</div></div>
        <div className="count-card"><div className="count-lbl">Pending orders</div><div className="count-val">{counts.pendingOrders}</div></div>
        <div className="count-card"><div className="count-lbl">Total orders</div><div className="count-val">{counts.orders}</div></div>
        <div className="count-card"><div className="count-lbl">Order revenue</div><div className="count-val" style={{fontSize:24}}>{money(counts.revenue)}</div></div>
        <div className="count-card"><div className="count-lbl">New questions</div><div className="count-val">{counts.newQs}</div></div>
      </div>
      <p style={{color:"var(--muted)", fontSize:14}}>Use the tabs above to manage appointments, orders, and questions. Catalogue tabs let you toggle treatments/products on or off.</p>
    </div>
  );
}

function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const load = async () => {
    let q = sb.from("hok_appointments").select("*").order("appointment_date", { ascending: false }).order("appointment_time", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setRows(data || []);
  };
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id, s) => {
    await sb.from("hok_appointments").update({ status: s }).eq("id", id);
    load();
  };

  return (
    <div>
      <div style={{display:"flex", gap:6, marginBottom:16, flexWrap:"wrap"}}>
        {["all","pending","confirmed","completed","cancelled","no_show"].map(s => (
          <button key={s} className={`mini-btn ${filter===s?"active":""}`} onClick={()=>setFilter(s)} style={filter===s?{background:"var(--emerald)",color:"var(--ivory)",borderColor:"var(--emerald)"}:{}}>{s}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Ref</th><th>Date · Time</th><th>Customer</th><th>Treatment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{fontFamily:"Fraunces,serif", color:"var(--emerald)"}}>{r.appointment_number}</td>
                <td>{r.appointment_date}<br/><span style={{color:"var(--muted)"}}>{r.appointment_time?.slice(0,5)}</span></td>
                <td><strong>{r.full_name}</strong><br/><span style={{color:"var(--muted)",fontSize:12}}>{r.phone}</span></td>
                <td>{r.treatment_name}</td>
                <td><span className={`status-pill st-${r.status}`}>{r.status}</span></td>
                <td>
                  {r.status==="pending" && <button className="mini-btn" onClick={()=>setStatus(r.id,"confirmed")}>Confirm</button>}
                  {(r.status==="pending"||r.status==="confirmed") && <button className="mini-btn" onClick={()=>setStatus(r.id,"completed")}>Complete</button>}
                  {r.status!=="cancelled" && <button className="mini-btn danger" onClick={()=>setStatus(r.id,"cancelled")}>Cancel</button>}
                </td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={6} style={{textAlign:"center", color:"var(--muted)", padding:40}}>No appointments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const load = async () => {
    let q = sb.from("hok_orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setRows(data || []);
  };
  useEffect(() => { load(); }, [filter]);
  const setStatus = async (id, s) => { await sb.from("hok_orders").update({ status: s }).eq("id", id); load(); };

  return (
    <div>
      <div style={{display:"flex", gap:6, marginBottom:16, flexWrap:"wrap"}}>
        {["all","pending","confirmed","shipped","delivered","cancelled"].map(s => (
          <button key={s} className="mini-btn" onClick={()=>setFilter(s)} style={filter===s?{background:"var(--emerald)",color:"var(--ivory)",borderColor:"var(--emerald)"}:{}}>{s}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{fontFamily:"Fraunces,serif", color:"var(--emerald)"}}>{r.order_number}</td>
                <td>{new Date(r.created_at).toLocaleDateString("en-IN")}<br/><span style={{color:"var(--muted)", fontSize:12}}>{new Date(r.created_at).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span></td>
                <td><strong>{r.full_name}</strong><br/><span style={{color:"var(--muted)",fontSize:12}}>{r.phone}</span><br/><span style={{fontSize:11,color:"var(--muted)"}}>{r.shipping_address}</span></td>
                <td>
                  {(r.items || []).map((i,k) => <div key={k} style={{fontSize:12}}>{i.qty}× {i.name}</div>)}
                </td>
                <td style={{fontFamily:"Fraunces,serif", color:"var(--emerald)"}}>{money(r.total)}</td>
                <td><span className={`status-pill st-${r.status}`}>{r.status}</span></td>
                <td>
                  {r.status==="pending" && <button className="mini-btn" onClick={()=>setStatus(r.id,"confirmed")}>Confirm</button>}
                  {r.status==="confirmed" && <button className="mini-btn" onClick={()=>setStatus(r.id,"shipped")}>Ship</button>}
                  {r.status==="shipped" && <button className="mini-btn" onClick={()=>setStatus(r.id,"delivered")}>Delivered</button>}
                  {r.status!=="cancelled"&&r.status!=="delivered" && <button className="mini-btn danger" onClick={()=>setStatus(r.id,"cancelled")}>Cancel</button>}
                </td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={7} style={{textAlign:"center", color:"var(--muted)", padding:40}}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminQuestions() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const load = async () => {
    const { data } = await sb.from("hok_questions").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const saveAnswer = async (id) => {
    await sb.from("hok_questions").update({ answer, is_public: isPublic, status:"answered", answered_at: new Date().toISOString() }).eq("id", id);
    setEditing(null); setAnswer(""); setIsPublic(false); load();
  };

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Date</th><th>From</th><th>Question</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <React.Fragment key={r.id}>
              <tr>
                <td style={{fontSize:12}}>{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                <td><strong>{r.full_name}</strong><br/><span style={{fontSize:11,color:"var(--muted)"}}>{r.phone || r.email || "—"}</span></td>
                <td style={{maxWidth:400}}>
                  <strong style={{fontSize:13}}>{r.subject}</strong>
                  <div style={{fontSize:13, marginTop:4}}>{r.question}</div>
                  {r.answer && <div style={{fontSize:12, color:"var(--emerald)", marginTop:8, paddingLeft:10, borderLeft:"2px solid var(--saffron)"}}>↳ {r.answer}</div>}
                </td>
                <td><span className={`status-pill st-${r.status}`}>{r.status}</span>{r.is_public && <div style={{fontSize:10, marginTop:4, color:"var(--saffron)"}}>PUBLIC FAQ</div>}</td>
                <td>
                  {editing!==r.id && <button className="mini-btn" onClick={()=>{setEditing(r.id); setAnswer(r.answer||""); setIsPublic(r.is_public);}}>{r.answer?"Edit":"Answer"}</button>}
                </td>
              </tr>
              {editing===r.id && (
                <tr>
                  <td colSpan={5} style={{background:"var(--ivory)"}}>
                    <textarea style={{width:"100%", minHeight:80, padding:10, border:"1px solid var(--line)", fontFamily:"inherit"}} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer..."/>
                    <label style={{display:"block", margin:"10px 0", fontSize:12}}>
                      <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)}/> Publish to public FAQ page
                    </label>
                    <button className="mini-btn" onClick={()=>saveAnswer(r.id)} style={{background:"var(--emerald)",color:"var(--ivory)",borderColor:"var(--emerald)"}}>Save answer</button>
                    <button className="mini-btn" onClick={()=>setEditing(null)}>Cancel</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {rows.length===0 && <tr><td colSpan={5} style={{textAlign:"center", color:"var(--muted)", padding:40}}>No questions yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AdminList({ type }) {
  const table = type === "treatment" ? "hok_treatments" : "hok_products";
  const [rows, setRows] = useState([]);
  const load = async () => {
    const { data } = await sb.from(table).select("*").order("sort_order");
    setRows(data || []);
  };
  useEffect(() => { load(); }, [table]);
  const toggle = async (r) => { await sb.from(table).update({ is_active: !r.is_active }).eq("id", r.id); load(); };

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>{type==="product"?"Category":"Duration"}</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td><strong>{r.name}</strong><br/><span style={{fontSize:12, color:"var(--muted)"}}>{r.short_description || r.description?.slice(0,70)}</span></td>
              <td>{type==="product" ? r.category : `${r.duration_minutes} min`}</td>
              <td style={{fontFamily:"Fraunces,serif", color:"var(--emerald)"}}>{money(r.price_inr)}</td>
              <td><span className={`status-pill ${r.is_active?"st-completed":"st-cancelled"}`}>{r.is_active?"Active":"Hidden"}</span></td>
              <td><button className="mini-btn" onClick={()=>toggle(r)}>{r.is_active?"Hide":"Show"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{padding:16, fontSize:12, color:"var(--muted)"}}>Tip: to add/edit {type}s directly, use the Supabase dashboard for now. I can add inline editing here in a follow-up if you'd like.</p>
    </div>
  );
}
