document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formlogin');
    const formCadastro = document.getElementById('formcadastro');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginemail').value;
            const senha = document.getElementById('loginsenha').value;
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

            const user = usuarios.find(u => u.email === email && u.senha === senha);
            if (user) {
                localStorage.setItem('usuarioLogado', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('E-mail ou senha inválidos.');
            }
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('cadastronome').value.trim();
            const email = document.getElementById('cadastroemail').value.trim();
            const senha = document.getElementById('cadastrosenha').value.trim();
            
            if (!nome || !email || !senha) return;

            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            if (usuarios.find(u => u.email === email)) {
                alert('E-mail já cadastrado.');
                return;
            }
            
            usuarios.push({ nome, email, senha });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            alert('Cadastro realizado com sucesso! Faça login.');
            window.location.href = 'login.html';
        });
    }
});