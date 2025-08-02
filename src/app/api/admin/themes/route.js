import clientPromise from '../../../../lib/mongodb';

// Verify admin token middleware
async function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const [email, timestamp, secretKey] = decoded.split(':');

  if (email !== process.env.ADMIN_EMAIL || secretKey !== process.env.ADMIN_SECRET_KEY) {
    throw new Error('Invalid token');
  }

  if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
    throw new Error('Token expired');
  }

  return true;
}

// Available themes and wallpapers
const availableThemes = {
  wallpapers: [
    { id: 'monterey', name: 'macOS Monterey', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)' },
    { id: 'ventura', name: 'macOS Ventura', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'sonoma', name: 'macOS Sonoma', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { id: 'sequoia', name: 'macOS Sequoia', gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
    { id: 'big-sur', name: 'macOS Big Sur', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'gradient', name: 'Rainbow Gradient', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
    { id: 'minimal', name: 'Minimal Light', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 'dark', name: 'Dark Theme', gradient: 'linear-gradient(135deg, #2c3e50 0%, #4a569d 100%)' },
    { id: 'light', name: 'Light Theme', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
  ],
  customization: {
    allowCustomWallpaper: true,
    allowColorCustomization: true,
    allowFontCustomization: false
  }
};

// GET - Get current theme settings
export async function GET(request) {
  try {
    await verifyAdminToken(request);

    const client = await clientPromise;
    const db = client.db();

    // Get current theme settings
    let themeSettings = await db.collection('site_settings').findOne({ type: 'theme' });
    
    if (!themeSettings) {
      // Create default theme settings
      themeSettings = {
        type: 'theme',
        currentWallpaper: 'ventura',
        customWallpaper: null,
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#ff6b6b',
        fontFamily: 'SF Pro Display',
        darkMode: false,
        glassEffect: true,
        animations: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      };
      
      await db.collection('site_settings').insertOne(themeSettings);
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        currentSettings: themeSettings,
        availableThemes
      }
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}

// PUT - Update theme settings
export async function PUT(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const { 
      wallpaper, 
      customWallpaper, 
      primaryColor, 
      secondaryColor, 
      accentColor,
      darkMode,
      glassEffect,
      animations
    } = body;

    const client = await clientPromise;
    const db = client.db();

    const updateData = {
      updatedAt: new Date(),
      updatedBy: 'admin'
    };

    if (wallpaper) updateData.currentWallpaper = wallpaper;
    if (customWallpaper) updateData.customWallpaper = customWallpaper;
    if (primaryColor) updateData.primaryColor = primaryColor;
    if (secondaryColor) updateData.secondaryColor = secondaryColor;
    if (accentColor) updateData.accentColor = accentColor;
    if (typeof darkMode === 'boolean') updateData.darkMode = darkMode;
    if (typeof glassEffect === 'boolean') updateData.glassEffect = glassEffect;
    if (typeof animations === 'boolean') updateData.animations = animations;

    const result = await db.collection('site_settings').updateOne(
      { type: 'theme' },
      { $set: updateData },
      { upsert: true }
    );

    // Get updated settings
    const updatedSettings = await db.collection('site_settings').findOne({ type: 'theme' });

    return new Response(JSON.stringify({
      success: true,
      message: 'Theme settings updated successfully',
      data: updatedSettings
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}

// POST - Upload custom wallpaper
export async function POST(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const { wallpaperUrl, wallpaperName } = body;

    if (!wallpaperUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Wallpaper URL is required'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const customWallpaperData = {
      url: wallpaperUrl,
      name: wallpaperName || 'Custom Wallpaper',
      uploadedAt: new Date(),
      uploadedBy: 'admin'
    };

    const result = await db.collection('site_settings').updateOne(
      { type: 'theme' },
      { 
        $set: { 
          customWallpaper: customWallpaperData,
          currentWallpaper: 'custom',
          updatedAt: new Date(),
          updatedBy: 'admin'
        }
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Custom wallpaper uploaded successfully',
      data: customWallpaperData
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}