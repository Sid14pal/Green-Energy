const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.length;
  document.getElementById("cart-count").textContent = count;
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

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    const product = data.find(p => p.id === productId);

    if (product) {
        // Populate Main Carousel
      const mainCarousel = document.getElementById('main-carousel');
      mainCarousel.innerHTML = product.images.map(img =>
        `<figure class="product-image">
            <img src="${img}" alt="${product.title}" width="800" height="900">
         </figure>`
      ).join('');
      $('#main-carousel').owlCarousel('destroy');
$('#main-carousel').owlCarousel({
  items: 1,
  loop: true,
  nav: true,
  dots: true,
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: true
});
      document.querySelectorAll('.product-name').forEach(el => {
        el.textContent = product.title;
      });

      document.querySelectorAll('.new-price').forEach(el => {
        el.textContent = `$${product.price}`;
      });

      document.querySelectorAll('.old-price').forEach(el => {
        el.textContent = `$${product.price * 2}`;
      });

      document.querySelectorAll('.category').forEach(el => {
        el.textContent = product.category;
      });

       document.querySelectorAll('.features').forEach(el => {
        el.textContent = product.description.features[0];
      });

      
       document.querySelectorAll('.description-image').forEach(el => {
        el.innerHTML = `<img src="${product.description.features[1]}" width="559" height="200" alt="Product" class="description-image">`;
      });

      const specsContainer = document.querySelector(".specifications");
      specsContainer.innerHTML = ""; // clear old content

      Object.entries(product.description.specifications).forEach(([key, value]) => {
        const specItem = document.createElement("p");
        specItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        specsContainer.appendChild(specItem);
      });

      // Show correct description section
      document.querySelectorAll("[id^='descriptions']").forEach(div => {
        div.style.display = "none";
      });

      const targetDiv = document.getElementById(`descriptions${productId}`);
      if (targetDiv) {
        targetDiv.style.display = "flex";
      }

      // ADD TO CART FUNCTIONALITY
      document.getElementById('addToCartBtn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if product already exists in cart
        const alreadyInCart = cart.some(item => item.id === product.id);

        if (alreadyInCart) {
          showToast("This product is already in your cart!", "#ff4d4d");
          return; // Stop here, don’t add again
        } else {
            showToast("Product added to cart!", "#4CAF50");
            window.location.reload();
        }

        // Add new product to cart
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          quantity: quantity
        });

        localStorage.setItem('cart', JSON.stringify(cart));

        // Update count instantly
        updateCartCount();
      });

    } else {
      document.body.innerHTML = '<p>Product not found.</p>';
    }
  });

updateCartCount();


const form = document.getElementById('reviewForm');
  const submitBtn = document.getElementById('submitBtn');
  const reviewsList = document.getElementById('reviewsList');

  // Load reviews from localStorage on page load
  document.addEventListener('DOMContentLoaded', loadReviews);

  submitBtn.addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById('comment').value;

    if (!name || !rating || !comment) {
      alert("Please fill in all fields and select a rating");
      return;
    }

    const review = { name, rating, comment };

    // Save to localStorage
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Add to UI
    addReviewToList(review);

    // Reset form
    form.reset();
  });


  