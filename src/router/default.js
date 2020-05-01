import Full from 'Container/Full'
const gruposybodas = () => import('Views/bodasygrupos/bodasygrupos');
const detalleBodaGrupo = () => import('Views/bodasygrupos/bloqueo');
export default {
   path: '/',
   component: Full,
   redirect: '/default/dashboard/ecommerce',
   children: [      
      {
         path: '/default/bodasygrupos/',
         component: gruposybodas,
         meta: {
            requiresAuth: true,
            title: 'message.gruposYbodas',
           breadcrumb: [
              {
                breadcrumbInactive: 'CRM /'
              },
              {
                breadcrumbActive: 'Grupos y Bodas'
              }
            ]
         }
      },
      {
         path: '/default/bodasygrupos/bloqueo/:id',
         component: detalleBodaGrupo,
         meta: {
            requiresAuth: true,
            title: 'message.gruposYbodas',
           breadcrumb: [
              {
                breadcrumbInactive: 'CRM /'
              },
              {
                breadcrumbActive: 'Grupos y Bodas'
              }
            ]
         }
      },
       
   ]
}
