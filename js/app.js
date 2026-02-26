/**
 * iPhone Landing Lab - JavaScript Application
 * Interactividad completa del sitio con vanilla JavaScript
 * 
 * Funcionalidades:
 * - Menú responsive desplegable
 * - Scroll suave entre secciones
 * - Validación de formulario con feedback
 * - Animaciones activadas por scroll (IntersectionObserver)
 * - Interacciones en botones CTA
 * - Manejo de estados sin librerías externas
 */

// ============================================
// MODULE: Navigation Menu
// ============================================
const NavigationModule = (() => {
  const header = document.querySelector('header');
  const nav = document.querySelector('header nav');
  const navLinks = document.querySelectorAll('header nav a');

  const init = () => {
    if (!header || !nav) return;

    createMenuToggle();
    attachNavLinkListeners();
  };

  const createMenuToggle = () => {
    // Crear botón hamburguesa dinámicamente solo si la nav existe
    const menuButton = document.createElement('button');
    menuButton.setAttribute('aria-label', 'Alternar menú de navegación');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = '<span></span><span></span><span></span>';

    // Insertar antes de la nav
    nav.parentNode.insertBefore(menuButton, nav);

    // Estilo inline para el botón (no toca el CSS global)
    menuButton.style.cssText = `
      display: none;
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      flex-direction: column;
      gap: 0.4rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 24px;
      z-index: 200;
    `;

    const spans = menuButton.querySelectorAll('span');
    spans.forEach(span => {
      span.style.cssText = `
        display: block;
        width: 24px;
        height: 2px;
        background-color: var(--color-text-primary);
        transition: all 250ms ease;
      `;
    });

    // Mostrar el botón en pantallas pequeñas
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateMenuDisplay = () => {
      menuButton.style.display = mediaQuery.matches ? 'flex' : 'none';
      if (!mediaQuery.matches) nav.style.display = '';
    };

    mediaQuery.addListener(updateMenuDisplay);
    updateMenuDisplay();

    // Toggle del menú
    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        nav.style.display = '';
        animateMenuButton(menuButton, false);
      } else {
        nav.style.display = 'block';
        animateMenuButton(menuButton, true);
      }
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mediaQuery.matches) {
          menuButton.setAttribute('aria-expanded', 'false');
          nav.style.display = '';
          animateMenuButton(menuButton, false);
        }
      });
    });
  };

  const animateMenuButton = (button, isOpen) => {
    const spans = button.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  };

  const attachNavLinkListeners = () => {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Solo interceptar enlaces internos
        if (href.startsWith('#')) {
          e.preventDefault();
          document.body.removeAttribute('data-view');
          clearCvPanel();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  };

  return { init };
})();

