const algorithmia = require('algorithmia');
const algorithmiaKey = require('../credenciais/algorithmia.json').apikey;
const sentenceBoundaryDetection = require('sbd');
const watsonApiKey = require('../credenciais/watson-nlu.json').apikey;
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');


    const nlu = new NaturalLanguageUnderstandingV1({
        iam_apikey: watsonApiKey,
        version: '2018-04-05',
        url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
  })

    async function robot (conteudo) {
        await buscarConteudoDaWikipedia(conteudo);
        SanitizarConteudo(conteudo); //Retirar informações desnecessarias
        QuebrarConteudoEmSentencas(conteudo);
        limiteMaximoDeConteudo(conteudo);
        await preencherKeywordsDasSentencas(conteudo);

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
            
        function limiteMaximoDeConteudo(conteudo) {
            conteudo.sentencas = conteudo.sentencas.slice(0, conteudo.sentecasMaxima)
        }
    
        async function preencherKeywordsDasSentencas(conteudo) {
            for(const sentenca of conteudo.sentencas) {
                sentenca.keywords = await pergunteAoWatsonERetorneKeywords(sentenca.text)
            }
        }
        
        async function pergunteAoWatsonERetorneKeywords(sentenca) {
            return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentenca,
                features: {
                    keywords: {}
                },
                language: 'en'
            },
            (error, response) => {
                if(error) {
                throw error
                }
            const keywords = response.keywords.map((keyword) => {
                return keyword.text
            })
                resolve(keywords)    
              
            })
        })
    }   
}

module.exports = robot;       
        
        
        
        