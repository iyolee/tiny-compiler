export function codeGenerator(node) {
  switch (node.type) {
    // 针对于Program，处理其中的body属性，依次再递归调用codeGenerator
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');
    // 针对于ExpressionStatement，处理其中的expression属性，再后面添加一个分号
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) +
        ';'
      );
    // 针对于CallExpression，左侧处理callee，括号中处理arguments数组
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );
    // 直接返回name
    case 'Identifier':
      return node.name;
    // 返回数字的value
    case 'NumberLiteral':
      return node.value;
    // 字符串类型添加双引号
    case 'StringLiteral':
      return '"' + node.value + '"';
    // 容错处理
    default:
      throw new TypeError(node.type);
  }
}