# Google Web Interface Test Suite

### Disclaimer

This project demonstrates an automated testing solution for Google's web interfaces using Cypress. It was created as part of a job interview task to showcase test automation skills and best practices.

In a real-world scenario where access to the application's code is available, I would definitely add `data-testid` attributes to elements. These attributes provide a reliable and maintainable way to select elements during testing, ensuring that tests are less prone to breaking due to changes in the UI structure or styling. Element selection would primarily be done using these `data-testid` selectors to enhance test stability and readability.

⚠️ **Important Note**: This test suite focuses on UI navigation and element verification. Automated search testing is intentionally excluded as it would violate Google's Terms of Service, which prohibits automated queries to their search engine.

## 🧪 Test Plan & Approach

### Testing Approach

This project uses a hybrid approach combining:

- **Page Object Model (POM)** - Encapsulates page elements and interactions into reusable classes
- **App Actions Pattern** - Implements high-level custom utilities and shorthands as cy chainable methods
- **Cross-browser & Cross-viewport Testing** - Tests run across different screen sizes and browsers
- **Multi-language Support** - Tests verify the application across multiple languages
- **Abstract Base Class** - Provides core functionality for all page objects

### What's Being Tested

The test suite verifies the following Google web interfaces and functionality:

1. **Google Homepage**

   - Initial load elements visibility across multiple viewports (desktop, tablet, mobile) and languages.
   - Cookie consent modal behavior, including visibility and dismissal.
   - Auto-complete suggestions when typing in the search input.
   - Recaptcha bot prevention triggered during suspected bot activity.

2. **Google Apps Menu**

   - Menu toggle functionality and visibility of all app items.
   - Proper menu dismissal when clicking outside the menu.

3. **Navigation**

   - Gmail navigation link functionality (skipped for Firefox due to cross-origin issues).
   - Google Images navigation link functionality, including intercepting and asserting network requests.

4. **Responsive Design**

   - Tests run across multiple device sizes (desktop, tablet, mobile) to ensure UI components adapt properly to different screen sizes.

5. **Internationalization**

   - Tests run in multiple languages (e.g., English, Polish) to verify translated elements display correctly and language-specific behaviors are handled properly.

## 📂 Project Structure

```
cypress/
  ├── e2e/                 # Test specifications
  │   └── google-search.cy.ts
  │
  ├── pages/               # Page Object Models
  │   ├── BasePage.ts      # Abstract base class for all page objects
  │   ├── GoogleHomePage.ts
  │   ├── GmailHomePage.ts
  │   └── ImagesHomePage.ts
  │
  ├── support/             # Support files and custom commands
  │   ├── commands/
  │   │   ├── assertions.ts    # Custom assertion commands
  │   │   ├── interceptors.ts  # Network request interceptors
  │   │   └── utils.ts         # Utility functions
  │   │
  │   ├── functions/           # Reusable helper functions
  │   │   ├── customArrayMethods.ts
  │   │   └── dataGetters.ts
  │   │
  │   ├── requirements/        # Test requirements and constants
  │   │   └── requirementVars.ts
  │   │
  │   ├── commands.d.ts        # Type definitions for custom commands
  │   ├── commands.ts          # Command aggregator
  │   ├── e2e.ts              # Global configuration for E2E tests
  │   └── types.ts            # TypeScript type definitions
  │
  └── translations/        # Localization resources
      └── appTranslations.ts  # Multi-language translation strings
```

## 🚀 Key Features

### 1. Page Object Model with App Actions

Each page is represented as a class, encapsulating selectors and providing chainable methods for interacting with the page:

```typescript
// Example from GoogleHomePage.ts
visit(language?: AppLanguage): this {
  cy.visit(this.getBaseUrl(language))
  return this
}

acceptCookiesIfPresent(language?: Language): this {
  // Implementation...
  return this
}
```

This approach allows for expressive, readable test scenarios:

```typescript
GoogleHomePage.visit().acceptCookiesIfPresent().openGoogleAppsMenu().assertGoogleAppsMenuIsVisible()
```

### 2. Abstract Base Page

An abstract `BasePage` class provides a foundation for all page objects with shared functionality:

