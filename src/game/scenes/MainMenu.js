import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        if (this.textures.exists('background')) {
            this.add.image(512, 384, 'background');
        } else {
            this.add.rectangle(512, 384, 1024, 768, 0x2a1810).setDepth(0);
        }

        this.add.text(512, 280, 'The Tavern', {
            fontFamily: 'monospace', fontSize: 40, color: '#e8d5a3',
            stroke: '#5c3317', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 360, 'Run your inn • Decorate • Send heroes on quests', {
            fontFamily: 'monospace', fontSize: 16, color: '#8b7355',
        }).setOrigin(0.5).setDepth(100);

        const startBtn = this.add.rectangle(512, 480, 220, 40, 0x5c3317, 1)
            .setStrokeStyle(2, 0x8b6914)
            .setInteractive({ useHandCursor: true })
            .setDepth(100);
        this.add.text(512, 480, 'Open Tavern', {
            fontFamily: 'monospace', fontSize: 20, color: '#e8d5a3',
        }).setOrigin(0.5).setDepth(101);
        startBtn.on('pointerdown', () => this.scene.start('CharacterCreate'));

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('CharacterCreate');
    }

    moveLogo () {}
}
