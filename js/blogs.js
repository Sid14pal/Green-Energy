let allBlogs = [];
let currentPage = 1;
const blogsPerPage = 4; // show 4 blogs per page

// Fetch blogs and display them
fetch('blogs.json')
  .then(res => res.json())
  .then(data => {
    allBlogs = data;
    renderBlogs();
    renderPagination();
  })
  .catch(err => console.error('Blog fetch error:', err));

function renderBlogs() {
  const container = document.querySelector('.posts.grid.row');
  container.innerHTML = "";

  const start = (currentPage - 1) * blogsPerPage;
  const end = start + blogsPerPage;
  const blogsToShow = allBlogs.slice(start, end);

  let html = "";
  blogsToShow.forEach(blog => {
    html += `
            <div class="grid-item col-sm-6">
        <article class="post post-grid">
          <figure class="post-media overlay-zoom">
            <a href="post-single.html?id=${blog.id}">
              <img src="${blog.image}" width="580" height="300" alt="${blog.name}" />
            </a>
          </figure>
          <div class="post-details">
            <div class="post-meta">
              on <a href="#" class="post-date">${blog.date}</a>
            </div>
            <h4 class="post-title">
              <a href="post-single.html?id=${blog.id}">${blog.name}</a>
            </h4>
            <p class="post-content">${blog.description.paragraph1}</p>
            <a href="post-single.html?id=${blog.id}" class="btn btn-link btn-underline btn-primary">
              Read more <i class="d-icon-arrow-right"></i>
            </a>
          </div>
        </article>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);

  // Prev Button
  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link page-link-prev" href="#" onclick="changePage(${currentPage - 1})">
        <i class="d-icon-arrow-left"></i> Prev
      </a>
    </li>
  `;

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }

  // Next Button
  pagination.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link page-link-next" href="#" onclick="changePage(${currentPage + 1})">
        Next <i class="d-icon-arrow-right"></i>
      </a>
    </li>
  `;
}

function changePage(page) {
  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderBlogs();
  renderPagination();
}
