(function () {
  "use strict";

  var CHAPTERS = [
    {
      id: "governanca",
      roman: "I",
      title: "Governança & Declarações",
      riskHeadline: "Declaração falsa ou omissão grave atinge o titular, não o fornecedor.",
      riskLegal:
        "Art. 17, § 2º e art. 24 do Provimento CNJ 213/2026: declaração inconsistente e descumprimento injustificado podem resultar em procedimento administrativo disciplinar."
    },
    {
      id: "acesso",
      roman: "II",
      title: "Acesso ao Sistema",
      riskHeadline: "Controle de acesso falho vira prova de omissão em correição.",
      riskLegal:
        "Falhas de identidade e segregação de acesso são evidências recorrentes de negligência operacional em inspeções."
    },
    {
      id: "lgpd",
      roman: "III",
      title: "Dados Pessoais (LGPD)",
      riskHeadline: "A ANPD pode aplicar sanções administrativas relevantes.",
      riskLegal:
        "Art. 52 da LGPD: multas, medidas corretivas e, em casos críticos, restrição do tratamento de dados."
    },
    {
      id: "continuidade",
      roman: "IV",
      title: "Continuidade: Backup & Incidente",
      riskHeadline: "Sem continuidade, a crise vira perda operacional e jurídica.",
      riskLegal:
        "LGPD art. 42 e regras de responsabilização civil/administrativa: ausência de evidência de preparo aumenta a exposição."
    },
    {
      id: "fornecedores",
      roman: "V",
      title: "Fornecedores & Nuvem",
      riskHeadline: "Terceiro não substitui o titular da delegação.",
      riskLegal:
        "Delegar tecnologia não transfere a responsabilidade de governança e prova documental perante a fiscalização."
    }
  ];

  // Perguntas 03, 05, 06, 09, 12 e 13 removidas.
  var QUESTIONS = [
    {
      id: 1,
      displayOrder: 1,
      chapterId: "governanca",
      text: "Existe política de segurança da informação vigente e a equipe a conhece?"
    },
    {
      id: 2,
      displayOrder: 2,
      chapterId: "governanca",
      text: "Há inventário de sistemas, fornecedores e dados essenciais do cartório?"
    },
    {
      id: 4,
      displayOrder: 3,
      chapterId: "acesso",
      text: "Cada pessoa usa usuário próprio (sem senha compartilhada)?"
    },
    {
      id: 7,
      displayOrder: 4,
      chapterId: "lgpd",
      text: "Existe mapa simples: quais dados pessoais entram, onde ficam e para que servem?"
    },
    {
      id: 8,
      displayOrder: 5,
      chapterId: "lgpd",
      text: "Há canal público de fácil acesso e prazo para atender pedidos dos titulares?"
    },
    {
      id: 10,
      displayOrder: 6,
      chapterId: "continuidade",
      text: "Backup automático com cópia fora do prédio ou do servidor principal?"
    },
    {
      id: 11,
      displayOrder: 7,
      chapterId: "continuidade",
      text: "Teste de restauração feito e registrado (data, responsável e resultado)?"
    },
    {
      id: 14,
      displayOrder: 8,
      chapterId: "fornecedores",
      text: "Contrato prevê segurança, saída dos dados e prazo de entrega se encerrar o serviço?"
    },
    {
      id: 15,
      displayOrder: 9,
      chapterId: "fornecedores",
      text: "Alguém da serventia valida, por escrito, o que o fornecedor entrega?"
    }
  ];

  var answers = {};
  var totalQuestions = QUESTIONS.length;

  var questionsRoot = document.getElementById("questions-root");
  var chapterStatusEl = document.getElementById("chapter-status");
  var reportEl = document.getElementById("final-report");
  var summaryTextEl = document.getElementById("summary-text");

  function chapterById(chapterId) {
    return CHAPTERS.find(function (c) {
      return c.id === chapterId;
    });
  }

  function questionTemplate(question) {
    var chapter = chapterById(question.chapterId);
    var chapterLabel = chapter ? "Cap. " + chapter.roman + " · " + chapter.title : "Capítulo";
    return [
      '<article class="cnj-question-card" data-question-id="' + question.id + '">',
      '  <div class="cnj-question-head">',
      '    <span class="cnj-question-number">' + String(question.displayOrder).padStart(2, "0") + "</span>",
      '    <p class="cnj-question-chapter">' + chapterLabel + "</p>",
      "  </div>",
      '  <p class="cnj-question-text">' + question.text + "</p>",
      '  <fieldset class="cnj-answer-row">',
      '    <legend class="sr-only">Resposta para a pergunta ' + question.displayOrder + "</legend>",
      '    <label data-tone="sim">',
      '      <input type="radio" name="q_' + question.id + '" value="sim">',
      "      <span>Sim</span>",
      "    </label>",
      '    <label data-tone="nao">',
      '      <input type="radio" name="q_' + question.id + '" value="nao">',
      "      <span>Não</span>",
      "    </label>",
      '    <label data-tone="nao_sei">',
      '      <input type="radio" name="q_' + question.id + '" value="nao_sei">',
      "      <span>Não sei</span>",
      "    </label>",
      "  </fieldset>",
      '  <div class="cnj-feedback" hidden></div>',
      "</article>"
    ].join("");
  }

  function renderQuestions() {
    questionsRoot.innerHTML = QUESTIONS.map(questionTemplate).join("");
  }

  function setHudText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  function getCounts() {
    var sim = 0;
    var nao = 0;
    var naoSei = 0;
    Object.keys(answers).forEach(function (k) {
      var v = answers[k];
      if (v === "sim") sim++;
      else if (v === "nao") nao++;
      else if (v === "nao_sei") naoSei++;
    });
    return {
      sim: sim,
      nao: nao,
      naoSei: naoSei,
      answered: Object.keys(answers).length
    };
  }

  function getVerdict(pct) {
    if (pct === 100) {
      return "Conformidade total: mantenha o ciclo de evidências e revisões periódicas.";
    }
    if (pct >= 80) {
      return "Base sólida: feche pendências restantes para reduzir risco em correições.";
    }
    if (pct >= 50) {
      return "Exposição moderada: priorize planos de ação por criticidade.";
    }
    return "Exposição crítica: recomenda-se atuação imediata em governança e continuidade.";
  }

  function updateChapterStatus() {
    var html = CHAPTERS.map(function (chapter) {
      var chapterQs = QUESTIONS.filter(function (q) {
        return q.chapterId === chapter.id;
      });
      var sim = chapterQs.filter(function (q) {
        return answers[q.id] === "sim";
      }).length;
      var answered = chapterQs.filter(function (q) {
        return answers[q.id];
      }).length;
      var pct = chapterQs.length ? Math.round((sim / chapterQs.length) * 100) : 0;
      return (
        "<li><strong>Cap. " +
        chapter.roman +
        "</strong> " +
        chapter.title +
        "<br>" +
        sim +
        "/" +
        chapterQs.length +
        " conformes · " +
        answered +
        "/" +
        chapterQs.length +
        " respondidas · " +
        pct +
        "%</li>"
      );
    }).join("");

    chapterStatusEl.innerHTML = html;
  }

  function updateReport(counts, pct) {
    var done = counts.answered === totalQuestions;
    reportEl.hidden = !done;
    if (!done) return;

    setHudText("report-pct", pct + "%");
    setHudText("report-sim", String(counts.sim));
    setHudText("report-nao", String(counts.nao));
    setHudText("report-nao-sei", String(counts.naoSei));
    document.getElementById("report-verdict").textContent = getVerdict(pct);
  }

  function updateSummary(counts, pct) {
    if (!counts.answered) {
      summaryTextEl.textContent = "Responda ao menos uma pergunta para começar o diagnóstico.";
      return;
    }
    summaryTextEl.textContent =
      "Você respondeu " +
      counts.answered +
      " de " +
      totalQuestions +
      " controles. Conformidade atual: " +
      pct +
      "%. Pendências: " +
      counts.nao +
      ".";
  }

  function applyFeedback(questionId, value) {
    var card = questionsRoot.querySelector('[data-question-id="' + questionId + '"]');
    if (!card) return;

    var feedbackEl = card.querySelector(".cnj-feedback");
    if (!feedbackEl) return;

    if (value === "sim") {
      feedbackEl.hidden = true;
      feedbackEl.textContent = "";
      feedbackEl.className = "cnj-feedback";
      return;
    }

    var question = QUESTIONS.find(function (q) {
      return q.id === questionId;
    });
    if (!question) return;

    var chapter = chapterById(question.chapterId);
    if (!chapter) return;

    feedbackEl.hidden = false;
    feedbackEl.className =
      "cnj-feedback " + (value === "nao" ? "cnj-feedback-danger" : "cnj-feedback-warn");
    feedbackEl.textContent = chapter.riskHeadline + " " + chapter.riskLegal;
  }

  function updateUi() {
    var counts = getCounts();
    var pct = Math.round((counts.sim / totalQuestions) * 100);
    setHudText("hud-sim", counts.sim + "/" + totalQuestions);
    setHudText("hud-nao", String(counts.nao));
    setHudText("hud-nao-sei", String(counts.naoSei));
    setHudText("hud-pct", pct + "%");
    updateChapterStatus();
    updateSummary(counts, pct);
    updateReport(counts, pct);
  }

  function onChange(event) {
    var target = event.target;
    if (!target || target.type !== "radio") return;

    var id = Number(target.name.replace("q_", ""));
    if (!id) return;

    answers[id] = target.value;
    applyFeedback(id, target.value);
    updateUi();
  }

  function restart() {
    answers = {};
    var radios = questionsRoot.querySelectorAll('input[type="radio"]');
    radios.forEach(function (radio) {
      radio.checked = false;
    });
    var feedbacks = questionsRoot.querySelectorAll(".cnj-feedback");
    feedbacks.forEach(function (feedback) {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.className = "cnj-feedback";
    });
    updateUi();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setup() {
    renderQuestions();
    questionsRoot.addEventListener("change", onChange);
    document.getElementById("restart-btn").addEventListener("click", restart);
    updateUi();
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
