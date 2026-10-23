#!/usr/bin/env python3
"""WCAG 2.x contrast ratio between colours.

Usage:
  python contrast.py FG BG                 # one pair, e.g. python contrast.py 3f8cff ffffff
  python contrast.py --matrix FG1,FG2 BG1,BG2   # every foreground on every background

Colours are hex (#rgb, #rrggbb). Prints the ratio and AA/AAA verdicts for normal text,
large text (24px, or 18.66px bold) and UI components (3:1).
"""
import sys


def parse(hex_colour):
    h = hex_colour.strip().lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    if len(h) != 6:
        raise SystemExit(f'not a hex colour: {hex_colour}')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def luminance(rgb):
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(fg, bg):
    a, b = sorted((luminance(parse(fg)), luminance(parse(bg))), reverse=True)
    return (a + 0.05) / (b + 0.05)


def verdict(r):
    return (f"normal {'AA' if r >= 4.5 else 'FAIL'}{' AAA' if r >= 7 else ''} | "
            f"large {'AA' if r >= 3 else 'FAIL'} | UI {'pass' if r >= 3 else 'FAIL'}")


def main(argv):
    if len(argv) == 3 and argv[0] == '--matrix':
        fgs, bgs = argv[1].split(','), argv[2].split(',')
        for bg in bgs:
            for fg in fgs:
                r = ratio(fg, bg)
                print(f'{fg:>8} on {bg:<8} {r:5.2f}:1  {verdict(r)}')
        return
    if len(argv) != 2:
        raise SystemExit(__doc__)
    r = ratio(argv[0], argv[1])
    print(f'{r:.2f}:1  {verdict(r)}')


if __name__ == '__main__':
    main(sys.argv[1:])
