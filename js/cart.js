// get cart from localStorage
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// target tbody (where <tr> will go)
const cartTableBody = document.querySelector("#cart-body");
cartTableBody.innerHTML = ""; // clear old rows

cartItems.forEach((item, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="product-thumbnail">
        <figure>
            <a href="product-simple.html">
                <img src="${item.image}" width="100" height="100" alt="${item.title}">
            </a>
        </figure>
    </td>
    <td class="product-name">
        <div class="product-name-section">
            <a href="product-simple.html">${item.title}</a>
        </div>
    </td>
    <td class="product-subtotal">
        <span class="amount">$${item.price}</span>
    </td>
    <td class="product-quantity">
        <div class="input-group">
            <input class="quantity form-control" type="number" value="${item.quantity}" name="quantity">
        </div>
    </td>
    <td class="product-price">
        <span class="amount">$${(item.price * item.quantity).toFixed(2)}</span>
    </td>
    <td class="product-close">
        <a href="#" class="product-remove" data-index="${index}" title="Remove this product">
            <span data-feather="x-circle"></span>
        </a>
    </td>
  `;
  cartTableBody.appendChild(row);
});

document.addEventListener("click", function(e) {
  if (e.target.closest(".product-remove")) {
    e.preventDefault();
    let index = e.target.closest(".product-remove").dataset.index;
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    location.reload(); // reload cart page
  }
});


let discount = 0;
function updateCartTotals() {
  let total = 0;

  document.querySelectorAll("#cart-body tr").forEach((row, index) => {
    let price = cartItems[index].price;
    let qty = cartItems[index].quantity;

    // update row subtotal
    let subtotal = price * qty;
    row.querySelector(".product-price .amount").textContent = "$" + subtotal.toFixed(2);

    total += subtotal;
  });
  
  let discountedTotal = total - (total * discount / 100);

  document.querySelector(".summary-subtotal .cart-total").textContent = "$" + discountedTotal.toFixed(2);
    document.querySelector(".total .summary-total-price").textContent = "$" + discountedTotal.toFixed(2);

    const cartSummary = {
    subtotal: total,
    discountPercent: discount,
    discountAmount: total * discount / 100,
    finalTotal: discountedTotal
  };

  localStorage.setItem("cartSummary", JSON.stringify(cartSummary));
}

 updateCartTotals();

 document.addEventListener("click", function(e) {
  if (e.target.closest(".remove-all")) {
    e.preventDefault();
    let index = e.target.closest(".remove-all").dataset.index;
    cartItems.splice(index);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    location.reload(); // reload cart page
  }
});

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



document.getElementById("applyCouponBtn").addEventListener("click", function() {
  const couponInput = document.getElementById("coupon_code").value.trim();

  // general validation
  if (couponInput === "") {
    showToast("Please enter a coupon code.", "#ff4d4d");
    return;
  }

  // Example: accept only one valid code "SAVE10"
  if (couponInput === "SAVE10") {
    discount = 10;
    showToast("Coupon applied successfully! You got 10% off.", "#4CAF50");
    updateCartTotals();
  } else if(couponInput === "SAVE20") {
    discount = 20;
    showToast("Coupon applied successfully! You got 20% off.", "#4CAF50");
    updateCartTotals();
  } else {
    discount = 0; // reset discount
    showToast("Invalid coupon code. Enter a valid coupon code", "#ff4d4d");
    updateCartTotals();
  }
});



