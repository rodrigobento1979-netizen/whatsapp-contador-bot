import { NextResponse } from "next/server";
import { getSession, saveSession } from "./db";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();
    console.log("[Webhook acionado!]");
    console.log("Corpo recebido:", JSON.stringify(body, null, 2));

    // WHAPI envia mensagens em: body.messages
    const msg = body?.messages?.[0];
    if (!msg || !msg.text) {
      console.log("Nenhuma mensagem válida encontrada.");
      return NextResponse.json({ received: true });
    }

    const user = msg.from;
    const text = msg.text.body.trim();
    let session = await getSession(user);

    console.log("Sessão atual:", session);

    //
    // 1️⃣ PEDIR NOME DO CLIENTE
    //
    if (session.step === "awaiting-name") {
      session.name = text;
      session.step = "awaiting-company";
      await saveSession(user, session);

      return sendMessage(user,
        `Obrigado, *${session.name}*! 👋  
Agora, por favor envie o *CNPJ ou nome da empresa* que deseja atendimento.`
      );
    }

    //
    // 2️⃣ PEDIR CNPJ
    //
    if (session.step === "awaiting-company") {
      session.company = text;
      session.step = "main-menu";
      await saveSession(user, session);

      return sendMessage(user, menuPrincipal(session.name, session.company));
    }

    //
    // 3️⃣ MENU PRINCIPAL
    //
    if (session.step === "main-menu") {
      if (text === "1") {
        session.step = "menu-pessoal";
        await saveSession(user, session);
        return sendMessage(user, menuDeptoPessoal());
      }
      if (text === "2") {
        session.step = "menu-fiscal";
        await saveSession(user, session);
        return sendMessage(user, menuDeptoFiscal());
      }
      if (text === "3") {
        session.step = "menu-contabil";
        await saveSession(user, session);
        return sendMessage(user, menuDeptoContabil());
      }
      if (text === "9") {
        return sendMessage(user, "🔀 Encaminhando para um *especialista*...");
      }

      return sendMessage(user, "❗ Opção inválida.\n\n" + menuPrincipal());
    }

    //
    // 4️⃣ SUBMENUS COM VOLTAR
    //

    // ----- DEPARTAMENTO PESSOAL -----
    if (session.step === "menu-pessoal") {
      if (text === "0") {
        session.step = "main-menu";
        await saveSession(user, session);
        return sendMessage(user, menuPrincipal());
      }
      return sendMessage(user, respostaPessoal(text));
    }

    // ----- FISCAL -----
    if (session.step === "menu-fiscal") {
      if (text === "0") {
        session.step = "main-menu";
        await saveSession(user, session);
        return sendMessage(user, menuPrincipal());
      }
      return sendMessage(user, respostaFiscal(text));
    }

    // ----- CONTÁBIL -----
    if (session.step === "menu-contabil") {
      if (text === "0") {
        session.step = "main-menu";
        await saveSession(user, session);
        return sendMessage(user, menuPrincipal());
      }
      return sendMessage(user, respostaContabil(text));
    }

    return sendMessage(user, "Não entendi, por favor escolha uma opção válida.");

  } catch (e) {
    console.error("Erro no webhook:", e);
    return NextResponse.json({ error: e.message });
  }
}

/* --------------------------------------------------------
    FUNÇÕES DE MENSAGENS
-------------------------------------------------------- */

function sendMessage(to, message) {
  return NextResponse.json({
    to,
    message
  });
}

/* --------------------------------------------------------
 MENUS
-------------------------------------------------------- */

function menuPrincipal(name, company) {
  return `
Olá *${name}* 👋  
Empresa: *${company}*  

Escolha o departamento👇:

👤 *1 - Depto. Pessoal*
📄 *2 - Depto. Fiscal*
📚 *3 - Contábil*
  
🔀 *9 - Falar com especialista*
`;
}

function menuDeptoPessoal() {
  return `
👤 *DEPARTAMENTO PESSOAL*
Escolha uma opção:

1️⃣ Holerite  
2️⃣ Férias  
3️⃣ Rescisões  
4️⃣ Afastamentos  
5️⃣ Recalculo de Guias  
6️⃣ Enviar Documentos  
7️⃣ Solicitar Documentos  
9️⃣ Falar com Especialista

↩️ *0 - Voltar ao menu anterior*
`;
}

function menuDeptoFiscal() {
  return `
📄 *DEPARTAMENTO FISCAL*
Escolha uma opção:

1️⃣ Recalculo de Guias  
2️⃣ Falar sobre Impostos  
3️⃣ Enviar Documentos  
4️⃣ Relação de Faturamento  
5️⃣ Dúvidas na emissão de Notas  
9️⃣ Falar com Especialista  

↩️ *0 - Voltar ao menu anterior*
`;
}

function menuDeptoContabil() {
  return `
📚 *DEPARTAMENTO CONTÁBIL*
Escolha uma opção:

1️⃣ Enviar Documentos  
2️⃣ Solicitar Documentações  
9️⃣ Falar com Especialista  

↩️ *0 - Voltar ao menu anterior*
`;
}

/* --------------------------------------------------------
 RESPOSTAS
-------------------------------------------------------- */

function respostaPessoal(opt) {
  const map = {
    "1": "📄 Enviando holerite...",
    "2": "🗓 Solicitação de férias recebida.",
    "3": "📤 Processando rescisão...",
    "4": "📌 Registro de afastamento.",
    "5": "🔁 Recalculando guias...",
    "6": "📤 Pode enviar os documentos.",
    "7": "📥 Quais documentos deseja solicitar?",
    "9": "🔀 Encaminhando para um especialista..."
  };
  return map[opt] || "❗ Opção inválida.";
}

function respostaFiscal(opt) {
  const map = {
    "1": "🧾 Recalculo de guias solicitado.",
    "2": "💬 Fale sobre os impostos...",
    "3": "📤 Pode enviar os documentos.",
    "4": "📊 Envie o período do faturamento.",
    "5": "📝 Dúvidas sobre nota? Envie sua pergunta.",
    "9": "🔀 Encaminhando para especialista..."
  };
  return map[opt] || "❗ Opção inválida.";
}

function respostaContabil(opt) {
  const map = {
    "1": "📤 Envie os documentos contábeis.",
    "2": "📥 Quais documentos deseja solicitar?",
    "9": "🔀 Encaminhando para especialista..."
  };
  return map[opt] || "❗ Opção inválida.";
}
