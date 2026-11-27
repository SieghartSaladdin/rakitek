"use client";

import { OrchardEditorialTemplate } from "./component";

export default function OrchardEditorialTemplatePreview() {
  return (
    <OrchardEditorialTemplate
      skipLinkLabel="Skip to content"
      mainId="site-main"
      header={
        <div
          style={{
            padding: "24px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--rk-border)",
          }}
        >
          <span style={{ fontFamily: "var(--rk-font-mono)", fontSize: "12px" }}>
            HEADER SLOT
          </span>
          <span style={{ fontFamily: "var(--rk-font-display)", fontSize: "24px" }}>
            SOLARA
          </span>
          <span style={{ fontFamily: "var(--rk-font-mono)", fontSize: "12px" }}>
            MENU TOGGLE
          </span>
        </div>
      }
      hero={
        <section style={{ padding: "80px 30px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--rk-font-display)", fontSize: "72px", margin: 0, color: "var(--rk-accent)" }}>
            HERO SLOT
          </h1>
        </section>
      }
      intro={
        <section style={{ padding: "40px 30px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "20px" }}>Editorial Rhombus Intro Slot</p>
        </section>
      }
      sections={
        <section style={{ padding: "60px 30px", background: "var(--rk-surface)", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "var(--rk-font-mono)", fontSize: "13px" }}>
            SECTIONS SLOT (SHOWCASE / POSTER / LEDGER)
          </p>
        </section>
      }
      outro={
        <section style={{ padding: "60px 30px", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "var(--rk-font-mono)", fontSize: "13px" }}>
            OUTRO COVER SLOT
          </p>
        </section>
      }
      floatingNav={
        <div style={{ padding: "16px", textAlign: "center", fontFamily: "var(--rk-font-mono)", fontSize: "12px" }}>
          FLOATING PILL NAV SLOT
        </div>
      }
      footer={
        <footer style={{ padding: "60px 30px", background: "var(--rk-fg)", color: "var(--rk-bg)", textAlign: "center" }}>
          FOOTER SLOT
        </footer>
      }
    />
  );
}
