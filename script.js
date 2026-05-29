(function() {
    // Initializing the email service
    emailjs.init("ELjpmr9uO7K0mKXoD");
})();

// Data for our laundry services
const myServices = [
    { serviceId: 101, title: "Wash & Fold", cost: 15, iconClass: "fa-soap" },
    { serviceId: 102, title: "Dry Cleaning", cost: 25, iconClass: "fa-wind" },
    { serviceId: 103, title: "Ironing", cost: 10, iconClass: "fa-shirt" },
    { serviceId: 104, title: "Steam Press", cost: 12, iconClass: "fa-hot-tub-person" },
    { serviceId: 105, title: "Curtain Care", cost: 40, iconClass: "fa-scroll" }
];

let userSelection = [];

// Displaying services on the page
function displayServices() {
    const serviceBox = document.getElementById('services-list');
    let htmlContent = "";

    for (let i = 0; i < myServices.length; i++) {
        let s = myServices[i];
        htmlContent += `
        <div class="service-item">
            <div class="service-info">
                <i class="fas ${s.iconClass}"></i>
                <p>${s.title} - $${s.cost}</p>
            </div>
            <div class="service-controls">
                <button class="add-btn" onclick="addItem(${s.serviceId})">Add</button>
                <button class="remove-btn" onclick="removeItem(${s.serviceId})">Remove</button>
            </div>
        </div>`;
    }
    serviceBox.innerHTML = htmlContent;
}

// Adding a service to the selection
function addItem(id) {
    for (let i = 0; i < myServices.length; i++) {
        if (myServices[i].serviceId === id) {
            userSelection.push(myServices[i]);
            break;
        }
    }
    refreshCart();
}

// Removing the last added instance of a service
function removeItem(id) {
    let foundIndex = -1;
    for (let i = 0; i < userSelection.length; i++) {
        if (userSelection[i].serviceId === id) {
            foundIndex = i;
        }
    }

    if (foundIndex !== -1) {
        userSelection.splice(foundIndex, 1);
    }
    refreshCart();
}

function refreshCart() {
    const cartDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');

    if (userSelection.length === 0) {
        cartDiv.innerHTML = '<p>Your cart is empty.</p>';
        totalSpan.innerText = '0';
        return;
    }

    let table = '<table class="cart-table"><tr><th>#</th><th>Service</th><th>Price</th></tr>';
    let grandTotal = 0;

    for (let j = 0; j < userSelection.length; j++) {
        table += `<tr>
            <td>${j + 1}</td>
            <td>${userSelection[j].title}</td>
            <td>$${userSelection[j].cost}</td>
        </tr>`;
        grandTotal += userSelection[j].cost;
    }
    table += '</table>';

    cartDiv.innerHTML = table;
    totalSpan.innerText = grandTotal;
}

window.onload = function() {
    displayServices();

    document.getElementById('hero-book-btn').onclick = function() {
        document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
    };

    document.getElementById('booking-form').onsubmit = function(e) {
        e.preventDefault();

        if (userSelection.length === 0) {
            alert("Please pick at least one service!");
            return;
        }

        const serviceNames = userSelection.map(item => item.title).join(", ");
        
        const templateParams = {
            user_name: document.getElementById('full-name').value,
            user_email: document.getElementById('email').value,
            user_phone: document.getElementById('phone').value,
            services: serviceNames,
            total_price: document.getElementById('total-price').innerText
        };

        emailjs.send('service_kkij86b', 'template_08occso', templateParams)
            .then(() => {
                const msg = document.getElementById('booking-message');
                msg.style.display = 'block';
                userSelection = [];
                refreshCart();
                document.getElementById('booking-form').reset();
                setTimeout(() => {
                    msg.style.display = 'none';
                }, 4000);
            }, function(err) {
                alert("Oops! Something went wrong.");
                console.log("Error details:", err);
            });
    };
};