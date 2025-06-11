'use client'

import { Model } from '@/lib/types/models'
import { setCookie } from '@/lib/utils/cookies'
import { useEffect, useState } from 'react'
import { createModelId } from '../lib/utils'
import { Button } from './ui/button'

interface ModelSelectorProps {
  models: Model[]
}

export function ModelSelector({ models }: ModelSelectorProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    // On s'assure que le modèle MAYA est toujours sélectionné
    const mayaModel = models.find(model => model.id === 'gpt-4.1')
    if (mayaModel) {
      const modelId = createModelId(mayaModel)
      setValue(modelId)
      setCookie('selectedModel', JSON.stringify(mayaModel))
    }
  }, [models])

  return (
    <Button
      variant="outline"
      className="text-sm rounded-full shadow-none focus:ring-0"
    >
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium">ASSISTANT MAYA</span>
      </div>
    </Button>
  )
}
