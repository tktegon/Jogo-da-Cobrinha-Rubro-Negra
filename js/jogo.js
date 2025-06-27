// filepath: /snake-game/snake-game/src/js/jogo.js
console.log("Debug");

const tela = document.getElementById("tela");
const contexto = tela.getContext("2d");

const tamanhoBloco = 20;
const totalBlocos = Math.floor(tela.width / tamanhoBloco);

const spanPontuacao = document.querySelector("#painel-controle span");
const somComer = new Audio("/audio/somPontos.mp3");
const musicaFundo = new Audio("audio/musicaFundo.mp4");
musicaFundo.volume = 0.1;
musicaFundo.loop = true;

let cobrinha = [{ x: 5, y: 5 }];
let direcao = "direita";
let comida = { x: 0, y: 0 };
let pontuacao = 0;
let jogoAtivo = false;

let tempoAtualizacao = 250;
let timeoutId = null;

// ------------------------ Funções principais ------------------------

function iniciarJogo() {
    const dificuldade = document.getElementById("Dificuldade").value;
    if (dificuldade === "facil") tempoAtualizacao = 250;
    else if (dificuldade === "medio") tempoAtualizacao = 120;
    else if (dificuldade === "dificil") tempoAtualizacao = 60;

    jogoAtivo = true;
    pontuacao = 0;
    spanPontuacao.textContent = pontuacao;
    cobrinha = [{ x: 5, y: 5 }];
    direcao = "direita";
    gerarComida();

    musicaFundo.currentTime = 0;
    musicaFundo.play();

    if (timeoutId) clearTimeout(timeoutId);
    atualizar();
}

function atualizar() {
    if (!jogoAtivo) return;

    // Calcula nova posição da cabeça
    const novaCabeca = { x: cobrinha[0].x, y: cobrinha[0].y };
    switch (direcao) {
        case "cima": novaCabeca.y--; break;
        case "baixo": novaCabeca.y++; break;
        case "esquerda": novaCabeca.x--; break;
        case "direita": novaCabeca.x++; break;
    }

    // Adiciona a nova cabeça
    cobrinha.unshift(novaCabeca);

    // Verifica se comeu a comida
    if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
        pontuacao++;
        spanPontuacao.textContent = pontuacao;
        gerarComida();
        somComer.currentTime = 0;
        somComer.play();
    } else {
        // Remove o último segmento
        cobrinha.pop();
    }

    // Só agora verifica colisão com bordas
    if (
        novaCabeca.x < 0 || novaCabeca.x >= totalBlocos ||
        novaCabeca.y < 0 || novaCabeca.y >= totalBlocos ||
        colisaoComCobra(novaCabeca)
    ) {
        jogoAtivo = false;
        musicaFundo.pause();
        alert("Game Over! Sua pontuação foi: " + pontuacao);
        return;
    }

    contexto.clearRect(0, 0, tela.width, tela.height);
    desenharCenario();
    desenharCobra();
    desenharComida();

    timeoutId = setTimeout(atualizar, tempoAtualizacao);
}

// ------------------------ Utilitários ------------------------

function gerarComida() {
    let novaPos;
    do {
        novaPos = {
            x: Math.floor(Math.random() * totalBlocos),
            y: Math.floor(Math.random() * totalBlocos)
        };
    } while (cobrinha.some(p => p.x === novaPos.x && p.y === novaPos.y)); // evita gerar comida dentro da cobra

    comida = novaPos;
}

function mudarDirecao(evento) {
    switch (evento.key) {
        case "ArrowUp":
            if (direcao !== "baixo") direcao = "cima";
            break;
        case "ArrowDown":
            if (direcao !== "cima") direcao = "baixo";
            break;
        case "ArrowLeft":
            if (direcao !== "direita") direcao = "esquerda";
            break;
        case "ArrowRight":
            if (direcao !== "esquerda") direcao = "direita";
            break;
    }
}

function colisaoComCobra(cabeca) {
    for (let i = 1; i < cobrinha.length; i++) {
        if (cobrinha[i].x === cabeca.x && cobrinha[i].y === cabeca.y) {
            return true;
        }
    }
    return false;
}

// ------------------------ Desenho ------------------------

function desenharCenario() {
    contexto.fillStyle = "lightgreen";
    contexto.fillRect(0, 0, tela.width, tela.height);
}

function desenharCobra() {
    for (let parte of cobrinha) {
        contexto.fillStyle = "red";
        contexto.fillRect(parte.x * tamanhoBloco, parte.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
    }
}

function desenharComida() {
    contexto.fillStyle = "yellow";
    contexto.fillRect(comida.x * tamanhoBloco, comida.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
}

// ------------------------ Eventos ------------------------

document.addEventListener("keydown", mudarDirecao);
document.querySelector("button").addEventListener("click", iniciarJogo);
