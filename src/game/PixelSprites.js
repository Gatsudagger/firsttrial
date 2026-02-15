/**
 * 64x64 pixel sprite system — no image files.
 * Detailed art: expanded palette, many small rects for depth and detail.
 */

export const PIXEL_SIZE = 64;

export const PALETTE = [
  0x000000, 0x1a1a1a, 0x2a1810, 0x3d2817, 0x5c4033, 0x8b6914,
  0x4a4a4a, 0x7a7a7a, 0x9a9a9a, 0xe8d5a3, 0xf5d0c5, 0x2d5a27,
  0x4a2a8a, 0xc0392b, 0xf4d03f, 0xffffff,
  // Extended for detail (16–23)
  0x0d0d0d, 0x6b6b6b, 0xb0b0b0, 0x352510, 0x6b4a2a, 0xa67c52,
  0x1a4d1a, 0x3d7a3d, 0x2a1a5a, 0x6b4a9a, 0x8b2020, 0xe8a030,
];

function rect(scene, key, recipe, w = 64, h = 64) {
  const rt = scene.add.renderTexture(0, 0, w, h);
  const g = scene.add.graphics();
  for (const part of recipe) {
    const color = typeof part.c === 'number' && part.c >= 0 && part.c < PALETTE.length ? PALETTE[part.c] : (PALETTE[part.c] ?? 0x000000);
    if (!color) continue;
    g.fillStyle(color, 1);
    g.fillRect(part.x, part.y, part.w, part.h);
  }
  rt.draw(g, 0, 0);
  rt.saveTexture(key);
  g.destroy();
}

