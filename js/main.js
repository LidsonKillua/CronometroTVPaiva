var TempoRound = 5 * 60; //5min
var TempoDescanso = 2 * 60; //2min
var Rounds = 5;

var OldTempoRound = TempoRound;
var OldTempoDescanso = TempoDescanso;
var OldRounds = Rounds;

var time = 300;
var round = 1;
var pausado = false;
var descanso = false;
var fim = false;
var configurando = false;
var etapaConfig = 0; // 0 = TempoRound, 1 = TempoDescanso, 2 = Rounds
var tempoImagem = Math.floor(TempoDescanso / 4 * 1000);
var ImagemAtual = 0;
var auxImg = 0;
var auxControles = 0;

var colunaEsq = document.getElementById('colEsc');
var colunaDir = document.getElementById('colDir');

var botaoIniciar = document.getElementById('botao-iniciar');
var botaoConfigurar = document.getElementById('botao-configurar');
var botaoPausar = document.getElementById('botao-pausar');
var botaoReiniciar = document.getElementById('botao-reiniciar');

var controles = document.getElementById('controles');
var imgsDescanso = document.getElementById('imagens-descanso');
var imgGfteam = document.getElementById('logo-Gfteam');
var imgArteLivros = document.getElementById('logoArteLivros');
var imgBotica = document.getElementById('logoBotica');
var imgPrecisao = document.getElementById('logoPrecisao');
var imgRodolpho = document.getElementById('logoRodolpho');

var relogio = document.getElementById('relógio');
var timer = document.getElementById('timer');
var descricao = document.getElementById('desc');

var audio = document.getElementById('som');

function updateTimer() {
  if (pausado || fim) return;
  if (time > 0) {
    time--;
  } else {
    tocarSom();

    if (descanso) {
      round++;
      if (round > Rounds) {
        descricao.textContent = 'Fim do treino';
        botaoIniciar.style.display = 'none';
        botaoPausar.style.display = 'none';
        botaoReiniciar.style.display = 'table-cell';
        colunaDir.style.backgroundColor = 'black';
        fim = true;
        botaoReiniciar.focus();
        return;
      }
      time = TempoRound;
      descanso = false;
      colunaEsq.style.backgroundColor = '#222';
      colunaDir.style.backgroundColor = 'green';
    } else {
      time = TempoDescanso;
      descanso = true;
      colunaEsq.style.backgroundColor = 'white';
      colunaDir.style.backgroundColor = 'red';              
    }

    descricao.textContent = 'Round ' + round + '/' + Rounds;
    ImagemAtual--;
    mostrarImagensDescanso();
  }
  updateVisualTimer();   
}

function updateVisualTimer() {
  var mins = Math.floor(time / 60);
  var secs = time % 60;
  timer.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;   
}

function atualizarRelogio() {
  var agora = new Date();
  var horas = agora.getHours();
  var minutos = agora.getMinutes();
  var horaFormatada = (horas < 10 ? '0' : '') + horas + ':' + (minutos < 10 ? '0' : '') + minutos;
  relogio.textContent = horaFormatada;

  if (controles.style.display === 'block') {
    auxControles++;
    if (auxControles > 3) {
      controles.style.display = 'none';
      
      if (descanso) {
        imgsDescanso.style.display = 'block';
      } else {
        imgGfteam.style.display = 'block';
      }
      auxControles = 0;
    }
  }
}

