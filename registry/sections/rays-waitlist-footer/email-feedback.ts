const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const COMMON_PROVIDERS = new Set(
  "gmail.googlemail.icloud.me.mac.hotmail.outlook.live.msn.yahoo.ymail.proton.protonmail.pm.gmx.aol.mail.web.t-online.zoho.fastmail.hey.seznam.wp.o2.orange.free.bluewin.libero.freenet.posteo.tutanota.tuta.email.inbox".split(
    ".",
  ),
);

export const FEEDBACK_POOLS = {
  noat: ["that's not an email yet.", "keep going."],
  atonly: ["@ what, exactly?", "and then?"],
  nodot: ["you forgot the .something.", "almost. give it a dot."],
  space: ["emails don't have spaces."],
  multiat: ["one @ is plenty."],
  mash: ["nice try.", "that's just mashing."],
  invalid: ["that's not quite an email.", "close, but no."],
} as const;

export type FeedbackPool = keyof typeof FEEDBACK_POOLS;

export const IDLE_NUDGES = ["we're listening.", "take your time.", "no rush."];

const LOCAL_CHARS = /[a-z0-9._%+-]/i;
const DOMAIN_CHARS = /[a-z0-9.-]/i;

export type EmailVerdict =
  | { kind: "hidden" }
  | { kind: "line"; text: string }
  | { kind: "pool"; pool: FeedbackPool }
  | { kind: "quip"; text: string }
  | { kind: "enter" };

function illegalCharMessage(value: string): string | null {
  const at = value.indexOf("@");
  const local = at === -1 ? value : value.slice(0, at);
  const domain = at === -1 ? "" : value.slice(at + 1);
  const firstBad = (text: string, allowed: RegExp): string | null => {
    for (const ch of text) if (!allowed.test(ch)) return ch;
    return null;
  };
  const bad = firstBad(local, LOCAL_CHARS) ?? firstBad(domain, DOMAIN_CHARS);
  if (!bad) return null;
  if (bad === "'" || bad === '"' || bad === "`") return "no quotes in an email.";
  if (bad === ",") return "commas are for lists.";
  if (bad === "/" || bad === "\\") return "this isn't a url.";
  if (bad === "!") return "calm down.";
  return `emails don't do "${bad}".`;
}

function looksLikeMashing(value: string): boolean {
  if (value.length < 6) return false;
  const lower = value.toLowerCase();
  if (new Set(lower).size / lower.length <= 0.34) return true;
  const half = Math.floor(lower.length / 2);
  if (lower.length % 2 === 0 && lower.slice(0, half) === lower.slice(half)) return true;
  return ["qwertyuiop", "asdfghjkl", "zxcvbnm", "0123456789"].some((row) => {
    for (let i = 0; i + 6 <= row.length; i++) if (lower.includes(row.slice(i, i + 6))) return true;
    return false;
  });
}

export function checkEmail(input: string): EmailVerdict {
  const value = input.trim();
  if (!value) return { kind: "hidden" };
  if (/^(https?:\/\/|www\.)/i.test(value)) return { kind: "line", text: "that's a website, not an email." };
  if (/\s/.test(value)) return { kind: "pool", pool: "space" };
  if (/\p{Extended_Pictographic}/u.test(value)) return { kind: "line", text: "an emoji. in an email. no." };
  const atCount = (value.match(/@/g) ?? []).length;
  if (atCount > 1) return { kind: "pool", pool: "multiat" };
  const illegal = illegalCharMessage(value);
  if (illegal) return { kind: "line", text: illegal };
  if (atCount === 0) return { kind: "pool", pool: looksLikeMashing(value) ? "mash" : "noat" };
  const [local, domain] = value.split("@");
  if (!local) return { kind: "line", text: "nothing before the @?" };
  if (!domain) return { kind: "pool", pool: "atonly" };
  if (value.includes("..")) return { kind: "line", text: "one dot at a time." };
  if (local.startsWith(".") || local.endsWith(".")) return { kind: "line", text: "dots go between things." };
  if (!/\.[a-z]{2,}$/i.test(domain)) return { kind: "pool", pool: "nodot" };
  if (!EMAIL_PATTERN.test(value)) {
    return value.length > 60
      ? { kind: "line", text: "that's a novel, not an email." }
      : { kind: "pool", pool: "invalid" };
  }
  if (value.toLowerCase().includes("test")) return { kind: "quip", text: "did we hire QA?" };
  if (COMMON_PROVIDERS.has(domain.split(".")[0].toLowerCase())) return { kind: "enter" };
  return { kind: "quip", text: "ooh, a custom domain. fancy." };
}
