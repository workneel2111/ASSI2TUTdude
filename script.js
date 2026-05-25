// Initialize EmailJS
(function() {
    emailjs.init("ELjpmr9uO7K0mKXoD"); 
})();

const services = [
    { id: 1, name: "Wash & Fold", price: 15 },
    { id: 2, name: "Dry Cleaning", price: 25 },
    { id: 3, name: "Ironing Service", price: 10 },
    { id: 4, name: "Steam Press", price: 12 },
    { id: 5, name: "Curtain Cleaning", price: 40 }
];

let cart = [];

function renderServices() {
    const list = document.getElementById('services-list');
    list.innerHTML = services.map(service => `
        <div class="service-item">
            <span>${service.name} - $${service.price}</span>
            <div class="service-controls">
                <button class="add-btn" onclick="addToCart(${service.id})">Add Items</button>
                <button class="remove-btn" onclick="removeFromCart(${service.id})">Remove Now</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = services.find(s => s.id === id);
    cart.push(item);
    updateCartUI();
}

function removeFromCart(id) {
    const index = cart.findLastIndex(s => s.id === id);
    if (index > -1) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>No added items.</p>';
        totalEl.innerText = '0';
        return;
    }

    cartContainer.innerHTML = cart.map((item, idx) => `
        <div class="cart-line">${item.name} - $${item.price}</div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = total;
}

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert("Please add at least one service to your cart.");
        return;
    }

    const formData = {
        user_name: document.getElementById('full-name').value,
        user_email: document.getElementById('email').value,
        user_phone: document.getElementById('phone').value,
        services: cart.map(i => i.name).join(', '),
        total_price: document.getElementById('total-price').innerText
    };

    // Double-check these IDs in your EmailJS dashboard: https://dashboard.emailjs.com/
    emailjs.send('service_kkij86b', 'template_08occso', formData)
        .then(() => {
            document.getElementById('booking-message').style.display = 'block';
            cart = [];
            updateCartUI();
            e.target.reset();
        }, (error) => {
            console.error('EmailJS Error Object:', error);
            alert(`Failed to send booking request: ${error.text || 'Unknown Error'}. Please check if the Template ID "template_08occso" is correct in your EmailJS dashboard.`);
        });
});

renderServices();