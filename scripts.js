const GUARDA_MEDIA = document.getElementById('media');
const GUARDA_PRECO = document.getElementById('preco');
const GUARDA_KM_DIA = document.getElementById('quilometros_dia');
const GUARDA_DIAS_SEMANA = document.getElementById('dias_semana');

let gastoDia = 0;
let gastoSemanal = 0;
let gastoMensal = 0;
let gastoAnual = 0;

const date = new Date();
const slice = date.toString().slice(0, 21);

const FORM = document.querySelector('form');
const BOTAO_CALCULAR = document.querySelector('form div button');
const MODAL_WRAPPER = document.getElementById('resultado');
const BOTAO_MODAL_SALVAR = document.getElementById('salvar');
const BOTAO_MODAL_DESCARTAR = document.getElementById('descartar');
const BOTAO_HISTORICO_FECHAR = document.getElementById('buttonFechar');
const BOTAO_HISTORICO_EXCLUIR_TUDO = document.getElementById('excluir-registros');
const MODAL_FUNDO = document.getElementById('fundo-modal');
const HISTORICO = document.getElementById('ver-historico');

const SALVA_CALCULO = [];
const SALVA_HISTORICO = [];

//declaração de vetor para localSorage
const STORAGE = []

FORM.addEventListener("submit", (event) => {
    event.preventDefault()
})


// ------ UTILIZE CTRL+CLICK PARA NAVEGAR ENTRE FUNÇÕES ------


BOTAO_CALCULAR.addEventListener('click', () => {
    calculoGastoDia()
    calculoGastoSemanal()
    calculoGastoMensal()
    calculoGastoAnual()

    elementoVisibilidade('resultado', 'visible')
    elementoVisibilidade('fundo-modal', 'visible')

    document.querySelector('tbody').innerHTML = templateModal(gastoDia, gastoSemanal, gastoMensal, gastoAnual)
})

MODAL_FUNDO.addEventListener('click', () => {
    elementoVisibilidade('fundo-modal', 'hidden')
    elementoVisibilidade('resultado', 'hidden')
    elementoVisibilidade('historico', 'hidden')
    elementoVisibilidade('zero-registros', 'hidden')
})

BOTAO_MODAL_DESCARTAR.addEventListener('click', () => {
    elementoVisibilidade('resultado', 'hidden')
    elementoVisibilidade('fundo-modal', 'hidden')
    limpaCampos()

    GUARDA_MEDIA.focus()
})

BOTAO_MODAL_SALVAR.addEventListener('click', () => {
    SALVA_CALCULO.push({
        data: slice,
        media: GUARDA_MEDIA.value,
        preco: GUARDA_PRECO.value,
        kmDia: GUARDA_KM_DIA.value,
        diasSemana: GUARDA_DIAS_SEMANA.value,
        gastoDiario: gastoDia,
        gastoSemanal: gastoSemanal,
        gastoMensal: gastoMensal,
        gastoAnual: gastoAnual,
        acao: `<img src="images/trashbin_24dp.png">`
    })

    //envia os dados de SALVA_CALCULO para o localStorage como JSON
    localStorage.setItem('historico', JSON.stringify(SALVA_CALCULO))

    elementoVisibilidade('resultado', 'hidden')
    elementoVisibilidade('fundo-modal', 'hidden')
    limpaCampos()

    GUARDA_MEDIA.focus()
})

HISTORICO.addEventListener('click', () => {
    elementoVisibilidade('fundo-modal', 'visible')

    //verificação de conteúdo no vetor de cálculos para exibição de modal correto]

    //se o localStorage estiver vazio
    if (JSON.parse(localStorage.getItem('historico')) == null) {
        elementoVisibilidade('zero-registros', 'visible')

        //senão
    } else {
        JSON.parse(localStorage.getItem('historico')).length < 1 ?
            elementoVisibilidade('zero-registros', 'visible') :
            elementoVisibilidade('historico', 'visible')

        limpaHistorico()
        criaHistorico()
    }

})

