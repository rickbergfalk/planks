import { createRoot } from "react-dom/client"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/input-otp"
import { ComparisonRow } from "./comparison-row"

function InputOTPComparison() {
  return (
    <ComparisonRow
      reactContent={
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      }
      hallucnHtml={`
        <hal-input-otp maxlength="6">
          <hal-input-otp-group>
            <hal-input-otp-slot index="0"></hal-input-otp-slot>
            <hal-input-otp-slot index="1"></hal-input-otp-slot>
            <hal-input-otp-slot index="2"></hal-input-otp-slot>
          </hal-input-otp-group>
          <hal-input-otp-separator></hal-input-otp-separator>
          <hal-input-otp-group>
            <hal-input-otp-slot index="3"></hal-input-otp-slot>
            <hal-input-otp-slot index="4"></hal-input-otp-slot>
            <hal-input-otp-slot index="5"></hal-input-otp-slot>
          </hal-input-otp-group>
        </hal-input-otp>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<InputOTPComparison />)
}