export function bakeNpcSprites(scene) {
  const r = (c, x, y, w, h) => ({ c, x, y, w, h });
  // Knight: layered armor, helmet crest, visor, pauldrons, gauntlets, shield boss & border, belt, greaves
  const knight = [
    r(17, 20, 0, 24, 4), r(6, 18, 4, 28, 8), r(7, 20, 6, 10, 4), r(7, 34, 6, 10, 4), r(16, 22, 2, 20, 2), r(1, 24, 10, 6, 4), r(1, 34, 10, 6, 4),
    r(6, 16, 12, 32, 20), r(7, 18, 14, 12, 4), r(7, 34, 14, 12, 4), r(8, 20, 18, 8, 6), r(8, 36, 18, 8, 6), r(6, 20, 24, 24, 4), r(2, 22, 28, 20, 8),
    r(4, 48, 18, 16, 32), r(3, 50, 20, 12, 28), r(7, 50, 22, 12, 6), r(7, 50, 38, 12, 6), r(2, 52, 24, 8, 20), r(8, 52, 26, 6, 4), r(8, 52, 42, 6, 4),
    r(1, 20, 52, 24, 12), r(6, 22, 54, 8, 6), r(6, 34, 54, 8, 6), r(2, 24, 58, 16, 6), r(17, 26, 56, 12, 2)
  ];
  // Rogue: hood layers, mask, cloak fold, belt, dagger blade & hilt, boot
  const rogue = [
    r(2, 16, 0, 32, 12), r(1, 18, 4, 28, 8), r(16, 20, 2, 24, 4), r(2, 18, 12, 28, 28), r(1, 20, 16, 24, 22), r(17, 22, 14, 20, 4),
    r(10, 24, 12, 6, 6), r(10, 34, 12, 6, 6), r(1, 26, 10, 4, 4), r(1, 32, 10, 4, 4),
    r(3, 20, 38, 24, 22), r(2, 22, 40, 20, 6), r(4, 24, 46, 16, 4), r(2, 26, 50, 12, 10),
    r(6, 50, 22, 8, 28), r(7, 52, 24, 4, 24), r(2, 52, 28, 4, 8), r(2, 52, 42, 4, 8), r(4, 54, 26, 2, 20), r(3, 54, 28, 2, 4),
    r(1, 22, 58, 20, 6), r(2, 24, 60, 16, 4)
  ];
  // Mage: robe folds, star on hat, gem, sleeves, belt, runes
  const mage = [
    r(12, 14, 0, 36, 16), r(12, 18, 4, 28, 12), r(21, 20, 2, 24, 6), r(14, 26, 0, 12, 4), r(14, 28, 2, 8, 2),
    r(12, 16, 16, 32, 28), r(12, 20, 20, 24, 22), r(21, 22, 18, 20, 4), r(1, 24, 22, 16, 8), r(10, 24, 14, 6, 6), r(10, 34, 14, 6, 6),
    r(12, 18, 44, 28, 20), r(21, 20, 46, 24, 4), r(9, 22, 50, 20, 8), r(8, 24, 52, 16, 4), r(2, 26, 56, 12, 6),
    r(14, 28, 30, 8, 8), r(15, 30, 32, 4, 4)
  ];
  // Ranger: cloak layers, quiver straps, arrow fletching, bracer, boot
  const ranger = [
    r(11, 16, 2, 32, 14), r(19, 18, 4, 28, 10), r(11, 18, 14, 28, 26), r(2, 20, 18, 24, 20), r(19, 22, 20, 20, 4),
    r(10, 24, 16, 6, 6), r(10, 34, 16, 6, 6),
    r(3, 0, 18, 14, 40), r(2, 2, 20, 10, 36), r(4, 4, 22, 6, 12), r(4, 4, 38, 6, 12), r(4, 4, 50, 6, 8), r(1, 6, 24, 4, 8), r(1, 6, 44, 4, 6),
    r(3, 20, 40, 24, 24), r(2, 22, 44, 20, 6), r(2, 24, 58, 16, 6)
  ];
  // Warrior: helmet plume, armor plates, shoulder spikes, belt, greaves
  const warrior = [
    r(6, 18, 0, 28, 6), r(13, 20, 2, 24, 4), r(7, 20, 6, 12, 6), r(7, 32, 6, 12, 6), r(17, 22, 4, 20, 2),
    r(6, 14, 12, 36, 38), r(7, 16, 14, 14, 6), r(7, 34, 14, 14, 6), r(8, 18, 20, 10, 8), r(8, 36, 20, 10, 8),
    r(6, 18, 28, 28, 4), r(2, 20, 32, 24, 12), r(4, 22, 36, 20, 4), r(6, 18, 48, 28, 16), r(7, 20, 50, 10, 8), r(7, 34, 50, 10, 8),
    r(1, 24, 16, 6, 6), r(1, 34, 16, 6, 6), r(2, 22, 56, 20, 8), r(17, 24, 58, 16, 2)
  ];
  // Cleric: hood trim, robe layers, symbol detail, stole
  const cleric = [
    r(3, 16, 0, 32, 16), r(2, 18, 4, 28, 10), r(8, 20, 2, 24, 6), r(3, 18, 10, 28, 32), r(9, 20, 14, 24, 26),
    r(15, 22, 14, 20, 22), r(14, 24, 18, 16, 16), r(14, 26, 22, 12, 12), r(14, 28, 26, 8, 8), r(9, 26, 20, 4, 4), r(9, 34, 20, 4, 4),
    r(8, 24, 42, 16, 22), r(9, 26, 44, 12, 6), r(9, 26, 54, 12, 6), r(2, 26, 48, 12, 4),
    r(10, 24, 18, 6, 6), r(10, 34, 18, 6, 6), r(2, 22, 58, 20, 6)
  ];
  // Bard: feathered hat, tunic trim, lute body & neck & strings
  const bard = [
    r(8, 18, 0, 28, 8), r(14, 20, 2, 24, 4), r(14, 24, 0, 16, 2), r(14, 26, 2, 12, 2), r(14, 28, 4, 8, 2),
    r(13, 16, 8, 32, 28), r(5, 18, 10, 28, 8), r(20, 20, 12, 24, 4), r(13, 18, 18, 28, 16), r(5, 20, 20, 24, 4),
    r(10, 24, 16, 6, 6), r(10, 34, 16, 6, 6),
    r(3, 0, 22, 16, 36), r(2, 2, 24, 12, 32), r(4, 4, 26, 8, 24), r(5, 6, 28, 4, 16), r(1, 6, 30, 2, 4), r(1, 6, 38, 2, 4), r(1, 6, 46, 2, 4),
    r(2, 20, 52, 24, 12), r(17, 22, 56, 20, 2)
  ];
  // Paladin: helmet, tabard cross, armor trim, gauntlet, shield
  const paladin = [
    r(6, 18, 0, 28, 12), r(7, 20, 4, 24, 6), r(13, 20, 6, 24, 8), r(14, 24, 8, 16, 6), r(1, 26, 10, 6, 4), r(1, 34, 10, 6, 4),
    r(6, 16, 12, 32, 16), r(13, 18, 14, 28, 12), r(14, 22, 16, 20, 8), r(7, 18, 18, 12, 4), r(7, 34, 18, 12, 4),
    r(6, 18, 28, 28, 22), r(7, 20, 30, 10, 6), r(7, 34, 30, 10, 6), r(2, 22, 52, 20, 12), r(6, 24, 54, 8, 6), r(6, 32, 54, 8, 6)
  ];

  rect(scene, 'npc_knight', knight);
  rect(scene, 'npc_rogue', rogue);
  rect(scene, 'npc_mage', mage);
  rect(scene, 'npc_ranger', ranger);
  rect(scene, 'npc_warrior', warrior);
  rect(scene, 'npc_cleric', cleric);
  rect(scene, 'npc_bard', bard);
  rect(scene, 'npc_paladin', paladin);
}