```typescript
export abstract class BasePage {
  protected abstract urlTemplate: string

  protected getBaseUrl(language?: AppLanguage, overrideLangCode?: string): string {
    const langCode = overrideLangCode ?? languageCodeMap[language ?? DEFAULT_LANGUAGE]
    return this.urlTemplate.replace('{langCode}', langCode)
  }
}
```

This design:

- Enforces consistent URL handling across all pages
- Centralizes language-specific URL generation
- Promotes code reuse and maintainability
- Provides a standardized interface for all page objects

The abstract base class could be further expanded in the future to include more universal methods such as:

- Common navigation patterns
- Shared component interactions (headers, footers, etc.)
- Global error handling and standardized assertions

### 3. Multi-language & Localization Support

The test suite handles translations dynamically, allowing tests to run in multiple languages:

```typescript
LANGUAGES_TO_TEST.forEach(language => {
  it(`should check elements in ${language}`, () => {
    GoogleHomePage.visit(language)
    // Test assertions with localized strings
  })
})
```

### 4. Cross-viewport Testing

Tests run across multiple device sizes to ensure responsive design:

```typescript
VIEWPORTS.forEach(({ name, width, height }) => {
  it(`should check visibility on ${name} viewport`, () => {
    cy.viewport(width, height)
    // Test assertions for this viewport
  })
})
```

### 5. Custom Commands & Utilities

Numerous custom commands improve test readability and maintainability:

```typescript
cy.isVisibleContentMultiple(['Text 1', 'Text 2'])
cy.getCountryFromCurrentIp()
cy.findScrollableParent()
```

### 6. Continuous Integration Ready

The project includes a GitHub Actions workflow for continuous integration that:

- Automatically runs tests on pushes to main/master branches and pull requests
- Supports manual triggering via workflow_dispatch
- **Runs tests across multiple browsers (Chrome, Firefox, Electron)** using a matrix strategy
- Uses efficient caching strategies to optimize build times
- Automatically installs required browsers on the self-hosted runner

```yaml
# Cross-browser testing with GitHub Actions matrix
strategy:
  fail-fast: false
  matrix:
    browser: [chrome, firefox, electron]

steps:
  # Smart browser installation that checks before installing
  - name: Install browsers
    run: |
      echo "Installing required browsers for testing..."
      if [[ "${{ matrix.browser }}" == "firefox" ]]; then
        # Check if Firefox is already installed
        if ! brew list --cask firefox &>/dev/null; then
          echo "Firefox not found. Installing..."
          brew install --cask firefox
        else
          echo "Firefox is already installed. Skipping installation."
        fi
      elif [[ "${{ matrix.browser }}" == "chrome" ]]; then
        # Check if Chrome is already installed
        if ! brew list --cask google-chrome &>/dev/null; then
          echo "Chrome not found. Installing..."
          brew install --cask google-chrome
        else
          echo "Chrome is already installed. Skipping installation."
        fi
      fi
      # Electron browser comes bundled with Cypress
```

With a single self-hosted runner, the matrix strategy:

- Creates separate jobs for each browser configuration
- Executes these jobs sequentially (one after another)
- Installs browsers just-in-time when needed for that specific job
- Provides clean test runs with dedicated artifacts for each browser
- Ensures tests don't compete for system resources

This approach provides organized cross-browser testing while working within the constraints of limited CI resources.

The workflow is optimized to:

- Cache npm dependencies based on package-lock.json hash (only reinstalls when dependencies change)
- Separately cache the large Cypress binary (~1GB) to avoid repeated downloads
- Run tests on specific self-hosted runners for consistent environments
- Preserve screenshots and videos from failed test runs as artifacts

These optimizations significantly reduce CI execution time and resource usage by avoiding unnecessary dependency reinstallation across workflow runs.

### 7. Global Scope Management

The architecture separates concerns by placing cross-cutting functionality in the global e2e.ts file rather than in the Page Object classes:

```typescript
// e2e.ts handles global setup and cross-cutting concerns
import './commands'

Cypress.on('uncaught:exception', () => {
  return false
})
```

This pattern could be further expanded to include:

- Performance measurement methods
- Logging and reporting capabilities
- More navigation tests (...to google apps)
- Global test hooks (...for slack integration without the need of cypress cloud)
- Environment-specific configurations (...multiple configuration files for specific environments)
- Cron scheduled nightly test runs for multiple environments

