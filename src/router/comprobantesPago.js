//Tempalte de la vista
import Full from 'Container/Full'

const comprobantesPago = () => import('Views/comprobantesPago/index');

export default {
    path: '/comprobantesPago',
    component: Full,
    redirect: '/comprobantesPago',
    children: [
        {
            component: comprobantesPago,
            path: '/comprobantesPago',
            meta: {
                requiresAuth: false,
                title: 'Comprobantes de Pago',
                breadcrumb: [
                    {
                        breadcrumbInactive: 'comprobantes de Pago /',
                    },
                    {
                        breadcrumbActive: 'inicio',

                    }
                ]
            }
        },

    ]
}
