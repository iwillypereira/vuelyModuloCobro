//Tempalte de la vista
import Full from 'Container/Full'

const proximospagos = () => import('Views/pagos/inicio');

export default {
    path: '/',
    component: Full,
    redirect: '/pagos',
    children: [
        {
            component: proximospagos,
            path: '/pagos',
            meta: {
                requiresAuth: false,
                title: 'message.listaPagos',
                breadcrumb: [
                    {
                      breadcrumbInactive: 'pagos /',
                    },
                    {
                      breadcrumbActive: 'inicio',
                     
                    }
                  ]
            }
        },
     
    ]
}
