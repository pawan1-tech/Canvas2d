# Canvas2D - Professional 2D Canvas Editor

<div align="center">

![Canvas2D](https://img.shields.io/badge/Canvas2D-v1.0.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)

A modern, production-ready web-based 2D canvas editor with real-time persistence, built with React 19, Fabric.js 6, and Firebase Firestore.

[Features](#-features) • [Demo](#-demo) • [Architecture](#-architecture) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎨 Drawing Tools
- **Select Tool** - Select, move, resize, rotate objects
- **Rectangle Tool** - Create customizable rectangles
- **Circle Tool** - Draw perfect circles
- **Text Tool** - Add and edit text with custom fonts
- **Pen Tool** - Freehand drawing with smooth strokes

### 🎯 Advanced Capabilities
- **Color Customization** - Separate fill and stroke color pickers
- **Zoom Controls** - 25% to 200% zoom with reset
- **Grid Toggle** - Visual grid for precise alignment
- **Object Manipulation** - Delete, clear, multi-select
- **Keyboard Shortcuts** - Full keyboard navigation support
- **Responsive Design** - Adapts to any screen size
- **Real-time Save** - Persist to Firebase Firestore
- **Auto-load** - Canvas state restored from URL

### 🏗️ Code Quality
- ✅ **Modular Architecture** - Component-based design
- ✅ **Custom Hooks** - Reusable business logic
- ✅ **TypeScript** - Full type safety
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Best Practices** - Following React 19 patterns
- ✅ **Clean Code** - 73% reduction in main file complexity

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Build Tool** | Vite 7.1 |
| **Canvas Library** | Fabric.js 6 |
| **Database** | Firebase Firestore |
| **Routing** | React Router 7 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | React Hooks + Custom Hooks |

## 📐 Architecture

### Component Hierarchy
```
App.tsx
└── CanvasEditor.tsx (178 lines)
    └── ErrorBoundary
        └── CanvasEditorContent
            ├── Header (Navigation + Save)
            ├── CanvasToolbar (Colors, Grid, Zoom)
            ├── Main Editor
            │   ├── ToolSidebar (Tool Selection)
            │   └── Canvas (Fabric.js)
            └── StatusBar (Info + Shortcuts)
```

### File Structure
```
src/
├── pages/
│   ├── Home.tsx              # Landing page
│   └── CanvasEditor.tsx      # Main editor (178 lines) ⭐
│
├── components/               # UI Components
│   ├── ToolSidebar.tsx       # Left toolbar (107 lines)
│   ├── CanvasToolbar.tsx     # Top toolbar (96 lines)
│   ├── StatusBar.tsx         # Bottom bar (31 lines)
│   └── ErrorBoundary.tsx     # Error handling (48 lines)
│
├── hooks/                    # Custom Hooks
│   └── useCanvas.ts          # Canvas logic (266 lines)
│       ├── useCanvas()       # Lifecycle & Firestore
│       └── useCanvasTools()  # Drawing tools
│
├── utils/                    # Utilities
│   └── firestore.ts          # Data cleaning (47 lines)
│
└── types/                    # Type Definitions
    └── canvas.ts             # Tool types (5 lines)
```

### Code Quality Metrics
- **Main File**: 666 lines → **178 lines** (73% reduction)
- **Components**: 4 modular, reusable components
- **Custom Hooks**: 2 hooks for business logic
- **TypeScript Coverage**: 100%
- **Build Time**: 1.59s
- **Bundle Size**: 887 KB (gzipped: 252 KB)

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/pawan1-tech/Canvas2d.git
cd Canvas2d
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a `.env` file in the root directory:
```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Development/Testing
VITE_USE_FIRESTORE_EMULATOR=false
VITE_FIRESTORE_EMULATOR_HOST=127.0.0.1
VITE_FIRESTORE_EMULATOR_PORT=8080
VITE_FIRESTORE_LONG_POLLING=false
```

4. **Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📝 Usage

### Creating a Canvas
1. Click **"New canvas"** on the home page
2. You'll be redirected to `/canvas/:canvasId`
3. Start drawing with the available tools

### Drawing Tools
| Tool | Shortcut | Description |
|------|----------|-------------|
| Select | `V` | Select and manipulate objects |
| Rectangle | `R` | Draw rectangles |
| Circle | `C` | Draw circles |
| Text | `T` | Add text |
| Pen | `P` | Freehand drawing |

### Keyboard Shortcuts
- `V` - Select tool
- `R` - Add rectangle
- `C` - Add circle
- `T` - Add text
- `P` - Pen tool
- `Del` / `Backspace` - Delete selected
- `Cmd+S` / `Ctrl+S` - Save canvas
- `Cmd+A` / `Ctrl+A` - Select all

### Saving & Loading
- **Save**: Click the "Save" button or press `Cmd+S`
- **Load**: Navigate to the canvas URL (auto-loads)
- **Share**: Share the canvas URL with others

## 🎯 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
tsc -b
```

### Project Structure Details

#### Components
- **ToolSidebar**: Tool selection and quick actions
- **CanvasToolbar**: Color pickers, grid, zoom controls
- **StatusBar**: Selection info and keyboard shortcuts
- **ErrorBoundary**: Error handling wrapper

#### Custom Hooks
- **useCanvas**: Canvas initialization, Firestore integration, resize handling
- **useCanvasTools**: Drawing tools, object manipulation, zoom controls

#### Utilities
- **cleanForFirestore**: Removes undefined values and handles nested arrays for Firestore compatibility

## 📚 Documentation

Additional documentation files:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture diagrams and data flow
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - Code refactoring results and metrics
- **[CHECKLIST.md](CHECKLIST.md)** - Testing checklist and deployment guide
- **[FEATURES.md](FEATURES.md)** - Feature demonstrations and usage examples
- **[EVALUATION_GUIDE.md](EVALUATION_GUIDE.md)** - Evaluation criteria and scoring guide
- **[FIREBASE_DEPLOYMENT.md](FIREBASE_DEPLOYMENT.md)** - Step-by-step Firebase hosting guide
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI agent instructions

## 🔧 Configuration

### Firestore Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Create a collection named `canvases`
4. Update security rules (optional):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /canvases/{canvasId} {
      allow read, write: if true; // Adjust for production
    }
  }
}
```

### Local Development with Emulator
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulator
firebase emulators:start --only firestore

# Set environment variable
VITE_USE_FIRESTORE_EMULATOR=true
```

## 🎨 Design Decisions

### Why Explicit Save?
- **Cost Optimization**: Minimizes Firestore write operations
- **User Control**: Users decide when to persist changes
- **Quota Management**: Avoids hitting Firestore rate limits

### Why Fabric.js?
- **Rich API**: Comprehensive canvas manipulation
- **Object Model**: Built-in shape objects
- **Event System**: Robust event handling
- **Performance**: Optimized for large canvases

### Why Modular Architecture?
- **Maintainability**: Easier to understand and modify
- **Testability**: Components can be tested in isolation
- **Reusability**: Components can be used in other projects
- **Scalability**: Easy to add new features

## 🧪 Testing

### Manual Testing Checklist
- ✅ Canvas creation and loading
- ✅ All drawing tools functional
- ✅ Color customization
- ✅ Zoom and grid controls
- ✅ Object manipulation (move, resize, rotate, delete)
- ✅ Keyboard shortcuts
- ✅ Save and load from Firestore
- ✅ Responsive design
- ✅ Error handling

### Future Testing Plans
- [ ] Unit tests for hooks
- [ ] Component tests with React Testing Library
- [ ] E2E tests with Playwright
- [ ] Visual regression tests

## 🚀 Deployment

### Quick Deploy to Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build your app
npm run build

# 4. Initialize Firebase Hosting
firebase init hosting
# - Select existing project or create new
# - Set public directory to: dist
# - Configure as single-page app: Yes
# - Don't overwrite dist/index.html: No

# 5. Deploy
firebase deploy

# 🎉 Your app is now live!
```

**📖 For detailed deployment instructions, see [FIREBASE_DEPLOYMENT.md](FIREBASE_DEPLOYMENT.md)**

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deployment Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: Configure in repository settings

### Environment Variables
Ensure all Firebase environment variables are set in your hosting platform.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Fabric.js** - Powerful canvas library
- **React Team** - Amazing framework
- **Firebase** - Reliable backend services
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool

## 📞 Contact

**Pawan Sah**
- GitHub: [@pawan1-tech](https://github.com/pawan1-tech)
- Repository: [Canvas2d](https://github.com/pawan1-tech/Canvas2d)

---

<div align="center">

**Built with ❤️ using React 19, TypeScript, and Firebase**

⭐ Star this repo if you find it helpful!

</div>

