var TempoRound = 5 * 60; //5min
    var TempoDescanso = 2 * 60; //2min
    var Rounds = 5;

    var time = 300;
    var round = 1;
    var pausado = false;
    var descanso = false;
    var fim = false;
    var tempoImagem = Math.floor(TempoDescanso / 4 * 1000);
    var ImagemAtual = 0;
    var auxImg = 0;
    var auxControles = 0;

    var colunaEsq = document.getElementById('colEsc');
    var colunaDir = document.getElementById('colDir');

    var botaoIniciar = document.getElementById('botao-iniciar');
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

    var somGongo = document.getElementById('som-inicio');

    function updateTimer() {
      if (pausado || fim) return;
      if (time > 0) {
        time--;
      } else {  
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
          descricao.textContent = 'Round ' + round + '/' + Rounds;
          colunaEsq.style.backgroundColor = '#222';
          colunaDir.style.backgroundColor = 'green';
          ImagemAtual--;
          mostrarImagensDescanso();
          somGongo.play();
        } else {
          time = TempoDescanso;
          descanso = true;
          descricao.textContent = 'Round ' + round + '/' + Rounds;;
          colunaEsq.style.backgroundColor = 'white';
          colunaDir.style.backgroundColor = 'red';
          ImagemAtual--;
          mostrarImagensDescanso();

          if (round === 1) {
            setInterval(mostrarImagensDescanso, tempoImagem);
          }           

          somGongo.play();
        }
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
    }

    function remover1Minuto() {
      time = Math.max(0, time - 60);
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

    // Evento do botão "Iniciar"
    botaoIniciar.onclick = function () {
      fim = false;
      botaoIniciar.style.display = 'none';
      botaoPausar.style.display = 'table-cell';
      botaoPausar.focus();
      botaoReiniciar.style.display = 'none';
      colunaEsq.style.backgroundColor = '#222';
      colunaDir.style.backgroundColor = 'green';
      descricao.textContent = 'Round ' + round + '/' + Rounds;      
      setInterval(updateTimer, 1000);           
      somGongo.play();
    };

    // Evento do botão "Pausar"
    botaoPausar.onclick = function () {
      pausado = !pausado;
      botaoPausar.textContent = pausado ? 'Continuar' : 'Pausar';
      botaoReiniciar.style.display = pausado ? 'table-cell' : 'none';
    };

    // Evento do botão "Reiniciar"
    botaoReiniciar.onclick = function () {
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
      botaoPausar.focus();
      somGongo.play();
    };

    document.addEventListener('keydown', function (event) {
      var keyCode = event.keyCode;
      
      if (keyCode === 38 || keyCode === 112) { // Seta para cima ou A controle
        adicionar1Minuto();
      } else if (keyCode === 40 || keyCode === 113) { // Seta para baixo ou B controle
        remover1Minuto();
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