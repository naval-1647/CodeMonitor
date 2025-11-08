# CodeMentor AI - Frontend

React frontend for the CodeMentor AI intelligent coding assistant.

## Features

- 🎨 Modern UI with TailwindCSS
- 🌓 Dark/Light mode toggle
- 🔐 JWT authentication with secure token storage
- 💻 Integrated code editor with syntax highlighting
- 🤖 Real-time AI chat with WebSocket streaming
- 📝 Code snippet management with search
- 👥 Team collaboration mode
- 📱 Responsive design

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Ace** - Code editor component
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Icon library
- **WebSocket API** - Real-time communication

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create `.env` file (optional):

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/             # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Snippets.jsx
│   │   └── TeamMode.jsx
│   ├── utils/               # Utilities
│   │   ├── api.js          # Axios instance with interceptors
│   │   └── websocket.js    # WebSocket client
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features Guide

### Authentication
- JWT tokens stored in localStorage
- Automatic token refresh via Axios interceptors
- Protected routes with redirect to login

### Code Editor
- Multi-language support (Python, JavaScript, Java, etc.)
- Syntax highlighting
- Auto-completion
- Theme customization

### AI Interaction
- Three modes: Generate, Debug, Explain
- Real-time streaming responses via WebSocket
- Chat history saved automatically
- Rate limiting status displayed

### Snippets
- Create, edit, delete code snippets
- Search by title or tags
- Syntax-highlighted preview
- Copy to clipboard
- Language categorization

### Team Mode
- Create or join collaboration rooms
- Real-time chat with team members
- Shared AI interactions
- Room link sharing
- Member presence indicators

### Dark Mode
- System preference detection
- Toggle between light/dark themes
- Persistent theme selection
- Smooth transitions

## Development Tips

### Add New Language to Editor

Edit `Dashboard.jsx`:

```javascript
import 'ace-builds/src-noconflict/mode-rust';

// Add to language select
<option value="rust">Rust</option>
```

### Customize Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Add API Endpoint

Edit `utils/api.js` or create service files:

```javascript
export const myService = {
  getData: () => api.get('/api/my-endpoint'),
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading for heavy components
- Optimized bundle size with Vite
- Efficient re-renders with React hooks
