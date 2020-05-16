//Tempalte de la vista
import Full from 'Container/Full'

const viewNotificaciones = () => import('Views/notificaciones/notificaciones');

export default {
    path: '/notificaciones',
    component: Full,
    redirect: '/notificaciones',
    children: [
        {
            component: viewNotificaciones,
            path: '/notificaciones',
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
    ]
}
