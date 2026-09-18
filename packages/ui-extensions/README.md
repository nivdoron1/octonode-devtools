# Octonode UI extensions

Use `@octonodes/ui-extensions/react` to arrange a plugin node's existing inputs without taking ownership of values, expressions, connections, or saving.

```sh
npm install @octonodes/ui-extensions
```

```tsx
import { defineExtension, InputField, NodeForm, Section } from "@octonodes/ui-extensions/react";

function Inputs() {
  return (
    <NodeForm>
      <Section title="Message">
        <InputField name="channel" />
        <InputField name="text" appearance="multiline" />
      </Section>
    </NodeForm>
  );
}

export default defineExtension("node.inspector.inputs", Inputs);
```

Declare the entry on the node passed to `defineNode`:

```ts
ui: {
  apiVersion: "1",
  renderers: {
    focused: {
      label: "Focused form",
      targets: { "node.inspector.inputs": "src/slack-inputs.tsx" },
    },
  },
}
```

`octonodes plugin build` bundles the entry into the immutable plugin artifact. Octonode loads it only for the exact installed plugin version and renders real host-owned form controls inside an isolated, network-disabled sandbox.

The first public target is `node.inspector.inputs`. Undeclared or omitted inputs fall back to the standard inspector form.
