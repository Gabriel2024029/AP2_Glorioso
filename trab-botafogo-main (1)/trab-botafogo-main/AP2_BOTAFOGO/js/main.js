import { hex_sha256 } from '../libs/sha256-min.mjs';

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const contentContainer = document.getElementById('content-container');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const filterInput = document.getElementById('filter-input');
    const allButton = document.getElementById('all-button');
    const masculinoButton = document.getElementById('masculino-button');
    const femininoButton = document.getElementById('feminino-button');
    const elencoSelect = document.getElementById('elenco-select');
    const atletasList = document.getElementById('atletas-list');

    const correctPassword = 'ALVINEGRO';
    const correctPasswordHashed = hex_sha256(correctPassword);

    loginButton.addEventListener('click', () => {
        const password = passwordInput.value;
        if (hex_sha256(password) === correctPasswordHashed) {
            loginContainer.style.display = 'none';
            contentContainer.style.display = 'block';
            loadAtletas('all');
            localStorage.setItem('logged_in', true);
        } else {
            errorMessage.style.display = 'block';
        }
    });

    logoutButton.addEventListener('click', () => {
        loginContainer.style.display = 'block';
        contentContainer.style.display = 'none';
        passwordInput.value = '';
        errorMessage.style.display = 'none';
        localStorage.setItem('logged_in', false);
    });

    allButton.addEventListener('click', () => loadAtletas('all'));
    masculinoButton.addEventListener('click', () => loadAtletas('masculino'));
    femininoButton.addEventListener('click', () => loadAtletas('feminino'));

    elencoSelect.addEventListener('change', () => loadAtletas(elencoSelect.value));

    filterInput.addEventListener('input', () => filterAtletas());

    function loadAtletas(type) {
        let url;
        if (type === 'all') {
            url = 'https://botafogo-atletas.mange.li/2024-1/all';
        } else if (type === 'masculino') {
            url = 'https://botafogo-atletas.mange.li/2024-1/masculino';
        } else if (type === 'feminino') {
            url = 'https://botafogo-atletas.mange.li/2024-1/feminino';
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayAtletas(data);
            })
            .catch(error => {
                console.error('Erro ao carregar atletas:', error);
            });
    }

    function displayAtletas(atletas) {
        atletasList.innerHTML = '';
        atletas.forEach(atleta => {
            const card = document.createElement('div');
            card.className = 'atleta-card';
            const idade = calcularIdade(atleta.nascimento);
            let infoHtml = `
                <h3>${atleta.nome}</h3>
                <p>${atleta.posicao}</p>
                <p>${idade} anos</p>
                <img src="${atleta.imagem}" alt="${atleta.nome}">
                <a href="detalhes.html?id=${atleta.id}">Ver detalhes</a>
            `;
            if (atleta.nacionalidade) {
                infoHtml += `<p>Nacionalidade: ${atleta.nacionalidade}</p>`;
            }
            if (atleta.altura) {
                infoHtml += `<p>Altura: ${atleta.altura} cm</p>`;
            }
            if (atleta.peso) {
                infoHtml += `<p>Peso: ${atleta.peso} kg</p>`;
            }
            card.innerHTML = infoHtml;
            atletasList.appendChild(card);
        });
    }

    function filterAtletas() {
        const filter = filterInput.value.toLowerCase();
        const cards = atletasList.getElementsByClassName('atleta-card');
        Array.from(cards).forEach(card => {
            const name = card.getElementsByTagName('h3')[0].innerText.toLowerCase();
            if (name.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function calcularIdade(data_nascimento) {
        const hoje = new Date();
        const [dia, mes_nasc, ano] = data_nascimento.split('/');
        const nascimento = new Date(ano, mes_nasc - 1, dia);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }
});

















