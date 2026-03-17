

// Menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const menuLinks = menu.querySelectorAll('a');

    // Toggle menu on hamburger click
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('active');
        }
    });
});




document.querySelectorAll(".logo").forEach(function(logo){
    logo.addEventListener("click", function(){
        window.location.href = "index.html";
    });
});


const slider = document.querySelector(".testimonios-slider");



document.querySelector(".next").onclick = () => {
slider.scrollLeft += 320;
}


document.querySelector(".prev").onclick = () => {
slider.scrollLeft -= 320;
}




