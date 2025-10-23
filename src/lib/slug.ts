/**
 * Generate a unique slug from name, city, and a random number
 * Example: "natalia-tbilisi-8x4k"
 */
export function generateSlug(name: string, city: string): string {
  // Convert to lowercase and remove special characters
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const cleanCity = city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Generate a random 8-character alphanumeric string for better uniqueness
  const randomStr = Math.random().toString(36).substring(2, 10);
  
  return `${cleanName}-${cleanCity}-${randomStr}`;
}

/**
 * Validate if a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
