// Configuração fixa do aluno
const CONFIG_ALUNO = {
  turma: "8B",
  numeroChamada: 17,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Dados brutos padronizados do 8º Ano (Array de Objetos) - Dados locais de fallback
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Estado da aplicação na sessão
let pinSessao = "";
let disciplinasAtuais = [];

/**
 * Função para normalizar notas antigas/locais para a escala de 0 a 10
 */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  let notaNum = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);
  if (isNaN(notaNum)) {
    return null;
  }
  if (notaNum > 10 && notaNum <= 100) {
    notaNum = notaNum / 10;
  }
  if (notaNum < 0 || notaNum > 10) {
    return null;
  }
  return notaNum;
}

/**
 * Prepara a estrutura padronizada de disciplinas (locais ou da API)
 */
function prepararDadosEmMemoria(dadosApi) {
  if (dadosApi && Array.isArray(dadosApi.disciplinas) && dadosApi.disciplinas.length > 0) {
    disciplinasAtuais = dadosApi.disciplinas.map(item => {
      const f = Array.isArray(item.faltas) ? item.faltas : [item.faltas_t1, item.faltas_t2, item.faltas_t3];
      return {
        disciplina: item.disciplina,
        tri1: item.tri1 !== undefined ? item.tri1 : item.nota_t1,
        tri2: item.tri2 !== undefined ? item.tri2 : item.nota_t2,
        tri3: item.tri3 !== undefined ? item.tri3 : item.nota_t3,
        faltas: [
          Number(f[0]) || 0,
          Number(f[1]) || 0,
          Number(f[2]) || 0
        ]
      };
    });
  } else {
    disciplinasAtuais = JSON.parse(JSON.stringify(dadosBrutos));
  }
}

/**
 * Renderiza os cards e a tabela com os dados em memória
 */
function construirBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMediasValidas = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let QtdDesempenhoBom = 0;
  let QtdEmAtencao = 0;

  disciplinasAtuais.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let media = null;
    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;
      somaMediasValidas += media;
      qtdDisciplinasComMedia++;
    }

    const f1 = Number(item.faltas[0]) || 0;
    const f2 = Number(item.faltas[1]) || 0;
    const f3 = Number(item.faltas[2]) || 0;
    const somaFaltasDisc = f1 + f2 + f3;
    totalFaltasGeral += somaFaltasDisc;

    let situacaoTexto = "Sem Nota";
    let classeSituacao = "situacao-indisponivel";

    if (media !== null) {
      if (media >= 6.0) {
        situacaoTexto = "Bom";
        classeSituacao = "situacao-bom";
        QtdDesempenhoBom++;
      } else {
        situacaoTexto = "Atenção";
        classeSituacao = "situacao-atencao";
        QtdEmAtencao++;
      }
    }

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    tdDisc.textContent = item.disciplina;
    tr.appendChild(tdDisc);

    const tdT1 = document.createElement("td");
    tdT1.textContent = n1 !== null ? n1.toFixed(1).replace(".", ",") : "-";
    tr.appendChild(tdT1);

    const tdT2 = document.createElement("td");
    tdT2.textContent = n2 !== null ? n2.toFixed(1).replace(".", ",") : "-";
    tr.appendChild(tdT2);

    const tdT3 = document.createElement("td");
    tdT3.textContent = n3 !== null ? n3.toFixed(1).replace(".", ",") : "-";
    tr.appendChild(tdT3);

    const tdMedia = document.createElement("td");
    tdMedia.textContent = media !== null ? media.toFixed(1).replace(".", ",") : "-";
    tr.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = `${f1} / ${f2} / ${f3}`;
    tr.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    tdSit.textContent = situacaoTexto;
    tdSit.className = classeSituacao;
    tr.appendChild(tdSit);

    corpoTabela.appendChild(tr);
  });

  const mediaGeral = qtdDisciplinasComMedia > 0 ? (somaMediasValidas / qtdDisciplinasComMedia) : null;
  document.getElementById("card-media-valor").textContent = mediaGeral !== null ? mediaGeral.toFixed(1).replace(".", ",") : "-";
  document.getElementById("card-faltas-valor").textContent = totalFaltasGeral;
  document.getElementById("card-bom-valor").textContent = QtdDesempenhoBom;
  document.getElementById("card-atencao-valor").textContent = QtdEmAtencao;
  document.getElementById("card-frequencia-valor").textContent = "100%";
}

/**
 * Conecta com a API para abrir o boletim
 */