export function bakeInnkeeperSprite(scene, skinColor, hairColor, eyeColor) {
  const skin = typeof skinColor === 'number' ? skinColor : PALETTE[10];
  const hair = typeof hairColor === 'number' ? hairColor : PALETTE[2];
  const eye = typeof eyeColor === 'number' ? eyeColor : PALETTE[1];
  const g = scene.add.graphics();
  const rt = scene.add.renderTexture(0, 0, 64, 64);
  // Apron: body, pocket, fold lines, waistband
  g.fillStyle(PALETTE[9], 1);
  g.fillRect(16, 34, 32, 30);
  g.fillStyle(PALETTE[8], 1);
  g.fillRect(18, 36, 28, 4);
  g.fillRect(20, 42, 22, 18);
  g.fillStyle(PALETTE[5], 1);
  g.fillRect(18, 36, 28, 4);
  g.fillRect(22, 44, 4, 14);
  g.fillRect(32, 44, 4, 14);
  g.fillStyle(PALETTE[2], 1);
  g.fillRect(18, 62, 28, 2);
  // Face: base, cheeks, nose shadow
  g.fillStyle(skin, 1);
  g.fillRect(20, 12, 24, 26);
  g.fillStyle(PALETTE[10], 1);
  g.fillRect(22, 18, 6, 4);
  g.fillRect(36, 18, 6, 4);
  g.fillStyle(PALETTE[2], 1);
  g.fillRect(28, 24, 8, 4);
  // Hair: main, fringe, side strands
  g.fillStyle(hair, 1);
  g.fillRect(14, 0, 36, 16);
  g.fillRect(16, 10, 32, 6);
  g.fillRect(12, 4, 6, 20);
  g.fillRect(46, 4, 6, 20);
  g.fillStyle(PALETTE[3], 1);
  g.fillRect(16, 2, 28, 4);
  g.fillRect(18, 12, 4, 6);
  g.fillRect(42, 12, 4, 6);
  // Eyes: iris, pupil, highlight
  g.fillStyle(eye, 1);
  g.fillRect(24, 20, 6, 6);
  g.fillRect(34, 20, 6, 6);
  g.fillStyle(PALETTE[1], 1);
  g.fillRect(26, 22, 2, 2);
  g.fillRect(36, 22, 2, 2);
  g.fillStyle(PALETTE[15], 1);
  g.fillRect(26, 20, 2, 2);
  g.fillRect(36, 20, 2, 2);
  // Outline: face and collar
  g.fillStyle(PALETTE[1], 1);
  g.fillRect(20, 12, 24, 2);
  g.fillRect(20, 12, 2, 26);
  g.fillRect(42, 12, 2, 26);
  g.fillRect(20, 36, 4, 2);
  g.fillRect(40, 36, 4, 2);
  rt.draw(g, 0, 0);
  rt.saveTexture('innkeeper');
  g.destroy();
}

