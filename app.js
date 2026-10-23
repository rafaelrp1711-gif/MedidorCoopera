
const aparelhos = [];

const form = document.querySelector('#form-aparelho');
const lista = document.querySelector('#lista-aparelhos');
const resultado = document.querySelector('#resultado');
const mensagemErro = document.querySelector('#mensagem-erro');

function desenharLista() {
    lista.innerHTML = '';

    aparelhos.forEach(function(aparelho, indice) {
        const item = document.createElement('li');
        const texto = document.createElement('span');
        const botao = document.createElement('button');

        texto.textContent = aparelho.nome;
        botao.textContent = 'Remover';
        botao.type = 'button';

        botao.addEventListener('click', function() {
            aparelhos.splice(indice, 1);
            desenharLista();
        });

        item.appendChild(texto);
        item.appendChild(botao);
        lista.appendChild(item);
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.querySelector('#nome').value.trim();
    const potencia = Number(document.querySelector('#potencia').value);
    const horas = Number(document.querySelector('#horas').value);
    const dias = Number(document.querySelector('#dias').value);

    if (nome === '') {
        mensagemErro.textContent = 'Digite o nome do aparelho.';
        return;
    }

    aparelhos.push({
        nome: nome,
        potenciaW: potencia,
        horasDia: horas,
        diasMes: dias
    });

    desenharLista();
    form.reset();
    mensagemErro.textContent = '';
});

document.querySelector('#btn-simular').addEventListener('click', async function() {
    mensagemErro.textContent = '';

    if (aparelhos.length === 0) {
        mensagemErro.textContent = 'Adicione pelo menos um aparelho.';
        return;
    }

    try {
        const resposta = await fetch('/api/simular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aparelhos: aparelhos
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagemErro.textContent = dados.erro;
            return;
        }

        resultado.innerHTML = '';

        const titulo = document.createElement('h2');
        titulo.textContent = 'Resultado da simulação';
        resultado.appendChild(titulo);

        const informacoes = [
            'Consumo mensal: ' + dados.consumoKwhMes + ' kWh',
            'Custo da energia: ' + dados.custoEnergia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'Adicional da bandeira: ' + dados.adicionalBandeira.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'Total da conta: ' + dados.totalMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'Painéis solares necessários: ' + dados.paineisNecessarios,
            'Aparelho que mais consome em dinheiro: ' + dados.aparelhoMaisCaro.nome
        ];

        informacoes.forEach(function(informacao) {
            const paragrafo = document.createElement('p');
            paragrafo.textContent = informacao;
            resultado.appendChild(paragrafo);
        });

        const subtitulo = document.createElement('h3');
        subtitulo.textContent = 'Detalhes dos aparelhos';
        resultado.appendChild(subtitulo);

        dados.detalhes.forEach(function(aparelho) {
            const paragrafo = document.createElement('p');

            paragrafo.textContent =
                aparelho.nome + ': ' +
                aparelho.kwhMes + ' kWh, ' +
                aparelho.custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) +
                ' (' + aparelho.percentual + '% do consumo)';

            resultado.appendChild(paragrafo);
        });

    } catch (erro) {
        mensagemErro.textContent = 'Não foi possível conectar ao servidor.';
    }
});
