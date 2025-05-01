/*  src/utils/common.ts
 *  共通 I/O ヘルパー
 *  -----------------------------------------------------
 *  - resources/KindleHighlights.json             ← JSON 形式
 *  - resources/My Clippings.txt (旧)             ← TXT 形式
 *  - data/ 以下に各種キャッシュを書き出し
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync
} from 'fs';
import { resolve, dirname } from 'path';

/* ---------- ファイル読み込み ---------- */

/** TXT を UTF-8 文字列で読む */
export const readTxt = (file: string): string =>
  readFileSync(resolve(file), 'utf-8');

/** JSON をパースして型付きで返す */
export const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(resolve(file), 'utf-8'));

/**
 * 拡張子に応じて自動判別で読む
 * - .json → JSON.parse
 * - それ以外 → 生テキスト
 */
export const readAuto = (file: string): string | object =>
  file.endsWith('.json') ? readJson(file) : readTxt(file);

/* ---------- ファイル書き込み ---------- */

/** 親フォルダが無ければ先に作成して書き込む */
function ensureWrite(file: string, data: string) {
  const abs = resolve(file);
  const dir = dirname(abs);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(abs, data);
}

/** 任意のデータを JSON.stringify して保存 */
export const writeJson = (file: string, data: unknown): void => {
  ensureWrite(file, JSON.stringify(data, null, 2));
};

/** 文字列をそのまま保存 */
export const writeTxt = (file: string, data: string): void => {
  ensureWrite(file, data);
};
