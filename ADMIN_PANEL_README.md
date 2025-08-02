# CS Rippers Admin Panel

A comprehensive administrative dashboard for managing the CS Rippers platform with macOS-inspired design and advanced security features.

## 🔐 Admin Authentication System

### Environment-based Credentials
The admin panel uses secure environment-based authentication stored in `.env` file:

```env
ADMIN_EMAIL=admin@csrippers.com
ADMIN_PASSWORD=CSRippers@2024!
ADMIN_SECRET_KEY=csr_admin_secret_key_2024
```

### Two-Factor Authentication (2FA)
- **Step 1**: Email and password verification
- **Step 2**: 6-digit OTP sent to admin email
- **Security Features**:
  - OTP expires in 10 minutes
  - Maximum 3 attempts per OTP
  - Session tokens valid for 24 hours
  - Automatic session cleanup

### Access URL
```
http://localhost:3000/admin
```

## 🎨 Design Features

### macOS-Inspired Interface
- **Glass Effect**: Backdrop blur with transparency
- **Native Controls**: macOS-style window controls and buttons
- **Smooth Animations**: Fluid transitions and hover effects
- **Responsive Design**: Optimized for desktop and mobile

### Theme System
- **Dynamic Wallpapers**: 10+ macOS wallpaper options
- **Custom Wallpapers**: Upload and use custom backgrounds
- **Color Schemes**: Customizable primary, secondary, and accent colors
- **Dark/Light Mode**: Toggle between themes
- **Glass Effects**: Enable/disable glassmorphism

## 📊 Administrative Capabilities

### 1. User Management
- **View All Users**: Complete list of students and members
- **User Analytics**: Registration trends, user types, activity stats
- **User Actions**:
  - Disable/Enable accounts
  - Delete users (with backup)
  - View user details and activity
- **Bulk Operations**: Mass enable/disable users
- **Search & Filter**: Find users by name, email, type, status

### 2. Event Management
- **Create Events**: Full hackathon/competition creation
- **Event Details**:
  - Title, description, and images
  - Pricing system with discounts
  - Start/end dates and registration deadlines
  - Technology requirements and prizes
  - Participant limits
- **Event Analytics**: Revenue, registrations, popular events
- **Event Status**: Active, upcoming, completed tracking
- **Registration Management**: View and manage participants

### 3. Theme Control
- **Platform-wide Customization**:
  - Change wallpapers across the platform
  - Customize color schemes
  - Toggle visual effects
- **Available Wallpapers**:
  - macOS Ventura, Monterey, Big Sur
  - macOS Catalina, Mojave, High Sierra
  - macOS Sierra, El Capitan, Yosemite, Mavericks
- **Custom Wallpapers**: Upload via Cloudinary integration
- **Theme History**: Track all theme changes

### 4. Leaderboard Oversight
- **Score Management**:
  - Update individual user scores
  - Add/subtract points with reasons
  - Reset scores (individual or bulk)
- **Achievement System**:
  - Award custom achievements
  - Remove achievements
  - Track achievement statistics
- **Ranking System**:
  - Automatic rank calculation
  - Rank change tracking
  - Performance analytics
- **Bulk Operations**: Reset all scores, recalculate ranks

### 5. Database Analytics
- **User Statistics**:
  - Total users, students, members
  - Registration trends and growth
  - Active vs inactive users
- **Event Analytics**:
  - Revenue tracking and trends
  - Registration statistics
  - Popular events analysis
- **Performance Metrics**:
  - Leaderboard statistics
  - Score distributions
  - Achievement analytics

## 🛠️ Technical Implementation

### Frontend Components
```
src/app/admin/
├── page.jsx                 # Main admin panel entry
├── components/
│   ├── AdminLogin.jsx       # 2FA login interface
│   ├── AdminDashboard.jsx   # Main dashboard container
│   ├── AdminSidebar.jsx     # Navigation sidebar
│   ├── AdminHeader.jsx      # Top header with user info
│   └── admin/
│       ├── DashboardOverview.jsx    # Analytics overview
│       ├── UserManagement.jsx       # User management interface
│       ├── EventManagement.jsx      # Event CRUD operations
│       ├── ThemeManagement.jsx      # Theme customization
│       └── LeaderboardManagement.jsx # Score & achievement management
```

### Backend API Routes
```
src/app/api/admin/
├── auth/route.js           # Authentication & OTP verification
├── users/route.js          # User management operations
├── events/route.js         # Event CRUD operations
├── themes/route.js         # Theme management
└── leaderboard/route.js    # Score & achievement management
```

