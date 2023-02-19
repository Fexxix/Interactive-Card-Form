import "./style.css"
import { z } from "zod"

const cardSchema = {
  name: z.string(),
  number: z
    .string()
    .max(16)
    .min(16)
    .regex(/\b\d{16}\b/),
  month: z
    .string()
    .max(2)
    .min(2)
    .regex(/^(0[1-9]|1[0-2])$/),
  year: z
    .string()
    .max(2)
    .min(2)
    .regex(/^\d{2}$/),
  cvc: z
    .string()
    .max(3)
    .min(3)
    .regex(/^\d{3}$/),
}

function verifyValue(propertyName: string, valueToBeValidated: string) {
  return cardSchema[propertyName as keyof typeof cardSchema].safeParse(
    valueToBeValidated
  ).success
}

const form = document.querySelector("form")
const inputs = document.querySelectorAll("input")
const confirmationMessageElem = document.querySelector(`[data-confirmation-message]`)

inputs.forEach((input) => {
  input.addEventListener("input", handleInput)
  input.addEventListener("blur", checkBlank)
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const errMsgElem = target
    .closest(`[data-input-field]`)
    ?.querySelector(`[data-message]`) as HTMLDivElement
  const targetCardElem = document.querySelector(
    `[data-${target.id}]`
  ) as HTMLDivElement

  targetCardElem.innerText = target.value
  if (target.id === "number") {
    let formattedNumber = targetCardElem.innerText
      .padEnd(16, "X")
      .split("")
    formattedNumber.splice(4, 0, " ")
    formattedNumber.splice(9, 0, " ")
    formattedNumber.splice(14, 0, " ")

    targetCardElem.innerText = formattedNumber.join("")
  }

  if (!verifyValue(target.id, target.value))
    errMsgElem.innerText = "Invalid Value"
  else errMsgElem.innerText = ""
}

function checkBlank(e: FocusEvent) {
  const target = e.target as HTMLInputElement
  const errMsgElem = target
    .closest(`[data-input-field]`)
    ?.querySelector(`[data-message]`) as HTMLDivElement

  if (target.value === "") errMsgElem.innerText = "Can't be Blank"
}

form?.addEventListener("submit", (e) => {
  e.preventDefault()

  const allCorrect = Array.from(inputs).every(input => verifyValue(input.id, input.value))

  if (!allCorrect) return
  console.log(confirmationMessageElem)

  form.classList.remove("show")
  confirmationMessageElem?.classList.add("show")
})
