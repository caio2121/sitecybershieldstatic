/**
 * Checklist interativo CNJ/LGPD cartÃ³rios â€” feedback por item (NÃ£o / NÃ£o sei).
 */
(function () {
    "use strict";

    var FEEDBACK = {
        q1: {
            nao: "Sem polÃ­tica vigente e conhecida pela equipe, nÃ£o hÃ¡ base documental de governanÃ§a. Em correiÃ§Ã£o, isso sustenta ausÃªncia de controles mÃ­nimos e pode ser lido como negligÃªncia ou omissÃ£o relevante, ensejando o regime do art. 24 do Provimento CNJ nÂº 213/2026.",
            nao_sei: "Se vocÃª nÃ£o sabe se existe polÃ­tica ou se a equipe foi treinada, na prÃ¡tica nÃ£o hÃ¡ como provar governanÃ§a. Trate como lacuna atÃ© publicar, divulgar e registrar treinamento ou ciÃªncia."
        },
        q2: {
            nao: "Sem inventÃ¡rio de sistemas, fornecedores e dados essenciais, nÃ£o hÃ¡ visibilidade do que precisa ser protegido; o dossiÃª tÃ©cnico fica incompleto e a fiscalizaÃ§Ã£o orientada por risco (art. 25) pode priorizar a serventia.",
            nao_sei: "NÃ£o saber o que hÃ¡ em operaÃ§Ã£o equivale a nÃ£o controlar o ambiente. FaÃ§a o inventÃ¡rio por escrito antes da prÃ³xima declaraÃ§Ã£o ou inspeÃ§Ã£o."
        },
        q3: {
            nao: "Sem dossiÃª ou evidÃªncias organizadas, vocÃª nÃ£o demonstra em correiÃ§Ã£o o cumprimento dos requisitos; indÃ­cios de nÃ£o conformidade e inconsistÃªncia com o declarado agravam o risco (arts. 17, Â§ 2Âº, e 25 do Provimento).",
            nao_sei: "Enquanto nÃ£o souber se o pacote de evidÃªncias estÃ¡ pronto, nÃ£o declare conformidade; a incerteza nÃ£o substitui prova documental."
        },
        q4: {
            nao: "UsuÃ¡rio ou senha compartilhados impedem identificar responsÃ¡vel por ato e quebram segregaÃ§Ã£o de funÃ§Ãµes; sustenta conclusÃ£o de falha bÃ¡sica de controle e omissÃ£o sob o art. 24.",
            nao_sei: "Se nÃ£o sabe se hÃ¡ compartilhamento, audite contas e senhas; na dÃºvida, trate como risco atÃ© corrigir e documentar."
        },
        q5: {
            nao: "Sem segunda confirmaÃ§Ã£o em acessos remotos ou administrativos, o ambiente fica exposto a invasÃ£o por credencial roubada; agrava leitura de negligÃªncia tÃ©cnica em incidente.",
            nao_sei: "Confirme com a equipe de TI ou fornecedor se MFA estÃ¡ ativo nos pontos crÃ­ticos; nÃ£o saber Ã© aceitar risco cego."
        },
        q6: {
            nao: "PermissÃµes, contas e senhas nÃ£o revistas mantÃªm acesso de quem jÃ¡ saiu ou mudou de funÃ§Ã£o â€” vetor clÃ¡ssico de incidente e de omissÃ£o na governanÃ§a de identidade (art. 24).",
            nao_sei: "Se nÃ£o hÃ¡ rotina de revisÃ£o documentada, implemente e registre; ignorar o tema nÃ£o elimina o dever do titular."
        },
        q7: {
            nao: "Sem mapa de dados pessoais nÃ£o hÃ¡ base sÃ³lida para demonstrar legalidade do tratamento nem para atender titulares; expÃµe a sanÃ§Ãµes do art. 52 da LGPD e a fiscalizaÃ§Ã£o da ANPD.",
            nao_sei: "Formalize o mapeamento (inventÃ¡rio de tratamentos); enquanto nÃ£o existir por escrito, o risco de infraÃ§Ã£o permanece."
        },
        q8: {
            nao: "Sem canal pÃºblico de fÃ¡cil acesso, publicidade ao titular e prazos definidos, hÃ¡ risco direto de violaÃ§Ã£o de direitos do titular e de sanÃ§Ãµes administrativas (art. 52, LGPD).",
            nao_sei: "Verifique site, recepÃ§Ã£o e contratos; nÃ£o saber se o canal estÃ¡ visÃ­vel equivale a nÃ£o garantir o exercÃ­cio de direitos."
        },
        q9: {
            nao: "Dados sensÃ­veis ou de alto risco sem proteÃ§Ã£o reforÃ§ada (incluindo criptografia quando exigida) podem gerar multa e medidas gravÃ­ssimas (art. 52, LGPD).",
            nao_sei: "Obtenha avaliaÃ§Ã£o tÃ©cnica ou DPO; tratar dado sensÃ­vel sem saber o nÃ­vel de proteÃ§Ã£o Ã© exposiÃ§Ã£o injustificÃ¡vel."
        },
        q10: {
            nao: "Sem backup fora do prÃ©dio ou do servidor principal, perda local pode ser definitiva para o acervo; expÃµe responsabilidade civil e cenÃ¡rio disciplinar (art. 24).",
            nao_sei: "Confirme onde ficam as cÃ³pias e teste restauraÃ§Ã£o; dÃºvida sobre backup off-site Ã© prioridade zero."
        },
        q11: {
            nao: "Backup nunca testado pode falhar na hora da necessidade; vocÃª nÃ£o tem garantia operacional real, sÃ³ cÃ³pia teÃ³rica.",
            nao_sei: "Agende teste documentado (data, responsÃ¡vel, resultado); atÃ© lÃ¡ o risco de indisponibilidade permanece alto."
        },
        q12: {
            nao: "Sem roteiro documentado e conhecido pela equipe, incidente vira improviso; comunicaÃ§Ã£o Ã  Corregedoria e prazos podem ser violados, com fundamento nos arts. 24 do Provimento e regime de incidente da LGPD.",
            nao_sei: "Se a equipe nÃ£o sabe o que fazer, o plano nÃ£o existe na prÃ¡tica; produza roteiro por escrito e treine."
        },
        q13: {
            nao: "Sem logs protegidos contra alteraÃ§Ã£o ou apagamento indevido, nÃ£o hÃ¡ rastreabilidade nem prova em apuraÃ§Ã£o; agrava consequÃªncias de incidente.",
            nao_sei: "Valide com suporte tÃ©cnico integridade e retenÃ§Ã£o de registros; incerteza aqui compromete defesa e correiÃ§Ã£o."
        },
        q14: {
            nao: "Sem clÃ¡usulas de seguranÃ§a, saÃ­da e prazo para devoluÃ§Ã£o dos dados, a serventia pode ficar refÃ©m do fornecedor; a responsabilidade continua do titular (Provimento CNJ nÂº 213/2026).",
            nao_sei: "Revise contrato antes de renovar; nÃ£o saber o que estÃ¡ pactuado Ã© aceitar risco jurÃ­dico e operacional."
        },
        q15: {
            nao: "SÃ³ a palavra do fornecedor nÃ£o substitui evidÃªncia sua; em correiÃ§Ã£o, precisa haver validaÃ§Ã£o interna documentada (atas, relatÃ³rios, testes).",
            nao_sei: "AusÃªncia de validaÃ§Ã£o escrita impede comprovar supervisÃ£o; trate como nÃ£o conforme atÃ© alguÃ©m da serventia assinar conferÃªncia."
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