### Security Features
- **Token-based Authentication**: Secure session management
- **Admin-only Access**: Role-based access control
- **Request Validation**: Input sanitization and validation
- **Action Logging**: All admin actions are logged
- **Rate Limiting**: OTP attempt limitations

## 🚀 Getting Started

### 1. Environment Setup
Ensure your `.env` file contains the admin credentials:
```env
ADMIN_EMAIL=admin@csrippers.com
ADMIN_PASSWORD=CSRippers@2024!
ADMIN_SECRET_KEY=csr_admin_secret_key_2024
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Email Configuration
Configure Gmail SMTP for OTP delivery:
1. Enable 2-factor authentication on Gmail
2. Generate an app-specific password
3. Update `EMAIL_USER` and `EMAIL_PASS` in `.env`

### 3. Access the Admin Panel
1. Navigate to `http://localhost:3000/admin`
2. Enter admin credentials
3. Check email for 6-digit OTP
4. Complete authentication

### 4. First-time Setup
1. **Theme Configuration**: Set default wallpaper and colors
2. **User Review**: Check existing user accounts
3. **Event Setup**: Create your first hackathon/event
4. **Leaderboard**: Initialize scoring system

## 📱 Mobile Responsiveness

The admin panel is fully responsive with:
- **Collapsible Sidebar**: Auto-hide on mobile devices
- **Touch-friendly Controls**: Optimized for touch interaction
- **Responsive Tables**: Horizontal scrolling for data tables
- **Mobile Navigation**: Hamburger menu and touch gestures

## 🔧 Customization Options

### Theme Customization
- **Wallpaper Selection**: Choose from 10+ built-in options
- **Custom Wallpapers**: Upload your own backgrounds
- **Color Schemes**: Customize primary, secondary, accent colors
- **Visual Effects**: Toggle glass effects and animations

### Feature Toggles
- **Dark Mode**: Switch between light and dark themes
- **Glass Effects**: Enable/disable backdrop blur effects
- **Animations**: Control transition and hover animations
- **Sidebar**: Collapsible navigation sidebar

## 📊 Analytics Dashboard

### Overview Metrics
- **User Growth**: Registration trends and statistics
- **Event Performance**: Revenue and participation metrics
- **Leaderboard Stats**: Score distributions and achievements
- **Platform Activity**: Recent actions and system health

### Detailed Reports
- **User Analytics**: Detailed user behavior and demographics
- **Financial Reports**: Revenue tracking and payment analytics
- **Performance Metrics**: System usage and engagement stats
- **Export Options**: Download reports in various formats

## 🛡️ Security Best Practices

### Authentication Security
- **Strong Passwords**: Enforce complex admin passwords
- **2FA Required**: Mandatory two-factor authentication
- **Session Management**: Automatic session expiration
- **Token Rotation**: Regular token refresh

### Data Protection
- **Input Validation**: Sanitize all user inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Anti-CSRF tokens

### Access Control
- **Role-based Access**: Admin-only functionality
- **Action Logging**: Comprehensive audit trails
- **IP Restrictions**: Optional IP whitelisting
- **Rate Limiting**: Prevent brute force attacks

## 🔄 Backup & Recovery

### Data Backup
- **User Data**: Automatic user data backup before deletion
- **Event Data**: Event history preservation
- **Theme Settings**: Theme configuration backup
- **Admin Actions**: Complete action history logging

### Recovery Options
- **Soft Delete**: Users moved to deleted_users collection
- **Data Restoration**: Ability to restore deleted data
- **Configuration Rollback**: Revert theme and settings changes
- **Audit Trail**: Complete history of all changes

## 📞 Support & Troubleshooting

### Common Issues
1. **OTP Not Received**: Check spam folder, verify email configuration
2. **Login Failed**: Verify admin credentials in `.env` file
3. **Theme Not Applying**: Clear browser cache and refresh
4. **Data Not Loading**: Check MongoDB connection and permissions

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

### Contact Support
For technical support or feature requests:
- **Email**: admin@csrippers.com
- **Documentation**: Check this README for detailed guides
- **Logs**: Check browser console and server logs for errors

---

## 🎯 Quick Start Checklist

- [ ] Environment variables configured
- [ ] Email SMTP settings verified
- [ ] Admin credentials set up
- [ ] MongoDB connection established
- [ ] Access admin panel at `/admin`
- [ ] Complete 2FA authentication
- [ ] Configure initial theme settings
- [ ] Create first event/hackathon
- [ ] Set up user management policies
- [ ] Initialize leaderboard system

**Admin Panel is now ready for use! 🚀**