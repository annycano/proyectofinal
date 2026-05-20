document.addEventListener('DOMContentLoaded', function () {
  setupCustomOrderForms();
});

function setupCustomOrderForms() {
  const pageName = getCurrentPageName();
  const formConfig = getFormConfig(pageName);

  if (!formConfig) {
    return;
  }

  injectCustomOrderSection(formConfig);
}

function getCurrentPageName() {
  const path = window.location.pathname.split('/').pop();
  return path ? path.toLowerCase() : '';
}

function getFormConfig(pageName) {
  const customConfig = readCustomConfigFromBody();

  if (customConfig) {
    return customConfig;
  }

  const configs = {
    'eventos.html': {
      type: 'Evento',
      title: 'Planea tu evento con nosotros',
      description: 'Cuéntanos la fecha, la hora, el lugar y cómo sueñas tu celebración. Te enviaremos el pedido listo a WhatsApp.'
    },
    'detallespersonalizados.html': {
      type: 'Detalle personalizado',
      title: 'Diseña tu detalle personalizado',
      description: 'Comparte la idea, la fecha de entrega, el lugar y todos los detalles especiales para prepararte una propuesta.'
    },
    'detalles.html': {
      type: 'Detalle personalizado',
      title: 'Solicita tu detalle especial',
      description: 'Déjanos la fecha, la hora, el lugar y la descripción del pedido para ayudarte a crear algo único.'
    }
  };

  return configs[pageName] || null;
}

function readCustomConfigFromBody() {
  const body = document.body;

  if (!body) {
    return null;
  }

  const type = body.dataset.orderType;
  const title = body.dataset.orderTitle;
  const description = body.dataset.orderDescription;

  if (!type || !title || !description) {
    return null;
  }

  return {
    type: type,
    title: title,
    description: description
  };
}

function injectCustomOrderSection(config) {
  if (document.getElementById('pedido-personalizado')) {
    return;
  }

  const aside = document.querySelector('aside');
  const section = document.createElement('section');

  section.id = 'pedido-personalizado';
  section.className = 'pedido-personalizado';
  section.innerHTML = [
    '<div class="pedido-box">',
    '  <div class="pedido-copy">',
    '    <p class="pedido-eyebrow">Pedido personalizado</p>',
    '    <h3>' + config.title + '</h3>',
    '    <p>' + config.description + '</p>',
    '  </div>',
    '  <form class="pedido-form" id="pedido-formulario" novalidate>',
    '    <div class="pedido-grid">',
    '      <label class="pedido-field">',
    '        <span>Nombre</span>',
    '        <input type="text" id="pedido-nombre" placeholder="Tu nombre" autocomplete="name" required>',
    '      </label>',
    '      <label class="pedido-field">',
    '        <span>Telefono</span>',
    '        <input type="tel" id="pedido-telefono" placeholder="Tu numero" autocomplete="tel" required>',
    '      </label>',
    '      <label class="pedido-field">',
    '        <span>Fecha</span>',
    '        <input type="date" id="pedido-fecha" required>',
    '      </label>',
    '      <label class="pedido-field">',
    '        <span>Hora</span>',
    '        <input type="time" id="pedido-hora" required>',
    '      </label>',
    '      <label class="pedido-field pedido-field-full">',
    '        <span>Lugar</span>',
    '        <input type="text" id="pedido-lugar" placeholder="Direccion o lugar del evento" autocomplete="street-address" required>',
    '      </label>',
    '      <label class="pedido-field pedido-field-full">',
    '        <span>Descripcion de lo que deseas</span>',
    '        <textarea id="pedido-descripcion" rows="4" placeholder="Describe colores, tematica, cantidad, estilo o idea principal" required></textarea>',
    '      </label>',
    '    </div>',
    '    <div class="pedido-actions">',
    '      <button type="submit" class="pedido-submit">Enviar pedido a WhatsApp</button>',
    '      <p class="pedido-note" id="pedido-mensaje" aria-live="polite"></p>',
    '    </div>',
    '  </form>',
    '</div>'
  ].join('');

  if (aside && aside.parentNode) {
    aside.parentNode.insertBefore(section, aside);
  } else {
    document.body.appendChild(section);
  }

  bindCustomOrderForm(config.type);
}

function bindCustomOrderForm(orderType) {
  const form = document.getElementById('pedido-formulario');
  const message = document.getElementById('pedido-mensaje');

  if (!form || !message) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const payload = {
      nombre: readFieldValue('pedido-nombre'),
      telefono: readFieldValue('pedido-telefono'),
      fecha: readFieldValue('pedido-fecha'),
      hora: readFieldValue('pedido-hora'),
      lugar: readFieldValue('pedido-lugar'),
      descripcion: readFieldValue('pedido-descripcion')
    };

    if (!payload.nombre || !payload.telefono || !payload.fecha || !payload.hora || !payload.lugar || !payload.descripcion) {
      message.textContent = 'Completa todos los campos para enviar tu pedido.';
      message.className = 'pedido-note is-error';
      return;
    }

    const whatsappText = [
      'Hola, quiero solicitar un ' + orderType + '.',
      '',
      'Nombre: ' + payload.nombre,
      'Telefono: ' + payload.telefono,
      'Fecha: ' + payload.fecha,
      'Hora: ' + payload.hora,
      'Lugar: ' + payload.lugar,
      'Descripcion: ' + payload.descripcion
    ].join('\n');

    message.textContent = 'Abriendo WhatsApp con tu pedido...';
    message.className = 'pedido-note is-success';
    window.open('https://wa.me/573183880873?text=' + encodeURIComponent(whatsappText), '_blank');
  });
}

function readFieldValue(id) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : '';
}