// ============================================
// MODULE: Theme Toggle (Dark/Light)
// ============================================
const ThemeModule = (() => {
  const STORAGE_KEY = 'iphone-theme';
  const toggleButton = document.getElementById('theme-toggle');
  const toggleText = toggleButton?.querySelector('[data-theme-text]');

  const init = () => {
    if (!toggleButton) return;

    const storedTheme = getStoredTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    toggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (event) => {
      if (getStoredTheme()) return;
      applyTheme(event.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    toggleButton.setAttribute('aria-pressed', theme === 'dark');
    toggleButton.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
    if (toggleText) {
      toggleText.textContent = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
    }
  };

  const getStoredTheme = () => {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Silencioso si el almacenamiento no está disponible
    }
  };

  return { init };
})();

// ============================================
// MODULE: CV Dropdown + Renderer
// ============================================
const CvModule = (() => {
  const toggleButton = document.getElementById('cv-toggle');
  const menu = document.getElementById('cv-menu');
  const panel = document.getElementById('cv-panel');
  const section = document.getElementById('cv');

  const options = menu ? Array.from(menu.querySelectorAll('[data-cv]')) : [];

  const CV_CONTENT = {
    matheu: `
      <article class="cv-card">
        <header class="cv-card__header">
          <div>
            <h3 class="cv-card__name">Johnatan Matheu Ruales Galvis</h3>
            <p class="cv-card__subtitle">
              Estudiante de Ingenieria de Software (3er semestre) | Desarrollo de software
              (Full-Stack / IA / VR)
            </p>
            <p class="cv-card__meta">
              Universidad Cooperativa de Colombia (UCC) — Campus Pasto, Colombia
            </p>
          </div>
          <div class="cv-card__contacts">
            <span>
              GitHub:
              <a href="https://github.com/matheuruales" target="_blank" rel="noopener noreferrer">
                matheuruales
              </a>
            </span>
          </div>
        </header>
        <div class="cv-section">
          <h4>Perfil</h4>
          <p>
            Soy estudiante de Ingenieria de Software con enfoque en construir productos y
            prototipos integrando frontend, backend y automatizacion. He trabajado en
            proyectos de realidad virtual aplicada a educacion en salud y en integraciones
            para agentes de IA orientadas a mensajeria y workflows. Me adapto rapido entre
            desarrollo web, scripts y despliegues basicos, con foco en ejecucion y mejora
            continua.
          </p>
        </div>
        <div class="cv-section">
          <h4>Habilidades tecnicas</h4>
          <div class="cv-grid">
            <div>
              <h5>Frontend</h5>
              <ul>
                <li>HTML, CSS, JavaScript</li>
                <li>Construccion de interfaces web y mejoras de UX/UI</li>
              </ul>
            </div>
            <div>
              <h5>Backend / Scripts</h5>
              <ul>
                <li>Python, Java</li>
                <li>Desarrollo de logica, APIs y utilidades</li>
              </ul>
            </div>
            <div>
              <h5>Stack usado</h5>
              <ul>
                <li>React + TypeScript</li>
                <li>Java + Spring Boot</li>
                <li>PostgreSQL, Firebase (auth)</li>
                <li>n8n (automatizaciones)</li>
              </ul>
            </div>
            <div>
              <h5>IA / Agentes</h5>
              <ul>
                <li>Integracion con APIs de chat</li>
                <li>Definicion de capabilities e intenciones</li>
                <li>Automatizacion con webhooks</li>
              </ul>
            </div>
            <div>
              <h5>Visualizacion</h5>
              <ul>
                <li>Chart.js (graficos con datos CSV)</li>
              </ul>
            </div>
            <div>
              <h5>Herramientas / Infra</h5>
              <ul>
                <li>Git, GitLab</li>
                <li>SSH, Nginx</li>
                <li>Integraciones tipo Chatwoot</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="cv-section">
          <h4>Proyectos destacados</h4>
          <div class="cv-project">
            <h5>PulmoMed — Simulador VR avanzado para aprendizaje de cancer de pulmon (Investigacion, UCC)</h5>
            <ul class="cv-project-list">
              <li>Proyecto de investigacion orientado a estudiantes y profesionales de salud.</li>
              <li>Integracion de VR y componentes de IA para simular crecimiento y metastasis tumoral.</li>
              <li>Coordinacion de equipo de 3 integrantes con profesor asesor y personal de salud.</li>
            </ul>
          </div>
          <div class="cv-project">
            <h5>MimiPet — Plataforma para registrar y gestionar informacion de mascotas (Web/App + IA)</h5>
            <ul class="cv-project-list">
              <li>Diseno de flujos por pasos para registro de datos de salud y seguimiento.</li>
              <li>Estructura de modulos con autenticacion usando Firebase.</li>
            </ul>
          </div>
          <div class="cv-project">
            <h5>Conexion TikTok Inbox + Agente de IA (Integracion / Mensajeria)</h5>
            <ul class="cv-project-list">
              <li>Analisis de conversaciones para identificar capacidades e intenciones frecuentes.</li>
              <li>Integracion de servicios tipo inbox/CRM y webhooks (ej. Chatwoot).</li>
            </ul>
          </div>
          <div class="cv-project">
            <h5>Bitcoin Predictor Pro — Interfaz web de predicciones con graficos (Frontend)</h5>
            <ul class="cv-project-list">
              <li>Frontend en HTML/CSS/JS con Chart.js para visualizar datos historicos y predichos.</li>
              <li>Scripts en Python para prediccion con variabilidad y volatilidad realista.</li>
            </ul>
          </div>
          <div class="cv-project">
            <h5>pichu_run — Juego estilo Temple Run en Java</h5>
            <ul class="cv-project-list">
              <li>Juego 2D con generacion de obstaculos y control de aleatoriedad.</li>
            </ul>
          </div>
        </div>
        <div class="cv-section">
          <h4>Educacion</h4>
          <ul class="cv-list">
            <li>
              Universidad Cooperativa de Colombia (UCC), Campus Pasto — Ingenieria de Software
              (5 semestre, en curso).
            </li>
          </ul>
        </div>
      </article>
    `,
    luis: `
      <article class="cv-card">
        <header class="cv-card__header">
          <div>
            <h3 class="cv-card__name">Luis Castillo</h3>
            <p class="cv-card__meta">Colombia</p>
          </div>
          <div class="cv-card__contacts">
            <span>Tel: <a href="tel:+573137555023">+57 313 755 5023</a></span>
            <span>Email: <a href="mailto:luisestebancastillopedroza90@gmail.com">luisestebancastillopedroza90@gmail.com</a></span>
            <span>
              LinkedIn:
              <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/tuusuario
              </a>
            </span>
            <span>
              GitHub:
              <a href="https://github.com/lxiscxstillo" target="_blank" rel="noopener noreferrer">
                github.com/lxiscxstillo
              </a>
            </span>
          </div>
        </header>
        <div class="cv-section">
          <h4>Perfil profesional</h4>
          <p>
            Estudiante de Ingenieria con enfasis en desarrollo de software, tecnologias
            interactivas y arquitectura de sistemas. Experiencia en investigacion aplicada
            dentro de la Universidad Cooperativa de Colombia, participando en el diseno y
            desarrollo de un simulador en realidad aumentada orientado a la ensenanza del
            desarrollo fetal en estudiantes de medicina.
          </p>
          <p>
            Interesado en el desarrollo de aplicaciones web modernas, soluciones
            multiplataforma y sistemas interactivos con enfoque en experiencia de usuario.
            Con bases solidas en modelado de datos, diseno de bases de datos relacionales,
            principios de arquitectura de software y control de versiones.
          </p>
        </div>
        <div class="cv-section">
          <h4>Formacion academica</h4>
          <ul class="cv-list">
            <li>Ingenieria de Software / Ingenieria de Sistemas (En curso).</li>
            <li>Universidad Cooperativa de Colombia, Colombia.</li>
          </ul>
          <h4>Areas de formacion relevantes</h4>
          <ul class="cv-list">
            <li>Programacion y estructuras de datos.</li>
            <li>Bases de datos relacionales.</li>
            <li>Ingenieria de software.</li>
            <li>Arquitectura basica del computador.</li>
            <li>Gestion de proyectos de software.</li>
            <li>Modelado de sistemas.</li>
            <li>Desarrollo web.</li>
          </ul>
        </div>
        <div class="cv-section">
          <h4>Experiencia en investigacion</h4>
          <div class="cv-project">
            <h5>Desarrollador de Software — Proyecto de Simulador en Realidad Aumentada</h5>
            <p>Semillero de Investigacion, Universidad Cooperativa de Colombia.</p>
            <ul class="cv-project-list">
              <li>Diseno e implementacion del entorno interactivo usando Unity.</li>
              <li>Programacion de comportamientos y logica de interaccion para simulaciones dinamicas.</li>
              <li>Modelado de variables modificables que afectan el desarrollo fetal.</li>
              <li>Estructuracion de la arquitectura del proyecto dentro del motor grafico.</li>
              <li>Aplicacion de TIC como herramienta pedagogica.</li>
              <li>Pruebas funcionales y ajustes de usabilidad.</li>
            </ul>
          </div>
        </div>
        <div class="cv-section">
          <h4>Proyectos academicos relevantes</h4>
          <div class="cv-project">
            <h5>Simulador de Desarrollo Fetal en Realidad Aumentada</h5>
            <ul class="cv-project-list">
              <li>Desarrollo en Unity con interaccion en tiempo real.</li>
              <li>Diseno modular para escalabilidad de escenarios.</li>
              <li>Enfoque en aprendizaje inmersivo y didactico.</li>
            </ul>
          </div>
          <div class="cv-project">
            <h5>Desarrollo de Aplicaciones Web Modernas</h5>
            <ul class="cv-project-list">
              <li>Landing pages responsivas con HTML5 y CSS3.</li>
              <li>Aplicaciones con Next.js y TailwindCSS.</li>
              <li>Manejo de rutas, componentes y renderizado.</li>
              <li>Control de versiones con Git y GitHub.</li>
            </ul>
          </div>
          <div class="cv-project">
            <h5>Modelado y Gestion de Bases de Datos</h5>
            <ul class="cv-project-list">
              <li>Modelos entidad-relacion y normalizacion hasta 3FN.</li>
              <li>Implementacion en PostgreSQL con comandos DDL.</li>
              <li>Definicion de claves y relaciones 1:1, 1:N y N:M.</li>
            </ul>
          </div>
        </div>
        <div class="cv-section">
          <h4>Habilidades tecnicas</h4>
          <div class="cv-grid">
            <div>
              <h5>Lenguajes</h5>
              <ul>
                <li>JavaScript</li>
                <li>SQL</li>
              </ul>
            </div>
            <div>
              <h5>Tecnologias</h5>
              <ul>
                <li>Next.js</li>
                <li>TailwindCSS</li>
                <li>Unity</li>
              </ul>
            </div>
            <div>
              <h5>Bases de datos</h5>
              <ul>
                <li>PostgreSQL</li>
              </ul>
            </div>
            <div>
              <h5>Control de versiones</h5>
              <ul>
                <li>Git</li>
                <li>GitHub</li>
              </ul>
            </div>
            <div>
              <h5>Herramientas</h5>
              <ul>
                <li>Visual Studio Code</li>
              </ul>
            </div>
            <div>
              <h5>Conceptos</h5>
              <ul>
                <li>Arquitectura de software</li>
                <li>Programacion orientada a objetos</li>
                <li>Diseno responsivo</li>
                <li>Integracion de sistemas</li>
                <li>Modelado relacional</li>
                <li>Gestion del ciclo de vida del software</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="cv-section">
          <h4>Competencias profesionales</h4>
          <ul class="cv-list">
            <li>Analisis y resolucion estructurada de problemas.</li>
            <li>Traduccion de requerimientos funcionales en soluciones tecnicas.</li>
            <li>Trabajo colaborativo en entornos academicos.</li>
            <li>Investigacion aplicada en tecnologia educativa.</li>
            <li>Aprendizaje autonomo y actualizacion constante.</li>
            <li>Organizacion y gestion del tiempo.</li>
          </ul>
        </div>
        <div class="cv-section">
          <h4>Objetivo profesional</h4>
          <p>
            Desarrollarme como ingeniero de software participando en proyectos de alto impacto
            tecnologico, especialmente en desarrollo web, tecnologias interactivas o soluciones
            educativas digitales. Busco aportar pensamiento analitico y compromiso con la calidad
            del software.
          </p>
        </div>
      </article>
    `,
    bayron: `
      <article class="cv-card">
        <header class="cv-card__header">
          <div>
            <h3 class="cv-card__name">Bayron Felipe Jaramillo Galindres</h3>
            <p class="cv-card__subtitle">
              Estudiante de Ingenieria de Software con enfoque analitico y orientacion a resultados.
            </p>
            <p class="cv-card__meta">Universidad Cooperativa de Colombia, Campus Pasto</p>
          </div>
        </header>
        <div class="cv-section">
          <h4>Resumen</h4>
          <p>
            Estudiante con solida capacidad para el trabajo en equipo y rapida adaptacion a nuevas
            tecnologias, orientado a la resolucion eficiente de problemas e integracion de buenas
            practicas de desarrollo.
          </p>
        </div>
        <div class="cv-section">
          <h4>Experiencia</h4>
          <div class="cv-project">
            <h5>Encargado Administrativo y de Operaciones — Lubricantes y Vulcanizadora Narino</h5>
            <p>Tunquerres, Narino (2017 - actual).</p>
            <ul class="cv-project-list">
              <li>Mantenimiento y reparacion de vehiculos.</li>
              <li>Atencion al cliente y gestion de inventarios.</li>
              <li>Coordinacion con proveedores.</li>
              <li>Facturacion electronica y manejo de software de ventas.</li>
            </ul>
          </div>
        </div>
        <div class="cv-section">
          <h4>Proyectos y academia</h4>
          <ul class="cv-list">
            <li>Aplicacion VR educativa sobre gestacion usando Unity y gafas Meta Quest.</li>
            <li>Pagina web para floristeria con HTML5, CSS3 y JavaScript.</li>
            <li>Juego interactivo con Arduino y sensores sonoros y luminosos.</li>
            <li>Simulacion de trayectoria balistica en Python con NumPy y Matplotlib.</li>
          </ul>
        </div>
        <div class="cv-section">
          <h4>Habilidades tecnicas</h4>
          <div class="cv-tags">
            <span class="cv-tag">Python</span>
            <span class="cv-tag">Java</span>
            <span class="cv-tag">Django</span>
            <span class="cv-tag">Pandas</span>
            <span class="cv-tag">NumPy</span>
            <span class="cv-tag">SQLite</span>
            <span class="cv-tag">Docker</span>
            <span class="cv-tag">Git</span>
            <span class="cv-tag">GitHub</span>
            <span class="cv-tag">HTML5</span>
            <span class="cv-tag">CSS3</span>
            <span class="cv-tag">Unity</span>
            <span class="cv-tag">Blender</span>
            <span class="cv-tag">Oculus Rift</span>
            <span class="cv-tag">Arduino Uno</span>
            <span class="cv-tag">Azure Boards</span>
          </div>
        </div>
        <div class="cv-section">
          <h4>Educacion</h4>
          <ul class="cv-list">
            <li>Ingenieria de Software, Universidad Cooperativa de Colombia (5 semestre, en curso).</li>
            <li>Tecnico en Contabilizacion de Operaciones Comerciales (SENA).</li>
            <li>Bachillerato — Instituto Teresiano de Tunquerres.</li>
          </ul>
        </div>
        <div class="cv-section">
          <h4>Competencias blandas</h4>
          <ul class="cv-list">
            <li>Pensamiento analitico y toma de decisiones bajo presion.</li>
            <li>Adaptabilidad y organizacion del tiempo.</li>
            <li>Proactividad y trabajo en equipo.</li>
          </ul>
        </div>
        <div class="cv-section">
          <h4>Datos personales</h4>
          <ul class="cv-list">
            <li>Nacido el 11 de junio de 2004.</li>
            <li>Intereses: tecnologia, mecanica automotriz, actividad fisica y lectura.</li>
          </ul>
        </div>
      </article>
    `
  };

  const init = () => {
    if (!toggleButton || !menu || !panel) return;

    toggleButton.addEventListener('click', handleToggle);
    options.forEach(option => {
      option.addEventListener('click', () => handleSelect(option.dataset.cv));
    });

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
  };

  const handleToggle = () => {
    const isOpen = menu.classList.contains('is-open');
    setMenuOpen(!isOpen);
  };

  const handleOutsideClick = (event) => {
    if (!menu.classList.contains('is-open')) return;
    if (menu.contains(event.target) || toggleButton.contains(event.target)) return;
    setMenuOpen(false);
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  const setMenuOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggleButton.setAttribute('aria-expanded', open);
  };

  const handleSelect = (key) => {
    const html = CV_CONTENT[key];
    if (!html) return;

    panel.innerHTML = html;
    document.body.setAttribute('data-view', 'cv-only');

    options.forEach(option => {
      option.classList.toggle('is-active', option.dataset.cv === key);
    });

    setMenuOpen(false);

    ScrollAnimationModule.observeNewElements(
      panel.querySelectorAll('.cv-card, .cv-section, .cv-project, .cv-tag')
    );

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearCvPanel = () => {
    if (!panel) return;
    panel.innerHTML = '';
    options.forEach(option => option.classList.remove('is-active'));
  };

  return { init };
})();

// ============================================
// MODULE: Smooth Scroll
// ============================================
const SmoothScrollModule = (() => {
  const init = () => {
    // Detectar todos los enlaces internos que no sean de navegación
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      });
    });
  };

  return { init };
})();

