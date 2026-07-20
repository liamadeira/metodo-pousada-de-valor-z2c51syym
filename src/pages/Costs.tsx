import { useState } from 'react'
import useAppStore from '@/stores/use-app-store'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { LaundryManager } from '@/components/LaundryManager'
import { BreakfastManager } from '@/components/BreakfastManager'

export default function Costs() {
  const { currentPropertyId, fixedCosts, variableCosts, addFixedCost, addVariableCost } =
    useAppStore()
  const [showFixedForm, setShowFixedForm] = useState(false)
  const [showVarForm, setShowVarForm] = useState(false)
  const [fixedName, setFixedName] = useState('')
  const [fixedAmount, setFixedAmount] = useState(0)
  const [fixedCategory, setFixedCategory] = useState('')
  const [varName, setVarName] = useState('')
  const [varPerGuest, setVarPerGuest] = useState(0)
  const [varPerStay, setVarPerStay] = useState(0)

  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVar = variableCosts.filter((c) => c.propertyId === currentPropertyId)

  const handleAddFixed = () => {
    if (!fixedName) return
    addFixedCost({
      propertyId: currentPropertyId,
      name: fixedName,
      amount: fixedAmount,
      category: fixedCategory || 'Geral',
    })
    setFixedName('')
    setFixedAmount(0)
    setFixedCategory('')
    setShowFixedForm(false)
  }

  const handleAddVar = () => {
    if (!varName) return
    addVariableCost({
      propertyId: currentPropertyId,
      name: varName,
      amountPerGuest: varPerGuest,
      amountPerStay: varPerStay,
    })
    setVarName('')
    setVarPerGuest(0)
    setVarPerStay(0)
    setShowVarForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Custos</h1>
        <p className="text-muted-foreground">
          Despesas fixas, variáveis, lavanderia e café da manhã.
        </p>
      </div>

      <Tabs defaultValue="fixed" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex md:grid-cols-5">
          <TabsTrigger value="fixed">Fixos</TabsTrigger>
          <TabsTrigger value="variable">Variáveis</TabsTrigger>
          <TabsTrigger value="laundry">Lavanderia</TabsTrigger>
          <TabsTrigger value="breakfast">Café da Manhã</TabsTrigger>
          <TabsTrigger value="staff">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="fixed" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Custos Fixos Recorrentes</CardTitle>
                <CardDescription>Despesas independentes da ocupação.</CardDescription>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setShowFixedForm(!showFixedForm)}>
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              {showFixedForm && (
                <div className="flex gap-2 mb-4 p-4 border rounded-lg">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Nome"
                    value={fixedName}
                    onChange={(e) => setFixedName(e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 w-32"
                    type="number"
                    placeholder="Valor"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(Number(e.target.value))}
                  />
                  <input
                    className="border rounded px-2 py-1 w-40"
                    placeholder="Categoria"
                    value={fixedCategory}
                    onChange={(e) => setFixedCategory(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddFixed}>
                    OK
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propFixed.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={2}>Total Fixo</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(propFixed.reduce((s, c) => s + c.amount, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variable" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Custos Variáveis</CardTitle>
                <CardDescription>Despesas ligadas a hóspedes/estadias.</CardDescription>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setShowVarForm(!showVarForm)}>
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              {showVarForm && (
                <div className="flex gap-2 mb-4 p-4 border rounded-lg">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Nome"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1 w-32"
                    type="number"
                    placeholder="Por hóspede"
                    value={varPerGuest}
                    onChange={(e) => setVarPerGuest(Number(e.target.value))}
                  />
                  <input
                    className="border rounded px-2 py-1 w-32"
                    type="number"
                    placeholder="Por estadia"
                    value={varPerStay}
                    onChange={(e) => setVarPerStay(Number(e.target.value))}
                  />
                  <Button size="sm" onClick={handleAddVar}>
                    OK
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Por Hóspede</TableHead>
                    <TableHead className="text-right">Por Estadia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propVar.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(c.amountPerGuest)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(c.amountPerStay)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laundry" className="mt-6">
          <LaundryManager />
        </TabsContent>
        <TabsContent value="breakfast" className="mt-6">
          <BreakfastManager />
        </TabsContent>
        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Equipe (Em Breve)</CardTitle>
              <CardDescription>Módulo para cálculo de folha e rateio.</CardDescription>
            </CardHeader>
            <CardContent className="h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg m-6">
              Disponível na próxima versão.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
