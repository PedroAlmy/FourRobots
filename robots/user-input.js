const readLine = require('readline-sync');

function start() {

    const conteudo = {}

    conteudo.procurarTermo = ResponderERetornarTermoDoWikipedia ();
    conteudo.prefixo = ResponderERetornarOPrefixo();

    function ResponderERetornarTermoDoWikipedia() {
        return readLine.question ('Digite um termo do Wikipedia: ');

    }
    function ResponderERetornarOPrefixo () {
        const prefixo = ["Quem e? ", "O que e? ", "A historia de: "]
    }
    return conteudo;
}