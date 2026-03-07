/* ========================================
   360° Panorama Viewer — App Logic
   ======================================== */

// ── Hotspot Data ──
const hotspots = [
    {
        pitch: 10,
        yaw: -20,
        icon: '📜',
        title: 'LAS SS',
        description: 'Bienvenido a Sesiones Sonar. Grabado en vivo y en directo desde las entrañas de XNR Central. Sonido crudo, sin cortes.',
        type: 'info'
    },
    {
        pitch: -5,
        yaw: 30,
        icon: '💼',
        title: 'Presskit Patrocinadores',
        URL: 'assets/ui/presskit-marcas.pdf',
        type: 'link'
    },
    {
        pitch: 0,
        yaw: 80,
        icon: '🎸',
        title: 'Toca en Las SS (Convocatoria)',
        URL: 'https://ideascomobalas.com/contacto',
        type: 'link'
    },
    {
        pitch: -15,
        yaw: -70,
        icon: '📰',
        title: 'Notas de las Sesiones',
        URL: 'https://ideascomobalas.com/blog',
        type: 'link'
    },
    {
        pitch: 5,
        yaw: 130,
        icon: '📼',
        title: 'Catálogo Completo',
        URL: '/catalogo/index.html',
        type: 'link'
    },
    {
        pitch: 20,
        yaw: -140,
        icon: '📺',
        title: 'Canal Oficial (Abrir en App)',
        URL: 'https://yt.ideascomobalas.com/canal',
        type: 'link'
    },
    {
        pitch: -20,
        yaw: 180,
        icon: '📱',
        title: 'Instagram',
        URL: 'https://instagram.com/ideascomobalas',
        type: 'link'
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
function createHotspotElement(hotspotDiv, args) {
    hotspotDiv.classList.add('custom-hotspot');
    // We expect the icon to be passed in args
    if (args && args.icon) {
        hotspotDiv.textContent = args.icon;
    }
}

// ── Initialize Pannellum ──
const viewer = pannellum.viewer('panorama', {
    type: 'equirectangular',
    panorama: 'assets/360/lobby-xnr.jpg',
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
    hotSpots: hotspots.map((hs, i) => {
        let spotConfig = {
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: 'custom',
            createTooltipFunc: createHotspotElement,
            createTooltipArgs: { icon: hs.icon },
        };

        if (hs.type === 'link') {
            spotConfig.URL = hs.URL;
            spotConfig.clickHandlerFunc = () => {
                window.location.href = hs.URL;
            };
        } else {
            spotConfig.clickHandlerFunc = () => showInfo(i);
        }

        return spotConfig;
    })
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

        // Action after camera moves
        setTimeout(() => {
            if (hs.type === 'link') {
                window.location.href = hs.URL;
            } else {
                showInfo(index);
            }
        }, 800);
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
