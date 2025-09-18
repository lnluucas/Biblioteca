const prompt = require("prompt-sync")();
const fs = require('fs');

function carregarDados() {
    try {
        const json = fs.readFileSync('dados.json', 'utf-8');
        return JSON.parse(json);
    } catch {
        return { livros: [], filmes: [], usuarios: [] };
    }
}

function salvarDados(dados) {
    fs.writeFileSync('dados.json', JSON.stringify(dados, null, 2));
}

function mostrarMenu() {
    console.log("\n===== MENU =====");
    console.log("1 - Adicionar Livro");
    console.log("2 - Adicionar Filme");
    console.log("3 - Adicionar Usuário");
    console.log("4 - Listar Livros disponíveis");
    console.log("5 - Listar Filmes disponíveis");
    console.log("6 - Usuário pegar item");
    console.log("7 - Usuário devolver item");
    console.log("8 - Listar itens do usuário");
    console.log("0 - Sair");
}

function listarUsuarios(dados) {
    if (dados.usuarios.length === 0) {
        console.log("Nenhum usuário cadastrado.");
        return false;
    }
    console.log("\n--- Usuários Cadastrados ---");
    dados.usuarios.forEach((u, i) => console.log(`${i + 1} - ${u.nome}`));
    console.log("0 - Cancelar");
    return true;
}

function escolherUsuario(dados) {
    let escolha = parseInt(prompt("Escolha o número do usuário: "));
    if (isNaN(escolha) || escolha < 0 || escolha > dados.usuarios.length) {
        console.log("Número inválido.");
        return null;
    }
    if (escolha === 0) return null;
    return dados.usuarios[escolha - 1];
}

function listarItensDisponiveis(dados, tipo) {
    let disponiveis = tipo === "Livro"
        ? dados.livros.filter(l => !l.emprestado)
        : dados.filmes.filter(f => !f.emprestado);

    if (disponiveis.length === 0) {
        console.log(`Nenhum ${tipo.toLowerCase()} disponível.`);
        return [];
    }

    console.log(`\n--- ${tipo}s disponíveis ---`);
    disponiveis.forEach((item, i) => {
        if (tipo === "Livro") console.log(`${i + 1} - ${item.titulo} (Autor: ${item.autor})`);
        else console.log(`${i + 1} - ${item.titulo} (Diretor: ${item.diretor})`);
    });
    console.log("0 - Cancelar");
    return disponiveis;
}

let opcao;
do {
    mostrarMenu();
    opcao = parseInt(prompt("Escolha: "));
    let dados = carregarDados();

    if (opcao === 1) {
        let titulo = prompt("Título do livro: ");
        let autor = prompt("Autor: ");
        dados.livros.push({ titulo, autor, emprestado: false });
        salvarDados(dados);
        console.log("Livro adicionado com sucesso!");
    } else if (opcao === 2) {
        let titulo = prompt("Título do filme: ");
        let diretor = prompt("Diretor: ");
        dados.filmes.push({ titulo, diretor, emprestado: false });
        salvarDados(dados);
        console.log("Filme adicionado com sucesso!");
    } else if (opcao === 3) {
        let nome = prompt("Nome do usuário: ");
        dados.usuarios.push({ nome, itens: [] });
        salvarDados(dados);
        console.log("Usuário adicionado com sucesso!");
    } else if (opcao === 4) {
        listarItensDisponiveis(dados, "Livro");
    } else if (opcao === 5) {
        listarItensDisponiveis(dados, "Filme");
    } else if (opcao === 6) {
        if (!listarUsuarios(dados)) continue;
        let usuario = escolherUsuario(dados);
        if (!usuario) continue;
        if (usuario.itens.length >= 3) { console.log("Limite de 3 itens atingido!"); continue; }

        let tipoEscolha = prompt("Escolha o tipo de item: 1 para Livro, 2 para Filme: ").trim();
        let tipo = tipoEscolha === "1" ? "Livro" : tipoEscolha === "2" ? "Filme" : null;
        if (!tipo) { console.log("Opção inválida."); continue; }

        let disponiveis = listarItensDisponiveis(dados, tipo);
        if (disponiveis.length === 0) continue;

        let escolhaItem = parseInt(prompt("Escolha o número do item a pegar: "));
        if (isNaN(escolhaItem) || escolhaItem <= 0 || escolhaItem > disponiveis.length) {
            console.log("Número inválido."); continue;
        }

        let item = disponiveis[escolhaItem - 1];
        let itemOriginal = tipo === "Livro"
            ? dados.livros.find(l => l.titulo === item.titulo)
            : dados.filmes.find(f => f.titulo === item.titulo);

        usuario.itens.push({ ...itemOriginal, tipo });
        itemOriginal.emprestado = true;
        salvarDados(dados);
        console.log(`"${itemOriginal.titulo}" emprestado para ${usuario.nome}`);
    } else if (opcao === 7) {
        if (!listarUsuarios(dados)) continue;
        let usuario = escolherUsuario(dados);
        if (!usuario) continue;
        if (usuario.itens.length === 0) { console.log("O usuário não tem itens emprestados."); continue; }

        console.log(`\nItens de ${usuario.nome}:`);
        usuario.itens.forEach((i, index) => {
            if (i.tipo === "Livro") console.log(`${index + 1} - ${i.titulo} (Autor: ${i.autor})`);
            else console.log(`${index + 1} - ${i.titulo} (Diretor: ${i.diretor})`);
        });
        console.log("0 - Cancelar");

        let escolhaItem = parseInt(prompt("Escolha o número do item a devolver: "));
        if (isNaN(escolhaItem) || escolhaItem <= 0 || escolhaItem > usuario.itens.length) {
            console.log("Número inválido."); continue;
        }

        let item = usuario.itens[escolhaItem - 1];
        let original = item.tipo === "Livro"
            ? dados.livros.find(l => l.titulo === item.titulo)
            : dados.filmes.find(f => f.titulo === item.titulo);
        if (original) original.emprestado = false;

        usuario.itens.splice(escolhaItem - 1, 1);
        salvarDados(dados);
        console.log(`"${item.titulo}" devolvido por ${usuario.nome}`);
    } else if (opcao === 8) {
        if (!listarUsuarios(dados)) continue;
        let usuario = escolherUsuario(dados);
        if (!usuario) continue;

        console.log(`\nItens de ${usuario.nome}:`);
        if (usuario.itens.length === 0) console.log("Nenhum item.");
        else usuario.itens.forEach(i => {
            if (i.tipo === "Livro") console.log(`- ${i.titulo} (Autor: ${i.autor})`);
            else console.log(`- ${i.titulo} (Diretor: ${i.diretor})`);
        });
    }

} while (opcao !== 0);

console.log("Saindo...");
