document.addEventListener('DOMContentLoaded', function () {
  setupCatalogCards();
});

function setupCatalogCards() {
  const products = document.querySelectorAll('.catalogo .producto');

  if (!products.length) {
    return;
  }

  products.forEach(function (product, index) {
    enhanceProductCard(product, index);
  });
}

function enhanceProductCard(product, index) {
  if (product.dataset.catalogReady === 'true') {
    return;
  }

  const image = product.querySelector('img');
  const button = product.querySelector('.btn-agregar');
  const title = product.querySelector('h6');

  if (!image || !button || !title) {
    return;
  }

  const galleryImages = getProductImages(product, image);
  const gallery = buildGallery(galleryImages, title.textContent.trim(), index);
  const orderFields = buildOrderFields(product, title.textContent.trim());

  image.replaceWith(gallery.wrapper);
  button.replaceWith(orderFields.wrapper);
  product.dataset.catalogReady = 'true';
}

function getProductImages(product, fallbackImage) {
  const htmlImages = Array.from(product.querySelectorAll('.producto-galeria-data img'))
    .map(function (image) {
      return image.getAttribute('src');
    })
    .filter(Boolean);

  if (htmlImages.length) {
    return htmlImages;
  }

  const configuredImages = (product.dataset.gallery || '')
    .split('|')
    .map(function (src) {
      return src.trim();
    })
    .filter(Boolean);

  if (configuredImages.length) {
    return configuredImages;
  }

  const pageImages = Array.from(document.querySelectorAll('.track img'))
    .map(function (image) {
      return image.getAttribute('src');
    })
    .filter(Boolean);

  const mergedImages = [fallbackImage.getAttribute('src')].concat(pageImages);
  return Array.from(new Set(mergedImages)).slice(0, 4);
}

function buildGallery(images, altText, index) {
  const wrapper = document.createElement('div');
  const stage = document.createElement('div');
  const mainImage = document.createElement('img');
  const dots = document.createElement('div');
  const thumbs = document.createElement('div');

  let activeIndex = 0;
  let autoplayId = null;

  wrapper.className = 'catalogo-galeria';
  stage.className = 'catalogo-stage';
  dots.className = 'catalogo-dots';
  thumbs.className = 'catalogo-thumbs';
  mainImage.className = 'catalogo-main-image';
  mainImage.alt = altText;
  stage.appendChild(mainImage);
  wrapper.appendChild(stage);
  wrapper.appendChild(dots);
  wrapper.appendChild(thumbs);

  const thumbButtons = images.map(function (src, thumbIndex) {
    const thumb = document.createElement('button');
    const thumbImage = document.createElement('img');

    thumb.type = 'button';
    thumb.className = 'catalogo-thumb';
    thumb.setAttribute('aria-label', 'Seleccionar imagen ' + (thumbIndex + 1));
    thumbImage.src = src;
    thumbImage.alt = altText + ' miniatura ' + (thumbIndex + 1);

    thumb.appendChild(thumbImage);
    thumbs.appendChild(thumb);

    thumb.addEventListener('click', function () {
      goToImage(thumbIndex);
      stopAutoplay();
    });

    return thumb;
  });

  const dotButtons = images.map(function (_, dotIndex) {
    const dot = document.createElement('button');

    dot.type = 'button';
    dot.className = 'catalogo-dot';
    dot.setAttribute('aria-label', 'Ver imagen ' + (dotIndex + 1));
    dot.addEventListener('click', function () {
      goToImage(dotIndex);
      stopAutoplay();
    });

    dots.appendChild(dot);
    return dot;
  });

  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);
  wrapper.addEventListener('focusin', stopAutoplay);
  wrapper.addEventListener('focusout', startAutoplay);

  goToImage(0);
  startAutoplay();

  function goToImage(targetIndex) {
    activeIndex = (targetIndex + images.length) % images.length;
    mainImage.src = images[activeIndex];
    mainImage.alt = altText + ' imagen ' + (activeIndex + 1);
    stage.style.setProperty('--catalog-scale', images.length > 1 ? '1.02' : '1');

    thumbButtons.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle('is-active', thumbIndex === activeIndex);
    });

    dotButtons.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  function startAutoplay() {
    if (images.length <= 1 || autoplayId) {
      return;
    }

    autoplayId = window.setInterval(function () {
      goToImage(activeIndex + 1);
    }, 3500 + index * 120);
  }

  function stopAutoplay() {
    if (!autoplayId) {
      return;
    }

    window.clearInterval(autoplayId);
    autoplayId = null;
  }

  return {
    wrapper: wrapper
  };
}

function buildOrderFields(product, title) {
  const wrapper = document.createElement('div');
  const quantityGroup = document.createElement('div');
  const quantityLabel = document.createElement('label');
  const quantityInput = document.createElement('input');
  const noteLabel = document.createElement('label');
  const noteInput = document.createElement('textarea');
  const addButton = document.createElement('button');

  wrapper.className = 'catalogo-actions';
  quantityGroup.className = 'catalogo-quantity';

  quantityLabel.className = 'catalogo-field-label';
  quantityLabel.textContent = 'Cantidad';
  quantityLabel.setAttribute('for', 'cantidad-' + normalizeId(title));

  quantityInput.id = 'cantidad-' + normalizeId(title);
  quantityInput.type = 'number';
  quantityInput.min = '1';
  quantityInput.max = '20';
  quantityInput.value = '1';
  quantityInput.className = 'catalogo-cantidad-input';

  noteLabel.className = 'catalogo-field-label';
  noteLabel.textContent = 'Escribe tu pedido';
  noteLabel.setAttribute('for', 'pedido-' + normalizeId(title));

  noteInput.id = 'pedido-' + normalizeId(title);
  noteInput.className = 'catalogo-pedido-input';
  noteInput.placeholder = 'Ejemplo: sin nueces, colores pastel, entrega en la tarde...';
  noteInput.rows = 3;

  addButton.type = 'button';
  addButton.className = 'btn-agregar catalogo-add-button';
  addButton.textContent = 'Agregar al carrito';

  quantityGroup.appendChild(quantityLabel);
  quantityGroup.appendChild(quantityInput);
  wrapper.appendChild(quantityGroup);
  wrapper.appendChild(noteLabel);
  wrapper.appendChild(noteInput);
  wrapper.appendChild(addButton);

  addButton.addEventListener('click', function () {
    const quantity = Math.max(1, Number(quantityInput.value) || 1);
    const note = noteInput.value.trim();
    const baseName = product.dataset.nombre || title;
    const price = Number(product.dataset.precio) || 0;
    const finalName = quantity > 1 ? baseName + ' x' + quantity : baseName;
    const finalNote = note ? ' | Pedido: ' + note : '';

    if (typeof window.addProductToCart === 'function') {
      window.addProductToCart({
        nombre: finalName + finalNote,
        precio: price * quantity
      });
    }

    addButton.textContent = 'Agregado';
    window.setTimeout(function () {
      addButton.textContent = 'Agregar al carrito';
    }, 1400);
  });

  return {
    wrapper: wrapper
  };
}

function normalizeId(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
