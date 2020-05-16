//Tempalte de la vista
import Full from 'Container/Full'

const ordenesPago = () => import('Views/ordenesPago/index');

export default {
    path: '/ordenesPago',
    component: Full,
    redirect: '/ordenesPago',
    children: [
        {
            component: ordenesPago,
            path: '/ordenesPago',
            meta: {
                requiresAuth: false,
                title: 'Ordenes de Pago',
                breadcrumb: [
                    {
                        breadcrumbInactive: 'Ordenes de Pago /',
                    },
                    {
                        breadcrumbActive: 'inicio',

                    }
                ]
            }
        },

    ]
}
