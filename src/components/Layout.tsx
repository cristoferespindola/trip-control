'use client'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, TruckIcon, UserGroupIcon, BuildingOfficeIcon, MapIcon, UsersIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import Footer from './Footer'
import Logo from './logo'
import TripControlLogo from './icons/trip-control-logo'

const navigation = [
  { name: 'Dashboard', href: '/', icon: MapIcon },
  { name: 'Veículos', href: '/vehicles', icon: TruckIcon },
  { name: 'Motoristas', href: '/drivers', icon: UserGroupIcon },
  { name: 'Clientes', href: '/clients', icon: BuildingOfficeIcon },
  { name: 'Viagens', href: '/trips', icon: MapIcon },
  { name: 'Usuários', href: '/users', icon: UsersIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login')
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-200">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="flex items-center">
                      <TripControlLogo width={32} height={32} className="text-orange-600" />
                      <span className="ml-2 text-xl font-bold text-gray-900">TripControl</span>
                    </div>
                  </div>
                  <div className="hidden sm:ml-8 sm:block">
                    <div className="flex space-x-1">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              isActive
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent',
                              'flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200'
                            )}
                          >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Abrir menu do usuário</span>
                      <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <div className="px-4 py-2 text-sm text-gray-700">
                            <div className="font-medium">{user?.name || user?.username}</div>
                            <div className="text-gray-500">{user?.role}</div>
                          </div>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block w-full text-left px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Sair
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>

                <div className="-mr-2 flex items-center sm:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                    <span className="sr-only">Abrir menu principal</span>
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
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-orange-50 border-orange-200 text-orange-700'
                          : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        'flex items-center px-4 py-2 text-base font-medium border-l-4'
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </DisclosureButton>
                  )
                })}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.name || user?.username}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.role}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <DisclosureButton
                    as="button"
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Sair
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