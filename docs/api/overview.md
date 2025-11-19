# WiseMed-SmartLink API 概览

本文档汇总了 WiseMed-SmartLink 平台核心服务的 API 接口。详细的 API 定义 (OpenAPI/Swagger) 可在服务启动后通过浏览器访问。

---

## 1. 服务 API 地址

| 服务名称 | 端口 | Swagger UI 地址 | 主要功能 |
| :--- | :--- | :--- | :--- |
| **Auth Service** | 8001 | http://localhost:8001/docs | 用户认证、令牌验证 |
| **AI Infer Service** | 8002 | http://localhost:8002/docs | 肺结节检测、影像分析 |
| **PACS Gateway** | 8003 | http://localhost:8003/docs | 影像上传、DICOM 处理 |
| **Translation Service** | 8004 | http://localhost:8004/docs | 医学翻译、语音转录 |

---

## 2. 核心接口示例

### 2.1 医学翻译 (Translation Service)

**接口**: `POST /translate`
**描述**: 将医学文本从源语言翻译为目标语言，并提取医学术语。

**请求示例**:
```bash
curl -X POST http://localhost:8004/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "患者主诉胸痛，怀疑心肌梗死",
    "source_lang": "zh",
    "target_lang": "en"
  }'
```

**响应示例**:
```json
{
  "original_text": "患者主诉胸痛，怀疑心肌梗死",
  "translated_text": "Patient complains of chest pain, suspected myocardial infarction",
  "matched_terms": [
    {"term": "胸痛", "translation": "chest pain"},
    {"term": "心肌梗死", "translation": "myocardial infarction"}
  ]
}
```

### 2.2 语音转录 (Translation Service)

**接口**: `POST /asr/transcribe`
**描述**: 上传音频文件 (WAV/MP3) 进行语音转文字。

**请求示例**:
```bash
curl -X POST http://localhost:8004/asr/transcribe \
  -F "file=@recording.wav"
```

### 2.3 肺结节推理 (AI Infer Service)

**接口**: `POST /infer/lung-nodule`
**描述**: 上传医学影像文件进行肺结节检测。

**请求示例**:
```bash
curl -X POST http://localhost:8002/infer/lung-nodule \
  -F "file=@scan.dcm"
```

---

## 3. 错误码说明

- **200 OK**: 请求成功
- **400 Bad Request**: 请求参数错误 (如文件格式不支持)
- **401 Unauthorized**: 未授权 (Token 无效或过期)
- **500 Internal Server Error**: 服务器内部错误 (如模型加载失败)
