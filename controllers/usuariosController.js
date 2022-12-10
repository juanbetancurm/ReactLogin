//Traer la información desde modelos
const Usuario = require ("../models/Usuarios");
//Importar la librería de encriptación
const bcryptjs = require("bcryptjs");


exports.crearUsuario = async (req, res) => {
    const {password, email} = req.body;
    try {
        //Revisar que no haya usuarios duplicados
        let usuario = await Usuario.findOne({email});
        if (usuario) {
            return res.status(404).json({msg: "El usuario ya existe"});
        }

        //Al colocar la propiedad "body" se omite un grupo enorme de información que no sería relevante para este caso
        //Crear un nuevo usuario
        usuario = new Usuario(req.body);
        //Hash
        usuario.password = await bcryptjs.hash(password, 10);
        
        //Guardar en la base de datos
        const usuarioAlmacenado = await usuario.save();

        res.json(usuarioAlmacenado);
    
    } catch (error) {
        console.log(error)
    }
};

    