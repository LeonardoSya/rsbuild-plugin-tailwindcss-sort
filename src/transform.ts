const sortTailwindcssClasses = (classStr: string): string => {
  // 样式按字母顺序排序
  return classStr.trim().split(/\s+/).sort().join(' ')
}


