"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { MenuItemInput } from "@/lib/types/database";

interface MenuItemFormProps {
  items: MenuItemInput[];
  onChange: (items: MenuItemInput[]) => void;
  onTranslate: () => void;
  translating: boolean;
}

export function MenuItemForm({
  items,
  onChange,
  onTranslate,
  translating,
}: MenuItemFormProps) {
  const updateItem = (index: number, field: keyof MenuItemInput, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = () => {
    onChange([
      ...items,
      { item_name: "", description_original: "", price: 0, tags: [] },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Menú</Label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" /> Agregar platillo
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onTranslate}
            disabled={translating || items.every((i) => !i.description_original)}
            className="bg-[#E85D04] hover:bg-[#E85D04]/90"
          >
            {translating ? "Traduciendo..." : "Traducir con IA"}
          </Button>
        </div>
      </div>

      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Platillo {index + 1}
            </span>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
          <Input
            placeholder="Nombre del platillo"
            value={item.item_name}
            onChange={(e) => updateItem(index, "item_name", e.target.value)}
          />
          <Textarea
            placeholder="Descripción en español"
            value={item.description_original}
            onChange={(e) =>
              updateItem(index, "description_original", e.target.value)
            }
          />
          {item.description_translated && (
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">EN:</p>
              <p className="text-sm">{item.description_translated}</p>
            </div>
          )}
          <Input
            type="number"
            placeholder="Precio (MXN)"
            value={item.price || ""}
            onChange={(e) =>
              updateItem(index, "price", parseFloat(e.target.value) || 0)
            }
          />
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
