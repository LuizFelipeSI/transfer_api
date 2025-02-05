const express = require("express")
const axios = require("axios")
const { Usuario, Transferencia } = require("../models")
const { sequelize } = require("../database")

const router = express.Router()

router.post("/", async (req, res) => {
    const { value, payer, payee, senha } = req.body

    try {
        const remetente = await Usuario.findByPk(payer)
        const destinatario = await Usuario.findByPk(payee)

        if (!remetente || !destinatario) {
            return res.status(404).json({ erro: "Usuário(s) não encontrado(s)." })
        }

        if (remetente.tipo === "lojista") {
            return res.status(400).json({ erro: "Lojistas não podem transferir dinheiro." })
        }

        if (remetente.senha !== senha) {
            return res.status(401).json({ erro: "Senha incorreta." })
        }

        if (value <= 0) {
            return res.status(400).json({ erro: "Valor inválido." })
        }

        if (remetente.saldo < value) {
            return res.status(400).json({ erro: "Saldo insuficiente." })
        }

        const resposta = await axios.get("https://util.devi.tools/api/v2/authorize")
        if (resposta.data.status === "success") {
            await sequelize.transaction(async (t) => {
                await remetente.update({ saldo: remetente.saldo - value }, { transaction: t })
                await destinatario.update({ saldo: destinatario.saldo + value }, { transaction: t })
                await Transferencia.create({ valor: value, payerId: payer, payeeId: payee }, { transaction: t })
            })
            res.json({ mensagem: "Transferência realizada com sucesso!" })
        }
    } catch (erro) {
        console.log("Erro na transferência:", erro.message)
        res.status(400).json({ erro: "Transferência não autorizada!" })
    }
})

module.exports = router
