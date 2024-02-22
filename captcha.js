const request = require('request');
const fs = require("fs")
const axios = require('axios');
const rp = require("request-promise")

 

async function sleep(seg){
  return new Promise((resolve, rejects)=>{
    
      setTimeout(function(){
          resolve();

      }, seg * 1000)
  })

 }

 async function curl (options){
  return new Promise((resolve, reject)=>{
    request(options, (err, res, body)=>{
      if(err)
      return reject(err)

      resolve(body)
    })
  })
 }

  
 async function resolve_captcha(JSESSIONID, captchaservlet){

console.log("aqui", captchaservlet)
    return new Promise(async (resolve, reject)=>{

        try {

            const imageUrl = await captchaservlet;
            

            try {
              // Baixa a imagem usando request-promise
              const imageBuffer = await rp({ 
               
                url: imageUrl,
                headers: {
                  'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                  'Accept-Encoding':'gzip, deflate, br',
                  'Accept-Language':'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                  'Cache-Control':'max-age=0',
                 'Connection':'keep-alive',
                  'Cookie':JSESSIONID,
                  'Host':'www.contribuinte.fazenda.pr.gov.br',
                  'Sec-Ch-Ua':'"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                  'Sec-Ch-Ua-Mobile':'?1',
                  'Sec-Ch-Ua-Platform':'Android',
                  'Sec-Fetch-Dest':'document',
                  'Sec-Fetch-Mode':'navigate',
                  'Sec-Fetch-Site':'none',
                  'Sec-Fetch-User':'?1',
                  'Upgrade-Insecure-Requests':1,
                  'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Edg/119.0.0.0'
                  
                },
                 encoding: null});
   
              // Salva a imagem localmente (opcional)

               
              await fs.writeFileSync('captcha.jpg', imageBuffer);
          
              // Faça o que for necessário com o Buffer da imagem
              await console.log('Imagem lida com sucesso!');
            } catch (error) {
              console.error('Erro ao ler a imagem:', error);
            }
      
        let captcha_file = await fs.promises.readFile('./captcha.jpg', {encoding: 'base64'});
       
      let resolve_captcha = await curl({
        method: 'POST',
        url: 'https://2captcha.com/in.php',
        form: {
          key : '609a9d91790bf3314ac8d77c70f2de2c',
          method: "base64",
          body: captcha_file,
          json: true
        }
      })
       
      let resolved_captcha = JSON.parse(resolve_captcha)
      let captcha_id = resolved_captcha.request;
      console.log(captcha_id)

      while(1){
   
        await sleep(10)
      console.log("lendo o captcha")
        let captcha_status = await curl({
          method: 'GET',
          url: `http://2captcha.com/res.php?key=609a9d91790bf3314ac8d77c70f2de2c&action=get&id=${captcha_id}&json=true`,
        })
      
        captcha_status = JSON.parse(captcha_status)
      
        if(captcha_status.status == 1) return   resolve(captcha_status.request)

            if(captcha_status.request |= `CAPCHA_NOT_READY`) return reject(captcha_status.request)
      }

            
        } catch (error) {
            
        }
        
    })



 }

 



module.exports = resolve_captcha