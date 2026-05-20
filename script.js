document.addEventListener('DOMContentLoaded', function () {
  setupLogoNavigation();
  setupTestimonialSlider();
  setupSiteSearch();
  setupUniversalUserManagement();
});

function setupLogoNavigation() {
  const logos = document.querySelectorAll('.logo');

  logos.forEach(function (logo) {
    logo.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  });
}

function setupTestimonialSlider() {
  const slider = document.querySelector('.testimonios-slider');
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');

  if (!slider || !nextButton || !prevButton) {
    return;
  }

  nextButton.addEventListener('click', function () {
    slider.scrollLeft += 320;
  });

  prevButton.addEventListener('click', function () {
    slider.scrollLeft -= 320;
  });
}

function setupSiteSearch() {
  const trigger = document.getElementById('buscador');
  const searchUI = ensureSearchUI();

  if (!trigger || !searchUI) {
    return;
  }

  const panel = searchUI.panel;
  const input = searchUI.input;
  const results = searchUI.results;
  const closeButton = searchUI.closeButton;

  const searchableItems = [
    {
      title: 'Reposteria personalizada',
      description: 'Tortas, cupcakes, galletas decoradas y postres hechos para fechas especiales.',
      url: 'reposteria.html',
      keywords: ['tortas', 'cupcakes', 'galletas', 'postres', 'dulces', 'cumpleanos']
    },
    {
      title: 'Eventos',
      description: 'Montajes y detalles para celebraciones familiares, sociales y corporativas.',
      url: 'eventos.html',
      keywords: ['fiestas', 'celebraciones', 'decoracion', 'mesas dulces', 'montajes']
    },
    {
      title: 'Detalles personalizados',
      description: 'Regalos creativos y recordatorios pensados para sorprender.',
      url: 'detalles.html',
      keywords: ['regalos', 'detalles', 'sorpresas', 'recordatorios', 'personalizados']
    },
    {
      title: 'Empresarial',
      description: 'Opciones para marcas, equipos de trabajo, clientes y fechas corporativas.',
      url: 'empresarial.html',
      keywords: ['empresa', 'corporativo', 'clientes', 'marca', 'empleados']
    },
    {
      title: 'Temporada',
      description: 'Productos y detalles especiales para fechas destacadas del ano.',
      url: 'temporada.html',
      keywords: ['navidad', 'amor y amistad', 'madre', 'padre', 'temporada']
    },
    {
      title: 'Servicios',
      description: 'Conoce todas las soluciones creativas y dulces disponibles.',
      url: 'servicios.html',
      keywords: ['servicio', 'catalogo', 'opciones', 'atencion']
    },
    {
      title: 'Catering',
      description: 'Servicio de catering dulce y salado para reuniones y eventos.',
      url: 'catering.html',
      keywords: ['catering', 'pasabocas', 'eventos', 'mesa', 'comida']
    },
    {
      title: 'Nuestra historia',
      description: 'Descubre la esencia de la marca y el recorrido de Anny Cano.',
      url: 'conocehistoria.html',
      keywords: ['historia', 'nosotros', 'marca', 'anny cano']
    },
    {
      title: 'Nuestros clientes',
      description: 'Experiencias y confianza construidas con quienes ya eligieron la marca.',
      url: 'nuestroclientes.html',
      keywords: ['clientes', 'testimonios', 'casos', 'experiencias']
    },
    {
      title: 'Contacto e informacion',
      description: 'Canales para resolver dudas, pedir cotizaciones o hablar por WhatsApp.',
      url: 'contacto.html',
      keywords: ['contacto', 'informacion', 'whatsapp', 'cotizacion', 'pedido']
    }
  ];

  injectSearchStyles();
  renderResults(searchableItems);
  trigger.setAttribute('href', '#');
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', function (event) {
    event.preventDefault();
    openSearch();
  });

  closeButton.addEventListener('click', function () {
    closeSearch();
  });

  input.addEventListener('input', function (event) {
    const query = normalizeText(event.target.value.trim());

    if (!query) {
      renderResults(searchableItems);
      return;
    }

    const filteredItems = searchableItems.filter(function (item) {
      const searchableText = normalizeText([
        item.title,
        item.description,
        item.keywords.join(' ')
      ].join(' '));

      return searchableText.includes(query);
    });

    renderResults(filteredItems, event.target.value.trim());
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const firstLink = results.querySelector('a');

      if (firstLink) {
        window.location.href = firstLink.href;
      }
    }
  });

  document.addEventListener('click', function (event) {
    const clickedOutside = !panel.contains(event.target) && !trigger.contains(event.target);

    if (panel.classList.contains('is-open') && clickedOutside) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      closeSearch();
    }
  });

  function openSearch() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    input.focus();
    input.select();
    document.body.classList.add('search-open');
  }

  function closeSearch() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('search-open');
  }

  function renderResults(items, query) {
    results.innerHTML = '';

    if (!items.length) {
      const emptyState = document.createElement('li');
      emptyState.className = 'resultado-vacio';
      emptyState.textContent = 'No encontramos resultados para "' + query + '".';
      results.appendChild(emptyState);
      return;
    }

    items.forEach(function (item) {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      const title = document.createElement('strong');
      const description = document.createElement('span');

      link.href = item.url;
      link.className = 'resultado-link';

      title.textContent = item.title;
      description.textContent = item.description;

      link.appendChild(title);
      link.appendChild(description);
      listItem.appendChild(link);
      results.appendChild(listItem);
    });
  }
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function ensureSearchUI() {
  const existingPanel = document.getElementById('buscador-panel');
  const existingInput = document.getElementById('input-busqueda');
  const existingResults = document.getElementById('resultados-busqueda');
  const existingCloseButton = document.getElementById('cerrar-buscador');

  if (existingPanel && existingInput && existingResults && existingCloseButton) {
    existingPanel.setAttribute('aria-hidden', 'true');
    existingPanel.setAttribute('role', 'dialog');
    existingPanel.setAttribute('aria-label', 'Buscador del sitio');

    return {
      panel: existingPanel,
      input: existingInput,
      results: existingResults,
      closeButton: existingCloseButton
    };
  }

  const panel = document.createElement('div');
  const content = document.createElement('div');
  const input = document.createElement('input');
  const closeButton = document.createElement('button');
  const results = document.createElement('ul');

  panel.id = 'buscador-panel';
  panel.className = 'buscador-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Buscador del sitio');

  content.className = 'buscador-contenido';

  input.id = 'input-busqueda';
  input.type = 'text';
  input.placeholder = 'Buscar productos, servicios o paginas...';
  input.autocomplete = 'off';

  closeButton.id = 'cerrar-buscador';
  closeButton.type = 'button';
  closeButton.textContent = 'X';
  closeButton.setAttribute('aria-label', 'Cerrar buscador');

  results.id = 'resultados-busqueda';

  content.appendChild(input);
  content.appendChild(closeButton);
  panel.appendChild(content);
  panel.appendChild(results);
  document.body.appendChild(panel);

  return {
    panel: panel,
    input: input,
    results: results,
    closeButton: closeButton
  };
}

