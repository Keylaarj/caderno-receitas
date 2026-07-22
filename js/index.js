document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  const spanNome = document.getElementById('nomeusuario');
  if (spanNome) spanNome.textContent = `Olá, ${usuarioLogado.nome}`;

  const btnSair = document.getElementById('botaosair');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
    });
  }

  const container = document.getElementById('containercards');
  const btnNova = document.getElementById('botaonovareceita');
  const modal = document.getElementById('criarreceita');
  const btnCancelar = document.getElementById('botaocancelar');
  const formReceita = document.getElementById('formreceita');

  function renderizarCards() {
    const receitas = obterReceitas();
    if (!container) return;
    container.innerHTML = '';

    receitas.forEach(receita => {
      const card = document.createElement('div');
      card.className = 'cards';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="imagemalimento">
            <img src="${receita.imagem || 'imagens/comida.jpeg'}" alt="${receita.nome}">
        </div>
        <div class="alinharverticalmente">
            <div class="conteudo">
                <h1>${receita.nome}</h1>
                <div class="etiquetas">
                    <span class="etiquetatempo">${receita.tempo}</span>
                    <span class="etiquetadificuldade">${receita.dificuldade}</span>
                </div>
            </div>
        </div>
      `;

      card.addEventListener('click', () => {
        localStorage.setItem('receitaAtivaId', receita.id);
        window.location.href = `receita.html?id=${receita.id}`;
      });

      container.appendChild(card);
    });
  }

  if (btnNova) {
    btnNova.addEventListener('click', () => {
      if (formReceita) formReceita.reset();
      if (modal) modal.style.display = 'flex';
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (formReceita) {
    formReceita.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('formnome').value.trim();
      const tempo = document.getElementById('formtempo').value.trim();
      const dificuldade = document.getElementById('formdificuldade').value.trim();
      const porcaoBase = parseInt(document.getElementById('formporcoes').value) || 1;
      const ingText = document.getElementById('formingredientes').value;
      const procText = document.getElementById('formprocedimento').value;
      const fotoFile = document.getElementById('formfoto').files[0];

      const ingredientes = ingText.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const match = line.match(/^(.+?)\s+de\s+(.+)$/i);
          if (match) {
            return { quantidade: match[1].trim(), nome: match[2].trim() };
          }
          return { quantidade: '', nome: line.trim() };
        });

      const procedimento = procText.split('\n').filter(line => line.trim() !== '');
      const receitas = obterReceitas();
      const maxId = receitas.reduce((max, r) => Math.max(max, r.id), 0);

      const novaReceita = {
        id: maxId + 1,
        nome,
        porcaoBase,
        tempo: tempo || '30min',
        dificuldade: dificuldade || 'Fácil',
        imagem: 'imagens/comida.jpeg',
        ingredientes,
        procedimento
      };

      const finalizar = (imgData) => {
        if (imgData) novaReceita.imagem = imgData;
        receitas.push(novaReceita);
        salvarReceitas(receitas);
        if (modal) modal.style.display = 'none';
        renderizarCards();
      };

      if (fotoFile) {
        const reader = new FileReader();
        reader.onload = (event) => finalizar(event.target.result);
        reader.readAsDataURL(fotoFile);
      } else {
        finalizar(null);
      }
    });
  }

  renderizarCards();
});