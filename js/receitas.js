let receitas = [
  {
    id: 1,
    nome: "Bolo Luiz Felipe",
    porcaoBase: 8,
    tempo: "1h 30min",
    dificuldade: "Médio",
    imagem: "imagens/Bolo-Luiz-Felipe.jpg",
    ingredientes: [
      { nome: "açúcar (massa)", quantidade: "3 xícaras" },
      { nome: "ovos", quantidade: "4 unidades" },
      { nome: "farinha de trigo", quantidade: "2 xícaras" },
      { nome: "queijo parmesão ralado", quantidade: "50 g" },
      { nome: "leite", quantidade: "700 ml" },
      { nome: "amido de milho (maizena)", quantidade: "1 colher (sopa)" },
      { nome: "margarina ou manteiga", quantidade: "1/2 xícara" },
      { nome: "açúcar (calda)", quantidade: "9 colheres (sopa)" }
    ],
    procedimento: [
      "Coloque as 9 colheres de açúcar em uma forma redonda furada no meio.",
      "Mexa bem até que forme a calda, em fogo médio.",
      "Não se preocupe se ficarem caroços de açúcar, pois depois eles desmancham.",
      "Com o auxílio de uma colher, banhe os lados da forma. Reserve.",
      "Junte todos os outros ingredientes no liquidificador por 3 minutos.",
      "Coloque na forma e leve para assar em banho-maria coberta com papel alumínio em forno médio (cerca de 200°C).",
      "Controle sempre se está durinha a massa com a ajuda de um garfo. Quando estiver quase pronto, retire o papel alumínio e deixe dourar um pouquinho em cima.",
      "Desenforme assim que retirar do forno (cuidado para não se queimar) – melhor ainda quente, senão a calda esfria e pode quebrar o bolo."
    ]
  },
  {
    id: 2,
    nome: "Strogonoff de Frango",
    porcaoBase: 10,
    tempo: "1h",
    dificuldade: "Fácil",
    imagem: "imagens/strogonof.jpg",
    ingredientes: [
      { nome: "peito de frango em cubos", quantidade: "3 unidades" },
      { nome: "alho picado", quantidade: "1 dente" },
      { nome: "sal", quantidade: "a gosto" },
      { nome: "pimenta-do-reino", quantidade: "a gosto" },
      { nome: "cebola picada", quantidade: "1 unidade" },
      { nome: "maionese", quantidade: "2 colheres (sopa)" },
      { nome: "manteiga", quantidade: "1 colher (sopa)" },
      { nome: "ketchup", quantidade: "1/2 copo" },
      { nome: "mostarda", quantidade: "1/3 copo" },
      { nome: "cogumelos", quantidade: "1 copo" },
      { nome: "creme de leite", quantidade: "1 copo" },
      { nome: "batata palha", quantidade: "a gosto" }
    ],
    procedimento: [
      "Em uma panela, misture o frango, o alho, a maionese, o sal e a pimenta.",
      "Em uma frigideira grande, derreta a manteiga e doure a cebola.",
      "Junte o frango temperado até que esteja dourado.",
      "Adicione os cogumelos, o ketchup e a mostarda.",
      "Incorpore o creme de leite e retire do fogo antes de ferver.",
      "Sirva com arroz branco e batata palha."
    ]
  },
  {
    id: 3,
    nome: "Feijoada",
    porcaoBase: 20,
    tempo: "2h 20min",
    dificuldade: "Médio",
    imagem: "imagens/feijoada.jpg",
    ingredientes: [
      { nome: "feijão preto", quantidade: "1 kg" },
      { nome: "carne-seca", quantidade: "100 g" },
      { nome: "orelha de porco", quantidade: "70 g" },
      { nome: "rabo de porco", quantidade: "70 g" },
      { nome: "pé de porco", quantidade: "70 g" },
      { nome: "costelinha de porco", quantidade: "100 g" },
      { nome: "lombo de porco", quantidade: "50 g" },
      { nome: "linguiça paio", quantidade: "100 g" },
      { nome: "linguiça portuguesa", quantidade: "150 g" },
      { nome: "cebola grande picada", quantidade: "2 unidades" },
      { nome: "cebolinha verde picada", quantidade: "1 maço" },
      { nome: "folha de louro", quantidade: "3 unidades" },
      { nome: "alho", quantidade: "6 dentes" },
      { nome: "pimenta-do-reino", quantidade: "a gosto" },
      { nome: "laranja", quantidade: "1 ou 2 unidades" },
      { nome: "cachaça (pinga)", quantidade: "40 ml" },
      { nome: "sal", quantidade: "a gosto" }
    ],
    procedimento: [
      "Coloque as carnes de molho por 36 horas ou mais, trocando a água várias vezes (se for verão, coloque gelo por cima).",
      "Cozinhe passo a passo: primeiro as carnes duras, depois as carnes moles.",
      "Quando estiver mole, coloque o feijão e retire as carnes.",
      "Finalmente tempere o feijão.",
      "Acompanhamentos: couve, arroz branco, laranja, bistecas, farofa, quibebe de abóbora, baião de dois, bacon, torresmo, lingüicinha e caldinho temperado."
    ]
  }
];

const saved = localStorage.getItem('receitasUsuario');
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      receitas = parsed;
    }
  } catch (e) {
    console.warn('Erro ao carregar receitas salvas');
  }
}