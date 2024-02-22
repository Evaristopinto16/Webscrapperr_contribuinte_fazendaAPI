const exprees = require("express")
const server = require("./server.js")
 


const app = exprees()


app.use(exprees.json())
app.use(exprees.urlencoded({extended: true}))
//"49960962768"
//"Guga*123"
require("./contraller/apiContriller.js")(app)



server(app)






