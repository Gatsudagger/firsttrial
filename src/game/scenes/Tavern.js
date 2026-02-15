import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { bakeNpcSprites, bakeFurnitureSprites, bakeInnkeeperSprite } from '../PixelSprites';

const TILE_SIZE = 64;
const PIXEL = 2;
const GRID_COLS = 12;
const GRID_ROWS = 8;
const OFFSET_X = 48;
const OFFSET_Y = 48;

const FURNITURE_TEXTURE = { bar: 'furn_bar', table: 'furn_table', chair: 'furn_chair', keg: 'furn_keg', fireplace: 'furn_fireplace', plant: 'furn_plant', painting: 'furn_painting', bookshelf: 'furn_bookshelf' };

const FURNITURE_TYPES = [
  { id: 'bar', name: 'Bar', w: 4, h: 1, color: 0x8b4513, stroke: 0x5d2e0a },
  { id: 'table', name: 'Table', w: 2, h: 1, color: 0x654321, stroke: 0x3d2817 },
  { id: 'chair', name: 'Chair', w: 1, h: 1, color: 0xa0522d, stroke: 0x5c3317 },
  { id: 'keg', name: 'Keg', w: 1, h: 1, color: 0x2f1810, stroke: 0x1a0d08 },
  { id: 'fireplace', name: 'Fireplace', w: 2, h: 2, color: 0x4a4a4a, stroke: 0x2a2a2a },
  { id: 'plant', name: 'Plant', w: 1, h: 1, color: 0x228b22, stroke: 0x145214 },
  { id: 'painting', name: 'Painting', w: 1, h: 2, color: 0x8b7355, stroke: 0x5c4a38 },
  { id: 'bookshelf', name: 'Bookshelf', w: 1, h: 2, color: 0x5c4033, stroke: 0x3d2a1f },
];

const QUESTS = [
  { id: 'goblins', name: 'Slay 5 Goblins', reward: 25, duration: 8 },
  { id: 'herbs', name: 'Fetch Moon Herbs', reward: 15, duration: 5 },
  { id: 'escort', name: 'Escort Merchant', reward: 40, duration: 12 },
  { id: 'spider', name: 'Clear Spider Nest', reward: 35, duration: 10 },
  { id: 'relic', name: 'Recover Lost Relic', reward: 50, duration: 15 },
];

const NPC_ENTRIES = [
  { class: 'knight', name: 'Aldric' },
  { class: 'rogue', name: 'Mira' },
  { class: 'mage', name: 'Elara' },
  { class: 'ranger', name: 'Thorn' },
  { class: 'warrior', name: 'Brenna' },
  { class: 'cleric', name: 'Osric' },
  { class: 'bard', name: 'Lyra' },
  { class: 'paladin', name: 'Corin' },
];

export class Tavern extends Scene {
  constructor() {
    super('Tavern');
  }

  create() {
    this.gold = 100;
    this.placedFurniture = [];
    this.npcs = [];
    this.selectedFurnitureType = null;
    this.placementPreview = null;
    this.questPanel = null;
    this.selectedNpc = null;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    bakeNpcSprites(this);
    bakeFurnitureSprites(this);
    const avatar = this.registry.get('playerAvatar') || { skinColor: 0xf5d0c5, hairColor: 0x4a3728, eyeColor: 0x3d2817 };
    bakeInnkeeperSprite(this, avatar.skinColor, avatar.hairColor, avatar.eyeColor);

    this.drawFloor();
    this.drawWalls();
    this.createFurnitureCatalog();
    this.createInnkeeper();
    this.createDoor();
    this.spawnInitialNpcs();
    this.createHud();
    this.setupPlacementInput();
    this.setupInnkeeperMovement();

    EventBus.emit('current-scene-ready', this);
  }