// ============================================
// MODULE: Form Validation
// ============================================
const FormValidationModule = (() => {
  const form = document.querySelector('form');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  const inputs = {
    nombre: document.getElementById('nombre'),
    email: document.getElementById('email'),
    modelo: document.getElementById('modelo'),
    mensaje: document.getElementById('mensaje')
  };

  const init = () => {
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    setupFieldValidation();
    // Deshabilitar botón inicialmente
    updateSubmitButtonState();
  };

  const setupFieldValidation = () => {
    // Validación: Solo filtrar caracteres en nombre (sin mostrar error)
    // Validación real: Solo en blur y submit
    
    if (inputs.nombre) {
      // Filtrar caracteres no permitidos en tiempo real (sin mostrar error)
      inputs.nombre.addEventListener('input', (e) => {
        const letrasRegex = /[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g;
        e.target.value = e.target.value.replace(letrasRegex, '');
        // Actualizar estado del botón pero no mostrar error visual
        updateSubmitButtonState();
      });
      
      // Mostrar validación solo cuando pierde foco
      inputs.nombre.addEventListener('blur', () => {
        validateField('nombre');
      });
    }

    if (inputs.email) {
      // Mostrar validación solo cuando pierde foco
      inputs.email.addEventListener('blur', () => {
        validateField('email');
      });
    }

    if (inputs.mensaje) {
      // Solo actualizar estado del botón mientras escribe
      inputs.mensaje.addEventListener('input', () => {
        updateSubmitButtonState();
      });
      
      // Mostrar validación solo cuando pierde foco
      inputs.mensaje.addEventListener('blur', () => {
        validateField('mensaje');
      });
    }

    if (inputs.modelo) {
      // Validar y mostrar error al cambiar
      inputs.modelo.addEventListener('change', () => {
        validateField('modelo');
        updateSubmitButtonState();
      });
    }
  };

  const validateField = (fieldName) => {
    const field = inputs[fieldName];
    if (!field) return true;

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'nombre':
        const nombreRegex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,}$/;
        isValid = nombreRegex.test(field.value.trim());
        errorMessage = 'El nombre debe tener al menos 3 caracteres y solo puede contener letras';
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value);
        errorMessage = 'Ingresa un correo electrónico válido';
        break;

      case 'mensaje':
        isValid = field.value.trim().length >= 10;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        break;

      case 'modelo':
        isValid = field.value !== '';
        errorMessage = 'Selecciona un modelo';
        break;
    }

    displayFieldError(field, isValid, errorMessage);
    return isValid;
  };

  const displayFieldError = (field, isValid, errorMessage) => {
    // Remover mensaje anterior si existe
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Actualizar clases de validación
    field.classList.remove('field-invalid', 'field-valid');

    if (!isValid) {
      field.classList.add('field-invalid');
      
      const errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      errorElement.textContent = errorMessage;
      field.parentNode.appendChild(errorElement);
    } else {
      // Solo marcar como válido si el campo tiene valor
      if (field.value.trim() !== '') {
        field.classList.add('field-valid');
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos
    let allValid = true;
    Object.keys(inputs).forEach(fieldName => {
      const isValid = validateField(fieldName);
      allValid = allValid && isValid;
    });

    if (allValid) {
      // Desabilitar formulario durante envío
      disableFormDuringSubmit();
      
      // Mostrar loader
      showLoader();

      // Simular envío (2 segundos)
      setTimeout(() => {
        hideLoader();
        showSuccessMessage();

        // Resetear formulario después de 1.5 segundos
        setTimeout(() => {
          form.reset();
          removeSuccessMessage();
          // Limpiar clases de validación
          Object.values(inputs).forEach(input => {
            input.classList.remove('field-invalid', 'field-valid');
          });
          updateSubmitButtonState();
          enableFormAfterSubmit();
        }, 1500);
      }, 2000);
    }
  };

  const disableFormDuringSubmit = () => {
    submitBtn.disabled = true;
    Object.values(inputs).forEach(input => {
      input.disabled = true;
    });
  };

  const enableFormAfterSubmit = () => {
    Object.values(inputs).forEach(input => {
      input.disabled = false;
    });
    updateSubmitButtonState();
  };

  const showLoader = () => {
    const loaderDiv = document.createElement('div');
    loaderDiv.className = 'form-loader';
    loaderDiv.innerHTML = `
      <div class="loader-spinner"></div>
      <p>Enviando solicitud...</p>
    `;
    form.appendChild(loaderDiv);
  };

  const hideLoader = () => {
    const loader = document.querySelector('.form-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 300);
    }
  };

  const checkFormValidity = () => {
    let allValid = true;
    Object.keys(inputs).forEach(fieldName => {
      const field = inputs[fieldName];
      if (!field) return;

      let isValid = true;
      switch (fieldName) {
        case 'nombre':
          isValid = field.value.trim().length >= 3;
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailRegex.test(field.value);
          break;
        case 'mensaje':
          isValid = field.value.trim().length >= 10;
          break;
        case 'modelo':
          isValid = field.value !== '';
          break;
      }
      allValid = allValid && isValid;
    });
    return allValid;
  };

  const updateSubmitButtonState = () => {
    if (!submitBtn) return;
    
    const isFormValid = checkFormValidity();
    
    if (isFormValid) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-disabled');
    }
  };

  const showSuccessMessage = () => {
    let successDiv = document.querySelector('.form-success');
    if (!successDiv) {
      successDiv = document.createElement('div');
      successDiv.className = 'form-success';
      successDiv.innerHTML = `
        <div class="success-content">
          <span class="success-icon">✓</span>
          <p>¡Solicitud enviada exitosamente!</p>
          <p class="success-subtitle">Te contactaremos pronto.</p>
        </div>
      `;
      document.body.appendChild(successDiv);
    }
  };

  const removeSuccessMessage = () => {
    const successDiv = document.querySelector('.form-success');
    if (successDiv) {
      successDiv.classList.add('fade-out');
      setTimeout(() => successDiv.remove(), 300);
    }
  };

  return { init };
})();

