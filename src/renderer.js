CLOCK = document.getElementById("clock");
CPU_USAGE = document.getElementById("cpu");
RAM_USAGE = document.getElementById("ram");
CLOSE_BTN = document.getElementById("close");
CLOSE_BTN.addEventListener("click", () => {api.close()});

const zeroPad = (num, places) => String(num).padStart(places, '0');


setInterval(UpdateStats, 1000);

async function fetchAll() {
    // Create all promises
    const time = api.getClock();
    const cpu = api.getCpuUsage();
    const ram = api.getMem();
    const temp = api.getTemp();

    // Await all promises, let them run in parallel
    const out = {
        "time": await time,
        "cpu": await cpu,
        "ram": await ram,
        "temp": await temp,
    }
    return out
}

async function UpdateStats() {
    const stats = await fetchAll();
    const time = stats.time;
    const cpu = stats.cpu;
    const ram = stats.ram;
    const temp = stats.temp;
    
    // Update time
    CLOCK.innerText = time;

    // Update cpu
    const use = cpu.currentLoad.toFixed(1);
    if (temp.max) {
        CPU_USAGE.innerText = `CPU: ${(zeroPad(use, 4))}%\t${temp.max.toFixed(1)}°C`;
    } else {
        CPU_USAGE.innerText = `CPU: ${(zeroPad(use, 4))}%`;
    }

    // Update ram
    const total = (ram.total / 1e9).toFixed(1) - 2;
    const used  = (ram.used / 1e9).toFixed(1);
    RAM_USAGE.innerText = `RAM: ${used}/${total}(GB)`

}