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
    const f3