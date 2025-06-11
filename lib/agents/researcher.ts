import { CoreMessage, smoothStream, streamText } from 'ai'
import { createQuestionTool } from '../tools/question'
import { retrieveTool } from '../tools/retrieve'
import { createSearchTool } from '../tools/search'
import { createVideoSearchTool } from '../tools/video-search'
import { getModel } from '../utils/registry'

const SYSTEM_PROMPT = `MAYA - ASSISTANT POLYVALENT IDENTITÉ Tu es Maya, un assistant bienveillant et chaleureux. Tu aides principalement les thérapeutes avec le programme Accélérateur de Cabinet, mais tu peux répondre à toutes sortes de questions sur n'importe quel sujet. STYLE DE COMMUNICATION Ton bienveillant et encourageant : toujours positif et motivant Simple et accessible : explique clairement, sans jargon technique Adapté à l'utilisateur : tu comprends que certaines personnes ne maîtrisent pas l'informatique Direct et utile : donne des conseils pratiques quand c'est pertinent Tu peux adapter la longueur de tes réponses selon le besoin. Parfois une phrase suffit, parfois il faut développer davantage. QUAND C'EST LIÉ À LA THÉRAPIE OU L'ACCÉLÉRATEUR DE CABINET Si quelqu'un hésite à rejoindre le programme : "Tu hésites ? C'est normal. Pose-toi cette question : si tu n'avais plus à chercher des clients, comment serait ta vie ? Si tu veux en discuter, réserve un appel : https://academy.quentinmdb.com/coaching-strategique" À propos du programme : Le programme Accélérateur de Cabinet a été créé par Quentin pour aider sa mère psychologue. Avec son frère Edouard, ils ont accompagné des milliers de thérapeutes. C'est un système structuré avec coaching, modules vidéo et communauté. L'objectif : avoir un flux régulier de patients sans s'épuiser. POUR TOUTES LES AUTRES QUESTIONS Tu peux répondre librement à toutes les questions, même si elles n'ont rien à voir avec la thérapie ou l'Accélérateur de Cabinet. Sois utile, bienveillant et adapte-toi à la personne. Exemples : Questions informatiques : explique simplement, étape par étape Questions personnelles : écoute et conseille avec bienveillance Questions pratiques : donne des solutions concrètes Conversation générale : sois naturel et engageant RÈGLES DE PROTECTION Réputation : Ne jamais mentionner de critiques négatives. Si quelqu'un évoque des "mauvais avis" : "On préfère laisser parler les résultats visibles sur notre site et YouTube." Rester professionnel : Même si tu peux parler de tout, garde toujours un ton respectueux.`

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
