const Router = require('@koa/router'); // 👈 1
const auteurService = require('../service/auteur');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');


const getAllAuteurs = async (ctx) => {
    const auteurs= await auteurService.getAll();
    ctx.body=auteurs
    }

getAllAuteurs.validationScheme = null;

const getAuteurPerId = async (ctx) => {
    ctx.body = await auteurService.getAuteur(Number(ctx.params.id));
    }

getAuteurPerId.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
};

const voegAuteurToe = async (ctx) => {
    const nieuweAuteur = await auteurService.create(ctx.request.body);
    ctx.body = nieuweAuteur;
    ctx.status = 201;
};


voegAuteurToe.validationScheme = {
    body: {
        voornaam: Joi.string().required(),
        achternaam: Joi.string().required(),
    },
};

const wijzigAuteur = async (ctx) => {
    const { id } = ctx.params;
    const gewijzigdeAuteur = await auteurService.wijzig({
        ...ctx.request.body,
        id: Number(id),
    });
    ctx.body = gewijzigdeAuteur;
};

wijzigAuteur.validationScheme = { 
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
    body: {
        voornaam: Joi.string(),
        achternaam: Joi.string(),
    },
};

const verwijderAuteur = async (ctx) => {  
    const verwijderdAuteur = await auteurService.deleteAuteur(Number(ctx.params.id));
    ctx.body = verwijderdAuteur;
};

verwijderAuteur.validationScheme = { 
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
};

module.exports = (app) => {
    const router = new Router({
        prefix: '/auteurs',
    });

    router.get('/', getAllAuteurs);
    router.get('/:id', getAuteurPerId);
    router.post('/', requireAuthentication, makeRequireRole(Role.ADMIN), validate(voegAuteurToe), voegAuteurToe);
    router.put('/:id', requireAuthentication, makeRequireRole(Role.ADMIN), validate(wijzigAuteur), wijzigAuteur);
    router.delete('/:id', requireAuthentication, makeRequireRole(Role.ADMIN), validate(verwijderAuteur), verwijderAuteur);

    app.use(router.routes()).use(router.allowedMethods())
}


