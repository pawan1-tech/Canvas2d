/**
 * Utility functions for Firestore data handling
 */

/**
 * Cleans data for Firestore by removing undefined values and handling nested arrays
 * Firestore doesn't support nested arrays, so we convert them to objects with indexed keys
 * 
 * @param obj - The object to clean
 * @returns Cleaned object safe for Firestore
 * 
 * @example
 * // Nested arrays get converted to objects
 * cleanForFirestore([[1,2], [3,4]]) 
 * // Returns: {item_0: [1,2], item_1: [3,4]}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  
  if (Array.isArray(obj)) {
    // Convert nested arrays to objects with indices as keys
    const hasNestedArrays = obj.some((item: unknown) => Array.isArray(item));
    if (hasNestedArrays) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cleaned: Record<string, any> = {};
      obj.forEach((item: unknown, index: number) => {
        cleaned[`item_${index}`] = cleanForFirestore(item);
      });
      return cleaned;
    }
    return obj.map(cleanForFirestore);
  }
  
  if (typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: Record<string, any> = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = cleanForFirestore(obj[key]);
      }
    }
    return cleaned;
  }
  
  return obj;
}
