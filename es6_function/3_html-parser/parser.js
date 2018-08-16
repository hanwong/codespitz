const textNode = (text, target) => {
  if (text.length) target.push({type: 'TEXT', text})
  return '';
}

const elementNode = (input, cursor, text, stack, stacks) => {
  const char = input[cursor++];
  let isBreak = false;
  if (char === '<') {
    text = textNode(text, stack.tag.children);
    if (input[cursor++] !== '/') {
      let name = input.substring(cursor-1, cursor = input.indexOf('>', cursor));
      const isClose = input[cursor] === '/';
      if(isClose) name = name.substr(0, name.length -1);
      const tag = {name, type:'NODE', children:[]};
      cursor++;
      stack.tag.children.push(tag);
      if(!isClose) { 
        stacks.push({tag, back:stack});
        isBreak = true;
      }
    } else if (stack.tag.name === input.substring(cursor, cursor = input.indexOf('>', cursor))) {
      stack = stack.back;
      cursor++;
    }
  } else text += char;
  return {cursor, text, isBreak, stack};
}
  

const parser = input => {
  const result = {tag:{type: 'ROOT', children: []}}, stacks = [];
  let cursor = 0, stack = result;
  do {
    let text = '';
    while (cursor < input.length) {
      const v = elementNode(input, cursor, text, stack, stacks);
      ({cursor, text, stack} = v);
      // console.log(cursor, text, stack)
      if(v.isBreak) break;
    }
  } while (stack = stacks.pop())
  return result.tag.children;
}

