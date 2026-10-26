// Dados brutos padronizados do 8º Ano (Array de Objetos)
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

/**
 * Função para normalizar notas para a escala de 0 a 10
 */
function normalizarNota(valor) {
  // Trata ausência de nota (vazio, null ou undefined)
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte texto com vírgula para número (ex: "7,8" -> 7.8)
  let notaNum = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);

  // Se a conversão falhar (não for um número)
  if (isNaN(notaNum)) {
    return null;
  }

  // Ajusta notas no formato 0-100 para 0-10 (ex: 82 vira 8.2)
  if (notaNum > 10 && notaNum <= 100) {
    notaNum = notaNum / 10;
  }

  // Validação: notas fora de 0 a 10 são inválidas
  if (notaNum < 0 || notaNum > 10) {
    return null;
  }

  return notaNum;
}

/**
 * Função principal para processar e renderizar o boletim
 */
function construirBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

  let somaMediasValidas = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltas