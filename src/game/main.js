import { Boot } from './scenes/Boot';
import { CharacterCreate } from './scenes/CharacterCreate';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Tavern } from './scenes/Tavern';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a0f0a',
    pixelArt: true,
    roundPixels: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CharacterCreate,
        Tavern
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
