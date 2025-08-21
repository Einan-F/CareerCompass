import { cn } from "@/lib/utils"
import React, { ButtonHTMLAttributes, HTMLAttributes } from "react"

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("w-64 h-screen", className)} {...props} />
  );
}

export function SidebarContent({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("p-4 space-y-4", className)} {...props} />
  );
}

export function SidebarHeader({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("p-4 border-b", className)} {...props} />
  );
}

export function SidebarFooter({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("p-4 border-t mt-auto", className)} {...props} />
  );
}

export function SidebarMenu({ className, ...props }: SidebarProps) {
  return (
    <nav className={cn("space-y-2", className)} {...props} />
  );
}

export function SidebarGroup({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("space-y-4", className)} {...props} />
  );
}

export function SidebarGroupLabel({ className, ...props }: SidebarProps) {
  return (
    <h3 className={cn("text-sm font-semibold", className)} {...props} />
  );
}

export function SidebarGroupContent({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("space-y-2", className)} {...props} />
  );
}

export function SidebarMenuItem({ children, className, ...props }: SidebarProps & { children: React.ReactNode }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
}

export function SidebarMenuButton({ children, className, asChild = false, onClick }: SidebarMenuButtonProps) {
  if (asChild) {
    return (
      <div className={cn("w-full text-left", className)} onClick={onClick}>
        {children}
      </div>
    );
  }
  return (
    <button type="button" className={cn("w-full text-left", className)} onClick={onClick}>
      {children}
    </button>
  );
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {children}
    </div>
  );
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  return (
    <button
      type="button"
      className={cn("p-2 hover:bg-accent hover:text-accent-foreground rounded-md", className)}
      {...props}
    />
  );
}