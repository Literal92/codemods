# Angular Material Imports Codemod
This project provides a codemod script to update Angular Material imports to their new module paths, suitable for Angular v9 and beyond. It leverages jscodeshift to transform the import statements in your codebase.

## Purpose
After running the codemod, your codebase should have updated import statements that match the old Angular Material import paths.

### Before

```ts
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
```

### After

```ts
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
```

# Getting Started
## Prerequisites
. Node.js
. npm or yarn
. jscodeshift

## Installation
Install jscodeshift globally if you haven't already:

```sh
npm install -g jscodeshift
```
Clone this repository or download the update-angular-imports.ts file.