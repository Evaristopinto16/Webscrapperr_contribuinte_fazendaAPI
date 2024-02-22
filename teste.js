const puppeteer = require("puppeteer")
const request = require("request")

const key = require("./config.js")


async function sleep(seg){
  return new Promise((resolve, rejects)=>{
    
      setTimeout(function(){
          resolve();

      }, seg * 1000)
  })

 }

/*
 async function curl(options){
  return new Promise((resolve, rejects)=>{
      request(options, (err, res, body)=>{
        if(err) return rejects(err);
        resolve(body)
      })
  })
  
}

async function resolve_captcha(site_key, site_url){
 return new Promise( async(resolve, rejects)=>{
  //`http://2captcha.com/in.php?key=995726a29558c2a0a0ed4183a409ece3&json=true&method=userrecaptcha&googlekey=${site_key}&pageurl=${site_url}`;
  
  let url = `https://2captcha.com/in.php?key=${key}&json=true&method=userrecaptcha&googlekey=${site_key}&pageurl=${site_url}`;
      let resposta = await curl({
        url: url,
        method: "GET"
      })
      
 //g-recaptcha-response
     // console.log(resposta)
      try {
        resposta = JSON.parse(resposta)

       // console.log(resposta)
        if(resposta.status != 1) return rejects("falha ao obter o ID do captcha")
//onsole.log("aquiiiii", resposta.request)
        let captcha_id = resposta.request;
        while(1){
          await sleep(15)
        console.log("verificando que o capcta esta pronto")
          let resposta2 = await curl({
            url: `http://2captcha.com/res.php?key=${key}&action=get&id=${captcha_id}&json=true`,
            method: "GET"
          });
          resposta2 = JSON.parse(resposta2);
        console.log(resposta2)
          if(resposta2.status == 1) return resolve(resposta2.request)
          if(resposta2.request |= `CAPCHA_NOT_READY`) return rejects(resposta2.request)
        }



      } catch (error) {
        console.log("error")
        rejects(error)
      }
 })
   
}

*/

async function k (){
  let site_url = "https://agenciavirtual.light.com.br/Portal/Login_Agencia.aspx";
  let site_key = "6LcLDd8UAAAAAKr1i2M1bsq6c9dg6vAGAmJGAROF"; 
 //let token = await resolve_captcha(site_key, site_url)
//console.log(token)
    let browser = await puppeteer.launch({
        headless: false
      })
        
      let page = await browser.newPage()
       
     await page.goto("https://servicos.corsan.com.br/#/solicitacao/7/", {timeout: 0})
     
    console.log("tirando sarro")

    await page.waitForSelector('[name="CPF/CNPJ"]', {timeout: 0})

    await page.type('[name="CPF/CNPJ"]', '52574296087')
    await page.type(('[class="input-group"] > [codigo-imovel-input]'), ' 2183452-0')
    await page.$eval('[ng-if="solicitacaoController.apresentaConfirmar"]', butao => butao.click())
    await  page.waitForSelector('#solicitacao > div > div > div:nth-child(3) > h4', {timeout: 0})
    
    let protocolo = await page.$eval('#solicitacao > div > div > div:nth-child(3) > h4', protocolo => protocolo.innerText)

  await sleep(6)

    let resultes
    if(await page.$('[ng-if="solicitacaoController.semRegistros"]')){
      resultes = "Não foi possível encontrar correspondências."

    }else{
       resultes = await page.$eval('#page-top > div.content-principal.ng-scope > div > div > div > div:nth-child(1) > form > div.row.mt20.ng-scope > div.ng-scope > div > table', result => result.innerText
      )

    }
   

 

const matches = resultes.match(/(\d{2}\/\d{4})\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+R\$\s([\d,]+)\s+([A-Za-z]+)\s+(\d+)/);

if (matches) {
  const [_, mesAno, numeroFatura, dataVencimento, valor, situacao, imovel] = matches;
  
 let fatura = {
  MesAno: mesAno,
  NumerodaFatura:numeroFatura,
  DatadeVencimento:dataVencimento,
   Valor: valor,
   Situacao: situacao,
   Imovel: imovel
 }

 console.log({protocolo: protocolo}, fatura)
} else {
  console.log("Não foi possível encontrar correspondências.");
}
    await sleep(20)
   
 

     await browser.close()

     

}

 
k()
