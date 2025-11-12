// Cliente OpenAI para análise financeira
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Para uso no cliente
})

export interface FinancialCheckIn {
  id: string
  date: string
  type: 'audio' | 'text'
  content: string
  audioUrl?: string
  salary?: number
  expenses?: Array<{ category: string; amount: number; description: string }>
  analysis?: FinancialAnalysis
}

export interface FinancialAnalysis {
  summary: string
  totalIncome: number
  totalExpenses: number
  balance: number
  categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>
  insights: string[]
  recommendations: string[]
  savingsRate: number
  riskAreas: string[]
  strengths: string[]
  monthlyComparison?: {
    previousMonth: number
    currentMonth: number
    change: number
    changePercentage: number
  }
}

export async function analyzeFinancialCheckIn(checkIn: FinancialCheckIn): Promise<FinancialAnalysis> {
  try {
    const prompt = `
Você é um consultor financeiro especializado. Analise o seguinte check-in financeiro de forma minuciosa e detalhada:

DADOS DO CHECK-IN:
${checkIn.content}

INSTRUÇÕES:
1. Extraia TODOS os valores mencionados (salário, gastos, investimentos)
2. Categorize os gastos mencionados
3. Calcule o saldo (receitas - despesas)
4. Identifique padrões de comportamento financeiro
5. Forneça insights profundos sobre a saúde financeira
6. Sugira melhorias específicas e acionáveis
7. Identifique áreas de risco e pontos fortes
8. Compare com melhores práticas financeiras

FORMATO DE RESPOSTA (JSON):
{
  "summary": "Resumo executivo da situação financeira (2-3 parágrafos)",
  "totalIncome": valor_total_receitas,
  "totalExpenses": valor_total_despesas,
  "balance": saldo_final,
  "categoryBreakdown": [
    { "category": "Alimentação", "amount": 1200, "percentage": 15 },
    { "category": "Transporte", "amount": 800, "percentage": 10 }
  ],
  "insights": [
    "Insight detalhado 1 sobre padrões identificados",
    "Insight detalhado 2 sobre comportamento financeiro",
    "Insight detalhado 3 sobre oportunidades"
  ],
  "recommendations": [
    "Recomendação específica 1 com ação clara",
    "Recomendação específica 2 com impacto estimado",
    "Recomendação específica 3 com prazo sugerido"
  ],
  "savingsRate": taxa_de_economia_em_porcentagem,
  "riskAreas": [
    "Área de risco 1 identificada",
    "Área de risco 2 identificada"
  ],
  "strengths": [
    "Ponto forte 1 do comportamento financeiro",
    "Ponto forte 2 do comportamento financeiro"
  ]
}

Seja EXTREMAMENTE detalhado e específico. Forneça números, porcentagens e comparações sempre que possível.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um consultor financeiro expert que fornece análises detalhadas e personalizadas. Sempre responda em JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const analysisText = response.choices[0].message.content || '{}'
    const analysis = JSON.parse(analysisText)

    return {
      summary: analysis.summary || 'Análise não disponível',
      totalIncome: analysis.totalIncome || 0,
      totalExpenses: analysis.totalExpenses || 0,
      balance: analysis.balance || 0,
      categoryBreakdown: analysis.categoryBreakdown || [],
      insights: analysis.insights || [],
      recommendations: analysis.recommendations || [],
      savingsRate: analysis.savingsRate || 0,
      riskAreas: analysis.riskAreas || [],
      strengths: analysis.strengths || []
    }
  } catch (error) {
    console.error('Erro ao analisar check-in:', error)
    throw new Error('Falha ao processar análise financeira')
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'pt')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: formData
    })

    const data = await response.json()
    return data.text || ''
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error)
    throw new Error('Falha ao transcrever áudio')
  }
}
