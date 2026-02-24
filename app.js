/* ========================================
   360° Panorama Viewer — App Logic
   ======================================== */

// ── Hotspot Data ──
const hotspots = [
    {
        pitch: 10,
        yaw: -30,
        icon: '🌿',
        title: 'Sky Gardens',
        description: 'Jardines verticales que cubren los rascacielos, purificando el aire de la ciudad y creando ecosistemas urbanos autosuficientes con más de 200 especies de plantas.'
    },
    {
        pitch: -5,
        yaw: 80,
        icon: '💜',
        title: 'Neon District',
        description: 'El corazón cultural de la ciudad, donde el arte holográfico y las luces neón crean una atmósfera vibrante las 24 horas. Hogar de galerías inmersivas y mercados nocturnos.'
    },
    {
        pitch: 25,
        yaw: 160,
        icon: '🏛️',
        title: 'Glass Tower',
        description: 'La torre central de cristal inteligente que genera energía solar y actúa como hub de comunicaciones para toda la metrópolis. Su fachada cambia de color según la hora del día.'
    },
    {
        pitch: 20,
        yaw: -120,
        icon: '🚀',
        title: 'Sky Transit',
        description: 'Sistema de transporte aéreo autónomo que conecta todos los distritos. Vehículos eléctricos silenciosos recorren rutas predefinidas a velocidades de hasta 200 km/h.'
    },
    {
        pitch: -10,
        yaw: -170,
        icon: '⚡',
        title: 'Energy Core',
        description: 'La planta de fusión compacta que alimenta toda la ciudad. Energía limpia e inagotable distribuida a través de una red subterránea de superconductores.'
    },
    {
        pitch: 15,
        yaw: 30,
        icon: '🎭',
        title: 'Holo Plaza',
        description: 'La plaza central de entretenimiento con proyecciones holográficas a escala monumental. Conciertos, teatro y arte digital se fusionan en experiencias multisensoriales.'
    },
    {
        pitch: -8,
        yaw: -80,
        icon: '🌊',
        title: 'Aqua Level',
        description: 'Sistema de purificación y reciclaje de agua integrado en la infraestructura urbana. Cascadas artificiales que filtran y redistribuyen agua potable a toda la ciudad.'
    }
];

// ── DOM References ──
const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoDesc = document.getElementById('info-description');
const infoIcon = document.getElementById('info-icon');
const infoClose = document.getElementById('info-close');
const navDots = document.querySelectorAll('.nav-dot');

// ── Create custom hotspot element ──
function createHotspotElement(hotspotDiv) {
    hotspotDiv.classList.add('custom-hotspot');
}

// ── Initialize Pannellum ──
const viewer = pannellum.viewer('panorama', {
    type: 'equirectangular',
    panorama: 'assets/panorama.png',
    autoLoad: true,
    autoRotate: -1.5,
    autoRotateInactivityDelay: 4000,
    compass: false,
    showControls: false,
    showFullscreenCtrl: false,
    showZoomCtrl: false,
    hfov: 110,
    minHfov: 60,
    maxHfov: 120,
    pitch: 5,
    yaw: 0,
    hotSpots: hotspots.map((hs, i) => ({
        pitch: hs.pitch,
        yaw: hs.yaw,
        type: 'custom',
        createTooltipFunc: createHotspotElement,
        clickHandlerFunc: () => showInfo(i)
    }))
});

// ── Show Info Panel ──
function showInfo(index) {
    const hs = hotspots[index];

    // Animate icon by resetting it
    infoIcon.style.animation = 'none';
    void infoIcon.offsetHeight; // trigger reflow
    infoIcon.style.animation = '';

    infoIcon.textContent = hs.icon;
    infoTitle.textContent = hs.title;
    infoDesc.textContent = hs.description;

    infoPanel.classList.add('active');

    // Stop auto-rotate when interacting
    viewer.setAutoRotate(0);

    // Highlight active dot
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ── Close Info Panel ──
function closeInfo() {
    infoPanel.classList.remove('active');
    navDots.forEach(dot => dot.classList.remove('active'));
    // Resume auto-rotate after closing
    setTimeout(() => viewer.setAutoRotate(-1.5), 2000);
}

infoClose.addEventListener('click', closeInfo);

// ── Navigation Dots ──
navDots.forEach((dot, index) => {
    // Set display number (1-indexed)
    dot.querySelector('::before') || null;

    dot.addEventListener('click', () => {
        const hs = hotspots[index];
        // Animate camera to hotspot
        viewer.lookAt(hs.pitch, hs.yaw, undefined, 1500);

        // Show info after camera moves
        setTimeout(() => showInfo(index), 800);
    });
});

// ── Keyboard: Escape to close panel ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInfo();
    }
});

// ── Hide header after some time ──
setTimeout(() => {
    const header = document.getElementById('site-header');
    header.style.transition = 'opacity 1.5s ease';
    header.style.opacity = '0';
    header.style.pointerEvents = 'none';
}, 8000);