function mostrarImagensDescanso() {      
  ImagemAtual++;
  if (ImagemAtual > 3) {
    ImagemAtual = 0;
  }

  if (descanso) {    
    imgsDescanso.style.display = 'block';
    imgGfteam.style.display = 'none';
    imgArteLivros.style.display = 'none';
    imgBotica.style.display = 'none';
    imgPrecisao.style.display = 'none';
    imgRodolpho.style.display = 'none';
    
    switch (ImagemAtual) {
      case 0:
        imgArteLivros.style.display = 'block';
        break;
      case 1:
        imgBotica.style.display = 'block';
        break;
      case 2:
        imgPrecisao.style.display = 'block';
        break;
      case 3:
        imgRodolpho.style.display = 'block';
        break;
    }
  } else {
    imgGfteam.style.display = 'block';
    imgsDescanso.style.display = 'none';
    imgArteLivros.style.display = 'none';
    imgBotica.style.display = 'none';
    imgPrecisao.style.display = 'none';
    imgRodolpho.style.display = 'none';
  }
}

function adicionar1Minuto() {
  time += 60;
  updateVisualTimer();
}

function AddConfig() {
  if (etapaConfig === 0) {
    TempoRound += 60;
    time = TempoRound;
    updateVisualTimer();
  } else if (etapaConfig === 1) {
    TempoDescanso += 30;
    time = TempoDescanso;
    updateVisualTimer();
  } else {
    Rounds++;
    descricao.textContent = 'Round ' + round + '/' + Rounds;
  }  
  botaoConfigurar.focus();
}

function remover1Minuto() {
  time = Math.max(0, time - 60);
  updateVisualTimer();
}

function RemConfig() {
  if (etapaConfig === 0) {
    TempoRound = Math.max(60, TempoRound - 60);
    time = TempoRound;
    updateVisualTimer();
  } else if (etapaConfig === 1) {
    TempoDescanso = Math.max(30, TempoDescanso - 30);
    time = TempoDescanso;
    updateVisualTimer();
  } else {
    Rounds = Math.max(1, Rounds - 1);
    descricao.textContent = 'Round ' + round + '/' + Rounds;
  }
  botaoConfigurar.focus();
}

function avancar() {
  if (!fim)
    time = 0;
}

function retroceder() {
  if (fim) {
    fim = false;
    round = rounds;
    time = TempoRound;
    descanso = false;
    pausado = false;
  } else if (descanso) {
    time = TempoDescanso
  } else {
    time = TempoRound;
  }
}

function tocarSom() {  
  enviarComandoTocar();  // Envia comando para o servidor tocar o som
  audio.play();  // Toca o som no cliente
}

function enviarComandoTocar() {
  /*const url = "http://192.168.0.5:3000/tocar"; 
  fetch(url, {
    method: 'POST'
  }).catch(err => console.error(err));*/
  const url = "https://tocarsompaivaapi.onrender.com/tocar";
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('Success:', xhr.responseText);
      } else {
        console.error('There has been a problem with your XMLHttpRequest operation:', xhr.statusText);
      }
    }
  };
  xhr.send();
}

// Evento do botão "Iniciar"
botaoIniciar.onclick = function () {
  tocarSom();
  fim = false;
  botaoConfigurar.style.display = 'none';
  botaoIniciar.style.display = 'none';
  botaoPausar.style.display = 'table-cell';
  botaoPausar.focus();
  botaoReiniciar.style.display = 'none';
  colunaEsq.style.backgroundColor = '#222';
  colunaDir.style.backgroundColor = 'green';
  descricao.textContent = 'Round ' + round + '/' + Rounds; 
  tempoImagem = Math.floor(TempoDescanso / 4 * 1000);     
  setInterval(updateTimer, 1000);     
  setInterval(mostrarImagensDescanso, tempoImagem);   
};

// Evento do botão "Pausar"
botaoPausar.onclick = function () {
  pausado = !pausado;
  botaoPausar.textContent = pausado ? 'Continuar' : 'Pausar';
  botaoReiniciar.style.display = pausado ? 'table-cell' : 'none';
};

