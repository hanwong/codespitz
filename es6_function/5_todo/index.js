const err = v => { throw v; };
const el = tag => document.createElement(tag);

const Task = class {
  constructor(title) {
    this.title = title;
    this.isCompleted = false;
  }
  toggle(){
    this.isCompleted = !this.isCompleted;
  }
  getInfo(){
    return {title:this.title, isCompleted:this.isCompleted};
  }
};

const Folder = class {
  constructor(title) {
    this.title = title;
    this.tasks = new Set();
  }
  addTask(task) {
    if (!task instanceof Task) err('invalid task');
    this.tasks.add(task);
  }
  removeTask(task) {
    if (!task instanceof Task) err('invalid task');
    this.tasks.delete(task);
  }
  getTitle() {
    return this.title;
  }
  getTasks() {
    return [...this.tasks.values()];
  }
};


// let isOkay = false;
// const task = new Task('task1');
// const folder = new Folder('floder1');

// isOkay = folder.getTasks().length === 0;
// console.log('test1', isOkay);

// folder.addTask(task);
// isOkay = folder.getTasks().length === 1;
// console.log('test2', isOkay);


const App = class { 
  constructor(renderer) {
    this.folders = new Set();
    this.renderer = renderer;
  }
  addFolder(folder) {
    if (!folder instanceof Folder) err('invalid folder');
    this.folders.add(folder);
  }
  removeFolder(folder) {
    if (!folder instanceof Folder) err('invalid folder');
    this.folders.delete(folder);
  }
  getFolders(){
    return [...this.folders.values()];
  }
};

const Renderer = class {
  constructor(app) {
    this.app = app;
  }
  render() {
    this._render();
  }
  _render() {
    err('must be overrideed');
  }
};


const DomRenderer = class extends Renderer {
  constructor(parent, app) {
    super(app);
    this.el = parent.appendChild(el('section'));
    this.el.innerHTML = `
      <nav>
        <input type="text">
        <ul></ul>
      </nav>
      <section>
        <header>
          <h2></h2>
          <input type="text">
        </header>
        <ul></ul>
      </section>
    `;
    this.el.querySelector('nav').style.cssText = 'float:left; width: 200px; border-right: 1px solid #000;';
    this.el.querySelector('section').style.cssText = 'margin-left: 210px;';
    const ul = this.el.querySelectorAll('ul');
    this.folder = ul[0];
    this.currentFolder = null;
    this.task = ul[1];
    const input = this.el.querySelectorAll('input');

    input[0].addEventListener('keyup', e => {
      if (e.keyCode !== 13) return;
      const v = e.target.value.trim();
      if (!v) return;
      const folder = new Folder(v);
      this.app.addFolder(folder);
      e.target.value = '';
      this.render();
    });

    input[1].addEventListener('keyup', e => {
      if (e.keyCode !== 13) return;
      const v = e.target.value.trim();
      if (!v || !this.currentFolder) return;
      const task = new Task(v);
      this.currentFolder.addTask(task);
      e.target.value = '';
      this.render();
    })
  }

  _render() {
    const folders = this.app.getFolders();
    if (!this.currentFolder) this.currentFolder = folders[0];
    
    this.folder.innerHTML = '';
    folders.forEach(f => {
      const li = el('li');
      li.innerHTML = f.getTitle();
      li.style.cssText = 'font-size: ' + (this.currentFolder === f ? '20px': '16px');
      li.addEventListener('click', e => {
        this.currentFolder = f;
        this.render();
      })
      this.folder.appendChild(li); 
    });

    if (!this.currentFolder) return;
    this.task.innerHTML = '';
    this.currentFolder.getTasks().forEach(t => {
      const li = el('li');
      const { title, isCompleted } = t.getInfo();
      li.innerHTML = (isCompleted ? 'Completed ' : 'Process ') + title;
      li.addEventListener('click', e => {
        t.toggle();
        this.render();
      })
      this.task.appendChild(li); 
    })
  }
};

new DomRenderer(document.body, new App());