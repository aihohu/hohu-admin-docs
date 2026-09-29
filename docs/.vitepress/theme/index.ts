import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import HoHuHome from './components/HoHuHome.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HoHuHome', HoHuHome);
  }
};
