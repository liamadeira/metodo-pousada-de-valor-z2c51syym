import { useState } from 'react'
import useAppStore from '@/stores/use-app-store'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, BedDouble } from 'lucide-react'

export function CategoryManager() {
  const {
    currentPropertyId,
    roomCategories,
    addRoomCategory,
    updateRoomCategory,
    deleteRoomCategory,
  } = useAppStore()
  const propCategories = roomCategories.filter((c) => c.propertyId === currentPropertyId)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    unitCount: 1,
    weightFactor: 1,
    laundryCostPerDay: 0,
    amenitiesCostPerGuest: 0,
    cleaningCostPerStay: 0,
    breakfastCostPerPerson: 0,
  })

  const handleAdd = () => {
    if (!form.name) return
    addRoomCategory({
      propertyId: currentPropertyId,
      ...form,
      weightFactor: Number(form.weightFactor),
    })
    setForm({
      name: '',
      unitCount: 1,
      weightFactor: 1,
      laundryCostPerDay: 0,
      amenitiesCostPerGuest: 0,
      cleaningCostPerStay: 0,
      breakfastCostPerPerson: 0,
    })
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="w-5 h-5" /> Categorias de Quartos
          </CardTitle>
          <CardDescription>Defina custos específicos por tipo de acomodação.</CardDescription>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 border rounded-lg">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Unidades</Label>
              <Input
                type="number"
                value={form.unitCount}
                onChange={(e) => setForm({ ...form, unitCount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Peso (Rateio)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.weightFactor}
                onChange={(e) => setForm({ ...form, weightFactor: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Lavanderia/Diária</Label>
              <Input
                type="number"
                value={form.laundryCostPerDay}
                onChange={(e) => setForm({ ...form, laundryCostPerDay: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Amenities/Hóspede</Label>
              <Input
                type="number"
                value={form.amenitiesCostPerGuest}
                onChange={(e) =>
                  setForm({ ...form, amenitiesCostPerGuest: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Limpeza/Estadia</Label>
              <Input
                type="number"
                value={form.cleaningCostPerStay}
                onChange={(e) => setForm({ ...form, cleaningCostPerStay: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Café/Pessoa</Label>
              <Input
                type="number"
                value={form.breakfastCostPerPerson}
                onChange={(e) =>
                  setForm({ ...form, breakfastCostPerPerson: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex items-end">
              <Button size="sm" onClick={handleAdd} className="w-full">
                Adicionar
              </Button>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-center">Unidades</TableHead>
              <TableHead className="text-center">Peso</TableHead>
              <TableHead className="text-right">Lavanderia</TableHead>
              <TableHead className="text-right">Amenities</TableHead>
              <TableHead className="text-right">Limpeza</TableHead>
              <TableHead className="text-right">Café</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propCategories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-center">{cat.unitCount}</TableCell>
                <TableCell className="text-center">{cat.weightFactor.toFixed(1)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(cat.laundryCostPerDay)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(cat.amenitiesCostPerGuest)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(cat.cleaningCostPerStay)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(cat.breakfastCostPerPerson)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteRoomCategory(cat.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
