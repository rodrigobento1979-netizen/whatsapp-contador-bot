// ==========================
//  FLUXO EMBUTIDO EM JSON
// ==========================

const flow = {
  welcome: {
    message:
"Olá! 👋 Bem-vindo ao Atendimento Contábil.\nEscolha uma opção:\n\n1️⃣ Solicitações\n2️⃣ Administração\n\nDigite o número da opção:",
    options: { "1": "solicitacoes", "2": "administracao" }
  },

  // ===============================
  //        SOLICITAÇÕES
  // ===============================
  solicitacoes: {
    message:
"Selecione o setor desejado:\n\n👤 1 — Depto. Pessoal\n📄 2 — Depto. Fiscal\n📚 3 — Depto. Contábil\n\n↩️ 0 — Voltar ao menu anterior\n",
    options: {
      "1": "dp_menu",
      "2": "fiscal_menu",
      "3": "contabil_menu",
      "0": "welcome"
    }
  },

  // ===============================
  //     DEPARTAMENTO PESSOAL
  // ===============================
  dp_menu: {
    message:
"👤 Departamento Pessoal — Escolha uma opção:\n\n1️⃣ Holerite\n2️⃣ Férias\n3️⃣ Rescisões\n4️⃣ Afastamentos\n5️⃣ Recalculo de Guias\n6️⃣ Enviar Documentos\n7️⃣ Solicitar Documentos\n9️⃣ Falar com Especialista\n\n↩️ 0 — Voltar ao menu anterior\n🏠 00 — Menu principal",
    options: {
      "1": "dp_holerite",
      "2": "dp_ferias",
      "3": "dp_rescisoes",
      "4": "dp_afastamentos",
      "5": "dp_recalculo_guias",
      "6": "dp_enviar_docs",
      "7": "dp_solicitar_docs",
      "9": "especialista",
      "0": "solicitacoes",
      "00": "welcome"
    }
  },

  // ==== AÇÕES DP ====
  dp_holerite: {
    response_template: "📄 Solicitação registrada!\nHolerite solicitado.",
    finish: true
  },
  dp_ferias: {
    response_template: "🌴 Solicitação registrada!\nPedido de férias aberto.",
    finish: true
  },
  dp_rescisoes: {
    response_template: "📑 Solicitação registrada!\nProcesso de rescisão iniciado.",
    finish: true
  },
  dp_afastamentos: {
    response_template: "🏥 Solicitação registrada!\nProcesso de afastamento iniciado.",
    finish: true
  },
  dp_recalculo_guias: {
    response_template: "🧾 Solicitação registrada!\nRecalculo de guias pedido.",
    finish: true
  },
  dp_enviar_docs: {
    message: "📎 Envie os documentos em PDF ou foto.",
    finish: true
  },
  dp_solicitar_docs: {
    response_template: "📄 Solicitação enviada ao Depto. Pessoal.",
    finish: true
  },

  // ===============================
  //        DEPARTAMENTO FISCAL
  // ===============================
  fiscal_menu: {
    message:
"📄 Departamento Fiscal — Escolha uma opção:\n\n1️⃣ Recalculo de Guias\n2️⃣ Falar sobre Impostos\n3️⃣ Enviar Documentos\n4️⃣ Relação de Faturamento\n5️⃣ Dúvidas na Emissão de Notas\n9️⃣ Falar com Especialista\n\n↩️ 0 — Voltar ao menu anterior\n🏠 00 — Menu principal",
    options: {
      "1": "fiscal_recalculo",
      "2": "fiscal_impostos",
      "3": "fiscal_docs",
      "4": "fiscal_faturamento",
      "5": "fiscal_notas",
      "9": "especialista",
      "0": "solicitacoes",
      "00": "welcome"
    }
  },

  // ==== AÇÕES FISCAL ====
  fiscal_recalculo: {
    response_template: "📄 Recalculo de guias solicitado!",
    finish: true
  },
  fiscal_impostos: {
    response_template: "🧮 Um especialista em impostos irá te atender.",
    finish: true
  },
  fiscal_docs: {
    message: "📎 Envie os documentos fiscais.",
    finish: true
  },
  fiscal_faturamento: {
    response_template: "📊 Relação de faturamento solicitada!",
    finish: true
  },
  fiscal_notas: {
    message: "✍️ Explique sua dúvida sobre emissão de notas:",
    finish: false
  },

  // ===============================
  //        CONTÁBIL
  // ===============================
  contabil_menu: {
    message:
"📚 Departamento Contábil — Escolha uma opção:\n\n1️⃣ Enviar Documentos\n2️⃣ Solicitar Documentações\n9️⃣ Falar com Especialista\n\n↩️ 0 — Voltar ao menu anterior\n🏠 00 — Menu principal",
    options: {
      "1": "contabil_enviar_docs",
      "2": "contabil_solicitar_docs",
      "9": "especialista",
      "0": "solicitacoes",
      "00": "welcome"
    }
  },

  contabil_enviar_docs: {
    message: "📎 Envie os documentos contábeis.",
    finish: true
  },
  contabil_solicitar_docs: {
    response_template: "📄 Solicitação enviada ao Contábil.",
    finish: true
  },

  // ===============================
  //        ADMINISTRAÇÃO
  // ===============================
  administracao: {
    message:
"🏢 Administração — Escolha uma opção:\n\n1️⃣ Solicitar Orçamentos\n2️⃣ Enviar Documentos\n3️⃣ Outras Solicitações\n\n↩️ 0 — Voltar ao menu anterior\n🏠 00 — Menu principal",
    options: {
      "1": "adm_orcamentos",
      "2": "adm_enviar_docs",
      "3": "adm_outras",
      "0": "welcome",
      "00": "welcome"
    }
  },

  adm_orcamentos: {
    response_template: "📬 Sua solicitação de orçamento foi registrada!",
    finish: true
  },
  adm_enviar_docs: {
    message: "📎 Envie os documentos administrativos.",
    finish: true
  },
  adm_outras: {
    message: "✏️ Descreva sua solicitação:",
    finish: false
  },

  especialista: {
    response_template: "👨‍💼 Encaminhando para um especialista...",
    finish: true
  }
};


