console.log("El archivo gallery.js se ha cargado correctamente");

document.addEventListener("contentLoaded", function (event) {
    if (event.detail === "inicio.html") {
        console.log("Inicializando la galería en inicio.html");

        let slides = document.querySelectorAll(".slide");
        let video = document.getElementById("videoSlide");
        let interval; // Variable para almacenar el intervalo

        if (video) {
            console.log("El video se ha encontrado");
            video.onended = function () {
                console.log("El video ha terminado");
                nextSlide();
            };
        }

        function showSlide(index) {
            console.log("Mostrando slide:", index);
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add("active");
                    // Si el slide contiene un video, reinícialo y reprodúcelo
                    const slideVideo = slide.querySelector("video");
                    if (slideVideo) {
                        slideVideo.currentTime = 0; // Reinicia el video al inicio
                        slideVideo.play(); // Reproduce el video
                    }
                } else {
                    slide.classList.remove("active");
                    // Si el slide contiene un video, pausa el video
                    const slideVideo = slide.querySelector("video");
                    if (slideVideo) {
                        slideVideo.pause();
                    }
                }
            });
            currentIndex = index; // Actualiza el índice actual
            updatePagination(); // Actualiza la paginación
        }

        function nextSlide() {
            console.log("Avanzando al siguiente slide");
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
            resetInterval();
        }

        function prevSlide() {
            console.log("Retrocediendo al slide anterior");
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            showSlide(prevIndex);
            resetInterval();
        }

        // Función para reiniciar el intervalo automático
        function resetInterval() {
            clearInterval(interval); // Detiene el intervalo actual
            interval = setInterval(() => {
                // Solo avanza si el slide actual no contiene un video
                const currentSlide = slides[currentIndex];
                const currentVideo = currentSlide.querySelector("video");
                if (!currentVideo) {
                    nextSlide();
                }
            }, 5000); // Cambia de slide cada 5 segundos (5000 milisegundos)
        }

        // Función para crear la paginación
        function createPagination() {
            const pagination = document.createElement("div");
            pagination.classList.add("pagination");

            slides.forEach((slide, i) => {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                if (i === currentIndex) {
                    dot.classList.add("active");
                }
                dot.addEventListener("click", () => {
                    showSlide(i);
                    resetInterval();
                });
                pagination.appendChild(dot);
            });

            document.querySelector(".gallery-container").appendChild(pagination);
        }

        // Función para actualizar la paginación
        function updatePagination() {
            const dots = document.querySelectorAll(".dot");
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }

        let currentIndex = 0;
        showSlide(currentIndex);

        // Crea la paginación
        createPagination();

        // Inicia el intervalo automático
        resetInterval();

        const prevButton = document.querySelector(".prev");
        const nextButton = document.querySelector(".next");

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", () => {
                prevSlide();
                resetInterval(); // Reinicia el intervalo después de la navegación manual
            });
            nextButton.addEventListener("click", () => {
                nextSlide();
                resetInterval(); // Reinicia el intervalo después de la navegación manual
            });
        } else {
            console.error("Los botones .prev y .next no se encontraron en el DOM");
        }
    }
});