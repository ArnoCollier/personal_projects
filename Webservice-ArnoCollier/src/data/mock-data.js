let GENRES = [
    { id: 1, naam: 'Biografie' },
    { id: 2, naam: 'Detective' },
    { id: 3, naam: 'Doktersverhaal' },
    { id: 4, naam: 'Erotiek' },
    { id: 5, naam: 'Familieroman' },
    { id: 6, naam: 'Griezelverhaal' },
    { id: 7, naam: 'Historische roman' },
    { id: 8, naam: 'Humor' },
    { id: 9, naam: 'Oorlog/verzet' },
    { id: 10, naam: 'Psychologisch verhaal' },
    { id: 11, naam: 'Romantisch verhaal' },
    { id: 12, naam: 'Science-fiction' },
    { id: 13, naam: 'Sociaal/politiek verhaal' },
    { id: 14, naam: 'Spanning en avontuur' },
    { id: 15, naam: 'Waargebeurd verhaal' },
    { id: 16, naam: 'Western' },
    { id: 17, naam: 'Zeeverhaal' },
    { id: 18, naam: 'ABC-boek' },
    { id: 19, naam: 'Avonturenverhaal' },
    { id: 20, naam: 'Detective' },
    { id: 21, naam: 'Dierenverhaal' },
    { id: 22, naam: 'Fantasieverhaal' },
    { id: 23, naam: 'Gezinsverhaal' },
    { id: 24, naam: 'Godsdienstig verhaal' },
    { id: 25, naam: 'Griezelverhaal' },
    { id: 26, naam: 'Historisch verhaal' },
    { id: 27, naam: 'Jongensboek' },
    { id: 28, naam: 'Leerboek' },
    { id: 29, naam: 'Meisjesboek' },
    { id: 30, naam: 'Oorlogsverhaal' },
    { id: 31, naam: 'Poëzie' },
    { id: 32, naam: 'Prentenboek' },
    { id: 33, naam: 'Realistisch verhaal' },
    { id: 34, naam: 'Reisverhaal' },
    { id: 35, naam: 'Schoolverhaal' },
    { id: 36, naam: 'Sinterklaas- en Kerstverhaal' },
    { id: 37, naam: 'Sprookje' },
    { id: 38, naam: 'Stripverhaal' },
    { id: 39, naam: 'Tijdschrift' },
  ];
  
  let RESERVATIES = [
    {
        id: 1,
        begindatum: new Date('2023-11-11'),
        einddatum: new Date('2023-12-21'),
        user_id: 1,
        boek_id: 1,
      },
    
  ];
  
  let BOEKEN = [
    {
      id: 1,
      titel: 'De aanslag',
      release_datum: '1982-01-01',
      isbn: '9789023466799',
      taal: 'Nederlands',
      aantal_paginas: 300,
      uitgever: 'De Bezige Bij',
      reservaties: [
        
              {
                id: 1,
                begindatum: new Date('2023-11-11'),
                einddatum: new Date('2023-12-21'),
                user_id: 1,
                boek_id: 1,
              },
            ],
      auteurs: [
            {
                id: 1,
                voornaam: 'Bart',
                achternaam: 'Van Damme',
                geboortedatum: '1989-01-01',
                biografie: 'Bart is een ervaren schrijver en heeft al meer dan 20 boeken op zijn naam staan.',

            }
        ],
      genres: [
        {
            id: 1,
            naam: 'Biografie',
        }
      ]
    },

  ];
  
  let USERS = [
    {
      id: 2,
      username: 'KlaasHuy',
      voornaam: 'Klaas',
      achternaam: 'Huybrechts',
      telefoonnummer: '0470346152',
      email: 'Klaas.Huy@gmail.com',
      geboortedatum: '1997-04-31',
      reservaties: [
        {
            id: 1,
            begindatum: new Date('2023-11-11'),
            einddatum: new Date('2023-12-21'),
            user_id: 1,
            boek_id: 1,
          },
        
      ],
    },
  ];
  
  let AUTEURS = [
    {
        id: 1,
        voornaam: 'Bart',
        achternaam: 'Van Damme',
        geboortedatum: '1989-01-01',
        biografie: 'Bart is een ervaren schrijver en heeft al meer dan 20 boeken op zijn naam staan.',
        
    },
  ];
  
  module.exports = { GENRES, RESERVATIES, BOEKEN, USERS, AUTEURS };
  