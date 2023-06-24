import { usePageStore } from 'store/page.js';
import { useUserStore } from 'store/user.js';
import { useMenuStore } from 'store/menu.js';

export default function useStore() {
  return {
    page: usePageStore(),
    user: useUserStore(),
    menu: useMenuStore()
  }
}
