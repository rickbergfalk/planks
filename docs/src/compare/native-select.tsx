import { createRoot } from "react-dom/client"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import { ComparisonRow } from "./comparison-row"

function NativeSelectComparison() {
  return (
    <ComparisonRow
      reactContent={
        <NativeSelect>
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
        </NativeSelect>
      }
      hallucnHtml={`
        <hal-native-select>
          <hal-native-select-option value="">Select an option</hal-native-select-option>
          <hal-native-select-option value="apple">Apple</hal-native-select-option>
          <hal-native-select-option value="banana">Banana</hal-native-select-option>
          <hal-native-select-option value="orange">Orange</hal-native-select-option>
        </hal-native-select>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<NativeSelectComparison />)
}