function injectSearchStyles() {
  if (document.getElementById('search-runtime-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'search-runtime-styles';
  style.textContent = [
    '.buscador-panel {',
    '  position: fixed;',
    '  inset: 88px 16px auto;',
    '  width: min(680px, calc(100vw - 32px));',
    '  margin: 0 auto;',
    '  background: #fffdf8;',
    '  border: 1px solid #eadfbe;',
    '  border-radius: 20px;',
    '  box-shadow: 0 18px 45px rgba(51, 51, 51, 0.18);',
    '  padding: 18px;',
    '  z-index: 1200;',
    '  opacity: 0;',
    '  visibility: hidden;',
    '  transform: translateY(-12px);',
    '  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;',
    '}',
    '.buscador-panel.is-open {',
    '  opacity: 1;',
    '  visibility: visible;',
    '  transform: translateY(0);',
    '}',
    '.buscador-contenido {',
    '  display: flex;',
    '  gap: 12px;',
    '  align-items: center;',
    '}',
    '#input-busqueda {',
    '  width: 100%;',
    '  padding: 14px 16px;',
    '  border: 1px solid #d7c899;',
    '  border-radius: 14px;',
    '  font-size: 1rem;',
    '  outline: none;',
    '}',
    '#input-busqueda:focus {',
    '  border-color: #ad9f50;',
    '  box-shadow: 0 0 0 3px rgba(173, 159, 80, 0.18);',
    '}',
    '#cerrar-buscador {',
    '  flex-shrink: 0;',
    '  width: 44px;',
    '  height: 44px;',
    '  border: none;',
    '  border-radius: 50%;',
    '  background: #ad9f50;',
    '  color: #ffffff;',
    '  cursor: pointer;',
    '  font-size: 1.1rem;',
    '}',
    '#resultados-busqueda {',
    '  list-style: none;',
    '  margin: 14px 0 0;',
    '  padding: 0;',
    '  max-height: min(60vh, 420px);',
    '  overflow-y: auto;',
    '}',
    '#resultados-busqueda li + li {',
    '  margin-top: 10px;',
    '}',
    '.resultado-link {',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 4px;',
    '  text-decoration: none;',
    '  color: #2f2b1f;',
    '  background: #ffffff;',
    '  border: 1px solid #efe6ca;',
    '  border-radius: 14px;',
    '  padding: 14px 16px;',
    '  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;',
    '}',
    '.resultado-link:hover, .resultado-link:focus {',
    '  transform: translateY(-2px);',
    '  border-color: #ad9f50;',
    '  box-shadow: 0 12px 24px rgba(173, 159, 80, 0.15);',
    '}',
    '.resultado-link strong {',
    '  font-size: 1rem;',
    '}',
    '.resultado-link span, .resultado-vacio {',
    '  font-size: 0.95rem;',
    '  line-height: 1.45;',
    '}',
    '.resultado-vacio {',
    '  padding: 16px;',
    '  border-radius: 14px;',
    '  background: #fff;',
    '  border: 1px dashed #d7c899;',
    '}',
    'body.search-open::before {',
    '  content: "";',
    '  position: fixed;',
    '  inset: 0;',
    '  background: rgba(35, 29, 16, 0.35);',
    '  z-index: 1100;',
    '}',
    '@media (max-width: 768px) {',
    '  .buscador-panel {',
    '    inset: 76px 12px auto;',
    '    width: calc(100vw - 24px);',
    '    padding: 14px;',
    '    border-radius: 18px;',
    '  }',
    '  .buscador-contenido {',
    '    gap: 10px;',
    '  }',
    '  #input-busqueda {',
    '    padding: 12px 14px;',
    '    font-size: 0.95rem;',
    '  }',
    '  #cerrar-buscador {',
    '    width: 40px;',
    '    height: 40px;',
    '  }',
    '}'
  ].join('');

  document.head.appendChild(style);
}

function setupUniversalUserManagement() {
  const trigger = document.getElementById('usuario');

  if (!trigger) {
    return;
  }

  const userUI = ensureUserManagementUI();
  const state = {
    account: readStorageObject('cuentaCliente'),
    session: readStorageObject('sesionActiva'),
    profile: readStorageObject('perfilCliente') || {}
  };

  injectUserManagementStyles();
  renderUserManagementView(userUI, state);

  trigger.addEventListener('click', function (event) {
    event.preventDefault();
    openUserPanel(trigger, userUI.panel);
  });

  userUI.closeButton.addEventListener('click', function () {
    closeUserPanel(trigger, userUI.panel);
  });

  document.addEventListener('click', function (event) {
    const clickedOutside = !userUI.panel.contains(event.target) && !trigger.contains(event.target);

    if (userUI.panel.classList.contains('is-open') && clickedOutside) {
      closeUserPanel(trigger, userUI.panel);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && userUI.panel.classList.contains('is-open')) {
      closeUserPanel(trigger, userUI.panel);
    }
  });

  userUI.registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = sanitizeInput(userUI.registerUser.value);
    const password = sanitizeInput(userUI.registerPassword.value);

    clearUserMessages(userUI);

    if (username.length < 3) {
      setPanelMessage(userUI.registerMessage, 'El usuario debe tener minimo 3 caracteres.', 'error');
      return;
    }

    if (password.length < 6) {
      setPanelMessage(userUI.registerMessage, 'La contrasena debe tener minimo 6 caracteres.', 'error');
      return;
    }

    state.account = { username: username, password: password };
    writeStorageObject('cuentaCliente', state.account);

    userUI.registerForm.reset();
    userUI.loginUser.value = username;
    setPanelMessage(userUI.registerMessage, 'Registro creado con exito. Ya puedes iniciar sesion.', 'success');
  });

  userUI.loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = sanitizeInput(userUI.loginUser.value);
    const password = sanitizeInput(userUI.loginPassword.value);

    clearUserMessages(userUI);

    if (!state.account) {
      setPanelMessage(userUI.loginMessage, 'Primero crea tu cuenta para poder ingresar.', 'error');
      return;
    }

    if (username !== state.account.username || password !== state.account.password) {
      setPanelMessage(userUI.loginMessage, 'Usuario o contrasena incorrectos.', 'error');
      return;
    }

    state.session = { username: state.account.username };
    writeStorageObject('sesionActiva', state.session);
    userUI.loginForm.reset();
    renderUserManagementView(userUI, state);
    setPanelMessage(userUI.loginMessage, 'Sesion iniciada correctamente.', 'success');
  });

  userUI.profileForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!state.session) {
      setPanelMessage(userUI.profileMessage, 'Inicia sesion para guardar tus datos.', 'error');
      return;
    }

    state.profile = {
      fullName: sanitizeInput(userUI.fullName.value),
      email: sanitizeInput(userUI.email.value),
      phone: sanitizeInput(userUI.phone.value),
      city: sanitizeInput(userUI.city.value),
      address: sanitizeInput(userUI.address.value)
    };

    writeStorageObject('perfilCliente', state.profile);
    setPanelMessage(userUI.profileMessage, 'Tus datos fueron guardados correctamente.', 'success');
    renderUserManagementView(userUI, state);
  });

}

