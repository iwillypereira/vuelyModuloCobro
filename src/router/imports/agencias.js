//Tempalte de la vista
import Full from 'Container/Full'

const listaAgencias = () => import('Views/agencias/inicio');
const agencia = () => import('Views/agencias/agenciadetalle')

export default {
    path: '/',
    component: Full,
    redirect: '/agencias',
    children: [
        {
            component: listaAgencias,
            path: '/agencias',
            meta: {
                requiresAuth: false,
                title: 'message.listaAgencias',
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
        {
            component: agencia,
            path: '/agencias/:id',
            meta: {
                requiresAuth: false,
                title: 'Agencia',
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
