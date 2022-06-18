const glasstron = require('glasstron');
const electron = require('electron');
const path = require('path')
const remote = require("@electron/remote/main")
const Store = require('electron-store');
const store = new Store();
let appTray = null;
remote.initialize();
let win;
electron.app.commandLine.appendSwitch("enable-transparent-visuals");
electron.app.on('ready', () => {
	setTimeout(
		spawnWindow,
		process.platform == "linux" ? 1000 : 0
		// Electron has a bug on linux where it
		// won't initialize properly when using
		// transparency. To work around that, it
		// is necessary to delay the window
		// spawn function.
	);
	});

function spawnWindow(){
	win = new glasstron.BrowserWindow({
		width: 450,
		height: 294,
		frame: false,
		resizable:false,
		show:false,
		transparent:true,
		hasShadow:true,
		webPreferences:{
	  		nodeIntegration: true, 
	  		contextIsolation: false
    	}
	});
	win.blurType = "blurbehind";
	win.setBlur(true);
	win.loadFile('app/index.html')
	win.setHasShadow(true)
	win.removeMenu() 
	//win.setAlwaysOnTop("alwaysOnTop")
	//win.webContents.openDevTools({mode:"detach"})
	remote.enable(win.webContents)
  var trayMenuTemplate = [
  {
        label: "Refresh",        
        click: function() {
            win.webContents.send('refresh')     
        } 
    },
    {type: 'separator'},
    {
        label: "Configuration",        
        click: function() {
            win.show();         
        } 
    },{
        label: "Exit",        
        click: function() {
            electron.app.exit();        
        } 
    }
    ];
    let iconPath = path.join(__dirname, "./icon.ico");
    let appTray = new electron.Tray(iconPath);
    console.log(iconPath);
    const contextMenu = electron.Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip("Cot Online Wallpaper");
    appTray.setContextMenu(contextMenu);
    if(store.get('firstrun')!="no"){
    	win.show();
		store.set('firstrun', 'no');
    }
	return win;
}