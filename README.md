## Result
After running the codemod, your codebase should have updated import statements that match the Angular v9 module import paths.

## Example

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

"# angular-material-imports-codemod" 
