var body = document.querySelector('body')
var menuTrigger = document.querySelector('#toggle-main-menu-mobile');
var menuContainer = document.querySelector('#main-menu-mobile');

menuTrigger.onclick = function() {
    menuContainer.classList.toggle('open');
    menuTrigger.classList.toggle('is-active')
    body.classList.toggle('lock-scroll')
}

var index = 0;
// var locations = ["SPINE Team", "SPINE Team", "SPINE Team"];

var slides = document.getElementsByClassName("slides");
var nextArrow = document.getElementById("next");
var previousArrow = document.getElementById("previous");
var place = document.getElementById("place");
var dotsContainer = document.getElementById("dotsContainer");
var dotArray = document.getElementsByClassName("dots");

createDots();
showSlides(index);

function createDots() {
    for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement("span");
        dot.className = "dots";
        dotsContainer.appendChild(dot);
    }
}

function showSlides(x) {
    if (x > slides.length - 1) {
        index = 0;
    }
    if (x < 0) {
        index = slides.length - 1;
    }
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dotArray[i].className = "dots";
    }

    slides[index].style.display = "block";
    dotArray[index].className += " activeDot";
    place.innerHTML = locations[index];
}

nextArrow.onclick = function () {
    index += 1;
    showSlides(index);
};

previousArrow.onclick = function () {
    index -= 1;
    showSlides(index);
};

function autoSlide() {
    index += 1;
    showSlides(index);
}

var slideInterval = setInterval(autoSlide, 4000);

// Pause the slideshow when mouse hovers over the slides
for (var i = 0; i < slides.length; i++) {
    slides[i].addEventListener("mouseenter", function () {
        clearInterval(slideInterval);
    });
    slides[i].addEventListener("mouseleave", function () {
        slideInterval = setInterval(autoSlide, 4000);
    });
}


//publications
document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-select');
    const searchBar = document.getElementById('search-bar');
    const publicationsList = document.getElementById('publications-list');
    const publications = Array.from(publicationsList.querySelectorAll('.publication'));
  
    const sortPublications = (criteria) => {
      let sorted;
      if (criteria === 'year-desc') {
        sorted = publications.sort((a, b) => b.dataset.year - a.dataset.year);
      } else if (criteria === 'year-asc') {
        sorted = publications.sort((a, b) => a.dataset.year - b.dataset.year);
      } else if (criteria === 'rank-asc') {
        sorted = publications.sort((a, b) => a.dataset.journalRank.localeCompare(b.dataset.journalRank));
      } else if (criteria === 'rank-desc') {
        sorted = publications.sort((a, b) => b.dataset.journalRank.localeCompare(a.dataset.journalRank));
      }
      sorted.forEach(pub => publicationsList.appendChild(pub));
    };
  
    const filterPublications = (query) => {
      const lowerQuery = query.toLowerCase();
      publications.forEach(pub => {
        const title = pub.dataset.title;
        const authors = pub.dataset.authors.toLowerCase();
        const journal = pub.dataset.journal;
        const matches = title.includes(lowerQuery) || authors.includes(lowerQuery) || journal.includes(lowerQuery);
        pub.style.display = matches ? '' : 'none';
      });
    };
  
    // Event Listeners
    sortSelect.addEventListener('change', (e) => sortPublications(e.target.value));
    searchBar.addEventListener('input', (e) => filterPublications(e.target.value));
  });