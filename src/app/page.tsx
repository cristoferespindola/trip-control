"use client";

import {
  TruckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslation } from "@/locales";

const stats = [
  { name: "dashboard.stats.totalVehicles", value: "12", icon: TruckIcon },
  { name: "dashboard.stats.totalDrivers", value: "8", icon: UserGroupIcon },
  {
    name: "dashboard.stats.totalClients",
    value: "24",
    icon: BuildingOfficeIcon,
  },
  { name: "dashboard.stats.totalTrips", value: "156", icon: MapIcon },
];

const modules = [
  {
    name: "dashboard.modules.vehicles",
    href: "/vehicles",
    icon: TruckIcon,
    color: "bg-blue-500",
  },
  {
    name: "dashboard.modules.drivers",
    href: "/drivers",
    icon: UserGroupIcon,
    color: "bg-green-500",
  },
  {
    name: "dashboard.modules.clients",
    href: "/clients",
    icon: BuildingOfficeIcon,
    color: "bg-purple-500",
  },
  {
    name: "dashboard.modules.trips",
    href: "/trips",
    icon: MapIcon,
    color: "bg-orange-500",
  },
  {
    name: "dashboard.modules.users",
    href: "/users",
    icon: UsersIcon,
    color: "bg-red-500",
  },
];

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("dashboard.title")}
        </h1>
        <p className="mt-2 text-gray-600">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white p-4 shadow sm:p-6"
          >
            <dt>
              <div className="absolute rounded-md bg-orange-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </dt>
            <dd className="ml-16 flex flex-col items-baseline">
              <p className="truncate text-sm font-medium text-gray-500">
                {t(item.name)}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span
                  className={`rounded-lg inline-flex p-3 ${module.color} ring-4 ring-white`}
                >
                  <module.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="mt-8 text-gray-900">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t(module.name)}
                </h3>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-900 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
