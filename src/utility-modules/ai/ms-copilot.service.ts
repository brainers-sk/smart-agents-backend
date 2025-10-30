import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'

@Injectable()
export class MsCopilotService {
  private graphClient: Client
  private azureEndpoint: string
  private azureDeployment: string
  private azureApiKey: string

  constructor() {
    const tenantId = process.env.AZURE_TENANT_ID!
    const clientId = process.env.AZURE_CLIENT_ID!
    const clientSecret = process.env.AZURE_SECRET_VALUE!

    const credential = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret,
    )

    // 🔹 Microsoft Graph client – pre SharePoint a M365 dáta
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken(
            'https://graph.microsoft.com/.default',
          )
          return token?.token || ''
        },
      },
    })

    // 🔹 Azure OpenAI konfigurácia (ekvivalent „Copilot“ endpointu)
    this.azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT!
    this.azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT!
    this.azureApiKey = process.env.AZURE_OPENAI_KEY!
  }

  /**
   * 🧠 Chat cez Azure OpenAI – Copilot-like režim
   */
  async chat(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    temperature = 0.2,
  ): Promise<string> {
    try {
      const url = `${this.azureEndpoint}/openai/deployments/${this.azureDeployment}/chat/completions?api-version=2024-08-01-preview`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.azureApiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}\n---\n📌 Odpovede formátuj ako Markdown.`,
            },
            ...messages,
          ],
          temperature,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new InternalServerErrorException(
          `Azure OpenAI error: ${response.status} – ${errText}`,
        )
      }

      const data = await response.json()
      return data?.choices?.[0]?.message?.content ?? 'No response from Copilot'
    } catch (err: any) {
      console.error('Copilot (Azure OpenAI) error:', err)
      throw new InternalServerErrorException(err.message)
    }
  }

  /**
   * 📁 Načítaj zoznam súborov zo SharePoint lokality
   */
  async getSharePointFiles(siteId: string) {
    try {
      const res = await this.graphClient
        .api(`/sites/${siteId}/drive/root/children`)
        .get()
      return res.value ?? []
    } catch (err: any) {
      console.error('SharePoint API error:', err)
      throw new InternalServerErrorException(err.message)
    }
  }
}
