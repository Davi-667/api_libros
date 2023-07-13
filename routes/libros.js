const express = require('express');
const router = express.Router();
const libros = require('../data');
const Joi = require('joi');


const libroSchema = Joi.object({
    titulo: Joi.string().required().label('Título'),
    autor: Joi.string().required().label('Autor'),
    genero: Joi.string().required().label('Género'),
});

//Obtener lista libro

router.get('/', (req, res, next) => {
    try {
        res.json(libros);
    } catch (err) {
        next(err);
    }
});
//Obt. libro por ID
router.get('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const libro = libros.find((l) => libro.id === id);
        if (!libros){
            const error = new Erro ('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        res.json(libro);
    } catch (err) {
        next(err);
    }
});

//Nueva Entrada
router.post('/', (req, res, next) => {
    try {
        const{error, value } = libroSchema.validate(req.body);
        if (error) {
            const validationError = new Error('Error de validación');
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }
        const { titulo, autor, genero } = value;
        const nuevoLibro = {
            id: libros.length + 1,
            titulo,
            autor,
            genero,
        };
        libros.push(nuevoLibro);
        res.status(201).json(nuevoLibro);
        } catch (err) {
            next(err);
        };
});

// Actualizar datos existentes
router.put('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const {error, value} = libroSchema.validate(req.body);
        if (error) {
            const validationError = new Error('Error de Validación');
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }
        const { titulo, autor, genero } = value;
        const libro = libros.find((l) => l.id === id);
        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
            }
            libro.titulo = titulo || libro.titulo;
            libro.autor = autor || libro.autor;
            libro.genero = genero || libro.genero;
            res.json(libro);
        }catch (err) {
            next(err);
        }
});


//eliminar libro
router.delete('/:id', (req,res,next) => {
    try {
        const id = req.params.id;
        const indenx = libros.findIndex((l) => l.id === id);
        if (index === -1) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        const libroEliminado = libros.splice(index, 1);
        res.json(libroEliminado[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;