const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Keep a global reference of the window object
let mainWindow;
let tray;

function createWindow() {
  // Get the primary display's work area
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 330,
    height: 600,
    x: width - 400, // Position near right edge
    y: 30, // Position near top
    frame: false, // Remove window frame for custom styling
    transparent: true, // Enable transparency
    alwaysOnTop: true, // Keep on top
    resizable: false, // Fixed size
    skipTaskbar: true, // Hide from taskbar - no presence!
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false, // Prevent throttling when hidden
      webSecurity: false // Allow local file access
    }
  });

  // Disable GPU acceleration to prevent GPU errors
  mainWindow.webContents.session.setUserAgent(
    mainWindow.webContents.session.getUserAgent() + ' TodoDreams/1.0'
  );

  // Load the app
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed - hide instead of closing when tray is active
  mainWindow.on('close', (event) => {
    if (tray && !app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // Maintain always on top
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.setAlwaysOnTop(true);
        }
      }, 100);
    }
  });

  // Open DevTools in development (comment out for production)
  // mainWindow.webContents.openDevTools();
}

function createTray() {
  // Create tray icon (you can create a simple icon or use emoji)
  const iconPath = createTrayIcon();
  tray = new Tray(iconPath);

  // Create context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Todo List',
      click: () => {
        if (mainWindow) {
          if (mainWindow.isVisible()) {
            mainWindow.focus();
          } else {
            mainWindow.show();
          }
        }
      }
    },
    {
      label: 'Hide Todo List',
      click: () => {
        if (mainWindow && mainWindow.isVisible()) {
          mainWindow.hide();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        if (mainWindow) {
          if (!mainWindow.isVisible()) {
            mainWindow.show();
          }
          mainWindow.focus();
          mainWindow.webContents.executeJavaScript('toggleSettings()');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit Todo Dreams',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Todo Dreams - Your personal task manager');

  // Handle tray click
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // Handle double-click
  tray.on('double-click', () => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });
}

function createTrayIcon() {
    const { nativeImage } = require('electron');
    const path = require('path');
    
    // Option 1: Use an icon file (create a simple 16x16 PNG icon)
    const iconPath = path.join(__dirname, 'icon.ico');
    if (require('fs').existsSync(iconPath)) {
      return nativeImage.createFromPath(iconPath);
    }
    
    // Option 2: Create from text (simple fallback)
    const canvas = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGBSURBVDiNpZM9SwNBEIafgwQLwcJCG1sLwcJCG9vYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFgJ+7wD9AAAAABJRU5ErkJggg==', 'base64');
    return nativeImage.createFromBuffer(canvas);
}

// Disable GPU acceleration to prevent GPU errors on some systems
app.disableHardwareAcceleration();

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  // Keep app running in system tray even when window is closed
  if (process.platform !== 'darwin') {
    // Don't quit on Windows/Linux - stay in tray
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
  }
});

app.on('before-quit', () => {
  app.isQuiting = true;
});

// IPC handlers for window controls
ipcMain.handle('minimize-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide(); // Hide to tray instead of minimize
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide(); // Hide to tray instead of closing
  }
});

ipcMain.handle('move-window', (event, deltaX, deltaY) => {
  if (mainWindow) {
    const [currentX, currentY] = mainWindow.getPosition();
    mainWindow.setPosition(currentX + deltaX, currentY + deltaY);
  }
});

// Data persistence handlers
const dataPath = path.join(os.homedir(), '.todo-app-data.json');

ipcMain.handle('save-todos', async (event, todos) => {
  try {
    await fs.promises.writeFile(dataPath, JSON.stringify(todos, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving todos:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-todos', async () => {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return { success: true, data: [] };
    }
    console.error('Error loading todos:', error);
    return { success: false, error: error.message };
  }
});

// Handle app protocol for Windows
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('todo-app', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('todo-app');
}