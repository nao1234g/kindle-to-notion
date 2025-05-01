"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/convert.ts
/**
 * 既存の My Clippings.txt を簡易パースして
 * resources/KindleHighlights.json へ書き出すワンショットスクリプト
 *
 * 1. npm run convert   で実行
 * 2. 生成された JSON を commit / push
 *
 * 読み込み：resources/My Clippings.txt
 * 書き込み：resources/KindleHighlights.json
 */
const common_1 = require("../src/utils/common");
const path_1 = require("path");
/** TXT → Block 配列 */
const rawBlocks = (0, common_1.readTxt)('resources/My Clippings.txt')
    // 区切り行 “==========” で分割
    .split(/=+\r?\n/)
    .map(block => block.trim())
    .filter(Boolean);
/** Block → Clipping オブジェクト配列 */
const clippings = rawBlocks.map(block => {
    // 1 行目: 「タイトル, 著者」 / 2 行目以降: 本文
    const [head, ...body] = block.split(/\r?\n/);
    // タイトルだけで充分なら著者は破棄
    const [title] = head.split(',');
    return {
        title: title.trim(),
        highlight: body.join('\n').trim(),
    };
});
// JSON ファイルへ書き出し
(0, common_1.writeJson)((0, path_1.resolve)('resources/KindleHighlights.json'), clippings);
console.log(`✅ Converted ${clippings.length} clippings → resources/KindleHighlights.json`);
