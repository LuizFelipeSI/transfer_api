const express = require("express")
const { Usuario } = require("../models")

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const { nome, email, senha, saldo, tipo } = req.body
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha,
            saldo: saldo || 0,
            tipo,
        })
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", id: novoUsuario.id })
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao criar usuário (CPF/CNPJ ou E-MAIL já existente.).", detalhes: erro.message })
    }
})

router.get("/", async (req, res) => {
    const usuarios = await Usuario.findAll({
        attributes: ["id", "nome", "email", "saldo", "tipo"],
    })
    res.json(usuarios)
})

router.delete("/", async (req, res) => {
    try {
        const { id } = req.body
        const usuarioRemovido = await Usuario.destroy({ where: { id } })

        if (usuarioRemovido) {
            res.json({ mensagem: "Usuário deletado com sucesso!", id })
        } else {
            res.status(404).json({ erro: "Usuário não encontrado." })
        }
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao deletar usuário.", detalhes: erro.message })
    }
})

module.exports = router
