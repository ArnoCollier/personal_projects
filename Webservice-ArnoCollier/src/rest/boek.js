const Router = require('@koa/router'); // 👈 1
const boekService = require('../service/boek');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllBoeken = async (ctx) => {
    const boeken = await boekService.getAll();
    ctx.body=boeken
    }

getAllBoeken.validationScheme = null;

const getBoekPerId = async (ctx) => {
    ctx.body = await boekService.getBoek(Number(ctx.params.id));
    }

getBoekPerId.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
};

const wijzigBoek = async (ctx) => {
    const { id } = ctx.params;
    const { userId } = ctx.state.session;
    const gewijzigdeBoek = await boekService.wijzig({
        ...ctx.request.body,
        id: Number(id),
        auteur_id: userId,
    });
    ctx.body = gewijzigdeBoek;
};


const verwijderBoek = async (ctx) => {  
    const verwijderdBoek = await boekService.deleteBoek(Number(ctx.params.id));
    ctx.body = verwijderdBoek;
};  

const voegBoekToe = async (ctx) => {
    const nieuwBoek = await boekService.create({
        ...ctx.request.body,
        auteur_id: ctx.state.session.userId,
    });
    ctx.body = nieuwBoek;
    ctx.status = 201;
};

verwijderBoek.validationScheme = { 
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
};

voegBoekToe.validationScheme = {    
    body: {
        titel: Joi.string().required(),
        release_datum: Joi.date().iso().max(new Date()),
        isbn: Joi.string().required(),
        taal: Joi.string().required(),
        aantal_paginas: Joi.number().integer().positive(),
        uitgever: Joi.string().required(),
        genre: Joi.string().required(),
    },
};
wijzigBoek.validationScheme = {
   params: Joi.object({
       id: Joi.number().integer().positive(),
   }),
};
     
module.exports = (app) => {
    const router = new Router({ prefix: '/boeken' }); // 👈 2
    router.get('/', getAllBoeken);
    router.get('/:id', getBoekPerId);
    router.post('/', voegBoekToe);
    router.put('/:id', wijzigBoek);
    router.delete('/:id', verwijderBoek);
    app.use(router.routes()).use(router.allowedMethods())
};






