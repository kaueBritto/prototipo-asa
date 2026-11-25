/* Dados de exemplo do protótipo ASA. Nomes de professores, horários de funcionamento, endereço,
   day use (R$ 25) e eventos vêm do Instagram da arena (25/11/2026). Alunos, turmas, vagas,
   movimento e números da gestão são inventados para a demonstração. */

const ASA = (() => {
  const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  // gerador fixo: os mesmos números a cada abertura
  function semente(s) {
    let x = (Math.abs(s) * 7919 + 104729) % 2147483647;
    if (x <= 0) x += 2147483646;
    const prox = () => (x = (x * 16807) % 2147483647) / 2147483647;
    prox(); prox(); // descarta os primeiros, que saem baixos com semente pequena
    return prox;
  }

  const arena = {
    nome: "ASA Beach Tennis",
    nomeLongo: "Arena Schuster Aracaju de Beach Tennis",
    frase: "Os melhores estão aqui.",
    chamada: "Venha ser ASA",
    endereco: "Central Garden · Av. Luciano Barreto Júnior, Aracaju/SE",
    whatsapp: "(79) 99984-6334",
    quadras: 12,
    // horário da ficha do Google (25/11/2026)
    horario: "Seg a sex, 6h às 11h e 15h às 22h · sáb, 7h às 11h e 16h às 22h · dom, 16h às 20h",
    dayUse: 25,
    instagram: "@asabeachtennis",
  };

  const professores = [
    { id: "igor", nome: "Igor Candia", curto: "Igor", cor: "#0b4ac5", foco: "Atleta profissional · alto rendimento" },
    { id: "higor", nome: "Higor Gois", curto: "Higor", cor: "#0a2160", foco: "Fundamentos e base técnica" },
    { id: "lara", nome: "Lara Araujo", curto: "Lara", cor: "#e2672a", foco: "Iniciantes e Team Lara Kids" },
    { id: "raphael", nome: "Raphael", curto: "Raphael", cor: "#12805a", foco: "Estratégia e tática de jogo" },
    { id: "monica", nome: "Monica Candia", curto: "Monica", cor: "#8b3fb8", foco: "Team by Candia" },
    { id: "jvictor", nome: "J. Victor", curto: "J. Victor", cor: "#2f7fd8", foco: "Turmas da manhã" },
    { id: "trator", nome: "José Edenilton “Trator”", curto: "Trator", cor: "#b8402c", foco: "Treino físico na areia" },
  ];
  const prof = (id) => professores.find((p) => p.id === id);

  const NIVEIS = { 1: "Iniciante", 2: "Intermediário", 3: "Avançado", K: "Kids" };

  const nomes = [
    "Ana Clara", "Bruno", "Camila", "Diego", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João Pedro",
    "Karina", "Lucas", "Mariana", "Nathália", "Otávio", "Paula", "Rafael", "Sofia", "Thiago", "Vitória",
    "Beatriz", "Caio", "Débora", "Enzo", "Fernanda", "Gustavo", "Helena", "Igor M.", "Júlia", "Leonardo",
    "Larissa", "Marcelo", "Natan", "Priscila", "Renata", "Samuel", "Tainá", "Vinícius", "Yasmin", "Rodrigo",
    "Carla", "Daniela", "Marina", "Pedro", "Letícia", "André", "Bianca", "Murilo", "Lívia", "Matheus",
  ];
  const cores = ["#0b4ac5", "#e2672a", "#12805a", "#8b3fb8", "#2f7fd8", "#b8402c", "#0a2160", "#c18a1b", "#1b8aa0", "#6b5bd6"];
  const iniciais = (n) => n.replace(/[“”".]/g, "").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const corDe = (n) => cores[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % cores.length];
  const jogadores = nomes.map((n, i) => ({ nome: n, nivel: (i % 7 === 0 ? 3 : i % 3 === 0 ? 1 : 2), cor: corDe(n) }));

  // grade semanal das turmas (segunda a sexta)
  const MODELO = [
    ["07:00", "jvictor", 2], ["07:00", "trator", 3], ["08:00", "jvictor", 1], ["09:00", "monica", 2], ["10:00", "monica", 1],
    ["15:00", "lara", "K"], ["16:00", "lara", "K"], ["17:00", "higor", 1], ["17:00", "raphael", 2], ["18:00", "higor", 1],
    ["18:00", "lara", 1], ["18:00", "raphael", 3], ["19:00", "higor", 2], ["19:00", "igor", 3], ["19:00", "lara", 2],
    ["20:00", "higor", 2], ["20:00", "raphael", 2], ["20:00", "igor", 3], ["21:00", "raphael", 1], ["21:00", "trator", 2],
  ];
  function turmasDoDia(data) {
    const dia = data.getDay();
    if (dia === 0 || dia === 6) return [];
    const r = semente(data.getFullYear() * 400 + data.getMonth() * 32 + data.getDate());
    return MODELO.filter((_, i) => (dia % 2 === 0 ? i % 5 !== 3 : i % 6 !== 4)).map(([hora, p, nivel], i) => {
      const vagas = nivel === "K" ? 10 : 8;
      const noite = hora >= "18:00";
      let confirmados = Math.round(vagas * (noite ? 0.78 + r() * 0.3 : 0.35 + r() * 0.45));
      confirmados = Math.min(vagas, confirmados);
      const espera = confirmados === vagas ? 1 + Math.floor(r() * 3) : 0;
      return { id: `${dia}-${i}`, hora, prof: prof(p), nivel, nomeNivel: NIVEIS[nivel], vagas, confirmados, espera, quadra: 1 + (i % 12) };
    });
  }

  // movimento do dia: alunos em aula + day use + jogos marcados, hora a hora
  function movimento(data) {
    const dia = data.getDay();
    const r = semente(data.getDate() * 97 + data.getMonth() * 13 + 7);
    const fds = dia === 0 || dia === 6;
    const horas = [];
    for (let h = 7; h <= 21; h++) {
      const turmas = turmasDoDia(data).filter((t) => +t.hora.slice(0, 2) === h);
      const aula = turmas.reduce((a, t) => a + t.confirmados, 0);
      let curva = fds
        ? (h >= 8 && h <= 11 ? 0.8 : h >= 15 && h <= 18 ? 0.7 : h >= 19 ? 0.35 : 0.1)
        : (h >= 19 && h <= 21 ? 0.85 : h >= 17 ? 0.5 : h <= 9 ? 0.25 : h <= 11 ? 0.12 : 0.18);
      if (!fds && h >= 12 && h <= 14) curva = 0.04;
      const dayUse = Math.round(curva * (fds ? 30 : 18) * (0.75 + r() * 0.5));
      const jogos = Math.round(curva * (fds ? 4 : 3) * (0.6 + r() * 0.8));
      const pessoas = aula + dayUse + jogos * 4;
      const quadrasOcupadas = Math.min(12, turmas.length + Math.ceil(dayUse / 6) + jogos);
      horas.push({ h, rotulo: `${h}h`, aula, dayUse, jogos, pessoas, quadrasOcupadas, livres: 12 - quadrasOcupadas, fechado: !fds && h >= 11 && h < 15 });
    }
    return horas;
  }

  const jogosAbertos = [
    { hora: "19:00", nivel: 2, quem: "Marina", tipo: "Dupla mista", faltam: 1, ja: ["Marina", "Pedro", "Letícia"] },
    { hora: "20:00", nivel: 1, quem: "Carla", tipo: "Rachão iniciante", faltam: 3, ja: ["Carla", "André", "Bianca", "Murilo", "Lívia"] },
    { hora: "21:00", nivel: 3, quem: "Matheus", tipo: "Jogo puxado", faltam: 2, ja: ["Matheus", "Rodrigo"] },
  ];

  const eventos = [
    { quando: "Sábado", hora: "8h às 12h", titulo: "Play do sábado", texto: "Day use com a areia toda liberada. Os R$ 25 viram consumação no Verano.", tag: "Day use", foto: "img/jogador.jpg" },
    { quando: "Sábado", hora: "19h", titulo: "Pagode na areia", texto: "Jogo de fim de tarde e roda de samba depois. Mesa no Verano por reserva.", tag: "Evento", foto: "img/noite.jpg" },
    { quando: "Sexta", hora: "12h", titulo: "Sexta da feijoada", texto: "Feijoada no Verano para quem sai do treino ou passa para almoçar.", tag: "Verano", foto: "img/turma.jpg" },
  ];

  const torneios = [
    { nome: "Copa ASA 2026", quando: "out–nov 2026", status: "Realizada", texto: "Categorias mistas, gênero e PRO, com a torcida no Verano." },
    { nome: "Open ASA", quando: "agosto", status: "Anual", texto: "Kit oficial para quem paga a inscrição no prazo. Idades, mistas, gênero e PRO." },
    { nome: "ITF World Tour BT100 Sergipe", quando: "jan 2026", status: "Mundial", texto: "A arena recebeu dois BT10 e um BT100 em sequência." },
  ];

  // ---------- utilidades ----------
  const hoje = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const somaDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dataCurta = (d) => `${DIAS_CURTOS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]}`;
  const dataLonga = (d) => `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_LONGOS[d.getMonth()]}`;
  const reais = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: v % 1 ? 2 : 0 });
  const mil = (v) => v.toLocaleString("pt-BR");
  const saudacao = () => { const h = new Date().getHours(); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; };
  // hora "de agora" para o protótipo: no intervalo de almoço (fechado nos dias de semana) vai para as 15h
  const horaAgora = () => {
    const d = new Date();
    let h = Math.min(21, Math.max(7, d.getHours()));
    const fds = d.getDay() === 0 || d.getDay() === 6;
    if (!fds && h >= 11 && h < 15) h = 15;
    return h;
  };

  function avatar(nome, cor) {
    return `<span class="avatar" style="background:${cor || corDe(nome)}">${iniciais(nome)}</span>`;
  }
  function avatares(lista, max = 5) {
    const mostrar = lista.slice(0, max).map((n) => avatar(n)).join("");
    const resto = lista.length - max;
    return `<span class="avatares">${mostrar}${resto > 0 ? `<span class="avatar avatar-mais">+${resto}</span>` : ""}</span>`;
  }
  function nivel(n) {
    if (n === "K") return `<span class="chip chip-sol">Kids</span>`;
    return `<span class="nivel" data-n="${n}" title="${NIVEIS[n]}"><i></i><i></i><i></i></span>`;
  }

  // marca: duas letras A finas e a onda com a bolinha (refeita a partir do logo, só para o protótipo)
  function marca(cor = "currentColor") {
    return `<svg viewBox="0 0 132 40" fill="none" stroke="${cor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-label="ASA">
      <path d="M3 38 L19 3 L35 38"/><path d="M10 25 H28"/>
      <path d="M48 37 C 58 33, 60 22, 64 14 C 66 10, 69 8, 72 7"/>
      <path d="M53 38 C 63 33, 64 23, 68 16 C 70 13, 72 11, 74 10.5" opacity=".7"/>
      <path d="M58 38.5 C 66 34, 68 26, 71 20" opacity=".45"/>
      <circle cx="78" cy="6.5" r="4" fill="${cor}" stroke="none"/>
      <path d="M95 38 L111 3 L127 38"/><path d="M102 25 H120"/>
    </svg>`;
  }

  let avisoTimer;
  function aviso(texto) {
    let el = document.querySelector(".aviso");
    if (!el) { el = document.createElement("div"); el.className = "aviso"; document.body.appendChild(el); }
    el.textContent = texto;
    el.classList.add("mostrar");
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => el.classList.remove("mostrar"), 2600);
  }

  return {
    arena, professores, prof, NIVEIS, jogadores, turmasDoDia, movimento, jogosAbertos, eventos, torneios,
    hoje, somaDias, dataCurta, dataLonga, reais, mil, saudacao, horaAgora, avatar, avatares, nivel, marca, aviso,
    DIAS, DIAS_CURTOS, MESES, iniciais, corDe, semente,
  };
})();
