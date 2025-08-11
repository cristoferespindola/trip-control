import { useCompanySettings } from '../../contexts/CompanySettingsContext'
import LogoSVG from '../icons/trip-control-logo'

export default function DefaultLogo({
  width = 32,
  height = 32,
  className = '',
}: {
  width?: number
  height?: number
  className?: string
}) {
  const { settings } = useCompanySettings()
  console.log(settings)

  return (
    <LogoSVG
      width={width}
      height={height}
      className={className}
      color="currentColor"
    />
  )
}
