import fs from "node:fs";
import path from "node:path";
import { withCdpPage } from "./cdp-browser";

interface CaptureJob {
  url: string;
  width: number;
  height: number;
  selectors: Record<string, string>;
  outJson: string;
  outImage?: string;
  setupJs?: string;
  waitMs?: number;
  scrollSelector?: string;
}

async function runCapture(jobPath: string) {
  const job = JSON.parse(fs.readFileSync(jobPath, "utf8")) as CaptureJob;
  const measureScript = fs.readFileSync(
    path.resolve(process.cwd(), "scripts", "fidelity", "measure.js"),
    "utf8",
  );

  await withCdpPage({ width: job.width, height: job.height }, async ({ send, health, sleep }) => {
    await send("Page.addScriptToEvaluateOnNewDocument", {
      source:
        'document.addEventListener("DOMContentLoaded",()=>{const s=document.createElement("style");s.id="rk-fidelity-normalize";s.textContent="html{scrollbar-width:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}";document.head.append(s);});',
    });
    await send("Page.navigate", { url: job.url });
    await sleep(job.waitMs ?? 2200);

    await send("Runtime.evaluate", {
      expression: "document.fonts.ready",
      awaitPromise: true,
    });

    if (job.scrollSelector) {
      await send("Runtime.evaluate", {
        expression: `(() => { const el = document.querySelector(${JSON.stringify(job.scrollSelector)}); if (el) el.scrollIntoView({ behavior: "instant", block: "start" }); })()`,
      });
      await sleep(700);
    }

    if (job.setupJs) {
      await send("Runtime.evaluate", {
        expression: `(async () => { ${job.setupJs} })()`,
        awaitPromise: true,
      });
      await sleep(700);
    }

    await send("Runtime.evaluate", { expression: measureScript });
    const evalRes = (await send("Runtime.evaluate", {
      expression: `JSON.stringify(window.rkMeasure(${JSON.stringify(job.selectors)}))`,
      returnByValue: true,
    })) as { result?: { value?: string } };

    const measured = evalRes.result?.value;
    if (!measured) throw new Error("rkMeasure returned empty output.");

    const outJsonAbs = path.resolve(process.cwd(), job.outJson);
    fs.mkdirSync(path.dirname(outJsonAbs), { recursive: true });
    fs.writeFileSync(outJsonAbs, JSON.stringify(JSON.parse(measured), null, 2));
    console.log(`[fidelity-capture] saved ${job.outJson}`);

    if (job.outImage) {
      const shot = (await send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 86,
      })) as { data: string };
      const outImgAbs = path.resolve(process.cwd(), job.outImage);
      fs.mkdirSync(path.dirname(outImgAbs), { recursive: true });
      fs.writeFileSync(outImgAbs, Buffer.from(shot.data, "base64"));
      console.log(`[fidelity-capture] saved ${job.outImage}`);
    }

    const totalIssues =
      health.consoleErrors.length + health.exceptions.length + health.failedRequests.length;
    if (totalIssues > 0) {
      console.warn("[fidelity-capture] runtime warnings:", JSON.stringify(health));
    }
  });
}

const jobFile = process.argv[2];
if (!jobFile) {
  console.error("Usage: tsx scripts/fidelity-capture.ts <job.json>");
  process.exit(2);
}
runCapture(jobFile).catch((err) => {
  console.error("[fidelity-capture] ERROR:", err);
  process.exit(1);
});
