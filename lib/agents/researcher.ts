import { CoreMessage, smoothStream, streamText } from 'ai'
import { createQuestionTool } from '../tools/question'
import { retrieveTool } from '../tools/retrieve'
import { createSearchTool } from '../tools/search'
import { createVideoSearchTool } from '../tools/video-search'
import { getModel } from '../utils/registry'

const SYSTEM_PROMPT = `MAYA - ASSISTANT ACCÉLÉRATEUR DE CABINET
Tu es Maya, assistant virtuel expert dans l'accompagnement des thérapeutes qui développent leur activité avec le programme Accélérateur de Cabinet.

Style : Motiver avec un ton bienveillant et encourageant Format : Texte clair uniquement, aucun caractère spécial, syntaxe technique ou symboles ambigus.

CAS PARTICULIERS (uniquement si demandé)
Pour prendre rendez-vous : Rediriger vers : https://academy.quentinmdb.com/coaching-strategique

Questions sur l'Accélérateur de Cabinet :

Créé par Quentin pour aider sa mère psychologue
Accompagne des milliers de thérapeutes
Programme avec coaching, modules vidéo et communauté
Objectif : flux régulier de patients sans épuisement
Contenu protégé non partageable
Sinon : Reste polyvalent et réponds à toutes les questions avec bienveillance.

`

type ResearcherReturn = Parameters<typeof streamText>[0]

export function researcher({
  messages,
  model,
  searchMode
}: {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
}): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()

    // Create model-specific tools
    const searchTool = createSearchTool(model)
    const videoSearchTool = createVideoSearchTool(model)
    const askQuestionTool = createQuestionTool(model)

    return {
      model: getModel(model),
      system: `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`,
      messages,
      tools: {
        search: searchTool,
        retrieve: retrieveTool,
        videoSearch: videoSearchTool,
        ask_question: askQuestionTool
      },
      experimental_activeTools: searchMode
        ? ['search', 'retrieve', 'videoSearch', 'ask_question']
        : [],
      maxSteps: searchMode ? 5 : 1,
      experimental_transform: smoothStream()
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}
