document.addEventListener('DOMContentLoaded', () => {
    const atletaDetalhes = document.getElementById('atleta-detalhes');
    const voltarButton = document.getElementById('voltar-button');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const atletaId = urlParams.get('id');

    const is_logged_in = localStorage.getItem('logged_in') === 'true';

    if(!is_logged_in) {
        window.location.href = '/AP2_BOTAFOGO';
        return;
    }

    if (!atletaId) {
        atletaDetalhes.innerHTML = '<p>Erro: ID do atleta não encontrado na URL.</p>';
        return;
    }

    fetch(`https://botafogo-atletas.mange.li/2024-1/${atletaId}`)
        .then(response => response.json())
        .then(data => {
            displayAtleta(data);
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes do atleta:', error);
            atletaDetalhes.innerHTML = '<p>Erro ao carregar detalhes do atleta. Tente novamente mais tarde.</p>';
        });

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

    function displayAtleta(atleta) {
        atletaDetalhes.innerHTML = `
           <div class="atleta-detalhes-container">
           <div class="atleta-card">
               <img src="${atleta.imagem}" alt="${atleta.nome}">
               <h3>${atleta.nome}</h3>
               <p>${atleta.posicao}</p>
           </div>
            <div>             
                <p>${atleta.detalhes}</p>
                <p>Idade: ${calcularIdade(atleta.nascimento)}</p>
                <p>Posição: ${atleta.posicao}</p>
                <p>Naturalidade: ${atleta.naturalidade}</p>
            </div>
           </div>
            <!-- Adicione mais detalhes conforme necessário -->
        `;
    }

    voltarButton.addEventListener('click', () => {
        window.history.back();
    });
});
