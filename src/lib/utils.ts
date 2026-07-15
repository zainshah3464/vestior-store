export function parseProductImages(images: unknown): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (trimmed === '' || trimmed === 'null') return [];
    // Handle PostgreSQL array literal: {url1,url2}
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    }
    // Try JSON array
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      // If JSON but not array (e.g., an object or single string), wrap it
      return [typeof parsed === 'string' ? parsed : trimmed];
    } catch {
      // Single URL without brackets
      return [trimmed];
    }
  }
  return [];
}