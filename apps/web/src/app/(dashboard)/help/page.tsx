'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { HelpCircle, Book, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import styles from '../ai/models/page.module.css';

export default function HelpPage() {
  const helpTopics = [
    {
      icon: <Book size={24} />,
      title: '快速入门',
      description: '了解系统基本功能和使用方法',
      link: '/docs/getting-started',
    },
    {
      icon: <FileText size={24} />,
      title: 'API 文档',
      description: '查看完整的 API 接口文档',
      link: '/docs/api',
    },
    {
      icon: <MessageCircle size={24} />,
      title: '常见问题',
      description: '查找常见问题的解决方案',
      link: '/docs/faq',
    },
    {
      icon: <HelpCircle size={24} />,
      title: '联系支持',
      description: '获取技术支持和帮助',
      link: '/support',
    },
  ];

  const quickLinks = [
    { title: '系统架构', url: '/docs/architecture' },
    { title: '部署指南', url: '/docs/deployment' },
    { title: '配置说明', url: '/docs/configuration' },
    { title: '故障排查', url: '/docs/troubleshooting' },
    { title: '最佳实践', url: '/docs/best-practices' },
    { title: '版本更新', url: '/docs/changelog' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <HelpCircle size={32} />
            帮助中心
          </h1>
          <p className={styles.subtitle}>
            文档、教程和支持
          </p>
        </div>
      </div>

      {/* 主要帮助主题 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {helpTopics.map((topic, index) => (
          <Card key={index} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <CardContent style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '1rem'
              }}>
                {topic.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {topic.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {topic.description}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--primary)',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                了解更多
                <ExternalLink size={16} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快速链接 */}
      <Card>
        <CardHeader>
          <CardTitle>快速链接</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{link.title}</span>
                <ExternalLink size={16} style={{ color: 'var(--text-tertiary)' }} />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 系统信息 */}
      <Card style={{ marginTop: '1.5rem' }}>
        <CardHeader>
          <CardTitle>系统信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                版本号
              </div>
              <div style={{ fontWeight: 500 }}>v1.0.0-beta</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                构建日期
              </div>
              <div style={{ fontWeight: 500 }}>2025-11-21</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                技术支持
              </div>
              <div style={{ fontWeight: 500 }}>support@wisemed.com</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
