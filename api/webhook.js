// ==========================
//  FLUXO EMBUTIDO EM JSON
// ==========================

const flow = {
  welcome: {
    message: "Olá! 👋 Bem-vindo ao Atendimento Contábil.\nEscolha uma opção:\n\n1️⃣ Solicitações\n2️⃣ Administração\n\nDigite o número da opção:",
    options: {
      "1": "solicitacoes",
      "2": "administracao"
    }
  },

  solicitacoes: {
    message: "Escolha o setor desejado:\n\n1️⃣ Departamento Pessoal\n2️⃣ Departamento Fiscal\n3️⃣ Contábil\n\nDigite o número da opção:",
    options: {
      "1": "dp_menu",
      "2": "fiscal_menu",
      "3": "contabil_menu"
    }
  },

  dp_menu: {
    message: "Departamento Pessoal - Escolha uma opção:\n\n1️⃣ Holerite\n2️⃣ Férias\n3️⃣ Rescisões\n4️⃣ Afastamentos\n5️⃣ Recalculo de Guias\n6️⃣ Enviar Documentos\n7️⃣ Solicitar Documentos\n9️⃣ Falar com Especialista\n\nDigite a opção:",
    options: {
      "1": "dp_holerite",
      "2": "dp_ferias",
      "3": "dp_rescisoes",
      "4": "dp_afastamentos",
      "5": "dp_recalculo_guias",
      "6": "dp_enviar_docs",
      "7": "dp_solicitar_docs",
      "9": "especialista"
    }
  },

  fiscal_menu: {
    message: "Departamento Fiscal - Escolha uma opção:\n\n1️⃣ Recalculo de Guias\n2️⃣ Falar sobre Impostos\n3️⃣ Enviar Documentos\n4️⃣ Relação de Faturamento\n5️⃣ Dúvidas na Emissão de Notas\n9️⃣ Falar com Especialista\n\nDigite a opção:",
    options: {
      "1": "fiscal_recalculo",
      "2": "fiscal_impostos",
      "3": "fiscal_docs",
      "4": "fiscal_faturamento",
      "5": "fiscal_notas",
      "9": "especialista"
    }
  },

  contabil_menu: {
    message: "Contábil - Escolha uma opção:\n\n1️⃣ Enviar Documentos\n2️⃣ Solicitar Documentações\n9️⃣ Falar com Especialista\n\nDigite a opção:",
    options: {
      "1": "contabil_enviar_docs",
      "2": "contabil_solicitar_docs",
      "9": "especialista"
    }
  },

  administracao: {
    message: "Administração - Escolha uma opção:\n\n1️⃣ Solicitar Orçamentos\n2️⃣ Enviar Documentos\n3️⃣ Outras Solicitações\n\nDigite a opção:",
    options: {
      "1": "adm_orcamentos",
      "2": "adm_enviar_docs",
      "3": "adm_outras"
    }
  },

  // ======== DP ========
  dp_holerite: {
    response_template: "Solicitação registrada! 📄\nHolerite solicitado.",
    finish: true
  },
  dp_ferias: {
    response_template: "Solicitação registrada! 🌴\nPedido de férias encaminhado.",
    finish: true
  },
  dp_rescisoes: {
    response_template: "Solicitação registrada! 📑\nProcesso de rescisão iniciado.",
    finish: true
  },
  dp_afastamentos: {
    response_template: "Solicitação registrada! 🏥\nProcesso de afastamento aberto.",
    finish: true
  },
  dp_recalculo_guias: {
    response_template: "Solicitação registrada! 📊\nRecalculo de guias solicitado.",
    finish: true
  },
  dp_enviar_docs: {
    message: "Por favor, envie os documentos em PDF ou foto.",
    finish: true
  },
  dp_solicitar_docs: {
    response_template: "Sua solicitação de documentos foi enviada ao departamento pessoal.",
    finish: true
  },

  // ======== FISCAL ========
  fiscal_recalculo: {
    response_template: "Recalculo de guias fiscais solicitado.",
    finish: true
  },
  fiscal_impostos: {
    response_template: "Encaminhando para especialista em impostos...",
    finish: true
  },
  fiscal_docs: {
    message: "Envie os documentos fiscais em PDF ou foto.",
    finish: true
  },
  fiscal_faturamento: {
    response_template: "Solicitação registrada!\nGerando relação de faturamento...",
    finish: true
  },
  fiscal_notas: {
    message: "Descreva sua dúvida sobre emissão de notas:",
    finish: false
  },

  // ======== CONTÁBIL ========
  contabil_enviar_docs: {
    message: "Envie os documentos contábeis.",
    finish: true
  },
  contabil_solicitar_docs: {
    response_template: "Sua solicitação foi enviada ao departamento contábil.",
    finish: true
  },

  // ======== ADMIN ========
  adm_orcamentos: {
    response_template: "Sua solicitação de orçamento foi registrada!",
    finish: true
  },
  adm_enviar_docs: {
    message: "Envie os documentos administrativos.",
    finish: true
  },
  adm_outras: {
    message: "Descreva sua solicitação:",
    finish: false
  },

  // ======== HUMANO ========
  especialista: {
    response_template: "Encaminhando sua solicitação para um especialista 👨‍💼...",
    finish: true
  }
};


// ==========================================
//   SISTEMA DE ESTADO DE USUÁRIO (MEMÓRIA)
// ==========================================

const userState = {};


// ==========================
//   HANDLER PRINCIPAL
// ==========================

export default async function handler(req, res) {
  console.log("Webhook acionado!");

  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const body = req.body;
  console.log("Corpo recebido:", body);

  const msgObj = body?.messages?.[0];
  if (!msgObj) return res.status(200).json({ msg: "sem mensagem" });

  const msg = msgObj?.text?.body?.toLowerCase();
  const from = msgObj?.from;

  if (!userState[from]) userState[from] = { step: "welcome" };

  const step = userState[from].step;

  console.log(`Usuário ${from} está no passo: ${step}`);
  console.log(`Mensagem recebida: ${msg}`);

  const node = flow[step];

  // SE EXISTE UM MENU COM OPÇÕES
  if (node?.options) {
    if (!node.options[msg]) {
      await sendReply(from, "Opção inválida. Digite novamente:");
      await sendReply(from, node.message);
      return res.json({ ok: true });
    }

    userState[from].step = node.options[msg];
    const next = flow[userState[from].step];

    if (next.message) {
      await sendReply(from, next.message);
    }

    if (next.finish) userState[from].step = "welcome";

    return res.json({ ok: true });
  }

  // SE O NÓ ESPERA TEXTO LIVRE
  if (node?.response_template) {
    const reply = node.response_template.replace("{{input}}", msg);
    await sendReply(from, reply);
    userState[from].step = "welcome";
    return res.json({ ok: true });
  }

  if (node?.message) {
    await sendReply(from, node.message);
    if (node.finish) userState[from].step = "welcome";
    return res.json({ ok: true });
  }

  await sendReply(from, "Não entendi. Digite 'menu'.");
  userState[from].step = "welcome";
  return res.json({ ok: true });
}



// ==========================
//    ENVIO VIA WHAPI
// ==========================

async function sendReply(to, text) {
  const token = "TwxJ51jkF1ZF3A57Tbss0RPbCBJhADxj";

  const r = await fetch("https://gate.whapi.cloud/messages/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      to,
      body: text
    })
  });

  const j = await r.json();
  console.log("WHAPI →", j);
}
