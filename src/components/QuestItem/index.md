# QuestItem

## Usage
```vue
<QuestItem :quest="quest" />
```

## Props
| Prop  | Type                            | Required | Description |
| ----- | ------------------------------- | -------- | ----------- |
| quest | [Quest](/src/entities/quest.ts) | Yes      | The quest object to display |

## Slots
| Slot Name | Description                        |
| --------- | ---------------------------------- |
| children | Slot for rendering the quest operation area, it conflict with quest `button` property |
| title     | Slot for rendering the quest title |
| subTitle  | Slot for rendering the quest sub title |
