let allProducts = [];
let currentPage = 1;
let itemsPerPage = 12;

// Fetch all products and display
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    renderProducts();
    renderPagination();
  })
  .catch(err => console.error('Fetch error:', err));

function renderProducts() {
  const container = document.querySelector('.product-wrapper'); 
  container.innerHTML = '<div class="row"></div>';
  const row = container.querySelector('.row');

  // Pagination logic
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToShow = allProducts.slice(start, end);

  productsToShow.forEach(product => {
    const img1 = product.images?.[0] || "images/default.jpg";
    const img2 = product.images?.[1] || "images/default.jpg";

    row.innerHTML += `
      <div class="col-md-2 mb-4">
        <figure class="product-media">
          <a href="product-details.html?id=${product.id}">
            <img src="${img1}" alt="${product.name}" width="280" height="315" />
            <img src="${img2}" alt="${product.name}" width="280" height="315" />
          </a>
          <div class="product-label-group">
            ${product.off && product.off > 0 
              ? `<label class="product-label label-sale">${product.off}% Off</label>` 
              : ``}
          </div>
          <div class="product-action-vertical">
            <a href="#" class="btn-product-icon btn-wishlist" title="Add to wishlist">
              <i class="d-icon-heart"></i>
            </a>
          </div>
        </figure>
        <div class="product-details">
          <h3 class="product-name">
            <a href="product-details.html?id=${product.id}">${product.title}</a>
          </h3>
          <div class="product-price ls-md">
            <span class="price">$${product.price.toFixed(2)}</span>
          </div>
          <div class="ratings-container">
            <div class="ratings-full">
              <span class="ratings" style="width:${product.rating ? product.rating * 20 : 80}%"></span>
            </div>
            <a href="#" class="rating-reviews">( ${product.reviews || 4.5} reviews )</a>
          </div>
          <div class="product-action">
            <a href="product-details.html?id=${product.id}" class="btn-product btn-cart ls-l add-to-cart" title="View Details">
              <span>View Details</span>
            </a>
          </div>
        </div>
      </div>
    `;
  });
}




function renderPagination() {
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  let showPage = document.querySelector('.show-info');
showPage.textContent = `Showing ${itemsPerPage} of ${allProducts.length} Products`;
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a href="#" class="page-link" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Add click events
  document.querySelectorAll("#pagination .page-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = parseInt(this.dataset.page);
      renderProducts();
      renderPagination();
    });
  });
}

// Sorting
document.getElementById("product-sort").addEventListener("change", function() {
  if (this.value === "price-low") {
    allProducts.sort((a, b) => a.price - b.price);
  } else if (this.value === "price-high") {
    allProducts.sort((a, b) => b.price - a.price);
  }
  currentPage = 1; // reset
  renderProducts();
  renderPagination();
});

// Items per page (show filter)
document.getElementById("product-count").addEventListener("change", function() {
  itemsPerPage = parseInt(this.value);
  currentPage = 1;
  renderProducts();
  renderPagination();
});
