// src/models/parser.ts
// --------------------------------------------------
import _ from "lodash";
import { Clipping, GroupedClipping } from "../interfaces";
import { writeToFile, readAuto, formatAuthorName } from "../utils";

/**
 * KindleHighlights.json を読み込み、
 * 書籍ごとにハイライトをグループ化するパーサ
 */
export class Parser {
  /** 読み込み元ファイル（パスは utils.readAuto 基準） */
  private filePath = "resources/KindleHighlights.json";

  private clippings: Clipping[] = [];
  private groupedClippings: GroupedClipping[] = [];

  /* 1) JSON を読み込んで this.clippings へ格納 */
  private loadClippings = () => {
    console.log("📥 Loading clippings from JSON");
    const raw = readAuto<Partial<Clipping>[]>(this.filePath);

    // 型が Partial の場合に備えて穴埋め
    this.clippings = raw.map((item, idx) => ({
      title: item.title ?? `Untitled-${idx}`,
      author: formatAuthorName(item.author ?? "Unknown"),
      highlight: item.highlight ?? "",
    }));
  };

  /* 2) 書籍タイトルでグループ化し、重複ハイライトを除去 */
  private groupClippings = () => {
    console.log("➕ Grouping clippings");

    this.groupedClippings = _.chain(this.clippings)
      .groupBy("title")
      .map((clippings, title) => ({
        title,
        author: clippings[0].author,
        highlights: [...new Set(clippings.map((c) => c.highlight))], // 重複排除
      }))
      .value();
  };

  /* 3) 結果を data/grouped-clippings.json に書き出し */
  private exportGroupedClippings = () => {
    writeToFile(this.groupedClippings, "grouped-clippings.json", "data");
  };

  /* 4) コンソールにサマリを出力（任意） */
  private printStats = () => {
    console.log("\n💹 Stats for Grouped Clippings");
    this.groupedClippings.forEach((g) => {
      console.log("--------------------------------------");
      console.log(`📝 Title: ${g.title}`);
      console.log(`🙋 Author: ${g.author}`);
      console.log(`💯 Highlights Count: ${g.highlights.length}`);
    });
    console.log("--------------------------------------");
  };

  /* === 外部公開メソッド === */
  /** 一連の処理を実行し、グループ化結果を返す */
  processClippings = (): GroupedClipping[] => {
    this.loadClippings();
    this.groupClippings();
    this.exportGroupedClippings();
    this.printStats();
    return this.groupedClippings;
  };
}
// --------------------------------------------------
