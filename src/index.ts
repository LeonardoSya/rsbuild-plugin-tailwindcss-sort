import type { RsbuildPlugin } from '@rsbuild/core';
import { transformTailwindcssClassOrder } from './transform.js';

export const RsbuildPluginTailwindcssSort = (): RsbuildPlugin => ({
  name: 'rsbuild-plugin-tailwindcss-sort',

  // setup作为插件逻辑的主入口  api对象包含了各类hook和工具函数
  setup(api) {
    api.transform({ test: /\.(jsx|tsx)$/ }, ({ code }) =>
      transformTailwindcssClassOrder(code),
    );

    // 在开发构建完成时
    api.onDevCompileDone(({ isFirstCompile }) => {
      if (isFirstCompile)
        console.log(
          '🎨 Tailwind CSS 类名已被 rsbuild-plugin-tailwindcss-sort 排序',
        );
    });

    // 在生产构建完成时
    api.onAfterBuild(() => {
      console.log(
        '🎨 Tailwind CSS 类名已被 rsbuild-plugin-tailwindcss-sort 排序',
      );
    });
  },
});

export default RsbuildPluginTailwindcssSort;
