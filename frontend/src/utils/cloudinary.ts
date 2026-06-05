export const getOptimizedUrl = (url: string, width: number): string => {
  return url.replace('/image/upload/', `/image/upload/w_${width},q_auto,f_auto/`);
};
