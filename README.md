# Remix Flat Routes for Vite `import.meta.glob` & React Router on Astro

This repo contains an implementation of the [React Router 6.4 tutorial](https://reactrouter.com/en/main/start/tutorial) on top of [Astro](https://docs.astro.build/en/getting-started/) & [Bling](https://github.com/TanStack/bling).

The goal of this project is to create a file system router using [Vite's `import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import), matching the [Remix flat routing convention](http://remix.run/docs/en/main/file-conventions/route-files-v2) for Preact & React Router (similar to how [Analog's file system router](https://github.com/analogjs/analog/tree/main/packages/router) is implemented).

The relevant files are:

-   `/src/app/get-routes.tsx`: The file system route configurator implementation
-   `/src/app/get-routes.text.tsx`: Tests for the file system route configurator

## Tests

You can run `npm test` to run the tests or `npm run test:dev` to run the tests in watch mode. If you would like to view the test results within VS Code, you can install the [Vitest VS Code extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer). This will allow you to run your tests in watch mode in the editor and have instant feedback whenever you change code that makes the test fail:

![Vitest VS Code extension watch mode](https://i.ibb.co/YRhJj9f/Screen-Recording-2022-05-21-at-20-09-20.gif)

## 🔨 Flat Routes Convention

### Example (flat-files)

```
routes/
  _auth.forgot-password.tsx
  _auth.login.tsx
  _auth.reset-password.tsx
  _auth.signup.tsx
  _auth.tsx
  _landing.about.tsx
  _landing.index.tsx
  _landing.tsx
  app.calendar.$day.tsx
  app.calendar.index.tsx
  app.calendar.tsx
  app.projects.$id.tsx
  app.projects.tsx
  app.tsx
  app_.projects.$id.roadmap.tsx
  app_.projects.$id.roadmap[.pdf].tsx
```

As React Router routes:

```jsx
[
    {
        element: <Auth />,
        children: [
            {
                path: "forgot-password"
                element: <Forgot />
            },
                        {
                path: "login"
                element: <Login />
            },
            {
                path: "reset-password"
                element: <Reset />
            },
            {
                path: "signup"
                element: <Signup />
            },

        ]
    },
    {
        element: <Landing />,
        children: [
            {
                path: "about",
                element: <About />
            },
            {
                index: true,
                element: <Index />
            }
        ]
    },
    {
        path: "app",
        element: <App />,
        children: [
            {
                path: "calendar",
                element: <Calendar />,
                children: [
                    { path: ":day", element: <Day /> },
                    { index: true, element: <CalendarIndex /> },
                ]
            },
            {
                path: "projects",
                element: <Projects />
            }
        ]
    },
    { path: "app/projects/:id/roadmap", element: <Roadmap /> },
    { path: "app/projects/:id/roadmap.pdf" }
]
```

Individual explanations:

| filename                              | url                             | nests inside of...   |
| ------------------------------------- | ------------------------------- | -------------------- |
| `_auth.forgot-password.tsx`           | `/forgot-password`              | `_auth.tsx`          |
| `_auth.login.tsx`                     | `/login`                        | `_auth.tsx`          |
| `_auth.reset-password.tsx`            | `/reset-password`               | `_auth.tsx`          |
| `_auth.signup.tsx`                    | `/signup`                       | `_auth.tsx`          |
| `_auth.tsx`                           | n/a                             | `root.tsx`           |
| `_landing.about.tsx`                  | `/about`                        | `_landing.tsx`       |
| `_landing.index.tsx`                  | `/`                             | `_landing.tsx`       |
| `_landing.tsx`                        | n/a                             | `root.tsx`           |
| `app.calendar.$day.tsx`               | `/app/calendar/:day`            | `app.calendar.tsx`   |
| `app.calendar.index.tsx`              | `/app/calendar`                 | `app.calendar.tsx`   |
| `app.projects.$id.tsx`                | `/app/projects/:id`             | `app.projects.tsx`   |
| `app.projects.tsx`                    | `/app/projects`                 | `app.tsx`            |
| `app.tsx`                             | `/app`                          | `root.tsx`           |
| `app_.projects.$id.roadmap.tsx`       | `/app/projects/:id/roadmap`     | `root.tsx`           |
| `app_.projects.$id.roadmap[.pdf].tsx` | `/app/projects/:id/roadmap.pdf` | n/a (resource route) |

## Conventions

| filename                        | convention             | behavior                        |
| ------------------------------- | ---------------------- | ------------------------------- |
| `privacy.jsx`                   | filename               | normal route                    |
| `pages.tos.jsx`                 | dot with no layout     | normal route, `.` -> `/`        |
| `about.jsx`                     | filename with children | parent layout route             |
| `about.contact.jsx`             | dot                    | child route of layout           |
| `about._index.jsx`              | index filename         | index route of layout           |
| `about_.company.jsx`            | trailing underscore    | url segment, no layout          |
| `app_.projects.$id.roadmap.tsx` | trailing underscore    | change default parent layout    |
| `_auth.jsx`                     | leading underscore     | layout nesting, no url segment  |
| `_auth.login.jsx`               | leading underscore     | child of pathless layout route  |
| `users.$userId.jsx`             | leading $              | URL param                       |
| `docs.$.jsx`                    | bare $                 | splat route                     |
| `dashboard.route.jsx`           | route suffix           | optional, ignored completely    |
| `investors/[index].jsx`         | brackets               | escapes conventional characters |

### Example (flat-folders)

```
routes/
  _auth.forgot-password.tsx
  _auth.login.tsx
  _auth.tsx
  _landing.about.tsx
  _landing.index.tsx
  _landing.tsx
  app.projects.tsx
  app.projects.$id.tsx
  app.tsx
  app_.projects.$id.roadmap.tsx
```

Each route becomes a folder with the route name minus the file extension. The route file then is named _route.tsx_.

So _app.projects.tsx_ becomes _app.projects/route.tsx_

```
routes/
  _auth/
    route.tsx x <- route file (same as _auth.tsx)
  _auth.forgot-password/
    route.tsx  <- route file (same as _auth.forgot-password.tsx)
  _auth.login/
    route.tsx   <- route files (same as _auth.login.tsx)
  _landing.about/
    route.tsx   <- route file (same as _landing.about.tsx)
    employee-profile-card.tsx
    get-employee-data.server.tsx
    team-photo.jpg
  _landing.index/
    route.tsx   <- route file (same as _landing.index.tsx)
    scroll-experience.tsx
  _landing/
    route.tsx   <- route file (same as _landing.tsx)
    header.tsx
    footer.tsx
  app/
    route.tsx   <- route file (same as app.tsx)
    primary-nav.tsx
    footer.tsx
  app_.projects.$id.roadmap/
    route.tsx   <- route file (same as app_.projects.$id.roadmap.tsx)
    chart.tsx
    update-timeline.server.tsx
  app.projects/
    route.tsx <- layout file (sames as app.projects.tsx)
    project-card.tsx
    get-projects.server.tsx
    project-buttons.tsx
  app.projects.$id/
    route.tsx  <- route file (sames as app.projects.$id.tsx)
```
