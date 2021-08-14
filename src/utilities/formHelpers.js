/**
 * ============================================================================
 * Trigger an input's onChange event progrmatically
 *
 * Arguments:
 * - enteredName -> form element ID [string]
 * - enteredVAlue -> new form element value
 * ============================================================================
 */
export function triggerInput(enteredName, enteredValue) {
  const input = document.getElementById(enteredName)
  const lastValue = input.value
  input.value = enteredValue
  const event = new Event('input', { bubbles: true })
  const tracker = input._valueTracker
  if (tracker) {
    tracker.setValue(lastValue)
  }
  input.dispatchEvent(event)
}
