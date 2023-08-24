# formulize :waxing_crescent_moon

## :package: Installation

```sh
npm install formulize
yarn add formulize
pnpm add formulize
```

## Getting started

This plugin helps you to make formulas WYSWYG UI

> this plugin is based [metric-parser](https://github.com/KennethanCeyer/metric-parser)

[demo page](http://www.pigno.se/barn/PIGNOSE-Formula)

![Sample screen](http://www.pigno.se/barn/PIGNOSE-Formula/demo/img/screenshot_main.png)

## :page_with_curl: Example (basic)

```html
<div id="formulize"></div>
```

And use JS to instantiate formulize into the DOM.

### Typescript

```typescript
import { UI } from 'formulize';

const target = document.querySelector('#formulize');
const formulize = new UI(target, opts);

const data: Tree = {
    operator: '*',
    operand1: { value: { type: 'unit', unit: 1 } },
    operand2: { value: { type: 'unit', unit: 2 } }
};

formulize.setData(data);
```

### JavaScript (ES6)

```js
import { UI } from 'formulize';

const target = document.querySelector('#formulize');
const formulize = new UI(target, opts);

const data = {
    operator: '*',
    operand1: { value: { type: 'unit', unit: 1 } },
    operand2: { value: { type: 'unit', unit: 2 } }
};

formulize.setData(data);
```

### Usage with React

```tsx
import { UI } from 'formulize';

export const Formulize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const formulize = useRef<ReturnType<typeof UI>>(null);

  useEffect(() => {
    if (ref.current) {
      formulize.current = new UI(ref.current, opts);
    }
  }, []);

  return <div id="formulize" ref={ref} />
}
```

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKennethanCeyer%2Fformulize.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKennethanCeyer%2Fformulize?ref=badge_large)
