import type { SiteConfig } from '@/types/site'
import type { NavigationData, NavigationItem, NavigationSubItem } from '@/types/navigation'

export function processSiteData(siteDataRaw: SiteConfig): SiteConfig {
    return {
        ...siteDataRaw,
        appearance: {
            ...siteDataRaw.appearance,
            theme: (siteDataRaw.appearance?.theme === 'light' ||
                siteDataRaw.appearance?.theme === 'dark' ||
                siteDataRaw.appearance?.theme === 'system')
                ? siteDataRaw.appearance.theme
                : 'system'
        },
        navigation: {
            linkTarget: (siteDataRaw.navigation?.linkTarget === '_blank' ||
                siteDataRaw.navigation?.linkTarget === '_self')
                ? siteDataRaw.navigation.linkTarget
                : '_blank'
        }
    } as SiteConfig
}

export function filterNavigationData(navigationData: NavigationData): NavigationData {
    const filteredItems = navigationData.navigationItems
        .filter(category => category.enabled !== false)
        .map(category => {
            const filteredSubCategories = category.subCategories
                ? category.subCategories
                    .filter((sub) => sub.enabled !== false)
                    .map((sub) => ({
                        ...sub,
                        items: sub.items?.filter((item) => item.enabled !== false)
                    }))
                : undefined

            return {
                ...category,
                items: category.items?.filter((item) => item.enabled !== false),
                subCategories: filteredSubCategories
            }
        }) as NavigationItem[]

    return {
        navigationItems: filteredItems
    }
}

export function getProcessedData(navigationDataRaw: NavigationData, siteDataRaw: SiteConfig) {
    const siteData = processSiteData(siteDataRaw)
    const navigationData = filterNavigationData(navigationDataRaw)

    return {
        siteData,
        navigationData
    }
}
