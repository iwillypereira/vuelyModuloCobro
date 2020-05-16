//Tempalte de la vista
import Full from 'Container/Full'

const catalogoCuentas = () => import('Views/catalogoCuentas/index');

export default {
    path: '/catalogoCuentas',
    component: Full,
    redirect: '/catalogoCuentas',
    children: [
        {
            component: catalogoCuentas,
            path: '/catalogoCuentas',
            meta: {
                requiresAuth: false,
                title: 'message.catalogoCuentas',
                breadcrumb: [
                    {
                        breadcrumbInactive: 'catálogo de cuentas /',
                    },
                    {
                        breadcrumbActive: 'inicio',

                    }
                ]
            }
        },

    ]
}
