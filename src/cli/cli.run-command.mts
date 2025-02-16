import process from "node:process"
import readline from "node:readline/promises"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export const cliRunCommand = async (
  name: string,
  command: (serializedInput: string[]) => Promise<unknown>,
): Promise<void> => {
  const source = command.toString()
  const argNames = source.slice(2, source.indexOf(']'))
  const message = `${name}(${argNames})\n`
  const serializedInput = await rl.question(message)
  const args = serializedInput.split(',')
  const output = await command(args)
  console.log(JSON.stringify({ output }))
}
