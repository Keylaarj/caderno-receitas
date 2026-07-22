document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let idReceita = parseInt(urlParams.get('id'));

    if (!idReceita) {
        idReceita = parseInt(localStorage.getItem('receitaAtiva') || localStorage.getItem('receitaAtivaId'));
    }

    let listaReceitas = [];
    const salvas = localStorage.getItem('receitasUsuario');
    if (salvas) {
        try { listaReceitas = JSON.parse(salvas); } catch(e){}
    }
    if (!listaReceitas || listaReceitas.length === 0) {
        if (typeof receitas !== 'undefined') {
            listaReceitas = receitas;
        }
    }

    const receita = listaReceitas.find(r => r.id === idReceita);

    if (!receita) {
        window.location.href = 'index.html';
        return;
    }

    const btnVoltar = document.getElementById('botaovoltar');
    const btnEditar = document.getElementById('botaoeditar');
    const btnExcluir = document.getElementById('botaoexcluir');
    const imgEl = document.getElementById('receitaimagem');
    const tituloEl = document.getElementById('receitatitulo');
    const tempoEl = document.getElementById('receitatempo');
    const difEl = document.getElementById('receitadificuldade');
    const selectPorcoes = document.getElementById('seletorporcoes');
    const listaIngredientes = document.getElementById('listaingredientes');
    const listaProcedimento = document.getElementById('listaprocedimento');

    const modal = document.getElementById('modalreceita');
    const formModal = document.getElementById('formreceita');
    const btnCancelar = document.getElementById('botaocancelar');

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (btnExcluir) {
        btnExcluir.addEventListener('click', () => {
            if (confirm(`Deseja realmente excluir a receita "${receita.nome}"?`)) {
                listaReceitas = listaReceitas.filter(r => r.id !== idReceita);
                localStorage.setItem('receitasUsuario', JSON.stringify(listaReceitas));
                localStorage.removeItem(`checklist_receita_${idReceita}`);
                window.location.href = 'index.html';
            }
        });
    }

    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            document.getElementById('formnome').value = receita.nome;
            document.getElementById('formtempo').value = receita.tempo;
            document.getElementById('formdificuldade').value = receita.dificuldade;
            document.getElementById('formporcoes').value = receita.porcaoBase;

            document.getElementById('formingredientes').value = receita.ingredientes
                .map(i => i.quantidade ? `${i.quantidade} de ${i.nome}` : i.nome)
                .join('\n');

            document.getElementById('formprocedimento').value = receita.procedimento.join('\n');

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

    if (formModal) {
        formModal.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('formnome').value.trim();
            const tempo = document.getElementById('formtempo').value.trim();
            const dificuldade = document.getElementById('formdificuldade').value.trim();
            const porcaoBase = parseInt(document.getElementById('formporcoes').value) || 1;
            const ingText = document.getElementById('formingredientes').value.trim();
            const procText = document.getElementById('formprocedimento').value.trim();
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

            const salvarEAtualizar = (imgData) => {
                receita.nome = nome;
                receita.tempo = tempo || '30min';
                receita.dificuldade = dificuldade || 'Médio';
                receita.porcaoBase = porcaoBase;
                receita.ingredientes = ingredientes;
                receita.procedimento = procedimento;
                if (imgData) receita.imagem = imgData;

                const idx = listaReceitas.findIndex(r => r.id === idReceita);
                if (idx !== -1) listaReceitas[idx] = receita;

                localStorage.setItem('receitasUsuario', JSON.stringify(listaReceitas));

                if (modal) modal.style.display = 'none';
                carregarDetalhes();
            };

            if (fotoFile) {
                const reader = new FileReader();
                reader.onload = (event) => salvarEAtualizar(event.target.result);
                reader.readAsDataURL(fotoFile);
            } else {
                salvarEAtualizar(null);
            }
        });
    }

    function parseQuantidade(str) {
        if (!str) return null;
        const matchFrac = str.match(/^(\d+)\/(\d+)$/);
        if (matchFrac) return parseFloat(matchFrac[1]) / parseFloat(matchFrac[2]);
        const matchNum = str.replace(',', '.').match(/[\d.]+/);
        return matchNum ? parseFloat(matchNum[0]) : null;
    }

    function extrairUnidade(str) {
        if (!str) return '';
        return str.replace(/[\d/.,\s]+/, '').trim();
    }

    function formatarQuantidade(num, unidade) {
        if (num === null || isNaN(num)) return '';
        let formattedNum = '';
        const frac = num % 1;

        if (Math.abs(frac) < 0.01) {
            formattedNum = Math.round(num).toString();
        } else if (Math.abs(frac - 0.25) < 0.05) {
            formattedNum = (Math.floor(num) > 0 ? Math.floor(num) + ' ' : '') + '1/4';
        } else if (Math.abs(frac - 0.5) < 0.05) {
            formattedNum = (Math.floor(num) > 0 ? Math.floor(num) + ' ' : '') + '1/2';
        } else if (Math.abs(frac - 0.75) < 0.05) {
            formattedNum = (Math.floor(num) > 0 ? Math.floor(num) + ' ' : '') + '3/4';
        } else if (Math.abs(frac - 0.33) < 0.05) {
            formattedNum = (Math.floor(num) > 0 ? Math.floor(num) + ' ' : '') + '1/3';
        } else if (Math.abs(frac - 0.66) < 0.05) {
            formattedNum = (Math.floor(num) > 0 ? Math.floor(num) + ' ' : '') + '2/3';
        } else {
            formattedNum = num.toFixed(1).replace('.0', '');
        }
        return unidade ? `${formattedNum} ${unidade}` : formattedNum;
    }

    function renderizarIngredientes(porcaoAtual) {
        const fator = porcaoAtual / receita.porcaoBase;
        const checklistSalvo = JSON.parse(localStorage.getItem(`checklist_receita_${receita.id}`) || '{}');
        listaIngredientes.innerHTML = '';

        receita.ingredientes.forEach((ing, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '10px';
            li.style.marginBottom = '8px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `ing_${index}`;
            checkbox.checked = !!checklistSalvo[index];

            const label = document.createElement('label');
            label.htmlFor = `ing_${index}`;
            label.style.cursor = 'pointer';

            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.6';
            }

            checkbox.addEventListener('change', (e) => {
                checklistSalvo[index] = e.target.checked;
                localStorage.setItem(`checklist_receita_${receita.id}`, JSON.stringify(checklistSalvo));
                if (e.target.checked) {
                    label.style.textDecoration = 'line-through';
                    label.style.opacity = '0.6';
                } else {
                    label.style.textDecoration = 'none';
                    label.style.opacity = '1';
                }
            });

            let qtdTexto = ing.quantidade;
            if (ing.quantidade) {
                const numBase = parseQuantidade(ing.quantidade);
                const unidade = extrairUnidade(ing.quantidade);
                if (numBase !== null) {
                    qtdTexto = formatarQuantidade(numBase * fator, unidade);
                }
            }

            label.textContent = `${qtdTexto ? qtdTexto + ' ' : ''}${ing.nome}`;

            li.appendChild(checkbox);
            li.appendChild(label);
            listaIngredientes.appendChild(li);
        });
    }

    function renderizarProcedimentos() {
        listaProcedimento.innerHTML = '';
        receita.procedimento.forEach(passo => {
            const li = document.createElement('li');
            li.style.marginBottom = '10px';
            li.style.lineHeight = '1.5';
            li.textContent = passo;
            listaProcedimento.appendChild(li);
        });
    }

    function carregarDetalhes() {
        tituloEl.textContent = receita.nome;
        tempoEl.textContent = receita.tempo;
        difEl.textContent = receita.dificuldade;
        imgEl.src = receita.imagem || 'imagens/comida.jpeg';

        selectPorcoes.innerHTML = '';
        for (let i = 1; i <= 12; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            selectPorcoes.appendChild(opt);
        }

        const porcaoSalva = localStorage.getItem('porcaoAtual');
        const porcaoInicial = porcaoSalva ? parseInt(porcaoSalva) : receita.porcaoBase;
        selectPorcoes.value = porcaoInicial;

        renderizarIngredientes(porcaoInicial);
        renderizarProcedimentos();

        selectPorcoes.onchange = (e) => {
            const novaPorcao = parseInt(e.target.value);
            localStorage.setItem('porcaoAtual', novaPorcao);
            renderizarIngredientes(novaPorcao);
        };
    }

    carregarDetalhes();
});