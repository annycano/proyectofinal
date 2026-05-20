document.addEventListener('DOMContentLoaded', function () {
  setupCartSystem();
});

function setupCartSystem() {
  injectCartBadgeStyles();
  bindAddToCartButtons();
  renderCartBadge();
  renderCartPage();

  window.addEventListener('storage', function (event) {
    if (event.key === 'carrito') {
      renderCartBadge();
      renderCartPage();
    }
  });
}

function bindAddToCartButtons() {
  const buttons = document.querySelectorAll('.btn-agregar');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const productCard = button.closest('[data-nombre][data-precio]');

      if (!productCard) {
        return;
      }

      const product = {
        nombre: productCard.dataset.nombre,
        precio: Number(productCard.dataset.precio)
      };

      addProductToCart(product);
    });
  });
}

function addProductToCart(product) {
  const cart = readCart();
  cart.push(product);
  writeCart(cart);
  renderCartBadge();
  renderCartPage();
}

function readCart() {
  const rawValue = localStorage.getItem('carrito');

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem('carrito', JSON.stringify(cart));
}

function renderCartBadge() {
  const cartLink = document.getElementById('carrito');

  if (!cartLink) {
    return;
  }

  const badge = ensureCartBadge(cartLink);
  const totalItems = readCart().length;

  badge.textContent = totalItems;
  badge.hidden = totalItems === 0;
  cartLink.setAttribute('aria-label', 'Carrito de compras con ' + totalItems + ' productos');
}

function ensureCartBadge(cartLink) {
  let badge = cartLink.querySelector('.cart-badge');

  if (badge) {
    return badge;
  }

  badge = document.createElement('span');
  badge.className = 'cart-badge';
  badge.hidden = true;
  cartLink.appendChild(badge);
  return badge;
}

function renderCartPage() {
  const list = document.getElementById('lista-carrito');
  const total = document.getElementById('total');

  if (!list || !total) {
    return;
  }

  const cart = readCart();
  list.innerHTML = '';

  if (!cart.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'carrito-vacio';
    emptyItem.textContent = 'Tu carrito esta vacio por ahora.';
    list.appendChild(emptyItem);
    total.textContent = '0';
    return;
  }

  let totalAmount = 0;

  cart.forEach(function (product, index) {
    const item = document.createElement('li');
    const removeButton = document.createElement('button');

    item.className = 'carrito-item';
    item.innerHTML = '<span>' + escapeCartText(product.nombre) + '</span><strong>$' + product.precio + '</strong>';

    removeButton.type = 'button';
    removeButton.className = 'carrito-eliminar';
    removeButton.textContent = 'Eliminar';
    removeButton.addEventListener('click', function () {
      removeCartItem(index);
    });

    item.appendChild(removeButton);
    list.appendChild(item);
    totalAmount += Number(product.precio) || 0;
  });

  total.textContent = totalAmount;
}

function removeCartItem(index) {
  const cart = readCart();
  cart.splice(index, 1);
  writeCart(cart);
  renderCartBadge();
  renderCartPage();
}

function injectCartBadgeStyles() {
  if (document.getElementById('cart-runtime-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'cart-runtime-styles';
  style.textContent = [
    '#carrito { position: relative; }',
    '.cart-badge { position: absolute; top: -15px; right: -10px; min-width: 10px; height: 18px; padding: 0 5px; border-radius: 999px; background: #b13f3f; color: #fff; font-size: .72rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(177,63,63,.25); }',
    '.carrito-item { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: center; padding: 12px 14px; margin-bottom: 10px; border: 1px solid #efe2bb; border-radius: 14px; background: #fff; }',
    '.carrito-item span { line-height: 1.45; }',
    '.carrito-eliminar { border: none; border-radius: 999px; padding: 8px 12px; background: #2f2b1f; color: #fff; cursor: pointer; }',
    '.carrito-vacio { padding: 14px; border-radius: 14px; background: #fff; border: 1px dashed #d8cca6; }',
    '@media (max-width: 640px) { .carrito-item { grid-template-columns: 1fr; } .carrito-eliminar { width: 100%; } }'
  ].join('');

  document.head.appendChild(style);
}

function escapeCartText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function comprarWhatsApp() {
  const cart = readCart();

  if (!cart.length) {
    window.alert('Tu carrito esta vacio.');
    return;
  }

  let totalAmount = 0;
  const lines = cart.map(function (product) {
    totalAmount += Number(product.precio) || 0;
    return '- ' + product.nombre + ' - $' + product.precio;
  });

  const message = encodeURIComponent('Hola, quiero comprar:\n' + lines.join('\n') + '\nTotal: $' + totalAmount);
  window.open('https://wa.me/573183880873?text=' + message, '_blank');
}

window.comprarWhatsApp = comprarWhatsApp;
window.addProductToCart = addProductToCart;
