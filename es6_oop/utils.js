const sel = (v, el = document) => el.querySelector(v);
const attr = (el, ...attr) =>(attr.some((k, i)=>{
    if(i % 2) return;
    const v = attr[i + 1];
    if(typeof el[k] == 'function') el[k](...(Array.isArray(v)? v :[v]));
    else if(k[0] == '@') el.style[k.substr(1)] = v;
    else el[k] = v;
}), el);
const el = (tag, ...arg)=>attr(typeof tag == 'string' ? document.createElement(tag) : tag, ...arg);
const prepend =(node, ...el)=>(el.reverse().forEach(v=>node.insertBefore(v, node.firstChild)), node);
const append =(node, ...el)=>(el.forEach(v=>node.appendChild(v)), node);

const err = (v = 'invalid') => { throw v; };
const override = _ => err('override');
const prop = (t, p) => Object.assign(t, p);
const is = (t, p) => t instanceof p;

const d64 = v => decodeURIComponent(atob(v).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));