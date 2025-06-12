# @adit/core-util

Reusable utility package for internal use within the `@adit/core-util` ecosystem.

## 📦 Packaging & Local Publishing

This guide explains how to prepare, build, and publish the `libs/util` directory as a standalone NPM package.

---

## 📁 Project Structure

core-code/
├── libs/
│ └── util/
│ ├── src/
| | ├── util.module.ts
| | ├── util.service.ts
│ │ └── index.ts
│ ├── package.json
│ ├── tsconfig.lib.json
│ └── packageing.md


## Command to Run

1. npm run build:types
2. npm run build:min
3. npm pack

after exexute of this 3 commands it will generate 

`core-code/
├── libs/
│ └── util/
**| | ├── dist
| | | ├── types
| | | | ├── **
| | ├── adit-core-util-V1.0.0.tgz**`

now you can install it like :

> **npm i libs/util/adit-core-util-v1.0.0.tgz**

