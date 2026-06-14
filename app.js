let carouselIndex = 0;
let carouselData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('conteudo.json')
        .then(response => response.json())
        .then(data => {
            inicializarDestaque(data.featured);
            renderizarLinhasConteudo(data.rows);
        })
        .catch(error => console.error('Error loading site data:', error));

    configurarModal();
});

function inicializarDestaque(featuredItems) {
    carouselData = featuredItems;
    updateHero();
    
    setInterval(nextHero, 7000); 

    const heroBtn = document.getElementById('hero-main-btn');
    heroBtn.addEventListener('click', () => {
        abrirMidia(carouselData[carouselIndex]);
    });
}

function updateHero() {
    const item = carouselData[carouselIndex];
    const heroSection = document.getElementById('hero-banner');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-description');
    const heroBtn = document.getElementById('hero-main-btn');
    
    // 1. Joga o conteúdo atual para a esquerda e some com o fundo
    heroContent.style.transform = 'translateX(-100px)';
    heroContent.style.opacity = 0;
    heroSection.style.opacity = 0.5;
    
    setTimeout(() => {
        // 2. Troca os dados (imagem, título, etc) invisivelmente
        heroSection.style.backgroundImage = `url('${item.image}')`;
        heroTitle.textContent = item.title;
        heroDesc.textContent = item.description;
        
        if(item.type === 'video') {
            heroBtn.innerHTML = '► Watch';
        } else {
            heroBtn.innerHTML = '📥 View Details';
        }
        
        // 3. Teletransporta o conteúdo invisível para a direita
        heroContent.style.transition = 'none'; 
        heroContent.style.transform = 'translateX(100px)';
        
        // 4. Espera um milissegundo e desliza tudo para o centro
        setTimeout(() => {
            heroContent.style.transition = 'all 0.5s ease-out';
            heroContent.style.transform = 'translateX(0)';
            heroContent.style.opacity = 1;
            heroSection.style.opacity = 1;
        }, 50);
        
    }, 400); // Tempo do fade out
}

function nextHero() {
    carouselIndex = (carouselIndex + 1) % carouselData.length;
    updateHero();
}

function renderizarLinhasConteudo(rows) {
    const contentRowsContainer = document.getElementById('content-rows');

    rows.forEach(row => {
        const rowElement = document.createElement('section');
        rowElement.className = 'content-row';

        const titleElement = document.createElement('h2');
        titleElement.textContent = row.title;
        rowElement.appendChild(titleElement);

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'cards-scroll';

        row.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <div class="card-img-container" style="background-image: url('${item.image}')"></div>
                <div class="card-info">
                    <div class="card-tag ${item.type === 'video' ? 'tag-video' : 'tag-download'}">
                        ${item.type === 'video' ? '📺 Video' : '💾 Download'}
                    </div>
                    <div class="card-title">${item.title}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                abrirMidia(item);
            });

            scrollContainer.appendChild(card);
        });

        rowElement.appendChild(scrollContainer);
        contentRowsContainer.appendChild(rowElement);
    });
}

const modal = document.getElementById('media-modal');
const modalBody = document.getElementById('modal-body');

function abrirMidia(item) {
    modalBody.innerHTML = ''; 

    if (item.type === 'video') {
        modalBody.innerHTML = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
        `;
    } else if (item.type === 'download') {
        modalBody.innerHTML = `
            <div class="download-modal-banner" style="background-image: url('${item.image}')">
                <div class="banner-gradient"></div>
            </div>
            
            <div class="download-modal-body">
                <h2>${item.title}</h2>
                <p>${item.description || 'No detailed description provided.'}</p>
                <a href="${item.downloadUrl}" target="_blank" class="btn btn-primary">
                    📥 Direct Download
                </a>
            </div>
        `;
    
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function configurarModal() {
    const closeBtn = document.getElementById('close-modal');
    closeBtn.addEventListener('click', fecharModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });
}

function fecharModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = ''; 
    document.body.style.overflow = 'auto'; 
}

// ==========================================================================
// EFEITO GLITTER MÁGICO DO MOUSE
// ==========================================================================
document.addEventListener('mousemove', function(e) {
    // Para não sobrecarregar o navegador, só cria partícula de vez em quando
    if (Math.random() > 0.6) return; 

    const glitter = document.createElement('div');
    glitter.className = 'glitter-particle';
    
    // Posiciona a partícula exatamente na ponta do cursor
    glitter.style.left = (e.pageX + 5) + 'px';
    glitter.style.top = (e.pageY + 15) + 'px';
    
    document.body.appendChild(glitter);

    // O CSS cuida da animação de cair e sumir. Aqui nós só deletamos o elemento
    // depois de 800ms para ele não acumular e travar o computador do usuário.
    setTimeout(() => {
        glitter.remove();
    }, 800);
});