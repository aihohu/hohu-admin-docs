import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import Hero from './components/Hero.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import QuickStart from './components/QuickStart.vue'
import TechStack from './components/TechStack.vue'
import FooterCTA from './components/FooterCTA.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Hero', Hero)
    app.component('FeatureGrid', FeatureGrid)
    app.component('QuickStart', QuickStart)
    app.component('TechStack', TechStack)
    app.component('FooterCTA', FooterCTA)
  }
}
