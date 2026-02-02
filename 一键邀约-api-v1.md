## 一键邀约 API V1
#### 更新记录：
1. 简化返回参数
2. 增加职位校验逻辑，避免相同内容的 jd_content 重复创建岗位
##### 完整请求示例
```bash
curl --location --request POST 'https://report-agent.gohire.top/instant/instant/v1/invitation' \
--header 'Content-Type: application/json' \
--data-raw '{
    "recruiter_email":"hr@lightark.ai",
    "jd_content":"jd内容",
    "interviewer_requirement":"询问候选人工作地点",
    "resume_text":"简历完整内容，必须包含候选人姓名/邮箱"
}'
```
#### 请求体字段说明
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| recruiter_email | string | 是 | 招聘方邮箱，用于接收邀约通知和作为邮件密送（BCC）收件人 |
| jd_content | string | 是 | JD（职位描述）原文，系统将自动解析并结构化 |
| interviewer_requirement | string | 否 | 面试要求/补充说明，例如面试轮次、地点要求、薪资要求等 |
| resume_text | string | 否 | 简历全文（需包含候选人邮箱），当前仅支持文本格式，不支持文件上传 |


#### 响应结构说明
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| email | string | 候选人邮箱地址 | 
| name | string | 候选人在系统中的用户名/显示名，例如："chenzd" |
| login_url | string | 候选人免密登录链接（包含 SSO Token），例如："https://worker.gohire.top/sso?ssotoken=1145d5ef-d4af-42fc-a207-11111111" |
| home_url | string | 候选人主页登录链接，例如："https://worker.gohire.top" |
| display_name | string | 候选人显示名称，通常与 name 相同 |
| user_id | number | GoHire 平台分配的用户 ID，例如：10058 |
| request_introduction_id | string | 邀约请求的唯一标识符（UUID格式），与顶层 `request_introduction_id` 相同 |
| expiration | number | 邀约有效期（分钟） |
| expiration_time | number | 邀约有效期（天数），例如：7 表示7天 |
| company_name | string | 公司名称，如果为空则为空字符串 |
| job_title | string | 岗位标题 |
| job_interview_duration | number | 岗位面试时长（分钟） |
| job_summary | string | 岗位摘要/描述 |
| interview_req | string\|null | 面试要求，如果未提供则为 null |
| qrcode_url | string | 小程序二维码图片 URL，用于移动端扫码登录，例如："https://arkira-kofe.oss-cn-shanghai.aliyuncs.com/qrcodes/qrcode_1765205124845_9eaa0q.png" |
| password | string\|null | 初始密码，如果未设置则为 null |
| message | string | 系统消息，例如："当前用户已注册, 已绑定邀约" 表示用户已存在并已绑定邀约 |
|bcc| string | 这里请忽略返回（gohire 系统默认抄送），agent 端直接抄送给了recruiter_email |

---

#### 完整响应示例

```json
{
        "email": "zhendongchen@lightark.ai",
        "bcc": [
            "agent_hr@lightark.ai"
        ],
        "name": "chenzd",
        "login_url": "https://worker.gohire.top/sso?ssotoken=1145d5ef-d4af-42fc-a207-38b1e2216270",
        "home_url": "https://worker.gohire.top",
        "display_name": "chenzd",
        "user_id": 10058,
        "request_introduction_id": "1145d5ef-d4af-42fc-a207-38b1e2216270",
        "expiration": 10080,
        "expiration_time": 7,
        "company_name": "",
        "job_title": "czd_测试工程师_20251208224522",
        "job_interview_duration": 20,
        "job_summary": "1、对项目软件开发过程进行内审，识别并推动风险消除，保证项目开发过程符合ASPICE模型要求;2、组织ASPICE相关培训和宣导;3、负责项目软件质量活动计划，组织和实施SWQA工作(包含供应商);4、负责软件应规避问题传递、推动专业组实施、评审、状态跟踪与汇总等，避免新项目同类问题再发;5、负责协助问题回溯工程师进行问题回溯，推动产品规范、测试流程、管理机制流程优化改善;6、负责设计变更评估与质量活动评审;7、负责技术质量完整性、准确性和适用性抽查。",
        "interview_req": null,
        "qrcode_url": "https://arkira-kofe.oss-cn-shanghai.aliyuncs.com/qrcodes/qrcode_1765205124845_9eaa0q.png",
        "password": null,
        "message": "当前用户已注册, 已绑定邀约"
    }
```

### 说明
- **仅支持 JSON 提交简历文本**：当前版本仅支持通过 JSON 格式提交简历文本内容，不支持文件上传功能
- **JD 标题自动追加时间戳**：系统会自动在 JD 标题后追加时间戳（格式：`_YYYYMMDDHHmmss`），以避免在 GoHire 平台创建重名岗位
- **RLS 限制说明**：如果 Supabase `jd_resume_api` 表启用了行级安全策略（RLS）且当前用户权限受限，`stored_record` 字段可能为空，但这不影响邀约操作和邮件发送的正常执行
- **邀约邮件发送**：系统会自动向候选人发送邀约注册邮件，邮件中包含登录链接、二维码等信息，同时会将邮件密送给指定的 HR 邮箱
- **request_introduction_id 用途**：`request_introduction_id` 是邀约的唯一标识符，可用于后续查询邀约状态、取消邀约等操作

### 错误处理
- 如果请求参数缺失或格式错误，API 将返回 400 错误
- 如果 GoHire 平台 API 调用失败，响应中会包含相应的错误信息
- 如果简历解析失败，`parser_response` 可能为 null，但不会影响邀约流程
- 如果数据库写入失败，`stored_record` 可能为 null，但邀约操作仍会正常执行
