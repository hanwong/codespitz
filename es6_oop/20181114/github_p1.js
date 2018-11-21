const Github = class {
  constructor (id, repo) {
    this._base = `https://api.github.com/repos/${id}/${repo}/contents`;
  }
  load (path) {
    if (!this._parser) return;
    const id = 'callback' + Github._id++;
    const f = Github[id] = ({data: {content}}) => {
      delete Github[id];
      document.head.removeChild(s);
      this._parser(content);
    };
    const s = document.createElement('sciprt');
    s.src = `${this._base + path}?callback=Github. ${id}`;
    document.head.appendChild(s);
  }
  setParser(v) {
    this._parser = v;
  }
};

Github._id = 0;

const ImageLoader = class {
  constructor (target) {
    const el = document.querySelector(target)
    return v => el.src = 'data:text/plain;base64,' + v;
  }
}

const mdLoader = class {
  constructor (target) {
    const el = document.querySelector(target)
    return v => el.innerHtml = parseMD(v);
  }
}
