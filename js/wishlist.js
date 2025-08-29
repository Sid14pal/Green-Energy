// ✅ Helpers
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ✅ Render Wishlist
function renderWishlist() {
  const wishlist = getWishlist();
  const tbody = document.querySelector(".wishlist-items-wrapper");

  if (!tbody) return; // If wishlist table not found, stop

  if (wishlist.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:20px;">
          Your wishlist is empty.
        </td>
      </tr>`;
    return;
  }

  // Build rows
  tbody.innerHTML = wishlist.map(item => `
    <tr data-id="${item.id}">
      <td class="product-thumbnail">
        <a href="product-details.html?id=${item.id}">
          <figure>
            <img src="${item.image}" width="100" height="100" alt="${item.name}">
          </figure>
        </a>
      </td>
      <td class="product-name">
        <a href="product-details.html?id=${item.id}">${item.name}</a>
      </td>
      <td class="product-price">
        <span class="amount">$${Number(item.price).toFixed(2)}</span>
      </td>
      <td class="product-stock-status">
        <span class="wishlist-in-stock">In Stock</span>
      </td>
      <td class="product-add-to-cart">
        <a href="product-details.html?id=${item.id}" class="btn-product btn-primary">
          <span>Select Product</span>
        </a>
      </td>
      <td class="product-remove">
        <a href="#" class="remove" title="Remove this product">X</a>
      </td>
    </tr>
  `).join("");
}

// ✅ Handle remove click (event delegation)
document.addEventListener("click", function(e) {
  const removeBtn = e.target.closest(".remove");
  if (!removeBtn) return;

  e.preventDefault();

  const row = removeBtn.closest("tr");
  const productId = row.getAttribute("data-id");

  let wishlist = getWishlist();
  wishlist = wishlist.filter(item => String(item.id) !== String(productId));
  saveWishlist(wishlist);

  renderWishlist(); // Refresh wishlist UI
  if (typeof updateWishlistUI === "function") updateWishlistUI(); // Refresh hearts if available
});

// ✅ Render on page load
document.addEventListener("DOMContentLoaded", renderWishlist);
