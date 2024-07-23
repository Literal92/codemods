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
