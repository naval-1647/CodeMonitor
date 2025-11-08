# 🔧 CodeMentor AI - Troubleshooting Guide

Common issues and their solutions for CodeMentor AI.

## 🚨 Installation Issues

### Issue: "pip install fails" or "Package not found"

**Symptoms**: Error during `pip install -r requirements.txt`

**Solutions**:
```bash
# Solution 1: Upgrade pip
python -m pip install --upgrade pip

# Solution 2: Use specific Python version
python3 -m pip install -r requirements.txt

# Solution 3: Install in virtual environment
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: "npm install fails" or timeout errors

**Symptoms**: Frontend dependencies won't install

**Solutions**:
```bash
# Solution 1: Clear npm cache
npm cache clean --force
npm install

# Solution 2: Delete node_modules and retry
cd frontend
rmdir /s node_modules
del package-lock.json
npm install

# Solution 3: Use different registry
npm install --registry https://registry.npmjs.org
```

## 🔌 Connection Issues

### Issue: "Cannot connect to MongoDB"

**Symptoms**: 
- "Connection refused" error
- "MongoDB not found"
- Backend crashes on startup

**Solutions**:

**Check if MongoDB is running**:
```bash
# Windows - Check service status
net start | findstr MongoDB

# If not running, start it
net start MongoDB

# Or start manually
mongod
```

**Check connection string**:
```env
# In backend/.env

# For local MongoDB (default port)
MONGODB_URL=mongodb://localhost:27017

# For MongoDB Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/

# Common mistakes to avoid:
# ❌ MONGODB_URL=localhost:27017 (missing mongodb://)
# ❌ Extra spaces in connection string
# ❌ Wrong port number
```

**MongoDB Atlas specific**:
1. Check network access whitelist (add your IP or 0.0.0.0/0)
2. Verify username and password
3. Ensure database user has read/write permissions

### Issue: "OpenAI API error" or "Invalid API key"

**Symptoms**:
- "Authentication error"
- "Invalid API key"
- AI responses fail

**Solutions**:

**Verify API key**:
```env
# In backend/.env
# Make sure there are NO spaces around the key
OPENAI_API_KEY=sk-your-actual-key-here

# Common mistakes:
# ❌ OPENAI_API_KEY = sk-... (spaces around =)
# ❌ OPENAI_API_KEY="sk-..." (quotes not needed)
# ❌ your-openai-api-key-here (placeholder text)
```

**Check API key validity**:
1. Go to https://platform.openai.com/api-keys
2. Verify key is active
3. Check usage limits: https://platform.openai.com/account/usage
4. Ensure you have credits/billing set up

**Test API key**:
```bash
cd backend
python -c "from openai import OpenAI; client = OpenAI(api_key='your-key'); print('OK')"
```

### Issue: "WebSocket connection failed"

**Symptoms**:
- Chat streaming doesn't work
- "WebSocket closed" error
- Team mode can't connect

**Solutions**:

**Check backend is running**:
- Backend must be running on port 8000
- Visit http://localhost:8000 to verify

**Clear browser cache**:
```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Then refresh page and login again
```

**Check JWT token**:
- Logout and login again to get fresh token
- Token might be expired

**Firewall/Antivirus**:
- Allow WebSocket connections on port 8000
- Temporarily disable firewall to test

## ⚙️ Runtime Issues

### Issue: "Port already in use"

**Symptoms**:
- "Address already in use"
- "Port 8000/3000 is already allocated"

**Solutions**:

**Find and kill process (Windows)**:
```bash
# Find process on port 8000 (backend)
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# For port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Change ports**:
```python
# Backend: app/__main__.py
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Changed to 8001
```

```javascript
// Frontend: vite.config.js
export default defineConfig({
  server: {
    port: 3001,  // Changed to 3001
  }
})
```

### Issue: "Module not found" errors

**Symptoms**:
- "ModuleNotFoundError: No module named 'fastapi'"
- "Cannot find module 'react'"

**Backend Solution**:
```bash
cd backend
pip install -r requirements.txt

# If still issues, reinstall everything
pip uninstall -y -r requirements.txt
pip install -r requirements.txt
```

**Frontend Solution**:
```bash
cd frontend
npm install

# If still issues, clean install
rmdir /s node_modules
del package-lock.json
npm install
```

## 🔐 Authentication Issues

### Issue: "Invalid credentials" when logging in

**Symptoms**:
- Can register but can't login
- "Incorrect email or password"

**Solutions**:

**Verify email format**:
- Must be valid email: `user@example.com`
- Check for typos

**Password requirements**:
- Minimum 6 characters
- No special requirements otherwise

**Check database**:
```bash
# Connect to MongoDB
mongosh

# Switch to database
use codementor_ai

# Check if user exists
db.users.find({email: "your@email.com"})

# If needed, delete and recreate
db.users.deleteOne({email: "your@email.com"})
```

### Issue: "Token expired" or redirected to login

**Symptoms**:
- Automatically logged out
- Redirected to login page unexpectedly

**Solutions**:
- Token expires after 24 hours (default)
- Simply login again
- To change expiration:

