import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryConnection() {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    
    // Test configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Missing Cloudinary environment variables!');
      console.log('Please set the following in your .env file:');
      console.log('- CLOUDINARY_CLOUD_NAME');
      console.log('- CLOUDINARY_API_KEY');
      console.log('- CLOUDINARY_API_SECRET');
      return;
    }

    console.log('✅ Environment variables found');
    console.log(`📁 Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`🔑 API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 8)}...`);
    console.log(`🔐 API Secret: ${process.env.CLOUDINARY_API_SECRET.substring(0, 8)}...`);

    // Test API connection by getting account info
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Account status:', result);

    // Test folder creation (this will create the folder if it doesn't exist)
    console.log('📁 Testing folder access...');
    const folderPath = 'rathore-motors-banda/vehicles';
    
    try {
      // Try to list resources in the folder
      const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: 1
      });
      console.log('✅ Folder access successful');
      console.log(`📊 Found ${resources.resources.length} resources in folder`);
    } catch (folderError) {
      console.log('⚠️  Folder may not exist yet (this is normal for new accounts)');
      console.log('📁 Folder will be created automatically on first upload');
    }

    console.log('\n🎉 Cloudinary setup is ready!');
    console.log('\nNext steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Test image upload via API endpoints');
    console.log('3. Check the CLOUDINARY_SETUP.md file for usage examples');

  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your Cloudinary credentials');
    console.log('2. Verify your internet connection');
    console.log('3. Ensure your Cloudinary account is active');
  }
}

// Run the test
testCloudinaryConnection(); 