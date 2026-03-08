# NEO GLOW Design System

A cyberpunk-themed React component library with glowing neon aesthetics for Rex Meme Studio.

## Colors

| Token      | Hex       |
|------------|-----------|
| `cyan`     | `#00FFFF` |
| `magenta`  | `#FF00FF` |
| `purple`   | `#8B00FF` |
| `lime`     | `#ADFF2F` |
| `amber`    | `#FFB300` |
| `dark`     | `#0A0A0F` |
| `card`     | `#12121A` |

## Components

### `NeoButton`
```tsx
import { NeoButton } from 'design-system';
<NeoButton variant="cyan" size="md" glow>Click Me</NeoButton>
```

### `NeoCard`
```tsx
import { NeoCard } from 'design-system';
<NeoCard glow glowColor="magenta">Content here</NeoCard>
```

### `NeoToggle`
```tsx
import { NeoToggle } from 'design-system';
<NeoToggle checked={on} onChange={setOn} label="Enable Glow" color="cyan" />
```

### `NeoBadge`
```tsx
import { NeoBadge } from 'design-system';
<NeoBadge label="Solana" variant="cyan" icon="◎" />
```
