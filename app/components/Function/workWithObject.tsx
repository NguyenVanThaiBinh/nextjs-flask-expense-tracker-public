export default function isDeepEqualObject(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects =
      typeof val1 === "object" &&
      val1 !== null &&
      typeof val2 === "object" &&
      val2 !== null;

    if (
      typeof val1 !== typeof val2 ||
      (areObjects && !isDeepEqualObject(val1, val2)) ||
      (!areObjects && typeof val2 !== "string" && val1 !== val2) ||
      (typeof val2 === "string" && val1.trim() !== val2.trim())
    ) {
      return false;
    }
  }

  return true;
}
