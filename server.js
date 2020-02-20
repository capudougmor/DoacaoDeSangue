// configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))

//habilitar o body no  express
server.use(express.urlencoded({
    extended: true
}))

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool ({
    user: "postgres",
    password: '@AnaClara021184',
    host: 'localhost',
    port: '5432',
    database: 'doadores'

})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})

//configurar a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro na apresentaçãos dos dados!")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
}) 

server.post("/",function(req, res){
    //pegar os dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios!")
    }
    //colocando os valores no banco de dados 
    const query = 
        `INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("Erro no banco de dados!")

        //fluxo ideal
        return res.redirect("/")
    })

})

// ligar a sevidor e permitir o acesso a porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor com nodemon")
})