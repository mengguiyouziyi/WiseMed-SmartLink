# WiseMed-SmartLink 用户手册

欢迎使用 WiseMed-SmartLink 智能医疗辅助平台。本手册将指导您完成系统的基本操作。

---

## 1. 系统登录

访问地址: `http://localhost:3000` (Grafana 仪表板) 或直接通过 API 客户端访问服务。

**默认账号**:
- 用户名: `admin`
- 密码: `admin`

*注: 首次登录建议修改密码。*

---

## 2. 核心功能使用

### 2.1 影像辅助诊断 (AI Inference)

该功能用于自动检测胸部 CT 影像中的肺结节。

**操作步骤**:
1.  准备 DICOM 格式 (`.dcm`) 或普通图片格式 (`.jpg`, `.png`) 的胸部影像文件。
2.  使用客户端工具 (如 Postman 或 curl) 调用推理接口:
    - **接口地址**: `http://localhost:8002/infer/lung-nodule`
    - **方法**: `POST`
    - **参数**: `file` (上传影像文件)
3.  **查看结果**:
    系统将返回 JSON 格式的分析结果，包括：
    - `prediction`: 预测结果 (如 "benign" 良性, "malignant" 恶性)
    - `confidence`: 置信度 (0-1)

### 2.2 医学多语言翻译 (Medical Translation)

该功能支持医患沟通中的实时语音转写和医学术语翻译。

#### 语音转写 (ASR)
1.  录制患者主诉音频 (支持 `.wav`, `.mp3`)。
2.  调用转写接口:
    - **接口地址**: `http://localhost:8004/asr/transcribe`
    - **方法**: `POST`
    - **参数**: `file` (上传音频文件)
3.  系统将返回识别出的中文文本。

#### 文本翻译
1.  输入医学文本 (如病历记录)。
2.  调用翻译接口:
    - **接口地址**: `http://localhost:8004/translate`
    - **方法**: `POST`
    - **参数**: `{"text": "...", "source_lang": "zh", "target_lang": "en"}`
3.  系统将返回英文翻译，并自动高亮关键医学术语。

---

## 3. 系统监控

管理员可通过 Grafana 仪表板监控系统状态：
- **System Overview**: 查看 CPU、内存使用率，确保 AI 模型运行流畅。
- **Service Performance**: 查看各服务的请求响应时间和错误率。

---

## 4. 常见问题

- **Q: 翻译响应很慢?**
  - A: 首次使用时系统会自动下载 AI 模型，可能需要几分钟。后续请求将恢复正常速度。

- **Q: 无法上传大文件?**
  - A: 目前系统限制单次上传文件大小为 100MB。如需处理更大影像，请联系管理员调整配置。
