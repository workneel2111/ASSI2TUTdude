// Initialize EmailJS
(function() {
    emailjs.init("ELjpmr9uO7K0mKXoD"); 
})();

const services = [
    { id: 1, name: "Wash & Fold", price: 15, icon: "fa-soap" },
    { id: 2, name: "Dry Cleaning", price: 25, icon: "fa-wind" },
    { id: 3, name: "Ironing Service", price: 10, icon: "fa-shirt" },
    { id: 4, name: "Steam Press", price: 12, icon: "fa-hot-tub-person" },
    { id: 5, name: "Curtain Cleaning", price: 40, icon: "fa-scroll" }
];

let cart = [];

function renderServices() {
    const list = document.getElementById('services-list');
    list.innerHTML = services.map(service => `
        <div class="service-item">
            <span>
                <i class="fas ${service.icon}"></i>
                ${service.name} - $${service.price}
            </span>
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

    let tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>SR No.</th>
                    <th>Service Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map((item, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${item.name}</td>
                        <td>$${item.price}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    cartContainer.innerHTML = tableHTML;

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