// Load cart items
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartTableBody = document.querySelector("#cart-body");
cartTableBody.innerHTML = "";

cartItems.forEach((item) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="product-name">
      ${item.title} <span class="product-quantity">×&nbsp;${item.quantity}</span>
    </td>
    <td class="product-total text-body">
      $${(item.price * item.quantity).toFixed(2)}
    </td>
  `;
  cartTableBody.appendChild(row);
});

// Load cart summary
const cartSummary = JSON.parse(localStorage.getItem("cartSummary"));

if (cartSummary) {
  document.querySelector("#checkout-subtotal").textContent = "$" + cartSummary.subtotal.toFixed(2);
  document.querySelector("#checkout-discount").textContent = "-$" + cartSummary.discountAmount.toFixed(2);
  document.querySelector("#checkout-total").textContent = "$" + cartSummary.finalTotal.toFixed(2);
}

function showToast(message, bgColor = "#333", type = '') {
  let toast = document.createElement('div');
  toast.style.backgroundColor = bgColor;
  toast.className = 'toast ' + type;
  toast.innerText = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500); // Remove after fade-out
  }, 3000);
}


document.querySelector(".form").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent form submit until validated

    let isValid = true;
    let errors = [];

    // Collect form fields
    const firstName = document.querySelector("[name='first-name']").value.trim();
    const lastName = document.querySelector("[name='last-name']").value.trim();
    const companyName = document.querySelector("[name='company-name']").value.trim();
    const country = document.querySelector("[name='country']").value;
    const address1 = document.querySelector("[name='address1']").value.trim();
    const address2 = document.querySelector("[name='address2']").value.trim();
    const city = document.querySelector("[name='city']").value.trim();
    const state = document.querySelector("[name='state']").value.trim();
    const zip = document.querySelector("[name='zip']").value.trim();
    const phone = document.querySelector("[name='phone']").value.trim();
    const email = document.querySelector("[name='email-address']").value.trim();
    const terms = document.querySelector("#terms-condition").checked;

    // Validation Rules
    if (!firstName) { isValid = false; errors.push("First Name is required."); }
    if (!lastName) { isValid = false; errors.push("Last Name is required."); }
    if (!country) { isValid = false; errors.push("Please select a Country."); }
    if (!address1) { isValid = false; errors.push("Street Address is required."); }
    if (!city) { isValid = false; errors.push("City is required."); }
    if (!state) { isValid = false; errors.push("State is required."); }
    if (!zip || !/^[0-9]{4,10}$/.test(zip)) { 
        isValid = false; 
        errors.push("Valid ZIP code is required."); 
    }
    if (!phone || !/^[0-9]{7,15}$/.test(phone)) { 
        isValid = false; 
        errors.push("Valid Phone Number is required."); 
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
        isValid = false; 
        errors.push("Valid Email Address is required."); 
    }
    if (!terms) { isValid = false; errors.push("You must agree to the Terms & Conditions."); }

    // Show errors
    let errorBox = document.querySelector("#form-errors");
    if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.id = "form-errors";
        errorBox.style.color = "red";
        errorBox.style.margin = "15px 0";
        document.querySelector(".form").prepend(errorBox);
    }

    if (!isValid) {
        errorBox.innerHTML = errors.map(err => `<p>⚠️ ${err}</p>`).join("");
        return;
    } else {
        errorBox.innerHTML = "";
        window.location.href="thankyou.html"
    }
});
