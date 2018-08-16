const Stage = class {
  init (listener) {
    this.listener = listener;
  }
  clear () {
    this.stage = 0;
    this.next();
  }
  next () {
    if (this.stage++ < Stage.maxStage) {
      this.speed = 500 - 450 * this.stage / Stage.maxStage;
      this.listener();
    }
  }
  [Symbol.toPrimitive] (hint) {
    return `<div>Stage ${this.stage}</div>`;
  }
};
Stage.maxStage = 20;

const Score = class {
  init (listener) {
    this.listener = listener
  }
  clear () {
    this.curr = this.total = 0;
  }
  add (line, stage) {
    const score = parseInt((stage * 5) * (2 ** line));
    this.curr += score, this.total += score;
    this.listener();
  }
  [Symbol.toPrimitive] (hint) {
    return `<div>Score ${this.curr} / ${this.total} </div>`;
  }
};

const Block = class {
  constructor (color, ...blocks) {
    Object.assign(this, {color, blocks, rotate: 0});
  }
  left () {
     if (--this.rotate < 0) this.rotate = 3;
  }
  right () {
     if (++this.rotate > 3) this.rotate = 0;
  }
  getBlock () {
    return this.blocks[this.rotate];
  }
}

const blocks = [
  class extends Block {
    constructor () {
      super('#f8cbad',
        [[1], [1], [1], [1]],
        [[1,1,1,1]],
        [[1], [1], [1], [1]],
        [[1,1,1,1]]);
    }
  },
  class extends Block {
    constructor () {
      super('#ffe699',
        [[0,1,0], [1,1,1]],
        [[1,0], [1,1], [1,0]],
        [[1,1,1], [0,1,0]],
        [[0,1], [1,1] [0,1]]);
    }
  },
  class extends Block {
    constructor () {
      super('#f8cbad');
    }
    getBlock () {
      [[1], [1], [1], [1]],
      [[1,1,1,1]],
      [[1], [1], [1], [1]],
      [[1,1,1,1]]
    }
  },
  class extends Block {
    constructor () {
      super('#f8cbad');
    }
    getBlock () {
      switch(this.rotate) {
        case 0:
          return [[0,1,0], [1,1,1]];
        case 1:
          return [[1,0], [1,1], [1,0]];
        case 2:
          return [[1,1,1], [0,1,0]];
        case 3:
          return [[0,1], [1,1] [0,1]];
      }
    }
  }
]