# Human Resource Management System (HRMS)

## 🚀 Introduction
The Human Resource Management System (HRMS) is a comprehensive, enterprise-grade web application built with modern technologies to streamline and optimize HR operations for organizations of all sizes. This Next.js-powered platform offers a seamless experience for both employees and administrators, with a focus on performance, security, and user experience.

Designed with scalability in mind, HRMS provides a robust solution for workforce management, time tracking, leave administration, and internal communications. The application leverages React 19's latest features, Next.js 15's App Router, and a PWA architecture to deliver a responsive, offline-capable experience across desktop and mobile devices.

Key technical highlights include:
- Built with Next.js 15.1.0 and React 19.0.0 for optimal performance
- Fully responsive design with Tailwind CSS 3.4
- Progressive Web App (PWA) capabilities with offline support
- Real-time notifications with Firebase Cloud Messaging
- Multi-language support with next-intl v3
- Comprehensive SEO optimization
- Enterprise-grade security with NextAuth v5

## Automated Changelog and Build Optimizations

This project includes automated tools to improve the development workflow:

### Automated Changelog

The CHANGELOG.md file is automatically updated based on commit messages using the Conventional Commits format. This happens in three ways:

1. **Pre-commit Hook**: When you commit changes, the pre-commit hook automatically updates the CHANGELOG.md file.
2. **Manual Update**: You can manually update the changelog with `npm run update-changelog`.
3. **GitHub Action**: A GitHub Action automatically updates the changelog when pushing to the main branch.

To specify the version increment type:
- `npm run update-changelog` (patch version)
- `npm run update-changelog:minor` (minor version)
- `npm run update-changelog:major` (major version)

### Sentry Warning Fixes

The project includes a script to fix Sentry warnings about serializing big strings in the webpack cache:

- The script automatically runs after each build (`npm run build`)
- You can manually run it with `npm run fix-sentry-warnings`
- It modifies the webpack cache configuration to use Buffer for large strings

## SEO Optimization

This project includes comprehensive SEO optimization features:

- **Dynamic Sitemap Generation**: Automatically generates a sitemap.xml file with all routes and locales.
- **Robots.txt Configuration**: Properly configured robots.txt with rules for different search engines.
- **Structured Data**: JSON-LD structured data for better search engine understanding.
- **Canonical URLs**: Proper canonical URL implementation to avoid duplicate content issues.
- **Alternate Language Links**: hreflang tags for multilingual content.
- **OpenGraph and Twitter Cards**: Rich social media sharing metadata.
- **Metadata API**: Centralized metadata management using Next.js Metadata API.
- **Protected Routes**: Admin routes are protected from search engine indexing.

## PWA Support

The application is fully PWA-compatible with the following features:

- **Offline Support**: Works offline with cached resources.
- **Installable**: Can be installed on mobile and desktop devices.
- **Responsive Design**: Optimized for all screen sizes.
- **Splash Screens**: Custom splash screens for different devices.
- **App Icons**: Comprehensive set of icons for various platforms.
- **Background Sync**: Synchronizes data when coming back online.
- **Push Notifications**: Real-time notifications for important updates.

## Notification System

The application includes a comprehensive notification system:

- **Real-time Notifications**: Instant notifications for important events.
- **Push Notifications**: Mobile and desktop push notifications.
- **Notification Center**: Centralized place to view all notifications.
- **Background Sync**: Notifications are synchronized when coming back online.
- **Customizable**: Users can customize notification preferences.
- **FCM Integration**: Firebase Cloud Messaging for reliable delivery.

## Features
### Employee Features
- **Time Tracking**: View detailed check-in and check-out logs for tracking working hours.
- **Leave Management**: Access leave history and apply for leave requests.
- **Announcements**: Stay updated with company-wide announcements.
- **Notifications**: Receive real-time notifications for important updates.

### Admin Features
- **Employee Management**: Manage and update employee records.
- **Leave Management**: Approve or reject employee leave requests.
- **Time Tracking**: Monitor employee attendance and time logs.
- **Announcements**: Publish company-wide announcements.
- **Notification Management**: Send notifications to employees.

### Project structure

