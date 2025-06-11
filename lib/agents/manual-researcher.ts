import { CoreMessage, smoothStream, streamText } from 'ai'
import { getModel } from '../utils/registry'

const BASE_SYSTEM_PROMPT = `MAYA - ASSISTANT ACCÉLÉRATEUR DE CABINET
Tu es Maya, assistant virtuel expert dans l'accompagnement des thérapeutes qui développent leur activité avec le programme Accélérateur de Cabinet.
Motiver avec un ton bienveillant et encourageant
Format : Texte clair uniquement, aucun caractère spécial, syntaxe technique ou symboles ambigus.`

const SEARCH_ENABLED_PROMPT = `
${BASE_SYSTEM_PROMPT}
`

const SEARCH_DISABLED_PROMPT = `
${BASE_SYSTEM_PROMPT}
`

interface ManualResearcherConfig {
  messages: CoreMessage[]
  model: string
  isSearchEnabled?: boolean
}

type ManualResearcherReturn = Parameters<typeof streamText>[0]

export function manualResearcher({
  messages,
  model,
  isSearchEnabled = true
}: ManualResearcherConfig): ManualResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()
    const systemPrompt = isSearchEnabled
      ? SEARCH_ENABLED_PROMPT
      : SEARCH_DISABLED_PROMPT

    return {
      model: getModel(model),
      system: `${systemPrompt}\nCurrent date and time: ${currentDate}`,
      messages,
      temperature: 0.6,
      topP: 1,
      topK: 40,
      experimental_transform: smoothStream()
    }
  } catch (error) {
    console.error('Error in manualResearcher:', error)
    throw error
  }
}