function ensureUserManagementUI() {
  const existingPanel = document.getElementById('usuario-panel');

  if (existingPanel) {
    return getUserManagementElements(existingPanel);
  }

  const panel = document.createElement('section');
  panel.id = 'usuario-panel';
  panel.className = 'usuario-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Gestion de usuarios');
  panel.innerHTML = [
    '<button type="button" id="cerrar-usuario-panel" class="usuario-panel-cerrar" aria-label="Cerrar panel de usuario">X</button>',
    '<div class="usuario-panel-hero">',
    '  <p class="usuario-panel-eyebrow">Gestion de usuarios</p>',
    '  <h3>Tu cuenta Anny Cano</h3>',
    '  <p class="usuario-panel-copy">Inicia sesion, registra tu cuenta y guarda tus datos para futuros pedidos.</p>',
    '</div>',
    '<div class="usuario-panel-grid">',
    '  <form id="usuario-login-form" class="usuario-panel-card" novalidate>',
    '    <h4>Iniciar sesion</h4>',
    '    <input id="panel-login-usuario" type="text" placeholder="Usuario" autocomplete="username">',
    '    <input id="panel-login-password" type="password" placeholder="Contrasena" autocomplete="current-password">',
    '    <button type="submit">Ingresar</button>',
    '    <p id="panel-mensaje-login" class="panel-message" aria-live="polite"></p>',
    '  </form>',
    '  <form id="usuario-register-form" class="usuario-panel-card" novalidate>',
    '    <h4>Crear cuenta</h4>',
    '    <input id="panel-registro-usuario" type="text" placeholder="Nuevo usuario" autocomplete="username">',
    '    <input id="panel-registro-password" type="password" placeholder="Crea tu contrasena" autocomplete="new-password">',
    '    <button type="submit">Crear cuenta</button>',
    '    <p id="panel-mensaje-registro" class="panel-message" aria-live="polite"></p>',
    '  </form>',
    '</div>',
    '<div id="usuario-resumen" class="usuario-panel-card usuario-panel-resumen"></div>',
    '<form id="usuario-profile-form" class="usuario-panel-card usuario-profile-form" novalidate>',
    '  <h4>Formulario de captura de datos</h4>',
    '  <div class="usuario-profile-grid">',
    '    <input id="panel-perfil-nombre" type="text" placeholder="Nombre completo" autocomplete="name">',
    '    <input id="panel-perfil-email" type="email" placeholder="Correo electronico" autocomplete="email">',
    '    <input id="panel-perfil-telefono" type="tel" placeholder="Telefono" autocomplete="tel">',
    '    <input id="panel-perfil-ciudad" type="text" placeholder="Ciudad" autocomplete="address-level2">',
    '    <input id="panel-perfil-direccion" type="text" placeholder="Direccion" autocomplete="street-address">',
    '  </div>',
    '  <button type="submit">Guardar datos</button>',
    '  <p id="panel-mensaje-perfil" class="panel-message" aria-live="polite"></p>',
    '</form>'
  ].join('');

  document.body.appendChild(panel);
  return getUserManagementElements(panel);
}

