/**
 * Extract public ID from Cloudinary URL
 * @param imageUrl - The Cloudinary image URL
 * @returns The public ID or null if extraction fails
 */
export const extractPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    // Handle different Cloudinary URL formats
    const url = new URL(imageUrl);
    
    // Extract path and remove file extension
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    if (!fileName) return null;
    
    // Remove file extension
    const publicId = fileName.split('.')[0];
    return publicId || null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

/**
 * Get full public ID for Cloudinary operations
 * @param imageUrl - The Cloudinary image URL
 * @param folder - The folder path (default: 'rathore-motors-banda/vehicles')
 * @returns The full public ID or null if extraction fails
 */
export const getFullPublicId = (
  imageUrl: string, 
  folder: string = 'rathore-motors-banda/vehicles'
): string | null => {
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) return null;
  
  return `${folder}/${publicId}`;
};

/**
 * Validate if a URL is a valid Cloudinary URL
 * @param url - The URL to validate
 * @returns True if it's a valid Cloudinary URL
 */
export const isValidCloudinaryUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('cloudinary.com') || 
           parsedUrl.hostname.includes('res.cloudinary.com');
  } catch {
    return false;
  }
};

/**
 * Generate optimized Cloudinary URL with transformations
 * @param originalUrl - The original Cloudinary URL
 * @param transformations - Cloudinary transformations
 * @returns Optimized URL
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  transformations: string = 'w_800,h_600,c_limit,q_auto,f_auto'
): string => {
  if (!isValidCloudinaryUrl(originalUrl)) {
    return originalUrl;
  }
  
  try {
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    
    // Insert transformations after 'upload'
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1) {
      pathParts.splice(uploadIndex + 1, 0, transformations);
    }
    
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    return originalUrl;
  }
}; 