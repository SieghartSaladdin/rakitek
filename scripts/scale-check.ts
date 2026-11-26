import fs from "node:fs";
import path from "node:path";

// Pengingat skala: dicetak oleh `npm run sync` saat salah satu ambang di docs/rencana-skala.md
// terlewati. Tidak menggagalkan apa pun; tujuannya supaya pekerjaan skala dikerjakan tepat waktu.

const MB = 1024 * 1024;

function dirSize(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(full) : fs.statSync(full).size;
  }
  return total;
}

function fileSize(file: string): number {
  return fs.existsSync(file) ? fs.statSync(file).size : 0;
}

export const SCALE_THRESHOLDS = {
  fidelityMb: 300,
  componentCount: 300,
  sourcesJsonMb: 10,
  catalogMb: 5,
};

export function checkScale(root: string, componentCount: number): string[] {
  const t = SCALE_THRESHOLDS;
  const notes: string[] = [];
  const fidelityMb = dirSize(path.join(root, "fidelity")) / MB;
  const sourcesMb = fileSize(path.join(root, "apps", "web", "src", "generated", "sources.json")) / MB;
  const catalogMb = fileSize(path.join(root, "registry", ".generated", "catalog.json")) / MB;

  if (fidelityMb >= t.fidelityMb)
    notes.push(`fidelity/ ${fidelityMb.toFixed(0)} MB (ambang ${t.fidelityMb} MB): pindahkan foto bukti ke Git LFS atau storage (langkah A).`);
  if (componentCount >= t.componentCount)
    notes.push(`${componentCount} komponen (ambang ${t.componentCount}): ubah halaman preview jadi dirender saat dibuka, bukan saat build (langkah B).`);
  if (sourcesMb >= t.sourcesJsonMb)
    notes.push(`sources.json ${sourcesMb.toFixed(1)} MB (ambang ${t.sourcesJsonMb} MB): baca kode sumber per komponen saat dibutuhkan (langkah C).`);
  if (catalogMb >= t.catalogMb)
    notes.push(`catalog.json ${catalogMb.toFixed(1)} MB (ambang ${t.catalogMb} MB): pecah indeks atau pindah ke SQLite (langkah D).`);
  return notes;
}

export function printScaleReminders(root: string, componentCount: number) {
  for (const note of checkScale(root, componentCount)) {
    console.warn(`[rakitek skala] ${note} Lihat docs/rencana-skala.md.`);
  }
}
