const Usuario = require("../models/Usuarios");
//libreria encriptación
const bcryptjs = require("bcryptjs");
//libreria token
const jwt = require("jsonwebtoken");
require("dotenv").config({path: "variables.env"});




exports.autenticarUsuario = async (req, res) => {

    const { password, email } = req.body;

    try {
        
        //Revisar que exista el usuario
        let usuario = await Usuario.findOne({ email});

        if (!usuario) {
            return res.status(404).json({msg:"El usuario no existe"});
        }

        //Revisar el password
        const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({msg:"Datos incorrectos"});
        }
        
        //Si todo es correcto: crear token
         const payload = {
            usuario: {id: usuario.id},

        };
        //res.json(payload);
        jwt.sign(
            payload,
            process.env.SECRETA,
            {
                expiresIn: 60, //tiempo en segundos
            },
            (error, token) => {
                if (error) throw error;
                //mensaje de confirmación
                res.json({token});
            }
        )
        


    } catch (error) {
        console.log(error);
    }
}
          
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        res.json({usuario});
    } catch (error) {
        res.status(500).json({msg:"Se produjo un error"});
    }
        
    }