  drawFloor() {
    const g = this.add.graphics();
    const plankH = 6;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = OFFSET_X + col * TILE_SIZE;
        const y = OFFSET_Y + row * TILE_SIZE;
        const dark = (row + col) % 2 === 0 ? 0x352510 : 0x3d2914;
        const mid = (row + col) % 2 === 0 ? 0x4a3520 : 0x5c4033;
        const light = (row + col) % 2 === 0 ? 0x5c4033 : 0x6b4a2a;
        for (let py = 0; py < TILE_SIZE; py += plankH) {
          const sh = Math.min(plankH, TILE_SIZE - py);
          g.fillStyle(py === 0 ? light : py < plankH * 2 ? mid : dark, 1);
          g.fillRect(x + 2, y + py + 1, TILE_SIZE - 4, sh - 1);
        }
        g.fillStyle(0x2a1a0a, 1);
        g.fillRect(x, y + TILE_SIZE - PIXEL, TILE_SIZE, PIXEL);
        g.fillRect(x + TILE_SIZE - PIXEL, y, PIXEL, TILE_SIZE);
      }
    }
    g.setDepth(0);
  }

  drawWalls() {
    const g = this.add.graphics();
    g.fillStyle(0x3d2817, 1);
    g.fillRect(0, 0, this.scale.width, OFFSET_Y);
    g.fillRect(0, 0, OFFSET_X, this.scale.height);
    g.fillRect(OFFSET_X + GRID_COLS * TILE_SIZE, 0, this.scale.width, this.scale.height);
    g.fillRect(0, OFFSET_Y + GRID_ROWS * TILE_SIZE, this.scale.width, this.scale.height);
    g.fillStyle(0x2a1810, 1);
    const beam = 12;
    for (let i = 0; i < this.scale.width; i += beam) {
      g.fillRect(i, 0, beam - 2, OFFSET_Y);
      g.fillRect(i, OFFSET_Y + GRID_ROWS * TILE_SIZE, beam - 2, this.scale.height);
    }
    for (let i = 0; i < this.scale.height; i += beam) {
      g.fillRect(0, i, OFFSET_X, beam - 2);
      g.fillRect(OFFSET_X + GRID_COLS * TILE_SIZE, i, this.scale.width, beam - 2);
    }
    g.fillStyle(0x5c4033, 1);
    for (let i = 0; i < this.scale.width; i += beam) {
      g.fillRect(i + beam - 2, 0, 2, OFFSET_Y);
      g.fillRect(i + beam - 2, OFFSET_Y + GRID_ROWS * TILE_SIZE, 2, this.scale.height);
    }
    for (let i = 0; i < this.scale.height; i += beam) {
      g.fillRect(0, i + beam - 2, OFFSET_X, 2);
      g.fillRect(OFFSET_X + GRID_COLS * TILE_SIZE, i + beam - 2, this.scale.width, 2);
    }
    g.setDepth(1);
  }

  createFurnitureCatalog() {
    const panelX = OFFSET_X + GRID_COLS * TILE_SIZE + 16;
    const panelY = 64;
    const pw = 176;
    const ph = 320;
    const g = this.add.graphics();
    g.fillStyle(0x1a1208, 1);
    g.fillRect(panelX - 8, panelY - 8, pw, ph);
    g.fillStyle(0x8b6914, 1);
    g.fillRect(panelX - 8, panelY - 8, pw, PIXEL);
    g.fillRect(panelX - 8, panelY - 8, PIXEL, ph);
    g.fillStyle(0x5c4a38, 1);
    g.fillRect(panelX - 8 + pw - PIXEL, panelY - 8, PIXEL, ph);
    g.fillRect(panelX - 8, panelY - 8 + ph - PIXEL, pw, PIXEL);
    g.setDepth(100);

    this.add.text(panelX + pw / 2 - 8, panelY + 4, 'Furniture', {
      fontFamily: 'monospace', fontSize: 16, color: '#e8d5a3',
    }).setOrigin(0.5, 0).setDepth(101);

    const slotSize = 40;
    const pad = 8;
    FURNITURE_TYPES.forEach((def, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const sx = panelX + 12 + col * (slotSize + pad);
      const sy = panelY + 28 + row * (slotSize + pad + 10);
      const texKey = FURNITURE_TEXTURE[def.id];
      if (texKey && this.textures.exists(texKey)) {
        const maxD = Math.max(def.w || 1, def.h || 1);
        const scale = slotSize / maxD;
        this.add.image(sx + slotSize / 2, sy + slotSize / 2, texKey)
          .setDisplaySize((def.w || 1) * scale, (def.h || 1) * scale)
          .setDepth(101);
      }
      const box = this.add.rectangle(sx + slotSize / 2, sy + slotSize / 2, slotSize, slotSize, 0x000000, 0)
        .setStrokeStyle(PIXEL, def.stroke)
        .setInteractive({ useHandCursor: true })
        .setDepth(102);
      this.add.text(sx + slotSize / 2, sy + slotSize + 2, def.name, {
        fontFamily: 'monospace', fontSize: 10, color: '#c4a35a',
      }).setOrigin(0.5, 0).setDepth(101);
      box.on('pointerdown', () => {
        this.selectedFurnitureType = def;
        this.updatePlacementPreview();
      });
    });

    this.add.text(panelX + pw / 2 - 8, panelY + ph - 24, 'Click tile to place', {
      fontFamily: 'monospace', fontSize: 10, color: '#8b7355',
    }).setOrigin(0.5, 0).setDepth(101);
  }

  placeFurnitureAt(gridX, gridY) {
    if (!this.selectedFurnitureType) return;
    const def = this.selectedFurnitureType;
    if (gridX + def.w > GRID_COLS || gridY + def.h > GRID_ROWS) return;
    for (let dy = 0; dy < def.h; dy++) {
      for (let dx = 0; dx < def.w; dx++) {
        if (this.isTileBlocked(gridX + dx, gridY + dy)) return;
      }
    }
    this.placedFurniture.push({ type: def.id, gridX, gridY, def });
    this.renderPlacedFurniture();
    this.selectedFurnitureType = null;
    this.clearPlacementPreview();
  }

  isTileBlocked(gridX, gridY) {
    if (gridX < 0 || gridX >= GRID_COLS || gridY < 0 || gridY >= GRID_ROWS) return true;
    for (const f of this.placedFurniture) {
      const d = FURNITURE_TYPES.find((x) => x.id === f.type) || f.def;
      const w = d?.w ?? 1;
      const h = d?.h ?? 1;
      if (gridX >= f.gridX && gridX < f.gridX + w && gridY >= f.gridY && gridY < f.gridY + h) return true;
    }
    if (this.innkeeper && this.gridEquals(this.innkeeper.gridX, this.innkeeper.gridY, gridX, gridY)) return true;
    for (const npc of this.npcs) {
      if (npc.gridX === gridX && npc.gridY === gridY) return true;
    }
    return false;
  }

  gridEquals(ax, ay, bx, by) {
    return ax === bx && ay === by;
  }

  renderPlacedFurniture() {
    if (this.furnitureGroup) this.furnitureGroup.destroy(true);
    this.furnitureGroup = this.add.container(0, 0).setDepth(5);
    for (const f of this.placedFurniture) {
      const def = FURNITURE_TYPES.find((x) => x.id === f.type) || f.def;
      const w = def.w;
      const h = def.h;
      const px = OFFSET_X + f.gridX * TILE_SIZE;
      const py = OFFSET_Y + f.gridY * TILE_SIZE;
      const bw = w * TILE_SIZE;
      const bh = h * TILE_SIZE;
      const texKey = FURNITURE_TEXTURE[def.id];
      if (texKey && this.textures.exists(texKey)) {
        const img = this.add.image(px + bw / 2, py + bh / 2, texKey).setOrigin(0.5, 0.5).setDisplaySize(bw, bh).setDepth(5);
        this.furnitureGroup.add(img);
      }
      const hit = this.add.rectangle(px + bw / 2, py + bh / 2, bw, bh, 0x000000, 0)
        .setInteractive({ useHandCursor: true });
      hit.setData('gridX', f.gridX);
      hit.setData('gridY', f.gridY);
      hit.on('pointerdown', (pointer, lx, ly, event) => {
        if (event && event.button === 2) {
          this.placedFurniture = this.placedFurniture.filter(
            (x) => x.gridX !== f.gridX || x.gridY !== f.gridY
          );
          this.renderPlacedFurniture();
        }
      });
      this.furnitureGroup.add(hit);
    }
  }

  createInnkeeper() {
    const startCol = 1;
    const startRow = GRID_ROWS - 2;
    const x = OFFSET_X + startCol * TILE_SIZE + TILE_SIZE / 2;
    const y = OFFSET_Y + startRow * TILE_SIZE + TILE_SIZE / 2;
    const img = this.add.image(0, 0, 'innkeeper').setOrigin(0.5, 1).setDisplaySize(TILE_SIZE, TILE_SIZE);
    this.innkeeper = this.add.container(x, y, [img]).setDepth(10);
    this.innkeeper.gridX = startCol;
    this.innkeeper.gridY = startRow;
  }

  createDoor() {
    const doorX = OFFSET_X + (GRID_COLS - 1) * TILE_SIZE;
    const doorY = OFFSET_Y + Math.floor(GRID_ROWS / 2) * TILE_SIZE - TILE_SIZE;
    const dw = TILE_SIZE;
    const dh = TILE_SIZE * 2;
    const g = this.add.graphics();
    g.fillStyle(0x2a1810, 1);
    g.fillRect(doorX - 4, doorY - 8, dw + 8, dh + 16);
    g.fillStyle(0x5c4033, 1);
    g.fillRect(doorX, doorY - 4, 4, dh + 8);
    g.fillRect(doorX + dw - 4, doorY - 4, 4, dh + 8);
    g.fillRect(doorX - 4, doorY + dh, dw + 8, 4);
    g.fillStyle(0x3d2817, 1);
    g.fillRect(doorX + 2, doorY, dw - 4, dh);
    g.fillStyle(0x5c4033, 1);
    g.fillRect(doorX + 2, doorY, dw - 4, 4);
    g.fillStyle(0x8b6914, 1);
    g.fillRect(doorX + dw / 2 - 4, doorY + dh / 2 - 6, 8, 12);
    g.setDepth(2);
    this.add.text(doorX + dw / 2, doorY - 10, 'Door', {
      fontFamily: 'monospace', fontSize: 11, color: '#e8d5a3',
    }).setOrigin(0.5).setDepth(3);
    this.doorPosition = { gridX: GRID_COLS - 1, gridY: Math.floor(GRID_ROWS / 2) };
  }

  spawnInitialNpcs() {
    for (let i = 0; i < 3; i++) this.spawnNpc();
  }

  spawnNpc() {
    const entry = NPC_ENTRIES[Phaser.Math.Between(0, NPC_ENTRIES.length - 1)];
    const fullName = entry.class.charAt(0).toUpperCase() + entry.class.slice(1) + ' ' + entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
    let gridX = Phaser.Math.Between(2, GRID_COLS - 3);
    let gridY = Phaser.Math.Between(1, GRID_ROWS - 2);
    let attempts = 0;
    while (this.isTileBlocked(gridX, gridY) && attempts < 50) {
      gridX = Phaser.Math.Between(2, GRID_COLS - 3);
      gridY = Phaser.Math.Between(1, GRID_ROWS - 2);
      attempts++;
    }
    if (this.isTileBlocked(gridX, gridY)) return;
    const x = OFFSET_X + gridX * TILE_SIZE + TILE_SIZE / 2;
    const y = OFFSET_Y + gridY * TILE_SIZE + TILE_SIZE / 2;
    const texKey = 'npc_' + entry.class;
    const img = this.add.image(x, y, texKey).setOrigin(0.5, 1).setDisplaySize(TILE_SIZE, TILE_SIZE).setDepth(8);
    const hit = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
      .setDepth(8);
    const label = this.add.text(x, y - TILE_SIZE - 4, entry.name, {
      fontFamily: 'monospace', fontSize: 11, color: '#e8d5a3',
    }).setOrigin(0.5).setDepth(9);
    hit.on('pointerdown', () => this.openQuestPanel(hit));
    const npc = {
      name: fullName,
      gridX,
      gridY,
      circle: hit,
      img,
      label,
      quest: null,
      awayUntil: 0,
    };
    this.npcs.push(npc);
  }

  openQuestPanel(npcGraphic) {
    const npc = this.npcs.find((n) => n.circle === npcGraphic);
    if (!npc || npc.quest) return;
    this.selectedNpc = npc;
    this.showQuestPanel(npc);
  }

  showQuestPanel(npc) {
    if (this.questPanel) this.questPanel.destroy(true);
    const panelX = this.scale.width / 2;
    const panelY = this.scale.height / 2;
    const pw = 320;
    const ph = 360;
    const g = this.add.graphics();
    g.fillStyle(0x1a1208, 1);
    g.fillRect(panelX - pw / 2, panelY - ph / 2, pw, ph);
    g.fillStyle(0x8b6914, 1);
    g.fillRect(panelX - pw / 2, panelY - ph / 2, pw, PIXEL);
    g.fillRect(panelX - pw / 2, panelY - ph / 2, PIXEL, ph);
    g.fillStyle(0x5c4a38, 1);
    g.fillRect(panelX + pw / 2 - PIXEL, panelY - ph / 2, PIXEL, ph);
    g.fillRect(panelX - pw / 2, panelY + ph / 2 - PIXEL, pw, PIXEL);
    g.setDepth(200);

    const titleText = this.add.text(panelX, panelY - 155, 'Assign Quest', {
      fontFamily: 'monospace', fontSize: 20, color: '#e8d5a3',
    }).setOrigin(0.5).setDepth(201);
    const nameText = this.add.text(panelX, panelY - 125, npc.name, {
      fontFamily: 'monospace', fontSize: 14, color: '#c4a35a',
    }).setOrigin(0.5).setDepth(201);

    const panelChildren = [g, titleText, nameText];
    QUESTS.forEach((q, i) => {
      const y = panelY - 90 + i * 42;
      const btn = this.add.rectangle(panelX, y, 280, 32, 0x2a1810, 1)
        .setStrokeStyle(PIXEL, 0x5c4a38)
        .setInteractive({ useHandCursor: true })
        .setDepth(201);
      const btnLabel = this.add.text(panelX, y, `${q.name} (${q.reward} g)`, {
        fontFamily: 'monospace', fontSize: 12, color: '#e8d5a3',
      }).setOrigin(0.5).setDepth(202);
      btn.on('pointerdown', () => this.assignQuest(npc, q));
      panelChildren.push(btn, btnLabel);
    });

    const closeBtn = this.add.rectangle(panelX, panelY + 155, 120, 32, 0x5c3317, 1)
      .setStrokeStyle(PIXEL, 0x8b6914)
      .setInteractive({ useHandCursor: true })
      .setDepth(201);
    const closeLabel = this.add.text(panelX, panelY + 155, 'Close', {
      fontFamily: 'monospace', fontSize: 14, color: '#e8d5a3',
    }).setOrigin(0.5).setDepth(202);
    closeBtn.on('pointerdown', () => this.closeQuestPanel());
    panelChildren.push(closeBtn, closeLabel);

    this.questPanel = this.add.container(0, 0, panelChildren);
    this.questPanel.setDepth(200);
  }

  assignQuest(npc, quest) {
    npc.quest = quest;
    npc.awayUntil = this.time.now + quest.duration * 1000;
    npc.circle.setVisible(false);
    if (npc.img) npc.img.setVisible(false);
    npc.label.setVisible(false);
    this.closeQuestPanel();
    this.selectedNpc = null;
    this.time.delayedCall(quest.duration * 1000, () => this.returnNpc(npc));
  }

  returnNpc(npc) {
    this.gold += npc.quest.reward;
    this.updateGoldText();
    const idx = this.npcs.indexOf(npc);
    if (idx !== -1) this.npcs.splice(idx, 1);
    npc.circle.destroy();
    if (npc.img) npc.img.destroy();
    npc.label.destroy();
    this.spawnNpc();
  }

  closeQuestPanel() {
    if (this.questPanel) {
      this.questPanel.destroy(true);
      this.questPanel = null;
    }
    this.selectedNpc = null;
  }

  createHud() {
    this.goldText = this.add.text(16, 16, `Gold: ${this.gold}`, {
      fontFamily: 'monospace', fontSize: 18, color: '#f4d03f',
    }).setDepth(100);
    this.add.text(OFFSET_X, OFFSET_Y - 20, 'Click furniture then grid to place. Right-click to remove.', {
      fontFamily: 'monospace', fontSize: 10, color: '#8b7355',
    }).setDepth(100);
  }

  updateGoldText() {
    if (this.goldText) this.goldText.setText(`Gold: ${this.gold}`);
  }

  setupPlacementInput() {
    this.input.on('pointerdown', (ptr) => {
      if (this.questPanel) return;
      const worldX = ptr.worldX;
      const worldY = ptr.worldY;
      const col = Math.floor((worldX - OFFSET_X) / TILE_SIZE);
      const row = Math.floor((worldY - OFFSET_Y) / TILE_SIZE);
      if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
        if (this.selectedFurnitureType) {
          this.placeFurnitureAt(col, row);
        }
      }
    });
  }

  updatePlacementPreview() {
    this.clearPlacementPreview();
    if (!this.selectedFurnitureType) return;
    const def = this.selectedFurnitureType;
    const texKey = FURNITURE_TEXTURE[def.id];
    const bw = (def.w || 1) * TILE_SIZE;
    const bh = (def.h || 1) * TILE_SIZE;
    let prevImg = null;
    this.input.on('pointermove', (ptr) => {
      if (!this.selectedFurnitureType) return;
      const col = Math.floor((ptr.worldX - OFFSET_X) / TILE_SIZE);
      const row = Math.floor((ptr.worldY - OFFSET_Y) / TILE_SIZE);
      if (prevImg) prevImg.destroy();
      if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS && texKey && this.textures.exists(texKey)) {
        const px = OFFSET_X + col * TILE_SIZE + bw / 2;
        const py = OFFSET_Y + row * TILE_SIZE + bh / 2;
        prevImg = this.add.image(px, py, texKey).setOrigin(0.5, 0.5).setDisplaySize(bw, bh).setAlpha(0.85).setDepth(6);
        this.placementPreview = prevImg;
      } else {
        this.placementPreview = null;
      }
    });
  }

  clearPlacementPreview() {
    if (this.placementPreview) {
      this.placementPreview.destroy();
      this.placementPreview = null;
    }
    this.input.off('pointermove');
  }

  setupInnkeeperMovement() {
    this.innkeeperSpeed = 180;
  }

  getInnkeeperTargetCell() {
    const dx = this.cursors.right.isDown || this.wasd.right.isDown ? 1 : this.cursors.left.isDown || this.wasd.left.isDown ? -1 : 0;
    const dy = this.cursors.down.isDown || this.wasd.down.isDown ? 1 : this.cursors.up.isDown || this.wasd.up.isDown ? -1 : 0;
    if (dx === 0 && dy === 0) return null;
    const nx = this.innkeeper.gridX + dx;
    const ny = this.innkeeper.gridY + dy;
    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) return null;
    if (this.isTileBlocked(nx, ny)) return null;
    return { x: nx, y: ny };
  }

  update(time, delta) {
    const target = this.getInnkeeperTargetCell();
    if (target) {
      const destX = OFFSET_X + target.x * TILE_SIZE + TILE_SIZE / 2;
      const destY = OFFSET_Y + target.y * TILE_SIZE + TILE_SIZE / 2;
      const dist = Phaser.Math.Distance.Between(this.innkeeper.x, this.innkeeper.y, destX, destY);
      const speed = (this.innkeeperSpeed * delta) / 1000;
      if (dist <= speed) {
        this.innkeeper.setPosition(destX, destY);
        this.innkeeper.gridX = target.x;
        this.innkeeper.gridY = target.y;
      } else {
        const angle = Phaser.Math.Angle.Between(this.innkeeper.x, this.innkeeper.y, destX, destY);
        this.innkeeper.x += Math.cos(angle) * speed;
        this.innkeeper.y += Math.sin(angle) * speed;
      }
    }
  }
}
