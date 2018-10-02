const err = v => { throw v; };
const el = tag => document.createElement(tag);

const Task = class{
  constructor(title){
    this.title = title;
    this.isComplete = false;
  }
  toggle(){this.isComplete = !this.isComplete;}
  getInfo(){return {title:this.title, isComplete:this.isComplete};}
  getInstance(v){
    return new Task(v);
  }
};
const taskIns = new Task;

const Folder = class extends Set{
  constructor(title){
    super();
    this.title = title;
  }
  addTask(task){super.add(task);}
  removeTask(task){super.delete(task);}
  getTitle(){return this.title;}
  getTasks(){return [...super.values()];}
  add(){}
  delete(){}
  values(){}
  getInstance(v){
    return new Folder(v);
  }
};
const folderIns = new Folder;

const App = class extends Set{
  constructor(renderer){
    super();
    this.renderer = renderer;
  }
  addFolder(folder){super.add(folder);}
  removeFolder(folder){super.delete(folder);}
  getFolders(){return [...super.values()];}
  add(){}
  delete(){}
  values(){}
};

const Renderer = class{
  constructor(app){
    this.app = app;
  }
  render(){this._render();}
  _render(){throw 1;}
};

const DomRenderer = class extends Renderer{
  constructor(parent, app){
    super(app);
    const section = parent.appendChild(el('section'));
    section.innerHTML = '<nav><input/><ul></ul></nav><section><input/><ul></ul></section>';
    section.querySelector('nav').style.cssText = 'float:left; width: 200px; border-right: 1px solid #000;';
    section.querySelector('section').style.cssText = 'margin-left: 210px;';
    const [f, t] = section.querySelectorAll('input');
    f.addEventListener('keyup', e =>{
      if(e.keyCode != 13) return;
      const v = e.target.value.trim();
      e.target.value = '';
      if(!v) return;
      app.addFolder(folderIns.getInstance(v));
      this.render();
    });
    t.addEventListener('keyup', e =>{
      if(e.keyCode != 13 || !this.current) return;
      const v = e.target.value.trim();
      e.target.value = '';
      if(!v) return;
      this.current.addTask(taskIns.getInstance(v));
      this.render();
    });
    const [folder, task] = section.querySelectorAll('ul');
    this.folder = folder, this.task = task;
  }
  _render(){
    const folders = this.app.getFolders();
    if(!folders.length) return;
    if(!this.current) this.current = folders[0];
    this.folder.innerHTML = '';
    folders.forEach(f=>{
      const li = el('li');
      li.innerHTML = f.getTitle();
      li.style.color = this.current == f ? '#000' : '#777';
      li.addEventListener('click', e =>{this.current = f, this.render();});
      this.folder.appendChild(li);
    });
    if(!this.current) return;
    this.task.innerHTML = '';
    this.current.getTasks().forEach(t=>{
      const li = el('li'), {title, isComplete} = t.getInfo();
      li.innerHTML = (isComplete ? 'completed ' : 'process ') + title;
      li.addEventListener('click', e =>{t.toggle(), this.render();});
      this.task.appendChild(li);
    });
  }
};

const todo = new DomRenderer(document.body, new App());