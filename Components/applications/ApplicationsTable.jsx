import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Eye, ChevronDown } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  no_response: "bg-gray-100 text-gray-800 border-gray-200",
  auto_rejection: "bg-red-100 text-red-800 border-red-200",
  rejected_after_screening: "bg-red-100 text-red-800 border-red-200",
  rejected_after_interview: "bg-red-100 text-red-800 border-red-200",
  offer_received: "bg-green-100 text-green-800 border-green-200",
  offer_accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  offer_declined: "bg-orange-100 text-orange-800 border-orange-200"
};

const columnsConfig = [
    { id: 'company_name', label: 'Company' },
    { id: 'position_title', label: 'Position' },
    { id: 'application_date', label: 'Date Applied' },
    { id: 'status', label: 'Status' },
    { id: 'location', label: 'Location' },
    { id: 'cv_version_used', label: 'CV Used' },
    { id: 'actions', label: 'Actions' },
];

export default function ApplicationsTable({ data, onViewDetails, onEdit, onDelete }) {
  const [visibleColumns, setVisibleColumns] = useState({
    company_name: true,
    position_title: true,
    application_date: true,
    status: true,
    location: false,
    cv_version_used: false,
    actions: true,
  });

  return (
    <div className="premium-card p-4">
        <div className="flex justify-end mb-4">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                Columns <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {columnsConfig.filter(c => c.id !== 'actions').map((column) => (
                <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={visibleColumns[column.id]}
                    onCheckedChange={(value) =>
                        setVisibleColumns(prev => ({ ...prev, [column.id]: !!value }))
                    }
                >
                    {column.label}
                </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columnsConfig.filter(c => visibleColumns[c.id]).map(c => <TableHead key={c.id}>{c.label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((app) => (
            <TableRow key={app.id}>
              {visibleColumns.company_name && <TableCell className="font-medium">{app.company_name}</TableCell>}
              {visibleColumns.position_title && <TableCell>{app.position_title}</TableCell>}
              {visibleColumns.application_date && <TableCell>{format(new Date(app.application_date), 'MMM d, yyyy')}</TableCell>}
              {visibleColumns.status && <TableCell><Badge className={`${statusColors[app.status]} border`}>{app.status.replace(/_/g, ' ')}</Badge></TableCell>}
              {visibleColumns.location && <TableCell>{app.location || 'N/A'}</TableCell>}
              {visibleColumns.cv_version_used && <TableCell>{app.cv_version_used || 'N/A'}</TableCell>}
              {visibleColumns.actions && <TableCell>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewDetails(app)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(app)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(app.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}