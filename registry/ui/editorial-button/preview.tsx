"use client";

import type { MouseEvent } from "react";
import { EditorialButton } from "./component";

export default function EditorialButtonPreview() {
  const preventNav = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col justify-center gap-10 p-8 sm:p-12"
      style={{ backgroundColor: "var(--rk-bg)", color: "var(--rk-fg)" }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div
          className="flex flex-col gap-6 rounded-[4px] p-8"
          style={{
            backgroundColor: "var(--rk-bg)",
            border: "1px solid var(--rk-border)",
          }}
        >
          <div className="flex flex-col gap-3">
            <span
              className="text-xs font-medium uppercase tracking-[0.12em]"
              style={{
                color: "var(--rk-fg-muted)",
                fontFamily: "var(--rk-font-body)",
              }}
            >
              Solid + Ghost Pair
            </span>
            <div className="block">
              <EditorialButton variant="solid" data-btn-demo="solid">
                Shop
              </EditorialButton>
              <EditorialButton
                as="a"
                href="#learn-more"
                variant="ghost"
                className="ml-[10px]"
                data-btn-demo="ghost"
                onClick={preventNav}
              >
                Learn More
              </EditorialButton>
            </div>
          </div>

          <div
            className="flex flex-col gap-3 pt-6"
            style={{ borderTop: "1px solid var(--rk-border)" }}
          >
            <span
              className="text-xs font-medium uppercase tracking-[0.12em]"
              style={{
                color: "var(--rk-fg-muted)",
                fontFamily: "var(--rk-font-body)",
              }}
            >
              Dark CTA
            </span>
            <div className="block">
              <EditorialButton
                as="a"
                href="#subscribe"
                variant="dark"
                data-btn-demo="dark"
                onClick={preventNav}
              >
                Subscribe
              </EditorialButton>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col gap-3 rounded-[4px] p-8"
          style={{
            backgroundColor: "var(--rk-fg)",
            color: "var(--rk-bg)",
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-[0.12em]"
            style={{
              color: "color-mix(in srgb, var(--rk-bg) 72%, transparent)",
              fontFamily: "var(--rk-font-body)",
            }}
          >
            Light + Blend on Dark Band
          </span>
          <div className="block">
            <EditorialButton
              as="a"
              href="#mission"
              variant="light"
              blend
              data-btn-demo="light"
              onClick={preventNav}
            >
              Learn More
            </EditorialButton>
          </div>
        </div>
      </div>
    </div>
  );
}
