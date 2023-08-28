import dangerousOperation from "@/directive/modules/dangerousOperation.js";
import focus from "@/directive/modules/focus.js";
import noMoreClick from "@/directive/modules/noMoreClick.js";

const directivesList = {
  dangerousOperation,
  focus,
  noMoreClick
}

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key])
    })
  }
}

export default directives
