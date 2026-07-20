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
import { Plus, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function Costs() {
  const { currentPropertyId, fixedCosts, variableCosts, duplicateCostsFromLastMonth } =
    useAppStore()

  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVar = variableCosts.filter((c) => c.propertyId === currentPropertyId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Custos</h1>
          <p className="text-muted-foreground">Controle despesas fixas, variáveis e equipe.</p>
        </div>
        <Button variant="outline" onClick={duplicateCostsFromLastMonth} className="gap-2">
          <Copy className="w-4 h-4" />
          Copiar do Mês Anterior
        </Button>
      </div>

      <Tabs defaultValue="fixed" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="fixed">Custos Fixos</TabsTrigger>
          <TabsTrigger value="variable">Variáveis</TabsTrigger>
          <TabsTrigger value="staff">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="fixed" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Custos Fixos Recorrentes</CardTitle>
                <CardDescription>
                  Despesas que ocorrem independentemente da ocupação.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Despesa</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propFixed.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell className="font-medium">{cost.name}</TableCell>
                      <TableCell>{cost.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cost.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={2}>Total Fixo</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(propFixed.reduce((sum, c) => sum + c.amount, 0))}
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
                <CardDescription>
                  Despesas diretamente ligadas ao número de hóspedes ou estadias.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Custo por Hóspede</TableHead>
                    <TableHead className="text-right">Custo por Estadia (Quarto)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propVar.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell className="font-medium">{cost.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(cost.amountPerGuest)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(cost.amountPerStay)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custo de Hora Produtiva (Em Breve)</CardTitle>
              <CardDescription>
                Módulo avançado para cálculo de folha e rateio de camareiras.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg m-6">
              Módulo de Gestão de Equipe estará disponível na próxima versão.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
