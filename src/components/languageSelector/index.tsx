import { Fragment } from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useTranslation } from '@/locales'

const languages = [
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation()

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500">
          <span className="text-lg">{currentLanguage?.flag}</span>
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map(lang => (
              <MenuItem key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => setLanguage(lang.code as 'pt' | 'en')}
                    className={`${
                      active ? 'bg-orange-50 text-orange-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <span className="mr-3 text-lg">{lang.flag}</span>
                    {lang.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
