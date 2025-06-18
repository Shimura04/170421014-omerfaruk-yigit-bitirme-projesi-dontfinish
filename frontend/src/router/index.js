import { useAuth } from '@/composables/useAuth'
import Clusters from '@/views/Clusters.vue'
import Index from '@/views/Index.vue'
import K8sDashboard from '@/views/K8sDashboard.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/user/:id',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'clusters',
          name: 'clusters',
          component: Clusters,
          children: [
            {
              path: ':name',
              name: 'config',
              component: K8sDashboard,
            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const { checkAuth } = useAuth()
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return next('/login')
    }
  }

  next()
})

export default router