```shell
.
├── README.md                       # README file
├── .github                         # GitHub folder
├── .husky                          # Husky configuration
├── .storybook                      # Storybook folder
├── .vscode                         # VSCode configuration
├── certificates                    # SSL certificates for local development
├── migrations                      # Database migrations
├── public                          # Public assets folder
├── scripts                         # Build and deployment scripts
├── src
│   ├── app                         # Next.js App Router
│   │   ├── api                     # API routes
│   │   └── [locale]                # Localized routes
│   ├── components                  # React components
│   ├── constants                   # Application constants
│   ├── containers                  # Container components
│   ├── context                     # React context providers
│   ├── enums                       # TypeScript enums
│   ├── hooks                       # Custom React hooks
│   ├── Interceptors                # API interceptors
│   ├── interfaces                  # TypeScript interfaces
│   ├── lib                         # Core library code
│   ├── libs                        # Third-party library integrations
│   ├── locales                     # i18n translation files
│   ├── styles                      # Global styles
│   ├── types                       # TypeScript type definitions
│   ├── utils                       # Utility functions
│   ├── validations                 # Form validation schemas
│   ├── middleware.ts               # Next.js middleware
│   └── instrumentation.ts          # Monitoring instrumentation
├── tests
│   ├── e2e                         # E2E tests with Playwright
│   └── integration                 # Integration tests
├── auth.ts                         # Authentication configuration
├── checkly.config.ts               # Monitoring configuration
├── commitlint.config.ts            # Commit linting rules
├── components.json                 # UI component configuration
├── crowdin.yml                     # Translation service config
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Project dependencies
├── playwright.config.ts            # E2E testing configuration
├── postcss.config.js               # CSS processing configuration
├── sentry.client.config.ts         # Error monitoring for client
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vitest.config.mts               # Unit testing configuration
```

### Philosophy

- Nothing is hidden from you, allowing you to make any necessary adjustments to suit your requirements and preferences.
- Dependencies are regularly updated on a monthly basis
- Start for free without upfront costs
- Easy to customize
- Minimal code
- Unstyled template
- SEO-friendly
- 🚀 Production-ready

### Requirements

- Node.js 20+ and npm

###  Setup and Installation
For your information, all dependencies are updated every month.
#### Step 1: Clone the Repository
```shell
https://github.com/Code-Huddle/HRMS-NEXTJS-FRONTEND.git
cd HRMS-NEXTJS-FRONTEND
```
#### Step 2: Install dependencies
```shell
npm install
```
#### Step 3: Set up environment variables
Create a .env file and configure your API keys and database connection
#### Step 4:
```shell
npm run dev
```
Open http://localhost:3000 with your favorite browser to see your project.

### Developer Experience

Developer experience first, extremely flexible code structure and only keep what you need:

