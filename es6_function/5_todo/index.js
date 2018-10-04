const err = v => { throw v; };
const el = tag => document.createElement(tag);

// 객체 지향은 타협하지 않고 제 역할과 책임은 제역할과 책임만 수행해야 한다.
// 객체가 자기 역할만 출실히 수행해야 한다.

const Task = class {
  static load (json) {
    const task = new Task(json.title, json.isCompleted);
    return task;
  }
  static get(title){return new Task(title);}
  toJSON() {
    return this.getInfo();
  }
  constructor(title) {
    this.title = title;
    this.isCompleted = false;
  }
  setTitle(title) {
    this.title = title;
  }
  toggle(){
    this.isCompleted = !this.isCompleted;
  }
  getInfo(){
    return {title:this.title, isCompleted:this.isCompleted};
  }
};

const Folder = class extends Set {
  // 생성에 대한 지식을 바깥으로 노출하지 않기 위해 존재하는 팩토리 패턴
  static load(json) {
    const folder = new Folder(json.title);
    json.tasks.forEach(t => {
      folder.addTask(Task.load(t));
    });
    return folder;
  }
  static get(title){return new Folder(title);}
  toJSON() {
    return {title: this.title, tasks: this.getTasks()};
  }
  constructor(title) {
    super();
    this.title = title;
  }
  // moveTask(task, folderSrc, folderDest) {} Src가 필요 없어짐
  // 의존성이 늘어나면 잘못된 위치에 들어간것이다.
  moveTask(task, folderSrc) {
    // remove(src) and move(자신)

    // 화이트 리스트 만들기
    if (super.has(task) || !folderSrc.has(task)) return err('it\'s mine'); // 강력한 조치, 제어 에러, 
    folderSrc.removeTask(task);
    this.addTask(task);
  }
  addTask(task) {
    if (!task instanceof Task) err('invalid task');
    super.add(task);
  }
  removeTask(task) {
    if (!task instanceof Task) err('invalid task');
    super.delete(task);
  }
  getTitle() {
    return this.title;
  }
  getTasks() {
    return [...super.values()];
  }
  // 내적 동질성, 부모걸 쓰느...
  add(){}
  delete(){}
  clear(){}
  value(){}
};


// let isOkay = false;
// const task = new Task('task1');
// const folder = new Folder('floder1');

// isOkay = folder.getTasks().length === 0;
// console.log('test1', isOkay);

// folder.addTask(task);
// isOkay = folder.getTasks().length === 1;
// console.log('test2', isOkay);


const App = class extends Set { 
  static load(json) {
    const app = new App();
    json.forEach(f => {
      app.addFolder(Folder.load(f));
    });
    return app;
  }
  toJSON(){
    // json 파서를 당할때  이렇게 반환해~
    return this.getFolders();
  }
  constructor() {
    super();
  }

  // moveTask(task, folderSrc, folderDest) {}
  addFolder(folder) {
    if (!folder instanceof Folder) err('invalid folder');
    super.add(folder);
  }
  removeFolder(folder) {
    if (!folder instanceof Folder) err('invalid folder');
    super.delete(folder);
  }
  getFolders(){
    return [...super.values()];
  }
  // 내적 동질성, 부모걸 쓰느...
  add(){}
  delete(){}
  clear(){}
  value(){}
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

    const [folder, task] = Array.from(parent.querySelectorAll('ul'));
    const [load, save] = Array.from(parent.querySelectorAll('button'));
    // 어플리케이션의 작성 요령
    // 제일먼저 Create부터 구축한다 , 그 다음 뷰, 그다음 리스트 ...
    save.onclick = e =>{
      localStorage.setItem('todo', JSON.stringify(this.app));
    };
    load.onclick = e => {
      const v = localStorage.getItem('todo');
      if (v) {
        this.app = App.load(JSON.parse(v))
        this.render();
      };
    };
    this.currentFolder = null;
    this.folder = folder;
    this.task = task;
    this.taskEl = [];

    parent.querySelector('nav>input').addEventListener('keyup', e => {
      if (e.keyCode !== 13) return;
      const v = e.target.value.trim();
      if (!v) return;
      const folder = Folder.get(v);
      this.app.addFolder(folder);
      e.target.value = '';
      this.render();
    });

    parent.querySelector('header>input').addEventListener('keyup', e => {
      if (e.keyCode !== 13) return;
      const v = e.target.value.trim();
      if (!v || !this.currentFolder) return;
      const task = Task.get(v);
      this.currentFolder.addTask(task);
      e.target.value = '';
      this.render();
    })
  }

  _render() {
    const folders = this.app.getFolders();
    let moveTask, tasks;
    if (!this.currentFolder) this.currentFolder = folders[0];
    
    // 증분렌더링 - 기존것이 있으면 쓰는것
    let oldEl = this.folder.firstElementChild, lastEl = null;

    folders.forEach(f => {
      let li;
      if(oldEl) {
        li = oldEl;
        oldEl = oldEl.nextElementSibling;
      } else {
        li = el('li');
        this.folder.appendChild(li); 
        oldEl = null;
      }
      lastEl = li;

      li.innerHTML = f.getTitle();
      li.style.cssText = 'font-size: ' + (this.currentFolder === f ? '20px': '16px');
      li.onclick = () =>{
        this.currentFolder = f;
        this.render();
      };
      li.ondrop = e =>{
        e.preventDefault();
        f.moveTask(moveTask, this.currentFolder);
        this.render();
      };
      li.ondragover = e =>{
        e.preventDefault();
      };
      
    });
    if(lastEl) while(oldEl=lastEl.nextElementSibling){
      this.folder.removeChild(oldEl);
    }

    if (!this.currentFolder) return;

    tasks = this.currentFolder.getTasks();
    if(tasks.length === 0) {
      while(oldEl=this.task.firstElementChild){
        this.task.removeChild(oldEl);
        // 다버려지는데 재활용할 수 없나? 
        // 풀링
        this.taskEl.push(oldEl);
      }
    } else {
      oldEl = this.task.firstElementChild, lastEl = null;
  
      tasks.forEach(t => {
        let li;
        if(oldEl) {
          li = oldEl;
          oldEl = oldEl.nextElementSibling;
        } else {
          li = el('li');
          this.task.appendChild(li); 
          oldEl = null;
        }
        lastEl = li;
  
        const { title, isCompleted } = t.getInfo();
        li.setAttribute('draggable', true);
        li.innerHTML = (isCompleted ? 'Completed ' : 'Process ') + title;
        li.onclick = e =>{
          // e.preventDefault();
          t.toggle();
          this.render();
        };
        li.ondragstart = e =>{
          // 객체지향은 메모리 ~
          // e.preventDefault();
          moveTask = t;
        };
        
      });
      if(lastEl) while(oldEl=lastEl.nextElementSibling){
        this.task.removeChild(oldEl);
        this.taskEl.push(oldEl);
      }
    }
  }
};

new DomRenderer(document.querySelector('main'), new App());