BOTAO_HISTORICO_FECHAR.addEventListener('click', () => {
    elementoVisibilidade('historico', 'hidden')
    elementoVisibilidade('fundo-modal', 'hidden')
})

BOTAO_HISTORICO_EXCLUIR_TUDO.addEventListener('click', () => {
    excluirHistorico()
    limpaHistorico()
})

function calculoGastoDia() {
    gastoDia = ((GUARDA_KM_DIA.value.replace(',', '.') / GUARDA_MEDIA.value.replace(',', '.')) * GUARDA_PRECO.value.replace(',', '.')).toFixed(2)
}

//cálculo de consumo semanal  **CÁLCULO FEITO COM A QUANTIDADE DE DIAS RECEBIDA DO USUÁRIO**
function calculoGastoSemanal() {
    gastoSemanal = (gastoDia * GUARDA_DIAS_SEMANA.value).toFixed(2)
}

function calculoGastoMensal() {
    gastoMensal = (gastoSemanal * 4).toFixed(2)
}

function calculoGastoAnual() {
    gastoAnual = (gastoMensal * 12).toFixed(2)
}

function templateModal(gastoDiario, gastoSemanal, gastoMensal, gastoAnual) {
    return `
    <td>${gastoDiario}</td>
    <td>${gastoSemanal}</td>
    <td>${gastoMensal}</td>
    <td>${gastoAnual}</td>
    `
}

function templateHistorico(guarda_preco, guarda_media, gastoDiario, gastoSemanal, gastoMensal, gastoAnual, array, obj) {
    return `
        <td>${slice}</td>
        <td>${guarda_preco}</td>
        <td>${guarda_media}</td>
        <td>${gastoDiario}</td>
        <td>${gastoSemanal}</td>
        <td>${gastoMensal}</td>
        <td>${gastoAnual}</td>
        <td><img src="images/trashbin_24dp.png" onclick = "lixeira(${obj})"></td>
    `
}

function elementoVisibilidade(iDElemento, valorAtributo) {
    document.getElementById(iDElemento).style.visibility = valorAtributo
}

function limpaCampos() {
    GUARDA_MEDIA.value = ''
    GUARDA_PRECO.value = ''
    GUARDA_KM_DIA.value = ''
    GUARDA_DIAS_SEMANA.value = ''
}

//limpa o localStorage e seu vetor
function excluirHistorico() {
    STORAGE.splice(0)

    localStorage.clear()
}

function limpaHistorico() {
    document.querySelector('#historico #conteudo-modal table tbody').innerHTML = ''
}

//gera a tabela do modal histórico
function criaHistorico() {

    //limpa o vetor 
    while (STORAGE.length) {
        STORAGE.shift()
    }

    //lista as posições de cada cálculo do localStorage
    Object.keys(JSON.parse(localStorage.getItem('historico')))
        //para cada chave
        .forEach(element =>
            //insere em uma posição do vetor o objeto corrente do localStorage
            STORAGE.push(Object.values(JSON.parse(localStorage.getItem('historico')))[element]))

    for (const objeto of STORAGE) {
        document.querySelector('#historico #conteudo-modal table tbody').innerHTML +=
            templateHistorico(
                objeto.preco,
                objeto.media,
                objeto.gastoDiario,
                objeto.gastoSemanal,
                objeto.gastoMensal,
                objeto.gastoAnual,
                'STORAGE',
                STORAGE.indexOf(objeto)
            )
    }
}

//instruções da função atrelada ao ícone lixeira por meio do atributo onclick utilizado no templateHistorico()
function lixeira(indice) {
    //remove do vetor os dados na mesma posição da lixeira clicada
    STORAGE.splice(indice, 1)

    //atualiza o localStorage com os dados acima
    localStorage.setItem('historico', JSON.stringify(STORAGE))

    //remove a tabela antiga do modal histórico
    limpaHistorico()
    //insere nova tabela no modal histórico
    criaHistorico()
}