// ============================================
// MODULE: Intersection Observer (Scroll Animations)
// ============================================
const ScrollAnimationModule = (() => {
  let observer = null;

  const init = () => {
    if (!('IntersectionObserver' in window)) return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos animables
    const animatableElements = document.querySelectorAll(
      'section article, section h2, #contacto form, img'
    );
    observeNewElements(animatableElements);
  };

  const observeNewElements = (elements) => {
    if (!observer || !elements) return;

    elements.forEach(element => {
      if (!element) return;
      element.classList.add('reveal');
      observer.observe(element);
    });
  };

  return { init, observeNewElements };
})();

// ============================================
// MODULE: CTA Button Interactions
// ============================================
const CTAModule = (() => {
  const init = () => {
    const ctaButtons = document.querySelectorAll('a[href="#contacto"], button[type="submit"]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });

      button.addEventListener('click', () => {
        const href = button.getAttribute('href');
        if (href === '#contacto') {
          const contactSection = document.getElementById('contacto');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            // Focus en el primer input del formulario
            const firstInput = document.querySelector('form input');
            if (firstInput) {
              setTimeout(() => firstInput.focus(), 500);
            }
          }
        }
      });
    });
  };

  return { init };
})();

// ============================================
// MODULE: Animated Counter (si existe)
// ============================================
const CounterModule = (() => {
  const init = () => {
    // Buscar elementos numéricos en el contenido (ej: precios, números)
    const numberElements = document.querySelectorAll(
      'section article p, section p:last-child'
    );

    // Implementación simplificada - se activa si hay elementos con números y scroll
    if (numberElements.length > 0) {
      setupCounterAnimation();
    }
  };

  const setupCounterAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          const text = entry.target.textContent;
          const matches = text.match(/\$(\d+)/g);
          
          if (matches) {
            animateNumber(entry.target);
            entry.target.dataset.counted = 'true';
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('p').forEach(p => observer.observe(p));
  };

  const animateNumber = (element) => {
    const text = element.textContent;
    const regex = /\$(\d+)/g;
    let match;
    const numbers = [];

    while ((match = regex.exec(text)) !== null) {
      numbers.push({
        original: match[0],
        value: parseInt(match[1]),
        start: match.index
      });
    }

    if (numbers.length === 0) return;

    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let newText = text;
      numbers.reverse().forEach(num => {
        const currentValue = Math.floor(num.value * progress);
        newText = newText.replace(num.original, `$${currentValue}`);
      });

      element.textContent = newText;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = text;
      }
    };

    animate();
  };

  return { init };
})();

