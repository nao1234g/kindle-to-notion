/*  src/utils/common.ts
 *  -----------------------------------------------------
 *  共通ユーティリティ
 *    - TXT / JSON の読み書き
 *    - Kindle ハイライト同期サポート関数
 * -----------------------------------------------------
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { resolve, dirname } from "path";

/* ===== 型定義 ===================================== */

export type Clipping = {
  id?: string;          // Notion ページ ID 等（同期後に付与）
  title: string;        // 書籍タイトル
  author?: string;      // 著者名
  highlight: string;    // ハイライト本文
  synced?: boolean;     // Notion 同期済みフラグ
};

/* ===== 基本 I/O ヘルパー =========================== */

/** TXT を UTF-8 文字列で読む */
export const readTxt = (file: string): string =>
  readFileSync(resolve(file), "utf-8");

/** JSON をパースして型付きで返す */
export const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(resolve(file), "utf-8"));

/**
 * 拡張子に応じて自動判別で読む
 * - .json → JSON.parse
 * - それ以外 → 生テキスト
 */
export const readAuto = (file: string): string | object =>
  file.endsWith(".json") ? readJson(file) : readTxt(file);

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

/* ===== アプリ固有ヘルパー ========================== */

/**
 * ファイルに書き込む汎用ラッパー
 *   - 拡張子 .json → JSON で保存
 *   - それ以外     → 文字列で保存
 */
export const writeToFile = (file: string, data: unknown): void => {
  file.endsWith(".json")
    ? writeJson(file, data)
    : writeTxt(file, String(data));
};

/** 汎用読み込みラッパー（型パラメータで返却型を指定） */
export const readFromFile = <T = unknown>(file: string): T =>
  (file.endsWith(".json") ? readJson<T>(file) : (readTxt(file) as unknown as T));

/**
 * Notion へ同期済みフラグを更新
 * @param file  対象 JSON ファイル
 * @param id    更新対象クリッピングの id
 */
export const updateSync = (file: string, id: string): void => {
  const clips = readJson<Clipping[]>(file);
  const idx = clips.findIndex((c) => c.id === id);
  if (idx >= 0) {
    clips[idx].synced = true;
    writeJson(file, clips);
  }
};

/**
 * 同期されていないハイライトを抽出
 * @param file KindleHighlights.json のパス
 */
export const getUnsyncedHighlights = (file: string): Clipping[] =>
  readJson<Clipping[]>(file).filter((c) => !c.synced);

/**
 * 著者名を「名 姓」へ整形
 * 例) "Fujita, Shin" → "Shin Fujita"
 */
export const formatAuthorName = (raw: string = ""): string => {
  const parts = raw.split(",").map((s) => s.trim());
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : raw.trim();
};
