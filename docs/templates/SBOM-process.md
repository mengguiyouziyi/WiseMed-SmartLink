# SBOM 生成与管理流程

## 1. 目的
确保软件材料清单 (SBOM) 完整可追溯，满足 SaMD 网络安全要求、等保三级、客户审计。

## 2. 范围
- 源码仓库、Docker 镜像、边缘设备固件。
- 第三方组件（SOUP）、模型权重（记录来源/许可证）。

## 3. 工具
- Syft：`syft packages dir -o cyclonedx-json`。
- Grype：SBOM 驱动漏洞扫描。
- Cosign：镜像签名与 SBOM 关联。

## 4. 流程
1. **生成**：CI 在 `build` 阶段对每个镜像/组件生成 SBOM。
2. **签名**：`cosign attest --predicate sbom.json --key cosign.key`。
3. **存储**：
   - Artifact Registry（版本化）
   - audit-service（元数据：组件、版本、commit、模型ID）
4. **审核**：安全负责人每月审查 SBOM 变更，关注高风险 SOUP。
5. **发布**：release 包含 SBOM 清单，提供给监管/客户。

## 5. 变更与追踪
- SOUP 更新需填写《第三方组件评估表》（功能、安全、许可证、验证计划）。
- 高风险 CVE（CVSS ≥7）→ CAPA，跟踪整改时限。

## 6. 责任
| 角色 | 职责 |
| --- | --- |
| DevOps | CI/CD集成、存档 |
| 安全负责人 | SBOM审查、CVE响应 |
| 合规 | 确保文档在注册资料中引用 |

## 7. 记录保存
- SBOM、扫描报告保留 ≥7 年。
- 访问控制：仅授权人员可下载，操作记录审计。
