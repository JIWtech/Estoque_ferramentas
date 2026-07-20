const STORAGE_KEY = "ferramentaria_estoque_v1";

const categories = [
  { id: "fresamento", name: "Pastilhas de Fresamento", prefix: "FRE" },
  { id: "torneamento", name: "Pastilhas de Torneamento", prefix: "TOR" },
  { id: "rosqueamento", name: "Rosqueamento", prefix: "ROS" },
  { id: "porta", name: "Porta-Ferramentas", prefix: "POR" },
  { id: "adaptadores", name: "Adaptadores", prefix: "ADA" },
  { id: "diversos", name: "Diversos", prefix: "DIV" },
];

const seedTools = [
  ["OFER070405TIN-ME15 F40M", "Pastilha/insert Seco para fresamento, geometria OFER 070405, quebra-cavaco M15, classe F40M. Codigo lido em estojo; confirmar aplicacao especifica no porta-fresa.", 157.59, "fresamento"],
  ["OFMR070405TR-M15 T350M", "Pastilha/insert Seco para fresamento, geometria OFMR 070405TR, quebra-cavaco M15, classe T350M. EDP 23951 visivel.", 184.78, "fresamento"],
  ["DCMT070202-F1 TP2500", "Pastilha Seco DCMT para torneamento/acabamento, geometria F1, classe TP2500. Caixa com QTY 10 e EDP 25364.", 84.37, "torneamento"],
  ["KOMX090312TR-ME06 MP2500", "Pastilha Seco KOMX para fresamento, geometria ME06, classe MP2500. Caixa com QTY 10 e EDP 31715.", 144.76, "fresamento"],
  ["XOMX120408TR-D14 T200M", "Pastilha Seco XOMX para fresamento, geometria D14, classe T200M. Caixa com QTY 10 e EDP 40412.", 166.99, "fresamento"],
  ["OOMT060525ZR-MHF-M16 MP2501", "Pastilha Seco OMNU para fresamento, geometria MHF-M16, classe MP2501. Fabricado na Suecia; codigo 6204039 visivel.", 180.95, "fresamento"],
  ["ONMU050410ANTN-M11 MP1501", "Pastilha Seco ONMU para fresamento, geometria M11, classe MP1501/Duratomic. Caixa com QTY 10; codigo EDP 40019.", 226.35, "fresamento"],
  ["XNEX080608TR-M13 MK1500", "Pastilha Seco XNEX para fresamento, geometria M13, classe MK1500. Caixa com QTY 10 e EDP 40019.", 152.81, "fresamento"],
  ["XOMX10T308TR-M09 F40M", "Pastilha Seco XOMX para fresamento, geometria M09, classe F40M. Caixa com QTY 12 e EDP 67879.", 132.36, "fresamento"],
  ["219.19-2020-M08 F17M", "Ferramenta/porta-fresa Seco 219.19-2020-M08 para insertos circulares F17M; leitura gravada no corpo; max RPM 30000.", 72.42, "porta"],
  ["GRAFLEX MS834 36.32", "Adaptador/porta-ferramenta modular Graflex Seco; marcacao MS834 36.32 visivel no corpo. Codigo complementar nao informado.", 1550.74, "adaptadores"],
  ["14ER4.OFG CP500", "Inserto Seco para rosqueamento externo, perfil 14ER4.OFG, classe CP500. Caixa com EDP 26755.", 325.90, "rosqueamento"],
  ["16NR14UN CP500", "Inserto Seco para rosqueamento interno, perfil 16NR14UN, classe CP500. Caixa com EDP 64745.", 178.10, "rosqueamento"],
  ["16ER12UN CP500", "Inserto Seco para rosqueamento externo, perfil 16ER12UN, classe CP500. Caixa com EDP 64745.", 267.00, "rosqueamento"],
  ["16NR8UN CP500", "Inserto Seco para rosqueamento interno, perfil 16NR8UN, classe CP500. Caixa com EDP 64745.", 265.00, "rosqueamento"],
  ["SNMG150608-M5 TP2500", "Pastilha Seco SNMG para torneamento/desbaste, classe TP2500/Duratomic. Caixa com QTY 10 e EDP 14582.", 173.53, "torneamento"],
  ["CNMG120408-M5 TP2500", "Pastilha Seco CNMG para torneamento/acabamento, classe TP2500. Caixa com QTY 10 e EDP 91123.", 46.81, "torneamento"],
  ["CCMT060204-MF2 TP2500", "Pastilha Seco CCMT para torneamento/acabamento, classe TP2500. Caixa com QTY 10 e EDP 66812.", 103.14, "torneamento"],
  ["CNMG120616-M5 TP3000", "Pastilha Seco CNMG para torneamento/desbaste, classe TP3000. Caixa com QTY 10 e EDP 89555.", 170.39, "torneamento"],
  ["CNMG120404-MF1 TP3000", "Pastilha Seco CNMG para torneamento/acabamento, classe TP3000. Caixa com QTY 10 e EDP 91123.", 51.67, "torneamento"],
  ["SNMM250724-R7 TP2000", "Pastilha redonda Seco SNMM 250724, geometria R7, classe TP2000. Codigo EDP 03181.", 118.68, "torneamento"],
  ["RCMX0803MO-M2 TP3000", "Pastilha redonda Seco RCMX 0803MO, geometria M2, classe TP3000. Caixa com QTY 10 e EDP 03181.", 88.25, "torneamento"],
  ["SPGN1204EDTR T250M", "Pastilha Secolor/Seco CCMT 32.50.5-F1, classe CP50. Estojo antigo com QTY 10 e EDP 91123; confirmar equivalencia.", 42.14, "diversos"],
];

let state = {
  loggedIn: false,
  user: null,
  counters: {},
  drawers: [],
  products: [],
  entries: [],
  exits: [],
  receipts: [],
  audit: [],
  auditLimit: 15,
  search: "",
  productCategoryFilter: "",
  productDrawerFilter: "",
  productStatusFilter: "",
  productSort: "name-asc",
  reportStart: "",
  reportEnd: "",
  reportCategory: "",
};
let currentView = localStorage.getItem("ferramentaria_current_view") || "dashboard";
let selectedDrawerId = null;
let selectedProductIds = [];

