# A designed poster for the studio's Roblox maps section: a voxel island (mud-brick Najdi house,
# tower with crenels, palms, dunes) in isometric blocks on the studio navy, sunset-orange sun.
from PIL import Image, ImageDraw, ImageFilter
import math, random
W, H = 1672*2, 941*2
img = Image.new('RGB', (W, H))
px = img.load()
top, bot = (11, 23, 48), (27, 44, 78)
for y in range(H):
    t = y / H
    c = tuple(int(top[i]*(1-t) + bot[i]*t) for i in range(3))
    for x in range(W): px[x, y] = c
d = ImageDraw.Draw(img, 'RGBA')
# sun
cx, cy = int(W*0.22), int(H*0.26)
for r in range(260, 0, -4):
    a = int(14 + 120*(1 - r/260)**2)
    d.ellipse((cx-r, cy-r, cx+r, cy+r), fill=(255, 138, 61, a if r > 150 else 255))
# faint brand-like squares
random.seed(3)
for i in range(26):
    s = random.randint(30, 90); x = random.randint(0, W); y = random.randint(0, int(H*0.6))
    d.rectangle((x, y, x+s, y+s), outline=(160, 185, 225, 28), width=4)
S = 74  # block size (px), isometric
OX, OY = W//2 + 40, int(H*0.55)
def iso(gx, gy, gz):
    return (OX + (gx - gy) * S, OY + (gx + gy) * S * 0.5 - gz * S)
def shade(c, k): return tuple(max(0, min(255, int(v*k))) for v in c)
blocks = {}
def put(x, y, z, c): blocks[(x, y, z)] = c
SAND, SAND2 = (232, 196, 140), (214, 172, 112)
MUD, MUD2 = (196, 128, 72), (176, 110, 60)
DOOR, WOOD = (60, 120, 140), (110, 70, 40)
GREEN, GREEN2, TRUNK = (110, 170, 80), (80, 140, 60), (140, 100, 60)
R = 7
for x in range(-R, R+1):
    for y in range(-R, R+1):
        if x*x + y*y <= R*R + 2:
            h = 1 + (1 if (x + y) % 5 == 0 and abs(x) > 3 else 0)
            for z in range(h): put(x, y, z, SAND if (x + y) % 2 else SAND2)
# house
for x in range(-3, 2):
    for y in range(-2, 2):
        for z in range(1, 4):
            if x in (-3, 1) or y in (-2, 1) or z == 3: put(x, y, z, MUD if (x+y+z) % 2 else MUD2)
for x in range(-3, 2, 2): put(x, 1, 4, MUD)   # crenels along the front
for y in range(-2, 2, 2): put(1, y, 4, MUD)
put(-1, 1, 1, DOOR); put(-1, 1, 2, DOOR)
# tower
for z in range(1, 7):
    for x in (3, 4):
        for y in (-3, -2): put(x, y, z, MUD if (x+y+z) % 2 else MUD2)
put(3, -3, 7, MUD); put(4, -2, 7, MUD)
# palms
for (px_, py_) in ((-5, 3), (5, 0), (-4, -4)):
    for z in range(1, 5): put(px_, py_, z, TRUNK)
    for dx, dy in ((0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)): put(px_+dx, py_+dy, 5, GREEN if (dx+dy) % 2 else GREEN2)
    for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2)): put(px_+dx, py_+dy, 4, GREEN2)
# a small blocky figure by the door
put(0, 3, 1, (240, 240, 240)); put(0, 3, 2, (240, 240, 240)); put(0, 3, 3, (226, 70, 60))
# draw back to front
for (x, y, z) in sorted(blocks, key=lambda k: (k[0] + k[1], k[2])):
    c = blocks[(x, y, z)]
    T = iso(x, y, z + 1); Rr = iso(x + 1, y, z + 1); Bk = iso(x, y + 1, z + 1); F = iso(x + 1, y + 1, z + 1)
    Fb = iso(x + 1, y + 1, z); Rb = iso(x + 1, y, z); Bb = iso(x, y + 1, z)
    d.polygon([T, Rr, F, Bk], fill=shade(c, 1.08), outline=shade(c, 0.85))
    d.polygon([Bk, F, Fb, Bb], fill=shade(c, 0.82), outline=shade(c, 0.7))
    d.polygon([Rr, F, Fb, Rb], fill=shade(c, 0.66), outline=shade(c, 0.55))
img = img.resize((1672, 941), Image.LANCZOS)
img.save('roblox-maps-poster.webp', quality=90, method=6)
img.resize((836, 470)).save('prev.png')
