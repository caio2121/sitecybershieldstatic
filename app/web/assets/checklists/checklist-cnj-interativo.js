(function () {
  "use strict";

  var LEAD_STORAGE_KEY = "cs_lead_static_v2";
  var SUBMISSION_KEY_STORAGE_KEY = "cs_checklist_submission_key_v2";
  var SUBMISSION_STARTED_AT_KEY = "cs_checklist_submission_started_at_v2";
  var PROGRESS_SYNC_DEBOUNCE_MS = 1200;
  var CHECKLIST_CONFIG = {
    captureEndpoint:
      window.CHECKLIST_CONFIG && typeof window.CHECKLIST_CONFIG.captureEndpoint === "string"
        ? window.CHECKLIST_CONFIG.captureEndpoint
        : "",
    requestTimeoutMs:
      window.CHECKLIST_CONFIG && Number(window.CHECKLIST_CONFIG.requestTimeoutMs) > 0
        ? Number(window.CHECKLIST_CONFIG.requestTimeoutMs)
        : 12000
  };

  var CHAPTERS = [
    {
      id: "governanca",
      title: "Governança & Declarações",
      subtitle: "A espinha dorsal do dossiê",
      roman: "I",
      icon: "GV",
      risk: {
        headline: "Declaração falsa ou omissão grave atinge o titular, não o fornecedor.",
        legal:
          "Art. 17, § 2º e Art. 24 do Provimento CNJ 213/2026: inconsistências e omissões relevantes podem levar a procedimento administrativo disciplinar.",
        consequence:
          "Sem evidência documental, a serventia fica frágil em inspeção e pode sofrer consequências disciplinares."
      }
    },
    {
      id: "acesso",
      title: "Acesso ao Sistema",
      subtitle: "Quem entra, quando entra, com que permissão",
      roman: "II",
      icon: "AC",
      risk: {
        headline: "Controle de acesso falho vira prova de omissão em correição.",
        legal:
          "Sem segregação e rastreabilidade de contas, a serventia amplia exposição em incidente e inspeção.",
        consequence:
          "Credenciais mal geridas aumentam risco de uso indevido e dificultam responsabilização."
      }
    },
    {
      id: "lgpd",
      title: "Dados Pessoais (LGPD)",
      subtitle: "O que entra, onde fica, como sai",
      roman: "III",
      icon: "LG",
      risk: {
        headline: "A ANPD pode aplicar sanções após processo administrativo.",
        legal:
          "Art. 52 da LGPD: multas, medidas corretivas e eventual restrição parcial de tratamento.",
        consequence:
          "Falhas recorrentes em direitos dos titulares e proteção de dados podem gerar sanções relevantes."
      }
    },
    {
      id: "continuidade",
      title: "Continuidade: Backup & Incidente",
      subtitle: "Quando o mundo desaba, o acervo permanece",
      roman: "IV",
      icon: "BC",
      risk: {
        headline: "Sem continuidade documentada, o incidente vira improviso.",
        legal:
          "LGPD art. 42 e responsabilização civil/administrativa: a prova operacional é decisiva para reduzir exposição.",
        consequence:
          "Crises sem plano e sem teste de restauração elevam impacto operacional e jurídico."
      }
    },
    {
      id: "fornecedores",
      title: "Fornecedores & Nuvem",
      subtitle: "Delegar o sistema, nunca a responsabilidade",
      roman: "V",
      icon: "FN",
      risk: {
        headline: "Terceiro não substitui o titular da delegação.",
        legal:
          "A responsabilidade de governança e validação permanece da serventia, mesmo com operação terceirizada.",
        consequence:
          "Sem validação interna por escrito, o dossiê perde força e a dependência do fornecedor aumenta."
      }
    }
  ];

  // 9 perguntas ativas, mantendo remoções solicitadas: 03, 05, 06, 09, 12, 13
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
      text: "Teste de restauração feito e registrado (data, quem executou e resultado)?"
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

  var RANKS = [
    { minXp: 0, title: "Escrevente" },
    { minXp: 200, title: "Escrevente Autorizado" },
    { minXp: 450, title: "Oficial Substituto" },
    { minXp: 700, title: "Tabelião" },
    { minXp: 900, title: "Guardião do Dossiê" }
  ];

  var ACHIEVEMENTS = [
    {
      id: "primeiro-selo",
      title: "Primeiro Selo",
      description: "Aplicou o primeiro carimbo de conformidade.",
      unlock: function (ctx) { return ctx.sim > 0; }
    },
    {
      id: "combo-3",
      title: "Lacre Perfeito",
      description: "Três respostas Sim consecutivas.",
      unlock: function (ctx) { return ctx.streak >= 3; }
    },
    {
      id: "cap-lgpd",
      title: "Defensor dos Dados",
      description: "Capítulo LGPD completo em Sim.",
      unlock: function (ctx) { return ctx.chapterCompleted.lgpd === true; }
    },
    {
      id: "honestidade",
      title: "Honestidade Cartorial",
      description: "Registrou pelo menos um Não sei.",
      unlock: function (ctx) { return ctx.naoSei > 0; }
    },
    {
      id: "encarar-risco",
      title: "Encarou o Risco",
      description: "Assumiu pelo menos um Não.",
      unlock: function (ctx) { return ctx.nao > 0; }
    },
    {
      id: "guardiao",
      title: "Guardião do Cartório",
      description: "Conformidade total (9 Sim).",
      unlock: function (ctx) { return ctx.sim === QUESTIONS.length; }
    },
    {
      id: "dossie-completo",
      title: "Dossiê Completo",
      description: "Todas as perguntas foram respondidas.",
      unlock: function (ctx) { return (ctx.sim + ctx.nao + ctx.naoSei) === QUESTIONS.length; }
    },
    {
      id: "cap-governanca",
      title: "Mestre da Governança",
      description: "Capítulo I concluído com todos os controles em Sim.",
      unlock: function (ctx) { return ctx.chapterCompleted.governanca === true; }
    }
  ];

  var state = {
    lead: loadLead(),
    answers: {},
    streak: 0,
    unlocked: {},
    submission: {
      sending: false,
      syncStatus: "idle",
      error: "",
      key: loadSubmissionKey(),
      startedAt: loadSubmissionStartedAt(),
      lastSyncedStatus: "",
      pendingPayload: null,
      progressTimer: null
    }
  };

  var dom = {
    heroStartBtn: document.getElementById("hero-start-btn"),
    mainContent: document.getElementById("quiz-start"),
    quizArea: document.getElementById("quiz-area"),
    greetingKicker: document.getElementById("greeting-kicker"),
    questionsRoot: document.getElementById("questions-root"),
    chapterRings: document.getElementById("chapter-rings"),
    finalReport: document.getElementById("final-report"),
    syncStatus: document.getElementById("sync-status"),
    gate: document.getElementById("lead-gate"),
    leadForm: document.getElementById("lead-form"),
    leadName: document.getElementById("lead-name"),
    leadEmail: document.getElementById("lead-email"),
    leadWhatsapp: document.getElementById("lead-whatsapp"),
    leadConsent: document.getElementById("lead-consent"),
    leadError: document.getElementById("lead-error"),
    toast: document.getElementById("achievement-toast")
  };

  function loadLead() {
    try {
      var raw = sessionStorage.getItem(LEAD_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveLead(lead) {
    try {
      sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(lead));
    } catch (error) {
      // sem persistencia se falhar
    }
  }

  function loadSubmissionKey() {
    try {
      return sessionStorage.getItem(SUBMISSION_KEY_STORAGE_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function saveSubmissionKey(key) {
    try {
      sessionStorage.setItem(SUBMISSION_KEY_STORAGE_KEY, String(key || ""));
    } catch (error) {
      // sem persistencia se falhar
    }
  }

  function clearSubmissionKey() {
    try {
      sessionStorage.removeItem(SUBMISSION_KEY_STORAGE_KEY);
    } catch (error) {
      // sem persistencia se falhar
    }
  }

  function loadSubmissionStartedAt() {
    try {
      return sessionStorage.getItem(SUBMISSION_STARTED_AT_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function saveSubmissionStartedAt(startedAt) {
    try {
      sessionStorage.setItem(SUBMISSION_STARTED_AT_KEY, String(startedAt || ""));
    } catch (error) {
      // sem persistencia se falhar
    }
  }

  function clearSubmissionStartedAt() {
    try {
      sessionStorage.removeItem(SUBMISSION_STARTED_AT_KEY);
    } catch (error) {
      // sem persistencia se falhar
    }
  }

  function openGate() {
    dom.gate.hidden = false;
  }

  function closeGate() {
    dom.gate.hidden = true;
  }

  function requestStart() {
    if (!state.lead) {
      openGate();
      return;
    }
    unlockQuiz();
    scrollToQuiz();
  }

  function scrollToQuiz() {
    var top = document.getElementById("quiz-start");
    if (top) {
      top.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function maskPhoneBR(value) {
    var digits = String(value || "").replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return "(" + digits.slice(0, 2) + ") " + digits.slice(2);
    if (digits.length <= 10) return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 6) + "-" + digits.slice(6);
    return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
  }

  function handleLeadSubmit(event) {
    event.preventDefault();
    dom.leadError.hidden = true;
    dom.leadError.textContent = "";

    var lead = {
      name: String(dom.leadName.value || "").trim(),
      email: String(dom.leadEmail.value || "").trim().toLowerCase(),
      whatsapp: String(dom.leadWhatsapp.value || "").replace(/\D/g, ""),
      consentGivenAt: new Date().toISOString()
    };

    if (lead.name.length < 2) {
      return showLeadError("Informe um nome válido.");
    }
    if (!/.+@.+\..+/.test(lead.email)) {
      return showLeadError("Informe um e-mail válido.");
    }
    if (lead.whatsapp.length < 10) {
      return showLeadError("Informe um WhatsApp válido.");
    }
    if (!dom.leadConsent.checked) {
      return showLeadError("Confirme o consentimento LGPD para continuar.");
    }

    var startedAt = state.submission.startedAt || new Date().toISOString();
    var submissionKey = state.submission.key || generateSubmissionKey(lead, startedAt);
    state.submission.startedAt = startedAt;
    state.submission.key = submissionKey;
    saveSubmissionStartedAt(startedAt);
    saveSubmissionKey(submissionKey);

    state.lead = lead;
    saveLead(lead);
    closeGate();
    unlockQuiz();
    scrollToQuiz();
    submitChecklistData(buildSubmissionPayload("started"));
  }

  function showLeadError(message) {
    dom.leadError.textContent = message;
    dom.leadError.hidden = false;
  }

  function unlockQuiz() {
    dom.mainContent.classList.remove("is-locked");
    dom.quizArea.hidden = false;
    var firstName = state.lead && state.lead.name ? state.lead.name.split(" ")[0] : "titular";
    dom.greetingKicker.textContent = "Olá, " + firstName;
  }

  function getCounts() {
    var sim = 0;
    var nao = 0;
    var naoSei = 0;
    var answered = 0;

    Object.keys(state.answers).forEach(function (id) {
      var value = state.answers[id];
      if (!value) return;
      answered++;
      if (value === "sim") sim++;
      if (value === "nao") nao++;
      if (value === "nao_sei") naoSei++;
    });

    return { sim: sim, nao: nao, naoSei: naoSei, answered: answered };
  }

  function getRank(xp) {
    var current = RANKS[0];
    RANKS.forEach(function (rank) {
      if (xp >= rank.minXp) current = rank;
    });
    return current;
  }

  function getNextRank(xp) {
    for (var i = 0; i < RANKS.length; i++) {
      if (xp < RANKS[i].minXp) return RANKS[i];
    }
    return null;
  }

  function computeChapterCompleted() {
    var map = {};
    CHAPTERS.forEach(function (chapter) {
      var chapterQuestions = QUESTIONS.filter(function (q) {
        return q.chapterId === chapter.id;
      });
      map[chapter.id] = chapterQuestions.every(function (question) {
        return state.answers[question.id] === "sim";
      });
    });
    return map;
  }

  function computeXp() {
    return Object.keys(state.answers).reduce(function (acc, id) {
      var value = state.answers[id];
      if (value === "sim") return acc + 100;
      if (value === "nao_sei") return acc + 20;
      return acc;
    }, 0);
  }

  function pushAchievementToasts(newlyUnlocked) {
    if (!newlyUnlocked.length) return;
    var achievement = newlyUnlocked[0];
    dom.toast.innerHTML = "<strong>Medalha liberada: " + achievement.title + "</strong><span>" + achievement.description + "</span>";
    dom.toast.hidden = false;
    clearTimeout(dom.toast._timer);
    dom.toast._timer = setTimeout(function () {
      dom.toast.hidden = true;
    }, 2800);
  }

  function updateAchievements(stats) {
    var chapterCompleted = computeChapterCompleted();
    var context = {
      sim: stats.sim,
      nao: stats.nao,
      naoSei: stats.naoSei,
      streak: state.streak,
      chapterCompleted: chapterCompleted
    };
    var newly = [];
    ACHIEVEMENTS.forEach(function (achievement) {
      if (!state.unlocked[achievement.id] && achievement.unlock(context)) {
        state.unlocked[achievement.id] = true;
        newly.push(achievement);
      }
    });
    pushAchievementToasts(newly);
  }

  function answerButtonClass(questionId, answerKey, currentAnswer) {
    var classes = ["answer-btn"];
    if (currentAnswer === answerKey) {
      classes.push("is-selected");
    }
    return classes.join(" ");
  }

  function answerButtonLabel(answerKey) {
    if (answerKey === "sim") return "<span class=\"answer-btn__icon\">+</span><span>Sim</span>";
    if (answerKey === "nao") return "<span class=\"answer-btn__icon\">-</span><span>Não</span>";
    return "<span class=\"answer-btn__icon\">?</span><span>Não sei</span>";
  }

  function scorePanelTemplate(answer) {
    if (!answer) return "";
    if (answer === "sim") {
      return [
        '<div class="score-panel score-panel--sim">',
        '<span class="score-panel__icon">OK</span>',
        "<div>",
        "<strong>Controle em conformidade.</strong>",
        "<p>+100 XP · evidência registrada para o dossiê técnico.</p>",
        "</div>",
        "</div>"
      ].join("");
    }
    if (answer === "nao_sei") {
      return [
        '<div class="score-panel score-panel--warn">',
        '<span class="score-panel__icon">?</span>',
        "<div>",
        "<strong>Ponto cego em apuração.</strong>",
        "<p>+20 XP · priorize validação técnica antes da próxima correição.</p>",
        "</div>",
        "</div>"
      ].join("");
    }
    return "";
  }

  function feedbackTemplate(question, answer) {
    if (!answer || answer === "sim") return "";
    var chapter = CHAPTERS.find(function (c) { return c.id === question.chapterId; });
    if (!chapter) return "";
    var klass = answer === "nao" ? "feedback feedback--nao" : "feedback feedback--nao-sei";
    var tone = answer === "nao" ? "Risco jurídico identificado" : "Ponto cego: apurar";
    return [
      '<div class="' + klass + '">',
      '<div class="feedback-head">',
      "<span>" + tone + "</span>",
      "<small>Cap. " + chapter.roman + "</small>",
      "</div>",
      "<strong>" + chapter.risk.headline + "</strong>",
      "<p>" + chapter.risk.legal + "</p>",
      "<em>" + chapter.risk.consequence + "</em>",
      "</div>"
    ].join("");
  }

  function questionTemplate(question) {
    var chapter = CHAPTERS.find(function (c) { return c.id === question.chapterId; });
    var answer = state.answers[question.id] || null;
    var cardClass = "question-card";
    if (answer === "sim") cardClass += " question-card--sim";
    if (answer === "nao") cardClass += " question-card--nao";
    if (answer === "nao_sei") cardClass += " question-card--nao-sei";

    return [
      '<article class="' + cardClass + '" id="q-' + question.id + '">',
      '<div class="question-head">',
      '<div class="question-badge">' + String(question.id).padStart(2, "0") + "</div>",
      "<div>",
      '<p class="question-meta">Cap. ' + chapter.roman + " · " + chapter.title + "</p>",
      '<h4 class="question-title">' + question.text + "</h4>",
      "</div>",
      "</div>",
      '<div class="answer-row">',
      '<button class="' + answerButtonClass(question.id, "sim", answer) + '" type="button" data-question-id="' + question.id + '" data-answer="sim">' + answerButtonLabel("sim") + "</button>",
      '<button class="' + answerButtonClass(question.id, "nao", answer) + '" type="button" data-question-id="' + question.id + '" data-answer="nao">' + answerButtonLabel("nao") + "</button>",
      '<button class="' + answerButtonClass(question.id, "nao_sei", answer) + '" type="button" data-question-id="' + question.id + '" data-answer="nao_sei">' + answerButtonLabel("nao_sei") + "</button>",
      "</div>",
      scorePanelTemplate(answer),
      feedbackTemplate(question, answer),
      "</article>"
    ].join("");
  }

  function renderQuestions() {
    var chunks = CHAPTERS.map(function (chapter) {
      var chapterQuestions = QUESTIONS.filter(function (question) {
        return question.chapterId === chapter.id;
      });

      var questionsHtml = chapterQuestions.map(questionTemplate).join("");
      return [
        '<section class="chapter-block">',
        '<div class="chapter-banner">',
        '<span class="chapter-banner__roman">' + chapter.roman + "</span>",
        "<div>",
        "<h3>" + chapter.title + "</h3>",
        "<p>" + chapter.subtitle + "</p>",
        "</div>",
        "</div>",
        questionsHtml,
        "</section>"
      ].join("");
    });
    dom.questionsRoot.innerHTML = chunks.join("");
  }

  function renderChapterRings() {
    var content = CHAPTERS.map(function (chapter) {
      var chapterQuestions = QUESTIONS.filter(function (q) {
        return q.chapterId === chapter.id;
      });
      var sim = chapterQuestions.filter(function (q) { return state.answers[q.id] === "sim"; }).length;
      var answered = chapterQuestions.filter(function (q) { return !!state.answers[q.id]; }).length;
      var nao = chapterQuestions.filter(function (q) { return state.answers[q.id] === "nao"; }).length;
      var naoSei = chapterQuestions.filter(function (q) { return state.answers[q.id] === "nao_sei"; }).length;
      var pct = chapterQuestions.length ? Math.round((sim / chapterQuestions.length) * 100) : 0;
      var answeredPct = chapterQuestions.length ? Math.round((answered / chapterQuestions.length) * 100) : 0;
      var circumference = 2 * Math.PI * 16;
      var answeredOffset = circumference * (1 - answeredPct / 100);
      var simOffset = circumference * (1 - pct / 100);
      var allOk = sim === chapterQuestions.length;

      return [
        '<button type="button" class="chapter-row" data-jump-chapter="' + chapter.id + '">',
        '<div class="chapter-row__ring">',
        '<svg viewBox="0 0 40 40" aria-hidden="true">',
        '<circle cx="20" cy="20" r="16" class="ring-base"></circle>',
        '<circle cx="20" cy="20" r="16" class="ring-answered" style="stroke-dasharray:' + circumference + ";stroke-dashoffset:" + answeredOffset + ';"></circle>',
        '<circle cx="20" cy="20" r="16" class="ring-sim" style="stroke-dasharray:' + circumference + ";stroke-dashoffset:" + simOffset + ';"></circle>',
        "</svg>",
        '<span class="chapter-row__icon">' + chapter.icon + "</span>",
        "</div>",
        '<div class="chapter-row__meta">',
        "<strong>Cap. " + chapter.roman + (allOk ? ' <em>OK</em>' : "") + "</strong>",
        "<span>" + chapter.title + "</span>",
        "<small>" + sim + "/" + chapterQuestions.length + " conformes · " + answered + "/" + chapterQuestions.length + " respondidas</small>",
        '<small class="chapter-row__legend-inline">' + nao + " risco · " + naoSei + " apurar · " + pct + "%</small>",
        "</div>",
        "</button>"
      ].join("");
    }).join("") + [
      '<div class="chapter-legend">',
      "<span><i class=\"legend-dot legend-dot--ok\"></i>OK</span>",
      "<span><i class=\"legend-dot legend-dot--risk\"></i>Risco</span>",
      "<span><i class=\"legend-dot legend-dot--apurar\"></i>Apurar</span>",
      "</div>"
    ].join("");
    dom.chapterRings.innerHTML = content;
  }

  function reportVerdict(pct) {
    if (pct === 100) {
      return {
        title: "Conformidade total",
        message: "A serventia está apta para fiscalização. Mantenha o ciclo de evidências vivo.",
        colorClass: "report-color--ok"
      };
    }
    if (pct >= 80) {
      return {
        title: "Quase blindado",
        message: "Base sólida. Feche pendências para elevar resiliência jurídica e operacional.",
        colorClass: "report-color--ok"
      };
    }
    if (pct >= 50) {
      return {
        title: "Exposição moderada",
        message: "Há lacunas relevantes. Priorize ações por criticidade antes da próxima correição.",
        colorClass: "report-color--warn"
      };
    }
    return {
      title: "Exposição crítica",
      message: "Mais pendências que evidências. Recomenda-se plano imediato com acompanhamento técnico.",
      colorClass: "report-color--danger"
    };
  }

  function renderReportChapterBreakdown() {
    return CHAPTERS.map(function (chapter) {
      var chapterQuestions = QUESTIONS.filter(function (q) { return q.chapterId === chapter.id; });
      var sim = chapterQuestions.filter(function (q) { return state.answers[q.id] === "sim"; }).length;
      var pct = chapterQuestions.length ? Math.round((sim / chapterQuestions.length) * 100) : 0;
      var okClass = sim === chapterQuestions.length ? "chapter-breakdown__item--ok" : "";
      return [
        '<article class="chapter-breakdown__item ' + okClass + '">',
        "<strong>Cap. " + chapter.roman + "</strong>",
        "<span>" + chapter.title + "</span>",
        "<small>" + sim + "/" + chapterQuestions.length + " · " + pct + "%</small>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderReportAchievements() {
    return ACHIEVEMENTS.map(function (achievement) {
      var unlocked = !!state.unlocked[achievement.id];
      var klass = unlocked ? "report-achievement report-achievement--on" : "report-achievement";
      return [
        '<article class="' + klass + '">',
        "<strong>" + achievement.title + "</strong>",
        "<span>" + achievement.description + "</span>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderFinalReport(stats, xp) {
    var allAnswered = stats.answered === QUESTIONS.length;
    dom.finalReport.hidden = !allAnswered;
    if (!allAnswered) {
      dom.finalReport.innerHTML = "";
      return;
    }

    var conformity = Math.round((stats.sim / QUESTIONS.length) * 100);
    var rank = getRank(xp);
    var verdict = reportVerdict(conformity);
    var circumference = 2 * Math.PI * 50;
    var dialOffset = circumference * (1 - conformity / 100);
    dom.finalReport.innerHTML = [
      '<p class="card-kicker">Relatório Executivo</p>',
      '<h3 class="' + verdict.colorClass + '">' + verdict.title + "</h3>",
      "<p>" + verdict.message + "</p>",
      '<div class="report-top">',
      '<div class="report-top__dial">',
      '<svg viewBox="0 0 140 140" aria-hidden="true">',
      '<circle cx="70" cy="70" r="50" class="report-dial__base"></circle>',
      '<circle cx="70" cy="70" r="50" class="report-dial__value ' + verdict.colorClass + '" style="stroke-dasharray:' + circumference + ";stroke-dashoffset:" + dialOffset + ';"></circle>',
      "</svg>",
      '<div class="report-dial__text"><span>Conformidade</span><strong>' + conformity + "%</strong></div>",
      "</div>",
      '<div class="report-tags">',
      '<span class="tag tag--ok">' + stats.sim + " OK</span>",
      '<span class="tag tag--risk">' + stats.nao + " Pendente</span>",
      '<span class="tag tag--apurar">' + stats.naoSei + " Apurar</span>",
      "</div>",
      "</div>",
      '<div class="report-grid">',
      "<article><span>Conformidade</span><strong>" + conformity + "%</strong></article>",
      "<article><span>XP final</span><strong>" + xp + "</strong></article>",
      "<article><span>Nível</span><strong>" + rank.title + "</strong></article>",
      "<article><span>Medalhas</span><strong>" + Object.keys(state.unlocked).length + "/" + ACHIEVEMENTS.length + "</strong></article>",
      "</div>",
      '<div class="report-divider"></div>',
      '<section class="chapter-breakdown"><h4>Status por capítulo</h4><div class="chapter-breakdown__grid">' + renderReportChapterBreakdown() + "</div></section>",
      '<div class="report-divider"></div>',
      '<section class="report-achievements"><h4>Medalhas</h4><div class="report-achievements__grid">' + renderReportAchievements() + "</div></section>",
      '<div class="report-actions">',
      '<a class="btn btn-primary" href="https://wa.me/5521920137715?text=Ol%C3%A1!%20Conclu%C3%AD%20o%20checklist%20CNJ%20e%20quero%20apoio%20no%20dossi%C3%AA%20t%C3%A9cnico." target="_blank" rel="noopener noreferrer">Falar com especialista</a>',
      '<button id="restart-btn" class="btn btn-outline" type="button">Refazer diagnóstico</button>',
      "</div>",
      '<div id="submission-status" class="submission-status" aria-live="polite"></div>'
    ].join("");

    var restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", restartQuiz);
    }

    renderSyncStatus();
    maybeSubmitCompletedQuiz(stats, xp, conformity);
  }

  function getStageLabel(stage) {
    if (stage === "started") return "lead registrado";
    if (stage === "in_progress") return "progresso salvo";
    if (stage === "completed") return "resultado final salvo";
    return "sincronização pendente";
  }

  function renderSyncStatus() {
    var statusMessage = "";
    var syncClass = "sync-status";
    var detailsMessage = "";
    var detailsClass = "submission-status__item submission-status__item--pending";

    if (!CHECKLIST_CONFIG.captureEndpoint) {
      statusMessage = "Captura não configurada no endpoint.";
      syncClass += " sync-status--warn";
      detailsMessage = "Captura não configurada: defina window.CHECKLIST_CONFIG.captureEndpoint.";
      detailsClass = "submission-status__item submission-status__item--warn";
    } else if (state.submission.sending) {
      statusMessage = "Sincronizando dados do diagnóstico...";
      detailsMessage = "Enviando atualização para a base segura.";
    } else if (state.submission.error) {
      statusMessage = "Falha de sincronização. Vamos tentar novamente.";
      syncClass += " sync-status--error";
      detailsMessage = state.submission.error;
      detailsClass = "submission-status__item submission-status__item--error";
    } else if (state.submission.lastSyncedStatus) {
      statusMessage = "Sincronização ativa: " + getStageLabel(state.submission.lastSyncedStatus) + ".";
      syncClass += " sync-status--ok";
      if (state.submission.lastSyncedStatus === "completed") {
        detailsMessage =
          "Diagnóstico registrado com sucesso. Um especialista pode entrar em contato com base no seu consentimento.";
        detailsClass = "submission-status__item submission-status__item--ok";
      } else if (state.submission.lastSyncedStatus === "in_progress") {
        detailsMessage = "Progresso salvo. Continue para gerar o relatório final.";
        detailsClass = "submission-status__item submission-status__item--ok";
      } else {
        detailsMessage = "Contato registrado. Agora você pode responder o checklist.";
        detailsClass = "submission-status__item submission-status__item--ok";
      }
    } else {
      statusMessage = "Preencha seu contato para iniciar o registro.";
      detailsMessage = "Conclua todas as perguntas para registrar o relatório final.";
    }

    if (dom.syncStatus) {
      dom.syncStatus.className = syncClass;
      dom.syncStatus.textContent = statusMessage;
    }

    var detailsEl = document.getElementById("submission-status");
    if (!detailsEl) return;

    if (state.submission.error) {
      detailsEl.innerHTML =
        '<p class="' + detailsClass + '">' +
        detailsMessage +
        '</p><button id="retry-submit-btn" type="button" class="btn btn-outline submission-status__retry">Tentar envio novamente</button>';
      var retryBtn = document.getElementById("retry-submit-btn");
      if (retryBtn) retryBtn.addEventListener("click", retrySubmissionFromCurrentState);
      return;
    }

    detailsEl.innerHTML = '<p class="' + detailsClass + '">' + detailsMessage + "</p>";
  }

  function normalizeAnswerMap() {
    return QUESTIONS.reduce(function (acc, question) {
      acc[String(question.id)] = state.answers[question.id] || null;
      return acc;
    }, {});
  }

  function simpleHash(input) {
    var hash = 0;
    var str = String(input || "");
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return "k" + Math.abs(hash);
  }

  function generateSubmissionKey(lead, startedAt) {
    return simpleHash(
      JSON.stringify({
        email: lead.email,
        whatsapp: lead.whatsapp,
        startedAt: startedAt,
        salt: Math.random().toString(36).slice(2)
      })
    );
  }

  function buildSubmissionPayload(stage) {
    if (!state.lead) return null;
    var stats = getCounts();
    var xp = computeXp();
    var conformity = stats.answered ? Math.round((stats.sim / QUESTIONS.length) * 100) : 0;
    var normalizedStage = stage || "started";
    var startedAt = state.submission.startedAt || new Date().toISOString();
    if (!state.submission.startedAt) {
      state.submission.startedAt = startedAt;
      saveSubmissionStartedAt(startedAt);
    }

    var submissionKey = state.submission.key;
    if (!submissionKey) {
      submissionKey = generateSubmissionKey(state.lead, startedAt);
      state.submission.key = submissionKey;
      saveSubmissionKey(submissionKey);
    }

    var answers = normalizeAnswerMap();

    return {
      submissionKey: submissionKey,
      status: normalizedStage,
      lead: {
        name: state.lead.name,
        email: state.lead.email,
        whatsapp: state.lead.whatsapp,
        consentGivenAt: state.lead.consentGivenAt || new Date().toISOString()
      },
      answers: normalizedStage === "started" ? {} : answers,
      stats: {
        sim: stats.sim,
        nao: stats.nao,
        naoSei: stats.naoSei,
        answered: stats.answered
      },
      xp: xp,
      conformity: conformity,
      metadata: {
        timestamp: new Date().toISOString(),
        startedAt: startedAt,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent
      }
    };
  }

  async function postWithTimeout(url, payload) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timeoutId = null;
    if (controller) {
      timeoutId = setTimeout(function () {
        controller.abort();
      }, CHECKLIST_CONFIG.requestTimeoutMs);
    }

    try {
      return await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async function submitChecklistData(payload) {
    if (!payload || !CHECKLIST_CONFIG.captureEndpoint) return;
    if (state.submission.sending) {
      state.submission.pendingPayload = payload;
      return;
    }
    if (state.submission.lastSyncedStatus === "completed" && payload.status === "completed") {
      return;
    }

    state.submission.sending = true;
    state.submission.syncStatus = "syncing";
    state.submission.error = "";
    renderSyncStatus();

    try {
      var response = await postWithTimeout(CHECKLIST_CONFIG.captureEndpoint, payload);
      var data = await response.json().catch(function () {
        return {};
      });
      if (!response.ok && data.ok !== true) {
        throw new Error(data.message || "Falha ao registrar o diagnóstico.");
      }

      state.submission.sending = false;
      state.submission.syncStatus = "synced";
      state.submission.error = "";
      state.submission.key = payload.submissionKey;
      state.submission.lastSyncedStatus = payload.status || state.submission.lastSyncedStatus;
      saveSubmissionKey(payload.submissionKey);
      renderSyncStatus();
    } catch (error) {
      state.submission.sending = false;
      state.submission.syncStatus = "error";
      state.submission.error =
        "Não foi possível registrar seu diagnóstico agora. Verifique sua conexão e tente novamente.";
      renderSyncStatus();
    }

    if (state.submission.pendingPayload) {
      var queuedPayload = state.submission.pendingPayload;
      state.submission.pendingPayload = null;
      if (
        queuedPayload.status !== state.submission.lastSyncedStatus ||
        queuedPayload.status === "in_progress"
      ) {
        submitChecklistData(queuedPayload);
      }
    }
  }

  function maybeSubmitCompletedQuiz(stats, xp, conformity) {
    if (stats.answered !== QUESTIONS.length) return;
    var payload = buildSubmissionPayload("completed");
    if (!payload) return;
    submitChecklistData(payload);
  }

  function retrySubmissionFromCurrentState() {
    var stats = getCounts();
    var stage = "started";
    if (stats.answered === QUESTIONS.length) stage = "completed";
    else if (stats.answered > 0) stage = "in_progress";
    var payload = buildSubmissionPayload(stage);
    if (!payload) return;
    submitChecklistData(payload);
  }

  function queueProgressSync() {
    if (!state.lead) return;
    var stats = getCounts();
    if (stats.answered === 0 || stats.answered === QUESTIONS.length) return;
    clearTimeout(state.submission.progressTimer);
    state.submission.progressTimer = setTimeout(function () {
      submitChecklistData(buildSubmissionPayload("in_progress"));
    }, PROGRESS_SYNC_DEBOUNCE_MS);
  }

  function updateHud(stats, xp) {
    var maxXp = QUESTIONS.length * 100;
    var rank = getRank(xp);
    var nextRank = getNextRank(xp);
    var progressPct = Math.min(100, Math.round((xp / maxXp) * 100));

    document.getElementById("hud-rank-title").textContent = rank.title;
    document.getElementById("hud-xp-current").textContent = String(xp);
    document.getElementById("hud-xp-max").textContent = String(maxXp);
    document.getElementById("hud-xp-progress").style.width = progressPct + "%";
    document.getElementById("hud-sim-chip").textContent = stats.sim + "/" + QUESTIONS.length;
    document.getElementById("hud-streak-chip").textContent = String(state.streak);
    document.getElementById("hud-achievements-chip").textContent =
      Object.keys(state.unlocked).length + "/" + ACHIEVEMENTS.length;

    if (nextRank) {
      document.getElementById("hud-next-rank").textContent =
        "faltam " + (nextRank.minXp - xp) + " XP para " + nextRank.title;
    } else {
      document.getElementById("hud-next-rank").textContent =
        "nível máximo alcançado";
    }
  }

  function refreshUi() {
    var stats = getCounts();
    var xp = computeXp();
    updateAchievements(stats);
    updateHud(stats, xp);
    renderQuestions();
    renderChapterRings();
    renderFinalReport(stats, xp);
    renderSyncStatus();
  }

  function setAnswer(questionId, answer) {
    var previous = state.answers[questionId];
    state.answers[questionId] = answer;
    if (answer === "sim") {
      if (previous !== "sim") {
        state.streak += 1;
      }
    } else {
      state.streak = 0;
    }
    refreshUi();
    queueProgressSync();
  }

  function handleQuestionsClick(event) {
    var button = event.target.closest("[data-question-id][data-answer]");
    if (!button) return;
    var questionId = Number(button.getAttribute("data-question-id"));
    var answer = button.getAttribute("data-answer");
    if (!questionId || !answer) return;
    setAnswer(questionId, answer);
  }

  function handleChapterJump(event) {
    var button = event.target.closest("[data-jump-chapter]");
    if (!button) return;
    var chapterId = button.getAttribute("data-jump-chapter");
    var firstQuestion = QUESTIONS.find(function (question) {
      return question.chapterId === chapterId;
    });
    if (!firstQuestion) return;
    var target = document.getElementById("q-" + firstQuestion.id);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  function restartQuiz() {
    state.answers = {};
    state.streak = 0;
    state.unlocked = {};
    clearTimeout(state.submission.progressTimer);
    state.submission.sending = false;
    state.submission.syncStatus = "idle";
    state.submission.error = "";
    state.submission.key = "";
    state.submission.startedAt = "";
    state.submission.lastSyncedStatus = "";
    state.submission.pendingPayload = null;
    clearSubmissionKey();
    clearSubmissionStartedAt();
    refreshUi();
    scrollToQuiz();
  }

  function wireEvents() {
    dom.heroStartBtn.addEventListener("click", requestStart);

    dom.leadWhatsapp.addEventListener("input", function (event) {
      dom.leadWhatsapp.value = maskPhoneBR(event.target.value);
    });

    dom.leadForm.addEventListener("submit", handleLeadSubmit);

    dom.gate.addEventListener("click", function (event) {
      var closeTarget = event.target.closest("[data-close-gate]");
      if (closeTarget) closeGate();
    });

    dom.questionsRoot.addEventListener("click", handleQuestionsClick);
    dom.chapterRings.addEventListener("click", handleChapterJump);
  }

  function init() {
    wireEvents();
    refreshUi();
    if (state.lead) {
      unlockQuiz();
      if (state.submission.key) {
        state.submission.lastSyncedStatus = "started";
      } else {
        submitChecklistData(buildSubmissionPayload("started"));
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
