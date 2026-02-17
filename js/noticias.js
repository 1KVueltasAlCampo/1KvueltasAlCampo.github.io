console.log("Cargado script: noticias.js");

// Variables globales del módulo
let todasLasNoticias = []; // Aquí guardamos el "todo" (Backend)
let noticiasMostradas = 0; // Contador de cuántas hemos pintado
const NOTICIAS_POR_PAGINA = 6; // Configuración: Cuántas mostrar por lote

document.addEventListener("pageLoaded", function (event) {
    if (event.detail === "noticias") {
        console.log("Inicializando módulo de noticias...");
        initNoticias();
    }
});

async function initNoticias() {
    // 1. Referencias al DOM
    const loadingState = document.getElementById("noticias-loading");
    const emptyState = document.getElementById("noticias-empty");
    const listState = document.getElementById("noticias-list-view");
    const detailState = document.getElementById("noticias-detail-view");
    const container = document.getElementById("noticias-container");
    const btnBack = document.getElementById("btn-back-news");
    
    // Referencias Paginación
    const paginationContainer = document.getElementById("pagination-container");
    const btnLoadMore = document.getElementById("btn-load-more");

    // Reset visual inicial
    loadingState.classList.remove("d-none");
    emptyState.classList.add("d-none");
    listState.classList.add("d-none");
    detailState.classList.add("d-none");
    paginationContainer.classList.add("d-none");
    
    // Resetear variables lógicas
    container.innerHTML = ""; 
    noticiasMostradas = 0;
    todasLasNoticias = [];

    // 2. Configurar botón de volver
    if (btnBack) {
        const newBtn = btnBack.cloneNode(true);
        btnBack.parentNode.replaceChild(newBtn, btnBack);
        newBtn.addEventListener("click", () => showListView());
    }

    // Configurar botón "Cargar más"
    if (btnLoadMore) {
        const newLoadBtn = btnLoadMore.cloneNode(true);
        btnLoadMore.parentNode.replaceChild(newLoadBtn, btnLoadMore);
        newLoadBtn.addEventListener("click", () => renderNextBatch());
    }

    try {
        // 3. Fetch de datos
        // NOTA: Pedimos TODAS, pero es barato porque es solo texto.
        //const response = await fetch('http://localhost:3000/noticias');
        const response = await fetch('https://1-kvueltas-al-campo-github-io-u1xs.vercel.app/noticias');
        
        if (!response.ok) throw new Error("Error en la red");
        
        const noticias = await response.json();
        todasLasNoticias = noticias; // Guardamos en memoria

        // 4. Lógica de Estados
        loadingState.classList.add("d-none");

        if (!noticias || noticias.length === 0) {
            emptyState.classList.remove("d-none");
        } else {
            listState.classList.remove("d-none");
            // Renderizar el primer lote
            renderNextBatch();
        }

    } catch (error) {
        console.error("Error cargando noticias:", error);
        loadingState.classList.add("d-none");
        container.innerHTML = `<div class="alert alert-warning text-center w-100">No se pudieron cargar las noticias en este momento.</div>`;
        listState.classList.remove("d-none");
    }

    // --- LÓGICA DE PAGINACIÓN ---
    
    function renderNextBatch() {
        // Calcular el siguiente corte
        const siguienteLote = todasLasNoticias.slice(noticiasMostradas, noticiasMostradas + NOTICIAS_POR_PAGINA);
        
        // Renderizar este lote (Append, no replace)
        appendNoticias(siguienteLote);
        
        // Actualizar contador
        noticiasMostradas += siguienteLote.length;

        // Decidir si mostramos el botón "Cargar más"
        const btnContainer = document.getElementById("pagination-container");
        if (noticiasMostradas < todasLasNoticias.length) {
            btnContainer.classList.remove("d-none");
        } else {
            btnContainer.classList.add("d-none"); // Ya no hay más
        }
    }

    // --- FUNCIONES INTERNAS ---

    function showListView() {
        detailState.classList.add("d-none");
        listState.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showDetailView(noticia) {
        document.getElementById("detail-title").textContent = noticia.TITULO || "Sin título";
        document.getElementById("detail-date").textContent = noticia.FECHA || "";
        
        const imgEl = document.getElementById("detail-image");
        imgEl.src = noticia.IMAGEN ? noticia.IMAGEN : "img/placeholder_news.jpg"; 
        imgEl.onerror = function() { this.src = "img/placeholder_news.jpg"; };

        document.getElementById("detail-content").textContent = noticia.CONTENIDO || "";

        listState.classList.add("d-none");
        detailState.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function appendNoticias(lista) {
        lista.forEach(noticia => {
            const cardHTML = document.createElement("article");
            cardHTML.className = "news-card";
            
            // Animación de entrada suave para los nuevos elementos
            cardHTML.style.animation = "fadeIn 0.5s ease forwards";
            
            const imgSrc = noticia.IMAGEN ? noticia.IMAGEN : "img/placeholder_news.jpg";

            cardHTML.innerHTML = `
                <div class="news-image">
                    <img src="${imgSrc}" alt="${noticia.TITULO}" loading="lazy" onerror="this.src='img/placeholder_news.jpg'">
                </div>
                <div class="news-content">
                    <span class="news-date">${noticia.FECHA || ""}</span>
                    <h3>${noticia.TITULO || "Noticia sin título"}</h3>
                    <p>${noticia.RESUMEN || ""}</p>
                    <button class="btn-leer-mas">Leer más <i class="bi bi-arrow-right-short"></i></button>
                </div>
            `;

            const btn = cardHTML.querySelector(".btn-leer-mas");
            btn.addEventListener("click", () => showDetailView(noticia));

            container.appendChild(cardHTML);
        });
    }
}