function todayISO() {
  return new Date().toISOString();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function brl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

async function refreshState() {
  const res = await fetch("/api/state");
  if (!res.ok) throw new Error("Erro ao carregar estado do servidor.");
  const remoteState = await res.json();
  state.drawers = remoteState.drawers;
  state.products = remoteState.products;
  state.entries = remoteState.entries;
  state.exits = remoteState.exits;
  state.receipts = remoteState.receipts;
  state.audit = remoteState.audit;
  state.counters = remoteState.counters;
}

function categoryName(id) {
  return categories.find((item) => item.id === id)?.name || "Sem categoria";
}

function drawerName(id) {
  return state.drawers.find((item) => item.id === id)?.name || "Sem gaveta";
}

function app() {
  const activeId = document.activeElement ? document.activeElement.id : null;
  const selectionStart = document.activeElement && typeof document.activeElement.selectionStart === "number" ? document.activeElement.selectionStart : null;
  const selectionEnd = document.activeElement && typeof document.activeElement.selectionEnd === "number" ? document.activeElement.selectionEnd : null;

  document.getElementById("app").innerHTML = state.loggedIn ? shell() : loginScreen();
  bindGlobalEvents();

  if (activeId) {
    const focusTarget = document.getElementById(activeId);
    if (focusTarget) {
      focusTarget.focus();
      if (selectionStart !== null && selectionEnd !== null) {
        try {
          focusTarget.setSelectionRange(selectionStart, selectionEnd);
        } catch (e) {
          // Ignore for elements that don't support text selection ranges (e.g. selects)
        }
      }
    }
  }
}

function loginScreen() {
  return `
    <section class="login-screen">
      <form class="login-panel" id="loginForm">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, #ff7700 0%, #ea580c 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.45);">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div>
            <strong style="font-size: 1.5rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; display: block; line-height: 1.1;">ICATech<span style="color: #f97316;">Tools</span></strong>
            <span style="font-size: 0.75rem; color: #f59e0b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Ferramentas que Transformam</span>
          </div>
        </div>
        <p>Sistema industrial de controle de estoque paralelo, gavetas 2D e saídas com recibo.</p>
        <div class="field">
          <label for="username">Usuário</label>
          <input id="username" placeholder="Digite seu usuário" autocomplete="username" />
        </div>
        <div class="field">
          <label for="password">Senha</label>
          <input id="password" type="password" placeholder="Digite sua senha" autocomplete="current-password" />
        </div>
        <button class="btn primary" type="submit">Entrar no Sistema</button>
        <p id="loginError"></p>
      </form>
      <div class="login-visual"></div>
    </section>
  `;
}

function shell() {
  return `
    <section class="app-shell">
      <div class="sidebar-backdrop"></div>
      <header class="mobile-header no-print">
        <button class="btn-menu" data-action="toggleSidebar" aria-label="Abrir Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="mobile-brand">ICATech<span style="color: #f97316;">Tools</span></div>
      </header>
      <aside class="sidebar">
        <div class="brand">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 8px; background: linear-gradient(135deg, #ff7700 0%, #ea580c 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4); flex-shrink: 0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div style="min-width: 0;">
              <strong style="font-size: 1.15rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; display: block; line-height: 1.1; white-space: nowrap;">ICATech<span style="color: #f97316;">Tools</span></strong>
              <span style="font-size: 0.7rem; color: #f59e0b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: block; white-space: nowrap;">Ferramentaria</span>
            </div>
          </div>
          <span style="margin-top: 8px; font-size: 0.8rem; color: var(--muted); display: block;">Operador: <strong style="color: #ffffff;">${escapeHtml(state.user)}</strong></span>
        </div>
        <nav class="nav">
          ${navButton("dashboard", "Dashboard")}
          ${navButton("cabinet", "Armário 2D")}
          ${navButton("products", "Produtos")}
          ${navButton("entries", "Entradas")}
          ${navButton("exits", "Saídas e Recibos")}
          ${navButton("reports", "Relatórios")}
          ${navButton("audit", "Histórico")}
        </nav>
        <button class="btn ghost" data-action="logout" style="margin-top: auto;">Sair</button>
      </aside>
      <section class="content">
        ${viewContent()}
      </section>
    </section>
  `;
}

function navButton(view, label) {
  return `<button class="${currentView === view ? "active" : ""}" data-view="${view}">${label}</button>`;
}

function pageHead(title, subtitle, extra = "") {
  const dateStr = new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `
    <header class="topbar" data-print-date="${dateStr}">
      <div>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      <div class="actions">${extra}</div>
    </header>
  `;
}

function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "";
  if (type === "success") {
    icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <div style="flex-shrink: 0; display: flex; align-items: center;">${icon}</div>
    <div style="flex: 1;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

function emptyState(iconHtml, title, description, actionButtonHtml = "") {
  return `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; text-align: center; flex: 1; height: 100%; min-height: 380px; width: 100%;">
      <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(56, 189, 248, 0.08); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 1.5px solid rgba(56, 189, 248, 0.2);">
        ${iconHtml}
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.02em;">${title}</h3>
      <p style="color: var(--muted); font-size: 0.9rem; max-width: 380px; line-height: 1.6; margin-bottom: ${actionButtonHtml ? "24px" : "0"};">${description}</p>
      ${actionButtonHtml}
    </div>
  `;
}

function viewContent() {
  const views = {
    dashboard: dashboardView,
    cabinet: cabinetView,
    products: productsView,
    entries: entriesView,
    exits: exitsView,
    reports: reportsView,
    audit: auditView,
  };
  return views[currentView]();
}

function formatAuditItem(item) {
  let actionBadge = `<span class="badge" style="background: #1e293b; color: #94a3b8; font-size: 0.72rem; padding: 2px 6px;">Ação</span>`;
  let actionQty = "-";
  let qtyColor = "var(--muted)";
  let actionText = escapeHtml(item.action);

  if (item.action.startsWith("Entrada registrada:")) {
    const parts = item.action.split(":");
    const details = parts[1]?.trim().split(" ") || [];
    const code = details[0] || "";
    const qty = details[1] || "";
    actionBadge = `<span class="badge" style="background: #064e3b; color: #34d399; font-size: 0.72rem; padding: 2px 6px;">Entrada</span>`;
    actionQty = `+${qty}`;
    qtyColor = "#34d399";
    actionText = `Item: <strong>${escapeHtml(code)}</strong>`;
  } else if (item.action.startsWith("Saída finalizada") || item.action.startsWith("Saida finalizada")) {
    const match = item.action.match(/recibo (REC-\d+):\s*([A-Z0-9-]+)\s*(-?\d+)/);
    if (match) {
      const receipt = match[1];
      const code = match[2];
      const qty = match[3];
      actionBadge = `<span class="badge" style="background: #4c0519; color: #fca5a5; font-size: 0.72rem; padding: 2px 6px;">Saída</span>`;
      actionQty = `${qty}`;
      qtyColor = "#fca5a5";
      actionText = `Item: <strong>${escapeHtml(code)}</strong> <span style="font-size: 0.78rem; color: var(--muted); margin-left: 6px;">(Recibo: ${escapeHtml(receipt)})</span>`;
    }
  } else if (item.action.startsWith("Ferramenta ") || item.action.includes("movida de") || item.action.includes("movida para") || item.action.includes("movidas para")) {
    actionBadge = `<span class="badge" style="background: rgba(249, 115, 22, 0.18); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3); font-size: 0.72rem; padding: 2px 6px;">Movimentação</span>`;
    const qtyMatch = item.action.match(/^(\d+)\s+ferramentas/i);
    actionQty = qtyMatch ? qtyMatch[1] : "1";
    qtyColor = "#f97316";

    const parts = item.action.split(". Motivo:");
    const mainDetail = parts[0].trim();
    const reasonText = parts[1]?.trim();

    // Tenta extrair: Ferramenta CODE (NAME) movida de 'ORIGIN' para 'TARGET'
    const moveMatch = mainDetail.match(/Ferramenta\s+([^\s()]+)(?:\s+\(([^()]+)\))?\s+movida\s+de\s+'([^']+)'\s+para\s+'([^']+)'/i);

    let formattedMain = "";
    if (moveMatch) {
      const code = moveMatch[1];
      const name = moveMatch[2];
      const origin = moveMatch[3];
      const target = moveMatch[4];

      formattedMain = `Item: <strong>${escapeHtml(code)}</strong> ${name ? `<span style="color: var(--muted); font-size: 0.82rem;">(${escapeHtml(name)})</span> ` : ""}: <span style="color: #94a3b8; font-weight: 700;">'${escapeHtml(origin)}'</span> ➔ <strong style="color: var(--accent);">'${escapeHtml(target)}'</strong>`;
    } else {
      formattedMain = escapeHtml(mainDetail);
    }

    const reasonBadge = reasonText
      ? `<span style="display: inline-flex; align-items: center; margin-left: 8px; padding: 2px 8px; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 6px; font-size: 0.78rem; font-weight: 700;"><strong style="color: #f59e0b; margin-right: 4px;">Motivo:</strong> ${escapeHtml(reasonText)}</span>`
      : "";

    actionText = `<span>${formattedMain}</span>${reasonBadge}`;
  } else if (item.action.startsWith("Produto editado:")) {
    const code = item.action.replace("Produto editado:", "").trim();
    actionBadge = `<span class="badge" style="background: #1e293b; color: #38bdf8; font-size: 0.72rem; padding: 2px 6px;">Edição</span>`;
    actionText = `Produto: <strong>${escapeHtml(code)}</strong>`;
  } else if (item.action.startsWith("Produto cadastrado:")) {
    const code = item.action.replace("Produto cadastrado:", "").trim();
    actionBadge = `<span class="badge" style="background: #0f172a; color: #10b981; font-size: 0.72rem; padding: 2px 6px;">Cadastro</span>`;
    actionText = `Novo item: <strong>${escapeHtml(code)}</strong>`;
  } else if (item.action.startsWith("Gaveta criada:")) {
    const name = item.action.replace("Gaveta criada:", "").trim();
    actionBadge = `<span class="badge" style="background: #1e293b; color: #fbbf24; font-size: 0.72rem; padding: 2px 6px;">Gaveta</span>`;
    actionText = `Nova gaveta: <strong>${escapeHtml(name)}</strong>`;
  } else if (item.action.startsWith("Gaveta editada:")) {
    const name = item.action.replace("Gaveta editada:", "").trim();
    actionBadge = `<span class="badge" style="background: #1e293b; color: #fbbf24; font-size: 0.72rem; padding: 2px 6px;">Gaveta</span>`;
    actionText = `Editou gaveta: <strong>${escapeHtml(name)}</strong>`;
  } else if (item.action.startsWith("Gaveta excluída:") || item.action.startsWith("Gaveta excluida:")) {
    const name = item.action.replace(/Gaveta excluída:|Gaveta excluida:/, "").trim();
    actionBadge = `<span class="badge" style="background: #4c0519; color: #fda4af; font-size: 0.72rem; padding: 2px 6px;">Exclusão</span>`;
    actionText = `Gaveta excluída: <strong>${escapeHtml(name)}</strong>`;
  } else if (item.action.startsWith("Operação em massa") || item.action.startsWith("Operacao em massa")) {
    if (item.action.includes("em 1 produtos")) {
      actionBadge = `<span class="badge" style="background: rgba(249, 115, 22, 0.18); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3); font-size: 0.72rem; padding: 2px 6px;">Movimentação</span>`;
      actionQty = "1";
      qtyColor = "#f97316";
      actionText = `Movimentação de 1 ferramenta entre gavetas`;
    } else {
      actionBadge = `<span class="badge" style="background: #312e81; color: #c7d2fe; font-size: 0.72rem; padding: 2px 6px;">Lote</span>`;
      actionText = escapeHtml(item.action);
    }
  }

  return { actionBadge, actionQty, qtyColor, actionText };
}

function renderAuditRow(item) {
  const dateObj = new Date(item.date);
  const dateStr = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const { actionBadge, actionQty, actionText } = formatAuditItem(item);

  return `
    <tr>
      <td style="white-space: nowrap; color: var(--muted);">${dateStr} ${timeStr}</td>
      <td style="font-weight: 600; color: var(--accent); white-space: nowrap;">${escapeHtml(item.user)}</td>
      <td class="text-center">${actionBadge}</td>
      <td class="text-center" style="white-space: nowrap;">${actionQty}</td>
      <td>${actionText}</td>
    </tr>
  `;
}

function renderAuditMobileCards(items) {
  if (!items.length) {
    return `<div style="color: var(--muted); padding: 20px; text-align: center;">Nenhuma movimentação registrada.</div>`;
  }
  return `
    <div class="mobile-only">
      <div class="audit-cards">
        ${items.map((item) => {
          const dateObj = new Date(item.date);
          const dateStr = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          
          const { actionBadge, actionQty, qtyColor, actionText } = formatAuditItem(item);

          return `
            <div class="log-mobile-card">
              <div class="log-card-header">
                <span class="log-time">${dateStr} ${timeStr}</span>
                ${actionBadge}
              </div>
              <div class="log-card-body" style="display: flex; flex-direction: column; gap: 4px;">
                <p style="font-size: 0.85rem; color: var(--ink); margin-bottom: 2px;">${actionText}</p>
                <div class="info-row" style="margin-top: 4px; border-top: 1px dashed var(--line); padding-top: 4px;">
                  <span class="info-label">Por: <strong style="color: var(--accent);">${escapeHtml(item.user)}</strong></span>
                  ${actionQty !== "-" ? `<span style="font-weight: 800; color: ${qtyColor};">${actionQty}</span>` : ""}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function dashboardView() {
  const totalQty = state.products.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Compact category list: showing only the status warning/stable per category
  const categoryRows = categories.map((cat) => {
    const catProducts = state.products.filter((p) => p.categoryId === cat.id);
    const catQty = catProducts.reduce((sum, p) => sum + p.quantity, 0);

    // Count low stock items in this category
    const lowStockCount = catProducts.filter((p) => Number(p.quantity) <= 2).length;

    let statusHtml = "";
    if (lowStockCount > 0) {
      statusHtml = `<span style="color: #f43f5e; font-size: 0.8rem; font-weight: 700;">⚠ ${lowStockCount} item(ns) em alerta</span>`;
    } else {
      statusHtml = `<span style="color: var(--ok); font-size: 0.8rem; font-weight: 700;">✓ Estável</span>`;
    }

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1.5px solid var(--line);">
        <div>
          <div style="font-weight: 700; color: var(--ink); font-size: 0.92rem;">${escapeHtml(cat.name)}</div>
          <div style="margin-top: 3px;">${statusHtml}</div>
        </div>
        <span class="badge ${catQty === 0 ? "out" : ""}" style="font-weight: 800; font-size: 0.8rem; padding: 3px 6px;">
          ${catQty} un.
        </span>
      </div>
    `;
  }).join("");

  const auditRowsHtml = state.audit.slice(0, 5).map(renderAuditRow).join("") || `
    <tr>
      <td colspan="5" style="text-align: center; border: 1px solid var(--line); color: var(--muted); padding: 20px;">Nenhuma movimentação registrada.</td>
    </tr>
  `;

  return `
    ${pageHead("Dashboard", "Resumo rápido do estoque paralelo da ferramentaria.")}
    <section class="stats">
      ${stat("Tipos de Produtos", state.products.length)}
      ${stat("Estoque Total", totalQty)}
      ${stat("Entradas registradas", state.entries.length)}
      ${stat("Saídas & Recibos", `${state.exits.length}/${state.receipts.length}`)}
    </section>
    
    <div class="dashboard-grid" style="margin-top: 8px;">
      <div class="panel" style="display: flex; flex-direction: column; gap: 12px; justify-content: flex-start;">
        <h3 style="font-size: 1.1rem; font-weight: 800; border-bottom: 2px solid var(--line); padding-bottom: 8px;">Classificação e Alertas</h3>
        <div style="display: grid; gap: 2px;">${categoryRows}</div>
      </div>
      
      <div class="panel" style="display: flex; flex-direction: column; gap: 12px; justify-content: flex-start;">
        <h3 style="font-size: 1.1rem; font-weight: 800; border-bottom: 2px solid var(--line); padding-bottom: 8px;">Histórico de Movimentações</h3>
        <div class="desktop-only">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="width: 130px;">Data/Hora</th>
                  <th style="width: 100px;">Usuário</th>
                  <th style="width: 100px;" class="text-center">Operação</th>
                  <th style="width: 80px;" class="text-center">Qtd</th>
                  <th>Detalhe</th>
                </tr>
              </thead>
              <tbody>
                ${auditRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
        ${renderAuditMobileCards(state.audit.slice(0, 5))}
        <div style="text-align: right; margin-top: 8px;">
          <button class="btn ghost" style="min-height: 32px; padding: 4px 12px; font-size: 0.8rem;" data-view="audit">Ver histórico completo</button>
        </div>
      </div>
    </div>
  `;
}

function stat(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function cabinetView() {
  if (!state.drawers.length) {
    return `
      ${pageHead("Armário 2D", "Nenhuma gaveta cadastrada no sistema.", `
        <button class="btn" data-action="newDrawer">Nova gaveta</button>
      `)}
      <section class="cabinet-layout">
        <div class="cabinet">
          <p style="color: #aab5c3; padding: 20px; text-align: center;">Clique em "Nova gaveta" para começar.</p>
        </div>
        <aside class="drawer-detail"></aside>
      </section>
    `;
  }

  const selectedDrawer = state.drawers.find((drawer) => drawer.id === selectedDrawerId);
  if (!selectedDrawer) {
    return `
      ${pageHead("Armário 2D", "Organização física das ferramentas. Clique em uma gaveta para abrir e ver seu organizador.", `
        <button class="btn" data-action="newDrawer">Nova gaveta</button>
        <button class="btn primary" data-action="newProduct">Novo produto</button>
      `)}
      <section class="cabinet-layout">
        <div class="cabinet">
          ${state.drawers.map((drawer, index) => drawerCard(drawer, index)).join("")}
        </div>
        <aside class="drawer-detail">
          <div class="drawer-tray" style="justify-content: center; align-items: center; text-align: center; color: var(--muted); min-height: 400px; display: flex; flex-direction: column;">
            <p style="font-weight: 800; font-size: 1.1rem; color: #ffffff;">Nenhuma gaveta selecionada</p>
            <p style="font-size: 0.88rem; margin-top: 8px;">Clique em uma gaveta do armário para ver seu organizador interno.</p>
          </div>
        </aside>
      </section>
    `;
  }

  const drawerProducts = state.products.filter((product) => product.drawerId === selectedDrawer.id);

  // Group products by category
  const categoriesInDrawer = {};
  drawerProducts.forEach((product) => {
    const catName = categoryName(product.categoryId);
    if (!categoriesInDrawer[catName]) {
      categoriesInDrawer[catName] = [];
    }
    categoriesInDrawer[catName].push(product);
  });

  const compartmentsHtml = Object.keys(categoriesInDrawer).map((catName) => {
    const productsInCat = categoriesInDrawer[catName];
    return `
      <div class="tray-compartment">
        <div class="compartment-title">${escapeHtml(catName)}</div>
        <div class="drawer-items">
          ${productsInCat.map(productChip).join("")}
        </div>
      </div>
    `;
  }).join("") || `<p style="color: #aab5c3; padding: 20px; text-align: center;">Nenhuma ferramenta cadastrada nesta gaveta. Arraste itens para cá ou use o menu administrativo para mover.</p>`;

  return `
    ${pageHead("Armário 2D", "Organização física das ferramentas. Clique em uma gaveta para abrir e ver seu organizador.", `
      <button class="btn" data-action="newDrawer">Nova gaveta</button>
      <button class="btn primary" data-action="newProduct">Novo produto</button>
    `)}
    <section class="cabinet-layout">
      <div class="cabinet">
        ${state.drawers.map((drawer, index) => drawerCard(drawer, index)).join("")}
      </div>
      <aside class="drawer-detail">
        <div class="drawer-tray">
          <div class="tray-header">
            <h3>Organizador: ${escapeHtml(selectedDrawer.name)}</h3>
            <div class="actions">
              <button class="btn" data-action="editDrawer" data-id="${selectedDrawer.id}">Editar</button>
              <button class="btn danger" data-action="deleteDrawer" data-id="${selectedDrawer.id}">Excluir</button>
            </div>
          </div>
          <div class="tray-compartments">
            ${compartmentsHtml}
          </div>
        </div>
      </aside>
    </section>
  `;
}

function drawerCard(drawer, index) {
  const items = state.products.filter((product) => product.drawerId === drawer.id);
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  // LED logic based on stock level
  let ledClass = "red"; // No stock
  let ledTitle = `Sem estoque (0 itens)`;

  if (totalQty >= 15) {
    ledClass = "green"; // High stock
    ledTitle = `Estoque alto: ${totalQty} itens`;
  } else if (totalQty > 0) {
    ledClass = "yellow"; // Low stock
    ledTitle = `Estoque baixo: ${totalQty} itens`;
  }

  const isOpen = drawer.id === selectedDrawerId;
  const indexStr = String(index + 1).padStart(2, "0");

  return `
    <article class="drawer-metalic ${isOpen ? "open" : ""}" data-drawer-id="${drawer.id}">
      <div class="drawer-label-holder">GAVETA ${indexStr}: ${escapeHtml(drawer.name)}</div>
      <div class="drawer-handle"></div>
      <div class="drawer-led ${ledClass}" title="${ledTitle} (${items.length} tipos de itens)"></div>
    </article>
  `;
}

function productChip(product) {
  const stockClass = Number(product.quantity) <= 0 ? "out" : Number(product.quantity) <= 2 ? "low" : "";
  const isSelected = selectedProductIds.includes(product.id);

  const imgHtml = product.imageUrl ? `
    <img src="${escapeHtml(product.imageUrl)}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid var(--line); pointer-events: none;" />
  ` : `
    <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--line); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: var(--muted); font-weight: bold; pointer-events: none;">Foto</div>
  `;

  return `
    <div class="item-chip ${isSelected ? "selected" : ""}" draggable="true" data-product-id="${product.id}" style="display: flex; gap: 12px; align-items: center; text-align: left; justify-content: flex-start; padding: 8px 12px;">
      ${imgHtml}
      <div style="flex: 1; display: grid; gap: 2px; min-width: 0;">
        <strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.88rem; color: var(--ink); margin-bottom: 0;">${escapeHtml(product.name)}</strong>
        <span style="font-size: 0.72rem; color: var(--muted); font-family: monospace; font-weight: bold;">${escapeHtml(product.internalId)}</span>
      </div>
      <span class="badge ${stockClass}" style="flex-shrink: 0; font-size: 0.75rem; padding: 2px 6px;">Qtd: ${product.quantity}</span>
    </div>
  `;
}

function productsView() {
  return `
    ${pageHead("Produtos", "Cadastro completo, busca rápida e operações em massa.", `
      <input id="search" placeholder="Buscar por nome, ID, código, categoria..." value="${escapeHtml(state.search || "")}" />
      <button class="btn primary" data-action="newProduct">Novo produto</button>
      <button class="btn" data-action="bulkProducts">Editar selecionados</button>
    `)}
    
    <div class="grid-4 no-print" style="margin-top: 8px; margin-bottom: 8px; gap: 12px; align-items: flex-end;">
      <div class="field" style="margin-bottom: 0;">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Filtrar Categoria</label>
        ${categorySelect("productCategoryFilter", state.productCategoryFilter || "", "Todas as categorias")}
      </div>
      <div class="field" style="margin-bottom: 0;">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Filtrar Gaveta</label>
        <select id="productDrawerFilter">
          <option value="">Todas as gavetas</option>
          ${state.drawers.map(d => `<option value="${d.id}" ${state.productDrawerFilter === d.id ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom: 0;">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Filtrar Status</label>
        <select id="productStatusFilter">
          <option value="">Todos os status</option>
          <option value="Ativo" ${state.productStatusFilter === "Ativo" ? "selected" : ""}>Ativo</option>
          <option value="Inativo" ${state.productStatusFilter === "Inativo" ? "selected" : ""}>Inativo</option>
        </select>
      </div>
      <div class="field" style="margin-bottom: 0;">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Ordenar por</label>
        <select id="productSort">
          <option value="name-asc" ${state.productSort === "name-asc" ? "selected" : ""}>Código/Nome (A-Z)</option>
          <option value="name-desc" ${state.productSort === "name-desc" ? "selected" : ""}>Código/Nome (Z-A)</option>
          <option value="qty-desc" ${state.productSort === "qty-desc" ? "selected" : ""}>Qtd: Maior → Menor</option>
          <option value="qty-asc" ${state.productSort === "qty-asc" ? "selected" : ""}>Qtd: Menor → Maior</option>
          <option value="price-desc" ${state.productSort === "price-desc" ? "selected" : ""}>Preço: Maior → Menor</option>
          <option value="price-asc" ${state.productSort === "price-asc" ? "selected" : ""}>Preço: Menor → Maior</option>
        </select>
      </div>
    </div>

    <section class="panel products-panel" style="margin-top: 12px;">
      ${productsTable(filteredProducts(), true)}
    </section>
  `;
}

function filteredProducts() {
  const query = String(state.search || "").toLowerCase().trim();
  let list = state.products;

  // 1. Text Search query
  if (query) {
    list = list.filter((item) => [
      item.internalId,
      item.manufacturerCode,
      item.name,
      item.description,
      categoryName(item.categoryId),
      drawerName(item.drawerId),
    ].join(" ").toLowerCase().includes(query));
  }

  // 2. Category Filter
  if (state.productCategoryFilter) {
    list = list.filter(item => item.categoryId === state.productCategoryFilter);
  }

  // 3. Drawer Filter
  if (state.productDrawerFilter) {
    list = list.filter(item => item.drawerId === state.productDrawerFilter);
  }

  // 4. Status Filter
  if (state.productStatusFilter) {
    list = list.filter(item => item.status === state.productStatusFilter);
  }

  // 5. Sorting
  const sort = state.productSort || "name-asc";
  list = [...list].sort((a, b) => {
    if (sort === "name-asc") {
      return a.manufacturerCode.localeCompare(b.manufacturerCode);
    } else if (sort === "name-desc") {
      return b.manufacturerCode.localeCompare(a.manufacturerCode);
    } else if (sort === "qty-desc") {
      return b.quantity - a.quantity;
    } else if (sort === "qty-asc") {
      return a.quantity - b.quantity;
    } else if (sort === "price-desc") {
      return b.price - a.price;
    } else if (sort === "price-asc") {
      return a.price - b.price;
    }
    return 0;
  });

  return list;
}

function productsTable(products, selectable = false) {
  if (!products.length) {
    return emptyState(
      `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
      "Nenhum produto encontrado",
      "Não foi encontrada nenhuma ferramenta correspondente aos filtros aplicados."
    );
  }

  const tableHtml = `
    <div class="desktop-only">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${selectable ? "<th style='width: 45px;' class='text-center'></th>" : ""}
              <th style="width: 75px;" class="text-center">Foto</th>
              <th style="width: 130px;" class="text-left">ID Interno</th>
              <th class="text-left">Produto / Descrição</th>
              <th style="width: 175px;" class="text-left">Categoria</th>
              <th style="width: 175px;" class="text-left">Gaveta</th>
              <th style="width: 110px;" class="text-center">Estoque</th>
              <th style="width: 115px;" class="text-left">Preço</th>
              <th style="width: 95px;" class="text-center">Status</th>
              <th style="width: 235px;" class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((item) => {
              const stockClass = item.quantity <= 0 ? "out" : item.quantity <= 2 ? "low" : "";
              const isChecked = selectedProductIds.includes(item.id);
              
              return `
                <tr style="${isChecked ? "background: rgba(249, 115, 22, 0.08);" : ""}">
                  ${selectable ? `<td class="text-center"><input type="checkbox" class="row-check" value="${item.id}" ${isChecked ? "checked" : ""} style="width: 17px; height: 17px; cursor: pointer;" /></td>` : ""}
                  <td class="text-center">
                    ${item.imageUrl ? `
                      <img src="${escapeHtml(item.imageUrl)}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1.5px solid var(--line); box-shadow: var(--shadow);" />
                    ` : `
                      <div style="width: 44px; height: 44px; border-radius: 8px; background: #181b22; border: 1.5px dashed var(--line); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: var(--muted); font-weight: bold; margin: 0 auto;">Sem foto</div>
                    `}
                  </td>
                  <td class="text-left"><span class="badge-code">${escapeHtml(item.internalId)}</span></td>
                  <td class="text-left">
                    <strong style="font-size: 0.93rem; color: #ffffff; display: block; line-height: 1.2;">${escapeHtml(item.name)}</strong>
                    <div style="font-size: 0.76rem; color: var(--muted); margin-top: 3px;">Cód. Fabricante: <span style="color: #cbd5e1; font-weight: 600;">${escapeHtml(item.manufacturerCode)}</span></div>
                  </td>
                  <td class="text-left"><span class="badge-category">${escapeHtml(categoryName(item.categoryId))}</span></td>
                  <td class="text-left"><span class="badge-drawer">${escapeHtml(drawerName(item.drawerId))}</span></td>
                  <td class="text-center">
                    <span class="badge ${stockClass}" style="font-weight: 800; font-size: 0.8rem; padding: 3px 8px;">
                      ${item.quantity <= 0 ? "✕ 0 un." : item.quantity <= 2 ? `⚠ ${item.quantity} un.` : `${item.quantity} un.`}
                    </span>
                  </td>
                  <td class="text-left" style="font-weight: 800; color: #f59e0b; font-size: 0.95rem;">${brl(item.price)}</td>
                  <td class="text-center">
                    <span class="badge" style="background: ${item.status === "Ativo" ? "rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);" : "rgba(100, 116, 139, 0.18); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3);"} font-size: 0.72rem; padding: 2px 7px;">
                      ${escapeHtml(item.status)}
                    </span>
                  </td>
                  <td class="text-center">
                    <div style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                      <button class="btn ghost" style="padding: 4px 8px; min-height: 30px; font-size: 0.78rem; font-weight: 700;" data-action="editProduct" data-id="${item.id}">Editar</button>
                      <button class="btn warn" style="padding: 4px 8px; min-height: 30px; font-size: 0.78rem; font-weight: 700; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff;" data-action="entryFor" data-id="${item.id}">+ Entrada</button>
                      <button class="btn danger" style="padding: 4px 8px; min-height: 30px; font-size: 0.78rem; font-weight: 700;" data-action="exitFor" data-id="${item.id}">- Saída</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const cardsHtml = `
    <div class="mobile-only">
      <div class="products-cards">
        ${products.map((item) => {
          const stockClass = item.quantity <= 0 ? "out" : item.quantity <= 2 ? "low" : "";
          const isChecked = selectedProductIds.includes(item.id);
          
          return `
            <div class="product-mobile-card ${item.status === "Inativo" ? "inactive" : ""}" style="${isChecked ? "border-color: #f97316; background: rgba(249, 115, 22, 0.04);" : ""}">
              <div class="card-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${selectable ? `<input type="checkbox" class="row-check" value="${item.id}" ${isChecked ? "checked" : ""} style="width: 18px; height: 18px; cursor: pointer;" />` : ""}
                  <span class="product-id">${escapeHtml(item.internalId)}</span>
                </div>
                <span class="badge" style="background: ${item.status === "Ativo" ? "rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);" : "rgba(100, 116, 139, 0.18); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3);"} font-size: 0.72rem; padding: 2px 7px;">${escapeHtml(item.status)}</span>
              </div>
              
              <div class="card-body">
                <div class="card-image">
                  ${item.imageUrl ? `
                    <img src="${escapeHtml(item.imageUrl)}" />
                  ` : `
                    <div class="no-image">Sem foto</div>
                  `}
                </div>
                <div class="card-info">
                  <h3>${escapeHtml(item.name)}</h3>
                  <div class="info-row">
                    <span class="info-label">Cód. Fab:</span>
                    <span class="info-value" style="font-family: monospace;">${escapeHtml(item.manufacturerCode)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Categoria:</span>
                    <span class="badge-category" style="font-size: 0.72rem; padding: 1px 6px;">${escapeHtml(categoryName(item.categoryId))}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Gaveta:</span>
                    <span class="badge-drawer" style="font-size: 0.72rem; padding: 1px 6px;">${escapeHtml(drawerName(item.drawerId))}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-footer">
                <div class="card-stats">
                  <span class="badge ${stockClass}" style="font-weight: 800; font-size: 0.82rem; padding: 4px 10px;">
                    Estoque: ${item.quantity} un.
                  </span>
                  <span class="price-tag">${brl(item.price)}</span>
                </div>
                <div class="card-actions">
                  <button class="btn ghost" data-action="editProduct" data-id="${item.id}">Editar</button>
                  <button class="btn warn" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff;" data-action="entryFor" data-id="${item.id}">+ Entrada</button>
                  <button class="btn danger" data-action="exitFor" data-id="${item.id}">- Saída</button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  return tableHtml + cardsHtml;
}

function entriesView() {
  return `
    ${pageHead("Entradas", "Toda entrada aumenta a quantidade disponível.", `<button class="btn primary" data-action="newEntry">Registrar entrada</button>`)}
    <section class="panel">${logTable(state.entries, "entrada")}</section>
  `;
}

function exitsView() {
  return `
    ${pageHead("Saídas e Recibos", "A saída gera recibo obrigatório no mesmo fluxo.", `<button class="btn primary" data-action="newExit">Registrar saída</button>`)}
    <section class="panel">${logTable(state.exits, "saída")}</section>
  `;
}

function logTable(rows, type) {
  if (!rows.length) {
    if (type === "entrada") {
      return emptyState(
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 10 12 15 7 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        "Nenhuma entrada registrada",
        "Registre a primeira entrada de produtos para atualizar o estoque do armário.",
        `<button class="btn primary" data-action="newEntry" style="min-height: 40px; padding: 8px 18px; font-size: 0.9rem;">Registrar Entrada</button>`
      );
    } else {
      return emptyState(
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        "Nenhuma saída registrada",
        "As saídas de ferramentas geram recibos de retirada e assinaturas obrigatórias.",
        `<button class="btn primary" data-action="newExit" style="min-height: 40px; padding: 8px 18px; font-size: 0.9rem;">Registrar Saída</button>`
      );
    }
  }
  const tableHtml = `
    <div class="desktop-only">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Produto</th><th class="text-center">Qtd</th><th>Responsável</th><th>Detalhe</th><th class="text-center">Ações</th></tr></thead>
          <tbody>
            ${rows.map((row) => {
              const product = state.products.find((item) => item.id === row.productId);
              return `
                <tr>
                  <td>${formatDate(row.date)}</td>
                  <td>${escapeHtml(product?.name || "Produto removido")}</td>
                  <td class="text-center" style="font-weight: 700;">${row.quantity}</td>
                  <td>${escapeHtml(row.user || row.responsible || "")}</td>
                  <td>${escapeHtml(row.notes || row.reason || row.destination || "")}</td>
                  <td class="text-center">${type === "saída" || type === "saida" ? `<button class="btn ghost" style="padding: 4px 10px; min-height: 28px; font-size: 0.8rem;" data-action="showReceipt" data-id="${row.receiptId}">Ver Recibo</button>` : "-"}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const cardsHtml = `
    <div class="mobile-only">
      <div class="audit-cards">
        ${rows.map((row) => {
          const product = state.products.find((item) => item.id === row.productId);
          const colorClass = type === "entrada" ? "style='color:#34d399;'" : "style='color:#fca5a5;'";
          const qtyPrefix = type === "entrada" ? "+" : "-";
          
          return `
            <div class="log-mobile-card">
              <div class="log-card-header">
                <span class="log-time">${formatDate(row.date)}</span>
                <span class="badge" style="background: ${type === "entrada" ? "#064e3b; color: #34d399;" : "#4c0519; color: #fca5a5;"}">${type === "entrada" ? "Entrada" : "Saída"}</span>
              </div>
              <div class="log-card-body" style="display: flex; flex-direction: column; gap: 4px;">
                <strong style="font-size: 0.92rem; color: var(--ink);">${escapeHtml(product?.name || "Produto removido")}</strong>
                <div class="info-row">
                  <span class="info-label">${type === "entrada" ? "Registrado por:" : "Responsável:"}</span>
                  <span class="info-value">${escapeHtml(row.user || row.responsible || "")}</span>
                </div>
                ${row.notes || row.reason || row.destination ? `
                  <div class="info-row">
                    <span class="info-label">${type === "entrada" ? "Obs:" : "Motivo/Destino:"}</span>
                    <span class="info-value" style="text-align: right; max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(row.notes || row.reason || row.destination || "")}</span>
                  </div>
                ` : ""}
                
                <div class="card-footer" style="margin-top: 4px; padding-top: 8px; border-top: 1px dashed var(--line); display: flex; justify-content: space-between; align-items: center; flex-direction: row; gap: 0;">
                  <span style="font-weight: 800; font-size: 0.95rem; ${colorClass}">Qtd: ${qtyPrefix}${row.quantity}</span>
                  ${type === "saída" || type === "saida" ? `<button class="btn ghost" style="padding: 4px 10px; min-height: 28px; font-size: 0.8rem; margin: 0;" data-action="showReceipt" data-id="${row.receiptId}">Ver Recibo</button>` : ""}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  return tableHtml + cardsHtml;
}

function reportsView() {
  const filteredEntries = filterReportEntries();
  const filteredExits = filterReportExits();
  const filteredEdits = filterReportEdits();

  // Tables html
  const entriesTableHtml = filteredEntries.length ? `
    <div class="desktop-only">
      <div class="table-wrap" style="max-height: 250px;">
        <table>
          <thead>
            <tr><th>Data</th><th>Produto</th><th class="text-center">Qtd Adicionada</th><th>Usuário</th></tr>
          </thead>
          <tbody>
            ${filteredEntries.map(row => {
              const product = state.products.find(item => item.id === row.productId);
              return `
                <tr>
                  <td>${formatDate(row.date)}</td>
                  <td>${escapeHtml(product?.name || "Produto removido")}</td>
                  <td class="text-center" style="color: #34d399; font-weight: 700;">+${row.quantity}</td>
                  <td>${escapeHtml(row.user || "")}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="mobile-only">
      <div class="audit-cards" style="max-height: 350px; overflow-y: auto; padding-right: 4px;">
        ${filteredEntries.map(row => {
          const product = state.products.find(item => item.id === row.productId);
          return `
            <div class="log-mobile-card">
              <div class="log-card-header">
                <span class="log-time">${formatDate(row.date)}</span>
                <span class="badge" style="background: #064e3b; color: #34d399;">Entrada</span>
              </div>
              <div class="log-card-body" style="display: flex; flex-direction: column; gap: 4px;">
                <strong style="font-size: 0.88rem; color: var(--ink);">${escapeHtml(product?.name || "Produto removido")}</strong>
                <div class="info-row">
                  <span class="info-label">Usuário:</span>
                  <span class="info-value">${escapeHtml(row.user || "")}</span>
                </div>
                <div class="info-row" style="margin-top: 4px; font-weight: 800; color: #34d399;">
                  <span>Qtd:</span>
                  <span>+${row.quantity}</span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  ` : `<p style="color: var(--muted); padding: 10px 0;">Nenhuma entrada no período.</p>`;

  const exitsTableHtml = filteredExits.length ? `
    <div class="desktop-only">
      <div class="table-wrap" style="max-height: 250px;">
        <table>
          <thead>
            <tr><th>Data</th><th class="text-center">Recibo</th><th>Produto</th><th class="text-center">Qtd Retirada</th><th>Responsável</th><th>Motivo</th></tr>
          </thead>
          <tbody>
            ${filteredExits.map(row => {
              const product = state.products.find(item => item.id === row.productId);
              return `
                <tr>
                  <td>${formatDate(row.date)}</td>
                  <td class="text-center"><button class="btn ghost" style="padding: 2px 6px; min-height: 24px; font-size: 0.75rem;" data-action="showReceipt" data-id="${row.receiptId}">${row.receiptId ? "Ver Recibo" : "-"}</button></td>
                  <td>${escapeHtml(product?.name || "Produto removido")}</td>
                  <td class="text-center" style="color: #fca5a5; font-weight: 700;">-${row.quantity}</td>
                  <td>${escapeHtml(row.responsible || "")}</td>
                  <td>${escapeHtml(row.notes || row.reason || "")}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="mobile-only">
      <div class="audit-cards" style="max-height: 350px; overflow-y: auto; padding-right: 4px;">
        ${filteredExits.map(row => {
          const product = state.products.find(item => item.id === row.productId);
          return `
            <div class="log-mobile-card">
              <div class="log-card-header">
                <span class="log-time">${formatDate(row.date)}</span>
                <span class="badge" style="background: #4c0519; color: #fca5a5;">Saída</span>
              </div>
              <div class="log-card-body" style="display: flex; flex-direction: column; gap: 4px;">
                <strong style="font-size: 0.88rem; color: var(--ink);">${escapeHtml(product?.name || "Produto removido")}</strong>
                <div class="info-row">
                  <span class="info-label">Responsável:</span>
                  <span class="info-value">${escapeHtml(row.responsible || "")}</span>
                </div>
                ${row.notes || row.reason ? `
                  <div class="info-row">
                    <span class="info-label">Motivo:</span>
                    <span class="info-value" style="text-align: right; max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(row.notes || row.reason || "")}</span>
                  </div>
                ` : ""}
                <div class="card-footer" style="margin-top: 4px; padding-top: 8px; border-top: 1px dashed var(--line); display: flex; justify-content: space-between; align-items: center; flex-direction: row; gap: 0;">
                  <span style="font-weight: 800; color: #fca5a5;">Qtd: -${row.quantity}</span>
                  ${row.receiptId ? `<button class="btn ghost" style="padding: 2px 6px; min-height: 24px; font-size: 0.75rem; margin: 0;" data-action="showReceipt" data-id="${row.receiptId}">Ver Recibo</button>` : ""}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  ` : `<p style="color: var(--muted); padding: 10px 0;">Nenhuma saída no período.</p>`;

  const editsTableHtml = filteredEdits.length ? `
    <div class="desktop-only">
      <div class="table-wrap" style="max-height: 250px;">
        <table>
          <thead>
            <tr><th>Data</th><th>Usuário</th><th>Ação / Edição</th></tr>
          </thead>
          <tbody>
            ${filteredEdits.map(row => {
              return `
                <tr>
                  <td>${formatDate(row.date)}</td>
                  <td style="font-weight: 600; color: var(--accent);">${escapeHtml(row.user)}</td>
                  <td>${escapeHtml(row.action)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="mobile-only">
      <div class="audit-cards" style="max-height: 350px; overflow-y: auto; padding-right: 4px;">
        ${filteredEdits.map(row => {
          return `
            <div class="log-mobile-card">
              <div class="log-card-header">
                <span class="log-time">${formatDate(row.date)}</span>
                <span class="badge" style="background: #1e293b; color: #38bdf8;">Edição</span>
              </div>
              <div class="log-card-body" style="display: flex; flex-direction: column; gap: 4px;">
                <p style="font-size: 0.82rem; color: var(--ink); margin-bottom: 2px;">${escapeHtml(row.action)}</p>
                <div class="info-row" style="margin-top: 4px; border-top: 1px dashed var(--line); padding-top: 4px;">
                  <span class="info-label">Usuário:</span>
                  <span class="info-value" style="color: var(--accent);">${escapeHtml(row.user)}</span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  ` : `<p style="color: var(--muted); padding: 10px 0;">Nenhuma edição de ferramenta registrada no período.</p>`;

  return `
    ${pageHead("Relatórios", "Visualize as movimentações e edições ocorridas no período.", `<button class="btn primary" data-action="printReports">Exportar PDF</button>`)}
    <section class="panel" style="overflow-y: auto; max-height: calc(100vh - 200px); display: flex; flex-direction: column; gap: 14px;">
      <div class="grid-3 no-print" style="margin-bottom: 10px;">
        <div class="field"><label>Período inicial</label><input type="date" id="reportStart" value="${state.reportStart || ""}"></div>
        <div class="field"><label>Período final</label><input type="date" id="reportEnd" value="${state.reportEnd || ""}"></div>
        <div class="field"><label>Categoria</label>${categorySelect("reportCategory", state.reportCategory || "")}</div>
      </div>
      
      <h3 style="margin-top: 10px; font-size: 1.05rem; font-weight: 800; border-bottom: 2px solid var(--line); padding-bottom: 6px;">Entradas no Período</h3>
      ${entriesTableHtml}
      
      <h3 style="margin-top: 14px; font-size: 1.05rem; font-weight: 800; border-bottom: 2px solid var(--line); padding-bottom: 6px;">Saídas no Período</h3>
      ${exitsTableHtml}
      
      <h3 style="margin-top: 14px; font-size: 1.05rem; font-weight: 800; border-bottom: 2px solid var(--line); padding-bottom: 6px;">Edições e Cadastros de Ferramentas</h3>
      ${editsTableHtml}
    </section>
  `;
}

function filterReportEntries() {
  return filterListByDateAndCategory(state.entries, "date");
}

function filterReportExits() {
  return filterListByDateAndCategory(state.exits, "date");
}

function filterReportEdits() {
  const editsList = state.audit.filter(item =>
    item.action.startsWith("Produto editado:") ||
    item.action.startsWith("Produto cadastrado:")
  );
  return filterListByDateAndCategory(editsList, "date");
}

function filterListByDateAndCategory(list, dateField) {
  const startVal = state.reportStart || "";
  const endVal = state.reportEnd || "";
  const categoryVal = state.reportCategory || "";

  let filtered = list;

  if (startVal) {
    const startDate = new Date(startVal + "T00:00:00");
    filtered = filtered.filter(item => new Date(item[dateField]) >= startDate);
  }
  if (endVal) {
    const endDate = new Date(endVal + "T23:59:59");
    filtered = filtered.filter(item => new Date(item[dateField]) <= endDate);
  }
  if (categoryVal) {
    filtered = filtered.filter(item => {
      let productId = item.productId;
      if (!productId && item.action) {
        const match = item.action.match(/(?:editado|cadastrado|Entrada registrada|Saída finalizada|Saida finalizada):\s*([A-Z0-9-]+)/);
        if (match) {
          const code = match[1];
          const prod = state.products.find(p => p.internalId === code || p.manufacturerCode === code);
          return prod?.categoryId === categoryVal;
        }
        return false;
      }
      const prod = state.products.find(p => p.id === productId);
      return prod?.categoryId === categoryVal;
    });
  }
  return filtered;
}

function auditView() {
  const visibleAudit = state.audit.slice(0, state.auditLimit || 15);
  const hasMore = state.audit.length > visibleAudit.length;
  const auditRowsHtml = visibleAudit.map(renderAuditRow).join("");

  const loadMoreBtnHtml = hasMore ? `
    <div style="text-align: center; margin-top: 20px; border-top: 1.5px solid var(--line); padding-top: 20px;">
      <button class="btn ghost" data-action="loadMoreAudit" style="min-width: 220px; padding: 12px 24px; font-weight: 800; border-color: var(--accent); color: var(--accent);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        Ver Mais (${state.audit.length - visibleAudit.length} registros restantes)
      </button>
    </div>
  ` : "";

  const panelContent = state.audit.length ? `
    <div class="desktop-only">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width: 150px;">Data/Hora</th>
              <th style="width: 120px;">Usuário</th>
              <th style="width: 120px;" class="text-center">Operação</th>
              <th style="width: 90px;" class="text-center">Qtd</th>
              <th>Detalhe</th>
            </tr>
          </thead>
          <tbody>
            ${auditRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
    ${renderAuditMobileCards(visibleAudit)}
    ${loadMoreBtnHtml}
  ` : emptyState(
    `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    "Nenhuma movimentação no histórico",
    "Todas as ações de auditoria, cadastros e saídas do sistema serão mostradas aqui."
  );

  return `
    ${pageHead("Histórico", "Auditoria das operações realizadas no sistema.", `<button class="btn primary" data-action="printAudit">Exportar PDF</button>`)}
    <section class="panel">
      ${panelContent}
    </section>
  `;
}

function categorySelect(id, selected) {
  return `<select id="${id}">${categories.map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.name}</option>`).join("")}</select>`;
}

function drawerSelect(id, selected) {
  return `<select id="${id}">${state.drawers.map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.name}</option>`).join("")}</select>`;
}

function productSelect(id, selected = "") {
  return `<select id="${id}">${state.products.map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.internalId} - ${item.name}</option>`).join("")}</select>`;
}

function openModal(html) {
  document.body.insertAdjacentHTML("beforeend", `<div class="modal"><div class="modal-box">${html}</div></div>`);
  document.body.classList.add("modal-open");
  bindForms();
}

function closeModal() {
  document.querySelector(".modal")?.remove();
  document.body.classList.remove("modal-open");
}

function productForm(product = null) {
  const isEdit = Boolean(product);
  openModal(`
    <form id="productForm">
      <h2>${isEdit ? "Editar Produto" : "Novo Produto"}</h2>
      <input type="hidden" id="productId" value="${product?.id || ""}" />
      <input type="hidden" id="productImageBase64" value="${product?.imageUrl || ""}" />
      <div class="grid-2">
        <div class="field"><label>Nome</label><input id="productName" required value="${escapeHtml(product?.name || "")}"></div>
        <div class="field"><label>Código Fabricante</label><input id="manufacturerCode" required value="${escapeHtml(product?.manufacturerCode || "")}"></div>
        <div class="field"><label>Categoria</label>${categorySelect("categoryId", product?.categoryId || "fresamento")}</div>
        <div class="field"><label>Gaveta</label>${drawerSelect("drawerId", product?.drawerId || "fresamento")}</div>
        <div class="field"><label>Quantidade</label><input id="quantity" type="number" min="0" required value="${product?.quantity ?? 0}"></div>
        <div class="field"><label>Preço de Venda</label><input id="price" type="number" min="0" step="0.01" required value="${product?.price ?? 0}"></div>
        <div class="field"><label>Status</label><select id="status"><option ${product?.status === "Ativo" ? "selected" : ""}>Ativo</option><option ${product?.status === "Inativo" ? "selected" : ""}>Inativo</option></select></div>
        
        <div class="field" style="grid-column: span 2;">
          <label>Foto do Produto</label>
          <input type="file" id="productImageInput" accept="image/*" style="background: transparent; border: none; padding: 0;" />
          <div id="imagePreviewContainer" style="margin-top: 10px;">
            ${product?.imageUrl ? `
              <div style="position: relative; display: inline-block;">
                <img id="productImagePreview" src="${escapeHtml(product.imageUrl)}" style="max-width: 150px; max-height: 150px; border-radius: 8px; border: 1.5px solid var(--line); object-fit: cover;" />
                <button type="button" class="btn danger" id="removeProductImage" style="position: absolute; top: -8px; right: -8px; padding: 2px 6px; font-size: 0.7rem; border-radius: 50%; min-height: unset; height: 24px; width: 24px;">X</button>
              </div>
            ` : `
              <div style="position: relative; display: inline-block;">
                <img id="productImagePreview" style="display: none; max-width: 150px; max-height: 150px; border-radius: 8px; border: 1.5px solid var(--line); object-fit: cover;" />
              </div>
            `}
          </div>
        </div>
      </div>
      <div class="field"><label>Descrição</label><textarea id="description">${escapeHtml(product?.description || "")}</textarea></div>
      <div class="actions">
        <button class="btn primary" type="submit">Salvar</button>
        <button class="btn ghost" type="button" data-action="closeModal">Cancelar</button>
      </div>
    </form>
  `);

  const fileInput = document.getElementById("productImageInput");
  const base64Input = document.getElementById("productImageBase64");
  const previewImg = document.getElementById("productImagePreview");
  const removeBtn = document.getElementById("removeProductImage");

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        base64Input.value = base64;
        previewImg.src = base64;
        previewImg.style.display = "block";

        if (!document.getElementById("removeProductImage")) {
          const container = previewImg.parentElement;
          if (container) {
            container.style.position = "relative";
            container.style.display = "inline-block";
            const btn = document.createElement("button");
            btn.type = "button";
            btn.id = "removeProductImage";
            btn.className = "btn danger";
            btn.style.cssText = "position: absolute; top: -8px; right: -8px; padding: 2px 6px; font-size: 0.7rem; border-radius: 50%; min-height: unset; height: 24px; width: 24px;";
            btn.textContent = "X";
            btn.onclick = () => {
              base64Input.value = "";
              previewImg.src = "";
              previewImg.style.display = "none";
              btn.remove();
              fileInput.value = "";
            };
            container.appendChild(btn);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  });

  if (removeBtn) {
    removeBtn.onclick = () => {
      base64Input.value = "";
      previewImg.src = "";
      previewImg.style.display = "none";
      removeBtn.remove();
      if (fileInput) fileInput.value = "";
    };
  }
}

function drawerForm(drawer = null) {
  openModal(`
    <form id="drawerForm" style="max-width: 400px; width: 100%; display: flex; flex-direction: column; gap: 16px; margin: 0 auto;">
      <h2 style="text-align: center; border-bottom: 2px solid var(--line); padding-bottom: 12px; margin-bottom: 8px;">${drawer ? "Editar Gaveta" : "Nova Gaveta"}</h2>
      <input type="hidden" id="drawerId" value="${drawer?.id || ""}" />
      
      <div class="field">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; display: block;">Nome da Gaveta</label>
        <input id="drawerName" required value="${escapeHtml(drawer?.name || "")}" style="width: 100%;" />
      </div>
      
      <div class="field">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; display: block;">Categoria Padrão</label>
        ${categorySelect("drawerCategoryId", drawer?.categoryId || "diversos")}
      </div>
      
      <div class="actions" style="margin-top: 14px; display: flex; gap: 12px; width: 100%;">
        <button class="btn ghost" type="button" data-action="closeModal" style="flex: 1; min-height: 42px;">Cancelar</button>
        <button class="btn primary" type="submit" style="flex: 1; min-height: 42px;">Salvar</button>
      </div>
    </form>
  `);
}

function entryForm(productId = "") {
  openModal(`
    <form id="entryForm">
      <h2>Registrar Entrada</h2>
      <div class="grid-2">
        <div class="field"><label>Produto</label>${productSelect("entryProductId", productId)}</div>
        <div class="field"><label>Quantidade</label><input id="entryQuantity" type="number" min="1" required value="1"></div>
      </div>
      <div class="field"><label>Observações</label><textarea id="entryNotes"></textarea></div>
      <div class="actions">
        <button class="btn primary" type="submit">Salvar Entrada</button>
        <button class="btn ghost" type="button" data-action="closeModal">Cancelar</button>
      </div>
    </form>
  `);
}

function exitForm(productId = "") {
  openModal(`
    <form id="exitForm">
      <h2>Registrar saída com recibo</h2>
      <div class="grid-2">
        <div class="field"><label>Produto</label>${productSelect("exitProductId", productId)}</div>
        <div class="field"><label>Quantidade</label><input id="exitQuantity" type="number" min="1" required value="1"></div>
        <div class="field"><label>Responsável pela retirada</label><input id="exitResponsible" required></div>
        <div class="field"><label>Destino</label><input id="exitDestination"></div>
      </div>
      <div class="field"><label>Motivo</label><textarea id="exitReason" required></textarea></div>
      <div class="actions">
        <button class="btn primary" type="submit">Gerar saída e recibo</button>
        <button class="btn ghost" type="button" data-action="closeModal">Cancelar</button>
      </div>
    </form>
  `);
}

function bulkForm() {
  const ids = [...document.querySelectorAll(".row-check:checked")].map((item) => item.value);
  if (!ids.length) return showToast("Selecione pelo menos um produto.", "error");
  openModal(`
    <form id="bulkForm">
      <h2>Editar ${ids.length} Produtos em Lote</h2>
      <input type="hidden" id="bulkIds" value="${ids.join(",")}" />
      <div class="grid-3">
        <div class="field"><label>Categoria</label><select id="bulkCategory"><option value="">Não alterar</option>${categories.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}</select></div>
        <div class="field"><label>Gaveta</label><select id="bulkDrawer"><option value="">Não alterar</option>${state.drawers.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}</select></div>
        <div class="field"><label>Status</label><select id="bulkStatus"><option value="">Não alterar</option><option>Ativo</option><option>Inativo</option></select></div>
        <div class="field"><label>Somar quantidade</label><input id="bulkQuantity" type="number" value="0"></div>
        <div class="field"><label>Reajuste preço (%)</label><input id="bulkPrice" type="number" step="0.01" value="0"></div>
      </div>
      <div class="actions">
        <button class="btn primary" type="submit">Aplicar em massa</button>
        <button class="btn ghost" type="button" data-action="closeModal">Cancelar</button>
      </div>
    </form>
  `);
}

function receiptModal(receiptId) {
  const receipt = state.receipts.find((item) => item.id === receiptId);
  if (!receipt) return;
  const product = state.products.find((item) => item.id === receipt.productId);
  openModal(`
    <div class="receipt">
      <h2 style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a252f; padding-bottom: 10px;">RECIBO DE RETIRADA</h2>
      <p><strong>Número do Recibo:</strong> ${receipt.number}</p>
      <p><strong>Data/Hora:</strong> ${formatDate(receipt.date)}</p>
      <p><strong>Produto:</strong> ${escapeHtml(product?.name || "")} (${escapeHtml(product?.internalId || "")})</p>
      <p><strong>Quantidade:</strong> ${receipt.quantity}</p>
      <p><strong>Valor Unitário:</strong> ${brl(receipt.price)}</p>
      <p><strong>Valor Total:</strong> ${brl(receipt.price * receipt.quantity)}</p>
      <p><strong>Destinatário / Destino:</strong> ${escapeHtml(receipt.destination || "-")}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(receipt.reason)}</p>
      <div class="signature" style="margin-top: 50px; text-align: center;">
        <div style="border-bottom: 1px solid #000; width: 260px; margin: 0 auto 8px auto;"></div>
        Responsável pela Retirada: <strong>${escapeHtml(receipt.responsible)}</strong>
      </div>
    </div>
    <div class="actions no-print" style="margin-top: 16px;">
      <button class="btn primary" data-action="printReceipt" data-id="${receipt.id}">Exportar PDF</button>
      <button class="btn ghost" data-action="closeModal">Fechar</button>
    </div>
  `);
}

function bindGlobalEvents() {
  if (!window.globalEventsBound) {
    document.addEventListener("click", (event) => {
      const backdropEl = event.target.closest(".sidebar-backdrop");
      if (backdropEl) {
        const shellEl = document.querySelector(".app-shell");
        if (shellEl) {
          shellEl.classList.remove("sidebar-open");
        }
        return;
      }
      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        handleAction(actionButton.dataset.action, actionButton.dataset.id);
        return;
      }
      const viewButton = event.target.closest("[data-view]");
      if (viewButton) {
        currentView = viewButton.dataset.view;
        localStorage.setItem("ferramentaria_current_view", currentView);
        if (currentView === "cabinet") {
          selectedDrawerId = null;
        }
        const shellEl = document.querySelector(".app-shell");
        if (shellEl) {
          shellEl.classList.remove("sidebar-open");
        }
        app();
        const contentEl = document.querySelector(".content");
        if (contentEl) {
          contentEl.classList.remove("fade-in-view");
          void contentEl.offsetWidth; // Trigger reflow
          contentEl.classList.add("fade-in-view");
        }
        return;
      }
    });
    window.globalEventsBound = true;
  }

  document.getElementById("loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "123") {
      state.loggedIn = true;
      state.user = "admin";
      localStorage.setItem("ferramentaria_user", "admin");
      app();
    } else {
      document.getElementById("loginError").textContent = "Usuario ou senha invalidos.";
    }
  });

  document.getElementById("search")?.addEventListener("input", (event) => {
    state.search = event.target.value;
    app();
  });

  document.getElementById("productCategoryFilter")?.addEventListener("change", (event) => {
    state.productCategoryFilter = event.target.value;
    app();
  });

  document.getElementById("productDrawerFilter")?.addEventListener("change", (event) => {
    state.productDrawerFilter = event.target.value;
    app();
  });

  document.getElementById("productStatusFilter")?.addEventListener("change", (event) => {
    state.productStatusFilter = event.target.value;
    app();
  });

  document.getElementById("productSort")?.addEventListener("change", (event) => {
    state.productSort = event.target.value;
    app();
  });

  document.getElementById("reportCategory")?.addEventListener("change", (event) => {
    state.reportCategory = event.target.value;
    app();
  });

  document.getElementById("reportStart")?.addEventListener("change", (event) => {
    state.reportStart = event.target.value;
    app();
  });

  document.getElementById("reportEnd")?.addEventListener("change", (event) => {
    state.reportEnd = event.target.value;
    app();
  });

  bindForms();
  bindDragDrop();
}

function printReceipt(receiptId) {
  const receipt = state.receipts.find((item) => item.id === receiptId);
  if (!receipt) return;
  const product = state.products.find((item) => item.id === receipt.productId);
  const dateStr = formatDate(receipt.date);
  const printDate = new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Recibo ${receipt.number}</title>
      <style>
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; background: #fff; }
        .container { max-width: 700px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; color: #0f172a; }
        .doc-title { text-align: right; }
        .doc-title h1 { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }
        .doc-title p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; font-weight: 600; }
        .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
        .meta-item { font-size: 13px; }
        .meta-item span { display: block; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .meta-item strong { color: #0f172a; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 12px 14px; text-align: left; font-size: 13px; }
        th { background-color: #f8fafc; font-weight: 700; color: #334155; }
        .total-row { font-weight: 800; font-size: 14px; background-color: #f1f5f9; }
        .terms { font-size: 12px; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 40px; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; text-align: center; }
        .signature-line { border-top: 1px solid #475569; width: 220px; margin: 0 auto 8px auto; padding-top: 8px; font-size: 12px; color: #0f172a; }
        .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 12px; }
        @media print {
          body { margin: 0; padding: 0; }
          .container { border: none; padding: 0; box-shadow: none; max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">JIW Ferramentaria</div>
          <div class="doc-title">
            <h1>RECIBO DE RETIRADA</h1>
            <p>Nº ${receipt.number}</p>
          </div>
        </div>
        
        <div class="section-title">Informações do Recibo</div>
        <div class="grid">
          <div class="meta-item">
            <span>Data / Hora</span>
            <strong>${dateStr}</strong>
          </div>
          <div class="meta-item">
            <span>Emissor</span>
            <strong>${escapeHtml(receipt.user || "admin")}</strong>
          </div>
          <div class="meta-item">
            <span>Responsável pela Retirada</span>
            <strong>${escapeHtml(receipt.responsible)}</strong>
          </div>
          <div class="meta-item">
            <span>Destino da Ferramenta</span>
            <strong>${escapeHtml(receipt.destination || "Não informado")}</strong>
          </div>
        </div>
        
        <div class="section-title">Descrição da Saída</div>
        <div class="meta-item" style="margin-bottom: 20px;">
          <span>Motivo / Justificativa</span>
          <strong style="font-weight: 500; display: block; margin-top: 4px; padding: 10px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">${escapeHtml(receipt.reason)}</strong>
        </div>
        
        <div class="section-title">Item Retirado</div>
        <table>
          <thead>
            <tr>
              <th>ID Interno</th>
              <th>Produto / Descrição</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Preço Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-family: monospace; font-weight: 700; color: #0d9488;">${escapeHtml(product?.internalId || "")}</td>
              <td>
                <strong>${escapeHtml(product?.name || "Produto removido")}</strong>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Cód. Fabricante: ${escapeHtml(product?.manufacturerCode || "")}</div>
              </td>
              <td style="font-weight: 700;">${receipt.quantity} un.</td>
              <td>${brl(receipt.price)}</td>
              <td style="font-weight: 700;">${brl(receipt.price * receipt.quantity)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">VALOR TOTAL:</td>
              <td>${brl(receipt.price * receipt.quantity)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="terms">
          Declaro que recebi a ferramenta acima identificada em perfeito estado de conservação e funcionamento, responsabilizando-me pelo seu uso correto e devolução nas condições exigidas pelas normas de segurança internas.
        </div>
        
        <div class="signatures">
          <div>
            <div class="signature-line">
              <strong>${escapeHtml(receipt.responsible)}</strong>
              <div style="font-size: 10px; color: #64748b;">Responsável pela Retirada</div>
            </div>
          </div>
          <div>
            <div class="signature-line">
              <strong>${escapeHtml(receipt.user || "admin")}</strong>
              <div style="font-size: 10px; color: #64748b;">Emissor</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          Documento gerado pelo Sistema JIW Ferramentaria em ${printDate}
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function printReports() {
  const startVal = state.reportStart || "";
  const endVal = state.reportEnd || "";
  const categoryVal = state.reportCategory || "";
  
  let periodStr = "Todo o período";
  if (startVal && endVal) {
    periodStr = `De ${new Date(startVal + "T00:00:00").toLocaleDateString("pt-BR")} a ${new Date(endVal + "T00:00:00").toLocaleDateString("pt-BR")}`;
  } else if (startVal) {
    periodStr = `A partir de ${new Date(startVal + "T00:00:00").toLocaleDateString("pt-BR")}`;
  } else if (endVal) {
    periodStr = `Até ${new Date(endVal + "T00:00:00").toLocaleDateString("pt-BR")}`;
  }
  
  const categoryStr = categoryVal ? categoryName(categoryVal) : "Todas as categorias";
  
  const filteredEntries = filterReportEntries();
  const filteredExits = filterReportExits();
  const filteredEdits = filterReportEdits();
  
  const printDate = new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const entriesRowsHtml = filteredEntries.length ? filteredEntries.map(row => {
    const product = state.products.find(item => item.id === row.productId);
    return `
      <tr>
        <td>${formatDate(row.date)}</td>
        <td style="font-family: monospace; font-weight: 700;">${escapeHtml(product?.internalId || "")}</td>
        <td><strong>${escapeHtml(product?.name || "Produto removido")}</strong></td>
        <td style="color: #0d9488; font-weight: 700;">+${row.quantity} un.</td>
        <td>${escapeHtml(row.user || "")}</td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">Nenhuma entrada registrada no período selecionado.</td></tr>`;

  const exitsRowsHtml = filteredExits.length ? filteredExits.map(row => {
    const product = state.products.find(item => item.id === row.productId);
    return `
      <tr>
        <td>${formatDate(row.date)}</td>
        <td>${row.receiptId ? `REC-${row.receiptId.slice(-6).toUpperCase()}` : "-"}</td>
        <td style="font-family: monospace; font-weight: 700;">${escapeHtml(product?.internalId || "")}</td>
        <td><strong>${escapeHtml(product?.name || "Produto removido")}</strong></td>
        <td style="color: #be123c; font-weight: 700;">-${row.quantity} un.</td>
        <td>${escapeHtml(row.responsible || "")}</td>
        <td>${escapeHtml(row.notes || row.reason || "")}</td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">Nenhuma saída registrada no período selecionado.</td></tr>`;

  const editsRowsHtml = filteredEdits.length ? filteredEdits.map(row => {
    return `
      <tr>
        <td>${formatDate(row.date)}</td>
        <td><strong style="color: #0369a1;">${escapeHtml(row.user)}</strong></td>
        <td>${escapeHtml(row.action)}</td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="3" style="text-align: center; color: #64748b; padding: 20px;">Nenhuma alteração de ferramenta registrada no período selecionado.</td></tr>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Estoque - JIW</title>
      <style>
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; color: #0f172a; }
        .doc-title { text-align: right; }
        .doc-title h1 { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }
        .doc-title p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; font-weight: 600; }
        .filters { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 30px; font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .filters span { font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 10px; display: block; }
        .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.05em; margin-top: 30px; margin-bottom: 12px; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 12px; }
        th { background-color: #f8fafc; font-weight: 700; color: #334155; }
        .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 12px; page-break-inside: avoid; }
        @media print {
          body { margin: 0; padding: 0; }
          .section-title { page-break-after: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">JIW Ferramentaria</div>
        <div class="doc-title">
          <h1>Relatório de Movimentações</h1>
          <p>Gerado em ${printDate}</p>
        </div>
      </div>
      
      <div class="filters">
        <div>
          <span>Período</span>
          <strong>${periodStr}</strong>
        </div>
        <div>
          <span>Categoria</span>
          <strong>${categoryStr}</strong>
        </div>
      </div>
      
      <div class="section-title">Entradas Registradas</div>
      <table>
        <thead>
          <tr>
            <th style="width: 130px;">Data/Hora</th>
            <th style="width: 100px;">ID Interno</th>
            <th>Produto</th>
            <th style="width: 120px;">Qtd Adicionada</th>
            <th style="width: 100px;">Usuário</th>
          </tr>
        </thead>
        <tbody>
          ${entriesRowsHtml}
        </tbody>
      </table>
      
      <div class="section-title">Saídas Registradas</div>
      <table>
        <thead>
          <tr>
            <th style="width: 130px;">Data/Hora</th>
            <th style="width: 100px;">Nº Recibo</th>
            <th style="width: 100px;">ID Interno</th>
            <th>Produto</th>
            <th style="width: 110px;">Qtd Retirada</th>
            <th style="width: 110px;">Responsável</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          ${exitsRowsHtml}
        </tbody>
      </table>
      
      <div class="section-title">Cadastros e Edições de Produtos</div>
      <table>
        <thead>
          <tr>
            <th style="width: 130px;">Data/Hora</th>
            <th style="width: 110px;">Usuário</th>
            <th>Ação / Edição</th>
          </tr>
        </thead>
        <tbody>
          ${editsRowsHtml}
        </tbody>
      </table>
      
      <div class="footer">
        Relatório Oficial de Estoque - JIW Ferramentaria
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function printAudit() {
  const auditRowsHtml = state.audit.map(item => {
    const dateObj = new Date(item.date);
    const dateStr = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `
      <tr>
        <td>${dateStr} ${timeStr}</td>
        <td><strong style="color: #0f766e;">${escapeHtml(item.user)}</strong></td>
        <td>${escapeHtml(item.action)}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="3" style="text-align: center; color: #64748b; padding: 20px;">Nenhum registro de auditoria disponível.</td></tr>`;

  const printDate = new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Histórico de Auditoria - JIW</title>
      <style>
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; color: #0f172a; }
        .doc-title { text-align: right; }
        .doc-title h1 { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }
        .doc-title p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 12px; }
        th { background-color: #f8fafc; font-weight: 700; color: #334155; }
        .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 12px; }
        @media print {
          body { margin: 0; padding: 0; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">JIW Ferramentaria</div>
        <div class="doc-title">
          <h1>Histórico de Auditoria</h1>
          <p>Gerado em ${printDate}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 150px;">Data/Hora</th>
            <th style="width: 120px;">Usuário</th>
            <th>Operação / Ação Registrada</th>
          </tr>
        </thead>
        <tbody>
          ${auditRowsHtml}
        </tbody>
      </table>
      
      <div class="footer">
        Histórico Completo de Auditoria do Sistema - JIW Ferramentaria
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function handleAction(action, id) {
  const product = state.products.find((item) => item.id === id);
  const drawer = state.drawers.find((item) => item.id === id);
  const actions = {
    logout: () => {
      openModal(`
        <div style="width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 18px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(239, 68, 68, 0.35); box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </div>
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 6px;">Confirmar Saída</h2>
            <p style="color: var(--muted); font-size: 0.92rem; line-height: 1.5;">Tem certeza de que deseja sair do sistema?</p>
          </div>
          <div style="display: flex; gap: 12px; width: 100%; margin-top: 6px;">
            <button class="btn ghost" type="button" data-action="closeModal" style="flex: 1; min-height: 44px; font-weight: 700;">Cancelar</button>
            <button class="btn danger" type="button" data-action="confirmLogout" style="flex: 1; min-height: 44px; font-weight: 800;">Sim, Sair</button>
          </div>
        </div>
      `);
    },
    confirmLogout: () => {
      closeModal();
      state.loggedIn = false;
      state.user = null;
      state.search = "";
      state.productCategoryFilter = "";
      state.productDrawerFilter = "";
      state.productStatusFilter = "";
      state.productSort = "name-asc";
      state.reportStart = "";
      state.reportEnd = "";
      state.reportCategory = "";
      localStorage.removeItem("ferramentaria_user");
      app();
    },
    newProduct: () => productForm(),
    editProduct: () => productForm(product),
    newEntry: () => entryForm(),
    entryFor: () => entryForm(id),
    newExit: () => exitForm(),
    exitFor: () => exitForm(id),
    newDrawer: () => drawerForm(),
    editDrawer: () => drawerForm(drawer),
    deleteDrawer: () => deleteDrawer(id),
    closeModal,
    bulkProducts: bulkForm,
    showReceipt: () => receiptModal(id),
    print: () => window.print(),
    printReceipt: () => printReceipt(id),
    printReports: () => printReports(),
    printAudit: () => printAudit(),
    loadMoreAudit: () => {
      state.auditLimit = (state.auditLimit || 15) + 15;
      app();
    },
    toggleSidebar: () => {
      const shellEl = document.querySelector(".app-shell");
      if (shellEl) {
        shellEl.classList.toggle("sidebar-open");
      }
    },
  };
  actions[action]?.();
}

function bindForms() {
  document.getElementById("productForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("productId").value;
    const payload = {
      name: document.getElementById("productName").value.trim(),
      manufacturerCode: document.getElementById("manufacturerCode").value.trim(),
      categoryId: document.getElementById("categoryId").value,
      drawerId: document.getElementById("drawerId").value,
      quantity: Number(document.getElementById("quantity").value),
      price: Number(document.getElementById("price").value),
      status: document.getElementById("status").value,
      description: document.getElementById("description").value.trim(),
      imageUrl: document.getElementById("productImageBase64").value,
      user: state.user,
    };
    try {
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao salvar produto.");
      }
      await refreshState();
      closeModal();
      app();
      showToast("Produto salvo com sucesso!");
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  document.getElementById("drawerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("drawerId").value;
    const payload = {
      name: document.getElementById("drawerName").value.trim(),
      categoryId: document.getElementById("drawerCategoryId").value,
      user: state.user,
    };
    try {
      const url = id ? `/api/drawers/${id}` : "/api/drawers";
      const method = id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao salvar gaveta.");
      }
      const savedDrawer = await response.json();
      await refreshState();
      if (!id) {
        selectedDrawerId = savedDrawer.id;
      }
      closeModal();
      app();
      showToast("Gaveta salva com sucesso!");
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  document.getElementById("entryForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      productId: document.getElementById("entryProductId").value,
      quantity: Number(document.getElementById("entryQuantity").value),
      notes: document.getElementById("entryNotes").value.trim(),
      user: state.user,
    };
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao registrar entrada.");
      }
      await refreshState();
      closeModal();
      app();
      showToast("Entrada registrada com sucesso!");
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  document.getElementById("exitForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const responsibleName = document.getElementById("exitResponsible").value.trim();
    const payload = {
      productId: document.getElementById("exitProductId").value,
      quantity: Number(document.getElementById("exitQuantity").value),
      responsible: responsibleName,
      destination: document.getElementById("exitDestination").value.trim(),
      reason: document.getElementById("exitReason").value.trim(),
      signatureName: responsibleName,
      user: state.user,
    };
    try {
      const response = await fetch("/api/exits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao registrar saida.");
      }
      const result = await response.json();
      await refreshState();
      closeModal();
      app();
      showToast("Saída registrada e recibo gerado!");
      receiptModal(result.receipt.id);
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  document.getElementById("bulkForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      ids: document.getElementById("bulkIds").value.split(","),
      categoryId: document.getElementById("bulkCategory").value || undefined,
      drawerId: document.getElementById("bulkDrawer").value || undefined,
      status: document.getElementById("bulkStatus").value || undefined,
      quantityDelta: Number(document.getElementById("bulkQuantity").value || 0) || undefined,
      pricePercent: Number(document.getElementById("bulkPrice").value || 0) || undefined,
      user: state.user,
    };
    try {
      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao atualizar produtos em lote.");
      }
      await refreshState();
      closeModal();
      app();
      showToast("Produtos editados em lote com sucesso!");
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  document.getElementById("moveJustificationForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const productIdsStr = document.getElementById("moveProductIds").value;
    const targetDrawerId = document.getElementById("moveTargetDrawerId").value;
    const reason = document.getElementById("moveReason").value.trim();

    if (!reason) {
      return showToast("Por favor, informe a justificativa da movimentação.", "error");
    }

    const ids = productIdsStr.split(",");
    const payload = {
      ids,
      drawerId: targetDrawerId,
      reason,
      user: state.user,
    };

    try {
      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao mover ferramentas.");
      }

      closeModal();
      await refreshState();
      selectedDrawerId = targetDrawerId;
      selectedProductIds = [];
      app();
      showToast("Ferramenta(s) movida(s) com sucesso!");
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  document.getElementById("loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const userEl = document.getElementById("username");
    const passEl = document.getElementById("password");
    const username = userEl ? userEl.value.trim() : "";
    const password = passEl ? passEl.value.trim() : "";

    // Apenas usuario 'ian' com senha 'cacau'
    if (username.toLowerCase() === "ian" && password === "cacau") {
      state.loggedIn = true;
      state.user = "ian";
      localStorage.setItem("ferramentaria_user", "ian");
      app();
      showToast("Bem-vindo, ian!");
    } else {
      const errEl = document.getElementById("loginError");
      if (errEl) {
        errEl.textContent = "Usuário ou senha incorretos.";
      } else {
        showToast("Usuário ou senha incorretos.", "error");
      }
    }
  });
}

function bindDragDrop() {
  document.querySelectorAll(".drawer-metalic").forEach((drawer) => {
    drawer.addEventListener("click", (event) => {
      selectedDrawerId = drawer.dataset.drawerId;
      if (!event.target.closest(".item-chip")) {
        selectedProductIds = []; // Clear selection when clicking drawers
        app();
      }
    });
    drawer.addEventListener("dragover", (event) => {
      event.preventDefault();
      drawer.classList.add("drag-over");
    });
    drawer.addEventListener("dragleave", () => drawer.classList.remove("drag-over"));
    drawer.addEventListener("drop", (event) => {
      event.preventDefault();
      drawer.classList.remove("drag-over");
      moveProduct(event.dataTransfer.getData("text/plain"), drawer.dataset.drawerId);
    });
  });

  document.querySelectorAll(".item-chip").forEach((chip) => {
    chip.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = chip.dataset.productId;
      if (selectedProductIds.includes(id)) {
        selectedProductIds = selectedProductIds.filter(pid => pid !== id);
        chip.classList.remove("selected");
      } else {
        selectedProductIds.push(id);
        chip.classList.add("selected");
      }
    });

    chip.addEventListener("dragstart", (event) => {
      const id = chip.dataset.productId;
      if (selectedProductIds.includes(id)) {
        event.dataTransfer.setData("text/plain", selectedProductIds.join(","));
      } else {
        event.dataTransfer.setData("text/plain", id);
      }
    });
  });
}

function moveJustificationModal(toMoveIds, drawerId) {
  const targetDrawer = state.drawers.find(d => d.id === drawerId);
  const productsToMove = toMoveIds.map(id => state.products.find(p => p.id === id)).filter(Boolean);

  if (!productsToMove.length || !targetDrawer) return;

  const itemsListHtml = productsToMove.map(p => `
    <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #0d0e12; border: 1.5px solid var(--line); border-radius: 8px; font-size: 0.88rem;">
      <span><strong style="color: var(--accent); font-family: monospace;">${escapeHtml(p.internalId)}</strong> - ${escapeHtml(p.name)}</span>
      <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; font-size: 0.75rem;">${escapeHtml(drawerName(p.drawerId))}</span>
    </li>
  `).join("");

  openModal(`
    <form id="moveJustificationForm" style="max-width: 520px; width: 100%; display: flex; flex-direction: column; gap: 18px;">
      <div style="border-bottom: 2px solid var(--line); padding-bottom: 12px;">
        <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--ink);">Justificativa de Movimentação</h2>
        <p style="font-size: 0.85rem; color: var(--muted); margin-top: 4px;">Informe o motivo para mover ${productsToMove.length === 1 ? "esta ferramenta" : "estes " + productsToMove.length + " produtos"} para a gaveta <strong style="color: var(--accent);">${escapeHtml(targetDrawer.name)}</strong>.</p>
      </div>

      <input type="hidden" id="moveProductIds" value="${toMoveIds.join(",")}" />
      <input type="hidden" id="moveTargetDrawerId" value="${drawerId}" />

      <div class="field">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
          ${productsToMove.length === 1 ? "Ferramenta a ser movida" : "Ferramentas a serem movidas"}
        </label>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; max-height: 160px; overflow-y: auto;">
          ${itemsListHtml}
        </ul>
      </div>

      <div class="field">
        <label style="font-weight: 700; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; display: block;">
          Justificativa da Mudança <span style="color: var(--danger);">*</span>
        </label>
        <textarea id="moveReason" required placeholder="Ex: Organização por tipo de usinagem, gaveta cheia, realocação de seção..." style="min-height: 90px;"></textarea>
      </div>

      <div class="actions" style="margin-top: 8px; display: flex; gap: 12px;">
        <button class="btn ghost" type="button" data-action="closeModal" style="flex: 1; min-height: 42px;">Cancelar</button>
        <button class="btn primary" type="submit" style="flex: 1; min-height: 42px;">Confirmar Movimentação</button>
      </div>
    </form>
  `);
}

function moveProduct(productIdsStr, drawerId) {
  const ids = productIdsStr.split(",");
  if (!ids.length) return;

  const toMoveIds = ids.filter(id => {
    const p = state.products.find(item => item.id === id);
    return p && p.drawerId !== drawerId;
  });
  if (!toMoveIds.length) return;

  moveJustificationModal(toMoveIds, drawerId);
}

async function deleteDrawer(id) {
  try {
    const response = await fetch(`/api/drawers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Erro ao excluir gaveta.");
    }
    await refreshState();
    selectedDrawerId = state.drawers[0]?.id;
    app();
    showToast("Gaveta excluída com sucesso!");
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function initApp() {
  try {
    await refreshState();
    const savedUser = localStorage.getItem("ferramentaria_user");
    if (savedUser && savedUser.toLowerCase() === "ian") {
      state.loggedIn = true;
      state.user = "ian";
    } else {
      localStorage.removeItem("ferramentaria_user");
      state.loggedIn = false;
      state.user = null;
    }
    app();
  } catch (err) {
    console.error("Erro ao iniciar aplicativo:", err);
    document.getElementById("app").innerHTML = `
      <section class="login-screen" style="display: flex; align-items: center; justify-content: center; color: white;">
        <div style="background: #18212f; padding: 40px; border-radius: 8px; border: 1px solid var(--line); text-align: center; max-width: 400px; width: 90%;">
          <h2>Erro de Conexão</h2>
          <p style="margin: 20px 0; color: #aab5c3;">Não foi possível conectar ao servidor backend. Por favor, certifique-se de que o servidor está rodando.</p>
          <button class="btn primary" onclick="initApp()" style="width: 100%;">Tentar Novamente</button>
        </div>
      </section>
    `;
  }
}

initApp();
