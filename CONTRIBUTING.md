# 贡献指南

1. **分支策略**：
   - `main`: 受保护，仅合并经过审批的 release。
   - `develop`: 日常集成；feature 分支从此拉取，完成后通过 PR 合并。
   - `feature/<scope>`: 单功能/修复；命名示例 `feature/pacs-gw-dicom`。

2. **提交规范**：采用 Conventional Commits（`feat: ...`, `fix: ...`, `docs: ...`）。

3. **代码检查**：提交前运行 `make lint test`（或 `task lint test`），确保通过；CI 会执行 lint/test/SBOM/安全扫描。

4. **变更描述**：PR 模板需包含
   - 变更内容概述
   - 测试结果
   - 风险影响（对 SaMD/合规）
   - 是否需要更新文档/模型

5. **安全与隐私**：禁止上传含真实患者身份的数据；若需示例请使用脱敏或模拟数据。

6. **文档**：所有架构/流程/模板更新放在 `docs/`；保持目录 README 同步。

7. **审批**：涉及合规/安全的改动需要 CTO + 合规负责人双审；其余至少一名代码owner审批。
