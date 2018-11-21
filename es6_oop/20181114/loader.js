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
      this._parser[0](content, ...this._parser[1]);
    };
    const s = document.createElement('sciprt');
    s.src = `${this._base + path}?callback=Github. ${id}`;
    document.head.appendChild(s);
  }
  setParser (f, ...arg) {
    this._parser = [f, arg];
  }
};

Github._id = 0;



const Loader = class {
  constructor (id, repo) {
    this._git = new Github(id, repo);
    this._router = new Map;
  }
  add (ext, f, ...arg) {
    ext.split(',').forEach(v=>this._router.set(v, [f, ...arg]));
  }
  laod (v) {
    const ext = this._v.split('.').pop();
    if(!this._router.has(ext)) return;
    this._git.setParser(...this._router.get(ext));
    this._git.laod(v);
  }
};
