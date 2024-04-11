/**
 * マインスイーパーセル
 */
class Cell {
  index = 0;
  isMine = false;
  isOpen = false;
  isFlag = false;
  mineCount = 0;
  order = 0;

  /**
   * コンストラクタ
   * @param Number index 
   */
  constructor(index) {
    this.index = index;
    this.order = Math.random();
  }

  /**
   * リセット
   */
  reset() {
    this.clear()
    this.isFlag = false;
  }

  /**
   * 地雷クリア
   */
  clear() {
    this.isMine = false;
    this.isOpen = false;
    this.mineCount = 0;
  }
}

/**
 * マインスイーパー
 */
class Minesweeper {
  width = 0;
  height = 0;
  mineCount = 0;
  openCount = 0;
  flagCount = 0;
  cells = [];
  arounds = [];
  gameover = false;
  gameclear = false;

  /**
   * コンストラクタ
   * @param Number w 
   * @param Number h 
   * @param Number m 
   */
  constructor(w, h, m) {
    this.width = w;
    this.height = h;
    this.mineCount = m;

    // セル初期化
    this.cells = [...Array(this.width * this.height)]
      .map((_, i) => new Cell(i));

    // 周囲セルインデックス差
    this.arounds = [...Array(9)]
      .map((_, i) => (((i / 3) | 0) - 1) * w + ((i % 3 | 0) - 1))
      .filter((i) => i != 4);

    // セル作成
    this.reset();
  }

  /**
   * ゲームリセット
   */
  reset() {
    this.cells.forEach((cell) => cell.reset());
    this.gameover = false;
    this.gameclear = false;
    this.flagCount = 0;
    this.openCount = 0;
  }

  /**
   * セルオープン
   * @param Number index 
   * @returns 
   */
  open(index) {
    // 再配置
    if (!this.openCount) {
      this.#relocate(index);
    }

    var cell = this.cells[index];
    if (this.gameclear || this.gameover || !cell || cell.isOpen || cell.isFlag) {
      return;
    }

    cell.isOpen = true;
    this.openCount++;

    if (cell.isMine) {
      // ゲームオーバー (全オープン)
      this.cells.forEach((cell) => (cell.isOpen = true));
      this.gameover = true;

    } else if (!cell.mineCount) {
      // 周囲オープン
      this.arounds.forEach((d) => {
        if (this.#check(cell.index, d)) {
          this.open(cell.index + d);
        }
      });
    }

    // ゲームクリア
    this.gameclear = this.width * this.height - this.mineCount == this.openCount;
  }

  /**
   * フラグ切り替え
   * @param Number index 
   * @returns 
   */
  toggleFlag(index) {
    var cell = this.cells[index];
    if (this.gameclear || this.gameover || !cell || cell.isOpen) {
      return;
    }

    cell.isFlag = !cell.isFlag;
    this.flagCount += cell.isFlag ? 1 : -1;
  }

  /**
   * 地雷再配置
   * @param Number index 
   */
  #relocate(index) {
    this.cells.forEach((cell) => cell.clear());

    // 除外範囲
    var excludes = this.arounds
        .filter((d) => this.#check(index, d))
        .map((d) => index + d);

    // 地雷ランダム配置
    this.cells
      .concat()
      .filter((cell) => !excludes.includes(cell.index))
      .sort((a, b) => a.order - b.order)
      .slice(0, this.mineCount)
      .forEach((cell) => (cell.isMine = true));

    // 地雷数計算
    for (var cell of this.cells) {
      cell.mineCount = this.arounds
        .reduce((c, d) => c + Number(this.#check(cell.index, d) && (this.cells[cell.index + d]?.isMine || false)), 0);
    }
  }

  /**
   * 領域外判定
   * @param Number index 
   * @param Number delta 
   * @returns 
   */
  #check(index, delta) {
    return Math.abs(((index + delta + this.width) % this.width) - (index % this.width)) < 2;
  }
}
