# materialwind-docs

Documentation site for [materialwind-css][pkg], the Material Design 3 color
system for Tailwind CSS 4.

Live at **[materialwind.saade.dev](https://materialwind.saade.dev/)**.

## Development

```sh
npm install
npm run dev
```

The site depends on the published `materialwind-css` package, so it shows what
users actually install. To preview an unreleased change to the plugin, point the
dependency at a local checkout:

```sh
npm install ../materialwind
```

## Deploying

Pushes to `main` build and deploy to GitHub Pages. `actions/configure-pages`
resolves the base path, so the same build works on the custom domain and on a
`github.io` project path without any code change.

[pkg]: https://github.com/saade/materialwind

## License

MIT