async function abrirBoletim() {
  const campoPin = document.getElementById("campo-pin");
  const msgStatus = document.getElementById("mensagem-status");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    msgStatus.style.color = "#d63031";
    msgStatus.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgStatus.style.color = "#6c5ce7";
  msgStatus.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgStatus.style.color = "#d63031";
      msgStatus.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgStatus.style.color = "#d63031";
      msgStatus.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgStatus.style.color = "#d63031";
      msgStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const json = await resposta.json();
    pinSessao = pinDigitado;
    campoPin.value = "";

    prepararDadosEmMemoria(json.dados);
    construirBoletim();

    document.getElementById("secao-acesso").style.display = "none";
    document.getElementById("painel-boletim").style.display = "block";
    msgStatus.textContent = "";

  } catch (erro) {
    msgStatus.style.color = "#d63031";
    msgStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

/**
 * Constrói a tabela interativa de edição
 */
function abrirEdicao() {
  const secaoEdicao = document.getElementById("secao-edicao");
  const corpoEdicao = document.getElementById("corpo-edicao");
  const msgErro = document.getElementById("mensagem-erro-edicao");
  
  msgErro.textContent = "";
  corpoEdicao.innerHTML = "";

  disciplinasAtuais.forEach((item, idx) => {
    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    tdDisc.textContent = item.disciplina;
    tr.appendChild(tdDisc);

    const fmtNota = (val) => {
      const n = normalizarNota(val);
      return n !== null ? String(n).replace(".", ",") : "";
    };

    const inputsHtml = `
      <td><input type="text" class="campo-edicao nota-input" data-idx="${idx}" data-field="tri1" value="${fmtNota(item.tri1)}"></td>
      <td><input type="text" class="campo-edicao nota-input" data-idx="${idx}" data-field="tri2" value="${fmtNota(item.tri2)}"></td>
      <td><input type="text" class="campo-edicao nota-input" data-idx="${idx}" data-field="tri3" value="${fmtNota(item.tri3)}"></td>
      <td><input type="text" class="campo-edicao falta-input" data-idx="${idx}" data-fidx="0" value="${item.faltas[0]}"></td>
      <td><input type="text" class="campo-edicao falta-input" data-idx="${idx}" data-fidx="1" value="${item.faltas[1]}"></td>
      <td><input type="text" class="campo-edicao falta-input" data-idx="${idx}" data-fidx="2" value="${item.faltas[2]}"></td>
    `;
    tr.innerHTML += inputsHtml;
    corpoEdicao.appendChild(tr);
  });

  secaoEdicao.style.display = "block";
}

/**
 * Valida a entrada do usuário ao editar notas (0 a 10, ponto/vírgula ou vazio)
 */
function validarNotaDigitada(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { valido: true, valor: null };
  const vNorm = v.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(vNorm)) return { valido: false };
  const num = parseFloat(vNorm);
  if (isNaN(num) || num < 0 || num > 10) return { valido: false };
  return { valido: true, valor: num };
}

/**
 * Valida a entrada do usuário ao editar faltas (inteiro >= 0)
 */
function validarFaltaDigitada(valorStr) {
  const v = valorStr.trim();
  if (!/^\d+$/.test(v)) return { valido: false };
  const num = parseInt(v, 10);
  if (isNaN(num) || num < 0) return { valido: false };
  return { valido: true, valor: num };
}

/**
 * Salva as alterações enviando a estrutura atualizada para a API
 */
async function salvarAlteracoes() {
  const msgErro = document.getElementById("mensagem-erro-edicao");
  msgErro.style.color = "#d63031";
  msgErro.textContent = "";

  const inputs = document.querySelectorAll(".campo-edicao");
  inputs.forEach(i => i.classList.remove("invalido"));

  let possuiErro = false;
  const novasDisciplinas = JSON.parse(JSON.stringify(disciplinasAtuais));

  inputs.forEach(input => {
    const idx = parseInt(input.getAttribute("data-idx"), 10);
    const val = input.value;

    if (input.classList.contains("nota-input")) {
      const field = input.getAttribute("data-field");
      const res = validarNotaDigitada(val);
      if (!res.valido) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        novasDisciplinas[idx][field] = res.valor;
      }
    } else if (input.classList.contains("falta-input")) {
      const fidx = parseInt(input.getAttribute("data-fidx"), 10);
      const res = validarFaltaDigitada(val);
      if (!res.valido) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        novasDisciplinas[idx].faltas[fidx] = res.valor;
      }
    }
  });

  if (possuiErro) {
    msgErro.textContent = "Verifique os campos destacados em vermelho. Digite valores válidos.";
    return;
  }

  msgErro.style.color = "#6c5ce7";
  msgErro.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgErro.style.color = "#d63031";
      msgErro.textContent = "Falha ao salvar as alterações no servidor. Tente novamente.";
      return;
    }

    disciplinasAtuais = novasDisciplinas;
    construirBoletim();
    document.getElementById("secao-edicao").style.display = "none";
    msgErro.textContent = "";
    alert("Dados salvos com sucesso.");

  } catch (erro) {
    msgErro.style.color = "#d63031";
    msgErro.textContent = "Erro de conexão ao salvar os dados. Tente novamente.";
  }
}

// Inicialização dos eventos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const elemTurma = document.getElementById("info-turma");
  const elemChamada = document.getElementById("info-chamada");
  if (elemTurma) elemTurma.textContent = CONFIG_ALUNO.turma;
  if (elemChamada) elemChamada.textContent = CONFIG_ALUNO.numeroChamada;

  const btnEntrar = document.getElementById("btn-entrar");
  if (btnEntrar) btnEntrar.addEventListener("click", abrirBoletim);

  const campoPin = document.getElementById("campo-pin");
  if (campoPin) {
    campoPin.addEventListener("keypress", (e) => {
      if (e.key === "Enter") abrirBoletim();
    });
  }

  const btnAlterar = document.getElementById("btn-alterar-dados");
  if (btnAlterar) btnAlterar.addEventListener("click", abrirEdicao);

  const btnSalvar = document.getElementById("btn-salvar-dados");
  if (btnSalvar) btnSalvar.addEventListener("click", salvarAlteracoes);
});