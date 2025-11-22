// 导航配置类型定义
export interface SubMenuItem {
    id: string;
    label: string;
    path: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string | number;
    permission?: string;
}

export interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    path?: string;
    subItems?: SubMenuItem[];
    badge?: string | number;
    permission?: string;
}

export interface NavigationConfig {
    mainMenu: MenuItem[];
}
