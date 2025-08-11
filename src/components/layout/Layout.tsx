'use client'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  TruckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import Footer from './Footer'
import LanguageSelector from '../languageSelector'
import { useTranslation } from '@/locales'
import { Transition } from '@headlessui/react'
import CompanyLogo from '../company/CompanyLogo'

const navigation = [
  { name: 'nav.dashboard', href: '/', icon: MapIcon },
  { name: 'nav.vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'nav.drivers', href: '/drivers', icon: UserGroupIcon },
  { name: 'nav.clients', href: '/clients', icon: BuildingOfficeIcon },
  { name: 'nav.trips', href: '/trips', icon: MapIcon },
  { name: 'nav.users', href: '/users', icon: UsersIcon },
  { name: 'nav.reports', href: '/reports', icon: ChartBarIcon },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login')
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user && pathname !== '/login') {
    return null
  }

  if (pathname === '/login') {
    return <>{children}</>
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <div className="flex items-center">
                      <CompanyLogo
                        width={32}
                        height={32}
                        className="text-orange-600"
                      />
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map(item => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium hover:bg-orange-50 hover:border-orange-500 ${
                            isActive
                              ? 'border-orange-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          }`}
                        >
                          <item.icon className="mr-2 h-5 w-5" />
                          {t(item.name)}
                        </Link>
                      )
                    })}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  <LanguageSelector />
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </MenuButton>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href="/settings"
                              className={`hover:bg-orange-50 flex items-center ${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                            >
                              <Cog6ToothIcon className="mr-2 h-5 w-5" />
                              {t('nav.settings')}
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`hover:bg-orange-50 ${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                            >
                              {t('nav.logout')}
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map(item => {
                  const isActive = pathname === item.href
                  return (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                        isActive
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <item.icon className="mr-4 h-6 w-6 inline" />
                      {t(item.name)}
                    </DisclosureButton>
                  )
                })}
                <div className="flex justify-center">
                  <LanguageSelector />
                </div>
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <DisclosureButton
                    as="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    {t('nav.logout')}
                  </DisclosureButton>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
