import { Service } from '@angular/core';
import { GameModel } from '../models/games';

@Service()
export class Game {

    getGames(): GameModel[] {
        return [
        // ---------- Породичне игре (Family) ----------
        {
            id: '1',
            name: { sr: 'Čoveče ne ljuti se', en: 'Ludo (Sorry!)' },
            price: 1200,
            players: '2-4',
            age: '5+',
            duration: '30 min',
            images: ["CoveceNeLjutiSe1.jpg"],
            group: { sr: 'Porodične', en: 'Family' },
            description: { sr: 'Klasična porodična igra sa pločicom i kockicama, pogodna za sve generacije.', en: 'Classic family board game with dice and pawns.' }
        },
        {
            id: '2',
            name: { sr: 'Monopol', en: 'Monopoly' },
            price: 2500,
            players: '2-6',
            age: '8+',
            duration: '60-180 min',
            images: ['Monopoly1.jpg'],
            group: { sr: 'Porodične', en: 'Family' },
            description: { sr: 'Igra trgovine i strategije u kojoj kupujete nekretnine i pokušavate da bankrotirate protivnike.', en: 'Buy properties, collect rent, and bankrupt opponents.' }
        },
        {
            id: '3',
            name: { sr: 'Activity', en: 'Activity' },
            price: 2200,
            players: '4-12',
            age: '12+',
            duration: '45 min',
            images: ['Activity1.jpg'],
            group: { sr: 'Porodične', en: 'Family' },
            description: { sr: 'Zabavna igra pogađanja kroz crtanje, objašnjavanje i pantomimu, idealna za veće grupe.', en: 'Fun guessing game with drawing, explaining and acting.' }
        },

        // ---------- Стратешке игре (Strategy) ----------
        {
            id: '4',
            name: { sr: 'Šah', en: 'Chess' },
            price: 1800,
            players: '2',
            age: '6+',
            duration: '30-90 min',
            images: ['Chess1.jpg'],
            group: { sr: 'Strateške', en: 'Strategy' },
            description: { sr: 'Vekovima poznata strateška igra koja zahteva taktičko razmišljanje i planiranje unapred.', en: 'Classic strategic game of tactics and planning.' }
        },
        {
            id: '5',
            name: { sr: 'Catan', en: 'Catan' },
            price: 3500,
            players: '3-4',
            age: '10+',
            duration: '60-90 min',
            images: ['Catan1.jpg'],
            group: { sr: 'Strateške', en: 'Strategy' },
            description: { sr: 'Igra naseljavanja ostrva u kojoj se trguje resursima i grade naselja i putevi.', en: 'Settle an island, trade resources, and build.' }
        },
        {
            id: '6',
            name: { sr: 'Risk', en: 'Risk' },
            price: 3000,
            players: '2-6',
            age: '10+',
            duration: '120-240 min',
            images: ['Risk1.jpg'],
            group: { sr: 'Strateške', en: 'Strategy' },
            description: { sr: 'Strateška igra osvajanja teritorija i vojne taktike na globalnoj mapi.', en: 'Global conquest strategy board game.' }
        },

        // ---------- Забавне игре (Party) ----------
        {
            id: '7',
            name: { sr: 'Tabu', en: 'Taboo' },
            price: 1900,
            players: '4-10',
            age: '12+',
            duration: '40 min',
            images: ['Taboo1.jpg'],
            group: { sr: 'Zabavne', en: 'Party' },
            description: { sr: 'Igra objašnjavanja pojmova bez korišćenja zabranjenih reči, puna smeha i napetosti.', en: 'Explain words without using the forbidden words.' }
        },
        {
            id: '8',
            name: { sr: 'Jenga', en: 'Jenga' },
            price: 1500,
            players: '2-8',
            age: '6+',
            duration: '20 min',
            images: ['Jenga1.jpg'],
            group: { sr: 'Zabavne', en: 'Party' },
            description: { sr: 'Igra ravnoteže gde igrači vade drvene blokove iz tornja bez da ga obore.', en: 'Balance game where players remove blocks without toppling the tower.' }
        },
        {
            id: '9',
            name: { sr: 'Poker', en: 'Poker' },
            price: 1000,
            players: '2-10',
            age: '16+',
            duration: '30-60 min',
            images: ['Poker1.jpg'],
            group: { sr: 'Zabavne', en: 'Party' },
            description: { sr: 'Popularna kartaška igra klađenja i blefiranja, koja zahteva veštine i strategiju.', en: 'Popular betting and bluffing card game.' }
        }
    ];
    }

}
