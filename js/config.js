const modeNormal = {
    time: 60,
    showPoke: true,
    colors: true,
    showTime: 10
};
const modeSuper = {
    time: 0,
    showPoke: true,
    colors: true,
    showTime: 5
};
const modeUltra = {
    time: 0,
    showPoke: false,
    colors: false,
    showTime: 0
};
const modeQuick = {
    time: 300,
    showPoke: false,
    colors: true,
    showTime: 0
};

let config = modeNormal;

function setConfig() {
    let time = document.getElementById('time').value;
    let showPoke = document.getElementById('showPoke').value == "on";
    let colors = document.getElementById('coloresPoke').value;
    let showTime = document.getElementById('showTime').value == "on";
    config = {
        time,
        showPoke,
        colors,
        showTime
    };
    console.log(config);
    localStorage.setItem('config', JSON.stringify(config));
}

function changeMode(mode) {
    console.log(mode);
    switch (mode) {
        case 'normal':
            config = modeNormal;
            break;
        case 'super':
            config = modeSuper;
            break;
        case 'ultra':
            config = modeUltra;
            break
        case 'quick':
            config = modeQuick;
            break;
        default:
            config = modeNormal;
            break;
    }
    tablinks = document.getElementsByClassName("modo");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(mode).className += " active";
    localStorage.setItem('config', JSON.stringify(config));
}

async function useConfig() {
    config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : modeNormal;
    console.log(config);
    if (config.colors) {
        suggestColors();
    }
    if (config.showPoke) {
        const src = await getPokemonImage();
        console.log(src);
        document.getElementById('showPokeImg').src = src;
        document.getElementById('dialog-showPoke').showModal();
        if (config.showTime > 0) {
            setTimeout(closeModal, config.showTime * 1000)
        }
    } else {
        if (config.time > 0) {
            setTimeout(() => iniciarCronometro(config.time), 500);
        }
    }
}

function closeModal() {
    document.getElementById('dialog-showPoke').close();
    if (config.time > 0) {
        setTimeout(() => iniciarCronometro(config.time), 1000);
    }
}