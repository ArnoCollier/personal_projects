const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { tables, getKnex } = require('../../src/data');

// Mock data voor tests
const data = {
  boeken: [
    {
      id: 1,
      titel: 'De vliegeraar',
      auteur_id: 1,
      genre_id: 1,
      release_datum: '2003-05-29',
      isbn: '9789022574263',
      taal: 'Nederlands',
      aantal_paginas: 370,
      uitgever: 'Boekerij',
    },
    {
      id: 2,
      titel: 'Honda Civic',
      auteur_id: 2,
      genre_id: 2,
      release_datum: '2003-05-29',
      isbn: '9789022574263',
      taal: 'Nederlands',
      aantal_paginas: 370,
      uitgever: 'Boekerij',
    },
    {
      id: 3,
      titel: 'pazazz',
      auteur_id: 3,
      genre_id: 3,
      release_datum: '2003-05-29',
      isbn: '9789022574263',
      taal: 'Nederlands',
      aantal_paginas: 370,
      uitgever: 'Boekerij',
    },
  ],
  auteurs: [{
    id: 1,
    voornaam: 'Bart',
    achternaam: 'Van Damme',
    geboortedatum: '1989-01-01',
    biografie: 'Bart is een ervaren schrijver en heeft al meer dan 20 boeken op zijn naam staan.',
  }],
  genre: [{
    id: 1,
    naam: 'Biografie',
  }]
};

const dataToDelete = {
  boeken: [1, 2, 3], 
  // IDs van boeken die moeten worden verwijderd na de tests
};

describe('Boeken', () => {
  let server;
  let request;
  let knex;
  // Setup: Voer dit uit voordat de tests worden gestart
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });
  // Cleanup: Voer dit uit nadat alle tests zijn voltooid

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/boeken';
  // Test suite voor GET /api/boeken endpoint

  describe('GET /api/boeken', () => {
    // Setup: Voer dit uit voordat de tests voor deze suite worden gestart

    beforeAll(async () => {
      await knex(tables.boek).insert(data.boeken);
    });
    // Cleanup: Voer dit uit nadat alle tests voor deze suite zijn voltooid

    afterAll(async () => {
      await knex(tables.boek)
        .whereIn('id', dataToDelete.boeken)
        .delete();
    });
    // Test: De endpoint moet 200 reageren en alle boeken retourneren

    it('should 200 and return all books', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3); // Aantal boeken moet overeenkomen
      // ... (voeg hier andere verwachtingen toe op basis van je gegevens)

      expect(response.body.items).toEqual(expect.arrayContaining([
        {
          id: 1,
          titel: 'De vliegeraar',
          auteur_id: 1,
          genre_id: 1,
          release_datum: '2003-05-29',
          isbn: '9789022574263',
          taal: 'Nederlands',
          aantal_paginas: 370,
          uitgever: 'Boekerij',
        },
        {
          id: 2,
          titel: 'Honda Civic',
          auteur_id: 2,
          genre_id: 2,
          release_datum: '2003-05-29',
          isbn: '9789022574263',
          taal: 'Nederlands',
          aantal_paginas: 370,
          uitgever: 'Boekerij',
        },
        {
          id: 3,
          titel: 'pazazz',
          auteur_id: 3,
          genre_id: 3,
          release_datum: '2003-05-29',
          isbn: '9789022574263',
          taal: 'Nederlands',
          aantal_paginas: 370,
          uitgever: 'Boekerij',
        },
      ]));
    });
    // Test: De endpoint moet 400 reageren wanneer een ongeldig argument wordt gegeven

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
            // ... (voeg hier andere verwachtingen toe op basis van je validatie)

      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });
  // ... (voeg hier andere endpoint-tests toe)

});


  // Test suite voor POST /api/boeken endpoint

  describe('GET /api/boeken/:id', () => {
    // ... (voeg hier setup en cleanup toe zoals hierboven)

    beforeAll(async () => {
      await knex(tables.boek).insert(data.boeken[0]);
    });

    afterAll(async () => {
      await knex(tables.boek)
        .whereIn('id', dataToDelete.boek)
        .delete();
    });
    // Test: De endpoint moet 201 reageren en het gemaakte boek retourneren

    it('should 200 and return the requested place', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        titel: 'De vliegeraar',
        auteur_id: 1,
        genre_id: 1,
        release_datum: '2003-05-29',
        isbn: '9789022574263',
        taal: 'Nederlands',
        aantal_paginas: 370,
        uitgever: 'Boekerij',
      });
    });

    it('should 404 when requesting not existing book', async () => {
      const response = await request.get(`${url}/122`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No book with id 122 exists',
        details: {
          id: 122,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
    // Test: De endpoint moet 400 reageren wanneer titel ontbreekt
    it('should 400 with invalid book id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('POST /api/boeken', () => {

    const placesToDelete = [];

    afterAll(async () => {
      await knex(tables.boek)
        .whereIn('id', boekenToDelete)
        .delete();
    });

    it('should 201 and return the created book', async () => {
      const response = await request.post(url)
        .send({
          titel: 'New boek',
            auteur_id: 1,
            genre_id: 1,
            release_datum: '2003-05-29',
            isbn: '9789022574263',
            taal: 'Nederlands',
            aantal_paginas: 370,
            uitgever: 'Boekerij',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('New book');
      expect(response.body.rating).toBe(2);

      boekenToDelete.push(response.body.id);
    });


   it('should 400 when missing titel', async () => {
        const response = await request.post(url)
            .send({
                auteur_id: 1,
                genre_id: 1,
                release_datum: '2003-05-29',
                isbn: '9789022574263',
                taal: 'Nederlands',
                aantal_paginas: 370,
                uitgever: 'Boekerij',
            });

    
    });

  });

  describe('PUT /api/boeken/:id', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
    });

    afterAll(async () => {
      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();
    });

    it('should 200 and return the updated book', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'Changed name',
            
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        titel: 'Changed name',
        auteur_id: 1,
        genre_id: 1,
        release_datum: '2003-05-29',
        isbn: '9789022574263',
        taal: 'Nederlands',
        aantal_paginas: 370,
        uitgever: 'Boekerij',        
        
      });
    });

     it('should 400 for duplicate book name', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          titel: 'Changed name',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A book with this name already exists',
        details: {},
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing titel', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          auteur_id: 1,
                      
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('titel');
    });

    it('should 400 when missing auteur', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          titel: 'The wrong place',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('author');
    });

  });

  describe('DELETE /api/boeken/:id', () => {

    beforeAll(async () => {
      await knex(tables.boek).insert(data.boeken[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing book', async () => {
      const response = await request.delete(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No book with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid book id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
