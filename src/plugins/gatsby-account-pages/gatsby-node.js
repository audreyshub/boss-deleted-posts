const chalk = require('chalk')

const gs = chalk.hex('#FFA500')

/**
 * ============================================================================
 * Reroute account pages.  onCreatePage doesn't run for pages generated from
 * templates within the same gatsby-node.js file. Hence, this separate one.
 * ============================================================================
 */

// Make sure all subfolders under /account all lead to account so Reach Router can handle the routing
exports.onCreatePage = async ({ page, actions }) => {
  if (page.path.match(/^\/account/)) {
    page.matchPath = '/account/*'
    actions.createPage(page)
  }
}
