/* -------------------------------------------------
 * utils バレルファイル
 *  - utils/common.ts で定義した I/O 系ヘルパーを再エクスポート
 *  - utils/notion.ts で定義した Notion API 用ビルダーを再エクスポート
 * ------------------------------------------------- */

// ---------- common ヘルパー ----------
export {
  /* 既存ロジック */
  writeToFile,
  readFromFile,
  updateSync,
  getUnsyncedHighlights,
  formatAuthorName,

  /* 追加: TXT / JSON 自動読み書き関連 */
  readTxt,
  readJson,
  readAuto,
  writeJson,
  writeTxt,
} from "./common";

// ---------- Notion ブロック生成 ----------
export {
  makeBlocks,
  makeHighlightsBlocks,
  makePageProperties,
} from "./notion";
