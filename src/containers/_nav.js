import React from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const _nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard/admin',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Extra Category',
    to: '/dashboard/admin/extraCat',
    icon: <CIcon content={freeSet.cilDescription} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Orders',
    to: '/dashboard/admin/orders',
    icon: <CIcon content={freeSet.cilCart} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Offers',
    to: '/dashboard/admin/offers',
    icon: <CIcon content={freeSet.cilCash} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Delivery Address',
    to: '/dashboard/admin/address',
    icon: <CIcon content={freeSet.cilTruck} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Resturant info',
    to: '/dashboard/admin/info',
    icon: <CIcon content={freeSet.cilInfo} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Slider',
    to: '/dashboard/admin/slider',
    icon: <CIcon content={freeSet.cilColumns} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/dashboard/admin/users',
    icon: <CIcon content={freeSet.cilUser} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Feedback',
    to: '/dashboard/admin/feedback',
    icon: <CIcon content={freeSet.cilRss} customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Policy',
    to: '/dashboard/admin/policy',
    icon: <CIcon content={freeSet.cilLockLocked} customClasses="c-sidebar-nav-icon" />,
  },
]

export default _nav