export function bakeFurnitureSprites(scene) {
  const r = (c, x, y, w, h) => ({ c, x, y, w, h });
  // Bar: base, top surface, wood planks, bottles, glass, foot rail
  const bar = [];
  for (let i = 0; i < 256; i += 16) bar.push(r(2, i, 52, 14, 12), r(3, i + 2, 54, 10, 8));
  bar.push(r(3, 0, 0, 256, 10), r(4, 2, 2, 252, 6), r(5, 4, 8, 248, 42));
  for (let i = 8; i < 248; i += 24) bar.push(r(4, i, 10, 20, 4), r(3, i + 2, 12, 16, 2));
  for (let i = 20; i < 236; i += 28) {
    bar.push(r(1, i, 18, 8, 28), r(2, i + 2, 20, 4, 24), r(4, i + 2, 22, 2, 4));
    bar.push(r(6, i + 12, 18, 6, 30), r(7, i + 14, 20, 2, 26));
  }
  bar.push(r(2, 4, 48, 12, 12), r(2, 240, 48, 12, 12), r(3, 6, 50, 8, 8), r(3, 242, 50, 8, 8));
  rect(scene, 'furn_bar', bar, 256, 64);
  // Table: top planks, edge, legs with detail, stretcher
  const table = [
    r(2, 0, 0, 128, 16), r(3, 2, 2, 124, 12), r(4, 4, 4, 118, 6), r(4, 20, 4, 88, 6), r(4, 36, 4, 56, 6), r(4, 52, 4, 72, 6),
    r(3, 4, 10, 120, 4), r(2, 10, 14, 22, 50), r(3, 12, 16, 18, 46), r(17, 14, 18, 4, 8), r(17, 14, 42, 4, 8),
    r(2, 96, 14, 22, 50), r(3, 98, 16, 18, 46), r(17, 100, 18, 4, 8), r(17, 100, 42, 4, 8),
    r(2, 12, 58, 104, 6), r(3, 14, 60, 100, 2)
  ];
  rect(scene, 'furn_table', table, 128, 64);
  // Chair: back slats, cushion, legs, carving
  const chair = [
    r(2, 6, 0, 52, 28), r(3, 8, 2, 48, 24), r(4, 10, 4, 12, 20), r(4, 26, 4, 12, 20), r(4, 42, 4, 12, 20),
    r(2, 10, 6, 44, 4), r(2, 10, 14, 44, 4), r(2, 10, 22, 44, 4),
    r(3, 12, 28, 40, 14), r(5, 14, 30, 36, 10), r(4, 16, 32, 32, 6),
    r(2, 14, 42, 36, 22), r(3, 16, 44, 32, 18), r(2, 18, 58, 12, 6), r(2, 38, 58, 12, 6),
    r(17, 20, 46, 8, 4), r(17, 32, 46, 8, 4)
  ];
  rect(scene, 'furn_chair', chair, 64, 64);
  // Keg: body bands, shadow, highlight, tap
  const keg = [
    r(2, 10, 6, 44, 52), r(1, 12, 10, 40, 44), r(17, 14, 12, 36, 8), r(17, 14, 48, 36, 8),
    r(3, 12, 4, 40, 6), r(3, 12, 54, 40, 6), r(4, 14, 22, 36, 8), r(4, 14, 34, 36, 8),
    r(2, 14, 28, 4, 12), r(6, 16, 30, 2, 8), r(7, 16, 32, 2, 4),
    r(5, 18, 18, 28, 4), r(5, 18, 42, 28, 4)
  ];
  rect(scene, 'furn_keg', keg, 64, 64);
  // Fireplace: brick pattern, mortar, fire layers, embers, mantel
  const fireplace = [];
  for (let by = 0; by < 128; by += 8) for (let bx = 0; bx < 128; bx += 8) {
    fireplace.push(r(6, bx + 1, by + 1, 6, 6));
    if ((bx + by) % 16 === 0) fireplace.push(r(7, bx + 2, by + 2, 4, 4));
  }
  fireplace.push(r(2, 8, 8, 112, 112), r(1, 16, 16, 96, 96));
  fireplace.push(r(13, 24, 84, 80, 32), r(22, 28, 88, 72, 24), r(14, 32, 92, 64, 16), r(15, 36, 96, 56, 8));
  fireplace.push(r(14, 40, 90, 8, 8), r(14, 72, 94, 8, 8), r(14, 96, 90, 8, 8));
  fireplace.push(r(3, 4, 4, 120, 8), r(4, 6, 6, 116, 4), r(3, 4, 116, 120, 8));
  rect(scene, 'furn_fireplace', fireplace, 128, 128);
  // Plant: pot ridges, soil, multiple leaves, veins
  const plant = [
    r(3, 20, 40, 24, 24), r(2, 22, 42, 20, 20), r(4, 24, 44, 16, 4), r(4, 24, 52, 16, 4), r(17, 26, 46, 12, 2), r(17, 26, 54, 12, 2),
    r(11, 14, 8, 14, 28), r(19, 16, 10, 10, 24), r(1, 18, 14, 4, 8), r(11, 18, 22, 6, 14),
    r(11, 26, 0, 14, 32), r(19, 28, 4, 10, 26), r(1, 30, 8, 4, 10), r(11, 30, 18, 6, 14),
    r(11, 38, 8, 14, 28), r(19, 40, 10, 10, 24), r(1, 42, 14, 4, 8), r(11, 42, 22, 6, 14),
    r(19, 20, 16, 8, 6), r(19, 36, 18, 8, 6)
  ];
  rect(scene, 'furn_plant', plant, 64, 64);
  // Painting: ornate frame, inner border, canvas, simple landscape
  const painting = [
    r(2, 0, 0, 64, 128), r(4, 2, 2, 60, 124), r(5, 4, 4, 56, 120), r(3, 6, 6, 52, 116),
    r(5, 8, 8, 48, 24), r(4, 8, 36, 48, 24), r(9, 10, 10, 44, 18), r(11, 10, 38, 44, 18),
    r(19, 12, 12, 40, 8), r(19, 12, 42, 40, 8), r(2, 12, 60, 40, 56), r(3, 14, 64, 36, 48),
    r(19, 16, 66, 28, 12), r(11, 16, 80, 28, 24), r(19, 16, 106, 28, 12),
    r(14, 20, 88, 20, 8), r(5, 22, 90, 16, 4)
  ];
  rect(scene, 'furn_painting', painting, 64, 128);
  // Bookshelf: frame, many shelves, varied book spines
  const bookshelf = [
    r(2, 0, 0, 64, 128), r(3, 2, 2, 60, 124), r(4, 4, 4, 8, 120), r(4, 52, 4, 8, 120), r(4, 12, 4, 40, 4), r(4, 12, 120, 40, 4)
  ];
  const bookColors = [2, 3, 4, 5, 13, 12, 2, 4, 3, 5];
  for (let sy = 8; sy < 120; sy += 14) {
    bookshelf.push(r(3, 4, sy, 56, 6));
    for (let bx = 6; bx < 58; bx += 6) bookshelf.push(r(bookColors[(bx + sy) % 10], bx, sy + 6, 4, 6));
  }
  rect(scene, 'furn_bookshelf', bookshelf, 64, 128);
}
