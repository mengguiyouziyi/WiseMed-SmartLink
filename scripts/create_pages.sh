#!/bin/bash
# 批量创建缺失的页面

# 定义页面配置：路径|标题|图标|描述
pages=(
  "ai/tasks|推理任务|Clock|查看和管理 AI 推理任务"
  "monitoring/services|服务监控|Cpu|实时监控系统服务状态"
  "monitoring/business|业务监控|BarChart3|业务指标和统计分析"
  "monitoring/alerts|告警管理|Bell|配置和管理系统告警"
  "admin/users|用户管理|Users|管理系统用户和权限"
  "admin/organization|组织管理|Building|管理机构和科室信息"
  "admin/system|系统配置|Sliders|系统基础配置和参数"
  "admin/audit|审计日志|FileSearch|查看系统操作日志"
  "help|帮助中心|HelpCircle|使用文档和常见问题"
)

for page in "${pages[@]}"; do
  IFS='|' read -r path title icon desc <<< "$page"
  
  dir="apps/web/src/app/(dashboard)/$path"
  
  cat > "$dir/page.tsx" << 'EOF'
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ICON_NAME } from 'lucide-react';
import styles from './page.module.css';

export default function PAGE_NAMEPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <ICON_NAME size={32} />
            PAGE_TITLE
          </h1>
          <p className={styles.subtitle}>
            PAGE_DESC
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <Card>
          <CardContent>
            <div className={styles.placeholder}>
              <ICON_NAME size={48} />
              <p>PAGE_TITLE功能开发中...</p>
              <span>即将上线，敬请期待</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
EOF

  # 替换占位符
  sed -i "s/ICON_NAME/$icon/g" "$dir/page.tsx"
  sed -i "s/PAGE_TITLE/$title/g" "$dir/page.tsx"
  sed -i "s/PAGE_DESC/$desc/g" "$dir/page.tsx"
  sed -i "s/PAGE_NAME/$(echo $path | tr '/' '_' | sed 's/_$//')/g" "$dir/page.tsx"
  
  # 复制样式文件
  cp "apps/web/src/app/(dashboard)/ai/models/page.module.css" "$dir/page.module.css"
  
  echo "Created $dir/page.tsx"
done

echo "All pages created!"
