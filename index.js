const readline = require('readline-sync');
function start(){

    const content = {}

    content.procurarTermo = pergunteERetorneOTermoDeBusca();
    content.procurarPrefixo = pergunteERetorneOPrefixo();
    
    function pergunteERetorneOTermoDeBusca(){
        return readline.question('Digite o termo de busca do Wikipedia: ');
    }

    function pergunteERetorneOPrefixo(){
       const prefixos = ['Quem e: ', 'O que e: ', 'A historia de: '];
       const selecionarOIndexDoPrefixo = readline.keyInSelect(prefixos, 'escolha uma opcao: ');
       const selecionarOTextoDoPrefixo = prefixos[selecionarOIndexDoPrefixo];
       return selecionarOTextoDoPrefixo;

    }

    console.log(content);
}

start ()
