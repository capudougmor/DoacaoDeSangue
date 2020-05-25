const Sequelize = require('sequelize')
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
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './donors.sqlite'
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
    const donors = sequelize.define('donors', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    blood: {
        type: Sequelize.STRING
    }
})

//Criar a tabela
//donors.sync({force: true})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})

//configurar a apresentação da pagina
server.get("/", (req, res) =>{
    donors.findAll({order: [['id', 'DESC']]}).then(function(donors){
        res.render('index.html', {donors: donors});
    })
}) 

server.post('/', function(req, res){

    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios!")
    }

    
    donors.create({name, email, blood}).then(function(){
        res.redirect('/')
    }).catch(function(erro){
        res.send("Erro: donors não foi cadastrado com sucesso!" + erro)
    })
})

server.listen(3000, function() {
    console.log("iniciei o servidor na porta 3000")
})