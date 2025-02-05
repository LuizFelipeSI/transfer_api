require("dotenv").config()
const express = require("express")
const { sequelize } = require("./database")
const { Usuario, Transferencia } = require("./models")
const usuarioRota = require("./rotas/usuarioRota")
const transferenciaRota = require("./rotas/transferenciaRota")

const app = express()
app.use(express.json())

sequelize.sync({ force: false }).then(() => console.log("Banco de dados pronto!"))

app.use("/usuarios", usuarioRota)
app.use("/transfer", transferenciaRota)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`)
})
