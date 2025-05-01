/* -------------------------------------------------
 * utils バレルファイル
 *   - src/utils/common.ts      : I/O & Kindle ハイライト用ヘルパー
 *   - src/utils/notion.ts      : Notion API ブロック生成ヘルパー
 * ------------------------------------------------- */

/* ---------- common 由来 ---------- */
export {
  // 基本 I/O
  readTxt,
  readJson,
  readAuto,
  writeTxt,
  writeJson,

  // 高レベル I/O ラッパー
  writeToFile,
  readFromFile,

  // Kindle ハイライト同期ユーティリティ
  updateSync,
  getUnsyncedHighlights,
  formatAuthorName,   // ★ parser で使用するため必ず再エクスポート
} from "./common";

/* ---------- Notion ブロック生成 ---------- */
export {
  makeBlocks,
  makeHighlightsBlocks,
  makePageProperties,
} from "./notion";
