# Citizen Web App

### How do I get set up?

#### Prerequisites

1. `npm install`
2. `npm run serve` to serve the Angular app on `localhost:4200` without service workers

#### Use of service workers

Service workers augment the traditional web deployment model and empower applications to deliver a user experience with the reliability and performance on par with code that is written to run on your operating system and hardware. Adding a service worker to an Angular application is one of the steps for turning an application into a Progressive Web App (also known as a PWA).
[Continue reading](https://angular.io/guide/service-worker-intro)...

In order to deliver a good experience, we must ensure the app also works without service workers.

For service workers to be registered, the application must be accessed over HTTPS or accessed via `localhost`

1. `npm run watch` to watch and build the project on change or just `npm run build` to build once
2. `npm run start` to start the `http-server`
3. Access the app on `localhost:8080`

### Project structure

We adhere to the structure as described in [this article](https://www.devbyseb.com/article/best-practices-for-angular-app-development-folder-structure-naming-lazy-loading-and-more)

- `app` folder: This folder contains all the application-specific code.

- `app/core` folder: This folder contains the code that is shared across the entire application, such as services, models, guards, and interceptors. The `core.module.ts` file is responsible for importing and exporting these shared items.

- `app/modules` folder: This folder contains the feature modules of the application. Each feature module is organized into its own folder, which contains all the components, services, and routing information for that feature. The naming convention for feature modules is typically [feature-name].module.ts. Use lazy loading to load modules on-demand, improving the performance of the application and reducing the initial loading time.

- `app/shared` folder: This folder contains shared components, directives, and pipes that are used across the application. The `shared.module.ts` file is responsible for importing and exporting shared items, for instance `TranslateModule.forChild()`.

- `assets` folder: This folder contains static files used in the application, such as images, fonts, and stylesheets. The config.json file can also be stored here to hold any configuration data.

### Theming

We use [PrimeNG](https://primeng.org/theming) as UI suite for this project. Theming is also handled by PrimeNG and can be changed by the following steps:

- Navigate to `/assets/themes/mytheme` and make your changes
- Run `npm run theme` to generate the `theme.css` file (which is already imported in `/styles.sass`)
