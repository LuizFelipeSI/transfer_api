const { Sequelize, DataTypes } = require("sequelize")
const { sequelize } = require("./database")
const { v4: uuidv4 } = require("uuid")

const Usuario = sequelize.define("Usuario", {
    id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    saldo: { type: DataTypes.FLOAT, defaultValue: 0 },
    tipo: { type: DataTypes.ENUM("usuario", "lojista"), allowNull: false },
})

const Transferencia = sequelize.define("Transferencia", {
    id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
    valor: { type: DataTypes.FLOAT, allowNull: false },
    payerId: { type: DataTypes.UUID, allowNull: false },
    payeeId: { type: DataTypes.UUID, allowNull: false },
})

module.exports = { Usuario, Transferencia }
