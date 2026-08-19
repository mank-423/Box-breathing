export function generateColor(word: string) {
  let hash = 0;

  for (let i = 0; i < word.length; i++) {
    hash = word.charCodeAt(i) + ((hash << 5) - hash);
  }

  return `#${((hash & 0xffffff) | 0x1000000)
    .toString(16)
    .slice(1)}`;
}