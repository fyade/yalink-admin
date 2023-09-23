import { defineStore } from "pinia";
import { reactive } from "vue";

export const useTagsViewStore = defineStore('tagsView', () => {
  const state = reactive({
    list: []
  })

  const addOne = val => {
    state.list.push(val)
  }
  const delOne = val => {
    state.list.splice(state.list.indexOf(val), 1)
  }

  return {
    state,
    addOne,
    delOne
  }
})