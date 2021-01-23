import { tokenizer } from './tokenizer';
import { parser } from './parser';
import { transformer } from './transformer';
import { codeGenerator } from './codeGenerator';

function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);
  return output;
}

console.log(compiler('(add 2 (subtract 4 2))'));