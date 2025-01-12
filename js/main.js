// Constantes do timer
const TEMPO_TREINO = 5 * 60; // 5 minutos em segundos
const TEMPO_DESCANSO = 2 * 60; // 2 minutos em segundos
const RODADAS = 5; // Número de rodadas

// Variáveis de estado
let rodadaAtual = 1;
let tempoAtual = TEMPO_TREINO;
let pausado = false;
let intervaloTimer = null;
let State = 'Iniciar';

// Elementos da interface
const temporizadorElemento = document.getElementById('temporizador');
const statusElemento = document.getElementById('status');
const botãoPausar = document.getElementById('botao-pausar');
const botãoReiniciar = document.getElementById('botao-reiniciar');
const somInicio = document.getElementById('som-inicio');

//Imagens
const logoGfteam = document.getElementById('logo-Gfteam');
let imagemAtual = 0;
let aux = 0;
let tempoImagem = TEMPO_DESCANSO / 4;        
const imagens = ['logoArteLivros', 'logoBotica', 'logoPrecisao', 'logoRodolpho'];

// Função para formatar o tempo
function formatarTempo(segundos) {
    const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
    const segundosRestantes = String(segundos % 60).padStart(2, '0');
    return minutos + ':' + segundosRestantes;
}

function atualizarExibição() {
    statusElemento.textContent = 'Round ' + rodadaAtual + '/' + RODADAS;
    botãoPausar.style.display = 'block';
    botãoReiniciar.style.display = pausado ? 'block' : 'none';
    temporizadorElemento.textContent = formatarTempo(tempoAtual);    
    MostrarPatrocinadores(State == 'Descanso' || State == 'Fim');

    switch (State) {
        case 'Iniciar':
            document.body.style.backgroundColor = '#000';
            botãoPausar.textContent = 'Iniciar';
            break;
        case 'Em treino':
            document.body.style.backgroundColor = '#41a00b';
            botãoPausar.textContent = pausado ? 'Retomar' : 'Pausar';
            break;
        case 'Descanso':
            document.body.style.backgroundColor = '#742323';
            botãoPausar.textContent = pausado ? 'Retomar' : 'Pausar';
            TrocarImagens();
            break;
        case 'Fim':
            document.body.style.backgroundColor = '#000';
            botãoPausar.style.display = 'none';
            botãoReiniciar.style.display = 'block';
            statusElemento.textContent = 'Fim';
            TrocarImagens();
            break;
    } 
}

function MostrarPatrocinadores(mostrar) {
    if (mostrar) {
        logoGfteam.style.display = 'none';
        document.getElementById('imagensDescanso').style.display = 'block';
        document.getElementById('colunaEsq').style.backgroundColor = '#f0f0f0';
    } else {
        logoGfteam.style.display = 'block';
        document.getElementById('imagensDescanso').style.display = 'none';
        document.getElementById('colunaEsq').style.backgroundColor = null;
    } 
}

function TrocarImagens() {      
    if (aux >= tempoImagem) {
        imagemAtual = imagemAtual < 3 ? imagemAtual + 1 : 0;
        aux = 0;
    }
    aux++;

    for (let i = 0; i < imagens.length; i++) {
        if (i == imagemAtual) {
            document.getElementById(imagens[i]).style.display = 'block';
        } else {
            document.getElementById(imagens[i]).style.display = 'none';
        }
    }
}

// Função para controlar os sons do aplicativo
function tocargongo() {
    somInicio.play();
}


// Função para alternar entre pausar e retomar o timer
function alternarPausa() {
    if (State == 'Iniciar') {
        State = 'Em treino';
        iniciarTimer();
        tocargongo();
    } else if (State == 'Fim') {
        reiniciar();
    } else {
        pausado = !pausado;
    }
}

// Função para iniciar o timer
function iniciarTimer() {
    intervaloTimer = setInterval(() => {
        if (!pausado && State != 'Fim') {
            if (tempoAtual > 0) {
                tempoAtual--;
            } else {
                if (State == 'Em treino') {
                    State = 'Descanso';
                    tempoAtual = TEMPO_DESCANSO;
                } else {
                    rodadaAtual++;

                    if (rodadaAtual > RODADAS) {
                        State = 'Fim';
                    } else {                    
                        State = 'Em treino';
                        tempoAtual = TEMPO_TREINO;
                    }
                }
                tocargongo();
            }
        }                
        atualizarExibição();
    }, 1000);
}

// Função para reiniciar o timer
function reiniciar() {
    rodadaAtual = 1;
    tempoAtual = TEMPO_TREINO;
    State = 'Iniciar';
    pausado = false;
    clearInterval(intervaloTimer);
    atualizarExibição();
}

function adicionar1Minuto() {
    tempoAtual += 60;
    atualizarExibição();
}

function remover1Minuto() {
    tempoAtual = Math.max(0, tempoAtual - 60);
    atualizarExibição();
}

function voltar() {
    if (State == 'Iniciar') {
        return;
    } else if (State == 'Fim') {
        rodadaAtual = RODADAS;
        tempoAtual = TEMPO_TREINO;
        State = 'Em treino';
    } else if (State == 'Em treino' || State == 'Descanso') {
        tempoAtual = State == 'Em treino' ? TEMPO_TREINO : TEMPO_DESCANSO;
    }   
    pausado = false;
    atualizarExibição();
}

function avancar() {
	if (State == 'Descanso' && rodadaAtual == RODADAS) {
		tempoAtual = 0;
	} else if (State == 'Em treino' || State == 'Descanso') {
        rodadaAtual = State == 'Descanso' ? rodadaAtual + 1 : rodadaAtual;
        tempoAtual = State == 'Em treino' ? TEMPO_DESCANSO : TEMPO_TREINO;
        State = State == 'Em treino' ? 'Descanso' : 'Em treino';
        pausado = false;
        atualizarExibição();
        tocargongo();
    }       
}

// Função para mostrar o horário atual
function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const horaFormatada = horas + ':' + minutos;
    document.getElementById('relógio').textContent = horaFormatada;
}

// Função de inicialização
const inicializar = function () {
    setInterval(atualizarRelogio, 1000); // Atualiza a cada segundo
    atualizarRelogio(); // Atualiza imediatamente
    atualizarExibição(); // Atualiza a exibição do timer

    // Adiciona o evento de teclado
    document.addEventListener('keydown', function(e) {
        switch(e.keyCode){
            case 13: // Botão OK
                alternarPausa(); // Alterna entre iniciar e pausar
                break;
            case 10182: // Botão PLAY
                alternarPausa(); // Alterna entre iniciar e pausar
                break;
            case 10073: // Botão PAUSE
                alternarPausa(); // Alterna entre iniciar e pausar
                break;
            case 10071: // Botão REWIND
            	reiniciar(); // Reinicia o timer
                break;
            case 10074: // Botão STOP
            	reiniciar(); // Reinicia o timer
                break;                    
            case 10009: // Botão RETURN
                tizen.application.getCurrentApplication().exit();
                break;
            case 38: // Seta para cima
                adicionar1Minuto(); // Adiciona 1 minuto ao timer
                break;
            case 40: // Seta para baixo
                remover1Minuto(); // Remove 1 minuto do timer
                break;  
            case 37: // Seta para esquerda
                voltar(); // Volta uma rodada
                break;
            case 39: // Seta para direita
                avancar(); // Avança uma rodada
                break;                   
            default:
                console.log('Código da tecla: ' + e.keyCode);
                break;
        }
    });
};

window.onload = inicializar;