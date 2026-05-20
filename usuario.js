document.addEventListener('DOMContentLoaded', function () {
  setupUserAccount();
});

function setupUserAccount() {
  const elements = {
    registerButton: document.getElementById('btn-registro'),
    loginButton: document.getElementById('btn-login'),
    logoutButton: document.getElementById('cerrar-sesion'),
    loginUser: document.getElementById('login-usuario'),
    loginPassword: document.getElementById('login-password'),
    registerUser: document.getElementById('registro-usuario'),
    registerPassword: document.getElementById('registro-password'),
    loginMessage: document.getElementById('mensaje-login'),
    registerMessage: document.getElementById('mensaje-registro'),
    loggedPanel: document.getElementById('usuario-logeado'),
    loggedName: document.getElementById('nombre-usuario'),
    loginBox: document.querySelector('.login-box'),
    registerBox: document.querySelector('.registro-box')
  };

  if (!elements.registerButton || !elements.loginButton) {
    syncUserIcon();
    return;
  }

  elements.registerButton.addEventListener('click', function () {
    handleRegister(elements);
  });

  elements.loginButton.addEventListener('click', function () {
    handleLogin(elements);
  });

  elements.logoutButton?.addEventListener('click', function () {
    localStorage.removeItem('sesionActiva');
    renderLoggedUser(elements, null);
    clearMessages(elements);
  });

  [elements.loginUser, elements.loginPassword].forEach(function (field) {
    field?.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleLogin(elements);
      }
    });
  });

  [elements.registerUser, elements.registerPassword].forEach(function (field) {
    field?.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleRegister(elements);
      }
    });
  });

  const activeSession = readStoredUser('sesionActiva');
  renderLoggedUser(elements, activeSession);
}

function handleRegister(elements) {
  const username = sanitizeValue(elements.registerUser.value);
  const password = sanitizeValue(elements.registerPassword.value);

  clearMessages(elements);

  if (username.length < 3) {
    setMessage(elements.registerMessage, 'El usuario debe tener minimo 3 caracteres.', 'error');
    return;
  }

  if (password.length < 6) {
    setMessage(elements.registerMessage, 'La contrasena debe tener minimo 6 caracteres.', 'error');
    return;
  }

  const account = {
    username: username,
    password: password
  };

  localStorage.setItem('cuentaCliente', JSON.stringify(account));
  setMessage(elements.registerMessage, 'Cuenta creada con exito. Ahora ya puedes iniciar sesion.', 'success');
  elements.registerPassword.value = '';
  elements.loginUser.value = username;
  elements.loginPassword.focus();
}

function handleLogin(elements) {
  const username = sanitizeValue(elements.loginUser.value);
  const password = sanitizeValue(elements.loginPassword.value);
  const account = readStoredUser('cuentaCliente');

  clearMessages(elements);

  if (!account) {
    setMessage(elements.loginMessage, 'Primero crea tu cuenta para poder ingresar.', 'error');
    return;
  }

  if (username !== account.username || password !== account.password) {
    setMessage(elements.loginMessage, 'Usuario o contrasena incorrectos.', 'error');
    return;
  }

  localStorage.setItem('sesionActiva', JSON.stringify({ username: account.username }));
  renderLoggedUser(elements, { username: account.username });
  setMessage(elements.loginMessage, 'Ingreso correcto. Bienvenida de nuevo.', 'success');
  elements.loginPassword.value = '';
}

function renderLoggedUser(elements, session) {
  const isLoggedIn = Boolean(session && session.username);

  if (elements.loggedPanel) {
    elements.loggedPanel.style.display = isLoggedIn ? 'block' : 'none';
  }

  if (elements.loggedName) {
    elements.loggedName.textContent = isLoggedIn ? session.username : '';
  }

  if (elements.loginBox) {
    elements.loginBox.style.display = isLoggedIn ? 'none' : 'block';
  }

  if (elements.registerBox) {
    elements.registerBox.style.display = isLoggedIn ? 'none' : 'block';
  }

  syncUserIcon(isLoggedIn);
}

function syncUserIcon(isLoggedIn) {
  const userLink = document.getElementById('usuario');

  if (!userLink) {
    return;
  }

  if (isLoggedIn) {
    userLink.classList.add('usuario-activo');
    userLink.setAttribute('title', 'Tu sesion esta activa');
    return;
  }

  userLink.classList.remove('usuario-activo');
  userLink.setAttribute('title', 'Iniciar sesion o registrarse');
}

function clearMessages(elements) {
  setMessage(elements.loginMessage, '', '');
  setMessage(elements.registerMessage, '', '');
}

function setMessage(target, text, type) {
  if (!target) {
    return;
  }

  target.textContent = text;
  target.className = 'form-message';

  if (type) {
    target.classList.add('is-' + type);
  }
}

function sanitizeValue(value) {
  return value.trim();
}

function readStoredUser(key) {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
