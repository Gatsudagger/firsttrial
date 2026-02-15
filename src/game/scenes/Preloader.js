import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        if (this.textures.exists('background')) {
            this.add.image(512, 384, 'background');
        } else {
            this.add.rectangle(512, 384, 1024, 768, 0x2a1810);
        }
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xe8d5a3);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xc4a35a);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
