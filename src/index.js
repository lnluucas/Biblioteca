    class Biblioteca{
            constructor(titulo, autor){
                this.titulo = titulo;
                this.autor = autor;
                this.emprestado = false;
            }
            emprestar(){
                if(this.emprestado){                
                    console.log(`O livro "${this.titulo}" já está emprestado.`);
                } else {
                    this.emprestado = true;
                    console.log(`Você emprestou o livro "${this.titulo}".`);
                }       
            }
            devolver(){
                if(this.emprestado){
                    this.emprestado = false;
                    console.log(`Você devolveu o livro "${this.titulo}".`);
                } else {
                    console.log(`O livro "${this.titulo}" não está emprestado.`);
                }
            }                       
            status(){
                const status = this.emprestado ? "emprestado" : "disponível";
                console.log(`O livro "${this.titulo}" de ${this.autor} está ${status}.`);
            }   


    
    }