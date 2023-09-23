import { useMenuStore } from 'store/module/menu.js';
import { usePageStore } from 'store/module/page.js';
import { useTagsViewStore } from "store/module/tagsView.js";
import { useUserStore } from 'store/module/user.js';

export default function useStore() {
  return {
    menu: useMenuStore(),
    page: usePageStore(),
    tagsView: useTagsViewStore(),
    user: useUserStore()
  }
}
