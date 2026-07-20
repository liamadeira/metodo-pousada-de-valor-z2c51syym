import { useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import {
  calculateLaundryCostPerChange,
  calculateLaundryCostForStay,
} from '@/lib/laundry-calculations'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shirt } from 'lucide-react'

export function LaundryManager() {
  const { currentPropertyId, laundryPieces, laundryKits } = useAppStore()
  const propKits = laundryKits.filter((k) => k.propertyId === currentPropertyId)

  const kitCosts = useMemo(
    () =>
      propKits.map((kit) => ({
        kit,
        costPerChange: calculateLaundryCostPerChange(kit, laundryPieces),
        costFor3Nights: calculateLaundryCostForStay(kit, laundryPieces, 3),
        costFor5Nights: calculateLaundryCostForStay(kit, laundryPieces, 5),
        costFor7Nights: calculateLaundryCostForStay(kit, laundryPieces, 7),
      })),
    [propKits, laundryPieces],
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="w-5 h-5" /> Kit de Lavanderia
          </CardTitle>
          <CardDescription>Cálculo de custos por peça, peso, kit ou média.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kit</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-center">Troca a cada (noites)</TableHead>
                <TableHead className="text-right">Custo/Troca</TableHead>
                <TableHead className="text-right">3 noites</TableHead>
                <TableHead className="text-right">5 noites</TableHead>
                <TableHead className="text-right">7 noites</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kitCosts.map(
                ({ kit, costPerChange, costFor3Nights, costFor5Nights, costFor7Nights }) => (
                  <TableRow key={kit.id}>
                    <TableCell className="font-medium">{kit.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{kit.calculationMethod}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{kit.changeFrequencyNights}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(costPerChange)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(costFor3Nights)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(costFor5Nights)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(costFor7Nights)}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Peças</CardTitle>
          <CardDescription>Tabela de referência de custo por peça de roupa.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Peça</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Custo Unitário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laundryPieces.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.pieceType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(p.costPerUnit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
