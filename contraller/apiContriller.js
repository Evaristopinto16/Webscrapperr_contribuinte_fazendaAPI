const api = require("../tes")
async function router (app){

    app.post("/", async (req, res)=>{
        let codigo = req.body.codigo
       //'00588200026'
       codigo = codigo.toString()
         console.log(codigo)

            const result = await api(codigo)

        res.send(result)
    })

     

}

module.exports = app =>{
      router(app)
}