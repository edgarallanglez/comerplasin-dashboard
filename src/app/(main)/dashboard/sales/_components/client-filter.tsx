"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Client {
    id: number
    nombre: string
}

interface ClientFilterProps {
    clients: Client[]
}

export function ClientFilter({ clients }: ClientFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [open, setOpen] = React.useState(false)

    // Get initial client from URL (check both 'cliente' and 'proveedor' params)
    const currentClientId = searchParams.get("cliente") || searchParams.get("proveedor")
    const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)

    // Update selected client if URL changes (or clients list updates)
    React.useEffect(() => {
        if (clients.length > 0 && currentClientId) {
            const found = clients.find(c => c.id.toString() === currentClientId)
            if (found) {
                setSelectedClient(found)
            }
        } else if (!currentClientId) {
            setSelectedClient(null)
        }
    }, [currentClientId, clients])

    const handleSelect = (client: Client) => {
        setSelectedClient(client)
        setOpen(false)

        const params = new URLSearchParams(searchParams.toString())

        // Determine which param to set based on what was already there or context
        const isPurchases = pathname.includes("compras") || searchParams.has("proveedor");

        if (isPurchases) {
            params.set("proveedor", client.id.toString())
            params.delete("cliente")
        } else {
            params.set("cliente", client.id.toString())
            params.delete("proveedor")
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedClient(null)
        const params = new URLSearchParams(searchParams.toString())
        params.delete("cliente")
        params.delete("proveedor")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between"
                >
                    {selectedClient ? (
                        <span className="truncate">{selectedClient.nombre}</span>
                    ) : (
                        "Filtrar por cliente..."
                    )}
                    {selectedClient ? (
                        <div
                            className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                            onClick={clearSelection}
                        >
                            ✕
                        </div>
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Buscar..."
                    />
                    <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.nombre}
                                    onSelect={() => handleSelect(client)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {client.nombre}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
