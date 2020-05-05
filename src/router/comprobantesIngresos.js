//Tempalte de la vista
import Full from 'Container/Full'

const comprobantesIngresos = () => import('Views/comprobantesIngresos/consultaIngresos');

export default {
    path: '/consultaIngresos',
    component: Full,
    redirect: '/consultaIngresos',
    children: [
        {
            component: comprobantesIngresos,
            path: '/consultaIngresos',
            meta: {
                requiresAuth: false,
                title: 'Comprobantes de Ingresos',
                breadcrumb: [
                    {
                        breadcrumbInactive: 'agencias /',
                    },
                    {
                        breadcrumbActive: 'inicio',

                    }
                ]
            }
        },

    ]
}
