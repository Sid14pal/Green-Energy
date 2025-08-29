
// --- Utilities: wishlist state ---
function getWishlist() {
  try {
    const raw = localStorage.getItem("wishlist");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Wishlist parse failed. Resetting.", e);
    localStorage.removeItem("wishlist");
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(product) {
  // normalize id to string so comparisons always match
  const id = String(product.id);
  let wishlist = getWishlist();

  const exists = wishlist.some(item => String(item.id) === id);

  if (exists) {
    wishlist = wishlist.filter(item => String(item.id) !== id);
  } else {
    wishlist.push({ id, name: product.name, image: product.image, price: Number(product.price) || 0 });
  }

  saveWishlist(wishlist);
  updateWishlistUI();
}

function updateWishlistUI() {
  const wishlist = getWishlist();
  document.querySelectorAll(".btn-wishlist").forEach(btn => {
    const productId = String(btn.getAttribute("data-id"));
    if (wishlist.some(item => String(item.id) === productId)) {
      btn.classList.add("active");
      btn.setAttribute("title", "Remove from wishlist");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("title", "Add to wishlist");
    }
  });
}

// --- Render & data ---
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    displayByCategory(data, 'fruits');
    displayByCategory(data, 'vegetables');
    displayByCategory(data, 'drygoods');
    displayByCategory(data, 'sea_food');
    displayByCategory(data, 'milk_cream');
    // Add more if needed...

    // ensure hearts reflect saved state after *all* sections render
    updateWishlistUI();
  })
  .catch(err => console.error('Fetch error:', err));

function displayByCategory(products, category) {
  const container = document.getElementById(category);
  if (!container) {
    console.warn(`Container #${category} not found`);
    return;
  }

  let html = '<div class="row">';

  products.forEach(product => {
    if (product.category === category) {
      const img1 = product.images?.[0] || '';
      const img2 = product.images?.[1] || img1 || '';
      const priceNum = Number(product.price) || 0; // avoid toFixed crash if price is string/undefined

      html += `
        <div class="product text-left product-with-qty col-md-3">
          <figure class="product-media">
            <a href="product-details.html?id=${product.id}">
              <img src="${img1}" alt="${product.title || product.name || ''}" width="280" height="315" />
              <img src="${img2}" alt="${product.title || product.name || ''}" width="280" height="315" />
            </a>
            <div class="product-label-group">
              ${product.off && product.off > 0 ? `<label class="product-label label-sale">${product.off}% Off</label>` : ``}
            </div>
            <div class="product-action-vertical">
              <a href="#" 
                 class="btn-product-icon btn-wishlist" 
                 data-id="${product.id}" 
                 data-name="${product.title || product.name || ''}" 
                 data-price="${priceNum}"
                data-image="${img1}"  
                 title="Add to wishlist">
                <i class="d-icon-heart-full"></i>
              </a>
            </div>
          </figure>
          <div class="product-details">
            <h3 class="product-name">
              <a href="product-details.html?id=${product.id}">${product.title}</a>
            </h3>
            <div class="product-price ls-md">
              <span class="price">$${priceNum.toFixed(2)}</span>
            </div>
            <div class="ratings-container">
              <div class="ratings-full">
                <span class="ratings" style="width:${product.rating ? product.rating * 20 : 80}%"></span>
              </div>
              <a href="#" class="rating-reviews">( ${product.reviews || 4.5} reviews )</a>
            </div>
            <div class="product-action">
              <a href="product-details.html?id=${product.id}" class="btn-product btn-cartt ls-l add-to-cart" title="View Details">
                <span>View Details</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

// --- Event delegation for wishlist clicks ---
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-wishlist");
  if (!btn) return;

  e.preventDefault();

  const product = {
    id: btn.getAttribute("data-id"),
    name: btn.getAttribute("data-name"),
    image: btn.getAttribute("data-image"),
    price: parseFloat(btn.getAttribute("data-price"))
  };

  toggleWishlist(product);
});


// Function to get cart count


