document.addEventListener('DOMContentLoaded', init);

function init() {
    const productosContainer = document.querySelector('.products-scroll .row');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');

    cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (productosContainer) {
        productosContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart')) {
                addToCart(event);
            }
        });
    }

    if (cartItemsContainer) {
        renderCart();
    }
    updateCartCount();
}

function addToCart(event) {
    const button = event.target;
    const productId = parseInt(button.getAttribute('data-id'));
    const product = productos.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({...product, quantity: 1});
        }
        saveCart();
        updateCartCount();
        
        Swal.fire({
            title: '¡Producto agregado!',
            text: `${product.name} ha sido agregado al carrito.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    window.dispatchEvent(new Event('cartUpdated'));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

const productos = [
    { id: 1, name: 'Botella Reutilizable', price: 19.99, image: 'producto1.png', description: 'Fabricada con acero inoxidable.' },
    { id: 2, name: 'Bolsa Ecológica', price: 14.99, image: 'producto2.png', description: 'Hecha de materiales reciclados.' },
    { id: 3, name: 'Cepillo de Bambú', price: 9.99, image: 'producto3.png', description: 'Biodegradable y eco-friendly.' },
    { id: 4, name: 'Percha Sostenible', price: 12.99, image: 'producto4.png', description: 'Hecha de materiales reciclados.' },
    { id: 5, name: 'Jabón Ecológico', price: 7.99, image: 'producto5.avif', description: 'Hecho con ingredientes naturales.' },
    { id: 6, name: 'Cubiertos de Bambú', price: 15.99, image: 'producto6.png', description: 'Set de cubiertos biodegradables.' },
    { id: 7, name: 'Vaso Sostenible x 10', price: 0.99, image: 'producto7.png', description: 'Pack de 10 vasos reutilizables.' }
];

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
         
            Swal.fire({
                title: '¡Mensaje Enviado!',
                text: 'Gracias por contactarnos. Te responderemos pronto.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            contactForm.reset();
        });
    }
});

AOS.init({
    duration: 1000,
    once: true
});

document.addEventListener('DOMContentLoaded', function() {
    const productModal = document.getElementById('productModal');
    productModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const imgSrc = button.getAttribute('data-img');
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        
        const modalTitle = this.querySelector('.modal-title');
        const modalImage = this.querySelector('#modalProductImage');
        const modalPrice = this.querySelector('#modalProductPrice');
        
        modalTitle.textContent = name;
        modalImage.src = imgSrc;
        modalImage.alt = name;
        modalPrice.textContent = price;
    });
});
