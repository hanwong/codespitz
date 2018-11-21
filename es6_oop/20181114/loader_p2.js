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
  constructor () {
    this._repo = new Map;
    this._router = new Map;
  }
  laod (key, v) {
    if(!this._repo.has(key)) return;
    this._git = new Github(...this._repo.get(key));
    const ext = this._v.split('.').pop();
    if(!this._router.has(key)) return;
    this._git.setParser(...this._router.get(key)[ext]);
    this._git.laod(v);
  }
  addRouter (key, ext, f, ...arg) {
    let extObj = {}
    ext.split(',').forEach(v=> extObj[v] = [f, ...arg]);
    this._router.set(key, extObj)
  }
  addRepo (key, id, repo) {
    this._repo.set(key, [id, repo]);
  }
};
