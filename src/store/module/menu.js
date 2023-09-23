import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { final } from "utils/base.js";

export const useMenuStore = defineStore('menu', () => {
  let menus = reactive({
    list: [],
    origin: []
  });

  let getMenus = () => {
    return menus.list;
  }

  let setMenus = infoArr => {
    menus.origin = infoArr;
    let arr_p = infoArr.filter(item => item.meParentId === final.DEFAULT_PARENT_ID);
    let arr_o = infoArr.filter(item => item.meParentId !== final.DEFAULT_PARENT_ID);
    for (let i = 0; i < arr_p.length; i++) {
      insChildren(arr_p[i], arr_o);
    }
    menus.list = arr_p;
  }
  let insChildren = (obj, arr) => {
    obj.children = [];
    let a = arr.filter(item => item.meParentId === obj.meId);
    arr = arr.filter(item => item.meParentId !== obj.meId);
    if (!!a && a.length > 0) {
      obj.children.push(...a);
      for (let i = 0; i < obj.children.length; i++) {
        insChildren(obj.children[i], arr);
      }
    }
  }

  return {
    getMenus,
    setMenus
  }
});
