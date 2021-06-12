import React from 'react';

const Home = React.lazy(() => import('./views/website/pages/Home'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));

const WebRoutes = [
    { path: '/', exact: true, name: 'Home', component: Home },
    { path: '/*', exact: true, name: 'Page 404', component: Page404 }
];

export default WebRoutes;