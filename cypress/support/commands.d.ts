/**
 * @namespace Cypress
 * @interface Chainable
 * @template Subject
 *
 * Custom Cypress commands for interceptors, assertions, and utilities.
 */
declare namespace Cypress {
  interface Chainable<_Subject = any> {
    //INTERCEPTORS
    /**
     * Sets up interceptors for Google Home page requests.
     * @returns {Cypress.Chainable<readonly ['@loadFinishedRequest']>} Chainable containing the alias for the finished request.
     */
    googleHomeInterceptors(): Cypress.Chainable<readonly ['@loadFinishedRequest']>

    /**
     * Sets up interceptors for Gmail Home page requests.
     * @returns {Cypress.Chainable<readonly ['@loadFinishedRequest']>} Chainable containing the alias for the finished request.
     */
    gmailHomeInterceptors(): Cypress.Chainable<readonly ['@loadFinishedRequest']>
    /**
     * Sets up interceptors for Google Images Home page requests.
     * @returns {Cypress.Chainable<readonly ['@loadFinishedRequest']>} Chainable containing the alias for the finished request.
     */
    googleImagesHomeInterceptors(): Cypress.Chainable<readonly ['@loadFinishedRequest']>

    //ASSERTIONS

    /**
     * Asserts that the specified text is visible in the DOM.
     * @param {string} text - The text content to check for visibility.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isVisibleContent(text: string): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that all specified texts are visible in the DOM.
     * @param {string[]} texts - Array of text contents to check for visibility.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isVisibleContentMultiple(texts: string[]): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that the element matching the selector is visible.
     * @param {string} selector - The CSS selector of the element.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isVisibleElement(selector: string): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that all elements matching the selectors are visible.
     * @param {string[]} selectors - Array of CSS selectors.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isVisibleElementMultiple(selectors: string[]): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that the specified text is not visible in the DOM.
     * @param {string} text - The text content to check for invisibility.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isNotVisibleContent(text: string): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that all specified texts are not visible in the DOM.
     * @param {string[]} texts - Array of text contents to check for invisibility.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isNotVisibleContentMultiple(texts: string[]): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that the element matching the selector is not visible.
     * @param {string} selector - The CSS selector of the element.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isNotVisibleElement(selector: string): Cypress.Chainable<VoidFunction>

    /**
     * Asserts that all elements matching the selectors are not visible.
     * @param {string[]} selectors - Array of CSS selectors.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    isNotVisibleElementMultiple(selectors: string[]): Cypress.Chainable<VoidFunction>

    // UTILITIES
    /**
     * Retrieves the country code based on the current IP address.
     * @returns {Cypress.Chainable<string>} Chainable containing the country code as a string.
     */
    getCountryFromCurrentIp(): Cypress.Chainable<string>

    /**
     * Finds the closest scrollable parent of the currently chained element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement | null>>} Chainable containing the scrollable parent element or null.
     */
    findScrollableParent(): Cypress.Chainable<JQuery<HTMLElement | null>>

    /**
     * Clears cookies and local storage, then reloads the page.
     * @returns {Cypress.Chainable<VoidFunction>} Chainable for further commands.
     */
    cleanStateReload(): Cypress.Chainable<VoidFunction>

    getIframeBody(selector: string): Cypress.Chainable<JQuery<HTMLElement>>
  }
}
