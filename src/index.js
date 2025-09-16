const prompt = require("prompt-sync")();

let livros = [];
let filmes = [];
let usuarios = [];

function mostrarMenu() {
    console.log("\n===== MENU =====");
    console.log("1 - Adicionar Livro");
    console.log("2 - Adicionar Filme");
    console.log("3 - Adicionar Usuário");
    console.log("4 - Listar Livros");
    console.log("5 - Listar Filmes");
    console.log("6 - Usuário pegar item");
    console.log("7 - Usuário devolver item");
    console.log("8 - Listar itens do usuário");
    console.log("0 - Sair");
}

let opcao;
do {
    mostrarMenu();
    opcao = parseInt(prompt("Escolha: "));

    if (opcao === 1) {
        let titulo = prompt("Título do livro: ");
        let autor = prompt("Autor: ");
        livros.push({ titulo, autor, emprestado: false });
        console.log(`Livro "${titulo}" adicionado!`);
    }
    else if (opcao === 2) {
        let titulo = prompt("Título do filme: ");
        let diretor = prompt("Diretor: ");
        filmes.push({ titulo, diretor, emprestado: false });
        console.log(`Filme "${titulo}" adicionado!`);
    }
    else if (opcao === 3) {
        let nome = prompt("Nome do usuário: ");
        usuarios.push({ nome, itens: [] });
        console.log(`Usuário "${nome}" adicionado!`);
    }
    else if (opcao === 4) {
        console.log("\n--- Livros ---");
        if (livros.length === 0) {
            console.log("Nenhum livro cadastrado.");
        } else {
            livros.forEach(l =>
                console.log(`${l.titulo} - Autor: ${l.autor} (${l.emprestado ? "Emprestado" : "Disponível"})`)
            );
        }
    }
    else if (opcao === 5) {
        console.log("\n--- Filmes ---");
        if (filmes.length === 0) {
            console.log("Nenhum filme cadastrado.");
        } else {
            filmes.forEach(f =>
                console.log(`${f.titulo} - Diretor: ${f.diretor} (${f.emprestado ? "Emprestado" : "Disponível"})`)
            );
        }
    }
    else if (opcao === 6) {
        let nome = prompt("Nome do usuário: ");
        let usuario = usuarios.find(u => u.nome === nome);
        if (!usuario) {
            console.log("Usuário não encontrado.");
            continue;
        }
        if (usuario.itens.length >= 3) {
            console.log("Limite de 3 itens atingido!");
            continue;
        }
        let tipo = prompt("Livro ou Filme? ");
        let titulo = prompt("Título: ");
        let item;
        if (tipo.toLowerCase() === "livro") {
            item = livros.find(l => l.titulo === titulo);
        } else {
            item = filmes.find(f => f.titulo === titulo);
        }
        if (!item) {
            console.log("Item não encontrado.");
        } else if (item.emprestado) {
            console.log("Item já emprestado.");
        } else {
            item.emprestado = true;
            usuario.itens.push(item);
            console.log(`"${item.titulo}" emprestado para ${usuario.nome}`);
        }
    }
    else if (opcao === 7) {
        let nome = prompt("Nome do usuário: ");
        let usuario = usuarios.find(u => u.nome === nome);
        if (!usuario) {
            console.log("Usuário não encontrado.");
            continue;
        }
        let titulo = prompt("Título do item a devolver: ");
        let item = usuario.itens.find(i => i.titulo === titulo);
        if (!item) {
            console.log("Esse item não está com o usuário.");
        } else {
            item.emprestado = false;
            usuario.itens = usuario.itens.filter(i => i.titulo !== titulo);
            console.log(`"${item.titulo}" devolvido por ${usuario.nome}`);
        }
    }
    else if (opcao === 8) {
        let nome = prompt("Nome do usuário: ");
        let usuario = usuarios.find(u => u.nome === nome);
        if (!usuario) {
            console.log("Usuário não encontrado.");
        } else {
            console.log(`Itens de ${usuario.nome}:`);
            if (usuario.itens.length === 0) console.log("Nenhum item.");
            usuario.itens.forEach(i => console.log("- " + i.titulo));
        }
    }

} while (opcao !== 0);

console.log("Saindo...");

