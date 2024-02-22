
async function server(app){


    try {
        var PORT = 3000
        await app.listen(PORT, ()=>{
            console.log("servidor na PORT", PORT)
        })
    } catch (error) {
        console.log("error ao conectar ao servidor ")
    }
}

module.exports = server