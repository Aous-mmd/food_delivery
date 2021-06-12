import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));
const Address = React.lazy(() => import('./views/pages/address/address'));
const Info = React.lazy(() => import('./views/pages/info/info'));
const Offers = React.lazy(() => import('./views/pages/offers/offers'));
const Offer = React.lazy(() => import('./views/pages/offers/offer'));
const Feedback = React.lazy(() => import('./views/pages/feedback/feedback'));
const Orders = React.lazy(() => import('./views/pages/orders/orders'));
const Policy = React.lazy(() => import('./views/pages/policy/policy'));
const Slider = React.lazy(() => import('./views/pages/slider/slider'));
const ExtraCat = React.lazy(() => import('./views/pages/extraCat/extraCat'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));

const routes = [
  { path: '/dashboard/admin', exact: true, name: 'Home', component: Dashboard },
  { path: '/dashboard/admin/address', exact: true, name: 'Address', component: Address },
  { path: '/dashboard/admin/info', exact: true, name: 'Info', component: Info },
  { path: '/dashboard/admin/feedback', exact: true, name: 'Feedback', component: Feedback },
  { path: '/dashboard/admin/orders', exact: true, name: 'Orders', component: Orders },
  { path: '/dashboard/admin/policy', exact: true, name: 'Policy', component: Policy },
  { path: '/dashboard/admin/extraCat', exact: true, name: 'Extra Category', component: ExtraCat },
  { path: '/dashboard/admin/slider', exact: true, name: 'Slider', component: Slider },
  { path: '/dashboard/admin/offers', exact: true, name: 'Offers', component: Offers },
  { path: '/dashboard/admin/offers/:id', exact: true, name: 'Offer Details', component: Offer },
  { path: '/dashboard/admin/users', exact: true, name: 'Users', component: Users },
  { path: '/dashboard/admin/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/dashboard/admin/*', exact: true, name: 'Page 404', component: Page404 }
];

export default routes;