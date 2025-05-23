# Todo Desktop App - Complete Setup Guide

### Step 1: Install Node.js
1. Download and install Node.js from [nodejs.org](https://nodejs.org)
2. Choose the LTS version (recommended)

### Step 2: Set Up the Project
1. Create a new folder called `todo-desktop-app`
2. Open Command Prompt or PowerShell in this folder
3. Save all the provided files in the folder:
   - `package.json`
   - `main.js`
   - `preload.js`
   - `index.html`

### Step 3: Install Dependencies
Run these commands in your project folder:
```bash
npm install
```

### Step 4: Run the App
```bash
npm start
```

### Step 5: Build Executable (Optional)
To create a `.exe` file:
```bash
npm run dist
```
The executable will be in the `dist` folder.

---

## Features

### ✅ Data Persistence
- **Batch version**: Saves to browser's local storage
- **Electron version**: Saves to a file in your home directory (`~/.todo-app-data.json`)
- Your todos are automatically saved and restored when you reopen the app

### ✅ Desktop Features
- Always stays on top of other windows
- Compact 350px width, perfect for screen edge
- Frameless window with custom controls
- Draggable by clicking the header
- Minimize and close buttons that work

### ✅ App Features
- Add todos by typing and pressing Enter
- Check/uncheck to mark complete
- Delete with × button
- Real-time statistics
- Smooth animations
- Dark theme with glassmorphism effect

### ✅ Keyboard Shortcuts
- `Ctrl+N` / `Cmd+N`: Focus input field
- `Ctrl+W` / `Cmd+W`: Close app
- `Escape`: Unfocus input field
- `Enter`: Add new todo

---

## File Structure

```
todo-desktop-app/
├── package.json          # Project configuration
├── main.js              # Main Electron process
├── preload.js           # Security bridge
├── index.html           # App interface
└── run-todo.bat         # Quick launcher (optional)
```
