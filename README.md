# Remix Flat Routes for Vite `import.meta.glob` & React Router on Astro

This repo contains an implementation of the [React Router 6.4 tutorial](https://reactrouter.com/en/main/start/tutorial) on top of [Astro](https://docs.astro.build/en/getting-started/) & [Bling](https://github.com/TanStack/bling).

The goal of this project is to create a file system router using [Vite's `import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import), matching the [Remix flat routing convention](http://remix.run/docs/en/main/file-conventions/route-files-v2) for Preact & React Router (similar to how [Analog's file system router](https://github.com/analogjs/analog/tree/main/packages/router) is implemented).

The relevant files are:

-   `/src/app/get-routes.tsx`: The file system route configurator implementation
-   `/src/app/get-routes.text.tsx`: Tests for the file system route configurator

## Tests

You can run `npm test` to run the tests or `npm run test:dev` to run the tests in watch mode. If you would like to view the test results within VS Code, you can install the [Vitest VS Code extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer). This will allow you to run your tests in watch mode in the editor and have instant feedback whenever you change code that makes the test fail:

![Vitest VS Code extension watch mode](https://i.ibb.co/YRhJj9f/Screen-Recording-2022-05-21-at-20-09-20.gif)
