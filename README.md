# 慧医智联 · 基层医疗AI诊断与语言服务平台

该仓库承载创业计划执行文档，包括技术架构、语料采集、合规SOP等，支撑京津冀基层医疗AI诊断 + 多语言服务PoC。

## 当前内容
- `docs/poc/architecture.md`：PoC架构（影像推理、翻译、基层SaaS、联邦学习、事件总线）。
- `docs/data/dialect-asr-plan.md`：方言语料采集与ASR/NMT调优方案。
- `docs/governance/compliance-and-pilot-sop.md`：SaMD合规体系与试点SOP。

## 下一步优先事项
1. 搭建 PoC 环境：容器化 Orthanc + MONAI Deploy + ESPnet Demo，形成最小可用链路。
2. 启动方言采集：完善剧本、术语词表与知情同意；安排衡水、保定两地采集团队。
3. 完成 SaMD 文档骨架：URS/SRS/SVVP/SBOM 模板，纳入版本管理。
4. 建立 DevOps 基线：Git 仓库、CI（Lint/Test/SBOM）、安全扫描、部署脚本。

## 沟通节奏
- 周例会：研发/算法/合规/客户成功同步 PoC 进展。
- 月度：向管理层汇报指标与风险，更新路线图。
- 按需：政府/合作伙伴对接材料更新。
