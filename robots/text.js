const algorithmia = require('algorithmia');
const algorithmiaKey = require("../credenciais/algorithmia.json").apiKey;
const sentenceBoundaryDetection = require('sbd');

async function robot (conteudo) {
   await buscarConteudoDaWikipedia(conteudo);
    SanitizarConteudo(conteudo); //Retirar informações desnecessarias
    QuebrarConteudoEmSentencas(conteudo);
   

    async function buscarConteudoDaWikipedia(conteudo) {
        const autenticarAlgorithmia = algorithmia(algorithmiaKey);
        const algoritimoWikipedia = autenticarAlgorithmia.algo('web/WikipediaParser/0.1.2');
        const wikipediaResposta = await algoritimoWikipedia.pipe(conteudo.procurarTermo);
        const conteudoWikipedia = wikipediaResposta.get();
        conteudo.fonteDoConteudoOriginal = conteudoWikipedia.content;
    }
    
        function SanitizarConteudo(conteudo) {
            const tirarLinhasEmBrancoEMarkdown = removerLinhasEmBrancoEMarkdown(conteudo.fonteDoConteudoOriginal);
            const tirarDatas = removerDatas(tirarLinhasEmBrancoEMarkdown);
            
            conteudo.fonteDoConteudoLimpo = tirarDatas;

            function removerLinhasEmBrancoEMarkdown(texto){
               const todasAsLinhas = texto.split('\n');
               
               const tirarLinhasEmBrancoEMarkdown = todasAsLinhas.filter((line) => {
                    if (line.trim().length === 0 || line.trim().startsWith('=')) {
                        return false;
                    }
                    return true;
                })
                return tirarLinhasEmBrancoEMarkdown.join(' ');
            }
        }
            function removerDatas(texto) {
                //Regex inlegivel. By: StackOverFlow mas funciona.
                return texto.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
            }
            
            function QuebrarConteudoEmSentencas(conteudo) {
                conteudo.sentencas = []
                
                const sentencas = sentenceBoundaryDetection.sentences(conteudo.fonteDoConteudoLimpo);
                sentencas.forEach((sentenca) =>{
                    conteudo.sentencas.push({
                        text: sentenca,
                        keywords: [],
                        imagens: []
                    })
                })
                    
                }
            }
    module.exports = robot;