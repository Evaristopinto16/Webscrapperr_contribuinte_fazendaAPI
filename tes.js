const puppeteer = require("puppeteer")
const request = require("request")
const captcha = require("./captcha")
const url = require("url")

const key = require("./config.js")


async function sleep(seg){
  return new Promise((resolve, rejects)=>{
    
      setTimeout(function(){
          resolve();

      }, seg * 1000)
  })

 }
 async function k (codigo){
  let site_url = "https://agenciavirtual.light.com.br/Portal/Login_Agencia.aspx";
  let site_key = "6LcLDd8UAAAAAKr1i2M1bsq6c9dg6vAGAmJGAROF"; 
 //let token = await resolve_captcha(site_key, site_url)
//console.log(token)
    let browser = await puppeteer.launch({
        headless: false
      })
      
      let page = await browser.newPage()
      

  
     let header = await page.goto("https://www.contribuinte.fazenda.pr.gov.br/ipva/faces/home", {timeout: 0})
     let  link = page.url()
     const urlString = link
     const parsedUrl = url.parse(urlString)
     const sessionIdRegex = /jsessionid=([^;]+)/;
    const sessionIdMatch = parsedUrl.path.match(sessionIdRegex);
let JSESSIONID = ''
if (sessionIdMatch && sessionIdMatch[1]) {
    const sessionId = await sessionIdMatch[1];
    JSESSIONID = `JSESSIONID=${sessionId}`
    console.log('Session ID:', JSESSIONID);
} else {
    console.log('Session ID não encontrado na URL.');
}

    console.log("tirando sarro")

    
    
    
    await page.waitForSelector('[id="pt1:r1:0:r2:0:ig1:captcha"]', {timeout: 0})
    await sleep(7)

    

  
    await page.type(('[id="pt1:r1:0:r2:0:ig1:it1::content"]'), codigo)

    let captchaservlet = await page.evaluate(()=>{
      return document.getElementById('pt1:r1:0:r2:0:ig1:captcha').src
    })
    await page.waitForSelector('[src="/ipva/captchaservlet"]')
  console.log(captchaservlet)
  await sleep(7)
     let testeCaptcha = await captcha(JSESSIONID, captchaservlet)

    console.log(testeCaptcha)

    await page.type(('[id="pt1:r1:0:r2:0:ig1:it2::content"]'), testeCaptcha)
 

    await page.evaluate(()=> {
      return document.getElementById("pt1:r1:0:r2:0:ig1:b1").click()
    })


    await page.waitForNavigation({timeout: 0})

    await page.waitForSelector('[id="pt1:r1:0:tbCa::db"] > table > tbody > [role="row"]', {timeout: 0})
  

    if(await page.$('[id="d1::popup-container"]' ) || await page.$('[class="p_AFDisabled p_AFBusy x289 xfl p_AFTextOnly"]' ) ){
      
      console.log("tente novamente")

    }else{
 
    await sleep(2)
    let fiterVeiculo = await page.$eval('[id="pt1:r1:0:pgl1"]', result => result.innerText)
    let fiterpagamentoUnica = await page.$eval('[id="pt1:r1:0:pgl19"]', result => result.innerText)
    let fiterpagamentoParcelar = await page.$eval('[id="pt1:r1:0:pgl24"]', result => result.innerText)

    fiterpagamentoParcelar = JSON.stringify(fiterpagamentoParcelar)
    fiterVeiculo = JSON.stringify(fiterVeiculo)
    fiterpagamentoParcelar = JSON.stringify(fiterpagamentoUnica)
    let pagamento = {
      fiterVeiculo,
      fiterpagamentoParcelar,
      fiterpagamentoUnica
    }

    console.log(pagamento)
    return pagamento
  }
    //await page.$eval('[ng-if="solicitacaoController.apresentaConfirmar"]', butao => butao.click())
   // await  page.waitForSelector('#solicitacao > div > div > div:nth-child(3) > h4', {timeout: 0})
    
    //let protocolo = await page.$eval('#solicitacao > div > div > div:nth-child(3) > h4', protocolo => protocolo.innerText)
 
  
 

     await browser.close()

     

}

 
module.exports=  k

