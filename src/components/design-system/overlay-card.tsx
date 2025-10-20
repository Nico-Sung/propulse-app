type OverlayCardProps = {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    widthClass?: string;
    onClick?: () => void;
    role?: string;
};

export function OverlayCard({
    title,
    subtitle,
    children,
    className = "",
    widthClass = "w-80",
    onClick,
    role,
}: OverlayCardProps) {
    return (
        <div className={`${widthClass} ${className}`.trim()} role={role}>
            <div
                className="bg-surface rounded-lg shadow-md border border-default p-4"
                onClick={onClick}
            >
                <div>
                    {title && (
                        <div className="font-semibold text-base">{title}</div>
                    )}
                    {subtitle && (
                        <div className="text-sm text-muted">{subtitle}</div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
