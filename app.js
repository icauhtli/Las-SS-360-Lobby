/* ========================================
   360° Panorama Viewer — App Logic
   ======================================== */

// ── Hotspot Data ──
const hotspots = [
    {
        pitch: 0,
        yaw: -30,
        iconUrl: 'assets/ui/icon-manifiesto.png',
        title: 'LAS SS',
        description: 'Bienvenido a Sesiones Sonar. Grabado en vivo y en directo desde las entrañas de XNR Central. Sonido crudo, sin cortes.',
        type: 'info'
    },
    {
        pitch: 0,
        yaw: -20,
        iconUrl: 'assets/ui/icon-presskit.png',
        title: 'Presskit Patrocinadores',
        URL: 'assets/ui/presskit-marcas.pdf',
        type: 'link'
    },
    {
        pitch: 0,
        yaw: -10,
        iconUrl: 'assets/ui/icon-convocatoria.png',
        title: 'Toca en Las SS (Convocatoria)',
        URL: 'https://ideascomobalas.com/contacto',
        type: 'link'
    },
    {
        pitch: 0,
        yaw: 0,
        iconUrl: 'assets/ui/icon-notas.png',
        title: 'Notas de las Sesiones',
        URL: 'https://ideascomobalas.com/blog',
        type: 'link'
    },
    {
        pitch: 0,
        yaw: 10,
        iconUrl: 'assets/ui/icon-catalogo.png',
        title: 'Catálogo Completo',
        URL: '/catalogo/index.html',
        type: 'link'
    },
    {
        pitch: 0,
        yaw: 20,
        iconUrl: 'assets/ui/icon-yt.png',
        title: 'Canal Oficial (Abrir en App)',
        URL: 'https://yt.ideascomobalas.com/canal',
        type: 'link'
    },
    {
        pitch: 0,
        yaw: 30,
        iconUrl: 'assets/ui/icon-ig.png',
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
const navMenu = document.getElementById('nav-menu');
const menuToggle = document.getElementById('menu-toggle');
const navItems = document.querySelectorAll('.nav-item');

// ── Create custom hotspot element ──
function createHotspotElement(hotspotDiv, args) {
    hotspotDiv.classList.add('custom-hotspot');
    // We expect the iconUrl to be passed in args
    if (args && args.iconUrl) {
        let img = document.createElement('img');
        img.src = args.iconUrl;
        img.alt = '';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        // Add a fallback pixel-art text just in case images are missing
        img.onerror = () => { img.style.display = 'none'; hotspotDiv.textContent = '?'; };
        hotspotDiv.appendChild(img);
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
            createTooltipArgs: { iconUrl: hs.iconUrl },
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

    // Highlight active nav item
    navItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// ── Close Info Panel ──
function closeInfo() {
    infoPanel.classList.remove('active');
    navItems.forEach(item => item.classList.remove('active'));
    // Resume auto-rotate after closing
    setTimeout(() => viewer.setAutoRotate(-1.5), 2000);
}

infoClose.addEventListener('click', closeInfo);

// ── Hamburger Menu Toggle ──
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ── Navigation Items ──
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const hs = hotspots[index];
        // Close menu on selection (optional but recommended for UX)
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');

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
