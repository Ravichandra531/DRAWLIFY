import React from "react"

export function IconButton({
    icon,
    onClick,
    activated,
    label,
}: {
    icon: React.ReactNode
    onClick: () => void
    activated?: boolean
    label?: string
}) {
    return (
        <button
            title={label}
            onClick={onClick}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm
                ${activated
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/40"
                    : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
        >
            {icon}
            {label && <span className="hidden sm:inline">{label}</span>}
        </button>
    )
}