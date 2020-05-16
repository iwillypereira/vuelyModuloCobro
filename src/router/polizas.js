//Tempalte de la vista
import Full from 'Container/Full'

const polizas = () => import('Views/Polizas/tablaPolizas');

export default {
    path: '/polizas',
    component: Full,
    redirect: '/polizas',
    children: [
        {
            component: polizas,
            path: '/polizas',
            meta: {
                requiresAuth: false,
                title: 'Pólizas',
                breadcrumb: [
                    {
                        breadcrumbInactive: 'pólizas /',
                    },
                    {
                        breadcrumbActive: 'inicio',

                    }
                ]
            }
        },

    ]
}
