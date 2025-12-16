document.addEventListener("DOMContentLoaded", () => {
  const paginas = document.querySelectorAll(".pagina");
  const btnComecar = document.getElementById("btnComecar");
  const continuarBtns = document.querySelectorAll(".continuar");

  const musicaPrincipal = document.getElementById("musicaPrincipal");
  const musicaAlternativa = document.getElementById("musicaAlternativa");
  const musicaBeleza = document.getElementById("musicaBeleza");

  const emojiGuaxinim = document.getElementById("emojiGuaxinim");
  const textoGuaxinim = document.getElementById("textoGuaxinim");

  const btnMusica = document.getElementById("btnMusica");
  const btnMusicaBeleza = document.getElementById("btnMusicaBeleza");
  const btnReiniciar = document.getElementById("btnReiniciar");

  const btnResposta = document.getElementById("btnResposta");
  const respostaTexto = document.getElementById("respostaTexto");

  let paginaAtual = 0;
  let musicaAlternativaTocando = false;
  let musicaBelezaTocando = false;

  // ===== CONTROLE DE VOZ =====
  let audioVozAtual = null;
  let tempoMusicaAntesDoAudio = 0;

  // Precarregar áudios
  [musicaPrincipal, musicaAlternativa, musicaBeleza].forEach(a => a && a.load());

  // ===== NAVEGAÇÃO ENTRE PÁGINAS =====
  const avancarPagina = () => {
    paginas[paginaAtual].classList.remove("ativa");
    paginaAtual++;
    if (paginaAtual < paginas.length) {
      paginas[paginaAtual].classList.add("ativa");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  continuarBtns.forEach(btn =>
    btn.addEventListener("click", avancarPagina)
  );

  // ===== BOTÃO COMEÇAR =====
  if (btnComecar) {
    btnComecar.addEventListener("click", async () => {
      avancarPagina();
      try {
        await musicaPrincipal.play();
      } catch {
        document.body.addEventListener(
          "click",
          () => musicaPrincipal.play().catch(() => {}),
          { once: true }
        );
      }
    });
  }

  // ===== MÚSICA PRINCIPAL / ALTERNATIVA =====
  if (btnMusica) {
    btnMusica.addEventListener("click", async () => {
      if (musicaAlternativaTocando) {
        musicaAlternativa.pause();
        musicaAlternativa.currentTime = 0;
        await musicaPrincipal.play().catch(() => {});
        musicaAlternativaTocando = false;
      } else {
        musicaPrincipal.pause();
        musicaPrincipal.currentTime = 0;
        await musicaAlternativa.play().catch(() => {});
        musicaAlternativaTocando = true;
      }
    });
  }

  // ===== MÚSICA DA BELEZA =====
  if (btnMusicaBeleza) {
    btnMusicaBeleza.addEventListener("click", async () => {
      if (musicaBelezaTocando) {
        musicaBeleza.pause();
        musicaBeleza.currentTime = 0;
        await musicaPrincipal.play().catch(() => {});
        musicaBelezaTocando = false;
      } else {
        musicaPrincipal.pause();
        musicaPrincipal.currentTime = 0;
        await musicaBeleza.play().catch(() => {});
        musicaBelezaTocando = true;
      }
    });
  }

  // ===== GUAXINIM =====
  if (emojiGuaxinim && textoGuaxinim) {
    emojiGuaxinim.addEventListener("click", () => {
      textoGuaxinim.classList.toggle("mostrar");
    });
  }

  // ===== DINÂMICA =====
  if (btnResposta && respostaTexto) {
    btnResposta.addEventListener("click", () => {
      respostaTexto.classList.toggle("show");
      respostaTexto.classList.toggle("oculto");
    });
  }

  // ===== REINICIAR =====
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      [musicaAlternativa, musicaBeleza].forEach(m => {
        if (m) {
          m.pause();
          m.currentTime = 0;
        }
      });

      musicaPrincipal.currentTime = 0;
      musicaPrincipal.play().catch(() => {});

      paginas[paginaAtual].classList.remove("ativa");
      paginaAtual = 0;
      paginas[paginaAtual].classList.add("ativa");

      window.scrollTo({ top: 0, behavior: "smooth" });

      musicaAlternativaTocando = false;
      musicaBelezaTocando = false;
    });
  }

  // ===== CONTROLE DOS ÁUDIOS DE VOZ =====
  const voiceButtons = document.querySelectorAll("button[data-voice]");

  voiceButtons.forEach(btn => {
    const voiceId = btn.dataset.voice;
    const audio = document.getElementById(voiceId);

    btn.addEventListener("click", () => {
      if (!audio) return;

      // Se clicar no mesmo áudio que já está tocando → parar e voltar música
      if (audioVozAtual === audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;

        musicaPrincipal.currentTime = tempoMusicaAntesDoAudio;
        musicaPrincipal.play().catch(() => {});

        audioVozAtual = null;
        return;
      }

      // Se outro áudio estiver tocando, parar ele
      if (audioVozAtual) {
        audioVozAtual.pause();
        audioVozAtual.currentTime = 0;
      }

      tempoMusicaAntesDoAudio = musicaPrincipal.currentTime;
      musicaPrincipal.pause();

      audio.currentTime = 0;
      audio.play();

      audioVozAtual = audio;

      audio.onended = () => {
        musicaPrincipal.currentTime = tempoMusicaAntesDoAudio;
        musicaPrincipal.play().catch(() => {});
        audioVozAtual = null;
      };
    });
  });
});