// ===============================
//    STATE OF USERS (MEMORY)
// ===============================

const userState = {};


// ===============================
//     MAIN WEBHOOK HANDLER
// ===============================

export default async function handler(req, res) {
  console.log("Webhook acionado!");

  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const body = req.body;
  console.log("Corpo recebido:", body);

  const msgObj = body?.messages?.[0];
  if (!msgObj) return res.status(200).json({ msg: "sem mensagem" });

  const msg = (msgObj?.text?.body || "").toLowerCase().trim();
  const from = msgObj?.from;

  // Inicializa usuário
  if (!userState[from]) userState[from] = { step: "welcome" };

  // Voltar ao menu principal
  if (msg === "00") {
    userState[from].step = "welcome";
    await sendReply(from, flow.welcome.message);
    return res.json({ ok: true });
  }

  // Voltar ao menu anterior
  if (msg === "0") {
    const back = getBackStep(userState[from].step);
    userState[from].step = back;
    await sendReply(from, flow[back].message);
    return res.json({ ok: true });
  }

  const step = userState[from].step;
  const node = flow[step];

  // PROCESSANDO MENUS COM OPÇÕES
  if (node.options) {
    if (!node.options[msg]) {
      await sendReply(from, "❌ Opção inválida.\nDigite novamente:");
      await sendReply(from, node.message);
      return res.json({ ok: true });
    }

    userState[from].step = node.options[msg];
    const nextNode = flow[userState[from].step];

    if (nextNode.message) await sendReply(from, nextNode.message);
    if (nextNode.finish) userState[from].step = "welcome";

    return res.json({ ok: true });
  }

  // PROCESSANDO INPUTS DE TEXTO
  if (node.response_template) {
    const reply = node.response_template.replace("{{input}}", msg);
    await sendReply(from, reply);
    userState[from].step = "welcome";
    return res.json({ ok: true });
  }

  if (node.message) {
    await sendReply(from, node.message);
    if (node.finish) userState[from].step = "welcome";
    return res.json({ ok: true });
  }

  // FALLBACK
  await sendReply(from, "Não entendi. Digite *00* para menu principal.");
  return res.json({ ok: true });
}


// ===============================
//      BACK MENU FUNCTION
// ===============================

function getBackStep(current) {
  const map = {
    dp_menu: "solicitacoes",
    fiscal_menu: "solicitacoes",
    contabil_menu: "solicitacoes",
    solicitacoes: "welcome",
    administracao: "welcome"
  };
  return map[current] || "welcome";
}


// ===============================
//         SEND VIA WHAPI
// ===============================

async function sendReply(to, text) {
  const token = "TwxJ51jkF1ZF3A57Tbss0RPbCBJhADxj";

  const r = await fetch("https://gate.whapi.cloud/messages/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ to, body: text })
  });

  console.log("WHAPI →", await r.json());
}
