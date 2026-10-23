/**
 * Checklist interativo CNJ/LGPD cartórios, feedback por item (Não / Não sei).
 */
(function () {
    "use strict";

    var FEEDBACK = {
        q1: {
            nao: "Sem política vigente e conhecida pela equipe, não há base documental de governança. Em correição, isso sustenta ausência de controles mínimos e pode ser lido como negligência ou omissão relevante, ensejando o regime do art. 24 do Provimento CNJ nº 213/2026.",
            nao_sei: "Se você não sabe se existe política ou se a equipe foi treinada, na prática não há como provar governança. Trate como lacuna até publicar, divulgar e registrar treinamento ou ciência."
        },
        q2: {
            nao: "Sem inventário de sistemas, fornecedores e dados essenciais, não há visibilidade do que precisa ser protegido; o dossiê técnico fica incompleto e a fiscalização orientada por risco (art. 25) pode priorizar a serventia.",
            nao_sei: "Não saber o que há em operação equivale a não controlar o ambiente. Faça o inventário por escrito antes da próxima declaração ou inspeção."
        },
        q3: {
            nao: "Sem dossiê ou evidências organizadas, você não demonstra em correição o cumprimento dos requisitos; indícios de não conformidade e inconsistência com o declarado agravam o risco (arts. 17, § 2º, e 25 do Provimento).",
            nao_sei: "Enquanto não souber se o pacote de evidências está pronto, não declare conformidade; a incerteza não substitui prova documental."
        },
        q4: {
            nao: "Usuário ou senha compartilhados impedem identificar responsável por ato e quebram segregação de funções; sustenta conclusão de falha básica de controle e omissão sob o art. 24.",
            nao_sei: "Se não sabe se há compartilhamento, audite contas e senhas; na dúvida, trate como risco até corrigir e documentar."
        },
        q5: {
            nao: "Sem segunda confirmação em acessos remotos ou administrativos, o ambiente fica exposto a invasão por credencial roubada; agrava leitura de negligência técnica em incidente.",
            nao_sei: "Confirme com a equipe de TI ou fornecedor se MFA está ativo nos pontos críticos; não saber é aceitar risco cego."
        },
        q6: {
            nao: "Permissões, contas e senhas não revistas mantêm acesso de quem já saiu ou mudou de função, vetor clássico de incidente e de omissão na governança de identidade (art. 24).",
            nao_sei: "Se não há rotina de revisão documentada, implemente e registre; ignorar o tema não elimina o dever do titular."
        },
        q7: {
            nao: "Sem mapa de dados pessoais não há base sólida para demonstrar legalidade do tratamento nem para atender titulares; expõe a sanções do art. 52 da LGPD e a fiscalização da ANPD.",
            nao_sei: "Formalize o mapeamento (inventário de tratamentos); enquanto não existir por escrito, o risco de infração permanece."
        },
        q8: {
            nao: "Sem canal público de fácil acesso, publicidade ao titular e prazos definidos, há risco direto de violação de direitos do titular e de sanções administrativas (art. 52, LGPD).",
            nao_sei: "Verifique site, recepção e contratos; não saber se o canal está visível equivale a não garantir o exercício de direitos."
        },
        q9: {
            nao: "Dados sensíveis ou de alto risco sem proteção reforçada (incluindo criptografia quando exigida) podem gerar multa e medidas gravíssimas (art. 52, LGPD).",
            nao_sei: "Obtenha avaliação técnica ou DPO; tratar dado sensível sem saber o nível de proteção é exposição injustificável."
        },
        q10: {
            nao: "Sem backup fora do prédio ou do servidor principal, perda local pode ser definitiva para o acervo; expõe responsabilidade civil e cenário disciplinar (art. 24).",
            nao_sei: "Confirme onde ficam as cópias e teste restauração; dúvida sobre backup off-site é prioridade zero."
        },
        q11: {
            nao: "Backup nunca testado pode falhar na hora da necessidade; você não tem garantia operacional real, só cópia teórica.",
            nao_sei: "Agende teste documentado (data, responsável, resultado); até lá o risco de indisponibilidade permanece alto."
        },
        q12: {
            nao: "Sem roteiro documentado e conhecido pela equipe, incidente vira improviso; comunicação à Corregedoria e prazos podem ser violados, com fundamento nos arts. 24 do Provimento e regime de incidente da LGPD.",
            nao_sei: "Se a equipe não sabe o que fazer, o plano não existe na prática; produza roteiro por escrito e treine."
        },
        q13: {
            nao: "Sem logs protegidos contra alteração ou apagamento indevido, não há rastreabilidade nem prova em apuração; agrava consequências de incidente.",
            nao_sei: "Valide com suporte técnico integridade e retenção de registros; incerteza aqui compromete defesa e correição."
        },
        q14: {
            nao: "Sem cláusulas de segurança, saída e prazo para devolução dos dados, a serventia pode ficar refém do fornecedor; a responsabilidade continua do titular (Provimento CNJ nº 213/2026).",
            nao_sei: "Revise contrato antes de renovar; não saber o que está pactuado é aceitar risco jurídico e operacional."
        },
        q15: {
            nao: "Só a palavra do fornecedor não substitui evidência sua; em correição, precisa haver validação interna documentada (atas, relatórios, testes).",
            nao_sei: "Ausência de validação escrita impede comprovar supervisão; trate como não conforme até alguém da serventia assinar conferência."
        }
    };

    function countAnswers() {
        var total = 15;
        var sim = 0;
        var nao = 0;
        var naoSei = 0;
        var answered = 0;
        for (var i = 1; i <= total; i++) {
            var sel = document.querySelector('input[name="interactive_q' + i + '"]:checked');
            if (sel) {
                answered++;
                if (sel.value === "sim") sim++;
                else if (sel.value === "nao") nao++;
                else if (sel.value === "nao_sei") naoSei++;
            }
        }
        return { total: total, sim: sim, nao: nao, nao_sei: naoSei, answered: answered };
    }

    function updateScorePanel() {
        var c = countAnswers();
        var adherence = c.total ? Math.round((c.sim / c.total) * 100) : 0;

        var elSim = document.getElementById("score-sim");
        var elNao = document.getElementById("score-nao");
        var elNs = document.getElementById("score-nao-sei");
        var elUn = document.getElementById("score-unanswered");
        var elPct = document.getElementById("score-pct");
        var elBar = document.getElementById("score-bar-fill");

        if (elSim) elSim.textContent = String(c.sim);
        if (elNao) elNao.textContent = String(c.nao);
        if (elNs) elNs.textContent = String(c.nao_sei);
        if (elUn) elUn.textContent = String(c.total - c.answered);
        if (elPct) elPct.textContent = String(adherence);
        if (elBar) elBar.style.width = String(adherence) + "%";
    }

    function onRadioChange(ev) {
        var input = ev.target;
        if (input.type !== "radio") return;

        var block = input.closest(".interactive-q");
        if (!block) return;

        var id = block.getAttribute("data-id");
        var msg = block.querySelector(".interactive-q__msg");
        if (!msg || !id || !FEEDBACK[id]) return;

        if (input.value === "sim") {
            msg.hidden = true;
            msg.textContent = "";
            msg.className = "interactive-q__msg";
        } else {
            var key = input.value === "nao" ? "nao" : "nao_sei";
            msg.textContent = FEEDBACK[id][key] || "";
            msg.hidden = false;
            msg.className =
                "interactive-q__msg" + (input.value === "nao_sei" ? " interactive-q__msg--neutral" : "");
        }
        updateScorePanel();
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener("change", onRadioChange);
        updateScorePanel();
    });
})();


