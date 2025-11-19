# GitHub 仓库创建与推送指南

1. **在 GitHub 创建仓库**
   - 登录 GitHub → `New repository`。
   - 建议名称：`WiseMed-SmartLink` 或 `huiyi-smartlink`。
   - 勾选 `Private`（如需保密）；不要初始化 README/.gitignore（本地已有）。

2. **本地初始化 Git**
```bash
cd /home/langchao6/projects/bozhi/WiseMed-SmartLink
git init
git add .
git commit -m "chore: bootstrap docs and scaffolding"
```

3. **关联远程**
```bash
git remote add origin git@github.com:<your-org>/<repo>.git
# 或使用 https://github.com/... 形式
```

4. **推送**
```bash
git branch -M main
git push -u origin main
```

5. **保护分支/CI**
- 在 GitHub 设置 → Branches：保护 `main`（需要 PR、至少1审查、通过检查）。
- 配置 `develop` 分支用于日常迭代。
- 创建 GitHub Actions workflow（参考 `docs/devops/repo-structure.md`）。

6. **Secrets & Access**
- 在仓库 `Settings → Secrets and variables → Actions` 添加 `REGISTRY_USER`、`REGISTRY_PASSWORD`、`COSIGN_KEY` 等。
- 邀请团队成员，分配权限（Admin/Write/Read）。

7. **后续操作**
- 按 CONTRIBUTING.md 流程创建 feature 分支。
- 将 SaMD 文档、SOP 与代码同仓管理，保持版本一致。
