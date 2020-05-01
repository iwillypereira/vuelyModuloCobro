//Tempalte de la vista
import Full from 'Container/Full'
//Importar tu vista
const gruposybodas = () => import('Views/bodasygrupos/bodasygrupos');
const detalleBodaGrupo = () => import('Views/bodasygrupos/bloqueo');

export default {
    path: '/',
    component: Full,
    redirect: '/bodasgrupos',
    children: [      
       {
          path: '/bodasgrupos/',
          component: gruposybodas,
          meta: {
             requiresAuth: false,
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
          path: '/bodasgrupos/bloqueo/:id',
          component: detalleBodaGrupo,
          meta: {
             requiresAuth: false,
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
 