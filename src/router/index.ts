import { createRouter, createWebHashHistory } from 'vue-router'
import WheelView from '../views/WheelView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue')
        },
        {
            path: '/vocab-list',
            name: 'vocab-list',
            component: () => import('../views/VocabularyListView.vue')
        },
        {
            path: '/alphabet',
            name: 'alphabet',
            component: () => import('../views/AlphabetView.vue')
        },
        {
            path: '/wheel',
            name: 'wheel',
            component: WheelView
        }
    ],
})

export default router