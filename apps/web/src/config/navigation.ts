import {
    LayoutDashboard,
    Stethoscope,
    Brain,
    Activity,
    Settings,
    HelpCircle,
    MessageSquare,
    Image as ImageIcon,
    FileText,
    Users,
    Shield,
    Building,
    Sliders,
    FileSearch,
    Boxes,
    Key,
    Clock,
    BarChart3,
    Bell,
    Cpu,
    Globe,
    UserPlus,
    ShieldAlert,
    Database,
    Sparkles,
    Calendar
} from 'lucide-react';
import { NavigationConfig } from '@/types/navigation';

export const navigationConfig: NavigationConfig = {
    mainMenu: [
        {
            id: 'dashboard',
            label: '工作台',
            icon: LayoutDashboard,
            path: '/dashboard',
        },
        {
            id: 'clinical',
            label: '临床服务',
            icon: Stethoscope,
            subItems: [
                { id: 'appointments', label: '预约管理', path: '/clinical/appointments', icon: Calendar },
                { id: 'registration', label: '患者登记', path: '/clinical/patient-registration', icon: UserPlus },
                { id: 'emr', label: '电子病历', path: '/clinical/emr', icon: FileText },
                { id: 'imaging', label: '智能影像', path: '/imaging', icon: Brain },
                { id: 'clinic', label: '全球诊所', path: '/clinical/clinic', icon: Globe },
                { id: 'vitals', label: '生命体征', path: '/clinical/vitals', icon: Activity },
            ]
        },
        {
            id: 'ai',
            label: 'AI 能力中心',
            icon: Cpu,
            subItems: [
                { id: 'assistant', label: 'AI 医疗助手', path: '/ai/assistant', icon: Sparkles },
                { id: 'symptom', label: '智能导诊', path: '/ai/symptom-checker', icon: MessageSquare },
                { id: 'drug', label: '用药安全', path: '/ai/drug-interaction', icon: ShieldAlert },
                { id: 'models', label: '模型管理', path: '/ai/models', icon: Database },
            ]
        },
        {
            id: 'monitoring',
            label: '监控中心',
            icon: Activity,
            subItems: [
                {
                    id: 'services',
                    label: '服务监控',
                    path: '/monitoring/services',
                    icon: Cpu,
                },
                {
                    id: 'business',
                    label: '业务监控',
                    path: '/monitoring/business',
                    icon: BarChart3,
                },
                {
                    id: 'alerts',
                    label: '告警管理',
                    path: '/monitoring/alerts',
                    icon: Bell,
                },
            ],
        },
        {
            id: 'admin',
            label: '系统管理',
            icon: Settings,
            subItems: [
                {
                    id: 'users',
                    label: '用户管理',
                    path: '/admin/users',
                    icon: Users,
                },
                {
                    id: 'organization',
                    label: '组织管理',
                    path: '/admin/organization',
                    icon: Building,
                },
                {
                    id: 'system',
                    label: '系统配置',
                    path: '/admin/system',
                    icon: Sliders,
                },
                {
                    id: 'audit',
                    label: '审计日志',
                    path: '/admin/audit',
                    icon: FileSearch,
                },
            ],
        },
        {
            id: 'help',
            label: '帮助中心',
            icon: HelpCircle,
            path: '/help',
        },
    ],
};
