import * as parser from "@babel/parser"; // 代码解析为ast
import traverse from "@babel/traverse"; // 遍历ast
import generate from "@babel/generator"; // 将ast转回代码
import * as t from "@babel/types"; // 用于ast节点的类型检查和创建

const sortTailwindcssClasses = (classStr: string): string => {
  // 样式按字母顺序排序
  return classStr.trim().split(/\s+/).sort().join(" ");
};

export const transformTailwindcssClassOrder = (code: string): string => {
  // 将源码解析为ast
  const ast = parser.parse(code, {
    sourceType: "module", // 按es模块解析
    plugins: ["jsx", "typescript"], // 支持jsx和ts语法
  });

  // 遍历ast
  traverse(ast, {
    // 当遇到jsx时执行此函数
    JSXAttribute(path: { node: any }) {
      console.log(path);
      const { node } = path;
      // 检查是否是className属性且值为字符串字面量
      if (
        t.isJSXIdentifier(node.name, { name: "className" }) &&
        t.isStringLiteral(node.value)
      ) {
        const original = node.value.value;
        const sorted = sortTailwindcssClasses(original);
        if (original !== sorted) {
          node.value = t.stringLiteral(sorted);
        }
      }
    },
  });

  // 修改后的ast转回代码字符串
  return generate(ast).code;
};
