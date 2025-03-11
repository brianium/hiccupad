# hiccupad

Convert HTML to Hiccup

Use at: https://brianium.github.io/hiccupad/

## About

Really just an excuse to deploy something small with [squint](https://github.com/squint-cljs/squint), [tailwindcss](https://tailwindcss.com/), and [daisyui](https://daisyui.com/).

app.cljs almost entirely written using [Cursor](https://www.cursor.com/) and [Claude 3.7 Sonnet](https://www.anthropic.com/claude/sonnet).

## Features

- Convert HTML to Hiccup
- Entirely client side
- Copy to clipboard
- Dark mode
- Mobile friendly
- Wraps multiple root elements in a `(list)` form

## Dev

Requires 
- [babashka](https://github.com/babashka/babashka) for building and development.
- [vite](https://vite.dev/)

To develop, just run the `bb dev` task:

```bash
$ bb dev
```

This will start squint's watch mode and the vite dev server. View the app at [http://localhost:5173](http://localhost:5173).


