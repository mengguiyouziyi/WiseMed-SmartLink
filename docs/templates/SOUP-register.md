# SOUP（第三方软件）登记与评估表

| ID | 组件名称 | 版本 | 供应商/仓库 | 许可证 | 功能用途 | 分类 (安全/功能) | 验证计划 | 风险等级 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | Orthanc | 1.12.x | orthanc-server.com | GPLv3 | DICOM 接收/管理 | 功能关键 | 集成测试 + 安全扫描 | 中 | 记录配置、插件 |
| S002 | MONAI Deploy | 0.x | github.com/Project-MONAI | Apache 2.0 | 医学影像推理框架 | 功能关键 | 推理验证、性能测试 | 中 | 模型兼容性 |
| S003 | ESPnet | 2024.1 | github.com/espnet/espnet | Apache 2.0 | ASR/NMT Pipeline | 功能关键 | 语音评测、WER | 中 | 方言定制 |
| S004 | Bahmni (OpenMRS) | 0.93 | bahmni.org | AGPLv3 | 基层SaaS/EMR | 功能关键 | 功能验收、安全测试 | 中 | FHIR接口 |
| S005 | Redpanda | 23.x | vectorized.io | BSL | 事件总线 | 安全关键 | 延迟测试、HA | 中 | Kafka兼容性 |
| S006 | Keycloak | 23.x | keycloak.org | Apache 2.0 | 身份认证 | 安全关键 | 漏洞扫描、渗透 | 中 | OIDC 集成 |
| S007 | Flower | 1.x | flower.dev | Apache 2.0 | 联邦学习框架 | 功能 | 模型训练验收 | 低 | 安全聚合 |
| ... | | | | | | | | | |

## 流程
1. 新 SOUP 引入需填写本表，说明用途、许可证、验证策略。
2. 评估内容：
   - 安全：CVE、维护频率、社区活跃度。
   - 功能：与需求匹配度、替代方案。
   - 合规：许可证兼容、SaMD影响。
3. 批准：合规负责人+CTO 签字后方可引入。
4. 更新：版本升级需重新评估；记录在 Change Log。