function getUserManagementElements(panel) {
  return {
    panel: panel,
    closeButton: panel.querySelector('#cerrar-usuario-panel'),
    loginForm: panel.querySelector('#usuario-login-form'),
    registerForm: panel.querySelector('#usuario-register-form'),
    profileForm: panel.querySelector('#usuario-profile-form'),
    logoutButton: panel.querySelector('#usuario-panel-logout'),
    loginUser: panel.querySelector('#panel-login-usuario'),
    loginPassword: panel.querySelector('#panel-login-password'),
    registerUser: panel.querySelector('#panel-registro-usuario'),
    registerPassword: panel.querySelector('#panel-registro-password'),
    fullName: panel.querySelector('#panel-perfil-nombre'),
    email: panel.querySelector('#panel-perfil-email'),
    phone: panel.querySelector('#panel-perfil-telefono'),
    city: panel.querySelector('#panel-perfil-ciudad'),
    address: panel.querySelector('#panel-perfil-direccion'),
    loginMessage: panel.querySelector('#panel-mensaje-login'),
    registerMessage: panel.querySelector('#panel-mensaje-registro'),
    profileMessage: panel.querySelector('#panel-mensaje-perfil'),
    summary: panel.querySelector('#usuario-resumen')
  };
}

function renderUserManagementView(userUI, state) {
  const isLoggedIn = Boolean(state.session && state.session.username);
  const userLink = document.getElementById('usuario');

  userUI.summary.innerHTML = isLoggedIn
    ? [
      '<h4>Sesion activa</h4>',
      '<p><strong>Usuario:</strong> ' + escapeHtml(state.session.username) + '</p>',
      '<button type="button" id="usuario-panel-logout">Cerrar sesion</button>'
    ].join('')
    : [
      '<h4>Cuenta sin iniciar sesion</h4>',
      '<p>Registra tu usuario o inicia sesion para guardar tus datos y acelerar tu pedido.</p>'
    ].join('');

  userUI.logoutButton = userUI.summary.querySelector('#usuario-panel-logout');

  if (state.profile) {
    userUI.fullName.value = state.profile.fullName || '';
    userUI.email.value = state.profile.email || '';
    userUI.phone.value = state.profile.phone || '';
    userUI.city.value = state.profile.city || '';
    userUI.address.value = state.profile.address || '';
  }

  userUI.profileForm.querySelectorAll('input, button').forEach(function (field) {
    field.disabled = !isLoggedIn;
  });

  if (userLink) {
    userLink.classList.toggle('usuario-activo', isLoggedIn);
    userLink.setAttribute('aria-expanded', 'false');
    userLink.setAttribute('role', 'button');
    userLink.setAttribute('aria-haspopup', 'dialog');
  }

  if (userUI.logoutButton) {
    userUI.logoutButton.addEventListener('click', function () {
      removeStorageObject('sesionActiva');
      state.session = null;
      renderUserManagementView(userUI, state);
      clearUserMessages(userUI);
    });
  }
}

