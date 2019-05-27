const readline = require('readline-sync');
const robots = {
    text: require('./robots/text.js')  
}
async function start() {    
    const conteudo = {
        sentecasMaxima: 7
    }

    conteudo.procurarTermo = ResponderERetornarTermoDoWikipedia ();
    conteudo.prefixo = ResponderERetornarOPrefixo();

    await robots.text(conteudo);

    function ResponderERetornarTermoDoWikipedia() {
        return readline.question ('Digite um termo do Wikipedia: ');

    }
    function ResponderERetornarOPrefixo () {
        const prefixo = ['Quem e? ', 'O que e? ', 'A historia de: '];
        const SelecionarIndiceDoPrefixo = readline.keyInSelect(prefixo, 'Escolha uma opcao: ');
        const SelecionarTextoDoPrefixo = prefixo[SelecionarIndiceDoPrefixo];

        return SelecionarTextoDoPrefixo;
    }
    
    console.log(JSON.stringify(conteudo, null, 4));

}

start ()
