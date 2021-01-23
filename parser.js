export function parser(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    // 处理数字
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      }
    }
    // 处理字符串
    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    // 处理括号表达式
    if (
      token.type === 'paren' &&
      token.value === '('
    ) {
      token = tokens[++current];
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };
      token = tokens[++current];
      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }
    throw new TypeError(token.type);
  }
  let ast = {
    type: 'Program',
    body: [],
  };
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}