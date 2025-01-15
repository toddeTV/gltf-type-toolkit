import Handlebars from 'handlebars'
import './templates/_partials/register__generated.js'

// Join strings with a separator.
Handlebars.registerHelper('join', (list, options) =>
  list.map((item: any) => options.fn(item, { data: options.data })).join(options.hash.sep))

// Create an array with a single element.
Handlebars.registerHelper('singleton', val => [val])

// Append an element to an array.
Handlebars.registerHelper('append', (arr, val) => [...arr, val])
