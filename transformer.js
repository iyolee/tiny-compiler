function traverser(ast, visitor) {
  // 遍历一个数组节点
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }
  // 遍历节点
  function traverseNode(node, parent) {
    let methods = visitor[node.type];
    // 先执行enter方法
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
    switch (node.type) {
      // 一开始节点的类型是Program，去接着解析body字段
      case 'Program':
        traverseArray(node.body, node);
        break;
      // 当节点类型是CallExpression，去解析params字段
      case 'CallExpression':
        traverseArray(node.params, node);
        break;
      // 数字和字符串没有子节点，直接执行enter和exit就好
      case 'NumberLiteral':
      case 'StringLiteral':
        break;
      // 容错处理
      default:
        throw new TypeError(node.type);
    }
    // 后执行exit方法
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
  // 开始从根部遍历
  traverseNode(ast, null);
}

export function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: [],
  };
  // 给节点一个_context,让遍历到子节点时可以push内容到parent._context中
  ast._context = newAst.body;
  traverser(ast, {
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };
        // 让子节点可以push自己到expression.arguments中
        node._context = expression.arguments;
        // 如果父节点不是CallExpression，则外层包裹一层ExpressionStatement
        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }
        parent._context.push(expression);
      }
    },
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      }
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },
  });
  return newAst;
}