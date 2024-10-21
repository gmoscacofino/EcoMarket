document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCount = document.getElementById('cart-count');
    const modalTotal = document.getElementById('modal-total');
    const confirmarPagoBtn = document.getElementById('confirmar-pago');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5" class="text-center">Tu carrito está vacío.</td></tr>';
            checkoutBtn.disabled = true;
            updateCartTotal(); // Añadir esta línea
            updateCartCount(); // Añadir esta línea
            return;
        }

        let tableHTML = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary adjust-quantity" type="button" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary adjust-quantity" type="button" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        cartItemsContainer.innerHTML = tableHTML;
        checkoutBtn.disabled = false;

        document.querySelectorAll('.adjust-quantity').forEach(button => {
            button.addEventListener('click', adjustQuantity);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });

        updateCartTotal();
        updateCartCount();
    }

    function removeFromCart(event) {
        const productId = parseInt(event.currentTarget.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
    }

    function adjustQuantity(event) {
        const productId = parseInt(event.currentTarget.getAttribute('data-id'));
        const action = event.currentTarget.getAttribute('data-action');
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease' && item.quantity > 1) {
                item.quantity--;
            }
            saveCart();
            renderCart();
        }
    }

    function updateCartTotal() {
        const total = cart.length > 0 ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
        cartTotalElement.textContent = total.toFixed(2);
        if (modalTotal) {
            modalTotal.textContent = total.toFixed(2);
        }
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showPaymentModal() {
        if (cart.length === 0) {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'No puedes proceder al pago con un carrito vacío.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const modalTotalElement = document.getElementById('modal-total');
        if (modalTotalElement) {
            modalTotalElement.textContent = total.toFixed(2);
        }
        const pagoModal = new bootstrap.Modal(document.getElementById('pagoModal'));
        pagoModal.show();
    }

    function validateCreditCardForm() {
        const form = document.getElementById('normal-card-form');
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCVC = document.getElementById('card-cvc');
        const cardName = document.getElementById('card-name');

        let isValid = true;

        // Validar número de tarjeta
        if (!/^(\d{4}\s){3}\d{4}$/.test(cardNumber.value)) {
            cardNumber.setCustomValidity('El número de tarjeta debe tener 16 dígitos en formato 1234 1234 1234 1234');
            isValid = false;
        } else {
            cardNumber.setCustomValidity('');
        }

        // Validar fecha de expiración
        const [month, year] = cardExpiry.value.split('/');
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry.value) || parseInt(month) > 12) {
            cardExpiry.setCustomValidity('Formato debe ser MM/AA y el mes no puede superar 12');
            isValid = false;
        } else {
            cardExpiry.setCustomValidity('');
        }

        // Validar CVC
        if (!/^[0-9]{3}$/.test(cardCVC.value)) {
            cardCVC.setCustomValidity('CVC debe ser exactamente 3 dígitos numéricos');
            isValid = false;
        } else {
            cardCVC.setCustomValidity('');
        }

        // Validar nombre
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cardName.value)) {
            cardName.setCustomValidity('El nombre debe contener solo letras y espacios');
            isValid = false;
        } else {
            cardName.setCustomValidity('');
        }

        form.classList.add('was-validated');
        return isValid;
    }

    function processPay() {
        if (validateCreditCardForm()) {
            Swal.fire({
                title: '¡Pago exitoso!',
                text: 'Tu pedido ha sido procesado.',
                icon: 'success',
                confirmButtonText: 'Volver a la página principal',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    cart = [];
                    saveCart();
                    renderCart();
                    const pagoModal = bootstrap.Modal.getInstance(document.getElementById('pagoModal'));
                    pagoModal.hide();
                    window.location.href = 'index.html'; // Redirige a la página principal
                }
            });
        }
    }

    checkoutBtn.addEventListener('click', showPaymentModal);
    confirmarPagoBtn.addEventListener('click', processPay);

    // Event listeners para el formato de la tarjeta de crédito
    document.getElementById('card-number').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
    });

    document.getElementById('card-expiry').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    document.getElementById('card-cvc').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    document.getElementById('card-name').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });

    renderCart();
});
