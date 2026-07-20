import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function Setup() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Pousada de Valor</h1>
        <p className="text-muted-foreground">
          Vamos configurar sua primeira propriedade em 4 passos simples.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-primary">Passo 1 de 4</span>
          <span>25%</span>
        </div>
        <Progress value={25} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Dados da Propriedade</CardTitle>
          <CardDescription>
            As informações básicas são essenciais para os cálculos de rateio.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg m-6 text-muted-foreground">
          Assistente de configuração será finalizado na próxima etapa de integração com Supabase.
        </CardContent>
      </Card>
    </div>
  )
}
