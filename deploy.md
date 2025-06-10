# Maritime Intelligence - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) (optional)

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Fork/Upload to GitHub**
   - Create a new repository on GitHub
   - Upload the `maritime-intelligence-wireframe` folder contents

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Select the maritime intelligence repo

3. **Deploy Settings**
   - Framework Preset: **Other**
   - Root Directory: **./maritime-intelligence-wireframe** (if nested)
   - Build Command: **Leave empty**
   - Output Directory: **Leave empty**
   - Install Command: **npm install**

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project directory
cd maritime-intelligence-wireframe

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - What's your project's name? maritime-intelligence
# - In which directory is your code located? ./
```

## 🔒 Password Protection

### Current Setup
- **Password**: `maritime2024` (changeable in `auth.html`)
- **Session Duration**: 24 hours
- **Protection Level**: Client-side with session storage

### Changing the Password
Edit line 195 in `auth.html`:
```javascript
const DEMO_PASSWORD = 'your-new-password'; // Change this
```

### Security Features
- Session-based authentication
- 24-hour session expiration
- Automatic redirect to login
- Input validation and error handling
- Shake animation on wrong password

## 🛡️ Enhanced Security Options

### Option 1: Vercel Password Protection (Pro Feature)
```json
// vercel.json
{
  "functions": {
    "pages/api/auth.js": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Option 2: Environment Variables
Add to Vercel dashboard → Settings → Environment Variables:
```
DEMO_PASSWORD=your-secure-password
```

Then update `auth.html`:
```javascript
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'maritime2024';
```

## 📊 Demo Features Included

- ✅ **Interactive Stakeholder Network** (Vis.js)
- ✅ **Live Maritime Map** (Leaflet.js)  
- ✅ **Timeline Visualization** (Vis.js)
- ✅ **Bloomberg Terminal UI**
- ✅ **Multi-lens Analytics** (7 views)
- ✅ **GCA Plant Case Study**
- ✅ **Password Protection**
- ✅ **Mobile Responsive**

## 🔧 Customization

### Branding
- Update logo in `auth.html` and navigation
- Modify color scheme in `styles.css`
- Change demo password in `auth.html`

### Content
- Edit story content in each HTML file
- Update data visualizations
- Modify stakeholder network nodes/edges
- Customize map markers and routes

## 📱 Testing

### Local Testing
```bash
# Install serve
npm install -g serve

# Run locally
serve .

# Access at http://localhost:3000
```

### Browser Testing
- ✅ Chrome/Edge/Safari
- ✅ Mobile responsive
- ✅ Password protection
- ✅ All navigation links
- ✅ Interactive visualizations

## 🌐 Live Demo URL Structure

```
https://your-project.vercel.app/
├── auth.html          # Password protection
├── index.html         # Main dashboard  
├── story-view.html    # Story analysis
├── data-view.html     # Data analytics
├── connections-view.html # Connection mapping
├── impact-view.html   # Impact analysis  
├── geography-view.html # Geographic intelligence
├── timeline-view.html # Timeline analysis
└── players-view.html  # Stakeholder network
```

## 💡 Pro Tips

1. **Custom Domain**: Add your domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics for usage tracking
3. **Performance**: All assets are optimized for fast loading
4. **SEO**: Meta tags included for professional presentation

## 🔐 Security Best Practices

- ✅ Password protection enabled
- ✅ Session timeout implemented  
- ✅ XSS protection headers
- ✅ Frame protection enabled
- ✅ Content type validation

Your maritime intelligence demo will be live and password-protected, perfect for client presentations and stakeholder demos! 