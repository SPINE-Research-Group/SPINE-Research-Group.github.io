var body = document.querySelector('body')
var menuTrigger = document.querySelector('#toggle-main-menu-mobile');
var menuContainer = document.querySelector('#main-menu-mobile');

menuTrigger.onclick = function() {
    menuContainer.classList.toggle('open');
    menuTrigger.classList.toggle('is-active')
    body.classList.toggle('lock-scroll')
}

var index = 0;
var locations = ["SPINE Team", "SPINE Team", "SPINE Team"];

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
