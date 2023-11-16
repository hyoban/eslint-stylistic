/**
 * @fileoverview Rule to check for tabs inside a file
 * @author Gyandeep Singh
 */

import { createRule } from '../../utils/createRule'

const tabRegex = /\t+/gu
const anyNonWhitespaceRegex = /\S/u

export default createRule({
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow all tabs',
      url: 'https://eslint.style/rules/js/no-tabs',
    },
    schema: [{
      type: 'object',
      properties: {
        allowIndentationTabs: {
          type: 'boolean',
          default: false,
        },
      },
      additionalProperties: false,
    }],

    messages: {
      unexpectedTab: 'Unexpected tab character.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const allowIndentationTabs = context.options && context.options[0] && context.options[0].allowIndentationTabs

    return {
      Program(node) {
        sourceCode.getLines().forEach((line, index) => {
          let match

          while ((match = tabRegex.exec(line)) !== null) {
            if (allowIndentationTabs && !anyNonWhitespaceRegex.test(line.slice(0, match.index)))
              continue

            context.report({
              node,
              loc: {
                start: {
                  line: index + 1,
                  column: match.index,
                },
                end: {
                  line: index + 1,
                  column: match.index + match[0].length,
                },
              },
              messageId: 'unexpectedTab',
            })
          }
        })
      },
    }
  },
})
