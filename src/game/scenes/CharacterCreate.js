import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

const HAIR_COLORS = [
  { name: 'Black', value: 0x1a1a1a },
  { name: 'Brown', value: 0x4a3728 },
  { name: 'Auburn', value: 0x6b3426 },
  { name: 'Blonde', value: 0xd4a84b },
  { name: 'White', value: 0xe8e0d5 },
  { name: 'Red', value: 0x8b3518 },
  { name: 'Gray', value: 0x6b6b6b },
  { name: 'Blue', value: 0x2c5282 },
];

const SKIN_COLORS = [
  { name: 'Fair', value: 0xf5d0c5 },
  { name: 'Light', value: 0xe8b4a0 },
  { name: 'Medium', value: 0xc98b6a },
  { name: 'Olive', value: 0xa67c52 },
  { name: 'Tan', value: 0x8b6914 },
  { name: 'Brown', value: 0x6b4423 },
  { name: 'Dark', value: 0x4a3728 },
  { name: 'Deep', value: 0x3d2817 },
];

const EYE_COLORS = [
  { name: 'Brown', value: 0x3d2817 },
  { name: 'Hazel', value: 0x6b4423 },
  { name: 'Green', value: 0x2d5a27 },
  { name: 'Blue', value: 0x2c5282 },
  { name: 'Gray', value: 0x5a6b6b },
  { name: 'Amber', value: 0xb8860b },
];

const PREVIEW_CENTER_X = 512;
const PREVIEW_CENTER_Y = 320;
const PIXEL = 2;
const HEAD_W = 64;
const HEAD_H = 56;

export class CharacterCreate extends Scene {
  constructor() {
    super('CharacterCreate');
  }

  create() {
    if (this.textures.exists('background')) {
      this.add.image(512, 384, 'background');
    } else {
      this.add.rectangle(512, 384, 1024, 768, 0x2a1810).setDepth(0);
    }

    this.add.text(PREVIEW_CENTER_X, 120, 'Create your innkeeper', {
      fontFamily: 'monospace', fontSize: 28, color: '#e8d5a3',
      stroke: '#5c3317', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(100);

    this.hairIndex = 0;
    this.skinIndex = 0;
    this.eyeIndex = 0;

    this.previewContainer = this.add.container(PREVIEW_CENTER_X, PREVIEW_CENTER_Y);
    this.previewContainer.setDepth(50);
    this.buildPreview();

    this.hairSwatches = this.createColorSelector('Hair', HAIR_COLORS, 420, (index) => {
      this.hairIndex = index;
      this.buildPreview();
    });
    this.skinSwatches = this.createColorSelector('Skin', SKIN_COLORS, 520, (index) => {
      this.skinIndex = index;
      this.buildPreview();
    });
    this.eyeSwatches = this.createColorSelector('Eyes', EYE_COLORS, 620, (index) => {
      this.eyeIndex = index;
      this.buildPreview();
    });

    const confirmBtn = this.add.rectangle(PREVIEW_CENTER_X, 700, 260, 40, 0x5c3317, 1)
      .setStrokeStyle(PIXEL, 0x8b6914)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);
    this.add.text(PREVIEW_CENTER_X, 700, 'Become the Innkeeper', {
      fontFamily: 'monospace', fontSize: 18, color: '#e8d5a3',
    }).setOrigin(0.5).setDepth(101);
    confirmBtn.on('pointerdown', () => this.confirmAndStart());

    EventBus.emit('current-scene-ready', this);
  }

  buildPreview() {
    this.previewContainer.removeAll(true);
    const skin = SKIN_COLORS[this.skinIndex].value;
    const hair = HAIR_COLORS[this.hairIndex].value;
    const eyes = EYE_COLORS[this.eyeIndex].value;

    const hw = HEAD_W / 2;
    const hh = HEAD_H / 2;
    const head = this.add.graphics();
    head.fillStyle(skin, 1);
    head.fillRect(-hw, -hh, HEAD_W, HEAD_H);
    head.fillStyle(0x2a1a0a, 1);
    head.fillRect(-hw, -hh, HEAD_W, PIXEL);
    head.fillRect(-hw, -hh, PIXEL, HEAD_H);
    this.previewContainer.add(head);

    const eyeSize = 8;
    const eyeY = -4;
    const eyeX = 14;
    const leftEye = this.add.graphics();
    leftEye.fillStyle(eyes, 1);
    leftEye.fillRect(-eyeX - eyeSize, eyeY, eyeSize, eyeSize);
    const rightEye = this.add.graphics();
    rightEye.fillStyle(eyes, 1);
    rightEye.fillRect(eyeX, eyeY, eyeSize, eyeSize);
    this.previewContainer.add([leftEye, rightEye]);

    const hairG = this.add.graphics();
    hairG.fillStyle(hair, 1);
    hairG.fillRect(-hw - 4, -hh - 20, HEAD_W + 8, 24);
    hairG.fillStyle(0x1a1a1a, 1);
    hairG.fillRect(-hw - 4, -hh - 20, HEAD_W + 8, PIXEL);
    hairG.fillRect(-hw - 4, -hh - 20, PIXEL, 24);
    this.previewContainer.add(hairG);
    this.updateSwatchBorders();
  }

  createColorSelector(label, options, y, onSelect) {
    this.add.text(280, y - 8, label + ':', {
      fontFamily: 'monospace', fontSize: 16, color: '#c4a35a',
    }).setOrigin(0, 0.5).setDepth(100);

    const swatchWidth = 32;
    const padding = 6;
    const startX = 380;
    const currentIndex = label === 'Hair' ? this.hairIndex : label === 'Skin' ? this.skinIndex : this.eyeIndex;
    const buttons = [];
    options.forEach((opt, i) => {
      const x = startX + i * (swatchWidth + padding);
      const btn = this.add.rectangle(x + swatchWidth / 2, y, swatchWidth, swatchWidth, opt.value, 1)
        .setStrokeStyle(PIXEL, i === currentIndex ? 0xf4d03f : 0x5c4a38)
        .setInteractive({ useHandCursor: true })
        .setDepth(100);
      btn.on('pointerdown', () => onSelect(i));
      buttons.push(btn);
    });
    return buttons;
  }

  updateSwatchBorders() {
    (this.hairSwatches || []).forEach((btn, i) => btn.setStrokeStyle(PIXEL, i === this.hairIndex ? 0xf4d03f : 0x5c4a38));
    (this.skinSwatches || []).forEach((btn, i) => btn.setStrokeStyle(PIXEL, i === this.skinIndex ? 0xf4d03f : 0x5c4a38));
    (this.eyeSwatches || []).forEach((btn, i) => btn.setStrokeStyle(PIXEL, i === this.eyeIndex ? 0xf4d03f : 0x5c4a38));
  }

  confirmAndStart() {
    this.registry.set('playerAvatar', {
      hairColor: HAIR_COLORS[this.hairIndex].value,
      skinColor: SKIN_COLORS[this.skinIndex].value,
      eyeColor: EYE_COLORS[this.eyeIndex].value,
    });
    this.scene.start('Tavern');
  }
}