- ⚡ [Next.js](https://nextjs.org) 15.1.0 with App Router support
- 🔥 Type checking [TypeScript](https://www.typescriptlang.org)
- 💎 Integrate with [Tailwind CSS](https://tailwindcss.com) 3.4
- ✅ Strict Mode for TypeScript and React 19
- 👤 Passwordless Authentication with, Social Auth (Google , GitHub), Passwordless login with Passkeys, User Impersonation
- 💽 Offline and local development database with PGlite
- 🌐 Multi-language (i18n) with [next-intl](https://next-intl-docs.vercel.app/) v3 and [Crowdin](https://l.crowdin.com/next-js)
- ♻️ Type-safe environment variables with T3 Env
- ⌨️ Form handling with React Hook Form
- 🔴 Validation library with Zod
- 📏 Linter with [ESLint](https://eslint.org) v9 (default Next.js, Next.js Core Web Vitals, Tailwind CSS and Antfu configuration)
- 💖 Code Formatter with [Prettier](https://prettier.io)
- 🦊 Husky for Git Hooks
- 🚫 Lint-staged for running linters on Git staged files
- 🚓 Lint git commit with Commitlint
- 📓 Write standard compliant commit messages with Commitizen
- 🦺 Unit Testing with Vitest v2 and React Testing Library
- 🧪 Integration and E2E Testing with Playwright v1.49
- 👷 Run tests on pull request with GitHub Actions
- 🎉 Storybook v8 for UI development
- 🚨 Error Monitoring with [Sentry](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) v8
- ☂️ Code coverage with [Codecov](https://about.codecov.io/codecov-free-trial/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo)
- 📝 Logging with Pino.js and Log Management with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate)
- 🖥️ Monitoring as Code with [Checkly](https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate)
- 🔐 Security and bot protection ([Arcjet](https://launch.arcjet.com/Q6eLbRE))
- 🎁 Automatic changelog generation with Semantic Release
- 🔍 Visual testing with Percy (Optional)
- 💡 Absolute Imports using `@` prefix
- 🗂 VSCode configuration: Debug, Settings, Tasks and Extensions
- 🤖 SEO metadata, JSON-LD and Open Graph tags
- 🗺️ Sitemap.xml and robots.txt
- ⌘ Database exploration with Drizzle Studio and CLI migration tool with Drizzle Kit
- ⚙️ [Bundler Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- 🌈 Include a FREE minimalist theme
- 💯 Maximize lighthouse score
- 📱 PWA Support with offline capabilities and push notifications

Built-in feature from Next.js:

- ☕ Minify HTML & CSS
- 💨 Live reload
- ✅ Cache busting

### Set up authentication

The Auth Version 5 beta is already done. You just have have to change the environment variables in .env.local file and then update the api in the auth.ts file.

### Translation (i18n) setup

For translation, the project uses `next-intl` combined with [Crowdin](https://l.crowdin.com/next-js). As a developer, you only need to take care of the English (or another default language) version. Translations for other languages are automatically generated and handled by Crowdin. You can use Crowdin to collaborate with your translation team or translate the messages yourself with the help of machine translation.

To set up translation (i18n), create an account at [Crowdin.com](https://l.crowdin.com/next-js) and create a new project. In the newly created project, you will be able to find the project ID. You will also need to create a new Personal Access Token by going to Account Settings > API. Then, in your GitHub Actions, you need to define the following environment variables: `CROWDIN_PROJECT_ID` and `CROWDIN_PERSONAL_TOKEN`.

After defining the environment variables in your GitHub Actions, your localization files will be synchronized with Crowdin every time you push a new commit to the `main` branch.

### Customization

You can easily configure Next js Boilerplate by searching the entire project for `FIXME:` to make quick customizations. Here are some of the most important files to customize:

- `public/apple-touch-icon.png`, `public/favicon.ico`, `public/favicon-16x16.png` and `public/favicon-32x32.png`: your website favicon
- `src/utils/AppConfig.ts`: configuration file
- `src/templates/BaseTemplate.tsx`: default theme
- `next.config.mjs`: Next.js configuration
- `.env`: default environment variables

You have full access to the source code for further customization. The provided code is just an example to help you start your project. The sky's the limit 🚀.

### Commit Message Format

The project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification, meaning all commit messages must be formatted accordingly. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is the ability to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

### Testing

All unit tests are located alongside the source code in the same directory, making them easier to find. The project uses Vitest and React Testing Library for unit testing. You can run the tests with the following command:

```shell
npm run test
```

### Integration & E2E Testing

The project uses Playwright for integration and end-to-end (E2E) testing. You can run the tests with the following commands:

```shell
npx playwright install # Only for the first time in a new environment
npm run test:e2e
```

In the local environment, visual testing is disabled, and the terminal will display the message `[percy] Percy is not running, disabling snapshots.`. By default, visual testing only runs in GitHub Actions.

### Enable Edge runtime (optional)

The App Router folder is compatible with the Edge runtime. You can enable it by adding the following lines `src/app/layouts.tsx`:

```tsx
export const runtime = 'edge';
```

```tsx
await migrate(db, { migrationsFolder: './migrations' });
```

After disabling it, you are required to run the migration manually with:

```shell
npm run db:migrate
```

You also require to run the command each time you want to update the database schema(THIS IS ONLY APPLICABLE IF YOU WANT TO INTEGRATE CLOUD SERVICE LIKE SUPABASE ETC).

### Deploy to production

During the build process, database migrations are automatically executed, so there's no need to run them manually. However, you must define `DATABASE_URL` in your environment variables.

Then, you can generate a production build with:

```shell
$ npm run build
```

It generates an optimized production build of the boilerplate. To test the generated build, run:

```shell
$ npm run start
```

This command starts a local server using the production build. You can now open http://localhost:3000 in your preferred browser to see the result.

### Error Monitoring

The project uses [Sentry](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) to monitor errors. In the development environment, no additional setup is needed: Next.js Boilerplate is pre-configured to use Sentry and Spotlight (Sentry for Development). All errors will automatically be sent to your local Spotlight instance, allowing you to experience Sentry locally.

For production environment, you'll need to create a Sentry account and a new project. Then, in `next.config.mjs`, you need to update the `org` and `project` attributes in `withSentryConfig` function. Additionally, add your Sentry DSN to `sentry.client.config.ts`, `sentry.edge.config.ts` and `sentry.server.config.ts`.

### Code coverage

Next.js Boilerplate relies on [Codecov](https://about.codecov.io/codecov-free-trial/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) for code coverage reporting solution. To enable Codecov, create a Codecov account and connect it to your GitHub account. Your repositories should appear on your Codecov dashboard. Select the desired repository and copy the token. In GitHub Actions, define the `CODECOV_TOKEN` environment variable and paste the token.

Make sure to create `CODECOV_TOKEN` as a GitHub Actions secret, do not paste it directly into your source code.

### Logging

The project uses Pino.js for logging. In the development environment, logs are displayed in the console by default.

For production, the project is already integrated with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) to manage and query your logs using SQL. To use Better Stack, you need to create a [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) account and create a new source: go to your Better Stack Logs Dashboard > Sources > Connect source. Then, you need to give a name to your source and select Node.js as the platform.

After creating the source, you will be able to view and copy your source token. In your environment variables, paste the token into the `LOGTAIL_SOURCE_TOKEN` variable. Now, all logs will automatically be sent to and ingested by Better Stack.

### Checkly monitoring

The project uses [Checkly](https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) to ensure that your production environment is always up and running. At regular intervals, Checkly runs the tests ending with `*.check.e2e.ts` extension and notifies you if any of the tests fail. Additionally, you have the flexibility to execute tests from multiple locations to ensure that your application is available worldwide.

To use Checkly, you must first create an account on [their website](https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate). After creating an account, generate a new API key in the Checkly Dashboard and set the `CHECKLY_API_KEY` environment variable in GitHub Actions. Additionally, you will need to define the `CHECKLY_ACCOUNT_ID`, which can also be found in your Checkly Dashboard under User Settings > General.

To complete the setup, update the `checkly.config.ts` file with your own email address and production URL.

### Arcjet security and bot protection

The project uses [Arcjet](https://launch.arcjet.com/Q6eLbRE), a security as code product that includes several features that can be used individually or combined to provide defense in depth for your site.

To set up Arcjet, [create a free account](https://launch.arcjet.com/Q6eLbRE) and get your API key. Then add it to the `ARCJET_KEY` environment variable.

Arcjet is configured with two main features: bot detection and the Arcjet Shield WAF:

- [Bot detection](https://docs.arcjet.com/bot-protection/concepts) is configured to allow search engines, preview link generators e.g. Slack and Twitter previews, and to allow common uptime monitoring services. All other bots, such as scrapers and AI crawlers, will be blocked. You can [configure additional bot types](https://docs.arcjet.com/bot-protection/identifying-bots) to allow or block.
- [Arcjet Shield WAF](https://docs.arcjet.com/shield/concepts) will detect and block common attacks such as SQL injection, cross-site scripting, and other OWASP Top 10 vulnerabilities.

Arcjet is configured with a central client at `src/libs/Arcjet.ts` that includes the Shield WAF rules. Additional rules are configured in `src/app/[locale]/layout.tsx` based on the page type.

### Useful commands

#### Bundle Analyzer

Next.js Boilerplate includes a built-in bundle analyzer. It can be used to analyze the size of your JavaScript bundles. To begin, run the following command:

```shell
npm run build-stats
```

By running the command, it'll automatically open a new browser window with the results.

### VSCode information (optional)

If you are VSCode user, you can have a better integration with VSCode by installing the suggested extension in `.vscode/extension.json`. The starter code comes up with Settings for a seamless integration with VSCode. The Debug configuration is also provided for frontend and backend debugging experience.

With the plugins installed in your VSCode, ESLint and Prettier can automatically fix the code and display errors. The same applies to testing: you can install the VSCode Vitest extension to automatically run your tests, and it also shows the code coverage in context.

Pro tips: if you need a project wide-type checking with TypeScript, you can run a build with <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Mac.

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have any questions or find a bug. Totally open to suggestions and improvements.