```env
# In backend/.env
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
# Or
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

### Issue: "Unauthorized" errors on API calls

**Symptoms**:
- 401 errors on protected endpoints
- "Not authenticated"

**Solutions**:
```javascript
// Clear storage and login again
localStorage.clear()
// Refresh page and login
```

## 🎨 Frontend Issues

### Issue: "White screen" or blank page

**Symptoms**:
- Page doesn't load
- Only white screen visible

**Solutions**:

**Check browser console**:
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for errors (red text)

**Common fixes**:
```bash
# Clear cache and rebuild
cd frontend
npm cache clean --force
rmdir /s dist
npm run build
npm run dev
```

**Check for JavaScript errors**:
- Disable browser extensions
- Try in incognito/private mode
- Try different browser

### Issue: Styles not loading (page looks broken)

**Symptoms**:
- No colors or formatting
- Elements overlapping

**Solutions**:

**Rebuild Tailwind**:
```bash
cd frontend
npm install tailwindcss autoprefixer postcss
npm run dev
```

**Clear browser cache**:
- Press Ctrl+Shift+Delete
- Clear cached images and files

### Issue: "Failed to fetch" or API errors

**Symptoms**:
- Can't login/register
- Data doesn't load
- Network errors in console

**Solutions**:

**Check API URL**:
```javascript
// In frontend/src/utils/api.js
const API_BASE_URL = 'http://localhost:8000';  // Verify this
```

**Check CORS**:
- Backend must be running
- CORS is configured for `http://localhost:3000`

**Network tab**:
1. Open DevTools (F12)
2. Go to Network tab
3. Try the action again
4. Check if request reaches backend
5. Look at response status and body

## 🐛 Backend Issues

### Issue: "Internal Server Error" (500)

**Symptoms**:
- 500 status code
- Generic error message

**Solutions**:

**Check backend console**:
- Look at terminal where backend is running
- Find the full error traceback

**Common causes**:
- Database connection failed
- Missing environment variables
- OpenAI API error

**Debug mode**:
```python
# In app/__init__.py, temporarily add:
app = FastAPI(debug=True)  # Shows detailed errors
```

### Issue: Rate limit errors

**Symptoms**:
- "429 Too Many Requests"
- "Rate limit exceeded"

**Solutions**:

**Increase limits**:
```env
# In backend/.env
RATE_LIMIT_REQUESTS=100  # Increase from 50
RATE_LIMIT_WINDOW_MINUTES=60
```

**Wait and retry**:
- Limits reset after time window (default 60 min)

**Clear rate limit (for testing)**:
- Restart backend server

### Issue: Slow AI responses

**Symptoms**:
- AI takes forever to respond
- Streaming is very slow

**Solutions**:

**Check OpenAI status**:
- Visit https://status.openai.com/

**Network speed**:
- Test your internet connection
- AI responses require stable connection

**Use GPT-3.5 instead of GPT-4**:
```python
# In app/utils/openai_helper.py
model="gpt-3.5-turbo"  # Faster and cheaper
# Not: model="gpt-4"
```

## 💾 Database Issues

### Issue: "Collection doesn't exist"

**Symptoms**:
- Empty data on first use
- "Collection not found"

**Solution**:
- Collections are created automatically
- Try creating a user or snippet
- Run database initialization:

```bash
cd backend
python init_db.py
```

### Issue: "Duplicate key error"

**Symptoms**:
- Can't register with same email
- "E11000 duplicate key error"

**Solution**:
- Email must be unique
- Use different email
- Or delete existing user:

```bash
mongosh
use codementor_ai
db.users.deleteOne({email: "user@example.com"})
```

## 🌐 Browser Issues

### Issue: "WebSocket not supported"

**Solution**: Update browser to latest version

**Supported browsers**:
- Chrome 76+
- Firefox 70+
- Safari 13+
- Edge 79+

### Issue: LocalStorage errors

**Symptoms**:
- Can't save authentication
- Settings don't persist

**Solutions**:
- Enable cookies and storage in browser settings
- Disable incognito/private mode
- Clear site data and try again

## 🔄 General Debugging Steps

### 1. Check All Services Running

```bash
# Backend running?
# Should see: "Uvicorn running on http://0.0.0.0:8000"

# Frontend running?
# Should see: "Local: http://localhost:3000/"

# MongoDB running?
net start | findstr MongoDB
```

### 2. Check Environment Variables

```bash
cd backend
type .env
# Verify all values are correct
```

### 3. Check Logs

**Backend logs**:
- Look at terminal where `python -m app` is running
- Errors will appear in red

**Frontend logs**:
- Browser console (F12 → Console tab)
- Terminal where `npm run dev` is running

**MongoDB logs**:
- MongoDB log file location depends on installation
- Or use MongoDB Compass for GUI access

### 4. Restart Everything

```bash
# Stop all servers (Ctrl+C in each terminal)

# Restart MongoDB
net start MongoDB

# Restart backend
cd backend
python -m app

# Restart frontend
cd frontend
npm run dev
```

### 5. Clean Reinstall

**Backend**:
```bash
cd backend
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend**:
```bash
cd frontend
rmdir /s node_modules
rmdir /s dist
del package-lock.json
npm install
```

## 📞 Still Having Issues?

### Diagnostic Information to Gather

When seeking help, provide:

1. **Error Message**: Full error text
2. **Console Output**: Backend and frontend logs
3. **Environment**: 
   - OS version
   - Python version: `python --version`
   - Node version: `node --version`
   - MongoDB version: `mongod --version`
4. **What You're Trying**: Exact steps to reproduce
5. **Expected vs Actual**: What should happen vs what happens

### Common Mistake Checklist

- [ ] MongoDB is running
- [ ] OpenAI API key is valid and in .env
- [ ] Backend .env file exists and has no syntax errors
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 3000
- [ ] All dependencies are installed
- [ ] No firewall blocking connections
- [ ] Browser is up to date
- [ ] Correct URLs in API calls

## 💡 Pro Tips

1. **Use browser DevTools**: F12 is your friend
2. **Read error messages**: They usually tell you exactly what's wrong
3. **Check simple things first**: Is it running? Is it connected?
4. **One change at a time**: Don't change multiple things simultaneously
5. **Restart when stuck**: A fresh start often solves mysterious issues
6. **Use database GUI**: MongoDB Compass makes debugging easier

---

If all else fails, check that you've followed the SETUP_GUIDE.md step by step!