This approach keeps the Page Objects focused on their core responsibility (page interactions) while global concerns are managed at the appropriate level.

## 🚀 Performance Considerations

To ensure the application performs optimally, the tests are configured with performance in mind:

- **Short Timeouts**: Assertions and page load timeouts are set to very short durations to quickly identify performance issues. This approach ensures that the application responds promptly and meets user expectations.

- **Why This Works for Google**: Google services are known for their speed and reliability. Setting short timeouts is practical and won't lead to flaky tests. Any timeout failures would likely indicate real performance issues rather than test instability.

### Example Configuration

In the Cypress configuration or test setup, timeouts are reduced:

```javascript
Cypress.config({
  defaultCommandTimeout: 2000, // 2 seconds for commands like `.should()`
  pageLoadTimeout: 5000,      // 5 seconds for page loads
});
```

This configuration ensures that the tests not only validate functionality but also provide insights into the application's responsiveness.

## 🛠️ ESLint Configuration

This project uses a custom ESLint configuration to enforce code quality and consistency. The configuration is defined in the `eslint.config.js` file and includes:

- **TypeScript Support**: Provides linting for TypeScript files.
- **Prettier Integration**: Automatically formats code to maintain a consistent style.

### Running ESLint

To check for linting errors, run:

```bash
npm run lint
```

To automatically fix linting issues, run:

```bash
npm run lint:fix
```

### IDE Integration

ESLint is integrated with the IDE, so warnings and errors are underlined in real-time during coding. This eliminates the need to manually run ESLint to check for issues, making the development process more efficient.

## 🧩 Git Hooks in the Testing Process

Git hooks are used to ensure code quality and prevent errors from being committed to the repository. This project uses `Husky` to manage Git hooks, and the following hook is configured:

- **Pre-commit Hook**: Runs ESLint and Prettier to check and format code before committing.

### Setting Up Git Hooks

Git hooks are automatically set up when you run `npm install`. If you need to manually set them up, run:

```bash
npx husky install
```

### Skipping Git Hooks

If you need to bypass Git hooks for any reason, you can use the `--no-verify` flag:

```bash
git commit -m "Your commit message" --no-verify
```

## 🔄 Running the Tests

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

```bash
# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm run cy:run
```

## 🌐 Browser & Device Coverage

Tests run on:

- **Browsers**:
  - Chrome
  - Firefox (installed on-demand by CI)
  - Electron (bundled with Cypress)
- **Viewports**:
  - Desktop (1920×1080)
  - Tablet (768×1024)
  - Mobile (500×667)

## 📋 Future Improvements

- Add visual regression testing
- Expand test coverage to search functionality (when access to the base app is granted)
- Add performance testing metrics
- Add API testing for backend services
- Implement data-driven test scenarios

### Why I would suggest switching to Playwright?

Playwright offers several advantages over Cypress, making it a compelling choice for end-to-end and component testing:

- **Free Parallelization and Test Sharding**: Playwright allows you to run tests in parallel and shard them across multiple workers without additional cost.
- **No Cross-Origin Issues**: Playwright eliminates the need for workarounds to handle cross-origin problems, simplifying test implementation.
- **No Need to Launch a Browser for API Tests**: API tests can be executed without launching a browser, saving resources and improving speed.
- **Async/Await Syntax**: Playwright's async/await-based syntax ensures clean, readable code without unnecessary nesting or callback hell.
- **Built-in Trace Viewer**: Playwright provides a built-in trace viewer for debugging, allowing you to inspect test execution step-by-step with screenshots, network requests, and console logs.
- **Browser Context Isolation**: Playwright enables isolated browser contexts, allowing parallel execution of tests without interference.
- **First-class Mobile Emulation**: Playwright supports robust mobile emulation, including geolocation, permissions, and device-specific settings.
- **Faster Execution**: Playwright is optimized for speed, often executing tests faster than other frameworks due to its modern architecture.
- **More Modular Approach**: Playwright's structure is more modular, allowing for better organization and scalability.
- **Less Opinionated Framework**: Playwright provides more freedom to structure tests and workflows according to your needs.
- **Better IDE Integration**: Playwright offers enhanced IDE integration, improving the developer experience.

## 📜 License

This project is part of a job interview task and is provided as a demonstration of testing skills.

---
