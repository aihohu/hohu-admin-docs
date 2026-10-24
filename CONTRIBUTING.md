# 贡献许可

新贡献默认按 [Apache License 2.0](./LICENSE) 授权，贡献者保留版权。请保留第三方代码的原始许可与版权声明。本项目曾以 MIT 发布，该授权对已分发副本继续有效，详见 [NOTICE](./NOTICE)。

提交规则统一见 [主贡献指南](https://github.com/aihohu/hohu-admin/blob/main/docs/CONTRIBUTING.md#提交规范与授权)。使用一句英文 `type(scope): description`；维护者自己的贡献默认不添加 `Signed-off-by`、`Co-Authored-By` 或版权尾注，外部贡献仍使用 `git commit -s`。逐文件暂存，不跳过钩子，不 amend 已推送提交；提交、推送须有明确授权。DCO 不等于版权转让，本规则不改变既有许可证或版本号。

修改根目录许可文件时，同步 `docs/public/licenses/` 中对应的 `.txt` 发布副本，保持内容一致，并随构建产物分发。

## 文档贡献

先确认读者与正文归属，遵循 [文档维护规则](DOCUMENTATION.md)。涉及命令、配置、权限或界面的代码变更关联文档 PR，产品发布前完成更新。

修改页面时检查对应中英文内容与产品版本；新增页面需加入共享导航。运行本仓库 [README](README.md) 的检查命令。文档 PR 描述实际验证结果，不把构建通过等同于命令、部署或浏览器操作已经验收。