function openUserPanel(trigger, panel) {
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  trigger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('user-panel-open');
}

function closeUserPanel(trigger, panel) {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('user-panel-open');
}

function clearUserMessages(userUI) {
  setPanelMessage(userUI.loginMessage, '', '');
  setPanelMessage(userUI.registerMessage, '', '');
  setPanelMessage(userUI.profileMessage, '', '');
}

function setPanelMessage(target, text, type) {
  if (!target) {
    return;
  }

  target.textContent = text;
  target.className = 'panel-message';

  if (type) {
    target.classList.add('is-' + type);
  }
}

function sanitizeInput(value) {
  return value.trim();
}

function readStorageObject(key) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

function writeStorageObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageObject(key) {
  localStorage.removeItem(key);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function injectUserManagementStyles() {
  if (document.getElementById('user-management-runtime-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'user-management-runtime-styles';
  style.textContent = [
    '.usuario-panel { position: fixed; inset: 90px 16px auto; width: min(900px, calc(100vw - 32px)); margin: 0 auto; padding: 24px; border-radius: 24px; background: linear-gradient(180deg, #fffdf8 0%, #fff8eb 100%); border: 1px solid #e6dab7; box-shadow: 0 24px 60px rgba(47, 43, 31, 0.18); z-index: 1300; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: opacity .25s ease, transform .25s ease, visibility .25s ease; }',
    '.usuario-panel.is-open { opacity: 1; visibility: visible; transform: translateY(0); }',
    '.usuario-panel-cerrar { position: absolute; top: 16px; right: 16px; width: 42px; height: 42px; border: none; border-radius: 999px; background: #ad9f50; color: #fff; cursor: pointer; }',
    '.usuario-panel-hero h3 { margin: 6px 0 10px; font-size: 2rem; color: #2f2b1f; }',
    '.usuario-panel-eyebrow { margin: 0; font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; color: #8b7c3d; }',
    '.usuario-panel-copy { margin: 0 0 18px; line-height: 1.6; color: #5b5133; }',
    '.usuario-panel-grid, .usuario-profile-grid { display: grid; gap: 16px; }',
    '.usuario-panel-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
    '.usuario-profile-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-bottom: 14px; }',
    '.usuario-panel-card { padding: 18px; border: 1px solid #efe2bb; border-radius: 18px; background: rgba(255,255,255,.88); }',
    '.usuario-panel-card h4 { margin: 0 0 12px; color: #2f2b1f; }',
    '.usuario-panel-card input { width: 100%; margin-bottom: 10px; padding: 12px 14px; border: 1px solid #d8cca6; border-radius: 12px; outline: none; }',
    '.usuario-panel-card input:focus { border-color: #ad9f50; box-shadow: 0 0 0 3px rgba(173,159,80,.15); }',
    '.usuario-panel-card button { border: none; border-radius: 999px; background: #2f2b1f; color: #fff; padding: 12px 18px; cursor: pointer; }',
    '.usuario-panel-resumen { margin: 16px 0; }',
    '.panel-message { min-height: 22px; margin: 10px 0 0; font-size: .92rem; }',
    '.panel-message.is-success { color: #1d6b39; }',
    '.panel-message.is-error { color: #b13f3f; }',
    '#usuario.usuario-activo { color: #ad9f50; }',
    'body.user-panel-open::after { content: ""; position: fixed; inset: 0; background: rgba(35, 29, 16, 0.35); z-index: 1200; }',
    '@media (max-width: 768px) { .usuario-panel { inset: 74px 12px auto; width: calc(100vw - 24px); padding: 18px; border-radius: 20px; max-height: calc(100vh - 92px); overflow-y: auto; } .usuario-panel-grid, .usuario-profile-grid { grid-template-columns: 1fr; } .usuario-panel-hero h3 { font-size: 1.5rem; } }'
  ].join('');

  document.head.appendChild(style);
}
