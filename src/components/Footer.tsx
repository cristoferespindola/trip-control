import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo-temp.svg"
              alt="CE Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div className="text-sm text-gray-600">
              <span className="font-medium">Desenvolvido por</span>
              <span className="ml-1 font-bold text-gray-900">CE</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            © {currentYear} TripControl. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
