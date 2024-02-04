/**
 * 行を複製＋インクリメント
 */
function copyRow() {
    var table = document.getElementById("calcTable");
    var lastRow = table.rows[table.rows.length - 1];
    var newRow = lastRow.cloneNode(true);
  
    // 新しい行の連番を計算
    var newRowNum = table.rows.length;
  
    // クラス名内の連番をインクリメントするために正規表現を使用
    // 例: "class_1" -> "class_2"
    newRow.className = newRow.className.replace(/(\d+)$/, function(match, number) {
      return parseInt(number, 10) + 1;
    });
  
    // オプション: 新しい行内の特定の要素の属性を更新
    Array.from(newRow.querySelectorAll("[id],[name]")).forEach(function(element) {
      // IDの更新
      if (element.id) {
        element.id = element.id.replace(/(\d+)$/, function(match, number) {
          return parseInt(number, 10) + 1;
        });
      }
      // Nameの更新
      if (element.name) {
        element.name = element.name.replace(/(\d+)$/, function(match, number) {
          return parseInt(number, 10) + 1;
        });
      }
    });
  
    // テーブルに新しい行を追加
    var tableBody = document.getElementById("calcItem");
    tableBody.appendChild(newRow);
}