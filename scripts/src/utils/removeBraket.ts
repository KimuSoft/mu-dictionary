export default function removeBraket(str: string) {
  return str
    .replace(/\([^)]+\)/g, "")
    .replace(/\[[^\]]+]/g, "")
    .trim();
}
