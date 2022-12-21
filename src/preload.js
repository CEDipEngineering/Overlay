// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, BrowserWindow } = require("electron");
const { currentLoad, mem, cpuTemperature } = require("systeminformation");
const iro = require('@jaames/iro');

const zeroPad = (num, places) => String(num).padStart(places, '0');
function clock() {
    const curr_time = new Date();
    let hours = curr_time.getHours();
    let minutes = curr_time.getMinutes();
    let seconds = curr_time.getSeconds();
    return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`
}

contextBridge.exposeInMainWorld( 
    "api", 
    {
        close : () => ipcRenderer.send("close-app"),
        color : (id) => new iro.ColorPicker(id),
        getClock : () => clock(),
        getCpuUsage : () => currentLoad(),
        getMem : () => mem(),
        getTemp : () => cpuTemperature(),
    }
);
