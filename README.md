### 快速開始
1. 在独立專案安裝包 
在对应專案(例如：apps/admin)
```bash
pnpm i --shamefully-hoist
/ pnpm --filter client dev
```
1. 開始開發
```bash
   pnpm run dev 
```
require('events').EventEmitter.defaultMaxListeners = 0; // 解除监听器数量限制

2. 添加 属性 data-testid 以方便自动化测试
```
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
await page.getByTestId('orange').click();
```