// Evento do botão "Reiniciar"
botaoReiniciar.onclick = function () {
  if (configurando) {
    TempoRound = OldTempoRound;
    TempoDescanso = OldTempoDescanso;
    Rounds = OldRounds;
    configurando = false;
    botaoConfigurar.style.display = 'none';
    botaoIniciar.style.display = 'table-cell';
    botaoIniciar.focus();
    botaoPausar.style.display = 'none';
    botaoReiniciar.style.display = 'none';
    botaoReiniciar.textContent = 'Reiniciar';
    descricao.style.color = '#f0f0f0';   
    timer.style.color = '#f0f0f0'; 
    time = TempoRound;
    descricao.textContent = 'Round ' + round + '/' + Rounds; 
    updateVisualTimer();
    return;
  }

  tocarSom();
  time = TempoRound;
  round = 1;
  fim = false;
  pausado = false;
  descanso = false;
  botaoIniciar.style.display = 'none';
  botaoPausar.textContent = 'Pausar';
  botaoPausar.style.display = 'table-cell';
  botaoReiniciar.style.display = 'none';
  descricao.textContent = 'Round ' + round + '/' + Rounds;
  colunaEsq.style.backgroundColor = '#222';
  colunaDir.style.backgroundColor = 'green';
  ImagemAtual--;
  mostrarImagensDescanso();
  botaoPausar.focus();  
};

// Evento do botão "Configurar"
botaoConfigurar.onclick = function () {
  if (!configurando) {
    configurando = true;
    etapaConfig = 0;
    OldTempoRound = TempoRound;
    OldTempoDescanso = TempoDescanso;
    OldRounds = Rounds;
    botaoConfigurar.textContent = 'Ok';
    botaoIniciar.style.display = 'none';
    botaoReiniciar.style.display = 'table-cell';
    botaoReiniciar.textContent = 'Cancelar';
    descricao.textContent = 'Tempo do round';
    timer.style.color = '#eb7a7a';
  } else if (etapaConfig === 0) {
    etapaConfig = 1;
    descricao.textContent = 'Tempo de descanso';
    timer.style.color = '#7a7aeb';
    time = TempoDescanso;
    updateVisualTimer();
  } else if (etapaConfig === 1) {
    etapaConfig = 2;
    descricao.textContent = 'Round ' + round + '/' + Rounds;
    descricao.style.color = '#eb7a7a';
    timer.style.color = '#f0f0f0';
  } else {
    configurando = false;
    botaoConfigurar.textContent = 'Configurar';
    botaoConfigurar.style.display = 'none';
    botaoIniciar.style.display = 'table-cell';
    botaoIniciar.focus();
    botaoReiniciar.style.display = 'none';
    botaoReiniciar.textContent = 'Reiniciar';
    descricao.style.color = '#f0f0f0';    
    time = TempoRound;
    updateVisualTimer();
  }
};

document.addEventListener('keydown', function (event) {
  var keyCode = event.keyCode;
  
  if (keyCode === 38 || keyCode === 112) { // Seta para cima ou A controle
    if (configurando) {
      AddConfig();
    } else {  
      adicionar1Minuto();
    }
  } else if (keyCode === 40 || keyCode === 113) { // Seta para baixo ou B controle
    if (configurando) {
      RemConfig();
    } else {
      remover1Minuto();
    }
  } else if (keyCode === 39 || keyCode === 120) { // Seta para direita ou Info controle
    avancar();
  } else if (keyCode === 37 || keyCode === 116) { // Seta para esquerda ou Tools controle
    retroceder();
  } else if (keyCode === 114) { // C controle
    controles.style.display = 'block';
    auxControles = 0;
    imgsDescanso.style.display = 'none';
    imgGfteam.style.display = 'none';
  } 
});

function Iniciar() {
  time = TempoRound;
  updateVisualTimer()
  controles.style.display = 'none';
  botaoPausar.style.display = 'none';
  botaoReiniciar.style.display = 'none';
  descricao.textContent = 'Round ' + round + '/' + Rounds;
  setInterval(atualizarRelogio, 1000); // Atualiza a cada segundo
  atualizarRelogio(); // Atualiza imediatamente
  botaoIniciar.focus();
}

Iniciar()