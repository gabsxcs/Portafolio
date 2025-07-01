// Variables globales
let currentPage = 'home';

// Función para mostrar/ocultar páginas
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[onclick="showPage('${pageId}'); closeMenu();"]`) || 
                        document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentPage = pageId;
}

function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
}

document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const navLinks = document.getElementById('navLinks');
    
    if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

document.getElementById('navLinks').addEventListener('click', function(event) {
    event.stopPropagation();
});

document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
});
