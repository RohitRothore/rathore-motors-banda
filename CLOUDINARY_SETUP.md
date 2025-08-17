# Cloudinary Image Upload Implementation

This implementation provides a robust, industry-standard solution for handling image uploads using Cloudinary in your Rathore Motors Banda application.

## Features

- ✅ **Secure Image Upload**: Direct upload to Cloudinary with proper validation
- ✅ **Image Optimization**: Automatic resizing, compression, and format optimization
- ✅ **Error Handling**: Comprehensive error handling for upload failures
- ✅ **File Validation**: Type and size validation for uploaded images
- ✅ **Batch Operations**: Support for multiple image uploads
- ✅ **Cleanup**: Automatic deletion of images when vehicles are deleted
- ✅ **Type Safety**: Full TypeScript support with proper type definitions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install cloudinary multer multer-storage-cloudinary @types/multer
```

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Replace the placeholder values in your `.env` file

## API Endpoints

### Create Vehicle with Images
```http
POST /api/vehicles
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "title": "Honda City 2020",
  "brand": "Honda",
  "model": "City",
  "year": 2020,
  "price": 850000,
  "fuelType": "Petrol",
  "vehicleType": "Car",
  "images": [file1, file2, file3] // Multiple image files
}
```

### Update Vehicle with Additional Images
```http
PUT /api/vehicles/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "price": 800000,
  "images": [newImage1, newImage2] // Additional images
}
```

### Delete Vehicle (Automatically deletes all associated images)
```http
DELETE /api/vehicles/:id
Authorization: Bearer <token>
```

### Delete Specific Image
```http
DELETE /api/vehicles/:id/images/:imageIndex
Authorization: Bearer <token>
```

## File Upload Specifications

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits
- Maximum file size: 5MB per image
- Maximum files per request: 10 images

### Image Optimization
- Automatic resizing to max 1200x800 pixels
- Quality optimization (auto:good)
- Format optimization based on browser support

## Error Handling

The implementation includes comprehensive error handling for:

- **File Size Exceeded**: Returns 400 with clear error message
- **Invalid File Type**: Only image files are accepted
- **Too Many Files**: Maximum 10 images per request
- **Upload Failures**: Graceful handling of Cloudinary upload errors
- **Deletion Failures**: Continues operation even if image deletion fails

## Security Features

- **File Type Validation**: Only image files are accepted
- **Size Limits**: Prevents large file uploads
- **Authentication Required**: All upload operations require authentication
- **Secure URLs**: Uses HTTPS URLs from Cloudinary
- **Input Sanitization**: Proper validation of all inputs

## Usage Examples

### Frontend Integration (JavaScript)

```javascript
// Create vehicle with images
const formData = new FormData();
formData.append('title', 'Honda City 2020');
formData.append('brand', 'Honda');
formData.append('model', 'City');
formData.append('year', '2020');
formData.append('price', '850000');
formData.append('fuelType', 'Petrol');
formData.append('vehicleType', 'Car');

// Add multiple images
for (let i = 0; i < imageFiles.length; i++) {
  formData.append('images', imageFiles[i]);
}

const response = await fetch('/api/vehicles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result.data.images); // Array of Cloudinary URLs
```

### React Example

```jsx
import { useState } from 'react';

const VehicleForm = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({});

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Add images
    images.forEach(image => {
      submitData.append('images', image);
    });

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('Vehicle created with images:', result.data.images);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      {/* Other form fields */}
      <button type="submit">Create Vehicle</button>
    </form>
  );
};
```

## Best Practices

1. **Always validate files on the frontend** before uploading
2. **Show upload progress** for better user experience
3. **Handle upload errors gracefully** with user-friendly messages
4. **Use appropriate image formats** (WebP for modern browsers)
5. **Implement retry logic** for failed uploads
6. **Clean up temporary files** if using local storage before Cloudinary

## Troubleshooting

### Common Issues

1. **"File too large" error**
   - Ensure files are under 5MB
   - Compress images before upload if needed

2. **"Only image files are allowed" error**
   - Check file extensions
   - Ensure proper MIME type detection

3. **Cloudinary upload failures**
   - Verify environment variables
   - Check Cloudinary account status
   - Ensure proper folder permissions

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG=cloudinary:*
```

## Performance Optimization

- Images are automatically optimized for web delivery
- Responsive images with automatic format selection
- CDN delivery for fast loading worldwide
- Lazy loading support for better performance

## Cost Considerations

- Cloudinary offers a generous free tier
- Monitor usage in your Cloudinary dashboard
- Consider implementing image compression for large uploads
- Use appropriate transformation parameters to optimize storage

## Support

For issues related to:
- **Cloudinary**: Check [Cloudinary Documentation](https://cloudinary.com/documentation)
- **Implementation**: Review this documentation and code comments
- **API Issues**: Check server logs and error responses 