// ============================================
// MODULE: Modal Handler (si existe)
// ============================================
const ModalModule = (() => {
  const init = () => {
    // Detectar si existe estructura modal en el HTML
    const modals = document.querySelectorAll('[role="dialog"], .modal, #modal');
    
    if (modals.length === 0) return;

    modals.forEach(modal => {
      const closeButtons = modal.querySelectorAll('[aria-label*="Cerrar"], [aria-label*="Close"], .modal-close');
      
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        });
      });

      // Cerrar con ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });

      // Cerrar al hacer click fuera
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    });
  };

  return { init };
})();

// ============================================
// MODULE: Scroll Effects
// ============================================
const ScrollModule = (() => {
  const header = document.querySelector('header');

  const init = () => {
    if (!header) {
      console.error('ScrollModule: No se encontró el elemento header');
      return;
    }
    
    console.log('ScrollModule: Inicializado correctamente');
    
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY || window.pageYOffset;
      
      if (scrollPos > 50) {
        if (!header.classList.contains('scrolled')) {
          header.classList.add('scrolled');
          console.log('ScrollModule: Clase "scrolled" agregada');
        }
      } else {
        if (header.classList.contains('scrolled')) {
          header.classList.remove('scrolled');
          console.log('ScrollModule: Clase "scrolled" removida');
        }
      }
    }, { passive: true });
  };

  return { init };
})();

// ============================================
// APP INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar todos los módulos
  NavigationModule.init();
  ThemeModule.init();
  CvModule.init();
  SmoothScrollModule.init();
  FormValidationModule.init();
  ScrollAnimationModule.init();
  CTAModule.init();
  CounterModule.init();
  ModalModule.init();
  ScrollModule.init();

  // Log de inicialización en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('iPhone Landing Lab - Aplicación inicializada exitosamente');
  }
});

// ============================================
// UTILITY: Performance Optimization
// ============================================
// Implementar lazy loading de imágenes si está disponible
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-lazy]');
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.lazy;
          img.removeAttribute('data-lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}
