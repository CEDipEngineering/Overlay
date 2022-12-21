
// Global DOM elements
CLOCK = document.getElementById("clock");
CPU_USAGE = document.getElementById("cpu");
RAM_USAGE = document.getElementById("ram");
CLOSE_BTN = document.getElementById("close");
COLOR_BTN = document.getElementById("colorpicker");

// Support functions
const zeroPad = (num, places) => String(num).padStart(places, '0');
function updateAllColors(color){
    CLOCK.style.color = color;
    CPU_USAGE.style.color = color;
    RAM_USAGE.style.color = color;
}

//=============
//== Buttons ==
//=============
// Close
CLOSE_BTN.addEventListener("click", () => 
    {
        api.close()
    }
);
// Random Color
COLOR_BTN.addEventListener("click", () => 
    {
        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16) + Math.floor(Math.random()*100 + 155).toString(16);
        if (randomColor.length != 9) {
            randomColor = "#ffcc44ff"
        }
        window.localStorage.setItem("Color", randomColor);
        updateAllColors(randomColor);
    }
);
// Reset Color
COLOR_BTN.addEventListener("contextmenu", () => 
    {
        updateAllColors("#25E000e9");
        window.localStorage.setItem("Color", "#25E000e9");
    }
);

// Color caching
const startColor = window.localStorage.getItem("Color");
if (!startColor) {
    window.localStorage.setItem("Color", "#25E000e9");
    const startColor = "#25E000e9";
}
updateAllColors(startColor);

// Update text every 1000ms or 1s.
setInterval(UpdateStats, 1000);

// Fetch from api
async function fetchAll() {
    // Create all promises
    const time = api.getClock();
    const cpu = api.getCpuUsage();
    const ram = api.getMem();
    // const temp = api.getTemp();

    // Await all promises, let them run in parallel
    const out = {
        "time": await time,
        "cpu": await cpu,
        "ram": await ram,
        // "temp": await temp,
    }
    return out
}

// Update text
async function UpdateStats() {
    const stats = await fetchAll();
    const time = stats.time;
    const cpu = stats.cpu;
    const ram = stats.ram;
    // const temp = stats.temp;
    
    // Update time
    CLOCK.innerText = time;

    // Update cpu
    const use = cpu.currentLoad.toFixed(1);
    CPU_USAGE.innerText = `CPU: ${(zeroPad(use, 4))}%`;
    // if (temp.max) {
    //     CPU_USAGE.innerText = `CPU: ${(zeroPad(use, 4))}%\t${temp.max.toFixed(1)}°C`;
    // } else {
    //     CPU_USAGE.innerText = `CPU: ${(zeroPad(use, 4))}%`;
    // }

    // Update ram
    const total = ((ram.total - 2.4) / 1e9).toFixed(1); // Subtract amount for no reason
    const used  = ((ram.used  - 2)   / 1e9).toFixed(1); // Seriously, I have no clue why, but this makes it match exactly with Task Manager
    RAM_USAGE.innerText = `RAM: ${used}/${total}(GB)`

}