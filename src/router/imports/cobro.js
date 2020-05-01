//Tempalte de la vista
import Full from 'Container/Full'

const listaAgencias = () => import('Views/cobro/cobro');
export default {
    path: '/cobro',
    component: Full,
    redirect: '/cobro/',
    children: [
        {
            component: listaAgencias,
            path: '/cobro/',
            meta: {
                requiresAuth: false,
                title: 'message.mod_cobro',
                breadcrumb: [
                    {
                        breadcrumbInactive: 'cobro /',
                    },
                    {
                        breadcrumbActive: 'inicio',

                    }
                ]
            }
        },
       

    ]
}
