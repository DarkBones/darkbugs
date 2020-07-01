require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

import 'stylesheets/application'
import 'jquery'
import 'popper.js'
import 'bootstrap'
import '../i18n'

window.jQuery = $;
window.$ = $;
// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);
