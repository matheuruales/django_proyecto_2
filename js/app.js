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
        background-color: #000;
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
  };

  const setupFieldValidation = () => {
    // Validación en tiempo real para campos
    if (inputs.nombre) {
      inputs.nombre.addEventListener('blur', () => {
        validateField('nombre');
      });
    }

    if (inputs.email) {
      inputs.email.addEventListener('blur', () => {
        validateField('email');
      });
    }

    if (inputs.mensaje) {
      inputs.mensaje.addEventListener('blur', () => {
        validateField('mensaje');
      });
    }

    if (inputs.modelo) {
      inputs.modelo.addEventListener('change', () => {
        validateField('modelo');
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
        isValid = field.value.trim().length >= 3;
        errorMessage = 'El nombre debe tener al menos 3 caracteres';
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

    if (!isValid) {
      const errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      errorElement.textContent = errorMessage;
      errorElement.style.cssText = `
        display: block;
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: slideInLeft 0.3s ease-out;
      `;
      field.parentNode.appendChild(errorElement);
      field.style.borderColor = '#dc2626';
    } else {
      field.style.borderColor = '';
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
      showSuccessMessage();
      // Aquí iría el envío real del formulario
      setTimeout(() => {
        form.reset();
        removeSuccessMessage();
      }, 2000);
    }
  };

  const showSuccessMessage = () => {
    let successDiv = document.querySelector('.form-success');
    if (!successDiv) {
      successDiv = document.createElement('div');
      successDiv.className = 'form-success';
      successDiv.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInLeft 0.3s ease-out;
        font-weight: 500;
      `;
      successDiv.textContent = '✓ Solicitud enviada exitosamente. Te contactaremos pronto.';
      document.body.appendChild(successDiv);
    }
  };

  const removeSuccessMessage = () => {
    const successDiv = document.querySelector('.form-success');
    if (successDiv) {
      successDiv.style.animation = 'fadeIn 0.3s ease-out reverse';
      setTimeout(() => successDiv.remove(), 300);
    }
  };

  return { init };
})();

// ============================================
// MODULE: Intersection Observer (Scroll Animations)
// ============================================
const ScrollAnimationModule = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Agregar animación al elemento
          entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos animables
    const animatableElements = document.querySelectorAll(
      'section article, #lineup h2, #beneficios article, #caracteristicas article, #testimonios article, #contacto form'
    );

    animatableElements.forEach(element => {
      // Solo agregar si no tiene animación inline ya
      if (!element.style.animation) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
      }
    });

    // También animar imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.style.animation) {
        observer.observe(img);
      }
    });
  };

  return { init };
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
      'p:contains("$"), section article p:last-child'
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
// APP INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar todos los módulos
  NavigationModule.init();
  SmoothScrollModule.init();
  FormValidationModule.init();
  ScrollAnimationModule.init();
  CTAModule.init();
  CounterModule.init();
  ModalModule.init();

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
