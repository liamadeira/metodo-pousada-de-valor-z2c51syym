import useAppStore from '@/stores/use-app-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export default function Properties() {
  const { properties, currentPropertyId } = useAppStore()
  const property = properties.find((p) => p.id === currentPropertyId)

  if (!property) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Propriedades & Quartos</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações básicas do seu estabelecimento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Propriedade</CardTitle>
          <CardDescription>Defina impostos e margem desejada para o cálculo ideal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Pousada</Label>
              <Input defaultValue={property.name} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Total de Quartos Disponíveis</Label>
              <Input type="number" defaultValue={property.rooms} />
            </div>
            <div className="space-y-2">
              <Label>Regime Tributário (Impostos %)</Label>
              <Input type="number" defaultValue={property.taxRegime} />
            </div>
            <div className="space-y-2">
              <Label>Margem de Lucro Desejada (%)</Label>
              <Input type="number" defaultValue={property.desiredMargin} />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias de Quartos</CardTitle>
          <CardDescription>Defina as categorias e pesos para rateio de custos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
            Funcionalidade de categorias de quartos em desenvolvimento.
            <br /> Atualmente usando cálculo global simplificado.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
