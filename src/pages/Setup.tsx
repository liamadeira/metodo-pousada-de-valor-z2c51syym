import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { BedDouble, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = [
  { num: 1, label: 'Dados da Propriedade' },
  { num: 2, label: 'Categorias de Quartos' },
  { num: 3, label: 'Custos' },
  { num: 4, label: 'Canais & Pagamentos' },
  { num: 5, label: 'Revisão' },
]

export default function Setup() {
  const [step, setStep] = useState(2)
  const [categories, setCategories] = useState([
    {
      name: 'Standard',
      units: 8,
      weight: 1.0,
      laundry: 8.5,
      amenities: 4,
      cleaning: 15,
      breakfast: 18,
    },
    { name: 'Luxo', units: 5, weight: 1.5, laundry: 12, amenities: 8, cleaning: 20, breakfast: 22 },
  ])
  const [newCat, setNewCat] = useState({
    name: '',
    units: 1,
    weight: 1,
    laundry: 0,
    amenities: 0,
    cleaning: 0,
    breakfast: 0,
  })

  const progress = (step / STEPS.length) * 100

  const addCategory = () => {
    if (!newCat.name) return
    setCategories([...categories, { ...newCat, weight: Number(newCat.weight) }])
    setNewCat({
      name: '',
      units: 1,
      weight: 1,
      laundry: 0,
      amenities: 0,
      cleaning: 0,
      breakfast: 0,
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Configuração Inicial</h1>
        <p className="text-muted-foreground">Configure sua propriedade em {STEPS.length} passos.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-primary">
            Passo {step} de {STEPS.length}: {STEPS[step - 1].label}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex flex-wrap gap-2 pt-2">
          {STEPS.map((s) => (
            <Badge
              key={s.num}
              variant={s.num === step ? 'default' : s.num < step ? 'secondary' : 'outline'}
              className="gap-1"
            >
              {s.num < step && <CheckCircle2 className="w-3 h-3" />}
              {s.num}. {s.label}
            </Badge>
          ))}
        </div>
      </div>

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="w-5 h-5" /> 2. Categorias de Quartos
            </CardTitle>
            <CardDescription>
              Defina os diferenciais de custo para cada tipo de acomodação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{cat.units} un.</Badge>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span>Peso: {cat.weight}</span>
                    <span>Lav: R${cat.laundry}</span>
                    <span>Amen: R${cat.amenities}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-2 border-dashed rounded-lg">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="Suíte"
                />
              </div>
              <div className="space-y-1">
                <Label>Unidades</Label>
                <Input
                  type="number"
                  value={newCat.units}
                  onChange={(e) => setNewCat({ ...newCat, units: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Peso</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newCat.weight}
                  onChange={(e) => setNewCat({ ...newCat, weight: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Lavanderia/Diária</Label>
                <Input
                  type="number"
                  value={newCat.laundry}
                  onChange={(e) => setNewCat({ ...newCat, laundry: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Amenities/Hósp.</Label>
                <Input
                  type="number"
                  value={newCat.amenities}
                  onChange={(e) => setNewCat({ ...newCat, amenities: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Limpeza/Estadia</Label>
                <Input
                  type="number"
                  value={newCat.cleaning}
                  onChange={(e) => setNewCat({ ...newCat, cleaning: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Café/Pessoa</Label>
                <Input
                  type="number"
                  value={newCat.breakfast}
                  onChange={(e) => setNewCat({ ...newCat, breakfast: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-end">
                <Button size="sm" onClick={addCategory} className="w-full">
                  Adicionar
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              O peso determina como os custos fixos são rateados. Suítes (peso 2.0) recebem mais
              custo fixo que Standards (peso 1.0).
            </p>
          </CardContent>
        </Card>
      )}

      {step !== 2 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {STEPS[step - 1].num}. {STEPS[step - 1].label}
            </CardTitle>
            <CardDescription>Configure os dados desta etapa.</CardDescription>
          </CardHeader>
          <CardContent className="h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
            Etta será configurada na próxima versão.
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </Button>
        <Button
          onClick={() => setStep(Math.min(STEPS.length, step + 1))}
          disabled={step === STEPS.length}
          className="gap-2"
        >
          Próximo <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
